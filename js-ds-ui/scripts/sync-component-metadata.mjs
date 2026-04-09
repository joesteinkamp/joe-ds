#!/usr/bin/env node
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const UI_DIR = path.join(ROOT, 'packages/components/src/ui');
const REGISTRY_PATH = path.join(ROOT, 'packages/cli/src/registry.ts');
const MANIFEST_PATH = path.join(ROOT, 'metadata/component-manifest.json');

const IGNORED_UI_FILES = /\.(test|stories|figma)\.tsx$/;
const REGISTRY_NON_COMPONENT_KEYS = new Set(['utils', 'use-theme', 'use-density']);

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();
}

function toPascalCase(slug) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function extractSourceComponents() {
  return readdirSync(UI_DIR)
    .filter((file) => file.endsWith('.tsx'))
    .filter((file) => !IGNORED_UI_FILES.test(file))
    .map((file) => file.replace(/\.tsx$/, ''))
    .sort();
}

function extractRegistryComponents() {
  const registrySource = readFileSync(REGISTRY_PATH, 'utf-8');
  const re = /^  (?:(?:'([^']+)')|([a-zA-Z0-9-]+)):\s*\{/gm;
  const keys = [];

  let match;
  while ((match = re.exec(registrySource))) {
    keys.push(match[1] ?? match[2]);
  }

  return keys
    .filter(Boolean)
    .filter((key) => !REGISTRY_NON_COMPONENT_KEYS.has(key))
    .sort();
}

function defaultManifestEntry(slug) {
  const componentName = toPascalCase(slug);
  return {
    name: componentName,
    description: `${componentName} component in the js-ds-ui design system.`,
    intent: [`user needs ${slug.replace(/-/g, ' ')}`],
    props: {},
    accessibility: {
      role: 'depends on rendered element',
      keyboardNavigation: ['Tab'],
      ariaSupport: [],
      focusManagement: 'Uses browser default focus behavior unless overridden by component composition.',
      wcag: 'Follow component-level accessibility guidance.',
    },
    usage: {
      when: `Use ${componentName} when this UI pattern is needed.`,
      avoid: `Avoid ${componentName} when a simpler semantic element is sufficient.`,
      examples: [
        {
          scenario: `Basic ${componentName} usage`,
          code: `<${componentName} />`,
        },
      ],
    },
    dependencies: [],
    relatedComponents: [],
  };
}

function syncManifest(sourceComponents) {
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));
  const existing = manifest.components ?? {};
  const canonical = {};

  for (const [key, value] of Object.entries(existing)) {
    canonical[toKebabCase(key)] = value;
  }

  const nextComponents = {};
  let added = 0;
  for (const slug of sourceComponents) {
    if (!canonical[slug]) {
      canonical[slug] = defaultManifestEntry(slug);
      added += 1;
    }
    nextComponents[slug] = canonical[slug];
  }

  manifest.components = nextComponents;
  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

  const removed = Object.keys(canonical).length - Object.keys(nextComponents).length;
  return { added, removed, total: Object.keys(nextComponents).length };
}

function main() {
  const sourceComponents = extractSourceComponents();
  const registryComponents = extractRegistryComponents();

  const missingInRegistry = sourceComponents.filter((slug) => !registryComponents.includes(slug));
  const extraInRegistry = registryComponents.filter((slug) => !sourceComponents.includes(slug));

  if (missingInRegistry.length || extraInRegistry.length) {
    console.error('[sync] registry and source components are out of sync.');
    if (missingInRegistry.length) {
      console.error(`[sync] missing in registry: ${missingInRegistry.join(', ')}`);
    }
    if (extraInRegistry.length) {
      console.error(`[sync] extra in registry: ${extraInRegistry.join(', ')}`);
    }
    process.exit(1);
  }

  const manifestResult = syncManifest(sourceComponents);
  console.log(`[sync] source components: ${sourceComponents.length}`);
  console.log(`[sync] manifest components: ${manifestResult.total}`);
  console.log(`[sync] manifest entries added: ${manifestResult.added}`);
  console.log(`[sync] manifest canonicalized to source component slugs.`);
}

main();
