# Release Policy

## Purpose

This policy defines non-negotiable release gates for `js-ds-ui`.

## Required Gates for Release

1. Token contracts pass (`pnpm --filter @js-ds-ui/tokens contracts:check`)
2. Generated artifact checks pass (`pnpm check:generated`)
3. Component type-check, lint, unit tests pass
4. E2E and visual regression workflows pass
5. Bundle size checks pass

## Semver Rules

1. Patch: bug fixes and non-breaking visual/accessibility improvements
2. Minor: additive APIs and new components/tokens
3. Major: breaking token/API behavior or removals

## Deprecation Rules

1. No hard removal without migration path and date in a deprecation issue
2. Deprecation warnings are documented in changelog and migration notes
3. Removal happens only after the published deprecation window

## Migration Notes

All breaking or behavior-sensitive changes must include:

1. Before/after code samples
2. Token or API rename maps
3. Rollback guidance
