import { BackgroundColor, Color, Theme } from '@adobe/leonardo-contrast-colors';
import { parseOklch, formatOklch, adjustLightness, oklchToHex } from './oklch-utils';
import { getContrastRatio } from './contrast';
import type { ColorScale, ColorConfig, OklchColor } from './types';

/**
 * Default contrast ratios for each scale step
 * Based on Material Design and Radix Colors approaches
 */
const DEFAULT_CONTRAST_RATIOS = {
  50: 1.05, // Nearly white
  100: 1.15,
  200: 1.3,
  300: 1.6,
  400: 2.5,
  500: 4.5, // Base - meets AA for text
  600: 7.0, // Meets AAA for text
  700: 10.0,
  800: 13.0,
  900: 15.0,
  950: 18.0, // Nearly black
};

/**
 * Generate a color scale from a base OKLCH color using Leonardo
 */
export function generateColorScale(config: ColorConfig): ColorScale {
  const baseColor = parseOklch(config.baseColor);
  const background: OklchColor = { mode: 'oklch', l: 0.99, c: 0.01, h: baseColor.h };

  // Use Leonardo to generate colors with target contrast ratios
  const bgColor = new BackgroundColor({
    name: 'background',
    colorKeys: [oklchToHex(background)],
    ratios: [1],
  });

  const colorKeys = [oklchToHex(baseColor)];
  const targetContrasts = config.targetContrasts || DEFAULT_CONTRAST_RATIOS;

  // Generate scale using Leonardo
  const leonardoColor = new Color({
    name: config.name,
    colorKeys,
    ratios: targetContrasts,
    smooth: true, // Enable smooth interpolation
  });

  const theme = new Theme({
    colors: [leonardoColor],
    backgroundColor: bgColor,
    lightness: Math.round(background.l * 100),
    output: 'HEX',
  });

  const generatedPairs = theme.contrastColorPairs as Record<string, string>;

  // Build the scale object
  const scale: ColorScale = {
    50: generatedPairs['50'] || formatOklch(adjustLightness(baseColor, 0.95)),
    100: generatedPairs['100'] || formatOklch(adjustLightness(baseColor, 0.90)),
    200: generatedPairs['200'] || formatOklch(adjustLightness(baseColor, 0.85)),
    300: generatedPairs['300'] || formatOklch(adjustLightness(baseColor, 0.75)),
    400: generatedPairs['400'] || formatOklch(adjustLightness(baseColor, 0.65)),
    500: generatedPairs['500'] || config.baseColor,
    600: generatedPairs['600'] || formatOklch(adjustLightness(baseColor, 0.45)),
    700: generatedPairs['700'] || formatOklch(adjustLightness(baseColor, 0.35)),
    800: generatedPairs['800'] || formatOklch(adjustLightness(baseColor, 0.25)),
    900: generatedPairs['900'] || formatOklch(adjustLightness(baseColor, 0.15)),
    950: generatedPairs['950'] || formatOklch(adjustLightness(baseColor, 0.10)),
  };

  // Apply manual overrides if provided
  if (config.overrides) {
    Object.entries(config.overrides).forEach(([key, value]) => {
      if (value) {
        scale[key as keyof ColorScale] = value;
      }
    });
  }

  return scale;
}

/**
 * Validate a color scale for accessibility
 */
export function validateColorScale(
  scale: ColorScale,
  wcagLevel: 'AA' | 'AAA' = 'AAA'
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const targetRatio = wcagLevel === 'AAA' ? 7.0 : 4.5;
  const background: OklchColor = { mode: 'oklch', l: 0.99, c: 0.01, h: 250 };

  // Check 600+ shades can be used for text
  const textShades: (keyof ColorScale)[] = ['600', '700', '800', '900', '950'];

  textShades.forEach((shade) => {
    const color = parseOklch(scale[shade]);
    const ratio = getContrastRatio(color, background);

    if (ratio < targetRatio) {
      issues.push(
        `Shade ${shade} has insufficient contrast (${ratio.toFixed(2)}:1, needs ${targetRatio}:1)`
      );
    }
  });

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Generate multiple color scales
 */
export function generateColorScales(configs: ColorConfig[]): Record<string, ColorScale> {
  const scales: Record<string, ColorScale> = {};

  configs.forEach((config) => {
    scales[config.name] = generateColorScale(config);
  });

  return scales;
}
