# js-ds-ui Implementation Plan

Comprehensive plan combining the 2026 best practices evaluation (UX Designer, Frontend Engineer, Design Technologist), the Component Roadmap, and Figma Connect integration.

## Current State

**Completed (Phase 1: Unblock the CLI)**
- Fixed duplicate `ToastProps` type in toast.tsx
- Completed all 20 placeholder CLI templates
- Synced CLI registry versions with components package.json
- Added tsconfig path alias setup (`@/*`) to `init` command

**What Exists Today**
- 30 components implemented and tested (Radix UI primitives)
- Three-tier DTCG token system (Primitives/Semantic/Component)
- OKLCH color system with Leonardo contrast generation
- Density system (compact/default/comfortable) via CSS variables
- CLI with `init` and `add` commands
- jest-axe accessibility tests on all components
- WCAG 2.2 AAA contrast target (7:1)
- AI/MCP component manifest (partial — 2 of 30 components)

**Scores from 2026 Evaluation**
- UX Designer: 7/10
- Frontend Engineer: B+ (8.5/10)
- Design Technologist: Strong foundation, needs Tier 1 work

---

## Phase 2: Ship Blockers (0-4 weeks)

Critical items that block production adoption.

### 2.1 React 19 / RSC Support
**Priority:** P0 | **Effort:** 2 days | **Owner:** Frontend

Add `'use client'` directives to all interactive components and hooks. This is the #1 blocker for Next.js App Router users.

**Tasks:**
- [ ] Add `'use client'` to all 30 component files in `packages/components/src/ui/`
- [ ] Add `'use client'` to `useTheme` and `useDensity` hooks
- [ ] Update CLI templates to include `'use client'` in generated output
- [ ] Fix SSR hydration in `useTheme` — prevent flash of wrong theme
- [ ] Fix SSR hydration in `useDensity` — guard `window`/`localStorage` access
- [ ] Add error boundary for `localStorage` failures (quota exceeded, disabled)
- [ ] Test with Next.js App Router project

**Files:**
- `packages/components/src/ui/*.tsx` (all 30 files)
- `packages/components/src/hooks/use-theme.ts`
- `packages/components/src/hooks/use-density.ts`
- `packages/cli/src/templates/index.ts`

### 2.2 Motion Tokens & Reduced-Motion Support
**Priority:** P0 | **Effort:** 3-4 days | **Owner:** Design Technologist

All three reviewers flagged this as the #1 gap. No `prefers-reduced-motion` support is a WCAG 2.5.5 compliance risk.

**Tasks:**
- [ ] Create `packages/tokens/src/primitives/motion.json`:
  ```json
  {
    "animation": {
      "$type": "duration",
      "duration": {
        "instant": { "$value": "0ms", "$description": "No animation" },
        "fast": { "$value": "100ms", "$description": "Micro-interactions" },
        "normal": { "$value": "200ms", "$description": "Standard transitions" },
        "slow": { "$value": "300ms", "$description": "Emphasis animations" },
        "slower": { "$value": "500ms", "$description": "Page transitions" }
      },
      "easing": {
        "ease-in": { "$value": "cubic-bezier(0.4, 0, 1, 1)" },
        "ease-out": { "$value": "cubic-bezier(0, 0, 0.2, 1)" },
        "ease-in-out": { "$value": "cubic-bezier(0.4, 0, 0.2, 1)" },
        "spring": { "$value": "cubic-bezier(0.175, 0.885, 0.32, 1.275)" }
      }
    }
  }
  ```
- [ ] Add Style Dictionary transforms for motion tokens → CSS custom properties
- [ ] Audit all 30 components for hardcoded animation values
- [ ] Replace hardcoded `duration-200`, `duration-300` with `var(--animation-duration-*)` tokens
- [ ] Add global `prefers-reduced-motion` support:
  - CSS: `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`
  - Include in tokens.css output
- [ ] Update animated components (accordion, dialog, sheet, toast, dropdown-menu, context-menu) to respect reduced motion
- [ ] Update CLI templates with motion token references

**Files:**
- `packages/tokens/src/primitives/motion.json` (new)
- `packages/tokens/config.js` (add motion transforms)
- `packages/components/src/ui/accordion.tsx`
- `packages/components/src/ui/dialog.tsx`
- `packages/components/src/ui/sheet.tsx`
- `packages/components/src/ui/toast.tsx`
- `packages/components/src/ui/dropdown-menu.tsx`
- `packages/components/src/ui/context-menu.tsx`

### 2.3 Token Gaps: Z-Index, Shadows, Touch Targets
**Priority:** P0 | **Effort:** 2 days | **Owner:** Design Technologist

