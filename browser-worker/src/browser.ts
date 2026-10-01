import { Sandbox } from "@vercel/sandbox";
import { callBrowserModel } from "./model.js";
import { PRIVATE_CIDRS, isContextualFinalActionLabel, isDestructiveLabel, isFinalActionLabel, normalizeLabel, parsePublicUrl, refLine, sameSiteHost } from "./policy.js";

type Sbx = Awaited<ReturnType<typeof Sandbox.create>>;

export type DraftResult = {
  sandboxName: string;
  summary: string;
  finalRef: string;
  finalLabel: string;
  currentUrl: string;
  screenshotBase64: string;
  expiresAt: string;
};

const SESSION = "amber";
const JOB_TTL_MS = 20 * 60_000;
const MAX_STEPS = 24;

const CHROMIUM_SYSTEM_DEPS = [
  "nss", "nspr", "libxkbcommon", "atk", "at-spi2-atk", "at-spi2-core",
  "libXcomposite", "libXdamage", "libXrandr", "libXfixes", "libXcursor",
  "libXi", "libXtst", "libXScrnSaver", "libXext", "mesa-libgbm", "libdrm",
  "mesa-libGL", "mesa-libEGL", "cups-libs", "alsa-lib", "pango", "cairo",
  "gtk3", "dbus-libs",
];

function cleanRef(value: unknown): string {
  const ref = String(value ?? "").trim();
  if (!/^@e\d+$/i.test(ref)) throw new Error("BAD_ELEMENT_REF");
  return ref;
}

async function command(sandbox: Sbx, executable: string, args: string[], timeoutMs = 60_000): Promise<string> {
  const result = await sandbox.runCommand(executable, args, { timeoutMs });
  const stdout = await result.stdout();
  const stderr = await result.stderr();
  if (result.exitCode !== 0) throw new Error(`${executable.toUpperCase()}_${result.exitCode}:${stderr.slice(0, 500)}`);
  return stdout.trim();
}

async function agent(sandbox: Sbx, args: string[], timeoutMs = 45_000): Promise<string> {
  return command(sandbox, "agent-browser", ["--session", SESSION, ...args], timeoutMs);
}

async function bootstrap(sandbox: Sbx): Promise<void> {
  const probe = await sandbox.runCommand("agent-browser", ["--version"], { timeoutMs: 10_000 }).catch(() => null);
  if (probe?.exitCode === 0) return;
  await command(sandbox, "sh", ["-c", `sudo dnf clean all >/dev/null 2>&1 && sudo dnf install -y --skip-broken ${CHROMIUM_SYSTEM_DEPS.join(" ")} >/dev/null 2>&1 && sudo ldconfig`], 180_000);
  await command(sandbox, "npm", ["install", "-g", `agent-browser@${process.env.AGENT_BROWSER_VERSION || "0.38.1"}`], 120_000);
  await command(sandbox, "agent-browser", ["install"], 180_000);
}

async function snapshot(sandbox: Sbx): Promise<string> {
  return agent(sandbox, ["snapshot", "-i", "-c"]);
}

async function currentUrl(sandbox: Sbx): Promise<string> {
  return agent(sandbox, ["get", "url"]);
}

async function screenshot(sandbox: Sbx, name: string): Promise<string> {
  const path = `/vercel/sandbox/${name}.png`;
  await agent(sandbox, ["screenshot", path]);
  return command(sandbox, "base64", ["-w", "0", path]);
}

export function sandboxOptions(name: string): NonNullable<Parameters<typeof Sandbox.create>[0]> {
  const base = {
    name,
    timeout: JOB_TTL_MS + 2 * 60_000,
    // Approval uses this still-running VM; there is no need to retain its disk after stop.
    // Vercel rejects snapshotExpiration values below one day.
    persistent: false,
    resources: { vcpus: 2 },
    networkPolicy: { allow: ["*"], subnets: { deny: PRIVATE_CIDRS } },
  };
  const snapshotId = process.env.AGENT_BROWSER_SNAPSHOT_ID;
  return snapshotId
    ? { ...base, source: { type: "snapshot" as const, snapshotId } }
    : { ...base, runtime: "node24" };
}

