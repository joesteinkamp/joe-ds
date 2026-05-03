#!/usr/bin/env bun
/**
 * build-tokens
 *
 * Reads:
 *   - tokens/design.json       (DTCG export from DESIGN.md)
 *   - packages/ui/src/components/<name>/<name>.tokens.json
 *
 * Emits:
 *   - packages/ui/src/styles/tokens.css
 *
 * Layout in tokens.css:
 *   :root         primitives + semantic (light) + component tokens (light)
 *   .dark         semantic (dark) + component tokens (dark)
 *
 * Dark theme is derived from the light theme by mapping the neutral semantic
 * tokens to the inverted ramp step. Component tokens that alias semantic
 * tokens automatically inherit dark behavior via the CSS variable system.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { Glob } from 'bun';

const ROOT = resolve(import.meta.dir, '../..');
const DESIGN_JSON = resolve(ROOT, 'tokens/design.json');
const COMPONENTS_GLOB = 'packages/ui/src/components/**/*.tokens.json';
const OUT = resolve(ROOT, 'packages/ui/src/styles/tokens.css');

type DtcgValue =
  | string
  | number
  | {
      hex?: string;
      components?: number[];
      alpha?: number;
      colorSpace?: string;
      value?: number;
      unit?: string;
    };

interface DtcgNode {
  $type?: string;
  $value?: DtcgValue;
  $description?: string;
  [key: string]: DtcgNode | DtcgValue | string | undefined;
}

function readJSON<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}

function flattenDtcg(node: DtcgNode, prefix: string[] = []): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (child && typeof child === 'object' && '$value' in child) {
      const val = (child as { $value: DtcgValue }).$value;
      out[[...prefix, key].join('-')] = renderValue(val);
    } else if (child && typeof child === 'object') {
      Object.assign(out, flattenDtcg(child as DtcgNode, [...prefix, key]));
    }
  }
  return out;
}

function renderValue(v: DtcgValue): string {
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (typeof v === 'object' && v) {
    if (typeof v.hex === 'string') return v.hex;
    if (Array.isArray(v.components)) {
      const [r, g, b] = v.components;
      const a = typeof v.alpha === 'number' ? v.alpha : 1;
      return `rgb(${Math.round((r ?? 0) * 255)} ${Math.round((g ?? 0) * 255)} ${Math.round((b ?? 0) * 255)}${a < 1 ? ` / ${a}` : ''})`;
    }
    if (typeof v.value === 'number' && typeof v.unit === 'string') {
      return `${v.value}${v.unit}`;
    }
  }
  return String(v);
}

/**
 * Derive a dark-theme override map for semantic neutral tokens.
 * Single source of truth for theme inversion.
 */
function darkSemanticOverrides(primitives: Record<string, string>): Record<string, string> {
  const inv: Record<string, string> = {
    'bg-default': primitives['color-neutral-950'] ?? '',
    'bg-subtle': primitives['color-neutral-900'] ?? '',
    'bg-muted': primitives['color-neutral-800'] ?? '',
    'bg-inverted': primitives['color-neutral-50'] ?? '',
    'fg-default': primitives['color-neutral-50'] ?? '',
    'fg-muted': primitives['color-neutral-400'] ?? '',
    'fg-subtle': primitives['color-neutral-500'] ?? '',
    'fg-inverted': primitives['color-neutral-950'] ?? '',
    'border-default': primitives['color-neutral-800'] ?? '',
    'border-strong': primitives['color-neutral-700'] ?? '',
    'accent-fg': primitives['color-neutral-50'] ?? '',
  };
  return inv;
}

interface ComponentTokens {
  $component?: string;
  light?: Record<string, string>;
  dark?: Record<string, string>;
}

function resolveAlias(value: string): string {
  // {colors.foo} or {semantic.bar} -> var(--foo) / var(--bar)
  const m = value.match(/^\{([^}]+)\}$/);
  if (!m) return value;
  const path = (m[1] as string).split('.');
  const last = path[path.length - 1] ?? '';
  return `var(--${last})`;
}

function emit(): void {
  const design = readJSON<DtcgNode>(DESIGN_JSON);
  const flat = flattenDtcg(design);

  // Drop component.* tokens emitted from DESIGN.md's `components:` section —
  // we own component tokens via per-component *.tokens.json files instead.
  const primitives: Record<string, string> = {};
  for (const [k, v] of Object.entries(flat)) {
    if (k.startsWith('component-')) continue;
    // Typography tokens are composite (font family/size/weight/line-height/etc).
    // They don't map to a single CSS var; expose individual properties via @theme
    // in globals.css instead. Skip them in the generated tokens.css.
    if (k.startsWith('typography-')) continue;
    primitives[k] = v;
  }

  // Component tokens
  const glob = new Glob(COMPONENTS_GLOB);
  const componentLight: Record<string, string> = {};
  const componentDark: Record<string, string> = {};
  const components: string[] = [];
  for (const file of glob.scanSync({ cwd: ROOT, absolute: true })) {
    const tokens = readJSON<ComponentTokens>(file);
    const compName = tokens.$component ?? '';
    if (compName) components.push(compName);
    if (tokens.light) {
      for (const [k, v] of Object.entries(tokens.light)) {
        const key = compName ? `${compName}-${k}` : k;
        componentLight[key] = resolveAlias(v);
      }
    }
    if (tokens.dark) {
      for (const [k, v] of Object.entries(tokens.dark)) {
        const key = compName ? `${compName}-${k}` : k;
        componentDark[key] = resolveAlias(v);
      }
    }
  }

  const darkSemantic = darkSemanticOverrides(primitives);

  let css = '/* Generated by tools/build-tokens. Do not edit by hand. */\n';
  css +=
    '/* Source: DESIGN.md (via design.md export) + packages/ui/src/components/**\\/*.tokens.json */\n\n';

  css += ':root {\n';
  for (const [k, v] of Object.entries(primitives)) {
    // strip leading "color-" so consumers can use var(--accent-500) etc.
    const name = k.startsWith('color-') ? k.slice('color-'.length) : k;
    css += `  --${name}: ${v};\n`;
  }
  for (const [k, v] of Object.entries(componentLight)) {
    css += `  --${k}: ${v};\n`;
  }
  css += '}\n\n';

  css += '.dark {\n';
  for (const [k, v] of Object.entries(darkSemantic)) {
    css += `  --${k}: ${v};\n`;
  }
  for (const [k, v] of Object.entries(componentDark)) {
    css += `  --${k}: ${v};\n`;
  }
  css += '}\n';

  if (!existsSync(dirname(OUT))) mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, css, 'utf8');

  console.log(
    `tokens.css written: ${Object.keys(primitives).length} primitives, ${components.length} components, ${Object.keys(componentLight).length} component tokens`,
  );
}

emit();