**Tasks:**
- [ ] Create `packages/tokens/src/primitives/z-index.json`:
  ```json
  {
    "z-index": {
      "dropdown": { "$value": "1000" },
      "sticky": { "$value": "1020" },
      "fixed": { "$value": "1030" },
      "modal-backdrop": { "$value": "1040" },
      "modal": { "$value": "1050" },
      "popover": { "$value": "1060" },
      "tooltip": { "$value": "1070" },
      "toast": { "$value": "1080" }
    }
  }
  ```
- [ ] Create `packages/tokens/src/primitives/shadow.json` with elevation scale (sm/md/lg/xl)
- [ ] Add touch target tokens to `packages/tokens/src/primitives/sizing.json`:
  - `touch-minimum`: `2.75rem` (44px — Apple HIG)
  - `touch-comfortable`: `3rem` (48px — WCAG guidance)
- [ ] Replace hardcoded `z-[100]`, `z-50` in components with token references
- [ ] Replace hardcoded `shadow-lg`, `shadow-md` with token references
- [ ] Update button height minimum to meet touch target minimum (currently 40px, should be 44px)
- [ ] Update CLI templates with new tokens

### 2.4 CLI `list` and `remove` Commands
**Priority:** P0 | **Effort:** 2-3 days | **Owner:** Frontend

**Tasks:**
- [ ] Create `packages/cli/src/commands/list.ts`:
  - Show all available components from registry
  - Show installed vs. available status
  - Group by category (form, overlay, display, navigation)
- [ ] Create `packages/cli/src/commands/remove.ts`:
  - Remove component files from project
  - Warn about dependent components
  - Clean up unused npm dependencies
- [ ] Register commands in CLI entry point
- [ ] Update CLI README with new commands
- [ ] Add tests for both commands

**Files:**
- `packages/cli/src/commands/list.ts` (new)
- `packages/cli/src/commands/remove.ts` (new)
- `packages/cli/src/index.ts`

---

## Phase 3: Foundation (1-3 months)

### 3.1 Figma Code Connect Integration
**Priority:** P1 | **Effort:** 5-7 days | **Owner:** Design Technologist

Connect all existing components to Figma via Code Connect, enabling Figma MCP to generate production-ready React JSX.

**Tasks:**
- [ ] Install `@figma/code-connect` as devDependency in `packages/components`
- [ ] Create `figma.config.json` in `packages/components`
- [ ] Capture Figma component URL/IDs for all 30 existing components from the design library
- [ ] Create `.figma.tsx` mapping files for all existing components:

  **Form Components (7 files):**
  - [ ] `button.figma.tsx` — Map Variant (Primary/Secondary/Outline/Ghost/Destructive), Size (sm/md/lg), Label, Disabled, asChild
  - [ ] `input.figma.tsx` — Map Type, Placeholder, Disabled, className
  - [ ] `label.figma.tsx` — Map Text, htmlFor
  - [ ] `checkbox.figma.tsx` — Map Checked, Disabled, Label
  - [ ] `radio-group.figma.tsx` — Map Value, Disabled, Options (nested instances)
  - [ ] `switch.figma.tsx` — Map Checked, Disabled, Label
  - [ ] `select.figma.tsx` — Map Placeholder, Disabled, Items (nested instances)
  - [ ] `slider.figma.tsx` — Map Min, Max, Step, Value, Disabled

  **Overlay Components (8 files):**
  - [ ] `dialog.figma.tsx` — Map Title, Description, Content (children), Footer actions
  - [ ] `popover.figma.tsx` — Map Trigger, Content, Side, Align
  - [ ] `tooltip.figma.tsx` — Map Trigger, Content, Side, Align
  - [ ] `dropdown-menu.figma.tsx` — Map Trigger, Items (nested instances with Separator/CheckboxItem/RadioItem)
  - [ ] `context-menu.figma.tsx` — Map Trigger, Items (nested)
  - [ ] `hover-card.figma.tsx` — Map Trigger, Content
  - [ ] `sheet.figma.tsx` — Map Side (top/right/bottom/left), Title, Description, Content
  - [ ] `toast.figma.tsx` — Map Variant (default/success/error/warning), Title, Description, Action

  **Display Components (8 files):**
  - [ ] `tabs.figma.tsx` — Map Default Value, Tab items
  - [ ] `avatar.figma.tsx` — Map Image src, Fallback text, Size
  - [ ] `separator.figma.tsx` — Map Orientation (horizontal/vertical), Decorative
  - [ ] `progress.figma.tsx` — Map Value, Max
  - [ ] `accordion.figma.tsx` — Map Type (single/multiple), Items (nested)
  - [ ] `collapsible.figma.tsx` — Map Open, Trigger, Content
  - [ ] `scroll-area.figma.tsx` — Map Orientation, Content
  - [ ] `aspect-ratio.figma.tsx` — Map Ratio

  **Navigation Components (2 files):**
  - [ ] `navigation-menu.figma.tsx` — Map Items (nested with triggers/content)
  - [ ] `menubar.figma.tsx` — Map Menus (nested with items/shortcuts)

  **Grouping Components (2 files):**
  - [ ] `toggle-group.figma.tsx` — Map Type (single/multiple), Variant, Size, Items
  - [ ] `toolbar.figma.tsx` — Map Children, Separator

  **Utility Components (2 files):**
  - [ ] `visually-hidden.figma.tsx` — Map Children
  - [ ] `tooltip.figma.tsx` — Already listed above

