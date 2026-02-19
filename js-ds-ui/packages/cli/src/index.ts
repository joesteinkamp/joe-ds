#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { addCommand } from './commands/add.js';
import { listCommand } from './commands/list.js';
import { removeCommand } from './commands/remove.js';
import { diffCommand } from './commands/diff.js';
import { updateCommand } from './commands/update.js';
import { themeCreateCommand } from './commands/theme-create.js';
import { mcpCommand } from './commands/mcp.js';

const program = new Command();

program
  .name('js-ds-ui')
  .description('CLI for js-ds-ui design system')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize js-ds-ui in your project')
  .action(initCommand);

program
  .command('add')
  .description('Add components to your project')
  .argument('[components...]', 'components to add (e.g., button input)')
  .action(addCommand);

program
  .command('list')
  .description('List all available components')
  .action(listCommand);

program
  .command('remove')
  .description('Remove components from your project')
  .argument('[components...]', 'components to remove')
  .action(removeCommand);

program
  .command('diff')
  .description('Show differences between local components and latest templates')
  .argument('[components...]', 'components to diff (defaults to all installed)')
  .action(diffCommand);

program
  .command('update')
  .description('Update installed components to latest templates')
  .argument('[components...]', 'components to update (defaults to all installed)')
  .action(updateCommand);

const themeCmd = program
  .command('theme')
  .description('Theme management commands');

themeCmd
  .command('create')
  .description('Generate a custom theme from brand colors')
  .option('--primary <color>', 'Primary brand color (hex, e.g., #3b82f6)')
  .option('--secondary <color>', 'Secondary color (hex, auto-derived if omitted)')
  .option('--accent <color>', 'Accent color (hex, auto-derived if omitted)')
  .option('--neutral <color>', 'Neutral color (hex, auto-derived if omitted)')
  .option('--name <name>', 'Theme name', 'custom')
  .option('-o, --output <path>', 'Output directory', './theme-output')
  .option('--wcag-level <level>', 'WCAG contrast level (AA or AAA)', 'AAA')
  .option('--format <format>', 'Output format (all, tokens, css)', 'all')
  .action((opts) => {
    themeCreateCommand({
      primary: opts.primary,
      secondary: opts.secondary,
      accent: opts.accent,
      neutral: opts.neutral,
      name: opts.name,
      output: opts.output,
      wcagLevel: opts.wcagLevel,
      format: opts.format,
    });
  });

program
  .command('mcp')
  .description('Start MCP server for js-ds-ui')
  .action(mcpCommand);

program.parse();
