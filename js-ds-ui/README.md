# js-ds-ui

A modern design system for 2026 with OKLCH colors, density controls, and theme-first architecture.

## Overview

js-ds-ui is a **shadcn-style design system** - components are copied into your project, giving you full ownership and control. It's built with modern web standards and accessibility at its core.

## Key Features

### 🎨 OKLCH Color System
- Perceptually uniform color space
- Dynamic color scale generation with Leonardo
- WCAG 2.2 AAA compliant (7:1 contrast)
- Automatic RGB fallbacks via PostCSS

### 📐 Density-First Architecture
- Three density levels: Compact, Default, Comfortable
- CSS variable-based (no React re-renders)
- Affects spacing only, not typography
- User-controlled via `useDensity` hook

### 🌗 Theme-First Architecture
- Light, Dark, High Contrast themes out of the box
- Extensible theme system
- OKLCH-based for consistent contrast across themes
- System preference detection

### ♿ WCAG 2.2 AAA Compliance
- All color combinations tested for 7:1 contrast
- Full keyboard navigation
- Comprehensive ARIA support
- Automated accessibility testing with jest-axe

### 🤖 AI-Ready (MCP Integration)
- Component manifest for AI consumption
- Intent-based component selection
- Usage examples for common patterns
- Semantic metadata for better AI understanding

### 📦 shadcn-Style Distribution
- Copy code into your project (not npm dependency)
- Full ownership and customization
- No breaking changes from updates
- TypeScript + React 18+

## Quick Start

### 1. Initialize

```bash
npx @js-ds-ui/cli init
```

This will:
- Set up directory structure
- Install dependencies
- Create configuration file
- Add design token CSS

### 2. Add Components

```bash
# Interactive mode
npx @js-ds-ui/cli add

# Specific components
npx @js-ds-ui/cli add button input

# Single component
npx @js-ds-ui/cli add button
```

### 3. Use Components

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/hooks/use-theme';
import { useDensity } from '@/hooks/use-density';

function App() {
  const { theme, setTheme } = useTheme();
  const { density, setDensity } = useDensity();

  return (
    <div>
      <Button variant="primary" size="md">
        Get Started
      </Button>

      <Input type="email" placeholder="you@example.com" />

      <Button
        variant="ghost"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Toggle Theme
      </Button>

      <select value={density} onChange={(e) => setDensity(e.target.value)}>
        <option value="compact">Compact</option>
        <option value="default">Default</option>
        <option value="comfortable">Comfortable</option>
      </select>
    </div>
  );
}
```

## Project Structure

```
js-ds-ui/
├── packages/
│   ├── cli/              # CLI tool (init, add commands)
│   ├── tokens/           # Design tokens (DTCG-compliant)
│   └── components/       # React components (source)
├── tools/
│   └── color-generator/  # Leonardo + OKLCH color generation
├── metadata/             # MCP component manifests
└── README.md
```

## Architecture

### Token System

Three-tier token architecture:

1. **Primitives** (`tokens/src/primitives/`)
   - Raw values: colors, spacing, typography
   - Base brand colors, scale values

2. **Semantic** (`tokens/src/semantic/`)
   - Contextual tokens: text-primary, bg-secondary
   - References primitives, adapts per theme

3. **Component** (`tokens/src/component/`)
   - Component-specific: button-padding, input-border
   - References semantic tokens

### Color Generation

Colors are generated at build time using Leonardo:

```bash
cd tools/color-generator
pnpm generate
```

This creates full 11-shade scales (50-950) from base OKLCH colors, ensuring WCAG AAA compliance.

### Density System

Density is controlled via CSS custom property:

```css
:root {
  --density-multiplier: 1.0; /* Default */
}

[data-density="compact"] {
  --density-multiplier: 0.85;
}

