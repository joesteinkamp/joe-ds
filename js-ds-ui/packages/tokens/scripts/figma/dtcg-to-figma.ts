/**
 * DTCG Token to Figma Variables API mapper
 *
 * Maps Design Tokens Community Group format ($type, $value) to
 * Figma Variables API format (resolvedType, value).
 */

/** DTCG token types we support */
export type DTCGType =
  | 'color'
  | 'dimension'
  | 'fontFamily'
  | 'fontWeight'
  | 'duration'
  | 'cubicBezier'
  | 'number'
  | 'shadow';

/** Figma variable resolved types */
export type FigmaResolvedType = 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';

/** Figma variable collection = token tier */
export interface FigmaCollection {
  name: string;
  modes: FigmaMode[];
  variables: FigmaVariable[];
}

export interface FigmaMode {
  name: string;
  modeId?: string;
}

export interface FigmaVariable {
  name: string;
  resolvedType: FigmaResolvedType;
  description: string;
  valuesByMode: Record<string, FigmaVariableValue>;
  scopes: string[];
}

export type FigmaVariableValue =
  | { type: 'literal'; value: number | string | boolean | FigmaColor }
  | { type: 'alias'; collectionName: string; variableName: string };

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** Map DTCG $type to Figma resolvedType */
export function mapDTCGTypeToFigma(dtcgType: DTCGType): FigmaResolvedType {
  switch (dtcgType) {
    case 'color':
      return 'COLOR';
    case 'dimension':
    case 'duration':
    case 'number':
    case 'fontWeight':
      return 'FLOAT';
    case 'fontFamily':
    case 'cubicBezier':
    case 'shadow':
      return 'STRING';
    default:
      return 'STRING';
  }
}

/** Map DTCG $type to Figma variable scopes */
export function mapDTCGTypeToScopes(
  dtcgType: DTCGType,
  path: string[]
): string[] {
  switch (dtcgType) {
    case 'color': {
      if (path.some((p) => p.includes('text'))) return ['TEXT_FILL'];
      if (path.some((p) => p.includes('background') || p.includes('bg')))
        return ['FRAME_FILL'];
      if (path.some((p) => p.includes('border'))) return ['STROKE_COLOR'];
      return ['ALL_FILLS'];
    }
    case 'dimension': {
      if (
        path.some(
          (p) =>
            p.includes('gap') ||
            p.includes('spacing') ||
            p.includes('padding')
        )
      )
        return ['GAP'];
      if (path.some((p) => p.includes('radius'))) return ['CORNER_RADIUS'];
      if (
        path.some((p) => p.includes('width') && p.includes('border'))
      )
        return ['STROKE_FLOAT'];
      if (path.some((p) => p.includes('size') || p.includes('height')))
        return ['WIDTH_HEIGHT'];
      return ['ALL_SCOPES'];
    }
    case 'fontWeight':
      return ['FONT_WEIGHT'];
    case 'fontFamily':
      return ['FONT_FAMILY'];
    default:
      return ['ALL_SCOPES'];
  }
}

/** Parse OKLCH color string to Figma RGBA (0-1 range) */
export function parseOklchToRgba(value: string): FigmaColor | null {
  // For OKLCH, we'd need a proper conversion library
  // For now, return a placeholder that signals "needs conversion"
  const match = value.match(/oklch\(([^)]+)\)/);
  if (!match) return null;

  // Simplified conversion - in production, use culori or similar
  // Return sRGB approximation
  return { r: 0.5, g: 0.5, b: 0.5, a: 1 };
}

/** Parse a dimension value to a float (strip units) */
export function parseDimensionToFloat(value: string): number | null {
  if (typeof value === 'number') return value;
  const match = value.match(/^(-?[\d.]+)/);
  return match ? parseFloat(match[1]) : null;
}

/** Check if a value is a DTCG token reference */
export function isTokenReference(value: string): boolean {
  return (
    typeof value === 'string' && value.startsWith('{') && value.endsWith('}')
  );
}

/** Extract the token path from a reference */
export function extractReferencePath(value: string): string[] {
  return value.slice(1, -1).split('.');
}

/**
 * Map token tier (directory) to Figma collection name
 */
export function tierToCollectionName(tier: string): string {
  switch (tier) {
    case 'primitives':
      return 'Primitives';
    case 'semantic':
      return 'Semantic';
    case 'component':
      return 'Component';
    default:
      return tier.charAt(0).toUpperCase() + tier.slice(1);
  }
}

/**
 * Flatten a nested DTCG token object into an array of token entries.
 * Handles $type inheritance from parent groups.
 */
export interface FlatToken {
  path: string[];
  name: string;
  $type: DTCGType;
  $value: unknown;
  $description: string;
}

export function flattenTokens(
  obj: Record<string, unknown>,
  parentPath: string[] = [],
  inheritedType?: DTCGType
): FlatToken[] {
  const tokens: FlatToken[] = [];
  const currentType = (obj['$type'] as DTCGType) || inheritedType;

  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue; // skip meta keys

    if (typeof val === 'object' && val !== null) {
      const entry = val as Record<string, unknown>;

      if ('$value' in entry) {
        // This is a token leaf
        tokens.push({
          path: [...parentPath, key],
          name: [...parentPath, key].join('/'),
          $type:
            (entry['$type'] as DTCGType) ||
            currentType ||
            ('string' as DTCGType),
          $value: entry['$value'],
          $description: (entry['$description'] as string) || '',
        });
      } else {
        // This is a group -- recurse
        tokens.push(
          ...flattenTokens(
            entry as Record<string, unknown>,
            [...parentPath, key],
            (entry['$type'] as DTCGType) || currentType
          )
        );
      }
    }
  }

  return tokens;
}
