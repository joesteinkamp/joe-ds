# Design.pen Token Sync Plan

Sync all token definitions from `js-ds-ui/packages/tokens/src/` into `js-ds-ui/design.pen` variables.

**File:** `js-ds-ui/design.pen`
**Total tokens in source:** 717
**Currently in design.pen:** ~180
**Missing:** ~530

---

## Batch Assignments

### Engineer 1 — Foundations + Alert/Badge/Button

**Scope: ~130 tokens**

#### Batch 1A: Primitive Font Tokens (16 tokens)
Add from `primitives/typography.json`:
- `font.size.xs` through `font.size.5xl` (9 tokens)
- `font.weight.normal`, `font.weight.medium`, `font.weight.semibold`, `font.weight.bold` (4 tokens)
- `font.lineHeight.tight`, `font.lineHeight.normal`, `font.lineHeight.relaxed` (3 tokens)

#### Batch 1B: Missing Semantic Colors (5 tokens)
Add from `semantic/colors.json`:
- `color.interactive.secondary-hover`
- `color.interactive.secondary-active`
- `color.interactive.danger`
- `color.interactive.danger-hover`
- `color.interactive.danger-active`

#### Batch 1C: Remove Duplicate Interactive Tokens
design.pen has both dot and dash variants for interactive tokens. Remove the dot-separated duplicates:
- Remove `color.interactive.primary.hover` (keep `color.interactive.primary-hover`)
- Remove `color.interactive.primary.active` (keep `color.interactive.primary-active`)

#### Batch 1D: Complete Alert Component (~15 tokens)
Add color/variant tokens from `component/alert.json` (structural tokens already exist):
- `component.alert.default.bg`, `.text`, `.border`
- `component.alert.info.bg`, `.text`, `.border`
- `component.alert.warning.bg`, `.text`, `.border`
- `component.alert.error.bg`, `.text`, `.border`
- `component.alert.success.bg`, `.text`, `.border`
- `component.alert.font.size`, `.font.weight`, `.border.radius`, `.border.width`

#### Batch 1E: Complete Badge Component (~18 tokens)
Add color/variant tokens from `component/badge.json`:
- All 6 variant color sets (default, secondary, outline, destructive, success, warning) × 3 props (bg, text, border)
- `component.badge.focus-ring`

#### Batch 1F: Complete Button Component (~22 tokens)
Add color/variant tokens from `component/button.json`:
- All 5 variant color sets (primary, secondary, outline, ghost, danger) × 4 props (bg, bg-hover, text, border)
- `component.button.focus-ring`, `.disabled-opacity`

---

### Engineer 2 — Card through Input + Accordion/Avatar/Breadcrumb

**Scope: ~130 tokens**

#### Batch 2A: Complete Card Component (~7 tokens)
Add color tokens from `component/card.json`:
- `component.card.bg`, `.text`, `.description-text`, `.border-color`
- `component.card.font.title-size`, `.font.title-weight`, `.font.description-size`

#### Batch 2B: Complete Checkbox Component (~6 tokens)
Add color tokens from `component/checkbox.json`:
- `component.checkbox.bg`, `.border-color`, `.checked-bg`, `.checked-border`, `.checked-text`, `.focus-ring`

#### Batch 2C: Complete Dialog Component (~6 tokens)
Add color tokens from `component/dialog.json`:
- `component.dialog.bg`, `.text`, `.description-text`, `.border-color`, `.overlay-bg`, `.focus-ring`
- `component.dialog.font.title-size`, `.font.title-weight`, `.font.description-size`

#### Batch 2D: Complete Input Component (~7 tokens)
Add color tokens from `component/input.json`:
- `component.input.bg`, `.text`, `.placeholder`, `.border-color`, `.border-hover`, `.focus-ring`, `.error-border`

#### Batch 2E: Complete Switch Component (~4 tokens)
Add color tokens from `component/switch.json`:
- `component.switch.track-bg`, `.track-checked-bg`, `.thumb-bg`, `.focus-ring`

#### Batch 2F: Complete Toast Component (~13 tokens)
Add color/variant tokens from `component/toast.json`:
- 4 variant sets (default, success, error, warning) × 3 props (bg, text, border)
- `component.toast.action-border`, `.action-hover-bg`, `.close-text`, `.focus-ring`
- `component.toast.font.title-size`, `.font.title-weight`

#### Batch 2G: Accordion Component (13 tokens)
All tokens from `component/accordion.json`

