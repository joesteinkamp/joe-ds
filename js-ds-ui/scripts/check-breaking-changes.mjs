#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const argv = process.argv.slice(2);
const baseArgIndex = argv.indexOf('--base');
const explicitBase = baseArgIndex >= 0 ? argv[baseArgIndex + 1] : undefined;

function runGit(command) {
  return execSync(`git ${command}`, {
    cwd: ROOT,
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function tryRunGit(command) {
  try {
    return runGit(command);
  } catch {
    return '';
  }
}

function resolveBaseRef() {
  if (explicitBase) return explicitBase;

  const githubBase = process.env.GITHUB_BASE_REF;
  if (githubBase) {
    const remoteBase = `origin/${githubBase}`;
    const rev = tryRunGit(`rev-parse --verify ${remoteBase}`);
    if (rev) return remoteBase;
  }

  const headPrev = tryRunGit('rev-parse --verify HEAD~1');
  if (headPrev) return 'HEAD~1';

  return 'HEAD';
}

function getChangedFiles(baseRef) {
  const diffRange =
    baseRef === 'HEAD'
      ? 'diff --name-only HEAD'
      : `diff --name-only ${baseRef}...HEAD`;
  const output = tryRunGit(diffRange);
  return output ? output.split('\n').filter(Boolean) : [];
}

function parseJsonFileFromRef(ref, filePath) {
  const blob = tryRunGit(`show ${ref}:${filePath}`);
  if (!blob) return null;
  try {
    return JSON.parse(blob);
  } catch {
    return null;
  }
}

function parseJsonFileFromWorkspace(filePath) {
  const abs = path.join(ROOT, filePath);
  if (!existsSync(abs)) return null;
  try {
    return JSON.parse(readFileSync(abs, 'utf-8'));
  } catch {
    return null;
  }
}

function flattenTokens(node, currentPath = [], out = new Map()) {
  if (!node || typeof node !== 'object') return out;
  if (!Array.isArray(node) && '$value' in node) {
    const tokenPath = currentPath.join('.');
    out.set(tokenPath, { value: node.$value, type: node.$type ?? 'unknown' });
    return out;
  }
  if (Array.isArray(node)) return out;
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    flattenTokens(value, [...currentPath, key], out);
  }
  return out;
}

function extractProps(sourceText) {
  const props = new Set();
  const interfaceRe = /export interface\s+\w+Props[\s\S]*?\{([\s\S]*?)\n\}/gm;
  let match;
  while ((match = interfaceRe.exec(sourceText))) {
    const body = match[1];
    const lineRe = /^\s*([A-Za-z0-9_]+)\??:\s*/gm;
    let propMatch;
    while ((propMatch = lineRe.exec(body))) {
      props.add(propMatch[1]);
    }
  }
  return props;
}

function classifyTokenChanges(changedFiles, baseRef) {
  const changes = { major: [], minor: [], patch: [] };
  const tokenFiles = changedFiles.filter(
    (file) => file.startsWith('packages/tokens/src/') && file.endsWith('.json')
  );

  for (const file of tokenFiles) {
    const before = parseJsonFileFromRef(baseRef, file);
    const after = parseJsonFileFromWorkspace(file);
    const beforeMap = flattenTokens(before);
    const afterMap = flattenTokens(after);

    for (const tokenPath of beforeMap.keys()) {
      if (!afterMap.has(tokenPath)) {
        changes.major.push(`removed token ${tokenPath} (${file})`);
        continue;
      }
      const prev = beforeMap.get(tokenPath);
      const next = afterMap.get(tokenPath);
      if (prev.type !== next.type) {
        changes.major.push(`token type change ${tokenPath} (${file})`);
      } else if (JSON.stringify(prev.value) !== JSON.stringify(next.value)) {
        changes.patch.push(`token value change ${tokenPath} (${file})`);
      }
    }
    for (const tokenPath of afterMap.keys()) {
      if (!beforeMap.has(tokenPath)) {
        changes.minor.push(`added token ${tokenPath} (${file})`);
      }
    }
  }

  return changes;
}

function classifyComponentApiChanges(changedFiles, baseRef) {
  const changes = { major: [], minor: [] };
  const componentFiles = changedFiles.filter((file) =>
    /^packages\/components\/src\/ui\/.*\.tsx$/.test(file)
  );

  for (const file of componentFiles) {
    if (/\.(test|stories|figma)\.tsx$/.test(file)) continue;

    const before = tryRunGit(`show ${baseRef}:${file}`);
    const abs = path.join(ROOT, file);
    const hasAfter = existsSync(abs);
    const after = hasAfter ? readFileSync(abs, 'utf-8') : '';

    if (!before && hasAfter) {
      changes.minor.push(`added component ${file}`);
      continue;
    }
    if (before && !hasAfter) {
      changes.major.push(`removed component ${file}`);
      continue;
    }

    const beforeProps = extractProps(before);
    const afterProps = extractProps(after);

    for (const prop of beforeProps) {
      if (!afterProps.has(prop)) {
        changes.major.push(`removed prop "${prop}" in ${file}`);
      }
    }
    for (const prop of afterProps) {
      if (!beforeProps.has(prop)) {
        changes.minor.push(`added prop "${prop}" in ${file}`);
      }
    }
  }

  const indexFile = 'packages/components/src/index.ts';
  if (changedFiles.includes(indexFile)) {
    const beforeIndex = tryRunGit(`show ${baseRef}:${indexFile}`);
    const afterIndex = existsSync(path.join(ROOT, indexFile))
      ? readFileSync(path.join(ROOT, indexFile), 'utf-8')
      : '';

    if (!beforeIndex && afterIndex) {
      changes.minor.push(`added components index ${indexFile}`);
    } else if (beforeIndex && !afterIndex) {
      changes.major.push(`removed components index ${indexFile}`);
    } else if (beforeIndex && afterIndex) {
      const getExports = (src) =>
        new Set(
          src
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.startsWith('export * from'))
        );
      const beforeExports = getExports(beforeIndex);
      const afterExports = getExports(afterIndex);

      for (const line of beforeExports) {
        if (!afterExports.has(line)) {
          changes.major.push(`removed export in components index: ${line}`);
        }
      }
      for (const line of afterExports) {
        if (!beforeExports.has(line)) {
          changes.minor.push(`added export in components index: ${line}`);
        }
      }
    }
  }

  return changes;
}

function highestLevel(changes) {
  if (changes.major.length) return 'major';
  if (changes.minor.length) return 'minor';
  if (changes.patch.length) return 'patch';
  return 'none';
}

function main() {
  const baseRef = resolveBaseRef();
  const changedFiles = getChangedFiles(baseRef);

  const tokenChanges = classifyTokenChanges(changedFiles, baseRef);
  const componentApi = classifyComponentApiChanges(changedFiles, baseRef);
  const allChanges = {
    major: [...tokenChanges.major, ...componentApi.major],
    minor: [...tokenChanges.minor, ...componentApi.minor],
    patch: [...tokenChanges.patch],
  };

  const level = highestLevel(allChanges);
  const changedChangesets = changedFiles.filter(
    (file) => file.startsWith('.changeset/') && file.endsWith('.md') && !file.endsWith('README.md')
  );
  const changedMigrations = changedFiles.filter((file) =>
    /^docs\/migrations\/.*\.md$/.test(file)
  );

  let failed = false;
  if (level === 'major') {
    if (!changedChangesets.length) {
      console.error('[breaking-check] major changes detected without a .changeset markdown file.');
      failed = true;
    }
    if (!changedMigrations.length) {
      console.error('[breaking-check] major changes detected without docs/migrations entry.');
      failed = true;
    }
  }

  const report = {
    baseRef,
    changedFileCount: changedFiles.length,
    level,
    changes: allChanges,
    changesets: changedChangesets,
    migrations: changedMigrations,
  };

  console.log('[breaking-check] report');
  console.log(JSON.stringify(report, null, 2));

  if (failed) {
    process.exit(1);
  }
}

main();
