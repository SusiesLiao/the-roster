import { parsePublicUrl, sameSiteHost } from "./policy.js";

export type PageEvidence = {
  url: string;
  title: string;
  text: string;
  datedSections: Array<{ date: string; text: string }>;
  truncated: boolean;
  observedAt: string;
  warning: string;
};

// Fixed DOM-only expression. Neither the caller nor a model can supply browser code.
// innerText excludes script/style sources, unlike textContent.
export const READ_DOM = `(() => {
  const text = document.body ? document.body.innerText : '';
  const nodes = Array.from(document.querySelectorAll('[data-iso], [data-date], time[datetime]')).filter(el => el.getClientRects().length > 0);
  let remaining = 16000;
  const datedSections = nodes.slice(0, 80).map(el => {
    const sectionText = (el.innerText || '').slice(0, Math.max(0, Math.min(6000, remaining)));
    remaining -= sectionText.length;
    return {
    date: el.getAttribute('data-iso') || el.getAttribute('data-date') || el.getAttribute('datetime') || '',
    text: sectionText
  }; });
  return { url: location.href, title: document.title, text: text.slice(0, 48000), datedSections,
    truncated: text.length > 48000 || nodes.length > 80 || remaining <= 0 || nodes.some(el => (el.innerText || '').length > 6000) };
})()`;

type AgentCommand = (args: string[], timeoutMs?: number) => Promise<string>;

export function decodeEvidence(raw: string, expectedUrl: URL): Omit<PageEvidence, "observedAt" | "warning"> {
  let value = JSON.parse(raw);
  if (value?.success === false) throw new Error("READ_BROWSER_COMMAND_FAILED");
  // agent-browser --json wraps eval in data.result; support raw CLI results as well.
  value = value?.data?.result ?? value;
  if (typeof value === "string") value = JSON.parse(value);
  if (!value || typeof value.text !== "string" || typeof value.url !== "string") throw new Error("READ_BAD_EVIDENCE");
  if (!sameSiteHost(expectedUrl, value.url)) throw new Error("EXTERNAL_NAVIGATION_BLOCKED");
  if (!value.text.trim()) throw new Error("READ_EMPTY_PAGE");
  return {
    url: value.url,
    title: String(value.title ?? "").slice(0, 500),
    text: value.text.slice(0, 48000),
    datedSections: Array.isArray(value.datedSections) ? value.datedSections.slice(0, 80).map((s: { date?: unknown; text?: unknown }) => ({ date: String(s.date ?? "").slice(0, 100), text: String(s.text ?? "").slice(0, 6000) })) : [],
    truncated: Boolean(value.truncated) || value.text.length > 48000,
  };
}

export async function readRenderedDocument(run: AgentCommand, urlInput: string): Promise<PageEvidence> {
  const url = parsePublicUrl(urlInput);
  // No model, clicks, forms, credentials, scripts from the caller, or saved sessions.
  await run(["open", url.toString()], 60_000);
  await run(["wait", "--load", "domcontentloaded"], 30_000);
  let warning = "";
  await run(["wait", "--load", "networkidle"], 12_000).catch(() => {
    warning = "The page did not become network-idle; content may still be loading.";
  });
  const evidence = decodeEvidence(await run(["eval", READ_DOM, "--json"], 20_000), url);
  if (/\b(?:loading[.…]|offline\b|couldn.t (?:load|sync)|failed to (?:load|fetch)|verify you are human|checking your browser|sign in to (?:continue|view))/i.test(evidence.text)) {
    warning += " The visible page contains a loading, access, or error notice. Do not treat missing content as absent from the source.";
  }
  return { ...evidence, observedAt: new Date().toISOString(), warning: warning.trim() };
}
