#!/usr/bin/env tsx

/**
 * Figma Token Sync Script
 *
 * Pushes DTCG design tokens from code to Figma Variables API.
 *
 * Usage:
 *   FIGMA_ACCESS_TOKEN=xxx FIGMA_FILE_KEY=yyy tsx scripts/figma/sync-to-figma.ts
 *
 * Environment variables:
 *   FIGMA_ACCESS_TOKEN - Personal access token with variables:write scope
 *   FIGMA_FILE_KEY - Figma file key (from URL: figma.com/file/<KEY>/...)
 *   DRY_RUN - Set to "true" to preview without pushing (default: true)
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  flattenTokens,
  tierToCollectionName,
  mapDTCGTypeToFigma,
  mapDTCGTypeToScopes,
  isTokenReference,
  extractReferencePath,
  parseDimensionToFloat,
  type FlatToken,
  type FigmaCollection,
  type FigmaVariable,
  type FigmaMode,
  type FigmaVariableValue,
} from './dtcg-to-figma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOKENS_SRC = path.join(__dirname, '../../src');

// Figma API config
const FIGMA_API_BASE = 'https://api.figma.com/v1';
const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN || '';
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY || '';
const DRY_RUN = process.env.DRY_RUN !== 'false';

/** Theme/density modes for Figma variable modes */
const THEME_MODES: FigmaMode[] = [
  { name: 'Light' },
  { name: 'Dark' },
  { name: 'High Contrast' },
];

const DENSITY_MODES: FigmaMode[] = [
  { name: 'Compact' },
  { name: 'Default' },
  { name: 'Comfortable' },
];

interface TokenFile {
  tier: string;
  filename: string;
  filePath: string;
}

/**
 * Discover all token JSON files organized by tier.
 */
async function discoverTokenFiles(): Promise<TokenFile[]> {
  const tiers = ['primitives', 'semantic', 'component'];
  const files: TokenFile[] = [];

  for (const tier of tiers) {
    const tierDir = path.join(TOKENS_SRC, tier);
    try {
      const entries = await fs.readdir(tierDir);
      for (const entry of entries) {
        if (entry.endsWith('.json')) {
          files.push({
            tier,
            filename: entry,
            filePath: path.join(tierDir, entry),
          });
        }
      }
    } catch {
      // Tier directory doesn't exist, skip
    }
  }

  return files;
}

/**
 * Load and flatten all tokens from a tier.
 */
async function loadTierTokens(files: TokenFile[]): Promise<FlatToken[]> {
  const allTokens: FlatToken[] = [];

  for (const file of files) {
    const content = await fs.readFile(file.filePath, 'utf-8');
    const json = JSON.parse(content);
    const tokens = flattenTokens(json);
    allTokens.push(...tokens);
  }

  return allTokens;
}

/**
 * Build Figma variable collections from DTCG tokens.
 */
function buildCollections(
  tokensByTier: Map<string, FlatToken[]>
): FigmaCollection[] {
  const collections: FigmaCollection[] = [];

  for (const [tier, tokens] of tokensByTier) {
    const collectionName = tierToCollectionName(tier);

    // Determine modes based on tier
    let modes: FigmaMode[];
    if (tier === 'semantic') {
      modes = THEME_MODES;
    } else if (tier === 'component') {
      modes = DENSITY_MODES;
    } else {
      modes = [{ name: 'Default' }];
    }

    const variables: FigmaVariable[] = tokens.map((token) => {
      const resolvedType = mapDTCGTypeToFigma(token.$type);
      const scopes = mapDTCGTypeToScopes(token.$type, token.path);

      // Build values for each mode
      const valuesByMode: Record<string, FigmaVariableValue> = {};

      for (const mode of modes) {
        if (isTokenReference(token.$value as string)) {
          // Alias to another variable
          const refPath = extractReferencePath(token.$value as string);
          valuesByMode[mode.name] = {
            type: 'alias',
            collectionName: collectionName, // Same collection for now
            variableName: refPath.join('/'),
          };
        } else {
          // Literal value
          let value: FigmaVariableValue['type'] extends 'literal'
            ? unknown
            : never;

          if (resolvedType === 'FLOAT') {
            const parsed = parseDimensionToFloat(String(token.$value));
            value = parsed ?? 0;
          } else if (resolvedType === 'COLOR') {
            // Color values need OKLCH conversion
            value = String(token.$value);
          } else {
            value =
              typeof token.$value === 'object'
                ? JSON.stringify(token.$value)
                : String(token.$value);
          }

          valuesByMode[mode.name] = {
            type: 'literal',
            value: value as string | number | boolean,
          };
        }
      }

      return {
        name: token.name,
        resolvedType,
        description: token.$description,
        valuesByMode,
        scopes,
      };
    });

    collections.push({
      name: collectionName,
      modes,
      variables,
    });
  }

  return collections;
}