- [ ] Run `npx figma connect validate` to verify all mappings
- [ ] Publish mappings with `npx figma connect publish`
- [ ] Add `figma:validate` and `figma:publish` scripts to `packages/components/package.json`
- [ ] Document the Figma Connect workflow in a new `FIGMA_CONNECT.md`

**As new components are added (Phases 3.2-3.4), create `.figma.tsx` files alongside them.**

### 3.2 Storybook Setup
**Priority:** P1 | **Effort:** 3-4 days | **Owner:** Frontend

**Tasks:**
- [ ] Install and configure Storybook 8 in `packages/components`
- [ ] Configure design token addon for theme/density switching
- [ ] Configure a11y addon for accessibility panel
- [ ] Write stories for all 30 existing components:
  - All variants and states
  - Props documentation via autodocs
  - Real-world usage examples
  - Accessibility annotations
- [ ] Configure visual regression testing with Chromatic or Percy
- [ ] Add `storybook` and `build-storybook` scripts
- [ ] Deploy to Vercel/Netlify for team collaboration

### 3.3 High-Priority Missing Components
**Priority:** P1 | **Effort:** 7-10 days | **Owner:** Frontend

Build the most impactful missing components. For each: implement component, tests (unit + a11y + keyboard), CLI template, registry entry, MCP manifest, and `.figma.tsx` mapping.

**Batch 1 — Simple (1-2 days each):**
- [ ] **Card** — Content container with Header/Content/Footer sub-components
- [ ] **Badge** — Status badge/tag with variants (default, secondary, outline, destructive)
- [ ] **Alert** — Persistent message with variants (info, warning, error, success) + icon support
- [ ] **Skeleton** — Loading placeholder with pulse animation (respects `prefers-reduced-motion`)
- [ ] **Textarea** — Multi-line text input, consistent with Input styling
- [ ] **Link** — Styled hyperlink with external link detection

**Batch 2 — Medium (3-5 days each):**
- [ ] **FormField** — Composite: Label + Input/Select/etc + ErrorMessage + HelperText with `aria-describedby`
- [ ] **Breadcrumb** — Navigation aid with separator customization
- [ ] **Pagination** — Page navigation with first/prev/next/last
- [ ] **Spinner** — Loading indicator with size variants

### 3.4 CLI `update` and `diff` Commands
**Priority:** P1 | **Effort:** 3-4 days | **Owner:** Frontend

**Tasks:**
- [ ] Add version tracking to `js-ds-ui.json` config (record installed component versions)
- [ ] Create `packages/cli/src/commands/diff.ts`:
  - Compare local component with latest template
  - Show unified diff output
- [ ] Create `packages/cli/src/commands/update.ts`:
  - Update specific or all components to latest
  - Show diff before applying
  - Backup existing files before overwriting
- [ ] Add framework detection to `init` command:
  - Auto-detect Next.js (next.config.*), Vite (vite.config.*), Remix (remix.config.*), Astro (astro.config.*)
  - Generate appropriate configuration
  - Detect monorepo (pnpm-workspace.yaml)

### 3.5 Component Lifecycle & Status Tracking
**Priority:** P1 | **Effort:** 1 day | **Owner:** Design Technologist

**Tasks:**
- [ ] Add `status` field to registry entries: `stable | beta | alpha | deprecated`
- [ ] Add `since` version field to each component
- [ ] Add status indicator to `npx js-ds-ui list` output
- [ ] Update `COMPONENT_ROADMAP.md` to reflect new status field
- [ ] Document deprecation strategy

### 3.6 Performance Optimizations
**Priority:** P1 | **Effort:** 2 days | **Owner:** Frontend

