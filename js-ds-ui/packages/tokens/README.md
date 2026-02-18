# @js-ds-ui/tokens

Design tokens for js-ds-ui following DTCG (Design Tokens Community Group) standards.

## Architecture

Tokens are organized in three tiers:

1. **Primitives** (`src/primitives/`) - Raw values (colors, spacing, typography)
2. **Semantic** (`src/semantic/`) - Contextual tokens (text colors, backgrounds)
3. **Component** (`src/component/`) - Component-specific tokens (button padding, etc.)

## Density System

All spacing-related tokens support density multipliers via CSS variables:

- **Compact**: `--density-multiplier: 0.85`
- **Default**: `--density-multiplier: 1.0`
- **Comfortable**: `--density-multiplier: 1.15`

## Color System

Colors use OKLCH color space for perceptual uniformity:
- Better color interpolation
- Consistent lightness across hues
- Automatic RGB fallbacks via PostCSS

## Build

```bash
pnpm build
```

Generates:
- `dist/tokens.css` - CSS custom properties with OKLCH fallbacks
- `dist/tokens.js` - JavaScript exports
- `dist/types.d.ts` - TypeScript types
- `dist/index.d.ts` - Main type definitions including density/theme types

## Usage

```typescript
import '@js-ds-ui/tokens/css';
import { getDensityMultiplier } from '@js-ds-ui/tokens';

// Use tokens via CSS variables
const button = styled.button\`
  padding: var(--space-component-padding-md);
  background: var(--color-interactive-primary);
\`;

// Or use TypeScript types
const density = getDensityMultiplier('compact'); // 0.85
```

## WCAG 2.2 AAA Compliance

All color combinations are tested to meet WCAG 2.2 AAA contrast requirements (7:1 for normal text, 4.5:1 for large text).
