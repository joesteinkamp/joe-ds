import StyleDictionary from 'style-dictionary';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Color Conversion Helpers ────────────────────────────────────────

/** Convert OKLCH string to [r, g, b] in 0-255 range */
function oklchToRgb(oklchStr) {
  const match = oklchStr.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
  if (!match) return null;

  const L = parseFloat(match[1]);
  const C = parseFloat(match[2]);
  const H = parseFloat(match[3]);

  // OKLCH → OKLab (polar → cartesian)
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  // OKLab → LMS (cube-root space)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  // Undo cube root
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  // LMS → linear sRGB
  const rLin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  // Linear sRGB → sRGB (gamma correction)
  const gamma = (c) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

  return [
    Math.max(0, Math.min(255, Math.round(gamma(rLin) * 255))),
    Math.max(0, Math.min(255, Math.round(gamma(gLin) * 255))),
    Math.max(0, Math.min(255, Math.round(gamma(bLin) * 255))),
  ];
}

/** Parse any CSS color value to { r, g, b, a } (0-255 / 0-1) */
function parseColor(value) {
  if (typeof value !== 'string') return null;

  if (value.startsWith('oklch(')) {
    const rgb = oklchToRgb(value);
    if (rgb) return { r: rgb[0], g: rgb[1], b: rgb[2], a: 1 };
  }

  const rgbaMatch = value.match(
    /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)/
  );
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1]),
      g: parseInt(rgbaMatch[2]),
      b: parseInt(rgbaMatch[3]),
      a: rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1,
    };
  }

  const hexMatch = value.match(/^#([0-9a-fA-F]{6,8})$/);
  if (hexMatch) {
    const hex = hexMatch[1];
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1,
    };
  }

  return null;
}

/** Convert any color value to #RRGGBB or #RRGGBBAA hex string */
function colorToHex(value) {
  const c = parseColor(value);
  if (!c) return value;
  const hex = (n) => n.toString(16).padStart(2, '0');
  const base = `#${hex(c.r)}${hex(c.g)}${hex(c.b)}`;
  return c.a < 1 ? `${base}${hex(Math.round(c.a * 255))}` : base;
}

// ─── Dimension Conversion Helpers ────────────────────────────────────

/** Extract a static numeric pt/dp value from a rem/px dimension string. Returns number or null. */
function remToNumericPt(value) {
  if (typeof value !== 'string') return null;

  // clamp(min, preferred, max) → use the preferred (middle) value
  const clampMatch = value.match(/clamp\(\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/);
  if (clampMatch) {
    const preferred = clampMatch[2].trim();
    const remMatch = preferred.match(/([\d.]+)\s*rem/);
    if (remMatch) return parseFloat(remMatch[1]) * 16;
    // Fallback to min value
    const minMatch = clampMatch[1].trim().match(/([\d.]+)\s*rem/);
    if (minMatch) return parseFloat(minMatch[1]) * 16;
  }

  // calc(...) → extract first rem value
  if (value.includes('calc(')) {
    const remMatch = value.match(/([\d.]+)\s*rem/);
    if (remMatch) return parseFloat(remMatch[1]) * 16;
  }

  // Simple rem
  const remMatch = value.match(/^([\d.]+)\s*rem$/);
  if (remMatch) return parseFloat(remMatch[1]) * 16;

  // px
  const pxMatch = value.match(/^(-?[\d.]+)\s*px$/);
  if (pxMatch) return parseFloat(pxMatch[1]);

  return null;
}

/** Convert kebab-case to camelCase */
function toCamelCase(str) {
  return str.replace(/[-.](\w)/g, (_, c) => c.toUpperCase());
}

/** Convert kebab-case to PascalCase */
function toPascalCase(str) {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

// ─── CSS Transforms (existing) ───────────────────────────────────────

StyleDictionary.registerTransform({
  name: 'size/pxToRem/preserve-calc',
  type: 'value',
  transitive: true,
  filter: (token) => {
    return token.$type === 'dimension' && typeof token.$value === 'string';
  },
  transform: (token) => {
    if (
      token.$value.includes('calc(') ||
      token.$value.includes('clamp(') ||
      token.$value.includes('var(')
    ) {
      return token.$value;
    }
    return token.$value;
  },
});

StyleDictionary.registerTransform({
  name: 'name/css-var',
  type: 'name',
  transform: (token) => {
    return `--${token.path.join('-')}`;
  },
});

StyleDictionary.registerTransform({
  name: 'cubicBezier/css',
  type: 'value',
  filter: (token) => token.$type === 'cubicBezier',
  transform: (token) => {
    if (Array.isArray(token.$value)) {
      return `cubic-bezier(${token.$value.join(', ')})`;
    }
    return token.$value;
  },
});

StyleDictionary.registerTransform({
  name: 'shadow/css',
  type: 'value',
  filter: (token) => token.$type === 'shadow',
  transform: (token) => {
    const v = token.$value;
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      return `${v.offsetX} ${v.offsetY} ${v.blur} ${v.spread} ${v.color}`;
    }
    return token.$value;
  },
});

// ─── CSS Formats (existing) ──────────────────────────────────────────

/** Convert a DTCG reference string like "{color.neutral.50}" to a CSS var() */
function dtcgRefToCssVar(refValue) {
  return refValue.replace(/\{([^}]+)\}/g, (_, refPath) => {
    return `var(--${refPath.replace(/\./g, '-')})`;
  });
}