**Tasks:**
- [ ] Add `React.memo` to presentational components (Separator, VisuallyHidden, AspectRatio, Avatar, Badge, Progress)
- [ ] Memoize `useTheme` and `useDensity` setters with `useCallback`
- [ ] Audit render performance with React DevTools Profiler
- [ ] Add bundle size tracking to CI (bundlesize or size-limit)
- [ ] Publish component size manifests ("Button: 2.1 KB gzipped")

### 3.7 Complete AI/MCP Manifest
**Priority:** P1 | **Effort:** 2-3 days | **Owner:** Design Technologist

**Tasks:**
- [ ] Expand `metadata/component-manifest.json` to cover all 30+ components (currently only Button and Input)
- [ ] Add composition metadata: "pairs well with", "often wrapped by"
- [ ] Add accessibility metadata per component: WCAG coverage, keyboard patterns
- [ ] Add bundle size metadata per component
- [ ] Add usage pattern examples for 10+ common UI scenarios (forms, modals, navigation, data display)
- [ ] Auto-generate manifest from component source where possible

---

## Phase 4: Modern CSS & Platform (3-6 months)

### 4.1 Advanced Missing Components
**Priority:** P2 | **Effort:** 10-14 days | **Owner:** Frontend

**Tasks (each includes: component, tests, CLI template, registry, manifest, .figma.tsx):**
- [ ] **Combobox / Autocomplete** — Searchable select, likely using cmdk
- [ ] **Command Palette** — Cmd+K pattern, full keyboard navigation
- [ ] **Calendar** — Grid calendar with ARIA
- [ ] **DatePicker** — Popover + Calendar composition
- [ ] **Table** — Basic data table with sorting and filtering
- [ ] **DataTable** — Advanced table with column resizing, row selection, pagination
- [ ] **Form** — Form wrapper with validation state management

### 4.2 Modern CSS Adoption
**Priority:** P2 | **Effort:** 3-4 days | **Owner:** Design Technologist

**Tasks:**
- [ ] Add CSS Layers (`@layer base, components, utilities`) to token output for specificity control
- [ ] Add Container Query support to responsive components (Card, Dialog, Sheet, Popover)
- [ ] Evaluate `:has()` selector for state-dependent styling
- [ ] Document browser support matrix for each modern CSS feature
- [ ] Add CSS nesting where it simplifies component styles

### 4.3 Bundle Size Analysis
**Priority:** P2 | **Effort:** 1-2 days | **Owner:** Frontend

**Tasks:**
- [ ] Add `size-limit` or `bundlesize` to CI pipeline
- [ ] Track per-component impact (gzipped size)
- [ ] Generate dependency graph visualization
- [ ] Document tree-shaking guidance

### 4.4 Layout Primitive Components
**Priority:** P2 | **Effort:** 3-4 days | **Owner:** Frontend

**Tasks (each with tests, template, registry, manifest, .figma.tsx):**
- [ ] **Stack** — Vertical/horizontal flex wrapper with density-aware spacing
- [ ] **Container** — Max-width wrapper with responsive padding
- [ ] **Heading** — h1-h6 with semantic token-based styles
- [ ] **Text** — Paragraph text with size/weight variants

### 4.5 Figma Token Sync (Bidirectional)
**Priority:** P2 | **Effort:** 5-7 days | **Owner:** Design Technologist

**Tasks:**
- [ ] Build Figma plugin or script to push tokens from code → Figma Variables API
- [ ] Map DTCG token tiers to Figma variable collections (Primitives, Semantic, Component)
- [ ] Sync color, spacing, typography, and sizing tokens
- [ ] Map density modes to Figma variable modes
- [ ] Map themes (light/dark/high-contrast) to Figma variable modes
- [ ] Document two-way sync workflow
- [ ] Add `figma:sync-tokens` script to package.json

---

## Phase 5: Polish & Scale (6-12 months)

### 5.1 Typography & Media Components
**Priority:** P3 | **Effort:** 5-7 days | **Owner:** Frontend

**Tasks (each with tests, template, registry, manifest, .figma.tsx):**
- [ ] **Code / CodeBlock** — Inline and multi-line code with syntax highlighting
- [ ] **Blockquote** — Quote block component
- [ ] **Icon** — Icon wrapper with size/color tokens
- [ ] **Image** — Image with loading states and aspect ratio

### 5.2 Composition Components
**Priority:** P3 | **Effort:** 5-7 days | **Owner:** Frontend

