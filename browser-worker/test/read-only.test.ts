import test from "node:test";
import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import { decodeEvidence, readRenderedDocument, READ_DOM } from "../src/read-only.js";

const url = "https://example.com/trip";
const page = { url, title: "Trip", text: "Monday 5 October: Clinic\nTuesday 6 October: Departure", datedSections: [{ date: "2026-10-05", text: "Clinic" }, { date: "2026-10-06", text: "Departure" }], truncated: false };

test("fixed DOM extractor preserves rendered dated sections and bounds output", () => {
  const document = { title: page.title, body: { innerText: page.text }, querySelectorAll: () => page.datedSections.map(s => ({ innerText: s.text, getClientRects: () => [1], getAttribute: (name: string) => name === "data-iso" ? s.date : null })) };
  const result = runInNewContext(READ_DOM, { document, location: { href: url } });
  assert.deepEqual(JSON.parse(JSON.stringify(result)), page);
  assert.doesNotMatch(READ_DOM, /fetch\(|\.click\(|\.submit\(|localStorage|cookie|textContent/);
});

test("rendered reader preserves date/activity evidence and never emits a write command", async () => {
  const calls: string[][] = [];
  const result = await readRenderedDocument(async args => {
    calls.push(args);
    return args[0] === "eval" ? JSON.stringify({ success: true, data: { result: page } }) : "ok";
  }, url);
  assert.deepEqual(result.datedSections, page.datedSections);
  assert.equal(result.text, page.text);
  assert.deepEqual(calls.map(args => args[0]), ["open", "wait", "wait", "eval"]);
  assert.equal(calls[3][1], READ_DOM);
  assert.equal(result.warning, "");
});

test("reader retains incomplete-load warning instead of inventing evidence", async () => {
  const result = await readRenderedDocument(async args => {
    if (args.includes("networkidle")) throw new Error("timeout");
    return args[0] === "eval" ? JSON.stringify(page) : "ok";
  }, url);
  assert.match(result.warning, /still be loading/);
});

test("reader rejects malformed, empty, private, and off-site evidence", async () => {
  assert.throws(() => decodeEvidence("{}", new URL(url)), /READ_BAD_EVIDENCE/);
  assert.throws(() => decodeEvidence(JSON.stringify({ ...page, text: "" }), new URL(url)), /READ_EMPTY_PAGE/);
  assert.throws(() => decodeEvidence(JSON.stringify({ ...page, url: "https://evil.example" }), new URL(url)), /EXTERNAL_NAVIGATION_BLOCKED/);
  let called = false;
  await assert.rejects(readRenderedDocument(async () => { called = true; return ""; }, "http://127.0.0.1"), /URL_HOST_BLOCKED/);
  assert.equal(called, false);
});

test("reader supports JSON-string eval results and marks truncation", () => {
  const result = decodeEvidence(JSON.stringify({ success: true, data: { result: JSON.stringify({ ...page, text: "a".repeat(49000) }) } }), new URL(url));
  assert.equal(result.text.length, 48000);
  assert.equal(result.truncated, true);
});
