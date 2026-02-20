import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  getAllComponents,
  getComponent,
  REGISTRY,
  type ComponentRegistryItem,
} from '../registry.js';
import { addCommand } from './add.js';
import { resolveTargetPath } from '../utils/paths.js';

export async function mcpCommand() {
  // Create an MCP server
  const server = new McpServer({
    name: 'js-ds-ui',
    version: '0.1.0',
  });

  // Tool: get_components
  // Returns a list of all available components
  server.tool(
    'get_components',
    'List all available components in the js-ds-ui registry',
    {},
    async () => {
      const components = getAllComponents().map((c) => ({
        name: c.name,
        label: c.label,
        description: c.description,
        status: c.status,
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(components, null, 2),
          },
        ],
      };
    }
  );

  // Tool: add_component
  // Adds components to the project
  server.tool(
    'add_component',
    'Add components to the project',
    {
      components: z.array(z.string()).describe('List of component names to add (e.g. ["button", "card"])'),
    },
    async ({ components }) => {
      try {
        // Validate components exist
        const invalidComponents = components.filter((name) => !REGISTRY[name]);
        if (invalidComponents.length > 0) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: The following components do not exist in the registry: ${invalidComponents.join(', ')}`,
              },
            ],
            isError: true,
          };
        }

        // We can't easily interact with stdio Prompts in MCP mode usually,
        // but addCommand implementation might need refactoring if it relies heavily on interactive prompts 
        // when arguments ARE provided.
        // 
        // Checking addCommand implementation:
        // if (components) it skips multiselect.
        // It uses ora/clack for output. Stdio transport captures stdout.
        // We need to be careful about JSON-RPC interference.
        //
        // Ideally, we would silence standard output logging or redirect it, 
        // but for a simple "add" command that writes files, we primarily want the side effect.
        //
        // HOWEVER: The MCP stdout transport relies on standard output for protocol messages.
        // Any console.log from addCommand WILL corrupt the protocol stream.
        //
        // CRITICAL FIX: We must NOT call the existing console-logging addCommand directly if we are serving over Stdio.
        // We should replicate the logic without the UI/logging.

        await addComponentsSilent(components);

        return {
          content: [
            {
              type: 'text',
              text: `Successfully added components: ${components.join(', ')}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to add components: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool: get_component_docs
  // Returns docs/usage for a component
  server.tool(
    'get_component_docs',
    'Get documentation and usage examples for a component',
    {
      component: z.string().describe('Component name'),
    },
    async ({ component }) => {
        const item = getComponent(component);
        if(!item) {
             return {
                content: [
                  {
                    type: 'text',
                    text: `Component "${component}" not found.`,
                  },
                ],
                isError: true,
              };
        }
        
        // Construct a simple doc string since we don't have separate doc files in the registry yet
        // In a real scenario, this might read from a docs markdown file
        const docs = `
# ${item.label} (${item.name})

${item.description}

Status: ${item.status}
Since: ${item.since}

## Dependencies
${item.dependencies.length ? item.dependencies.join(', ') : 'None'}

## Installation
Run: npx js-ds-ui add ${item.name}

## Files
${item.files.map(f => `- ${f.path}`).join('\n')}
        `;

         return {
            content: [
              {
                type: 'text',
                text: docs.trim(),
              },
            ],
          };

    }
  );

  // Connect to transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
}


// Re-implementing add logic without console logs to avoid breaking MCP/Stdio
import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import { resolveComponentDependencies } from '../registry.js';
import { getComponentTemplate } from '../templates/index.js';

async function addComponentsSilent(componentNames: string[]) {
    // 1. Load config
    const configPath = path.join(process.cwd(), 'js-ds-ui.json');
    if (!await fs.pathExists(configPath)) {
        throw new Error('No js-ds-ui.json found. Please initialization the project first.');
    }
    const config = await fs.readJSON(configPath);

    // 2. Resolve dependencies
    const allComponentsToAdd = new Set<string>();
    componentNames.forEach((name) => {
        const deps = resolveComponentDependencies(name);
        deps.forEach((dep) => allComponentsToAdd.add(dep));
    });
    const componentList = Array.from(allComponentsToAdd);

    // 3. Install NPM dependencies
    const allDeps = new Set<string>();
    componentList.forEach((name) => {
        const component = getComponent(name);
        if (component) {
        Object.keys(component.npmDependencies).forEach((dep) => allDeps.add(dep));
        }
    });

    if (allDeps.size > 0) {
        const deps = Array.from(allDeps);
        const hasPnpm = await fs.pathExists(path.join(process.cwd(), 'pnpm-lock.yaml'));
        const hasYarn = await fs.pathExists(path.join(process.cwd(), 'yarn.lock'));
        const pm = hasPnpm ? 'pnpm' : hasYarn ? 'yarn' : 'npm';
        
        // We must pipe stdio to ignore it or stderr to avoid corrupting stdout
        await execa(pm, ['add', ...deps], {
            cwd: process.cwd(),
            stdio: 'ignore', 
        });
    }

    // 4. Copy files
    for (const name of componentList) {
        const component = getComponent(name);
        if (!component) continue;
      
        for (const file of component.files) {
          const template = getComponentTemplate(name, config.typescript);
          const targetPath = resolveTargetPath(file.path, config.aliases);
      
          await fs.ensureDir(path.dirname(targetPath));
          await fs.writeFile(targetPath, template);
        }
    }

    // 5. Update config
    if (!config.installedComponents) {
        config.installedComponents = {};
    }
    for (const name of componentList) {
        config.installedComponents[name] = {
            version: '0.1.0',
            installedAt: new Date().toISOString(),
        };
    }
    await fs.writeJSON(configPath, config, { spaces: 2 });
}


// resolveTargetPath imported from ../utils/paths.js
