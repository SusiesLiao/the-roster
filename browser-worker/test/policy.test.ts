import test from "node:test";
import assert from "node:assert/strict";
import { assertPermittedTask, isContextualFinalActionLabel, isDestructiveLabel, isFinalActionLabel, normalizeLabel, parsePublicUrl, refLine, sameSiteHost } from "../src/policy.js";

test("public URL policy blocks credentials and private targets", () => {
  assert.equal(parsePublicUrl("https://example.com/a").hostname, "example.com");
  for (const url of ["file:///etc/passwd", "http://localhost/a", "http://127.0.0.1", "http://10.0.0.2", "https://user:pass@example.com"]) {
    assert.throws(() => parsePublicUrl(url));
  }
});

test("browser stays on the initial host with www normalization", () => {
  const initial = new URL("https://www.example.com/edit");
  assert.equal(sameSiteHost(initial, "https://example.com/save"), true);
  assert.equal(sameSiteHost(initial, "https://evil.example.net"), false);
});

test("write labels are recognized and destructive tasks are refused", () => {
  assert.equal(isFinalActionLabel('button "Save changes" [@e12]'), true);
  assert.equal(isFinalActionLabel('button "Edit" [@e2]'), false);
  assert.equal(isContextualFinalActionLabel('button "Add activity" [@e3]'), true);
  assert.equal(isContextualFinalActionLabel('button "Continue" [@e5]'), true);
  assert.equal(isDestructiveLabel('button "Sign in" [@e4]'), true);
  assert.equal(assertPermittedTask("change the museum address"), "change the museum address");
  assert.throws(() => assertPermittedTask("buy these concert tickets"));
});

test("element refs and labels compare stably", () => {
  const snap = 'textbox "Lunch" [@e4]\nbutton "Save changes" [@e9]';
  assert.equal(refLine(snap, "@e9"), 'button "Save changes" [@e9]');
  assert.equal(normalizeLabel('button "Save changes" [@e9]'), "button save changes e9");
});
