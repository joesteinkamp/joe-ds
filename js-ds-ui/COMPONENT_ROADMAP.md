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
| Textarea | ⚪ | - | P0 | Multi-line text input |
| Label | 🟢 | Label | P0 | ✅ Done |
| Checkbox | 🟢 | Checkbox | P0 | ✅ Done |
| Radio | 🟢 | Radio Group | P0 | ✅ Done |
| Select | 🟢 | Select | P0 | ✅ Done |
| Switch | 🟢 | Switch | P0 | ✅ Done |
| Form | ⚪ | - | P1 | Form wrapper with validation |
| FormField | ⚪ | - | P1 | Field wrapper (label + input + error) |

### Feedback Components

| Component | Status | Radix Primitive | Priority | Notes |
|-----------|--------|-----------------|----------|-------|
| Alert | ⚪ | - | P0 | Info/warning/error/success alerts |
| Toast | 🟢 | Toast | P0 | ✅ Done |
| Spinner | ⚪ | - | P0 | Loading indicator |
| Progress | 🟢 | Progress | P1 | ✅ Done |
| Skeleton | ⚪ | - | P1 | Loading placeholder |

### Layout Components

| Component | Status | Radix Primitive | Priority | Notes |
|-----------|--------|-----------------|----------|-------|
| Card | ⚪ | - | P0 | Content container |
| Separator | 🟢 | Separator | P0 | ✅ Done |
| Container | ⚪ | - | P1 | Max-width container |
| Stack | ⚪ | - | P1 | Vertical/horizontal stack |

---

## Phase 2: Navigation & Overlays 🧭

Components for navigation and modal interactions.

### Navigation Components

| Component | Status | Radix Primitive | Priority | Notes |
|-----------|--------|-----------------|----------|-------|
| Tabs | 🟢 | Tabs | P0 | ✅ Done |
| Breadcrumb | ⚪ | - | P1 | Breadcrumb navigation |
| Pagination | ⚪ | - | P1 | Page navigation |
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
| Badge | ⚪ | - | P0 | Status badge/tag |
| Avatar | 🟢 | Avatar | P0 | ✅ Done |
| Table | ⚪ | - | P1 | Data table |
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
| Combobox | ⚪ | - | P1 | Searchable select (cmdk) |
| Command | ⚪ | - | P1 | Command palette |
| Slider | 🟢 | Slider | P1 | ✅ Done |
| DatePicker | ⚪ | Popover + Calendar | P1 | Single date picker |
| Calendar | ⚪ | - | P1 | Calendar grid |
| TimePicker | ⚪ | - | P2 | Time selection |
| DateRangePicker | ⚪ | Popover + Calendar | P2 | Date range selection |
| ColorPicker | 🔵 | - | P2 | Color selection |
| FileUpload | 🔵 | - | P2 | File upload with preview |

---

## Phase 5: Specialized Components 🎨

Domain-specific and advanced components.

### Specialized Components

| Component | Status | Radix Primitive | Priority | Notes |
|-----------|--------|-----------------|----------|-------|
| DataTable | ⚪ | - | P1 | Table with sorting/filtering |
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
| SearchBar | ⚪ | Input + Combobox | P1 | Search with autocomplete |
| LoginForm | 🔵 | Form + Input + Button | P2 | Pre-built login form |
| SignupForm | 🔵 | Form + Input + Button | P2 | Pre-built signup form |
| ConfirmDialog | 🔵 | Dialog + Button | P2 | Confirmation modal |
| UserMenu | 🔵 | DropdownMenu + Avatar | P2 | User profile dropdown |
| FilterBar | 🔵 | Multiple | P2 | Data filtering UI |
| Pagination | ⚪ | Button | P1 | Page navigation |

---

## Phase 7: Typography & Media 📝

Text and media components.

### Typography Components

| Component | Status | Radix Primitive | Priority | Notes |
|-----------|--------|-----------------|----------|-------|
| Heading | ⚪ | - | P1 | h1-h6 with variants |
| Text | ⚪ | - | P1 | Paragraph text with sizes |
| Code | ⚪ | - | P1 | Inline code block |
| CodeBlock | ⚪ | - | P2 | Multi-line code with syntax |
| Blockquote | ⚪ | - | P2 | Quote block |
| Link | ⚪ | - | P0 | Hyperlink |

### Media Components

| Component | Status | Radix Primitive | Priority | Notes |
|-----------|--------|-----------------|----------|-------|
| Image | ⚪ | - | P1 | Image with loading states |
| Icon | ⚪ | - | P0 | Icon wrapper |
| Video | 🔵 | - | P2 | Video player |

---

## Phase 8: Accessibility & Utilities 🦾

Components focused on accessibility and developer experience.

### Accessibility Components

| Component | Status | Radix Primitive | Priority | Notes |
|-----------|--------|-----------------|----------|-------|
| VisuallyHidden | 🟢 | Visually Hidden | P1 | ✅ Done |
| FocusTrap | ⚪ | - | P1 | Trap focus within element |
| SkipNav | ⚪ | - | P2 | Skip to main content |
| Announcement | ⚪ | - | P2 | Live region announcements |

### Utility Components

| Component | Status | Radix Primitive | Priority | Notes |
|-----------|--------|-----------------|----------|-------|
| Portal | ⚪ | Portal | P1 | Render outside DOM hierarchy |
| Slot | 🟢 | Slot | P0 | ✅ Already via Radix |
| Presence | ⚪ | - | P2 | Animation presence |

---

## Recommended Implementation Order

### Sprint 1: Core Forms (2 weeks)
1. Label
2. Checkbox
3. Radio
4. Switch
5. Textarea
6. Select
7. FormField
8. Form

### Sprint 2: Feedback & Layout (1 week)
1. Alert
2. Toast
3. Spinner
4. Card
5. Separator
6. Badge

### Sprint 3: Overlays (2 weeks)
1. Dialog
2. Popover
3. Tooltip
4. DropdownMenu
5. Sheet

### Sprint 4: Navigation & Display (2 weeks)
1. Tabs
2. Breadcrumb
3. Avatar
4. Table
5. Accordion
6. Link

### Sprint 5: Advanced Inputs (2 weeks)
1. Combobox/Command
2. Slider
3. Calendar
4. DatePicker
5. DateRangePicker

### Sprint 6: Typography & Refinements (1 week)
1. Heading
2. Text
3. Code
4. Icon
5. Image

### Sprint 7: Specialized (2 weeks)
1. DataTable
2. Pagination
3. ScrollArea
4. ToggleGroup
5. Menubar

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
- **Phase 6 (Composition)**: 7 components
- **Phase 7 (Typography/Media)**: 9 components
- **Phase 8 (Accessibility/Utils)**: 7 components

**Total: ~73 components** (including variations)

---

## Priority Breakdown

- **P0 (Critical)**: 25 components - Must have for MVP
- **P1 (High)**: 30 components - Core functionality
- **P2 (Medium)**: 13 components - Enhanced experience
- **Optional**: 5 components - Nice to have

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

---

## Quick Start: Next 5 Components

If you want to start immediately, build these in order:

1. **Label** - Simple, needed by all form components
2. **Checkbox** - Common form input, good Radix example
3. **Alert** - Important for user feedback
4. **Card** - Basic layout primitive
5. **Dialog** - Essential for modals

This gives you:
- ✅ Better form support
- ✅ User feedback
- ✅ Layout options
- ✅ Modal dialogs
- ✅ Good variety to test the system
