#!/usr/bin/env node
import { readFileSync, readdirSync } from 'node:fs';
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

function extractManifestComponents() {
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));
  return Object.keys(manifest.components ?? {})
    .map(toKebabCase)
    .sort();
}

function diff(left, right) {
  return left.filter((item) => !right.includes(item));
}

function main() {
  const source = extractSourceComponents();
  const registry = extractRegistryComponents();
  const manifest = extractManifestComponents();

  const missingRegistry = diff(source, registry);
  const extraRegistry = diff(registry, source);

  const missingManifest = diff(source, manifest);
  const extraManifest = diff(manifest, source);

  const hasErrors =
    missingRegistry.length > 0 ||
    extraRegistry.length > 0 ||
    missingManifest.length > 0 ||
    extraManifest.length > 0;

  if (hasErrors) {
    console.error('[component-sync] failed');
    if (missingRegistry.length) {
      console.error(`[component-sync] missing in registry: ${missingRegistry.join(', ')}`);
    }
    if (extraRegistry.length) {
      console.error(`[component-sync] extra in registry: ${extraRegistry.join(', ')}`);
    }
    if (missingManifest.length) {
      console.error(`[component-sync] missing in manifest: ${missingManifest.join(', ')}`);
    }
    if (extraManifest.length) {
      console.error(`[component-sync] extra in manifest: ${extraManifest.join(', ')}`);
    }
    console.error('[component-sync] run: node scripts/sync-component-metadata.mjs');
    process.exit(1);
  }

  console.log(`[component-sync] ok (${source.length} components)`);
}

main();
