import { isIP } from "node:net";

const BLOCKED_HOSTS = new Set([
  "localhost",
  "metadata.google.internal",
  "metadata.google.com",
  "169.254.169.254",
]);

const PRIVATE_V4 = [
  /^0\./,
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.0\.0\./,
  /^192\.0\.2\./,
  /^192\.168\./,
  /^198\.18\./,
  /^198\.51\.100\./,
  /^203\.0\.113\./,
  /^(22[4-9]|23\d)\./,
  /^(24\d|25[0-5])\./,
];

export const PRIVATE_CIDRS = [
  "0.0.0.0/8", "10.0.0.0/8", "100.64.0.0/10", "127.0.0.0/8",
  "169.254.0.0/16", "172.16.0.0/12", "192.0.0.0/24", "192.0.2.0/24",
  "192.168.0.0/16", "198.18.0.0/15", "198.51.100.0/24", "203.0.113.0/24",
  "224.0.0.0/4", "240.0.0.0/4", "::/128", "::1/128", "fc00::/7",
  "fe80::/10", "ff00::/8", "2001:db8::/32",
];

export function parsePublicUrl(input: unknown): URL {
  const raw = String(input ?? "").trim();
  if (!raw || raw.length > 2048) throw new Error("URL_INVALID");
  let url: URL;
  try { url = new URL(raw); } catch { throw new Error("URL_INVALID"); }
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("URL_PROTOCOL_BLOCKED");
  if (url.username || url.password) throw new Error("URL_CREDENTIALS_BLOCKED");
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  if (!host || BLOCKED_HOSTS.has(host) || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
    throw new Error("URL_HOST_BLOCKED");
  }
  const ipVersion = isIP(host);
  if (ipVersion === 4 && PRIVATE_V4.some((re) => re.test(host))) throw new Error("URL_HOST_BLOCKED");
  if (ipVersion === 6 && (host === "::1" || host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe8") || host.startsWith("fe9") || host.startsWith("fea") || host.startsWith("feb"))) {
    throw new Error("URL_HOST_BLOCKED");
  }
  return url;
}

export function sameSiteHost(initial: URL, currentInput: string): boolean {
  let current: URL;
  try { current = parsePublicUrl(currentInput); } catch { return false; }
  const a = initial.hostname.toLowerCase().replace(/^www\./, "");
  const b = current.hostname.toLowerCase().replace(/^www\./, "");
  return a === b;
}

const HARD_BLOCKED_TASK = /\b(?:buy|purchase|checkout|place (?:the )?order|pay|payment|bank|wire|transfer money|crypto|stock|trade|bet|gambl|delete (?:my |the )?account|close (?:my |the )?account|change (?:my )?password|reset (?:my )?password|medical diagnosis|prescription)\b/i;

export function assertPermittedTask(instruction: unknown): string {
  const task = String(instruction ?? "").trim();
  if (!task || task.length > 2000) throw new Error("TASK_INVALID");
  if (HARD_BLOCKED_TASK.test(task)) throw new Error("TASK_NOT_SUPPORTED");
  return task;
}

const FINAL_ACTION = /\b(?:save|submit|send|publish|post|confirm|book|reserve|register|sign up|create account|update|apply|delete|remove|cancel|unsubscribe|pay|buy|purchase|order|finish|complete|done)\b/i;
const CONTEXTUAL_FINAL_ACTION = /\b(?:add|create|upload|join|next|continue|enter|unlock)\b/i;
const DESTRUCTIVE = /\b(?:delete|remove|cancel|unsubscribe|close account|erase|deactivate|revoke|pay|buy|purchase|order|log in|login|sign in|oauth)\b/i;

export function isFinalActionLabel(label: string): boolean {
  return FINAL_ACTION.test(label.replace(/[_-]+/g, " "));
}

export function isContextualFinalActionLabel(label: string): boolean {
  return CONTEXTUAL_FINAL_ACTION.test(label.replace(/[_-]+/g, " "));
}

export function isDestructiveLabel(label: string): boolean {
  return DESTRUCTIVE.test(label.replace(/[_-]+/g, " "));
}

export function normalizeLabel(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 160);
}

export function refLine(snapshot: string, ref: string): string | null {
  const needle = ref.startsWith("@") ? ref : `@${ref}`;
  return snapshot.split("\n").find((line) => line.includes(needle))?.trim() ?? null;
}