StyleDictionary.registerFormat({
  name: 'css/variables-with-fallbacks',
  format: async ({ dictionary, file, options }) => {
    const { default: postcss } = await import('postcss');
    const { default: oklabPlugin } = await import('@csstools/postcss-oklab-function');

    const layerName = options?.layerName || 'tokens';

    const lightVariables = [];
    const darkVariables = [];

    const themes = {};

    dictionary.allTokens.forEach((token) => {
      const name = `--${token.path.join('-')}`;
      const originalValue = token.original?.$value;

      // If the original value contains DTCG references like {color.text.primary},
      // convert them to CSS var() references to preserve the cross-layer cascade.
      // This ensures semantic tokens reference primitives via var(), and component
      // tokens reference semantics via var(), enabling runtime theming.
      let value;
      if (typeof originalValue === 'string' && originalValue.includes('{')) {
        value = dtcgRefToCssVar(originalValue);
      } else {
        value = token.$value;
      }

      lightVariables.push(`    ${name}: ${value};`);

      // Check for theme extensions
      const themeExtensions = token.original?.$extensions?.theme || {};
      Object.entries(themeExtensions).forEach(([theme, themeValue]) => {
        if (!themes[theme]) themes[theme] = [];
        
        const cssValue = typeof themeValue === 'string' && themeValue.includes('{')
          ? dtcgRefToCssVar(themeValue)
          : themeValue;
          
        themes[theme].push(`    ${name}: ${cssValue};`);
      });
    });

    let css = `@layer ${layerName} {\n  :root {\n${lightVariables.join('\n')}\n  }\n`;

    Object.entries(themes).forEach(([theme, variables]) => {
      css += `  [data-theme="${theme}"] {\n${variables.join('\n')}\n  }\n`;
    });

    css += `}\n`;

    const result = await postcss([
      oklabPlugin({
        preserve: true,
        subFeatures: {
          displayP3: false,
        },
      }),
    ]).process(css, { from: undefined });

    return result.css;
  },
});

StyleDictionary.registerFormat({
  name: 'typescript/token-types',
  format: ({ dictionary }) => {
    const tokensByType = {};

    dictionary.allTokens.forEach((token) => {
      const type = token.$type || 'unknown';
      if (!tokensByType[type]) {
        tokensByType[type] = [];
      }
      tokensByType[type].push(token.path.join('.'));
    });

    let output = '// Generated token types - do not edit manually\n\n';

    Object.entries(tokensByType).forEach(([type, paths]) => {
      const typeName = type.charAt(0).toUpperCase() + type.slice(1) + 'Token';
      output += `export type ${typeName} =\n`;
      output += paths.map((p) => `  | '${p}'`).join('\n');
      output += ';\n\n';
    });

    output += 'export interface TokenMap {\n';
    dictionary.allTokens.forEach((token) => {
      const path = token.path.join('.');
      const value = JSON.stringify(token.$value);
      output += `  '${path}': ${value};\n`;
    });
    output += '}\n\n';

    output += 'export type TokenValue<T extends keyof TokenMap> = TokenMap[T];\n';
    output += 'export type TokenKey = keyof TokenMap;\n';

    return output;
  },
});

// ─── Native Platform Formats ─────────────────────────────────────────

