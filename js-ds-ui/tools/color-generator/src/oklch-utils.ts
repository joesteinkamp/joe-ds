import { oklch, formatHex, formatCss } from 'culori';
import type { OklchColor } from './types';

/**
 * Parse OKLCH string to object
 */
export function parseOklch(oklchString: string): OklchColor {
  const parsed = oklch(oklchString);
  if (!parsed) {
    throw new Error(`Invalid OKLCH color: ${oklchString}`);
  }
  return {
    mode: 'oklch',
    l: parsed.l ?? 0,
    c: parsed.c ?? 0,
    h: parsed.h ?? 0,
    alpha: parsed.alpha,
  };
}

/**
 * Format OKLCH object to CSS string
 */
export function formatOklch(color: OklchColor): string {
  return formatCss(color);
}

/**
 * Convert OKLCH to hex for debugging
 */
export function oklchToHex(color: OklchColor | string): string {
  const parsed = typeof color === 'string' ? parseOklch(color) : color;
  return formatHex(parsed) ?? '#000000';
}

/**
 * Adjust lightness of an OKLCH color
 */
export function adjustLightness(color: OklchColor, lightness: number): OklchColor {
  return {
    ...color,
    l: Math.max(0, Math.min(1, lightness)),
  };
}

/**
 * Adjust chroma of an OKLCH color
 */
export function adjustChroma(color: OklchColor, chroma: number): OklchColor {
  return {
    ...color,
    c: Math.max(0, chroma),
  };
}

/**
 * Create a lighter variant of a color
 */
export function lighten(color: OklchColor, amount: number): OklchColor {
  return adjustLightness(color, color.l + amount);
}

/**
 * Create a darker variant of a color
 */
export function darken(color: OklchColor, amount: number): OklchColor {
  return adjustLightness(color, color.l - amount);
}

/**
 * Interpolate between two OKLCH colors
 */
export function interpolateOklch(
  color1: OklchColor,
  color2: OklchColor,
  t: number
): OklchColor {
  return {
    mode: 'oklch',
    l: color1.l + (color2.l - color1.l) * t,
    c: color1.c + (color2.c - color1.c) * t,
    h: color1.h + (color2.h - color1.h) * t,
  };
}
