# Support Lifecycle

## Component Status Levels

1. `alpha`: API and visuals can change rapidly, not for broad production use
2. `beta`: stable enough for production pilots, migration risk still medium
3. `stable`: default recommendation, semver-protected
4. `deprecated`: scheduled for removal, migration required

## Status Transitions

1. `alpha` -> `beta`: tests, docs, accessibility baseline complete
2. `beta` -> `stable`: 2 release cycles without breaking regressions
3. `stable` -> `deprecated`: replacement exists and migration docs published

## Removal Policy

1. Deprecation announcement includes removal date
2. Minimum one minor release cycle before removal
3. Removal must include migration notes and changelog entry

## Required Quality by Level

1. `alpha`: unit tests + docs examples
2. `beta`: unit + a11y tests + story coverage
3. `stable`: unit + a11y + e2e + visual coverage
