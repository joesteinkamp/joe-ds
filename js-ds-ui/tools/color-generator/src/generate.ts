#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateColorScales, validateColorScale } from './scale-generator.js';
import type { ColorConfig, GeneratorConfig } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configuration for color generation
 * These match the base colors in tokens/src/primitives/colors.json
 */
const colorConfigs: ColorConfig[] = [
  {
    name: 'primary',
    baseColor: 'oklch(0.55 0.22 250)', // Blue
  },
  {
    name: 'secondary',
    baseColor: 'oklch(0.65 0.18 320)', // Purple
  },
  {
    name: 'accent',
    baseColor: 'oklch(0.70 0.20 140)', // Green
  },
  {
    name: 'neutral',
    baseColor: 'oklch(0.55 0.02 250)', // Gray with blue tint
  },
  {
    name: 'success',
    baseColor: 'oklch(0.65 0.18 145)', // Green
  },
  {
    name: 'warning',
    baseColor: 'oklch(0.75 0.15 85)', // Yellow-orange
  },
  {
    name: 'error',
    baseColor: 'oklch(0.60 0.22 25)', // Red
  },
  {
    name: 'info',
    baseColor: 'oklch(0.60 0.18 240)', // Blue
  },
];

const config: GeneratorConfig = {
  colors: colorConfigs,
  outputPath: path.join(__dirname, '../output/generated-colors.json'),
  baseBackground: 'oklch(0.99 0.01 250)', // Light theme background
  wcagLevel: 'AAA',
};

async function main() {
  console.log('🎨 Generating color scales with Leonardo...\n');

  // Generate scales
  const scales = generateColorScales(config.colors);

  // Validate scales
  console.log('📊 Validation Results:\n');
  let allValid = true;

  Object.entries(scales).forEach(([name, scale]) => {
    const validation = validateColorScale(scale, config.wcagLevel);
    const status = validation.valid ? '✅' : '❌';

    console.log(`${status} ${name}`);

    if (!validation.valid) {
      allValid = false;
      validation.issues.forEach((issue) => {
        console.log(`   ⚠️  ${issue}`);
      });
    }
  });

  console.log('');

  // Format output as DTCG-compliant JSON
  const output = {
    $description:
      'Generated color scales using Leonardo - WCAG 2.2 AAA compliant. Safe to edit manually.',
    $type: 'color',
    color: {
      scales: scales,
    },
  };

  // Ensure output directory exists
  await fs.mkdir(path.dirname(config.outputPath), { recursive: true });

  // Write output
  await fs.writeFile(config.outputPath, JSON.stringify(output, null, 2));

  console.log(`✅ Color scales generated: ${config.outputPath}`);
  console.log(
    `\n💡 You can now copy these into packages/tokens/src/primitives/colors.json`
  );
  console.log(`   or create theme-specific color files.\n`);

  if (!allValid) {
    console.warn('⚠️  Some colors failed WCAG validation. Review and adjust as needed.\n');
  }

  // Also generate a visual preview (HTML)
  const htmlPreview = generateHtmlPreview(scales);
  const htmlPath = path.join(__dirname, '../output/preview.html');
  await fs.writeFile(htmlPath, htmlPreview);
  console.log(`📊 Visual preview generated: ${htmlPath}\n`);
}

function generateHtmlPreview(scales: Record<string, any>): string {
  const swatches = Object.entries(scales)
    .map(([name, scale]) => {
      const steps = Object.entries(scale as Record<string, string>)
        .map(
          ([step, color]) => `
        <div style="display: flex; align-items: center; margin: 4px 0;">
          <div style="width: 60px; height: 40px; background: ${color}; border: 1px solid #ddd; border-radius: 4px;"></div>
          <div style="margin-left: 12px; font-family: monospace; font-size: 12px;">
            <div style="font-weight: 600;">${step}</div>
            <div style="color: #666;">${color}</div>
          </div>
        </div>
      `
        )
        .join('');

      return `
        <div style="margin-bottom: 32px;">
          <h2 style="font-family: system-ui; font-size: 18px; margin-bottom: 16px; text-transform: capitalize;">${name}</h2>
          ${steps}
        </div>
      `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Color Scale Preview - js-ds-ui</title>
</head>
<body style="font-family: system-ui; padding: 40px; background: #fafafa;">
  <h1 style="font-size: 24px; margin-bottom: 8px;">js-ds-ui Color Scales</h1>
  <p style="color: #666; margin-bottom: 40px;">Generated with Leonardo + OKLCH</p>
  ${swatches}
</body>
</html>
  `;
}

main().catch((error) => {
  console.error('Error generating colors:', error);
  process.exit(1);
});
