# Figma Connect Implementation Plan

This plan outlines the strategy for integrating **Figma Code Connect** into the `js-ds-ui` design system. This integration will enable Figma MCP and other AI tools to generate production-ready code that perfectly matches the design intent.

## Objective

Map every React component in `js-ds-ui` to its corresponding Figma component. Each component will have a `.figma.tsx` mapping file alongside it to document the exact relationship between Figma properties and React props.

## Technical Requirements

1. **Dependency**: Add `@figma/code-connect` to `packages/components`.
2. **Configuration**: Create a `figma.config.json` in the root or component package.
3. **Mapping Files**: Create `[component].figma.tsx` for every component.

## Mapping Standard (`.figma.tsx`)

Each file must use the `figma.connect` API. 

### Example: `Button.figma.tsx`

```tsx
import figma from "@figma/code-connect"
import { Button } from "./button"

figma.connect(Button, "https://www.figma.com/file/...", {
  props: {
    variant: figma.enum("Variant", {
      Primary: "default",
      Secondary: "secondary",
      Outline: "outline",
      Ghost: "ghost",
      Destructive: "destructive",
    }),
    size: figma.enum("Size", {
      Small: "sm",
      Medium: "default",
      Large: "lg",
    }),
    label: figma.string("Label"),
    disabled: figma.boolean("Disabled"),
  },
  example: ({ variant, size, label, disabled }) => (
    <Button variant={variant} size={size} disabled={disabled}>
      {label}
    </Button>
  ),
})
```

## Component Checklist

The following components require a `.figma.tsx` mapping file:

- [ ] Accordion (`accordion.tsx`)
- [ ] Aspect Ratio (`aspect-ratio.tsx`)
- [ ] Avatar (`avatar.tsx`)
- [ ] Button (`button.tsx`)
- [ ] Checkbox (`checkbox.tsx`)
- [ ] Collapsible (`collapsible.tsx`)
- [ ] Context Menu (`context-menu.tsx`)
- [ ] Dialog (`dialog.tsx`)
- [ ] Dropdown Menu (`dropdown-menu.tsx`)
- [ ] Hover Card (`hover-card.tsx`)
- [ ] Input (`input.tsx`)
- [ ] Label (`label.tsx`)
- [ ] Menubar (`menubar.tsx`)
- [ ] Navigation Menu (`navigation-menu.tsx`)
- [ ] Popover (`popover.tsx`)
- [ ] Progress (`progress.tsx`)
- [ ] Radio Group (`radio-group.tsx`)
- [ ] Scroll Area (`scroll-area.tsx`)
- [ ] Select (`select.tsx`)
- [ ] Separator (`separator.tsx`)
- [ ] Sheet (`sheet.tsx`)
- [ ] Slider (`slider.tsx`)
- [ ] Switch (`switch.tsx`)
- [ ] Tabs (`tabs.tsx`)
- [ ] Toast (`toast.tsx`)
- [ ] Toggle Group (`toggle-group.tsx`)
- [ ] Toolbar (`toolbar.tsx`)
- [ ] Tooltip (`tooltip.tsx`)

## Implementation Steps

1. **Setup**: Install `@figma/code-connect` and authenticate with the Figma API.
2. **Identify IDs**: Capture the Figma Component URL/ID for each component in the design library.
3. **Scaffold**: Generate the `.figma.tsx` files using the template above.
4. **Validation**: Run `figma-linux connect validate` (or equivalent) to ensure mappings are correct.
5. **Publish**: Sync mappings to Figma using the Figma CLI.

## Production Impact

Once implemented, the **Figma MCP** will be able to:
- Detect a component selected in Figma.
- Automatically generate the corresponding React JSX.
- Preserve all theme tokens and prop variations.
