#!/usr/bin/env tsx

/**
 * Bundle size analysis script for js-ds-ui components
 *
 * Generates a per-component size report showing:
 * - Individual component sizes (source)
 * - Dependency count per component
 * - Shared dependency analysis
 *
 * Usage: tsx scripts/analyze-bundle.ts
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UI_DIR = path.join(__dirname, '../src/ui');

interface ComponentInfo {
  name: string;
  file: string;
  sizeBytes: number;
  sizeKB: string;
  lines: number;
  imports: string[];
  radixDeps: string[];
  internalDeps: string[];
  usesCSA: boolean; // class-variance-authority
  usesLucide: boolean;
}

async function analyzeComponent(filePath: string): Promise<ComponentInfo> {
  const content = await fs.readFile(filePath, 'utf-8');
  const name = path.basename(filePath, '.tsx');
  const lines = content.split('\n').length;
  const sizeBytes = Buffer.byteLength(content, 'utf-8');

  // Parse imports
  const importRegex = /import\s+(?:.*?\s+from\s+)?['"](.+?)['"]/g;
  const imports: string[] = [];
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }

  const radixDeps = imports.filter(i => i.startsWith('@radix-ui/'));
  const internalDeps = imports.filter(i => i.startsWith('./') || i.startsWith('../'));
  const usesCSA = imports.some(i => i === 'class-variance-authority');
  const usesLucide = imports.some(i => i === 'lucide-react');

  return {
    name,
    file: path.relative(path.join(__dirname, '..'), filePath),
    sizeBytes,
    sizeKB: (sizeBytes / 1024).toFixed(2),
    lines,
    imports,
    radixDeps,
    internalDeps,
    usesCSA,
    usesLucide,
  };
}

async function main() {
  const files = await fs.readdir(UI_DIR);
  const componentFiles = files
    .filter(f => f.endsWith('.tsx') && !f.endsWith('.test.tsx') && !f.endsWith('.stories.tsx') && !f.endsWith('.figma.tsx'))
    .sort();

  console.log('# js-ds-ui Bundle Size Analysis\n');
  console.log(`Total components: ${componentFiles.length}\n`);

  const components: ComponentInfo[] = [];
  for (const file of componentFiles) {
    const info = await analyzeComponent(path.join(UI_DIR, file));
    components.push(info);
  }

  // Sort by size
  components.sort((a, b) => b.sizeBytes - a.sizeBytes);

  // Size table
  console.log('## Per-Component Source Size\n');
  console.log('| Component | Source Size | Lines | Radix Deps | CVA | Lucide |');
  console.log('|-----------|-----------|-------|------------|-----|--------|');

  let totalSize = 0;
  let totalLines = 0;
  for (const c of components) {
    totalSize += c.sizeBytes;
    totalLines += c.lines;
    console.log(
      `| ${c.name} | ${c.sizeKB} kB | ${c.lines} | ${c.radixDeps.length} | ${c.usesCSA ? 'Yes' : '-'} | ${c.usesLucide ? 'Yes' : '-'} |`
    );
  }

  console.log(`| **Total** | **${(totalSize / 1024).toFixed(2)} kB** | **${totalLines}** | | | |`);

  // Dependency frequency
  console.log('\n## Shared Dependencies\n');
  const depCounts: Record<string, number> = {};
  for (const c of components) {
    for (const dep of c.radixDeps) {
      depCounts[dep] = (depCounts[dep] || 0) + 1;
    }
  }

  const sortedDeps = Object.entries(depCounts).sort((a, b) => b[1] - a[1]);
  console.log('| Radix Package | Used By # Components |');
  console.log('|--------------|---------------------|');
  for (const [dep, count] of sortedDeps) {
    console.log(`| ${dep} | ${count} |`);
  }

  // Components with no Radix dependencies (lightest)
  const noRadix = components.filter(c => c.radixDeps.length === 0);
  console.log('\n## Zero-Dependency Components (lightest)\n');
  for (const c of noRadix) {
    console.log(`- ${c.name} (${c.sizeKB} kB)`);
  }

  // Write JSON report
  const reportPath = path.join(__dirname, '../.size-analysis.json');
  await fs.writeFile(reportPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalComponents: components.length,
    totalSourceSizeKB: (totalSize / 1024).toFixed(2),
    components: components.map(c => ({
      name: c.name,
      sizeKB: c.sizeKB,
      lines: c.lines,
      radixDeps: c.radixDeps,
      usesCSA: c.usesCSA,
      usesLucide: c.usesLucide,
    })),
  }, null, 2));

  console.log(`\nJSON report written to ${reportPath}`);
}

main().catch(console.error);
