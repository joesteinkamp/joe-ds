import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOKENS_ROOT = path.resolve(__dirname, '../src');
const TOKEN_TIERS = ['primitives', 'semantic', 'component'];
const REF_RE = /\{([^}]+)\}/g;
const THEMES = ['dark', 'high-contrast'];

async function listJsonFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return listJsonFiles(fullPath);
      if (entry.isFile() && entry.name.endsWith('.json')) return [fullPath];
      return [];
    })
  );
  return files.flat().sort();
}

function isToken(node) {
  return !!node && typeof node === 'object' && !Array.isArray(node) && '$value' in node;
}

function flattenTokens(node, currentPath, filePath, out) {
  if (!node || typeof node !== 'object') return;

  if (isToken(node)) {
    out.push({
      path: currentPath.join('.'),
      value: node.$value,
      file: filePath,
      extensions: typeof node.$extensions === 'object' && node.$extensions !== null ? node.$extensions : undefined,
    });
    return;
  }

  if (Array.isArray(node)) return;

  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    flattenTokens(child, [...currentPath, key], filePath, out);
  }
}

function extractReferences(value) {
  if (typeof value !== 'string') return [];
  return [...value.matchAll(REF_RE)].map((match) => match[1]);
}

function readThemeOverride(token, theme) {
  const themeExtensions = token.extensions?.theme;
  if (!themeExtensions || typeof themeExtensions !== 'object' || Array.isArray(themeExtensions)) {
    return undefined;
  }
  return themeExtensions[theme];
}

function parseColor(value) {
  const hexMatch = value.match(/^#([0-9a-f]{6})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }

  const rgbMatch = value.match(/^rgb\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)\s*\)$/i);
  if (rgbMatch) {
    return [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])];
  }

  const oklchMatch = value.match(/^oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)$/i);
  if (!oklchMatch) return null;

  const L = Number(oklchMatch[1]);
  const C = Number(oklchMatch[2]);
  const H = Number(oklchMatch[3]);

  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const rLin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  const gamma = (c) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

  return [
    Math.round(Math.max(0, Math.min(1, gamma(rLin))) * 255),
    Math.round(Math.max(0, Math.min(1, gamma(gLin))) * 255),
    Math.round(Math.max(0, Math.min(1, gamma(bLin))) * 255),
  ];
}

function relativeLuminance([r, g, b]) {
  const linearize = (value) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const rl = linearize(r);
  const gl = linearize(g);
  const bl = linearize(b);
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

function contrastRatio(foreground, background) {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function resolveTokenColor(tokensByPath, tokenPath, theme, seen = new Set()) {
  if (seen.has(tokenPath)) return null;
  seen.add(tokenPath);

  const token = tokensByPath.get(tokenPath);
  if (!token) return null;

  const maybeThemeValue = readThemeOverride(token, theme);
  const value = maybeThemeValue ?? token.value;
  if (typeof value !== 'string') return null;

  const refs = extractReferences(value);
  if (refs.length === 1 && value.trim() === `{${refs[0]}}`) {
    return resolveTokenColor(tokensByPath, refs[0], theme, seen);
  }

  return value;
}

async function main() {
  const allTokens = [];

  for (const tier of TOKEN_TIERS) {
    const tierPath = path.join(TOKENS_ROOT, tier);
    const files = await listJsonFiles(tierPath);
    for (const filePath of files) {
      const json = JSON.parse(await fs.readFile(filePath, 'utf-8'));
      flattenTokens(json, [], filePath, allTokens);
    }
  }

  const errors = [];
  const warnings = [];

  const tokensByPath = new Map();
  for (const token of allTokens) {
    if (tokensByPath.has(token.path)) {
      errors.push(
        `Duplicate token path "${token.path}" in ${token.file} and ${tokensByPath.get(token.path).file}`
      );
    }
    tokensByPath.set(token.path, token);
  }

  for (const token of allTokens) {
    for (const ref of extractReferences(token.value)) {
      if (!tokensByPath.has(ref)) {
        errors.push(`Missing reference "{${ref}}" in token "${token.path}" (${token.file})`);
      }
    }

    const themeExtensions = token.extensions?.theme;
    if (themeExtensions && typeof themeExtensions === 'object' && !Array.isArray(themeExtensions)) {
      for (const [themeName, value] of Object.entries(themeExtensions)) {
        for (const ref of extractReferences(value)) {
          if (!tokensByPath.has(ref)) {
            errors.push(
              `Missing theme reference "{${ref}}" in token "${token.path}" theme "${themeName}" (${token.file})`
            );
          }
        }
      }
    }

    if (token.path.startsWith('color.') && token.file.includes(`${path.sep}semantic${path.sep}`)) {
      const themeExt = token.extensions?.theme;
      for (const theme of THEMES) {
        if (!themeExt || typeof themeExt !== 'object' || !(theme in themeExt)) {
          errors.push(`Semantic color token "${token.path}" is missing required "${theme}" override`);
        }
      }
    }
  }

  const graph = new Map();
  for (const token of allTokens) {
    graph.set(token.path, extractReferences(token.value));
  }

  const visiting = new Set();
  const visited = new Set();
  function dfs(node, stack) {
    if (visiting.has(node)) {
      const idx = stack.indexOf(node);
      const cycle = [...stack.slice(idx), node].join(' -> ');
      errors.push(`Reference cycle detected: ${cycle}`);
      return;
    }
    if (visited.has(node)) return;
    visiting.add(node);
    for (const next of graph.get(node) ?? []) {
      dfs(next, [...stack, node]);
    }
    visiting.delete(node);
    visited.add(node);
  }
  for (const tokenPath of graph.keys()) {
    dfs(tokenPath, []);
  }

  const contrastPairs = [
    ['color.text.primary', 'color.background.primary'],
    ['color.text.secondary', 'color.background.primary'],
  ];
  const minContrast = 4.5;
  for (const theme of ['light', 'dark', 'high-contrast']) {
    for (const [foregroundPath, backgroundPath] of contrastPairs) {
      const fgRaw = resolveTokenColor(tokensByPath, foregroundPath, theme);
      const bgRaw = resolveTokenColor(tokensByPath, backgroundPath, theme);
      if (!fgRaw || !bgRaw) {
        warnings.push(`Unable to resolve ${foregroundPath}/${backgroundPath} for theme "${theme}"`);
        continue;
      }
      const fg = parseColor(fgRaw);
      const bg = parseColor(bgRaw);
      if (!fg || !bg) {
        warnings.push(
          `Unable to parse colors for contrast check (${foregroundPath}: ${fgRaw}, ${backgroundPath}: ${bgRaw})`
        );
        continue;
      }
      const ratio = contrastRatio(fg, bg);
      if (ratio < minContrast) {
        errors.push(
          `Contrast ${theme} ${foregroundPath} on ${backgroundPath} is ${ratio.toFixed(2)}:1 (< ${minContrast}:1)`
        );
      }
    }
  }

  if (warnings.length) {
    console.warn(`\n[contracts] warnings (${warnings.length})`);
    for (const warning of warnings) {
      console.warn(`- ${warning}`);
    }
  }

  if (errors.length) {
    console.error(`\n[contracts] failed (${errors.length})`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`[contracts] ok (${allTokens.length} tokens checked)`);
}

main().catch((error) => {
  console.error('[contracts] failed with exception');
  console.error(error);
  process.exit(1);
});
