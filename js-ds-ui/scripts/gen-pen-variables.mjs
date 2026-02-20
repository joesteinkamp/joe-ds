#!/usr/bin/env node
/**
 * gen-pen-variables.mjs
 * Reads the compiled tokens.json from the token build output and converts
 * all tokens into pen-variables.json in the Pencil.dev variable format.
 *
 * Run after `pnpm --filter @js-ds-ui/tokens build`.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKENS_PATH = resolve(__dirname, "../packages/tokens/dist/tokens.json");
const OUT = resolve(__dirname, "pen-variables.json");

// ── OKLCH to sRGB hex conversion ────────────────────────────────────
function oklchToHex(oklchStr) {
  const m = oklchStr.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!m) return null;
  const [, L, C, h] = m.map(Number);
  // OKLCH → OKLab
  const hRad = (h * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);
  // OKLab → linear sRGB (approximate via LMS)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;
  let r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let bv = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;
  // Gamma
  const gamma = (c) => (c >= 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c);
  r = Math.round(Math.max(0, Math.min(1, gamma(r))) * 255);
  g = Math.round(Math.max(0, Math.min(1, gamma(g))) * 255);
  bv = Math.round(Math.max(0, Math.min(1, gamma(bv))) * 255);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bv.toString(16).padStart(2, "0")}`.toUpperCase();
}

function remToPx(rem) {
  const m = String(rem).match(/([\d.]+)\s*rem/);
  return m ? Math.round(parseFloat(m[1]) * 16) : null;
}

function parseDimension(val) {
  // Handle calc() expressions — extract the base rem value
  const calcMatch = String(val).match(/calc\(\s*([\d.]+rem)/);
  if (calcMatch) return remToPx(calcMatch[1]);
  // Handle plain rem
  const px = remToPx(val);
  if (px !== null) return px;
  // Handle px values
  const pxMatch = String(val).match(/([\d.]+)\s*px/);
  if (pxMatch) return Math.round(parseFloat(pxMatch[1]));
  // Handle pure numbers (9999 for pill radius, etc.)
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

// ── Read tokens ─────────────────────────────────────────────────────
let tokens;
try {
  tokens = JSON.parse(readFileSync(TOKENS_PATH, "utf-8"));
} catch (err) {
  console.error(`Failed to read ${TOKENS_PATH}. Run token build first.`);
  console.error(err.message);
  process.exit(1);
}

// ── Convert to pen variables ────────────────────────────────────────
const vars = {};

for (const [name, token] of Object.entries(tokens)) {
  const { $value, $type } = token;

  if ($type === "color") {
    // Try OKLCH conversion first
    if (typeof $value === "string" && $value.startsWith("oklch(")) {
      const hex = oklchToHex($value);
      if (hex) {
        vars[name] = { type: "color", value: hex };
        continue;
      }
    }
    // Handle hex colors directly
    if (typeof $value === "string" && $value.startsWith("#")) {
      vars[name] = { type: "color", value: $value.toUpperCase() };
      continue;
    }
    // Handle transparent
    if ($value === "transparent") {
      vars[name] = { type: "color", value: "#00000000" };
      continue;
    }
    // Skip unresolvable color references
    continue;
  }

  if ($type === "dimension") {
    const px = parseDimension($value);
    if (px !== null) {
      vars[name] = { type: "number", value: px };
      continue;
    }
    continue;
  }

  if ($type === "number" || $type === "fontWeight") {
    const n = typeof $value === "number" ? $value : parseFloat($value);
    if (!isNaN(n)) {
      vars[name] = { type: "number", value: n };
      continue;
    }
    continue;
  }

  if ($type === "duration") {
    // Duration tokens are typically in ms
    const ms = parseInt(String($value).replace("ms", ""), 10);
    if (!isNaN(ms)) {
      vars[name] = { type: "number", value: ms };
      continue;
    }
    continue;
  }
}

// ── Write output ────────────────────────────────────────────────────
writeFileSync(OUT, JSON.stringify(vars, null, 2) + "\n");
console.log(`Wrote ${Object.keys(vars).length} variables to ${OUT}`);
