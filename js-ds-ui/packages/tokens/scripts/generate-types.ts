import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate additional TypeScript types for density and theme
 */
async function generateTypes() {
  const densityTypes = `
// Density system types
export type DensityLevel = 'compact' | 'default' | 'comfortable';

export interface DensityConfig {
  multiplier: number;
  label: string;
}

export const DENSITY_MULTIPLIERS: Record<DensityLevel, DensityConfig> = {
  compact: { multiplier: 0.85, label: 'Compact' },
  default: { multiplier: 1.0, label: 'Default' },
  comfortable: { multiplier: 1.15, label: 'Comfortable' },
};

export function getDensityMultiplier(level: DensityLevel): number {
  return DENSITY_MULTIPLIERS[level].multiplier;
}
`;

  const themeTypes = `
// Theme system types
export type ThemeMode = 'light' | 'dark' | 'high-contrast';

export interface ThemeConfig {
  mode: ThemeMode;
  density?: DensityLevel;
}

export const THEME_MODES: readonly ThemeMode[] = ['light', 'dark', 'high-contrast'] as const;
`;

  const indexContent = `
// Main exports for @js-ds-ui/tokens
export * from './tokens.js';
export * from './types.js';

${densityTypes}

${themeTypes}
`;

  await fs.writeFile(path.join(__dirname, '../dist/index.d.ts'), indexContent);
  await fs.writeFile(
    path.join(__dirname, '../dist/index.js'),
    `export * from './tokens.js';\n`
  );

  console.log('✅ Generated additional TypeScript types');
}

generateTypes().catch((error) => {
  console.error('Error generating types:', error);
  process.exit(1);
});
