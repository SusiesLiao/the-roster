import { timingSafeEqual, createHash } from "node:crypto";
import { cancelDraft, commitDraft, createDraft, readPage } from "../src/browser.js";
import { assertPermittedTask, parsePublicUrl } from "../src/policy.js";

export const maxDuration = 300;

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { "cache-control": "no-store" } });
}

function authorized(request: Request): boolean {
  const expected = process.env.ROSTER_BROWSER_WORKER_SECRET || "";
  const supplied = request.headers.get("x-roster-browser-secret") || "";
  if (!expected || !supplied) return false;
  const a = createHash("sha256").update(expected).digest();
  const b = createHash("sha256").update(supplied).digest();
  return timingSafeEqual(a, b);
}

async function handler(request: Request): Promise<Response> {
  if (request.method === "GET") return json({ ok: true, service: "roster-browser-worker", mode: "draft-confirm-commit", reader: "rendered-dom-v1" });
  if (request.method !== "POST") return json({ error: "METHOD_NOT_ALLOWED" }, 405);
  if (!authorized(request)) return json({ error: "UNAUTHORIZED" }, 401);
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return json({ error: "BAD_JSON" }, 400);
  const action = String(body.action ?? "");
  try {
    if (action === "read") {
      const url = parsePublicUrl(body.url).toString();
      return json({ ok: true, evidence: await readPage(url) });
    }
    if (action === "draft") {
      const jobId = String(body.jobId ?? "");
      if (!/^[0-9a-f-]{36}$/i.test(jobId)) return json({ error: "JOB_ID_INVALID" }, 400);
      const url = parsePublicUrl(body.url).toString();
      const instruction = assertPermittedTask(body.instruction);
      return json({ ok: true, ...(await createDraft(jobId, url, instruction)) });
    }
    if (action === "commit") {
      const sandboxName = String(body.sandboxName ?? "");
      if (!/^amber-[a-z0-9-]{20,63}$/.test(sandboxName)) return json({ error: "SANDBOX_INVALID" }, 400);
      const result = await commitDraft(sandboxName, String(body.finalRef ?? ""), String(body.finalLabel ?? ""), String(body.expectedUrl ?? ""));
      return json({ ok: true, ...result });
    }
    if (action === "cancel") {
      const sandboxName = String(body.sandboxName ?? "");
      if (/^amber-[a-z0-9-]{20,63}$/.test(sandboxName)) await cancelDraft(sandboxName);
      return json({ ok: true });
    }
    return json({ error: "ACTION_INVALID" }, 400);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("browser_worker_error", action, message.slice(0, 500));
    const status = /(?:URL_|TASK_|BLOCKED|INVALID|DESTRUCTIVE)/.test(message) ? 400 : 500;
    return json({ error: message.slice(0, 500) }, status);
  }
}

// Named HTTP exports opt into Vercel's Web Request/Response adapter. A default
// function is treated as a Node req/res handler and returning Response there
// does not end the HTTP response (even GET health checks time out).
export const GET = handler;
export const POST = handler;
