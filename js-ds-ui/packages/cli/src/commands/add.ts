import * as p from '@clack/prompts';
import pc from 'picocolors';
import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import { execa } from 'execa';
import {
  getComponent,
  getAllComponents,
  resolveComponentDependencies,
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
}

export async function addCommand(components?: string[]) {
  console.log('');
  p.intro(pc.bgCyan(pc.black(' js-ds-ui add ')));

  // Load project config
  const config = await loadProjectConfig();

  if (!config) {
    p.log.error('No js-ds-ui.json found. Run `npx js-ds-ui init` first.');
    process.exit(1);
  }

  // If no components specified, show multi-select
  let selectedComponents: string[] = components || [];

  if (!selectedComponents.length) {
    const allComponents = getAllComponents()
      .filter((c) => c.type !== 'util' && c.type !== 'hook')
      .map((c) => ({
        value: c.name,
        label: c.label,
        hint: c.description,
      }));

    const selection = await p.multiselect({
      message: 'Which components would you like to add?',
      options: allComponents,
      required: true,
    });

    if (p.isCancel(selection)) {
      p.cancel('Operation cancelled.');
      process.exit(0);
    }

    selectedComponents = selection as string[];
  }

  // Resolve dependencies
  const allComponentsToAdd = new Set<string>();
  selectedComponents.forEach((name) => {
    const deps = resolveComponentDependencies(name);
    deps.forEach((dep) => allComponentsToAdd.add(dep));
  });

  const componentList = Array.from(allComponentsToAdd);

  p.log.info(`Adding components: ${componentList.join(', ')}`);

  const spinner = ora('Installing components...').start();

  try {
    // Install NPM dependencies
    await installComponentDependencies(componentList);

    // Copy component files
    for (const name of componentList) {
      await copyComponent(name, config);
    }

    // Update version tracking
    const configPath = path.join(process.cwd(), 'js-ds-ui.json');
    const fullConfig = await fs.readJSON(configPath);
    if (!fullConfig.installedComponents) {
      fullConfig.installedComponents = {};
    }
    for (const name of componentList) {
      fullConfig.installedComponents[name] = {
        version: '0.1.0',
        installedAt: new Date().toISOString(),
      };
    }
    await fs.writeJSON(configPath, fullConfig, { spaces: 2 });

    spinner.succeed('Components added successfully!');

    p.outro(
      pc.green(
        `\n✅ Done!\n\nComponents added:\n${componentList.map((c) => `  - ${c}`).join('\n')}\n`
      )
    );
  } catch (error) {
    spinner.fail('Failed to add components');
    p.log.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

async function loadProjectConfig(): Promise<ProjectConfig | null> {
  const configPath = path.join(process.cwd(), 'js-ds-ui.json');
  const exists = await fs.pathExists(configPath);

  if (!exists) return null;

  return fs.readJSON(configPath);
}

async function installComponentDependencies(components: string[]) {
  const allDeps = new Set<string>();

  components.forEach((name) => {
    const component = getComponent(name);
    if (component) {
      Object.keys(component.npmDependencies).forEach((dep) => allDeps.add(dep));
    }
  });

  if (allDeps.size === 0) return;

  const deps = Array.from(allDeps);

  // Detect package manager
  const hasPnpm = await fs.pathExists(path.join(process.cwd(), 'pnpm-lock.yaml'));
  const hasYarn = await fs.pathExists(path.join(process.cwd(), 'yarn.lock'));
  const pm = hasPnpm ? 'pnpm' : hasYarn ? 'yarn' : 'npm';

  await execa(pm, ['add', ...deps], {
    cwd: process.cwd(),
    stdio: 'pipe',
  });
}

async function copyComponent(name: string, config: ProjectConfig) {
  const component = getComponent(name);
  if (!component) {
    throw new Error(`Component "${name}" not found in registry`);
  }

  for (const file of component.files) {
    const template = getComponentTemplate(name, config.typescript);
    const targetPath = resolveTargetPath(file.path, config);

    await fs.ensureDir(path.dirname(targetPath));
    await fs.writeFile(targetPath, template);
  }
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
