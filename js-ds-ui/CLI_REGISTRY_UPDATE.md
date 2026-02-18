# CLI Registry and Templates Update

## Overview

Updated the CLI registry and templates system to include all 27 Radix-based components, making them installable via the `jsds add` command.

## Files Updated

### 1. `packages/cli/src/registry.ts`

**Complete Component Registry** - All 27 components are now registered with:
- Component name and description
- File paths
- NPM dependencies (Radix packages, lucide-react, etc.)
- Registry dependencies (utils, other components)
- Proper categorization

**Component Categories:**
- **Utilities** (3): utils, use-theme, use-density
- **Form Components** (8): label, checkbox, radio-group, switch, select, input, button, slider
- **Overlay Components** (8): dialog, popover, tooltip, dropdown-menu, context-menu, hover-card, sheet, toast
- **Display Components** (8): tabs, avatar, separator, progress, accordion, collapsible, scroll-area, aspect-ratio, visually-hidden
- **Navigation Components** (2): navigation-menu, menubar
- **Grouping Components** (2): toggle-group, toolbar

**Total: 31 registry entries** (27 components + 3 utilities + 1 hook)

### 2. `packages/cli/src/templates/index.ts`

**Template Implementation Status:**

#### Fully Implemented Templates (9):
1. ✅ **label** - Accessible form label with Radix Label primitive
2. ✅ **checkbox** - Checkbox with check icon indicator
3. ✅ **radio-group** - Radio group with circle indicator
4. ✅ **switch** - Toggle switch with animated thumb
5. ✅ **select** - Full select dropdown with trigger, content, items
6. ✅ **input** - Text input with design token styling
7. ✅ **button** - Button with CVA variants (primary, secondary, outline, ghost, danger)
8. ✅ **slider** - Range slider with keyboard support
9. ✅ **utils**, **use-theme**, **use-density** - Utility functions and hooks

#### Placeholder Templates (18):
The following components have placeholder templates that need full implementation:
- dialog
- popover
- tooltip
- dropdown-menu
- context-menu
- hover-card
- sheet
- toast
- tabs
- avatar
- separator
- progress
- accordion
- collapsible
- scroll-area
- aspect-ratio
- visually-hidden
- navigation-menu
- menubar
- toggle-group
- toolbar

## How It Works

### Registry Structure

Each component in the registry has:

```typescript
{
  name: 'checkbox',
  label: 'Checkbox',
  description: 'Checkbox component for boolean input',
  files: [
    {
      path: 'components/ui/checkbox.tsx',
      content: '',  // Populated from template
      type: 'component',
    },
  ],
  dependencies: [],
  npmDependencies: {
    '@radix-ui/react-checkbox': '^1.1.2',
    'lucide-react': '^0.460.0',
  },
  registryDependencies: ['utils'],
}
```

### Template System

Templates are TypeScript/JavaScript code strings that get copied into user projects:

```typescript
export function getComponentTemplate(name: string, typescript: boolean): string {
  switch (name) {
    case 'checkbox':
      return getCheckboxTemplate(typescript);
    // ... other cases
  }
}
```

### Usage

Users can install components via CLI:

```bash
# Install a single component with dependencies
jsds add checkbox

# Install multiple components
jsds add dialog button input

# List all available components
jsds list
```

## Next Steps

### 1. Complete Template Implementations
Fill in the 18 placeholder templates with actual component code from:
- `/Users/joe.steinkamp/Documents/GitHub/joe-ds/js-ds-ui/packages/components/src/ui/*.tsx`

Each template should:
- Include both TypeScript and JavaScript versions
- Use proper import paths (`@/lib/utils`, `@/components/ui/*`)
- Include all sub-components and exports
- Match the design token CSS variables

### 2. Test CLI Commands

Test the following workflows:

```bash
cd packages/cli
pnpm build

# Test initialization
pnpm start init

# Test component installation
pnpm start add label
pnpm start add checkbox label
pnpm start add button --javascript

# Test listing
pnpm start list
```