/** Generate iOS Swift file with typed token constants */
StyleDictionary.registerFormat({
  name: 'ios/swift-enum',
  format: ({ dictionary }) => {
    const lines = [];
    lines.push('// DesignTokens.swift');
    lines.push('// Generated by js-ds-ui Style Dictionary — do not edit manually');
    lines.push('');
    lines.push('import UIKit');
    lines.push('');
    lines.push('// swiftlint:disable all');
    lines.push('public enum DesignTokens {');

    // Group by top-level path segment
    const groups = new Map();
    dictionary.allTokens.forEach((token) => {
      const group = token.path[0];
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(token);
    });

    for (const [group, tokens] of groups) {
      lines.push('');
      lines.push(`    // MARK: - ${toPascalCase(group)}`);
      lines.push(`    public enum ${toPascalCase(group)} {`);

      // Sub-group by second path segment
      const subGroups = new Map();
      tokens.forEach((token) => {
        const sub = token.path.length > 2 ? token.path[1] : '_root';
        if (!subGroups.has(sub)) subGroups.set(sub, []);
        subGroups.get(sub).push(token);
      });

      for (const [sub, subTokens] of subGroups) {
        const indent = sub === '_root' ? '        ' : '            ';
        if (sub !== '_root') {
          lines.push(`        public enum ${toPascalCase(sub)} {`);
        }

        subTokens.forEach((token) => {
          const nameParts = token.path.slice(sub === '_root' ? 1 : 2);
          let name = toCamelCase(nameParts.join('-'));
          // Prefix numeric names with underscore
          if (/^\d/.test(name)) name = `s${name}`;

          const value = token.$value;
          const desc = token.$description;

          if (desc) lines.push(`${indent}/// ${desc}`);

          if (token.$type === 'color') {
            const c = parseColor(value);
            if (c) {
              lines.push(
                `${indent}public static let ${name} = UIColor(red: ${(c.r / 255).toFixed(3)}, green: ${(c.g / 255).toFixed(3)}, blue: ${(c.b / 255).toFixed(3)}, alpha: ${c.a.toFixed(3)})`
              );
            } else {
              lines.push(`${indent}public static let ${name} = "${value}" // requires runtime conversion`);
            }
          } else if (token.$type === 'dimension') {
            const pts = remToNumericPt(value);
            if (pts !== null) {
              lines.push(`${indent}public static let ${name}: CGFloat = ${pts}`);
            } else {
              lines.push(`${indent}// ${name}: ${value} (dynamic — resolve at runtime)`);
            }
          } else if (token.$type === 'duration') {
            const match = value.match(/^(\d+)ms$/);
            if (match) {
              lines.push(`${indent}public static let ${name}: TimeInterval = ${parseInt(match[1]) / 1000}`);
            } else {
              lines.push(`${indent}public static let ${name}: TimeInterval = 0 // ${value}`);
            }
          } else if (token.$type === 'cubicBezier') {
            if (Array.isArray(value)) {
              lines.push(
                `${indent}public static let ${name} = CAMediaTimingFunction(controlPoints: ${value[0]}, ${value[1]}, ${value[2]}, ${value[3]})`
              );
            }
          } else if (token.$type === 'fontFamily') {
            const family = Array.isArray(value) ? value[0] : value;
            lines.push(`${indent}public static let ${name} = "${family}"`);
          } else if (token.$type === 'fontWeight') {
            const weightMap = { '400': '.regular', '500': '.medium', '600': '.semibold', '700': '.bold' };
            const w = weightMap[String(value)] || '.regular';
            lines.push(`${indent}public static let ${name}: UIFont.Weight = ${w}`);
          } else if (token.$type === 'number') {
            lines.push(`${indent}public static let ${name}: CGFloat = ${value}`);
          } else if (token.$type === 'shadow') {
            if (typeof value === 'object' && value !== null) {
              const shadowColor = parseColor(value.color);
              const colorStr = shadowColor
                ? `UIColor(red: ${(shadowColor.r / 255).toFixed(3)}, green: ${(shadowColor.g / 255).toFixed(3)}, blue: ${(shadowColor.b / 255).toFixed(3)}, alpha: ${shadowColor.a.toFixed(3)})`
                : `"${value.color}"`;
              lines.push(`${indent}/// Shadow: offset(${value.offsetX}, ${value.offsetY}), blur: ${value.blur}, spread: ${value.spread}`);
              lines.push(`${indent}public static let ${name}Color = ${colorStr}`);
              const blur = remToNumericPt(value.blur);
              if (blur !== null) {
                lines.push(`${indent}public static let ${name}Radius: CGFloat = ${blur}`);
              }
              const ox = remToNumericPt(value.offsetX);
              const oy = remToNumericPt(value.offsetY);
              if (ox !== null && oy !== null) {
                lines.push(`${indent}public static let ${name}Offset = CGSize(width: ${ox}, height: ${oy})`);
              }
            }
          }
        });

        if (sub !== '_root') {
          lines.push('        }');
        }
      }

      lines.push('    }');
    }

    lines.push('}');
    lines.push('// swiftlint:enable all');
    lines.push('');
    return lines.join('\n');
  },
});