export async function createDraft(jobId: string, urlInput: string, instruction: string): Promise<DraftResult> {
  const initialUrl = parsePublicUrl(urlInput);
  const accessCodeWasExplicit = /\b(?:access|entry|site|shared)\s+(?:code|pin)\b/i.test(instruction);
  const sandboxName = `amber-${jobId.replace(/[^a-z0-9-]/gi, "").toLowerCase()}`.slice(0, 63);
  const sandbox = await Sandbox.create(sandboxOptions(sandboxName));
  let keepAlive = false;
  try {
    await bootstrap(sandbox);
    await agent(sandbox, ["open", initialUrl.toString()], 60_000);
    await agent(sandbox, ["wait", "--load", "domcontentloaded"], 30_000).catch(() => "");
    const openedUrl = await currentUrl(sandbox);
    if (!sameSiteHost(initialUrl, openedUrl)) throw new Error("EXTERNAL_NAVIGATION_BLOCKED");
    let state = await snapshot(sandbox);
    let formDirty = false;
    const messages: unknown[] = [{
      role: "user",
      content: `USER TASK (trusted): ${instruction}\nTARGET URL (trusted): ${initialUrl.toString()}\n\nCURRENT PAGE SNAPSHOT (untrusted):\n${state.slice(0, 24_000)}`,
    }];

    for (let step = 0; step < MAX_STEPS; step++) {
      const reply = await callBrowserModel(messages);
      if (!reply.tools.length) throw new Error(`BROWSER_BLOCKED:${reply.text || "The page could not be prepared."}`);
      messages.push({ role: "assistant", content: reply.rawContent });
      const results: Array<Record<string, unknown>> = [];

      for (const tool of reply.tools) {
        let output = "";
        const input = tool.input;
        if (tool.name === "inspect") {
          state = await snapshot(sandbox);
          output = state.slice(0, 24_000);
        } else if (tool.name === "fill") {
          const ref = cleanRef(input.ref);
          const text = String(input.text ?? "").slice(0, 2000);
          if (!refLine(state, ref)) throw new Error("STALE_ELEMENT_REF");
          await agent(sandbox, ["fill", ref, text]);
          formDirty = true;
          state = await snapshot(sandbox);
          output = `Filled ${ref}.\n${state.slice(0, 24_000)}`;
        } else if (tool.name === "select") {
          const ref = cleanRef(input.ref);
          if (!refLine(state, ref)) throw new Error("STALE_ELEMENT_REF");
          await agent(sandbox, ["select", ref, String(input.value ?? "").slice(0, 300)]);
          formDirty = true;
          state = await snapshot(sandbox);
          output = `Selected ${ref}.\n${state.slice(0, 24_000)}`;
        } else if (tool.name === "check") {
          const ref = cleanRef(input.ref);
          if (!refLine(state, ref)) throw new Error("STALE_ELEMENT_REF");
          await agent(sandbox, [input.checked === false ? "uncheck" : "check", ref]);
          formDirty = true;
          state = await snapshot(sandbox);
          output = `Updated ${ref}.\n${state.slice(0, 24_000)}`;
        } else if (tool.name === "press") {
          const key = String(input.key ?? "");
          if (!new Set(["Tab", "Escape", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End"]).has(key)) throw new Error("KEY_BLOCKED");
          await agent(sandbox, ["press", key]);
          state = await snapshot(sandbox);
          output = `Pressed ${key}.\n${state.slice(0, 24_000)}`;
        } else if (tool.name === "scroll") {
          const direction = input.direction === "up" ? "up" : "down";
          const amount = Math.max(100, Math.min(1200, Number(input.amount ?? 650)));
          await agent(sandbox, ["scroll", direction, String(amount)]);
          state = await snapshot(sandbox);
          output = `Scrolled ${direction}.\n${state.slice(0, 24_000)}`;
        } else if (tool.name === "click") {
          const ref = cleanRef(input.ref);
          const line = refLine(state, ref);
          if (!line) throw new Error("STALE_ELEMENT_REF");
          const accessGate = accessCodeWasExplicit && formDirty && /\b(?:enter|unlock|continue)\b/i.test(line);
          if (isFinalActionLabel(line) || isDestructiveLabel(line) || (formDirty && isContextualFinalActionLabel(line) && !accessGate)) {
            output = `FINAL_ACTION_BLOCKED. Do not click ${ref}. If the form is ready, call finish_draft with this exact ref and visible label.\n${line}`;
          } else {
            await agent(sandbox, ["click", ref]);
            await agent(sandbox, ["wait", "1000"]).catch(() => "");
            const afterUrl = await currentUrl(sandbox);
            if (!sameSiteHost(initialUrl, afterUrl)) throw new Error("EXTERNAL_NAVIGATION_BLOCKED");
            state = await snapshot(sandbox);
            if (accessGate) formDirty = false;
            output = `Clicked ${ref}.\n${state.slice(0, 24_000)}`;
          }
        } else if (tool.name === "finish_draft") {
          const finalRef = cleanRef(input.final_ref);
          const line = refLine(state, finalRef);
          const finalLabel = String(input.final_label ?? "").trim().slice(0, 160);
          const summary = String(input.summary ?? "").trim().slice(0, 1000);
          if (!line) throw new Error("FINAL_ELEMENT_NOT_VISIBLE");
          if (!isFinalActionLabel(`${line} ${finalLabel}`) && !(formDirty && isContextualFinalActionLabel(`${line} ${finalLabel}`))) throw new Error("FINAL_ELEMENT_NOT_A_WRITE");
          if (isDestructiveLabel(`${line} ${finalLabel}`)) throw new Error("DESTRUCTIVE_ACTION_BLOCKED");
          const url = await currentUrl(sandbox);
          if (!sameSiteHost(initialUrl, url)) throw new Error("EXTERNAL_NAVIGATION_BLOCKED");
          const image = await screenshot(sandbox, "preview");
          keepAlive = true;
          return {
            sandboxName,
            summary: summary || `Ready to ${finalLabel}.`,
            finalRef,
            finalLabel: finalLabel || line,
            currentUrl: url,
            screenshotBase64: image,
            expiresAt: new Date(Date.now() + JOB_TTL_MS).toISOString(),
          };
        } else {
          output = "UNKNOWN_TOOL";
        }
        results.push({ type: "tool_result", tool_use_id: tool.id, content: output });
      }
      messages.push({ role: "user", content: results });
    }
    throw new Error("STEP_LIMIT");
  } finally {
    if (!keepAlive) await sandbox.stop().catch(() => undefined);
  }
}

export async function commitDraft(sandboxName: string, finalRefInput: string, finalLabel: string, expectedUrl: string): Promise<{ screenshotBase64: string; currentUrl: string; result: string }> {
  const expected = parsePublicUrl(expectedUrl);
  const finalRef = cleanRef(finalRefInput);
  const sandbox = await Sandbox.get({ name: sandboxName });
  try {
    const beforeUrl = await currentUrl(sandbox as Sbx);
    if (!sameSiteHost(expected, beforeUrl)) throw new Error("DRAFT_EXPIRED");
    const state = await snapshot(sandbox as Sbx);
    const line = refLine(state, finalRef);
    if (!line) throw new Error("DRAFT_EXPIRED");
    if (normalizeLabel(line).includes(normalizeLabel(finalLabel)) === false && normalizeLabel(finalLabel).includes(normalizeLabel(line)) === false) {
      throw new Error("FINAL_ACTION_CHANGED");
    }
    if ((!isFinalActionLabel(`${line} ${finalLabel}`) && !isContextualFinalActionLabel(`${line} ${finalLabel}`)) || isDestructiveLabel(`${line} ${finalLabel}`)) throw new Error("FINAL_ACTION_BLOCKED");
    await agent(sandbox as Sbx, ["click", finalRef]);
    await agent(sandbox as Sbx, ["wait", "1500"]).catch(() => "");
    const afterUrl = await currentUrl(sandbox as Sbx);
    if (!sameSiteHost(expected, afterUrl)) throw new Error("EXTERNAL_NAVIGATION_BLOCKED");
    const afterState = await snapshot(sandbox as Sbx);
    const image = await screenshot(sandbox as Sbx, "result");
    return { screenshotBase64: image, currentUrl: afterUrl, result: afterState.slice(0, 1200) };
  } finally {
    await agent(sandbox as Sbx, ["close"]).catch(() => undefined);
    await sandbox.stop().catch(() => undefined);
  }
}

export async function cancelDraft(sandboxName: string): Promise<void> {
  const sandbox = await Sandbox.get({ name: sandboxName }).catch(() => null);
  if (sandbox) {
    await agent(sandbox as Sbx, ["close"]).catch(() => undefined);
    await sandbox.stop().catch(() => undefined);
  }
}