### 3. Update CLI Commands

Ensure `packages/cli/src/commands/add.ts` and `init.ts`:
- Correctly resolve dependencies from registry
- Copy templates to user-specified directories
- Install NPM dependencies
- Handle TypeScript vs JavaScript configuration

### 4. Add Component Examples

Create example usage snippets in:
- `metadata/usage-examples.json` - AI-friendly examples
- `metadata/component-manifest.json` - Component metadata
- Individual component README files

### 5. Integration Testing

Test full workflow:
1. Create a new React app
2. Run `jsds init`
3. Add various components
4. Verify components work with design tokens
5. Test theme and density switching

## Component Dependencies

### Common Dependencies

Most components depend on:
- **utils** (cn helper) - Required by 24/27 components
- **lucide-react** - Icons (used by 15 components)
- **class-variance-authority** - Variant styling (button, sheet, toast, navigation-menu, toggle-group)

### Component Chains

Some components have dependency chains:
- Many form components work well with **label**
- Dropdown/context menus share similar patterns
- Dialog and sheet use similar overlay patterns

## Design Token Integration

All templates use CSS custom properties from the token system:

**Colors:**
- `var(--color-background-primary)`
- `var(--color-text-primary)`
- `var(--color-border-default)`
- `var(--color-interactive-primary)`
- `var(--color-interactive-primary-hover)`

**Spacing:**
- `var(--space-component-padding-sm/md/lg/xl)`
- `var(--space-component-gap-sm/md/lg)`

**Sizing:**
- `var(--sizing-component-height-sm/md/lg)`
- `var(--sizing-icon-sm/md/lg)`

**Typography:**
- `var(--font-size-xs/sm/base/lg)`
- `var(--font-weight-normal/medium/semibold)`

## Benefits

### For Users

1. **Easy Installation** - Copy components into project with one command
2. **Full Ownership** - Components are copied, not imported from node_modules
3. **Customizable** - Users can modify components directly
4. **Type-Safe** - Full TypeScript support with proper types
5. **Dependency Management** - Automatic NPM dependency installation

### For Maintainers

1. **Centralized Registry** - Single source of truth for all components
2. **Organized Structure** - Clear categorization and relationships
3. **Consistent Patterns** - All components follow same template structure
4. **Easy Updates** - Update registry to add new components
5. **Testing** - Can test CLI separately from components

## Status Summary

✅ **Completed:**
- Registry with all 27 component entries
- Dependency mapping for all components
- 9 fully implemented templates
- Template system architecture
- Switch-case routing for all components

⏳ **In Progress:**
- 18 placeholder templates need full implementation

🔜 **TODO:**
- Complete remaining template implementations
- Test CLI commands end-to-end
- Update MCP metadata for all components
- Create usage examples
- Integration testing

## Technical Details

### Import Path Conventions

Templates use these import conventions:
- `@/lib/utils` - Utility functions (cn helper)
- `@/components/ui/*` - Other UI components
- `@/hooks/*` - Custom hooks
- Radix packages - Direct from node_modules
- lucide-react - Direct from node_modules

### File Structure After Installation

When users run `jsds add checkbox`:

```
their-project/
├── components/
│   └── ui/
│       └── checkbox.tsx      # Copied from template
└── lib/
    └── utils.ts              # cn helper (if not exists)
```

### Version Management

NPM dependencies are pinned to specific versions:
- Radix packages: `^1.x.x` or `^2.x.x` (depending on package)
- lucide-react: `^0.460.0`
- class-variance-authority: `^0.7.1`

## Notes

- The template system supports both TypeScript (.tsx) and JavaScript (.jsx)
- All components use forwardRef for proper ref handling
- Components follow Radix UI patterns and best practices
- Design tokens make components theme-able without React re-renders
- Accessibility is built-in via Radix primitives