/**
 * Push collections to Figma Variables API.
 */
async function pushToFigma(collections: FigmaCollection[]): Promise<void> {
  if (!FIGMA_ACCESS_TOKEN || !FIGMA_FILE_KEY) {
    console.error(
      'Error: FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY environment variables are required.'
    );
    console.error(
      'Usage: FIGMA_ACCESS_TOKEN=xxx FIGMA_FILE_KEY=yyy tsx scripts/figma/sync-to-figma.ts'
    );
    process.exit(1);
  }

  // First, get existing variables to determine create vs update
  const existingResponse = await fetch(
    `${FIGMA_API_BASE}/files/${FIGMA_FILE_KEY}/variables/local`,
    {
      headers: {
        'X-Figma-Token': FIGMA_ACCESS_TOKEN,
      },
    }
  );

  if (!existingResponse.ok) {
    const errorText = await existingResponse.text();
    console.error(
      `Failed to fetch existing variables: ${existingResponse.status} ${errorText}`
    );
    process.exit(1);
  }

  const existingData = await existingResponse.json();
  const existingCollections = existingData.meta?.variableCollections || {};
  const existingVariables = existingData.meta?.variables || {};

  // Build the payload for POST /v1/files/:file_key/variables
  const variableCollections: unknown[] = [];
  const variables: unknown[] = [];
  const variableModes: unknown[] = [];

  for (const collection of collections) {
    // Check if collection already exists
    const existing = Object.values(existingCollections).find(
      (c: any) => c.name === collection.name
    ) as any;

    if (existing) {
      // Update existing modes
      for (const mode of collection.modes) {
        const existingMode = existing.modes.find(
          (m: any) => m.name === mode.name
        );
        if (!existingMode) {
          variableModes.push({
            action: 'CREATE',
            id: `mode_${collection.name}_${mode.name}`.replace(/\s/g, '_'),
            name: mode.name,
            variableCollectionId: existing.id,
          });
        }
      }
    } else {
      // Create new collection
      const tempId = `collection_${collection.name}`.replace(/\s/g, '_');
      variableCollections.push({
        action: 'CREATE',
        id: tempId,
        name: collection.name,
        initialModeId: `mode_${collection.name}_${collection.modes[0].name}`.replace(
          /\s/g,
          '_'
        ),
      });

      // Create modes (skip first, it's the initial mode)
      for (let i = 1; i < collection.modes.length; i++) {
        variableModes.push({
          action: 'CREATE',
          id: `mode_${collection.name}_${collection.modes[i].name}`.replace(
            /\s/g,
            '_'
          ),
          name: collection.modes[i].name,
          variableCollectionId: tempId,
        });
      }
    }

    // Add variables
    for (const variable of collection.variables) {
      const collectionId =
        existing?.id ||
        `collection_${collection.name}`.replace(/\s/g, '_');
      const existingVar = Object.values(existingVariables).find(
        (v: any) =>
          v.name === variable.name &&
          Object.keys(existingCollections).some(
            (cId: string) =>
              (existingCollections as any)[cId].name === collection.name &&
              cId === v.variableCollectionId
          )
      ) as any;

      const variablePayload: Record<string, unknown> = {
        action: existingVar ? 'UPDATE' : 'CREATE',
        id:
          existingVar?.id ||
          `var_${collection.name}_${variable.name}`.replace(/[\s/]/g, '_'),
        name: variable.name,
        resolvedType: variable.resolvedType,
        description: variable.description,
        variableCollectionId: collectionId,
        scopes: variable.scopes,
      };

      // Set values per mode
      const valueModeMap: Record<string, unknown> = {};
      for (const [modeName, modeValue] of Object.entries(
        variable.valuesByMode
      )) {
        const modeId =
          existing?.modes.find((m: any) => m.name === modeName)?.modeId ||
          `mode_${collection.name}_${modeName}`.replace(/\s/g, '_');

        if (modeValue.type === 'alias') {
          valueModeMap[modeId] = {
            type: 'VARIABLE_ALIAS',
            id: `var_${modeValue.collectionName}_${modeValue.variableName}`.replace(
              /[\s/]/g,
              '_'
            ),
          };
        } else {
          valueModeMap[modeId] = modeValue.value;
        }
      }
      variablePayload.variableModeValues = Object.entries(valueModeMap).map(
        ([modeId, value]) => ({ modeId, value })
      );

      variables.push(variablePayload);
    }
  }

  const payload = {
    variableCollections,
    variableModes,
    variables,
  };

  console.log(
    `Pushing ${variables.length} variables across ${collections.length} collections...`
  );

  const response = await fetch(
    `${FIGMA_API_BASE}/files/${FIGMA_FILE_KEY}/variables`,
    {
      method: 'POST',
      headers: {
        'X-Figma-Token': FIGMA_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to push variables: ${response.status} ${errorText}`);
    process.exit(1);
  }

  const result = await response.json();
  console.log('Successfully synced tokens to Figma!');
  console.log(`  Collections: ${variableCollections.length} created`);
  console.log(`  Modes: ${variableModes.length} created`);
  console.log(`  Variables: ${variables.length} created/updated`);
}

/**
 * Main sync function
 */
async function main() {
  console.log('Figma Token Sync');
  console.log('================\n');

  // Discover token files
  const tokenFiles = await discoverTokenFiles();
  console.log(
    `Found ${tokenFiles.length} token files across ${new Set(tokenFiles.map((f) => f.tier)).size} tiers\n`
  );

  // Group by tier and load
  const tokensByTier = new Map<string, FlatToken[]>();
  const tiers = [...new Set(tokenFiles.map((f) => f.tier))];

  for (const tier of tiers) {
    const tierFiles = tokenFiles.filter((f) => f.tier === tier);
    const tokens = await loadTierTokens(tierFiles);
    tokensByTier.set(tier, tokens);
    console.log(
      `  ${tierToCollectionName(tier)}: ${tokens.length} tokens from ${tierFiles.length} files`
    );
  }

  // Build Figma collections
  const collections = buildCollections(tokensByTier);

  console.log('\nFigma Variable Collections:');
  for (const col of collections) {
    console.log(
      `  ${col.name}: ${col.variables.length} variables, ${col.modes.length} modes (${col.modes.map((m) => m.name).join(', ')})`
    );
  }

  if (DRY_RUN) {
    console.log(
      '\n[DRY RUN] Skipping Figma API push. Set DRY_RUN=false to push.'
    );

    // Write preview JSON
    const previewPath = path.join(__dirname, '../../.figma-sync-preview.json');
    await fs.writeFile(previewPath, JSON.stringify(collections, null, 2));
    console.log(`Preview written to ${previewPath}`);
  } else {
    await pushToFigma(collections);
  }
}

main().catch((error) => {
  console.error('Sync failed:', error);
  process.exit(1);
});