/** Generate Android Kotlin file with typed token constants (Compose-ready) */
StyleDictionary.registerFormat({
  name: 'android/kotlin-object',
  format: ({ dictionary }) => {
    const lines = [];
    lines.push('// DesignTokens.kt');
    lines.push('// Generated by js-ds-ui Style Dictionary — do not edit manually');
    lines.push('');
    lines.push('package com.example.design.tokens');
    lines.push('');
    lines.push('import androidx.compose.ui.graphics.Color');
    lines.push('import androidx.compose.ui.unit.dp');
    lines.push('import androidx.compose.ui.unit.sp');
    lines.push('import androidx.compose.ui.text.font.FontWeight');
    lines.push('');
    lines.push('@Suppress("unused", "MagicNumber")');
    lines.push('object DesignTokens {');

    const groups = new Map();
    dictionary.allTokens.forEach((token) => {
      const group = token.path[0];
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(token);
    });

    for (const [group, tokens] of groups) {
      lines.push('');
      lines.push(`    object ${toPascalCase(group)} {`);

      const subGroups = new Map();
      tokens.forEach((token) => {
        const sub = token.path.length > 2 ? token.path[1] : '_root';
        if (!subGroups.has(sub)) subGroups.set(sub, []);
        subGroups.get(sub).push(token);
      });

      for (const [sub, subTokens] of subGroups) {
        const indent = sub === '_root' ? '        ' : '            ';
        if (sub !== '_root') {
          lines.push(`        object ${toPascalCase(sub)} {`);
        }

        subTokens.forEach((token) => {
          const nameParts = token.path.slice(sub === '_root' ? 1 : 2);
          let name = toCamelCase(nameParts.join('-'));
          if (/^\d/.test(name)) name = `s${name}`;

          const value = token.$value;
          const desc = token.$description;

          if (desc) lines.push(`${indent}/** ${desc} */`);

          if (token.$type === 'color') {
            const c = parseColor(value);
            if (c) {
              const argb = `0x${Math.round(c.a * 255).toString(16).padStart(2, '0').toUpperCase()}${c.r.toString(16).padStart(2, '0').toUpperCase()}${c.g.toString(16).padStart(2, '0').toUpperCase()}${c.b.toString(16).padStart(2, '0').toUpperCase()}`;
              lines.push(`${indent}val ${name} = Color(${argb})`);
            } else {
              lines.push(`${indent}// ${name}: ${value} (requires runtime conversion)`);
            }
          } else if (token.$type === 'dimension') {
            const pts = remToNumericPt(value);
            if (pts !== null) {
              // Use sp for font sizes (path contains "font" + "size"), dp for everything else
              const unit = token.path.includes('font') && token.path.includes('size') ? 'sp' : 'dp';
              lines.push(`${indent}val ${name} = ${pts}.${unit}`);
            } else {
              lines.push(`${indent}// ${name}: ${value} (dynamic — resolve at runtime)`);
            }
          } else if (token.$type === 'duration') {
            const match = value.match(/^(\d+)ms$/);
            if (match) {
              lines.push(`${indent}val ${name}: Long = ${match[1]}L`);
            }
          } else if (token.$type === 'cubicBezier') {
            if (Array.isArray(value)) {
              lines.push(
                `${indent}val ${name} = androidx.compose.animation.core.CubicBezierEasing(${value[0]}f, ${value[1]}f, ${value[2]}f, ${value[3]}f)`
              );
            }
          } else if (token.$type === 'fontFamily') {
            const family = Array.isArray(value) ? value[0] : value;
            lines.push(`${indent}val ${name} = "${family}"`);
          } else if (token.$type === 'fontWeight') {
            const weightMap = { '400': 'Normal', '500': 'Medium', '600': 'SemiBold', '700': 'Bold' };
            const w = weightMap[String(value)] || 'Normal';
            lines.push(`${indent}val ${name} = FontWeight.${w}`);
          } else if (token.$type === 'number') {
            lines.push(`${indent}val ${name} = ${value}f`);
          } else if (token.$type === 'shadow') {
            if (typeof value === 'object' && value !== null) {
              const elevation = remToNumericPt(value.blur);
              if (elevation !== null) {
                lines.push(`${indent}/** Shadow: offset(${value.offsetX}, ${value.offsetY}), blur: ${value.blur} */`);
                lines.push(`${indent}val ${name}Elevation = ${elevation}.dp`);
              }
            }
          }
        });

        if (sub !== '_root') {
          lines.push('        }');
        }
      }

      lines.push('    }');
    }

    lines.push('}');
    lines.push('');
    return lines.join('\n');
  },
});