#### Batch 2H: Avatar Component (9 tokens)
All tokens from `component/avatar.json`

#### Batch 2I: Breadcrumb Component (7 tokens)
All tokens from `component/breadcrumb.json`

#### Batch 2J: Collapsible Component (2 tokens)
All tokens from `component/collapsible.json`

#### Batch 2K: Confirm Dialog Component (7 tokens)
All tokens from `component/confirm-dialog.json`

---

### Engineer 3 — Context Menu through Navigation Menu

**Scope: ~140 tokens**

#### Batch 3A: Context Menu (15 tokens)
All tokens from `component/context-menu.json`

#### Batch 3B: Data Table (12 tokens)
All tokens from `component/data-table.json`

#### Batch 3C: Date Picker (14 tokens)
All tokens from `component/date-picker.json`

#### Batch 3D: Date Range Picker (12 tokens)
All tokens from `component/date-range-picker.json`

#### Batch 3E: Dropdown Menu (15 tokens)
All tokens from `component/dropdown-menu.json`

#### Batch 3F: File Upload (13 tokens)
All tokens from `component/file-upload.json`

#### Batch 3G: Form Field (8 tokens)
All tokens from `component/form-field.json`

#### Batch 3H: Heading (2 tokens)
All tokens from `component/heading.json`

#### Batch 3I: Hover Card (6 tokens)
All tokens from `component/hover-card.json`

#### Batch 3J: Label (4 tokens)
All tokens from `component/label.json`

#### Batch 3K: Link (5 tokens)
All tokens from `component/link.json`

#### Batch 3L: Menubar (17 tokens)
All tokens from `component/menubar.json`

#### Batch 3M: Navigation Menu (15 tokens)
All tokens from `component/navigation-menu.json`

---

### Engineer 4 — Pagination through User Menu

**Scope: ~135 tokens**

#### Batch 4A: Pagination (12 tokens)
All tokens from `component/pagination.json`

#### Batch 4B: Popover (6 tokens)
All tokens from `component/popover.json`

#### Batch 4C: Progress (4 tokens)
All tokens from `component/progress.json`

#### Batch 4D: Radio Group (9 tokens)
All tokens from `component/radio-group.json`

#### Batch 4E: Scroll Area (5 tokens)
All tokens from `component/scroll-area.json`

#### Batch 4F: Search Bar (11 tokens)
All tokens from `component/search-bar.json`

#### Batch 4G: Select (17 tokens)
All tokens from `component/select.json`

#### Batch 4H: Separator (2 tokens)
All tokens from `component/separator.json`

#### Batch 4I: Sheet (12 tokens)
All tokens from `component/sheet.json`

#### Batch 4J: Skeleton (2 tokens)
All tokens from `component/skeleton.json`

#### Batch 4K: Slider (9 tokens)
All tokens from `component/slider.json`

#### Batch 4L: Spinner (5 tokens)
All tokens from `component/spinner.json`

#### Batch 4M: Tabs (11 tokens)
All tokens from `component/tabs.json`

#### Batch 4N: Text (8 tokens)
All tokens from `component/text.json`

#### Batch 4O: Textarea (12 tokens)
All tokens from `component/textarea.json`

#### Batch 4P: Time Picker (13 tokens)
All tokens from `component/time-picker.json`

#### Batch 4Q: Toggle Group (5 tokens)
All tokens from `component/toggle-group.json`

#### Batch 4R: Toolbar (6 tokens)
All tokens from `component/toolbar.json`

#### Batch 4S: Tooltip (7 tokens)
All tokens from `component/tooltip.json`

#### Batch 4T: User Menu (15 tokens)
All tokens from `component/user-menu.json`

---

## Process

1. Each engineer reads their assigned token JSON files from `js-ds-ui/packages/tokens/src/`
2. Extract the `$value` from each token (use light theme values for light, dark theme values for dark)
3. Add variables to `js-ds-ui/design.pen` using `set_variables` tool
4. Variables should have both `light` and `dark` theme values (dark theme values come from semantic token references where available, otherwise same as light for primitives)
5. Use the existing variable naming convention already in design.pen (dot-separated paths)

## Notes

- Token JSON files use DTCG format: `{ "$value": "...", "$type": "..." }`
- Color values in source are OKLCH but design.pen uses hex — convert or use the hex fallbacks
- Shadow tokens in design.pen are already broken into sub-properties (blur, offsetX, offsetY, spread) — no changes needed there
- The `sizing.*` and `size.*` duplicates already in design.pen can stay for now
