import * as p from '@clack/prompts';
import pc from 'picocolors';
import fs from 'fs-extra';
import path from 'path';
import {
  getComponent,
  getAllComponents,
  type ComponentRegistryItem,
} from '../registry.js';
import { getComponentTemplate } from '../templates/index.js';

interface ProjectConfig {
  style: string;
  typescript: boolean;
  aliases: {
    components: string;
    utils: string;
    hooks: string;
  };
  installedComponents?: Record<string, { version: string; installedAt: string }>;
}

export async function diffCommand(components?: string[]) {
  console.log('');
  p.intro(pc.bgCyan(pc.black(' js-ds-ui diff ')));

  const config = await loadProjectConfig();
  if (!config) {
    p.log.error('No js-ds-ui.json found. Run `npx js-ds-ui init` first.');
    process.exit(1);
  }

  // If no components specified, diff all installed
  let componentsToDiff: string[] = components || [];

  if (!componentsToDiff.length) {
    // Find all installed components
    const allComponents = getAllComponents();
    for (const component of allComponents) {
      const installed = await isComponentInstalled(component, config);
      if (installed) {
        componentsToDiff.push(component.name);
      }
    }
  }

  if (componentsToDiff.length === 0) {
    p.log.warn('No installed components found to diff.');
    p.outro(pc.dim('Nothing to compare.'));
    return;
  }

  let hasChanges = false;

  for (const name of componentsToDiff) {
    const component = getComponent(name);
    if (!component) {
      p.log.warn(`Component "${name}" not found in registry. Skipping.`);
      continue;
    }

    for (const file of component.files) {
      const localPath = resolveTargetPath(file.path, config);
      const exists = await fs.pathExists(localPath);

      if (!exists) {
        p.log.warn(`${name}: file not found at ${localPath}. Skipping.`);
        continue;
      }

      const localContent = await fs.readFile(localPath, 'utf-8');
      const latestContent = getComponentTemplate(name, config.typescript);

      if (localContent === latestContent) {
        p.log.success(`${pc.bold(name)}: ${pc.green('up to date')}`);
        continue;
      }

      hasChanges = true;
      p.log.step(pc.bold(`${name}: changes detected`));

      // Show simple unified diff
      const diff = createSimpleDiff(localContent, latestContent, localPath);
      console.log(diff);
      console.log('');
    }
  }

  if (!hasChanges) {
    p.outro(pc.green('All components are up to date!'));
  } else {
    p.outro(pc.dim('Run `npx js-ds-ui update` to apply the latest templates.'));
  }
}

function createSimpleDiff(localContent: string, latestContent: string, filePath: string): string {
  const localLines = localContent.split('\n');
  const latestLines = latestContent.split('\n');
  const output: string[] = [];

  output.push(pc.dim(`--- ${filePath} (local)`));
  output.push(pc.dim(`+++ ${filePath} (latest)`));

  // Simple line-by-line comparison
  const maxLen = Math.max(localLines.length, latestLines.length);

  let chunkStart = -1;
  const chunks: Array<{ start: number; localLines: string[]; latestLines: string[] }> = [];
  let currentChunk: { start: number; localLines: string[]; latestLines: string[] } | null = null;

  for (let i = 0; i < maxLen; i++) {
    const localLine = i < localLines.length ? localLines[i] : undefined;
    const latestLine = i < latestLines.length ? latestLines[i] : undefined;

    if (localLine !== latestLine) {
      if (!currentChunk) {
        currentChunk = { start: Math.max(0, i - 2), localLines: [], latestLines: [] };
        // Add context lines before
        for (let j = Math.max(0, i - 2); j < i; j++) {
          if (j < localLines.length) {
            currentChunk.localLines.push(` ${localLines[j]}`);
            currentChunk.latestLines.push(` ${localLines[j]}`);
          }
        }
      }
      if (localLine !== undefined) currentChunk.localLines.push(`-${localLine}`);
      if (latestLine !== undefined) currentChunk.latestLines.push(`+${latestLine}`);
    } else if (currentChunk) {
      // Add context after
      currentChunk.localLines.push(` ${localLine}`);
      currentChunk.latestLines.push(` ${latestLine}`);
      if (currentChunk.localLines.filter(l => l.startsWith(' ')).length >= 3) {
        chunks.push(currentChunk);
        currentChunk = null;
      }
    }
  }

  if (currentChunk) chunks.push(currentChunk);

  // Render chunks
  for (const chunk of chunks) {
    const allLines = [...new Set([...chunk.localLines, ...chunk.latestLines])];
    // Flatten: show removed then added within each chunk
    const merged: string[] = [];
    for (const line of chunk.localLines) {
      if (line.startsWith('-')) merged.push(line);
    }
    for (const line of chunk.latestLines) {
      if (line.startsWith('+')) merged.push(line);
    }
    // Add context
    for (const line of chunk.localLines) {
      if (line.startsWith(' ') && !merged.includes(line)) merged.push(line);
    }

    for (const line of [...chunk.localLines, ...chunk.latestLines]) {
      if (line.startsWith('-')) {
        output.push(pc.red(line));
      } else if (line.startsWith('+')) {
        output.push(pc.green(line));
      } else if (line.startsWith(' ')) {
        output.push(pc.dim(line));
      }
    }
    output.push(pc.dim('---'));
  }

  return output.join('\n');
}

// Reuse helper functions from other commands
async function loadProjectConfig(): Promise<ProjectConfig | null> {
  const configPath = path.join(process.cwd(), 'js-ds-ui.json');
  const exists = await fs.pathExists(configPath);
  if (!exists) return null;
  return fs.readJSON(configPath);
}

async function isComponentInstalled(
  component: ComponentRegistryItem,
  config: ProjectConfig
): Promise<boolean> {
  for (const file of component.files) {
    const targetPath = resolveTargetPath(file.path, config);
    const exists = await fs.pathExists(targetPath);
    if (exists) return true;
  }
  return false;
}

function resolveTargetPath(registryPath: string, config: ProjectConfig): string {
  const cwd = process.cwd();
  if (registryPath.startsWith('components/')) {
    return path.join(cwd, config.aliases.components, registryPath.replace('components/', ''));
  }
  if (registryPath.startsWith('lib/')) {
    return path.join(cwd, config.aliases.utils, registryPath.replace('lib/', ''));
  }
  if (registryPath.startsWith('hooks/')) {
    return path.join(cwd, config.aliases.hooks, registryPath.replace('hooks/', ''));
  }
  return path.join(cwd, 'src', registryPath);
}
