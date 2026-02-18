# Tree-Shaking Guide

js-ds-ui is designed for optimal tree-shaking. Since components are copied into your project (not imported from a node_modules bundle), tree-shaking behavior depends on how you import and use components.

## How It Works

### Component-Level Code Splitting

Each component is a standalone file. When you install a component via the CLI:

```bash
npx js-ds-ui add button
```

Only the `button.tsx` file is copied to your project. No other component code is included. This is inherently tree-shakeable — you only have what you installed.

### Dependency Awareness

Components declare their npm dependencies in the CLI registry. When you install a component:

1. **Radix UI primitives**: Only the specific `@radix-ui/react-*` package needed by that component is added
2. **Shared utilities**: `clsx`, `tailwind-merge`, and `class-variance-authority` are shared across components
3. **Icons**: `lucide-react` is tree-shakeable — only icons you import are included in your bundle

### Import Patterns for Tree-Shaking

**Good — named imports (tree-shakeable):**
```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
```

**Good — direct file imports:**
```tsx
import { Button } from '@/components/ui/button';
```

**Avoid — wildcard re-exports in your own barrel files:**
```tsx
// Don't create a barrel that re-exports everything
// This may prevent tree-shaking depending on your bundler
export * from '@/components/ui/button';
export * from '@/components/ui/card';
// ... 40 more components
```

## Dependency Weight Guide

### Lightest Components (< 1 kB source, no Radix)

These components have zero external runtime dependencies beyond React:
- **Skeleton** — Pure div with CSS animation
- **Spinner** — Pure SVG with CSS animation
- **Card** — Semantic div wrappers
- **Link** — Enhanced anchor tag
- **Textarea** — Enhanced textarea element
- **Table** — Semantic table wrappers
- **Badge** — Styled div (uses CVA for variants)

### Light Components (1-3 kB source, single Radix dep)

These use one Radix UI primitive:
- **Button** — `@radix-ui/react-slot` (for asChild)
- **Input** — No Radix dep
- **Label** — `@radix-ui/react-label`
- **Checkbox** — `@radix-ui/react-checkbox`
- **Switch** — `@radix-ui/react-switch`
- **Separator** — `@radix-ui/react-separator`
- **Progress** — `@radix-ui/react-progress`
- **Avatar** — `@radix-ui/react-avatar`
- **Tooltip** — `@radix-ui/react-tooltip`
- **Popover** — `@radix-ui/react-popover`

### Medium Components (3-5 kB source, 1-2 Radix deps)

- **Dialog** — `@radix-ui/react-dialog`
- **Select** — `@radix-ui/react-select`
- **Tabs** — `@radix-ui/react-tabs`
- **Toast** — `@radix-ui/react-toast`
- **Accordion** — `@radix-ui/react-accordion`
- **Sheet** — `@radix-ui/react-dialog` (reuses Dialog primitive)
- **AlertDialog** — `@radix-ui/react-alert-dialog`
- **Calendar** — No deps (self-contained)
- **Command** — No deps (self-contained)

### Heavier Components (5+ kB source, multiple deps)

- **DropdownMenu** — `@radix-ui/react-dropdown-menu`
- **ContextMenu** — `@radix-ui/react-context-menu`
- **Menubar** — `@radix-ui/react-menubar`
- **NavigationMenu** — `@radix-ui/react-navigation-menu`
- **DataTable** — No deps but large source
- **Combobox** — Composes Popover + Command + Button (3 internal deps)
- **DatePicker** — Composes Popover + Calendar + Button (3 internal deps)

### Composition Components

Some components compose others. Installing them also requires their dependencies:

```
combobox     -> popover, command, button
date-picker  -> popover, calendar, button
toggle-group -> button (buttonVariants)
```

## Radix UI Bundle Impact

Radix UI packages range from ~2 kB to ~15 kB gzipped:

| Package Size Tier | Packages | ~Gzipped |
|-------------------|----------|----------|
| Tiny (< 3 kB) | slot, separator, progress, aspect-ratio, visually-hidden | 1-2 kB |
| Small (3-5 kB) | label, checkbox, switch, toggle, avatar, collapsible | 3-5 kB |
| Medium (5-10 kB) | dialog, popover, tooltip, tabs, accordion, hover-card | 5-8 kB |
| Large (10-15 kB) | select, dropdown-menu, context-menu, menubar, navigation-menu, toast | 10-15 kB |

## Shared Dependencies

These packages are shared across all components and only included once in your bundle:

| Package | Size (gzipped) | Used By |
|---------|---------------|---------|
| `clsx` | ~0.3 kB | All components via `cn()` |
| `tailwind-merge` | ~3.5 kB | All components via `cn()` |
| `class-variance-authority` | ~1.2 kB | Badge, Button, Alert, Toast, Sheet, Spinner |
| `lucide-react` | Tree-shakeable | Only icons you import |

## Tips for Minimal Bundles

1. **Install only what you need**: The CLI installs one component at a time
2. **Prefer composition**: `Combobox` = `Popover` + `Command` + `Button`. If you already have Popover and Button, adding Command is the only new cost
3. **Use lightweight alternatives**: Need just a loading indicator? Use `Skeleton` or `Spinner` instead of full `Progress`
4. **Check the dependency graph**: Run `tsx scripts/dep-graph.ts` to see what shares dependencies with what
5. **Audit with size-limit**: Run `pnpm size` to see per-component bundle impact
