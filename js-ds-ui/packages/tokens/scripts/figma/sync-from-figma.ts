#!/usr/bin/env tsx

/**
 * Figma -> Code Token Sync
 *
 * Pulls Figma Variables and generates DTCG-format token JSON files.
 * This is the reverse direction of sync-to-figma.ts.
 *
 * Usage:
 *   FIGMA_ACCESS_TOKEN=xxx FIGMA_FILE_KEY=yyy tsx scripts/figma/sync-from-figma.ts
 *
 * Environment variables:
 *   FIGMA_ACCESS_TOKEN - Personal access token with file:read scope
 *   FIGMA_FILE_KEY - Figma file key
 *   DRY_RUN - Set to "true" to preview without writing files (default: true)
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { tierToCollectionName } from './dtcg-to-figma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOKENS_SRC = path.join(__dirname, '../../src');

const FIGMA_API_BASE = 'https://api.figma.com/v1';
const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN || '';
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY || '';
const DRY_RUN = process.env.DRY_RUN !== 'false';

/** Map Figma resolvedType back to DTCG $type */
function figmaTypeToDTCG(resolvedType: string, name: string): string {
  switch (resolvedType) {
    case 'COLOR':
      return 'color';
    case 'FLOAT': {
      if (
        name.includes('z-index') ||
        name.includes('lineHeight') ||
        name.includes('opacity')
      )
        return 'number';
      if (name.includes('weight')) return 'fontWeight';
      if (name.includes('duration')) return 'duration';
      return 'dimension';
    }
    case 'STRING': {
      if (name.includes('family')) return 'fontFamily';
      if (name.includes('easing')) return 'cubicBezier';
      if (name.includes('shadow')) return 'shadow';
      return 'string';
    }
    case 'BOOLEAN':
      return 'boolean';
    default:
      return 'string';
  }
}

/** Map Figma collection name back to tier directory */
function collectionToTier(name: string): string {
  const lower = name.toLowerCase();
  if (lower === 'primitives' || lower === 'primitive') return 'primitives';
  if (lower === 'semantic' || lower === 'semantics') return 'semantic';
  if (lower === 'component' || lower === 'components') return 'component';
  return lower;
}

/** Convert Figma RGBA to color string */
function rgbaToColorString(color: {
  r: number;
  g: number;
  b: number;
  a: number;
}): string {
  // Convert to hex for now -- full OKLCH conversion would need culori
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);

  if (color.a < 1) {
    return `rgba(${r}, ${g}, ${b}, ${color.a.toFixed(2)})`;
  }
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/** Build nested DTCG object from flat variable list */
function buildDTCGObject(
  variables: Array<{
    name: string;
    type: string;
    value: unknown;
    description: string;
  }>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const variable of variables) {
    const parts = variable.name.split('/');
    let current = result;

    // Build nested path
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]] as Record<string, unknown>;
    }

    const leafKey = parts[parts.length - 1];
    const dtcgType = figmaTypeToDTCG(variable.type, variable.name);

    current[leafKey] = {
      $type: dtcgType,
      $value: variable.value,
      ...(variable.description ? { $description: variable.description } : {}),
    };
  }

  return result;
}

async function main() {
  console.log('Figma -> Code Token Sync');
  console.log('=======================\n');

  if (!FIGMA_ACCESS_TOKEN || !FIGMA_FILE_KEY) {
    console.error(
      'Error: FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY environment variables are required.'
    );
    process.exit(1);
  }

  // Fetch variables from Figma
  console.log('Fetching variables from Figma...');
  const response = await fetch(
    `${FIGMA_API_BASE}/files/${FIGMA_FILE_KEY}/variables/local`,
    {
      headers: { 'X-Figma-Token': FIGMA_ACCESS_TOKEN },
    }
  );

  if (!response.ok) {
    console.error(`Failed: ${response.status} ${await response.text()}`);
    process.exit(1);
  }

  const data = await response.json();
  const collections = data.meta?.variableCollections || {};
  const variables = data.meta?.variables || {};

  console.log(
    `Found ${Object.keys(collections).length} collections, ${Object.keys(variables).length} variables\n`
  );

  // Group variables by collection
  for (const [collectionId, collection] of Object.entries(collections) as any[]) {
    const collectionVars = Object.values(variables).filter(
      (v: any) => v.variableCollectionId === collectionId
    ) as any[];

    const tier = collectionToTier(collection.name);
    const defaultMode = collection.modes[0];

    console.log(
      `${collection.name} (${tier}): ${collectionVars.length} variables`
    );

    // Convert variables to DTCG format
    const dtcgVars = collectionVars.map((v: any) => {
      const modeValue = v.valuesByMode[defaultMode.modeId];
      let value: unknown;

      if (
        modeValue &&
        typeof modeValue === 'object' &&
        modeValue.type === 'VARIABLE_ALIAS'
      ) {
        // Reference to another variable
        const referencedVar = variables[modeValue.id] as any;
        if (referencedVar) {
          value = `{${referencedVar.name.replace(/\//g, '.')}}`;
        } else {
          value = modeValue;
        }
      } else if (
        v.resolvedType === 'COLOR' &&
        typeof modeValue === 'object'
      ) {
        value = rgbaToColorString(modeValue);
      } else if (v.resolvedType === 'FLOAT') {
        // Add 'rem' suffix for dimension tokens
        const name = v.name.toLowerCase();
        if (
          name.includes('z-index') ||
          name.includes('opacity') ||
          name.includes('lineheight')
        ) {
          value = modeValue;
        } else {
          value = `${modeValue / 16}rem`;
        }
      } else {
        value = modeValue;
      }

      return {
        name: v.name,
        type: v.resolvedType,
        value,
        description: v.description || '',
      };
    });

    const dtcgObject = buildDTCGObject(dtcgVars);

    if (DRY_RUN) {
      const previewPath = path.join(
        __dirname,
        `../../.figma-pull-preview-${tier}.json`
      );
      await fs.writeFile(previewPath, JSON.stringify(dtcgObject, null, 2));
      console.log(`  Preview: ${previewPath}`);
    } else {
      // Write to appropriate tier files
      // Group by top-level key to split into files
      for (const [topKey, tokens] of Object.entries(dtcgObject)) {
        const filePath = path.join(TOKENS_SRC, tier, `${topKey}.json`);
        const existing = await fs
          .readFile(filePath, 'utf-8')
          .catch(() => '{}');
        const merged = { ...JSON.parse(existing), [topKey]: tokens };
        await fs.writeFile(
          filePath,
          JSON.stringify(merged, null, 2) + '\n'
        );
        console.log(`  Written: ${filePath}`);
      }
    }
  }

  if (DRY_RUN) {
    console.log(
      '\n[DRY RUN] No files were modified. Set DRY_RUN=false to write files.'
    );
  } else {
    console.log('\nTokens synced from Figma to code!');
    console.log('Run `npm run build` to regenerate CSS and type outputs.');
  }
}

main().catch((error) => {
  console.error('Sync failed:', error);
  process.exit(1);
});
