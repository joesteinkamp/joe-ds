#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function run(cmd) {
  execSync(cmd, {
    cwd: root,
    stdio: 'inherit',
  });
}

function readFileMaybe(filePath) {
  try {
    return readFileSync(resolve(root, filePath), 'utf-8');
  } catch {
    return '';
  }
}

function assertUnchanged(before, filePath, hint) {
  const after = readFileMaybe(filePath);
  if (before !== after) {
    console.error(`\n[generated] ${filePath} is out of date.`);
    console.error(`[generated] ${hint}`);
    process.exit(1);
  }
}

console.log('[generated] regenerating CLI templates...');
const beforeTemplates = readFileMaybe('packages/cli/src/templates/generated.ts');
run('node scripts/gen-cli-templates.mjs');
assertUnchanged(
  beforeTemplates,
  'packages/cli/src/templates/generated.ts',
  'Run: node scripts/gen-cli-templates.mjs'
);

console.log('[generated] checking metadata JSON parses...');
run(`node -e "JSON.parse(require('fs').readFileSync('metadata/component-manifest.json','utf8'));JSON.parse(require('fs').readFileSync('metadata/usage-examples.json','utf8'));console.log('metadata ok')"`); // eslint-disable-line max-len

console.log('[generated] all generated artifacts are up to date.');
