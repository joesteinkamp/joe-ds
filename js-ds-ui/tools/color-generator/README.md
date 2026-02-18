# Color Generator

Generates accessible color scales using Leonardo and OKLCH color space.

## Features

- **Leonardo Integration**: Uses Adobe's Leonardo library for scientifically-generated color scales based on target contrast ratios
- **OKLCH Color Space**: Perceptually uniform color space for better interpolation
- **WCAG 2.2 AAA Compliance**: Validates all colors meet accessibility standards
- **Manual Overrides**: Supports one-off adjustments to generated scales
- **Build-time Generation**: Colors are generated at build time, not runtime

## Usage

### Generate Color Scales

```bash
pnpm generate
```

This will:
1. Generate color scales from base colors defined in `src/generate.ts`
2. Validate WCAG 2.2 AAA contrast ratios
3. Output results to `output/generated-colors.json`
4. Create a visual HTML preview at `output/preview.html`

### Customize Base Colors

Edit `src/generate.ts` and modify the `colorConfigs` array:

```typescript
const colorConfigs: ColorConfig[] = [
  {
    name: 'primary',
    baseColor: 'oklch(0.55 0.22 250)', // Your brand blue
    overrides: {
      500: 'oklch(0.54 0.23 248)', // Manual adjustment
    },
  },
];
```

### Color Scale Structure

Each scale includes 11 shades:
- **50-400**: Light shades for backgrounds and subtle UI
- **500**: Base color (meets WCAG AA for text)
- **600-950**: Dark shades for text and emphasis (meet WCAG AAA)

## How It Works

1. **Base Color**: You provide an OKLCH base color
2. **Leonardo Generation**: Leonardo generates a scale with target contrast ratios
3. **Validation**: Each shade is validated against WCAG 2.2 AAA (7:1 contrast)
4. **Manual Overrides**: You can override any generated shade
5. **Output**: DTCG-compliant JSON ready for Style Dictionary

## Contrast Ratios

Default target ratios (customizable):
- 50: 1.05 (nearly white)
- 100-400: 1.15 - 2.5 (backgrounds)
- 500: 4.5 (AA text)
- 600: 7.0 (AAA text)
- 700-950: 10.0 - 18.0 (high contrast text)

## Why OKLCH?

- Perceptually uniform (unlike HSL)
- Consistent lightness across hues
- Better color interpolation
- Future-proof (CSS Color Level 4)
- Automatic RGB fallbacks via PostCSS