/** Generate flat JSON for design tools (Tokens Studio, Supernova, etc.) */
StyleDictionary.registerFormat({
  name: 'json/flat-map',
  format: ({ dictionary }) => {
    const tokens = {};

    dictionary.allTokens.forEach((token) => {
      const key = token.path.join('.');
      tokens[key] = {
        $value: token.$value,
        $type: token.$type || 'unknown',
      };
      if (token.$description) {
        tokens[key].$description = token.$description;
      }
    });

    return JSON.stringify(tokens, null, 2) + '\n';
  },
});

// ─── Custom Transform Groups ─────────────────────────────────────────
// Native format functions handle all value conversions internally
// (OKLCH→hex, rem→pt/dp, ms→s), so we only need attribute/cti for
// consistent token metadata. No value transforms needed.

StyleDictionary.registerTransformGroup({
  name: 'custom/native',
  transforms: ['attribute/cti'],
});

StyleDictionary.registerTransformGroup({
  name: 'custom/json',
  transforms: ['attribute/cti'],
});

// ─── Token Layer Filters ─────────────────────────────────────────────

// Primitive color families (the scale names under color.*)
const PRIMITIVE_COLOR_FAMILIES = ['blue', 'purple', 'green', 'red', 'amber', 'cyan', 'neutral'];

// Semantic color groups (under color.*)
const SEMANTIC_COLOR_GROUPS = ['text', 'background', 'border', 'interactive'];

/** Token belongs to the primitives layer */
function isPrimitiveToken(token) {
  const top = token.path[0];
  if (top === 'component' || top === 'space' || top === 'typography' || top === 'size') return false;
  if (top === 'color') {
    return PRIMITIVE_COLOR_FAMILIES.includes(token.path[1]);
  }
  // spacing, font, animation, shadow, sizing, z-index are all primitives
  return true;
}

/** Token belongs to the semantic layer */
function isSemanticToken(token) {
  const top = token.path[0];
  if (top === 'color') {
    return SEMANTIC_COLOR_GROUPS.includes(token.path[1]);
  }
  if (top === 'space') return true;
  if (top === 'typography') return true;
  if (top === 'size') return true;
  return false;
}

/** Token belongs to the component layer */
function isComponentToken(token) {
  return token.path[0] === 'component';
}

// ─── Build Configuration ─────────────────────────────────────────────

const config = {
  source: [
    'src/primitives/**/*.json',
    'src/semantic/**/*.json',
    'src/component/**/*.json',
  ],
  platforms: {
    // ── Web (CSS) — split into 3 layered files ──
    css: {
      transformGroup: 'css',
      transforms: ['name/css-var', 'size/pxToRem/preserve-calc', 'cubicBezier/css', 'shadow/css'],
      buildPath: 'dist/',
      files: [
        {
          destination: 'primitives.css',
          format: 'css/variables-with-fallbacks',
          filter: isPrimitiveToken,
          options: {
            outputReferences: true,
            layerName: 'tokens.primitives',
          },
        },
        {
          destination: 'semantic.css',
          format: 'css/variables-with-fallbacks',
          filter: isSemanticToken,
          options: {
            outputReferences: true,
            layerName: 'tokens.semantic',
          },
        },
        {
          destination: 'components.css',
          format: 'css/variables-with-fallbacks',
          filter: isComponentToken,
          options: {
            outputReferences: true,
            layerName: 'tokens.components',
          },
        },
      ],
    },

    // ── Web (JavaScript) ──
    js: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations',
        },
      ],
    },

    // ── Web (TypeScript types) ──
    types: {
      buildPath: 'dist/',
      files: [
        {
          destination: 'types.d.ts',
          format: 'typescript/token-types',
        },
      ],
    },

    // ── iOS (Swift) ──
    ios: {
      transformGroup: 'custom/native',
      buildPath: 'dist/ios/',
      files: [
        {
          destination: 'DesignTokens.swift',
          format: 'ios/swift-enum',
        },
      ],
    },

    // ── Android (Kotlin / Compose) ──
    android: {
      transformGroup: 'custom/native',
      buildPath: 'dist/android/',
      files: [
        {
          destination: 'DesignTokens.kt',
          format: 'android/kotlin-object',
        },
      ],
    },

    // ── Design Tools (flat JSON) ──
    json: {
      transformGroup: 'custom/json',
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/flat-map',
        },
      ],
    },
  },
};

export default config;