- [ ] **SearchBar** — Input + Combobox composition
- [ ] **ConfirmDialog** — Dialog + Button pattern
- [ ] **UserMenu** — DropdownMenu + Avatar pattern

### 5.3 Advanced Inputs
**Priority:** P3 | **Effort:** 5-7 days | **Owner:** Frontend

- [ ] **DateRangePicker** — Date range selection
- [ ] **TimePicker** — Time selection
- [ ] **ColorPicker** — Color selection (OKLCH-aware)
- [ ] **FileUpload** — File upload with preview and drag-drop

### 5.4 Accessibility Components
**Priority:** P3 | **Effort:** 2-3 days | **Owner:** Frontend

- [ ] **FocusTrap** — Trap focus within element
- [ ] **SkipNav** — Skip to main content link
- [ ] **Announcement** — Live region for screen reader announcements

### 5.5 Multi-Platform Token Export
**Priority:** P3 | **Effort:** 3-4 days | **Owner:** Design Technologist

**Tasks:**
- [ ] Add Style Dictionary export formats for iOS (Swift), Android (Kotlin)
- [ ] Add JSON export for design tools
- [ ] Add platform-specific transforms (rem → dp for Android, rem → pt for iOS)
- [ ] Document consuming tokens in native apps

### 5.6 E2E Testing
**Priority:** P3 | **Effort:** 3-4 days | **Owner:** Frontend

**Tasks:**
- [ ] Set up Playwright in monorepo
- [ ] Test full user flows (form submission, theme switching, overlay interactions)
- [ ] Test across Chrome, Safari, Firefox
- [ ] Test on mobile viewports
- [ ] Add to CI pipeline

### 5.7 Theme Builder CLI
**Priority:** P3 | **Effort:** 2-3 days | **Owner:** Design Technologist

**Tasks:**
- [ ] Create `npx js-ds-ui theme:create --primary #3b82f6` command
- [ ] Generate OKLCH color scales from brand color
- [ ] Output updated `tokens.json` and CSS
- [ ] Validate contrast ratios meet AAA target

---

## Cross-Cutting Concerns

### For Every New Component
When adding any component, always complete this checklist:

1. [ ] Component implementation in `packages/components/src/ui/`
2. [ ] Unit tests + accessibility tests (jest-axe) + keyboard navigation tests
3. [ ] `'use client'` directive at top of file
4. [ ] Use motion tokens (not hardcoded durations/easings)
5. [ ] Use z-index, shadow, sizing tokens (not hardcoded values)
6. [ ] CLI template (TS + JS variants) in `packages/cli/src/templates/index.ts`
7. [ ] Registry entry in `packages/cli/src/registry.ts`
8. [ ] `.figma.tsx` Code Connect mapping
9. [ ] MCP manifest entry in `metadata/component-manifest.json`
10. [ ] Storybook story with all variants
11. [ ] Meet WCAG 2.2 AAA contrast ratios
12. [ ] Respect `prefers-reduced-motion`
13. [ ] Touch targets >= 44px for interactive elements

### Testing Strategy
- **Unit tests**: Vitest + Testing Library (rendering, props, state)
- **Accessibility**: jest-axe automated scans
- **Keyboard**: Tab, Shift+Tab, Enter, Space, Arrow keys
- **Visual regression**: Chromatic/Percy via Storybook
- **E2E**: Playwright (Phase 5)

### Documentation Requirements
- Storybook story with autodocs
- Props documentation
- Usage examples
- Accessibility notes
- Do's and Don'ts
- MCP metadata entry

---

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|-----------------|
| **Phase 2: Ship Blockers** | 0-4 weeks | RSC support, motion tokens, z-index/shadow/touch tokens, CLI list/remove |
| **Phase 3: Foundation** | 1-3 months | Figma Connect (30 components), Storybook, 10 new components, CLI update/diff, perf optimizations, MCP manifest |
| **Phase 4: Modern CSS** | 3-6 months | 7 advanced components, CSS layers/container queries, layout primitives, Figma token sync, bundle analysis |
| **Phase 5: Polish** | 6-12 months | Typography/media, composition patterns, advanced inputs, multi-platform export, E2E testing, theme builder |

## Success Metrics

- **Phase 2 complete**: Production-ready for Next.js App Router projects, WCAG 2.5.5 compliant
- **Phase 3 complete**: 40+ components, Figma MCP generates correct JSX, Storybook deployed, 8.5/10 rating
- **Phase 4 complete**: 47+ components, modern CSS adoption, Figma token sync, 9/10 rating
- **Phase 5 complete**: 60+ components, multi-platform tokens, full E2E coverage, 9.5/10 rating
