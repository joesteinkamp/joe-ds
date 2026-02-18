import * as p from '@clack/prompts';
import pc from 'picocolors';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';

interface InitConfig {
  projectPath: string;
  componentsPath: string;
  cssPath: string;
  typescript: boolean;
  installDeps: boolean;
}

export async function initCommand() {
  console.log('');
  p.intro(pc.bgCyan(pc.black(' js-ds-ui ')));

  const config = await promptForConfig();

  if (p.isCancel(config)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  const spinner = ora('Initializing js-ds-ui...').start();

  try {
    // Create directory structure
    await createDirectoryStructure(config);

    // Detect framework
    const framework = await detectFramework(config);
    if (framework) {
      spinner.text = `Detected ${framework} project...`;
      p.log.info(`Framework detected: ${pc.cyan(framework)}`);
    }

    // Copy base configuration files
    await createConfigFiles(config, framework);

    // Set up tsconfig path aliases
    await setupTsconfigAliases(config);

    // Install dependencies if requested
    if (config.installDeps) {
      spinner.text = 'Installing dependencies...';
      await installDependencies(config);
    }

    spinner.succeed('js-ds-ui initialized successfully!');

    p.outro(
      pc.green(
        `\n✅ Setup complete!\n\nNext steps:\n  1. Run ${pc.cyan('npx js-ds-ui add button')} to add components\n  2. Import the CSS in your app: ${pc.cyan("import '@/styles/tokens.css'")}\n`
      )
    );
  } catch (error) {
    spinner.fail('Failed to initialize js-ds-ui');
    p.log.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

async function promptForConfig(): Promise<InitConfig> {
  const cwd = process.cwd();

  const componentsPath = await p.text({
    message: 'Where would you like to store components?',
    placeholder: './src/components',
    defaultValue: './src/components',
  });

  if (p.isCancel(componentsPath)) {
    return Promise.reject('cancelled');
  }

  const cssPath = await p.text({
    message: 'Where would you like to store CSS files?',
    placeholder: './src/styles',
    defaultValue: './src/styles',
  });

  if (p.isCancel(cssPath)) {
    return Promise.reject('cancelled');
  }

  const typescript = await p.confirm({
    message: 'Would you like to use TypeScript?',
    initialValue: true,
  });

  if (p.isCancel(typescript)) {
    return Promise.reject('cancelled');
  }

  const installDeps = await p.confirm({
    message: 'Install dependencies?',
    initialValue: true,
  });

  if (p.isCancel(installDeps)) {
    return Promise.reject('cancelled');
  }

  return {
    projectPath: cwd,
    componentsPath: componentsPath as string,
    cssPath: cssPath as string,
    typescript: typescript as boolean,
    installDeps: installDeps as boolean,
  };
}

async function createDirectoryStructure(config: InitConfig) {
  const dirs = [
    path.join(config.projectPath, config.componentsPath, 'ui'),
    path.join(config.projectPath, config.cssPath),
    path.join(config.projectPath, 'src/lib'),
    path.join(config.projectPath, 'src/hooks'),
  ];

  for (const dir of dirs) {
    await fs.ensureDir(dir);
  }
}

async function detectFramework(config: InitConfig): Promise<string | null> {
  const cwd = config.projectPath;

  // Check for Next.js
  const hasNextConfig = await fs.pathExists(path.join(cwd, 'next.config.js')) ||
    await fs.pathExists(path.join(cwd, 'next.config.mjs')) ||
    await fs.pathExists(path.join(cwd, 'next.config.ts'));
  if (hasNextConfig) return 'next';

  // Check for Vite
  const hasViteConfig = await fs.pathExists(path.join(cwd, 'vite.config.js')) ||
    await fs.pathExists(path.join(cwd, 'vite.config.ts')) ||
    await fs.pathExists(path.join(cwd, 'vite.config.mjs'));
  if (hasViteConfig) return 'vite';

  // Check for Remix
  const hasRemixConfig = await fs.pathExists(path.join(cwd, 'remix.config.js')) ||
    await fs.pathExists(path.join(cwd, 'remix.config.ts'));
  if (hasRemixConfig) return 'remix';

  // Check for Astro
  const hasAstroConfig = await fs.pathExists(path.join(cwd, 'astro.config.mjs')) ||
    await fs.pathExists(path.join(cwd, 'astro.config.ts'));
  if (hasAstroConfig) return 'astro';

  // Check for monorepo
  const hasWorkspace = await fs.pathExists(path.join(cwd, 'pnpm-workspace.yaml')) ||
    await fs.pathExists(path.join(cwd, 'lerna.json'));
  if (hasWorkspace) return 'monorepo';

  return null;
}

async function createConfigFiles(config: InitConfig, framework?: string | null) {
  // Create js-ds-ui.json config
  const configContent: Record<string, unknown> = {
    $schema: 'https://js-ds-ui.dev/schema.json',
    style: 'default',
    typescript: config.typescript,
    aliases: {
      components: config.componentsPath,
      utils: './src/lib',
      hooks: './src/hooks',
    },
  };

  if (framework) {
    configContent.framework = framework;
  }

  await fs.writeJSON(
    path.join(config.projectPath, 'js-ds-ui.json'),
    configContent,
    { spaces: 2 }
  );

  // Create base CSS file with token imports
  const cssContent = `/* js-ds-ui design tokens */
@import '@js-ds-ui/tokens/css';

/* Default theme: Light */
:root {
  --density-multiplier: 1.0;
}

/* Dark theme */
[data-theme='dark'] {
  /* Dark theme tokens will be added here */
}

/* High contrast theme */
[data-theme='high-contrast'] {
  /* High contrast tokens will be added here */
}

/* Density variants */
[data-density='compact'] {
  --density-multiplier: 0.85;
}

[data-density='comfortable'] {
  --density-multiplier: 1.15;
}

/* Base styles */
* {
  box-sizing: border-box;
}

body {
  font-family: var(--font-family-sans);
  font-size: var(--font-size-base);
  line-height: var(--font-lineHeight-normal);
  color: var(--color-text-primary);
  background-color: var(--color-background-primary);
}
`;

  await fs.writeFile(
    path.join(config.projectPath, config.cssPath, 'tokens.css'),
    cssContent
  );
}

async function installDependencies(config: InitConfig) {
  const baseDeps = [
    'react',
    'react-dom',
    '@js-ds-ui/tokens',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
  ];

  const hasPackageJson = await fs.pathExists(
    path.join(config.projectPath, 'package.json')
  );

  if (!hasPackageJson) {
    throw new Error('No package.json found. Please run npm init first.');
  }

  // Detect package manager
  const hasPnpm = await fs.pathExists(
    path.join(config.projectPath, 'pnpm-lock.yaml')
  );
  const hasYarn = await fs.pathExists(
    path.join(config.projectPath, 'yarn.lock')
  );

  const pm = hasPnpm ? 'pnpm' : hasYarn ? 'yarn' : 'npm';

  await execa(pm, ['add', ...baseDeps], {
    cwd: config.projectPath,
    stdio: 'inherit',
  });
}

async function setupTsconfigAliases(config: InitConfig) {
  const tsconfigPath = path.join(config.projectPath, 'tsconfig.json');
  const hasTsconfig = await fs.pathExists(tsconfigPath);

  if (!hasTsconfig) {
    p.log.warn(
      'No tsconfig.json found. You will need to manually configure path aliases so that ' +
        pc.cyan('@/*') +
        ' resolves to ' +
        pc.cyan('./src/*') +
        '.'
    );
    return;
  }

  try {
    const raw = await fs.readFile(tsconfigPath, 'utf-8');
    const tsconfig = JSON.parse(raw);

    if (!tsconfig.compilerOptions) {
      tsconfig.compilerOptions = {};
    }

    tsconfig.compilerOptions.baseUrl = '.';

    if (!tsconfig.compilerOptions.paths) {
      tsconfig.compilerOptions.paths = {};
    }

    tsconfig.compilerOptions.paths['@/*'] = ['./src/*'];

    await fs.writeJSON(tsconfigPath, tsconfig, { spaces: 2 });
    p.log.success('Updated tsconfig.json with path aliases (' + pc.cyan('@/* → ./src/*') + ')');
  } catch {
    p.log.warn(
      'Could not update tsconfig.json automatically. Please add the following manually:\n' +
        pc.cyan('  "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["./src/*"] } }')
    );
  }
}
