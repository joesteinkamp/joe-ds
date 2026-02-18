/**
 * Type definitions for color generation
 */

export interface OklchColor {
  mode: 'oklch';
  l: number; // Lightness 0-1
  c: number; // Chroma 0-0.4
  h: number; // Hue 0-360
  alpha?: number;
}

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string; // Base color
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface ColorConfig {
  name: string;
  baseColor: string; // OKLCH string
  targetContrasts?: {
    50?: number;
    100?: number;
    200?: number;
    300?: number;
    400?: number;
    500?: number;
    600?: number;
    700?: number;
    800?: number;
    900?: number;
    950?: number;
  };
  overrides?: Partial<ColorScale>;
}

export interface GeneratorConfig {
  colors: ColorConfig[];
  outputPath: string;
  baseBackground?: string; // For contrast calculations
  wcagLevel: 'AA' | 'AAA';
}

export interface ContrastCheckResult {
  ratio: number;
  passes: {
    aa: boolean;
    aaa: boolean;
  };
  foreground: string;
  background: string;
}
