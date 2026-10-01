import test from "node:test";
import assert from "node:assert/strict";
import { GET, POST } from "../api/browser.js";

test("health endpoint is cache-safe and exposes no configuration", async () => {
  const response = await GET(new Request("https://worker.test/api/browser"));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), { ok: true, service: "roster-browser-worker", mode: "draft-confirm-commit", reader: "rendered-dom-v1" });
});

test("mutating requests require the shared worker secret", async () => {
  process.env.ROSTER_BROWSER_WORKER_SECRET = "unit-test-secret";
  const missing = await POST(new Request("https://worker.test/api/browser", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action: "cancel", sandboxName: "amber-12345678901234567890" }),
  }));
  assert.equal(missing.status, 401);

  const wrong = await POST(new Request("https://worker.test/api/browser", {
    method: "POST",
    headers: { "content-type": "application/json", "x-roster-browser-secret": "wrong" },
    body: JSON.stringify({ action: "cancel", sandboxName: "amber-12345678901234567890" }),
  }));
  assert.equal(wrong.status, 401);
});

test("rendered reads also require authentication and reject private URLs before launch", async () => {
  process.env.ROSTER_BROWSER_WORKER_SECRET = "unit-test-secret";
  const request = (secret: string, url: string) => new Request("https://worker.test/api/browser", {
    method: "POST", headers: { "content-type": "application/json", "x-roster-browser-secret": secret },
    body: JSON.stringify({ action: "read", url }),
  });
  assert.equal((await POST(request("", "https://example.com"))).status, 401);
  const blocked = await POST(request("unit-test-secret", "http://127.0.0.1"));
  assert.equal(blocked.status, 400);
  assert.deepEqual(await blocked.json(), { error: "URL_HOST_BLOCKED" });
});
