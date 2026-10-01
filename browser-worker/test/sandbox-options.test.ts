import test from "node:test";
import assert from "node:assert/strict";
import { sandboxOptions } from "../src/browser.js";

test("browser drafts keep a live VM without retaining disk snapshots", () => {
  const options = sandboxOptions("amber-test");
  assert.equal(options.name, "amber-test");
  assert.equal(options.persistent, false);
  assert.equal(options.snapshotExpiration, undefined);
  assert.equal(options.timeout, 22 * 60_000);
  assert.ok(options.networkPolicy);
});
