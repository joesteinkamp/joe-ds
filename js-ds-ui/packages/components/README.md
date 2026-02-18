# @js-ds-ui/components

Source React components for js-ds-ui. These are the source files that the CLI copies into user projects.

## Purpose

This package is **NOT** published to npm. It serves as:
1. **Source of truth** for component code
2. **Testing environment** with Vitest + Testing Library + jest-axe
3. **Development workspace** for new components

The CLI (`@js-ds-ui/cli`) reads these files and copies them into user projects.

## Components

### Button
Interactive button with multiple variants and sizes.
- **Variants**: primary, secondary, outline, ghost, danger
- **Sizes**: sm, md, lg
- **Features**: Radix Slot support, full keyboard navigation, ARIA support
- **Tests**: Unit tests + accessibility tests with jest-axe

### Input
Text input field for user data entry.
- **Types**: All HTML input types supported
- **Features**: Consistent styling, validation states, full keyboard support
- **Tests**: Unit tests + accessibility tests

### Hooks

#### `useTheme`
Theme management hook (light, dark, high-contrast).
- Syncs with localStorage
- Applies data-theme attribute to root
- Detects system preference

#### `useDensity`
Density control hook (compact, default, comfortable).
- Syncs with localStorage
- Applies data-density attribute to root
- Controls --density-multiplier CSS variable

## Testing

### Run Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test --watch

# UI mode
pnpm test:ui

# Coverage
pnpm test:coverage
```

### Test Structure

Each component has:
1. **Unit tests**: Rendering, interactions, props
2. **Accessibility tests**: jest-axe + manual ARIA checks
3. **Keyboard navigation tests**: Tab, Enter, Space, etc.

### Accessibility Testing

We use jest-axe for automated accessibility testing:

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

it('has no accessibility violations', async () => {
  const { container } = render(<Button>Test</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

All components must:
- ✅ Pass axe automated tests
- ✅ Support keyboard navigation
- ✅ Include proper ARIA attributes
- ✅ Meet WCAG 2.2 AAA contrast ratios

## Adding New Components

1. **Create component** in `src/ui/`:
   ```tsx
   // src/ui/new-component.tsx
   import * as React from 'react';
   import { cn } from '../lib/utils';

   export interface NewComponentProps {
     // props
   }

   export const NewComponent = React.forwardRef<HTMLDivElement, NewComponentProps>(
     ({ className, ...props }, ref) => {
       return <div ref={ref} className={cn('base-styles', className)} {...props} />;
     }
   );

   NewComponent.displayName = 'NewComponent';
   ```

2. **Create tests** in `src/ui/new-component.test.tsx`:
   ```tsx
   import { describe, it, expect } from 'vitest';
   import { render, screen } from '@testing-library/react';
   import { axe, toHaveNoViolations } from 'jest-axe';
   import { NewComponent } from './new-component';

   expect.extend(toHaveNoViolations);

   describe('NewComponent', () => {
     it('renders', () => {
       render(<NewComponent />);
       expect(screen.getByRole('...')).toBeInTheDocument();
     });

     it('has no accessibility violations', async () => {
       const { container } = render(<NewComponent />);
       const results = await axe(container);
       expect(results).toHaveNoViolations();
     });
   });
   ```

3. **Add to CLI registry** in `packages/cli/src/registry.ts`

4. **Add template** in `packages/cli/src/templates/index.ts`

5. **Update MCP metadata** in `metadata/component-manifest.json`

## Dependencies

### Core
- **React 18+**: Peer dependency
- **Radix UI**: Headless component primitives
- **CVA**: Class Variance Authority for variant handling
- **clsx + tailwind-merge**: Class name merging

### Testing
- **Vitest**: Test runner
- **Testing Library**: React component testing
- **jest-axe**: Automated accessibility testing
- **jsdom**: DOM environment for tests

## Design Tokens

Components use CSS custom properties from `@js-ds-ui/tokens`:

```tsx
// Uses semantic tokens
className="text-[var(--color-text-primary)] bg-[var(--color-background-primary)]"

// Density-aware spacing
className="px-[var(--space-component-padding-md)]"

// Responsive typography
className="text-[var(--font-size-base)]"
```

## Style Approach

We use **CSS custom properties + utility classes**:
- Design tokens as CSS variables
- Tailwind-like utilities via inline styles
- No CSS-in-JS runtime
- No Tailwind dependency for users

Why?
- Zero runtime overhead
- Theme switching via CSS variables (instant)
- Density changes via CSS (no React re-render)
- Users don't need Tailwind config
