# Component Roadmap

Comprehensive list of components for js-ds-ui design system.

## Status Legend

- 🟢 **Done** - Implemented and tested
- 🟡 **In Progress** - Being developed
- ⚪ **Planned** - Not started
- 🔵 **Optional** - Nice to have, lower priority

---

## Phase 1: Core Components (Essential) 🎯

These are must-haves for any design system. Focus on these first.

### Form Components

| Component | Status | Radix Primitive | Priority | Notes |
|-----------|--------|-----------------|----------|-------|
| Input | 🟢 | - | P0 | ✅ Done |
| Button | 🟢 | Slot | P0 | ✅ Done |
| Textarea | 🟢 | - | P0 | ✅ Done — CVA size variants |
| Label | 🟢 | Label | P0 | ✅ Done |
| Checkbox | 🟢 | Checkbox | P0 | ✅ Done — indeterminate support |
| Radio | 🟢 | Radio Group | P0 | ✅ Done |
| Select | 🟢 | Select | P0 | ✅ Done — CVA size variants |
| Switch | 🟢 | Switch | P0 | ✅ Done |
| Form | 🟢 | - | P1 | ✅ Done |
| FormField | 🟢 | - | P1 | ✅ Done |

### Feedback Components

| Component | Status | Radix Primitive | Priority | Notes |
|-----------|--------|-----------------|----------|-------|
| Alert | 🟢 | - | P0 | ✅ Done — conditional aria-live |
| Toast | 🟢 | Toast | P0 | ✅ Done |
| Spinner | 🟢 | - | P0 | ✅ Done |
| Progress | 🟢 | Progress | P1 | ✅ Done |
| Skeleton | 🟢 | - | P1 | ✅ Done |

### Layout Components

| Component | Status | Radix Primitive | Priority | Notes |
|-----------|--------|-----------------|----------|-------|
| Card | 🟢 | - | P0 | ✅ Done |
| Separator | 🟢 | Separator | P0 | ✅ Done |
| Container | 🟢 | - | P1 | ✅ Done |
| Stack | 🟢 | - | P1 | ✅ Done |

---

## Phase 2: Navigation & Overlays 🧭

Components for navigation and modal interactions.

### Navigation Components

| Component | Status | Radix Primitive | Priority | Notes |
|-----------|--------|-----------------|----------|-------|
| Tabs | 🟢 | Tabs | P0 | ✅ Done |
| Breadcrumb | 🟢 | - | P1 | ✅ Done |
| Pagination | 🟢 | - | P1 | ✅ Done |
| NavigationMenu | 🟢 | Navigation Menu | P1 | ✅ Done |

### Overlay Components

| Component | Status | Radix Primitive | Priority | Notes |
|-----------|--------|-----------------|----------|-------|
| Dialog | 🟢 | Dialog | P0 | ✅ Done |
| Popover | 🟢 | Popover | P0 | ✅ Done |
| Tooltip | 🟢 | Tooltip | P0 | ✅ Done |
| DropdownMenu | 🟢 | Dropdown Menu | P0 | ✅ Done |
| Sheet | 🟢 | Dialog | P1 | ✅ Done |
| ContextMenu | 🟢 | Context Menu | P1 | ✅ Done |
| HoverCard | 🟢 | Hover Card | P2 | ✅ Done |

---

## Phase 3: Data Display 📊

Components for displaying structured data.

### Display Components

| Component | Status | Radix Primitive | Priority | Notes |
|-----------|--------|-----------------|----------|-------|
| Badge | 🟢 | - | P0 | ✅ Done — error/warning/success/info variants |
| Avatar | 🟢 | Avatar | P0 | ✅ Done |
| Table | 🟢 | - | P1 | ✅ Done |
| Accordion | 🟢 | Accordion | P1 | ✅ Done |
| Collapsible | 🟢 | Collapsible | P1 | ✅ Done |
| List | ⚪ | - | P1 | Ordered/unordered lists |
| EmptyState | ⚪ | - | P2 | No data placeholder |

---

## Phase 4: Advanced Inputs 🎛️

Complex input components and pickers.

### Advanced Form Components

| Component | Status | Radix Primitive | Priority | Notes |
|-----------|--------|-----------------|----------|-------|
| Combobox | 🟢 | - | P1 | ✅ Done — cmdk based |
| Command | 🟢 | - | P1 | ✅ Done |
| Slider | 🟢 | Slider | P1 | ✅ Done |
| DatePicker | 🟢 | Popover + Calendar | P1 | ✅ Done |
| Calendar | 🟢 | - | P1 | ✅ Done |
| TimePicker | 🟢 | - | P2 | ✅ Done |
| DateRangePicker | 🟢 | Popover + Calendar | P2 | ✅ Done |
| ColorPicker | 🟢 | - | P2 | ✅ Done |
| FileUpload | 🟢 | - | P2 | ✅ Done |

---

## Phase 5: Specialized Components 🎨

Domain-specific and advanced components.

### Specialized Components

