import test from "node:test";
import assert from "node:assert/strict";
import { GET, POST } from "../api/browser.js";

test("health endpoint is cache-safe and exposes no configuration", async () => {
  const response = await GET(new Request("https://worker.test/api/browser"));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), { ok: true, service: "roster-browser-worker", mode: "draft-confirm-commit" });
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