[data-density="comfortable"] {
  --density-multiplier: 1.15;
}
```

All spacing tokens use this multiplier:

```json
{
  "space-component-padding-md": "calc(0.75rem * var(--density-multiplier))"
}
```

### Theme System

Themes are applied via `data-theme` attribute:

```css
:root {
  /* Light theme (default) */
  --color-text-primary: oklch(0.15 0.02 250);
}

[data-theme="dark"] {
  --color-text-primary: oklch(0.95 0.01 250);
}

[data-theme="high-contrast"] {
  --color-text-primary: oklch(0.00 0.00 0);
}
```

## Component Testing

All components include:
- Unit tests (Vitest + Testing Library)
- Accessibility tests (jest-axe)
- Keyboard navigation tests

Run tests:

```bash
cd packages/components
pnpm test
pnpm test:coverage
```

## MCP Integration

Components include metadata for AI consumption:

- **component-manifest.json**: Component props, intent mapping, accessibility info
- **usage-examples.json**: Common patterns and conversational mappings
- **JSON Schema**: Validation and IDE support

AI assistants can use this metadata to:
- Map user intent → appropriate components
- Generate accessible code
- Follow design system best practices
- Compose multi-component patterns

## Development

### Setup Monorepo

```bash
cd js-ds-ui
pnpm install
```

### Build All Packages

```bash
pnpm build
```

### Generate Color Scales

```bash
pnpm colors:generate
```

### Build Tokens

```bash
pnpm tokens:build
```

### Run Component Tests

```bash
cd packages/components
pnpm test
```

### Develop CLI

```bash
pnpm cli:dev
```

## Design Decisions

### Why shadcn-style (copy code) vs npm package?

**Pros:**
- ✅ Full code ownership
- ✅ No dependency updates breaking your app
- ✅ Customize without forking
- ✅ No black box abstractions

**Cons:**
- ❌ Manual updates (opt-in)
- ❌ Larger codebase

We chose the shadcn model because modern design systems need flexibility more than consistency. Teams can evolve components to their needs.

### Why OKLCH?

OKLCH provides:
- Perceptually uniform lightness (unlike HSL)
- Consistent contrast across hues
- Better color interpolation
- Future-proof (CSS Color Level 4)

### Why Density-First?

Density control is often an afterthought. We made it first-class because:
- Users have different preferences (compact power users vs comfortable casual users)
- Different devices need different densities
- Accessibility requirement for some users

### Why WCAG 2.2 AAA?

We target AAA (7:1 contrast) instead of AA (4.5:1) because:
- Better accessibility for low-vision users
- Future-proofs against evolving standards
- Demonstrates commitment to accessibility
- Modern OKLCH tools make it achievable

## Tech Stack

- **Language**: TypeScript
- **Framework**: React 18+
- **Headless UI**: Radix UI
- **Tokens**: Style Dictionary (DTCG spec)
- **Colors**: Leonardo + culori (OKLCH)
- **CLI**: clack + commander
- **Testing**: Vitest + Testing Library + jest-axe
- **Build**: Turbo + tsup + pnpm workspaces

## Roadmap

- [ ] Additional components (Select, Dialog, Toast, etc.)
- [ ] Figma plugin for token sync
- [ ] Storybook documentation site
- [ ] Visual regression testing with Playwright
- [ ] CSS-only variant (no React)
- [ ] MCP server for AI integration
- [ ] Component generator CLI
- [ ] Theme builder UI

## Contributing

This is a learning project. Feel free to:
- Open issues for bugs or suggestions
- Submit PRs for improvements
- Use it as reference for your own design system

## License

MIT

## Credits

Inspired by:
- **shadcn/ui** - Copy-code distribution model
- **Radix Colors** - OKLCH color system approach
- **Adobe Leonardo** - Contrast-based color generation
- **Material Design** - Token architecture
- **Radix UI** - Headless component primitives

Built with modern web standards and a commitment to accessibility.

---

**js-ds-ui** - A design system for 2026 🚀