| Component | Status | Radix Primitive | Priority | Notes |
|-----------|--------|-----------------|----------|-------|
| DataTable | 🟢 | - | P1 | ✅ Done — sorting/filtering/rowKey |
| Menubar | 🟢 | Menubar | P2 | ✅ Done |
| ScrollArea | 🟢 | Scroll Area | P2 | ✅ Done |
| AspectRatio | 🟢 | Aspect Ratio | P2 | ✅ Done |
| ToggleGroup | 🟢 | Toggle Group | P2 | ✅ Done |
| Toolbar | 🟢 | Toolbar | P2 | ✅ Done |
| Stepper | 🔵 | - | P2 | Multi-step form indicator |
| Timeline | 🔵 | - | P2 | Vertical timeline |
| Rating | 🔵 | - | P2 | Star rating input |

---

## Phase 6: Composition Components 🏗️

Higher-level components composed from primitives.

### Composition Components

| Component | Status | Radix Primitive | Priority | Notes |
|-----------|--------|-----------------|----------|-------|
| SearchBar | 🟢 | Input + Combobox | P1 | ✅ Done |
| LoginForm | 🔵 | Form + Input + Button | P2 | Pre-built login form |
| SignupForm | 🔵 | Form + Input + Button | P2 | Pre-built signup form |
| ConfirmDialog | 🟢 | Dialog + Button | P2 | ✅ Done |
| UserMenu | 🟢 | DropdownMenu + Avatar | P2 | ✅ Done |
| FilterBar | 🔵 | Multiple | P2 | Data filtering UI |

---

## Phase 7: Typography & Media 📝

Text and media components.

### Typography Components

| Component | Status | Radix Primitive | Priority | Notes |
|-----------|--------|-----------------|----------|-------|
| Heading | 🟢 | - | P1 | ✅ Done |
| Text | 🟢 | - | P1 | ✅ Done |
| Code | 🟢 | - | P1 | ✅ Done |
| CodeBlock | ⚪ | - | P2 | Multi-line code with syntax |
| Blockquote | 🟢 | - | P2 | ✅ Done |
| Link | 🟢 | - | P0 | ✅ Done |

### Media Components

| Component | Status | Radix Primitive | Priority | Notes |
|-----------|--------|-----------------|----------|-------|
| Image | 🟢 | - | P1 | ✅ Done |
| Icon | 🟢 | - | P0 | ✅ Done |
| Video | 🔵 | - | P2 | Video player |

---

## Phase 8: Accessibility & Utilities 🦾

Components focused on accessibility and developer experience.

### Accessibility Components

| Component | Status | Radix Primitive | Priority | Notes |
|-----------|--------|-----------------|----------|-------|
| VisuallyHidden | 🟢 | Visually Hidden | P1 | ✅ Done |
| FocusTrap | 🟢 | - | P1 | ✅ Done |
| SkipNav | 🟢 | - | P2 | ✅ Done |
| Announcement | 🟢 | - | P2 | ✅ Done |

### Utility Components

| Component | Status | Radix Primitive | Priority | Notes |
|-----------|--------|-----------------|----------|-------|
| Portal | ⚪ | Portal | P1 | Render outside DOM hierarchy |
| Slot | 🟢 | Slot | P0 | ✅ Already via Radix |
| Presence | ⚪ | - | P2 | Animation presence |

---

## Component Complexity Matrix

### Simple (1-2 days)
- Label, Link, Badge, Separator, Card, Spinner, Text, Heading, Code

### Medium (3-5 days)
- Checkbox, Radio, Switch, Textarea, Select, Alert, Avatar, Breadcrumb, Collapsible, Icon, Image

### Complex (1-2 weeks)
- Form, FormField, Toast, Dialog, Popover, Tabs, Table, Accordion, DropdownMenu, Sheet

### Very Complex (2-3 weeks)
- Combobox, Command, DatePicker, Calendar, DataTable, NavigationMenu, ContextMenu

---

## Total Component Count

- **Phase 1 (Core)**: 14 components
- **Phase 2 (Navigation/Overlays)**: 11 components
- **Phase 3 (Data Display)**: 7 components
- **Phase 4 (Advanced Inputs)**: 9 components
- **Phase 5 (Specialized)**: 9 components
- **Phase 6 (Composition)**: 6 components
- **Phase 7 (Typography/Media)**: 9 components
- **Phase 8 (Accessibility/Utils)**: 6 components

**Total: ~72 components** (including variations)

---

## Progress Summary

- **🟢 Done**: 60 components
- **⚪ Planned**: 5 components (List, EmptyState, CodeBlock, Portal, Presence)
- **🔵 Optional**: 7 components (Stepper, Timeline, Rating, LoginForm, SignupForm, FilterBar, Video)

---

## Notes

### Radix UI Coverage
Most complex components can leverage Radix primitives:
- ✅ Excellent accessibility out of the box
- ✅ Keyboard navigation handled
- ✅ ARIA attributes included
- ✅ Focus management
- ✅ Portal rendering

### Testing Strategy
Each component needs:
1. Unit tests (render, props, interactions)
2. Accessibility tests (jest-axe)
3. Keyboard navigation tests
4. Visual regression tests (optional: Playwright)

### Documentation Requirements
Each component needs:
1. Props documentation
2. Usage examples
3. Accessibility notes
4. Do's and Don'ts
5. MCP metadata entry

### Token Requirements
New tokens may be needed for:
- Component-specific spacing
- Component-specific colors
- Animation durations
- Z-index scale
- Border radius variants
- Shadow scale
