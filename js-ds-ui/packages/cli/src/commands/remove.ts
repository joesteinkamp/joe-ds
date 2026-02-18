import * as p from '@clack/prompts';
import pc from 'picocolors';
import fs from 'fs-extra';
import path from 'path';
import {
  getComponent,
  getAllComponents,
  type ComponentRegistryItem,
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

export async function removeCommand(components: string[]) {
  console.log('');
  p.intro(pc.bgCyan(pc.black(' js-ds-ui remove ')));

  // Load project config
  const config = await loadProjectConfig();

  if (!config) {
    p.log.error('No js-ds-ui.json found. Run `npx js-ds-ui init` first.');
    process.exit(1);
  }

  // Determine which components are currently installed
  const allComponents = getAllComponents();
  const installedComponents: ComponentRegistryItem[] = [];

  for (const component of allComponents) {
    const installed = await isComponentInstalled(component, config);
    if (installed) {
      installedComponents.push(component);
    }
  }

  if (installedComponents.length === 0) {
    p.log.warn('No components are currently installed.');
    p.outro(pc.dim('Nothing to remove.'));
    return;
  }

  // If no components specified, show interactive multi-select
  let selectedComponents: string[] = components || [];

  if (!selectedComponents.length) {
    const selection = await p.multiselect({
      message: 'Which components would you like to remove?',
      options: installedComponents.map((c) => ({
        value: c.name,
        label: c.label,
        hint: c.description,
      })),
      required: true,
    });

    if (p.isCancel(selection)) {
      p.cancel('Operation cancelled.');
      process.exit(0);
    }

    selectedComponents = selection as string[];
  }

  // Validate that requested components exist in registry and are installed
  for (const name of selectedComponents) {
    const component = getComponent(name);
    if (!component) {
      p.log.error(`Component "${name}" not found in registry.`);
      process.exit(1);
    }

    const installed = await isComponentInstalled(component, config);
    if (!installed) {
      p.log.warn(`Component "${name}" is not installed. Skipping.`);
      selectedComponents = selectedComponents.filter((c) => c !== name);
    }
  }

  if (selectedComponents.length === 0) {
    p.outro(pc.dim('No components to remove.'));
    return;
  }

  // Check for dependents -- other installed components that depend on the ones being removed
  const installedNames = new Set(installedComponents.map((c) => c.name));
  const dependencyWarnings: string[] = [];

  for (const name of selectedComponents) {
    const dependents = findDependents(name, installedNames, selectedComponents);
    if (dependents.length > 0) {
      dependencyWarnings.push(
        `${pc.bold(name)} is used by: ${dependents.map((d) => pc.yellow(d)).join(', ')}`
      );
    }
  }

  if (dependencyWarnings.length > 0) {
    p.log.warn('Dependency warnings:');
    for (const warning of dependencyWarnings) {
      p.log.message(`  ${warning}`);
    }

    const shouldContinue = await p.confirm({
      message: 'Some installed components depend on the ones you are removing. Continue anyway?',
      initialValue: false,
    });

    if (p.isCancel(shouldContinue) || !shouldContinue) {
      p.cancel('Operation cancelled.');
      process.exit(0);
    }
  }

  // Remove component files
  const removed: string[] = [];

  for (const name of selectedComponents) {
    const component = getComponent(name);
    if (!component) continue;

    try {
      for (const file of component.files) {
        const targetPath = resolveTargetPath(file.path, config);
        const exists = await fs.pathExists(targetPath);
        if (exists) {
          await fs.remove(targetPath);
        }
      }
      removed.push(name);
      p.log.success(`Removed ${pc.bold(name)}`);
    } catch (error) {
      p.log.error(
        `Failed to remove ${name}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  if (removed.length > 0) {
    p.outro(
      pc.green(
        `\nDone! Removed ${removed.length} component${removed.length === 1 ? '' : 's'}:\n${removed.map((c) => `  - ${c}`).join('\n')}\n\n${pc.dim('Note: npm dependencies were not removed as they may be used by other components.')}`
      )
    );
  } else {
    p.outro(pc.dim('No components were removed.'));
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

/**
 * Find installed components that depend on the given component via registryDependencies,
 * excluding any components that are also being removed.
 */
function findDependents(
  componentName: string,
  installedNames: Set<string>,
  beingRemoved: string[]
): string[] {
  const removingSet = new Set(beingRemoved);
  const dependents: string[] = [];

  for (const installedName of installedNames) {
    // Skip components that are also being removed
    if (removingSet.has(installedName)) continue;

    const component = getComponent(installedName);
    if (!component) continue;

    if (component.registryDependencies?.includes(componentName)) {
      dependents.push(installedName);
    }
  }

  return dependents;
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
