# Contributing to js-ds-ui

Thank you for your interest in contributing!

## Development Setup

### Prerequisites

- Node.js 20+
- pnpm 8+

### Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd js-ds-ui

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

## Project Structure

```
js-ds-ui/
├── packages/
│   ├── cli/              CLI tool
│   ├── tokens/           Design tokens
│   └── components/       React components
├── tools/
│   └── color-generator/  Color generation tooling
├── themes/               Theme configurations
└── metadata/             MCP metadata
```

## Making Changes

### Adding a New Component

1. **Create component in `packages/components/src/ui/`**

```tsx
// packages/components/src/ui/new-component.tsx
import * as React from 'react';
import { cn } from '../lib/utils';

export interface NewComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'special';
}

export const NewComponent = React.forwardRef<HTMLDivElement, NewComponentProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'base-styles',
          variant === 'special' && 'special-styles',
          className
        )}
        {...props}
      />
    );
  }
);

NewComponent.displayName = 'NewComponent';
```

2. **Create tests**

```tsx
// packages/components/src/ui/new-component.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { NewComponent } from './new-component';

expect.extend(toHaveNoViolations);

describe('NewComponent', () => {
  it('renders', () => {
    render(<NewComponent>Test</NewComponent>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<NewComponent>Test</NewComponent>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

3. **Add to CLI registry**

```typescript
// packages/cli/src/registry.ts
export const REGISTRY: Record<string, ComponentRegistryItem> = {
  // ...
  'new-component': {
    name: 'new-component',
    label: 'NewComponent',
    description: 'Description of the component',
    files: [
      {
        path: 'components/ui/new-component.tsx',
        content: '',
        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {},
  },
};
```

4. **Regenerate CLI templates** (auto-generated from source files)

```bash
node scripts/gen-cli-templates.mjs
```

5. **Update MCP metadata**

```json
// metadata/component-manifest.json
{
  "components": {
    "new-component": {
      "name": "NewComponent",
      "description": "...",
      "intent": ["user wants to..."],
      "props": {},
      "accessibility": {},
      "usage": {}
    }
  }
}
```

### Adding a New Token

1. **Choose token tier** (primitive, semantic, or component)

2. **Add to appropriate JSON file**

```json
// packages/tokens/src/primitives/spacing.json
{
  "spacing": {
    "32": {
      "$value": "8rem",
      "$description": "128px - New spacing value"
    }
  }
}
```

3. **Rebuild tokens**

```bash
pnpm tokens:build
```

### Modifying Colors

1. **Update base colors**

```typescript
// tools/color-generator/src/generate.ts
const colorConfigs: ColorConfig[] = [
  {
    name: 'primary',
    baseColor: 'oklch(0.55 0.22 250)', // Your new color
  },
];
```

2. **Regenerate scales**

```bash
pnpm colors:generate
```

3. **Review generated colors** in `tools/color-generator/output/preview.html`

4. **Update primitive tokens** if needed

## Testing

### Run All Tests

```bash
pnpm test
```

### Component Tests

```bash
cd packages/components
pnpm test
pnpm test:coverage
```

### Test Requirements

All components must:
- ✅ Have unit tests
- ✅ Pass accessibility tests (jest-axe)
- ✅ Test keyboard navigation
- ✅ Have > 80% coverage

## Accessibility

All contributions must meet WCAG 2.2 AAA standards:

- **Contrast**: 7:1 for normal text, 4.5:1 for large text
- **Keyboard**: Full keyboard navigation
- **ARIA**: Proper ARIA attributes
- **Focus**: Visible focus indicators

Test accessibility:

```bash
# Automated tests
pnpm test

# Manual testing
# 1. Navigate with Tab/Shift+Tab
# 2. Activate with Enter/Space
# 3. Use screen reader (VoiceOver, NVDA, JAWS)
```

## Code Style

We use TypeScript strict mode and ESLint.

### Key conventions:

- Use functional components with `React.forwardRef`
- Export named components, not default
- Use `cn()` helper for className merging
- Use CSS custom properties for theming
- Document props with JSDoc
- Use semantic token names

### Variant naming

- **`danger`** — for destructive *actions* (Button, ConfirmDialog)
- **`error`** — for status *indicators* (Alert, Badge, Toast)
- **`success`**, **`warning`**, **`info`** — for other status indicators

### React.forwardRef deprecation

All components currently use `React.forwardRef`. This is deprecated in React 19 (refs can be passed as regular props). We accept the deprecation warnings for React 19 consumers for now. A future major version will drop `forwardRef` when React 19 becomes the minimum supported version.

## Pull Request Process

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/your-feature`
3. **Make changes** with tests
4. **Run tests**: `pnpm test`
5. **Build**: `pnpm build`
6. **Commit**: Use conventional commits
   - `feat: add new component`
   - `fix: resolve button focus issue`
   - `docs: update README`
7. **Push**: `git push origin feature/your-feature`
8. **Open PR** with description

### PR Checklist

- [ ] Tests pass
- [ ] Accessibility tests pass
- [ ] TypeScript compiles
- [ ] Documentation updated
- [ ] CHANGELOG updated (if applicable)
- [ ] MCP metadata updated (for new components)

## Questions?

Open an issue for:
- Bug reports
- Feature requests
- Design discussions
- Implementation questions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
