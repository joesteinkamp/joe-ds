# joe-ds Improvement Plan

Generated from a team review (UX Designer, Frontend Engineer, Technical Architect) on 2026-02-19.

## P0 — Fix Now ✅

### 1. Consolidate Workspace Config ✅
- Remove `js-ds-ui/pnpm-workspace.yaml` and `js-ds-ui/pnpm-lock.yaml`
- Remove `workspaces` field from `js-ds-ui/package.json`
- Add root `package.json` with orchestration scripts (`pnpm -r build`, etc.)
- Move `.nvmrc` and `.npmrc` from `js-ds-ui/` to repo root

### 2. Fix Turbo Config ✅
- Rename `pipeline` to `tasks` in `turbo.json` (Turbo v2 breaking change)
- Move `turbo.json` to repo root so docs site is included in the build graph

### 3. Wire Component Tokens Properly ✅
- `button.tsx`: Replace hardcoded `text-white` with `text-[var(--component-button-primary-text)]` on primary variant and `text-[var(--component-button-danger-text)]` on danger variant
- `dialog.tsx`: Replace `bg-black/80` overlay with `bg-[var(--color-background-overlay)]/80`
- `switch.tsx`: Replace hardcoded `translate-x-5` with calc based on `--component-switch-width` and `--component-switch-thumb-size`
- `slider.tsx`: Replace hardcoded `h-2` track and `h-5 w-5` thumb with `--component-slider-track-height` and `--component-slider-thumb-size` tokens

## P1 — High Impact ✅

### 4. forwardRef Deprecation for React 19 ✅
- Documented in CONTRIBUTING.md that a future version will drop `forwardRef` when React 19 becomes minimum
- Short-term: Accept the deprecation warnings for React 19 consumers

### 5. Standardize Variant Naming ✅
- `danger` for destructive actions (Button)
- `error` for status indicators (Alert, Badge, Toast)
- Updated Badge: renamed `destructive` variant to `error`
- Documented the naming convention in CONTRIBUTING.md

### 6. Add Size Variants to Form Elements ✅
- Added `size` prop (`sm`/`md`/`lg`) to Input, Select, and Textarea via CVA
- Matches Button's sizing API for consistency
- Uses component tokens for each size level

### 7. useTheme/useDensity Need Shared Context ✅
- Wrapped in `ThemeProvider` / `DensityProvider` React context
- Hooks consume context internally
- SSR-safe hydration with single source of truth

### 8. Generate CLI Templates from Source ✅
- Replaced 12,090-line manual `templates/index.ts` with codegen step
- `scripts/gen-cli-templates.mjs` reads component source files and produces template strings
- Runs as `prebuild` in CLI package

### 9. DataTable Uses rowIndex as React Key ✅
- Added optional `rowKey` prop
- Falls back to `row.id ?? rowIndex`

### 10. Automate design.pen Token Sync ✅
- Rewrote `scripts/gen-pen-variables.mjs` to read compiled `tokens.json`
- Coverage: 715/731 tokens (up from 245 hardcoded)
- Converts OKLCH→hex, rem→px automatically

### 11. Add Changesets for Version Management ✅
- Installed `@changesets/cli`
- Added `changeset`, `version`, and `release` scripts

### 12. Test Against React 19 in CI ✅
- Added React 19 to test matrix in CI workflow
- Separate `build` and `test` jobs

## P2 — Important Improvements

### 13. Fix Alert aria-live Semantics ✅
- Uses `role="status"` with `aria-live="polite"` for info/warning variants
- Reserves `role="alert"` (assertive) for error variant only

### 14. Checkbox Indeterminate Indicator ✅
- Shows minus/dash icon when `checked="indeterminate"` instead of Check icon

### 15. Add Opacity Tokens ✅
- Added semantic tokens: `opacity.disabled`, `opacity.overlay`, `opacity.hover`, `opacity.placeholder`, `opacity.muted`

### 16. CSS Layer Import Order Documentation ✅
- Already well-documented with `@layer` declaration in base.css — no changes needed

### 17. Deduplicate resolveTargetPath in CLI ✅
- Extracted to shared `cli/src/utils/paths.ts`

### 18. Clean Up Registry ComponentFile Interface ✅
- Removed dead `content: ''` field from all registry entries

### 19. Add Tests for 0.2.0/0.3.0 Components ✅
- All 64 components already have `.test.tsx` files — no work needed

### 20. Add Size-Limit Entries for Newer Components ✅
- Expanded from 20 entries to full 64-component coverage, sorted alphabetically

### 21. Audit OKLCH Contrast Ratios
- Run APCA or WCAG 2.x contrast checks on every semantic color pairing
- Document results, especially for high-contrast theme

### 22. Flesh Out Documentation
- Foundation pages (Theme, Density) need real content — usage guidance, do's/don'ts
- Add pattern/recipe pages (settings form, data table with filters, etc.)
- Create designer onboarding guide

### 23. Update COMPONENT_ROADMAP.md ✅
- Updated all implemented components from Planned to Done
- Added progress summary: 60 done, 5 planned, 7 optional

### 24. Expand CI Pipeline ✅
- Added CLI build step
- Added Storybook build step
- (Manifest validation and e2e triggers are future work)

### 25. Move Storybook Styles Out of base.css ✅
- Extracted `.sb-show-main` and `.sbdocs` selectors to `.storybook/storybook-overrides.css`

### 26. Storybook Dev Needs Token Build Dependency ✅
- Added `storybook` and `storybook:build` Turbo tasks with `dependsOn: ["^build"]`

### 27. Evaluate Tailwind v4 Migration
- Docs use Tailwind v3, components use utility classes without declaring dependency
- Clarify Tailwind relationship and plan migration path
