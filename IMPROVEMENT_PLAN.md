# joe-ds Improvement Plan

Generated from a team review (UX Designer, Frontend Engineer, Technical Architect) on 2026-02-19.

## P0 — Fix Now

### 1. Consolidate Workspace Config
- Remove `js-ds-ui/pnpm-workspace.yaml` and `js-ds-ui/pnpm-lock.yaml`
- Remove `workspaces` field from `js-ds-ui/package.json`
- Add root `package.json` with orchestration scripts (`pnpm -r build`, etc.)
- Move `.nvmrc` and `.npmrc` from `js-ds-ui/` to repo root

### 2. Fix Turbo Config
- Rename `pipeline` to `tasks` in `turbo.json` (Turbo v2 breaking change)
- Move `turbo.json` to repo root so docs site is included in the build graph

### 3. Wire Component Tokens Properly
- `button.tsx`: Replace hardcoded `text-white` with `text-[var(--component-button-primary-text)]` on primary variant and `text-[var(--component-button-danger-text)]` on danger variant
- `dialog.tsx`: Replace `bg-black/80` overlay with `bg-[var(--color-background-overlay)]/80`
- `switch.tsx`: Replace hardcoded `translate-x-5` with calc based on `--component-switch-width` and `--component-switch-thumb-size`
- `slider.tsx`: Replace hardcoded `h-2` track and `h-5 w-5` thumb with `--component-slider-track-height` and `--component-slider-thumb-size` tokens

## P1 — High Impact

### 4. forwardRef Deprecation for React 19
- All components use `React.forwardRef` which is deprecated in React 19
- Plan: Document that a future version will drop `forwardRef` when React 19 becomes minimum
- Short-term: Accept the deprecation warnings for React 19 consumers

### 5. Standardize Variant Naming
- Choose `danger` for destructive actions (Button)
- Choose `error` for status indicators (Alert, Badge, Toast)
- Update Badge: rename `destructive` variant to `error`
- Document the naming convention in CONTRIBUTING.md

### 6. Add Size Variants to Form Elements
- Add `size` prop (`sm`/`md`/`lg`) to Input, Select, and Textarea
- Match Button's sizing API for consistency
- Use component tokens for each size level

### 7. useTheme/useDensity Need Shared Context
- Wrap in `ThemeProvider` / `DensityProvider` React context
- Keep hooks as public API but consume context internally
- Enables SSR-safe hydration with single source of truth

### 8. Generate CLI Templates from Source
- Replace 12,090-line `packages/cli/src/templates/index.ts` with a codegen step
- Build script reads actual component source files and produces template strings
- Keeps CLI binary smaller and eliminates manual sync

### 9. DataTable Uses rowIndex as React Key
- `data-table.tsx:165` uses `key={rowIndex}` — breaks on sort/pagination
- Fix: Accept optional `rowKey` prop or fall back to `row.id ?? rowIndex`

### 10. Automate design.pen Token Sync
- Only 180/717 tokens currently synced
- Complete and automate `scripts/gen-pen-variables.mjs`
- Run as part of build or CI

### 11. Add Changesets for Version Management
- Install `@changesets/cli`
- Required for CLI `diff` and `update` commands to work properly
- Enables structured release notes

### 12. Test Against React 19 in CI
- Add React 19 to test matrix
- Update `@types/react` dev dependency to include React 19 types

## P2 — Important Improvements

### 13. Fix Alert aria-live Semantics
- Use `role="status"` with `aria-live="polite"` for info/warning variants
- Reserve `role="alert"` (assertive) for error variant only

### 14. Checkbox Indeterminate Indicator
- Show minus/dash icon when `checked="indeterminate"` instead of Check icon

### 15. Add Opacity Tokens
- Add semantic tokens: `opacity.disabled`, `opacity.overlay`, `opacity.hover`
- Replace hardcoded `opacity-50` in disabled states

### 16. CSS Layer Import Order Documentation
- Document required import order (base.css before token CSS)
- Or ship a single entrypoint CSS file that imports everything correctly

### 17. Deduplicate resolveTargetPath in CLI
- Extract from both `add.ts` and `mcp.ts` into shared `cli/src/utils/paths.ts`

### 18. Clean Up Registry ComponentFile Interface
- Remove dead `content: ''` field from all registry entries
- Or populate it — currently never read

### 19. Add Tests for 0.2.0/0.3.0 Components
- ~19 newer components lack `.test.tsx` files
- At minimum: rendering, keyboard interaction, axe accessibility checks
- Components: form, form-field, command, combobox, data-table, date-picker, calendar, breadcrumb, pagination, search-bar, confirm-dialog, user-menu, date-range-picker, time-picker, color-picker, file-upload, focus-trap, skip-nav, announcement

### 20. Add Size-Limit Entries for Newer Components
- Batch 0.3.0 components missing from `.size-limit.json`

### 21. Audit OKLCH Contrast Ratios
- Run APCA or WCAG 2.x contrast checks on every semantic color pairing
- Document results, especially for high-contrast theme

### 22. Flesh Out Documentation
- Foundation pages (Theme, Density) need real content — usage guidance, do's/don'ts
- Add pattern/recipe pages (settings form, data table with filters, etc.)
- Create designer onboarding guide

### 23. Update COMPONENT_ROADMAP.md
- Many "Planned" items are already implemented
- Reflects poorly on system maturity to potential adopters

### 24. Expand CI Pipeline
- Add CLI build step
- Add docs build step
- Add manifest schema validation
- Trigger e2e tests

### 25. Move Storybook Styles Out of base.css
- `.sb-show-main` and `.sbdocs` selectors don't belong in DS base stylesheet
- Move to `.storybook/preview-head.html` or Storybook-specific CSS

### 26. Storybook Dev Needs Token Build Dependency
- Add Turbo `storybook` task that depends on `^build`
- Or document that `pnpm tokens:build` must run before `storybook dev`

### 27. Evaluate Tailwind v4 Migration
- Docs use Tailwind v3, components use utility classes without declaring dependency
- Clarify Tailwind relationship and plan migration path
