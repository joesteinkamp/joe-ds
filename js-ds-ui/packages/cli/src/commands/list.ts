import * as p from '@clack/prompts';
import pc from 'picocolors';
import fs from 'fs-extra';
import path from 'path';
import {
  getAllComponents,
  type ComponentRegistryItem,
  type ComponentStatus,
} from '../registry.js';

interface ProjectConfig {
  style: string;
  typescript: boolean;
  aliases: {
    components: string;
    utils: string;
    hooks: string;
  };
}

export async function listCommand() {
  console.log('');
  p.intro(pc.bgCyan(pc.black(' js-ds-ui list ')));

  // Load project config (optional -- we use it to detect installed components)
  const config = await loadProjectConfig();

  const allComponents = getAllComponents();

  // Group components by their file type
  const groups: Record<string, ComponentRegistryItem[]> = {
    Utilities: [],
    Hooks: [],
    Components: [],
  };

  for (const component of allComponents) {
    const fileType = component.files[0]?.type;
    if (fileType === 'util') {
      groups['Utilities'].push(component);
    } else if (fileType === 'hook') {
      groups['Hooks'].push(component);
    } else {
      groups['Components'].push(component);
    }
  }

  // Determine installed components
  const installedSet = new Set<string>();

  if (config) {
    for (const component of allComponents) {
      const installed = await isComponentInstalled(component, config);
      if (installed) {
        installedSet.add(component.name);
      }
    }
  }

  // Display each group
  let totalCount = 0;
  let installedCount = 0;

  for (const [groupName, components] of Object.entries(groups)) {
    if (components.length === 0) continue;

    p.log.step(pc.bold(pc.underline(groupName)));

    for (const component of components) {
      totalCount++;
      const isInstalled = installedSet.has(component.name);
      if (isInstalled) installedCount++;

      const installedTag = isInstalled
        ? pc.green(' [installed]')
        : '';
      const statusTag = formatStatus(component.status);
      const sinceTag = pc.dim(`v${component.since}`);
      const name = isInstalled
        ? pc.green(component.label)
        : pc.white(component.label);
      const description = pc.dim(component.description);

      p.log.message(`  ${name} ${pc.dim(`(${component.name})`)} ${statusTag} ${sinceTag}${installedTag}\n    ${description}`);
    }
  }

  // Summary
  console.log('');
  if (config) {
    p.outro(
      pc.dim(`${totalCount} components available, ${installedCount} installed`)
    );
  } else {
    p.outro(
      pc.dim(`${totalCount} components available. Run ${pc.bold('npx js-ds-ui init')} to get started.`)
    );
  }
}

function formatStatus(status: ComponentStatus): string {
  switch (status) {
    case 'stable':
      return pc.green('[stable]');
    case 'beta':
      return pc.yellow('[beta]');
    case 'alpha':
      return pc.red('[alpha]');
    case 'deprecated':
      return pc.strikethrough(pc.dim('[deprecated]'));
  }
}

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
