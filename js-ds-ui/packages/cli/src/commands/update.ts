import * as p from '@clack/prompts';
import pc from 'picocolors';
import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
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

export async function updateCommand(components?: string[]) {
  console.log('');
  p.intro(pc.bgCyan(pc.black(' js-ds-ui update ')));

  const config = await loadProjectConfig();
  if (!config) {
    p.log.error('No js-ds-ui.json found. Run `npx js-ds-ui init` first.');
    process.exit(1);
  }

  // Determine which components to check for updates
  let componentsToCheck: string[] = components || [];

  if (!componentsToCheck.length) {
    const allComponents = getAllComponents();
    for (const component of allComponents) {
      const installed = await isComponentInstalled(component, config);
      if (installed) {
        componentsToCheck.push(component.name);
      }
    }
  }

  if (componentsToCheck.length === 0) {
    p.log.warn('No installed components found to update.');
    p.outro(pc.dim('Nothing to update.'));
    return;
  }

  // Find components with changes
  const outdated: Array<{ name: string; localPath: string; localContent: string; latestContent: string }> = [];

  for (const name of componentsToCheck) {
    const component = getComponent(name);
    if (!component) {
      p.log.warn(`Component "${name}" not found in registry. Skipping.`);
      continue;
    }

    for (const file of component.files) {
      const localPath = resolveTargetPath(file.path, config);
      const exists = await fs.pathExists(localPath);

      if (!exists) continue;

      const localContent = await fs.readFile(localPath, 'utf-8');
      const latestContent = getComponentTemplate(name, config.typescript);

      if (localContent !== latestContent) {
        outdated.push({ name, localPath, localContent, latestContent });
      }
    }
  }

  if (outdated.length === 0) {
    p.outro(pc.green('All components are up to date!'));
    return;
  }

  p.log.info(`${outdated.length} component${outdated.length === 1 ? '' : 's'} can be updated:`);
  for (const item of outdated) {
    p.log.message(`  ${pc.yellow(item.name)}`);
  }

  const shouldUpdate = await p.confirm({
    message: `Update ${outdated.length} component${outdated.length === 1 ? '' : 's'}? (Backups will be created)`,
    initialValue: true,
  });

  if (p.isCancel(shouldUpdate) || !shouldUpdate) {
    p.cancel('Update cancelled.');
    process.exit(0);
  }

  const spinner = ora('Updating components...').start();
  const updated: string[] = [];
  const backups: string[] = [];

  try {
    for (const item of outdated) {
      // Create backup
      const backupPath = `${item.localPath}.backup`;
      await fs.copy(item.localPath, backupPath);
      backups.push(backupPath);

      // Write latest template
      await fs.writeFile(item.localPath, item.latestContent);
      updated.push(item.name);

      // Update version tracking in config
      if (!config.installedComponents) {
        config.installedComponents = {};
      }
      config.installedComponents[item.name] = {
        version: '0.1.0', // CLI version
        installedAt: new Date().toISOString(),
      };
    }

    // Save updated config
    const configPath = path.join(process.cwd(), 'js-ds-ui.json');
    await fs.writeJSON(configPath, config, { spaces: 2 });

    spinner.succeed('Components updated successfully!');

    p.outro(
      pc.green(
        `\nUpdated ${updated.length} component${updated.length === 1 ? '' : 's'}:\n${updated.map((c) => `  - ${c}`).join('\n')}\n\n${pc.dim(`Backups created at *.backup files.\nRemove backups with: rm ${path.dirname(outdated[0].localPath)}/*.backup`)}`
      )
    );
  } catch (error) {
    spinner.fail('Failed to update components');
    p.log.error(error instanceof Error ? error.message : String(error));

    // Attempt to restore backups
    for (let i = 0; i < backups.length; i++) {
      try {
        await fs.copy(backups[i], outdated[i].localPath);
        await fs.remove(backups[i]);
      } catch {}
    }

    process.exit(1);
  }
}

// Helper functions (same as other commands)
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
