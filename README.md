# joe-ds

A modern design system built with OKLCH colors, density controls, and theme-first architecture. Components are distributed shadcn-style — copied into your project for full ownership and customization.

## Features

- **OKLCH Color System** — Perceptually uniform colors with dynamic scale generation and WCAG 2.2 AAA compliance (7:1 contrast)
- **Density Controls** — Compact, Default, and Comfortable density levels via CSS custom properties
- **Theme-First** — Light, Dark, and High Contrast themes with system preference detection
- **Accessible** — Full keyboard navigation, comprehensive ARIA support, and automated a11y testing
- **AI-Ready** — Component manifests and metadata for MCP integration and AI-assisted development

## Project Structure

```
joe-ds/
├── js-ds-ui/                # Core design system
│   ├── packages/
│   │   ├── cli/             # CLI tool (init, add commands)
│   │   ├── components/      # React components (source)
│   │   ├── tokens/          # Design tokens (DTCG-compliant)
│   │   └── e2e/             # End-to-end tests
│   ├── tools/
│   │   └── color-generator/ # Leonardo + OKLCH color generation
│   └── metadata/            # MCP component manifests
├── docs/                    # Documentation site (Next.js + MDX)
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 8

### Setup

```bash
pnpm install
```

### Development

```bash
# Build all packages
cd js-ds-ui && pnpm build

# Run the docs site
cd docs && pnpm dev

# Run tests
cd js-ds-ui && pnpm test

# Generate color scales
cd js-ds-ui && pnpm colors:generate

# Build design tokens
cd js-ds-ui && pnpm tokens:build
```

### Using the CLI

```bash
# Initialize in a new project
npx @js-ds-ui/cli init

# Add components
npx @js-ds-ui/cli add button input
```

## Tech Stack

- **React 18+** with TypeScript
- **Radix UI** for headless component primitives
- **Style Dictionary** for DTCG-compliant design tokens
- **Leonardo + culori** for OKLCH color generation
- **Vitest + Testing Library** for component testing
- **Turbo + pnpm** workspaces for monorepo orchestration
- **Next.js + MDX** for documentation

## License

MIT
