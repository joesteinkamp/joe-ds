import { wcagContrast } from 'culori';
import type { OklchColor, ContrastCheckResult } from './types';

/**
 * Calculate WCAG contrast ratio between two colors
 */
export function getContrastRatio(foreground: OklchColor, background: OklchColor): number {
  const ratio = wcagContrast(foreground, background);
  return ratio ?? 1;
}

/**
 * Check if a color combination passes WCAG requirements
 */
export function checkContrast(
  foreground: OklchColor | string,
  background: OklchColor | string
): ContrastCheckResult {
  const fgColor = typeof foreground === 'string' ? foreground : foreground;
  const bgColor = typeof background === 'string' ? background : background;

  const ratio = wcagContrast(fgColor, bgColor) ?? 1;

  return {
    ratio,
    passes: {
      aa: ratio >= 4.5, // WCAG 2.2 AA for normal text
      aaa: ratio >= 7.0, // WCAG 2.2 AAA for normal text
    },
    foreground: typeof foreground === 'string' ? foreground : `oklch(${foreground.l} ${foreground.c} ${foreground.h})`,
    background: typeof background === 'string' ? background : `oklch(${background.l} ${background.c} ${background.h})`,
  };
}

/**
 * Find a lightness value that achieves target contrast ratio
 */
export function findLightnessForContrast(
  baseColor: OklchColor,
  background: OklchColor,
  targetRatio: number,
  tolerance: number = 0.1
): OklchColor {
  let minL = 0;
  let maxL = 1;
  let iterations = 0;
  const maxIterations = 50;

  while (iterations < maxIterations) {
    const midL = (minL + maxL) / 2;
    const testColor: OklchColor = { ...baseColor, l: midL };
    const ratio = getContrastRatio(testColor, background);

    if (Math.abs(ratio - targetRatio) < tolerance) {
      return testColor;
    }

    if (ratio < targetRatio) {
      // Need more contrast, adjust based on background lightness
      if (background.l > 0.5) {
        maxL = midL; // Darker
      } else {
        minL = midL; // Lighter
      }
    } else {
      // Too much contrast
      if (background.l > 0.5) {
        minL = midL; // Lighter
      } else {
        maxL = midL; // Darker
      }
    }

    iterations++;
  }

  // Return best attempt
  return { ...baseColor, l: (minL + maxL) / 2 };
}

/**
 * Generate accessible text color for a given background
 */
export function getAccessibleTextColor(
  background: OklchColor,
  wcagLevel: 'AA' | 'AAA' = 'AAA'
): OklchColor {
  const targetRatio = wcagLevel === 'AAA' ? 7.0 : 4.5;

  // Try black text first
  const blackText: OklchColor = { mode: 'oklch', l: 0.15, c: 0.02, h: background.h };
  const blackRatio = getContrastRatio(blackText, background);

  if (blackRatio >= targetRatio) {
    return blackText;
  }

  // Try white text
  const whiteText: OklchColor = { mode: 'oklch', l: 0.99, c: 0.01, h: background.h };
  const whiteRatio = getContrastRatio(whiteText, background);

  if (whiteRatio >= targetRatio) {
    return whiteText;
  }

  // Find optimal lightness
  return findLightnessForContrast(
    { mode: 'oklch', l: 0.5, c: 0.02, h: background.h },
    background,
    targetRatio
  );
}
