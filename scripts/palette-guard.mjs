#!/usr/bin/env node
/* PALETTE GUARD — Susan's rule, enforced by the build instead of by memory.
 *
 * THE RULE (locked 2026-08-30): no saturated colour, ever. It had been a
 * preference restated every few weeks and re-broken every few weeks — the deep
 * navy on the buttons was a 40%-saturation blue that read as navy rather than
 * as grey, and nothing in the repo could tell. A preference nobody can check is
 * a preference that drifts. This can check.
 *
 * Two thresholds, because saturation reads differently at different lightness:
 *
 *   1. Nothing above S 55%.        Vivid is vivid at any lightness.
 *   2. Below L 32%, nothing above S 35%.  A dark colour carrying real
 *      saturation reads as navy / bottle green / oxblood. Muted darks have to
 *      be grey with a hint of hue, not hue with the lights off.
 *
 *      WHERE 35 CAME FROM. It is not a guess — the first two were, and both
 *      were too tight: 22 rejected Benjamin Moore Gentleman's Gray (S24), 28
 *      rejected the charcoal blue Susan actually picked (S31). So the line is
 *      set from her two real data points instead:
 *
 *          ACCEPTED  Gentleman's Gray  S24 at L27   <- --emphasis, shipped
 *          ACCEPTED  charcoal blue     S31 at L26   <- also picked, not kept
 *          REJECTED  plain charcoal    S13 at L21   <- not blue ENOUGH
 *          REJECTED  the old navy      S40 at L16
 *
 *      Note the shape of that list: the rejections run in BOTH directions.
 *      S13 was thrown out for having too little blue, S40 for too much. This
 *      rule only ever catches the top end, so the bottom end stays a matter of
 *      taste — which is correct. A guard can stop a colour being garish. It
 *      cannot stop one being dull.
 *
 *      35 sits between them with room on both sides. If a future colour is
 *      rejected that shouldn't be, move the line — and write the new data point
 *      here, so the rule keeps being derived from judgements actually made
 *      rather than from someone's idea of muted.
 *
 * The palette that passes today: aged gold (S48), clay (S35), powder (S31),
 * moss (S15), and --emphasis, the deep grey-blue that replaced the navy.
 * (Hexes deliberately not quoted here — see the note in styles.css.)
 *
 * ESCAPE HATCH: put the hex in ALLOW below with a reason. There is deliberately
 * no inline-comment override — an exception should cost a line in this file, so
 * that the list of exceptions is one place you can read.
 *
 * Runs as `prebuild`, so it gates Vercel too, not just a local build.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const MAX_S = 55;
const DARK_L = 32;
const DARK_MAX_S = 35;

/** hex -> reason it is allowed to break the rule. Keep this list short. */
const ALLOW = {};

const EXTS = new Set(['.css', '.js', '.jsx', '.ts', '.tsx', '.html', '.svg']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXTS.has(extname(p))) out.push(p);
  }
  return out;
}

function hsl(hex) {
  const n = hex.length === 4
    ? hex.slice(1).split('').map((c) => parseInt(c + c, 16))
    : [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [r, g, b] = n.map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return { s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  return { s: s * 100, l: l * 100 };
}

const bad = [];
for (const file of walk('src').concat(walk('scripts'))) {
  const text = readFileSync(file, 'utf8');
  text.split('\n').forEach((line, i) => {
    for (const m of line.matchAll(/#[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{3}\b/g)) {
      const hex = m[0].toUpperCase();
      if (hex in ALLOW) continue;
      const { s, l } = hsl(hex);
      const over = s > MAX_S
        ? `S ${s.toFixed(0)}% > ${MAX_S}%`
        : l < DARK_L && s > DARK_MAX_S
          ? `S ${s.toFixed(0)}% > ${DARK_MAX_S}% at L ${l.toFixed(0)}% — this reads as navy, not grey`
          : null;
      if (over) bad.push(`  ${file}:${i + 1}  ${hex}  ${over}`);
    }
  });
}

if (bad.length) {
  console.error('\n  Palette guard: saturated colour in the build.\n');
  console.error([...new Set(bad)].join('\n'));
  console.error('\n  Desaturate it, or add the hex to ALLOW in scripts/palette-guard.mjs with a reason.\n');
  process.exit(1);
}
console.log(`palette guard: clean (S<=${MAX_S}%, and S<=${DARK_MAX_S}% below L${DARK_L}%)`);

