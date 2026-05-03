#!/usr/bin/env bun
/**
 * scaffold-component
 *
 * Usage:
 *   bun run scaffold <ComponentName> [<ComponentName> ...]
 *   bun run scaffold --all          # scaffold the full Base UI list
 *
 * Emits per component under packages/ui/src/components/<kebab>/:
 *   - <kebab>.tsx         Base UI primitive composition (placeholder; refined per component)
 *   - <kebab>.tokens.json Component-scoped tokens aliasing semantic primitives
 *   - index.ts            Barrel
 *
 * Also appends an export line to packages/ui/src/index.ts.
 */

import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dir, '../..');
const COMPONENTS_DIR = resolve(ROOT, 'packages/ui/src/components');
const BARREL = resolve(ROOT, 'packages/ui/src/index.ts');

// Full Base UI component list (as of @base-ui-components/react 1.0.0-alpha.x)
const BASE_UI_COMPONENTS = [
  'Accordion',
  'AlertDialog',
  'Avatar',
  'Checkbox',
  'CheckboxGroup',
  'Collapsible',
  'ContextMenu',
  'Dialog',
  'Field',
  'Fieldset',
  'Form',
  'Input',
  'Menu',
  'Menubar',
  'NavigationMenu',
  'NumberField',
  'Popover',
  'PreviewCard',
  'Progress',
  'RadioGroup',
  'ScrollArea',
  'Select',
  'Separator',
  'Slider',
  'Switch',
  'Tabs',
  'Toast',
  'Toggle',
  'ToggleGroup',
  'Toolbar',
  'Tooltip',
];

function kebab(name: string): string {
  return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function tsxTemplate(name: string, kebabName: string): string {
  return `'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { ${name} as Base${name} } from '@base-ui-components/react/${kebabName}';
// Then export a typed wrapper that consumes \`var(--${kebabName}-*)\` CSS variables
// declared in ${kebabName}.tokens.json.

export interface ${name}Props {
  className?: string;
  children?: ReactNode;
}

export function ${name}({ className, children }: ${name}Props): React.ReactNode {
  return (
    <div data-component="${kebabName}" className={cn(className)}>
      {children}
    </div>
  );
}
`;
}

function tokensTemplate(name: string, kebabName: string): string {
  // Sensible default: most components alias bg/fg/border to semantic neutrals.
  // Users override per-component as needed.
  return `${JSON.stringify(
    {
      $component: kebabName,
      $description: `${name} component-scoped tokens. Aliases semantic primitives.`,
      light: {
        bg: '{colors.bg-default}',
        fg: '{colors.fg-default}',
        border: '{colors.border-default}',
        ring: '{colors.ring-default}',
      },
      dark: {},
    },
    null,
    2,
  )}\n`;
}

function indexTemplate(name: string, kebabName: string): string {
  return `export { ${name} } from './${kebabName}';\n`;
}

function ensureBarrelExport(name: string, kebabName: string): void {
  const line = `export { ${name} } from './components/${kebabName}';\n`;
  const current = existsSync(BARREL) ? readFileSync(BARREL, 'utf8') : '';
  if (current.includes(line.trim())) return;
  appendFileSync(BARREL, line, 'utf8');
}

function scaffold(name: string): void {
  const kebabName = kebab(name);
  const dir = resolve(COMPONENTS_DIR, kebabName);
  if (existsSync(dir)) {
    console.log(`skip ${name} (exists)`);
    return;
  }
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, `${kebabName}.tsx`), tsxTemplate(name, kebabName), 'utf8');
  writeFileSync(resolve(dir, `${kebabName}.tokens.json`), tokensTemplate(name, kebabName), 'utf8');
  writeFileSync(resolve(dir, 'index.ts'), indexTemplate(name, kebabName), 'utf8');
  ensureBarrelExport(name, kebabName);
  console.log(`scaffolded ${name} -> ${kebabName}/`);
}

const args = process.argv.slice(2);
const targets = args.includes('--all')
  ? BASE_UI_COMPONENTS
  : args.filter((a) => !a.startsWith('--'));

if (targets.length === 0) {
  console.error('Usage: bun run scaffold <Name> [...] | --all');
  process.exit(1);
}

if (!existsSync(COMPONENTS_DIR)) mkdirSync(COMPONENTS_DIR, { recursive: true });

for (const name of targets) scaffold(name);
