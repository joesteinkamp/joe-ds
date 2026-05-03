---
version: alpha
name: joe-ds
description: A modern, theme-first design system built on Base UI primitives and OKLCH color ramps.
colors:
  # Neutral ramp (slate-tinted, OKLCH for perceptual uniformity)
  neutral-50: "oklch(0.985 0.002 247.86)"
  neutral-100: "oklch(0.967 0.003 247.86)"
  neutral-200: "oklch(0.929 0.006 247.86)"
  neutral-300: "oklch(0.869 0.012 247.86)"
  neutral-400: "oklch(0.704 0.020 247.86)"
  neutral-500: "oklch(0.554 0.030 247.86)"
  neutral-600: "oklch(0.446 0.038 247.86)"
  neutral-700: "oklch(0.372 0.040 247.86)"
  neutral-800: "oklch(0.279 0.038 247.86)"
  neutral-900: "oklch(0.208 0.036 247.86)"
  neutral-950: "oklch(0.129 0.034 247.86)"
  # Accent ramp (indigo)
  accent-50: "oklch(0.962 0.018 272.31)"
  accent-100: "oklch(0.929 0.040 272.31)"
  accent-200: "oklch(0.870 0.073 272.31)"
  accent-300: "oklch(0.785 0.115 272.31)"
  accent-400: "oklch(0.673 0.158 272.31)"
  accent-500: "oklch(0.585 0.196 272.31)"
  accent-600: "oklch(0.511 0.222 272.31)"
  accent-700: "oklch(0.451 0.213 272.31)"
  accent-800: "oklch(0.398 0.184 272.31)"
  accent-900: "oklch(0.359 0.152 272.31)"
  accent-950: "oklch(0.257 0.110 272.31)"
  # Status ramps (single shade each — extend later)
  success-500: "oklch(0.602 0.169 145.0)"
  warning-500: "oklch(0.752 0.156 70.0)"
  danger-500: "oklch(0.602 0.220 27.0)"
  # Semantic mappings (light theme)
  bg-default: "{colors.neutral-50}"
  bg-subtle: "{colors.neutral-100}"
  bg-muted: "{colors.neutral-200}"
  bg-inverted: "{colors.neutral-950}"
  fg-default: "{colors.neutral-950}"
  fg-muted: "{colors.neutral-600}"
  fg-subtle: "{colors.neutral-500}"
  fg-inverted: "{colors.neutral-50}"
  border-default: "{colors.neutral-200}"
  border-strong: "{colors.neutral-300}"
  ring-default: "{colors.accent-500}"
  accent-default: "{colors.accent-600}"
  accent-fg: "{colors.neutral-50}"
  accent-hover: "{colors.accent-700}"
  success-default: "{colors.success-500}"
  warning-default: "{colors.warning-500}"
  danger-default: "{colors.danger-500}"
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
  display-md:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.02em
  heading-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.01em
  heading-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
  heading-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: 0.02em
  mono-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
rounded:
  none: 0px
  sm: 4px
  DEFAULT: 6px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  0: 0px
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 20px
  6: 24px
  8: 32px
  10: 40px
  12: 48px
  16: 64px
components:
  button-primary:
    backgroundColor: "{colors.accent-default}"
    textColor: "{colors.accent-fg}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 0px 16px
    transition: "background-color 120ms ease-out"
    interactive: true
    states:
      hover:
        backgroundColor: "{colors.accent-hover}"
      focus-visible:
        outline: "2px solid {colors.ring-default}"
      disabled:
        backgroundColor: "{colors.neutral-200}"
        textColor: "{colors.fg-subtle}"
        cursor: not-allowed
  button-secondary:
    backgroundColor: "{colors.bg-subtle}"
    textColor: "{colors.fg-default}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 0px 16px
    border: "1px solid {colors.border-default}"
    transition: "background-color 120ms ease-out"
    interactive: true
    states:
      hover:
        backgroundColor: "{colors.bg-muted}"
      focus-visible:
        outline: "2px solid {colors.ring-default}"
      disabled:
        backgroundColor: "{colors.bg-default}"
        textColor: "{colors.fg-subtle}"
        cursor: not-allowed
  button-ghost:
    backgroundColor: "#00000000"
    textColor: "{colors.fg-default}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 0px 12px
    transition: "background-color 120ms ease-out"
    interactive: true
    states:
      hover:
        backgroundColor: "{colors.bg-subtle}"
      focus-visible:
        outline: "2px solid {colors.ring-default}"
      disabled:
        textColor: "{colors.fg-subtle}"
        cursor: not-allowed
  input-field:
    backgroundColor: "{colors.bg-default}"
    textColor: "{colors.fg-default}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 0px 12px
    border: "1px solid {colors.border-default}"
    interactive: true
    states:
      hover:
        border: "1px solid {colors.border-strong}"
      focus-visible:
        outline: "2px solid {colors.ring-default}"
      disabled:
        backgroundColor: "{colors.bg-subtle}"
        textColor: "{colors.fg-subtle}"
        cursor: not-allowed
  card-default:
    backgroundColor: "{colors.bg-default}"
    textColor: "{colors.fg-default}"
    rounded: "{rounded.lg}"
    padding: 24px
    border: "1px solid {colors.border-default}"
voice:
  formality: 3
  warmth: 3
  authority: 3
  playfulness: 2
  person: third
  tense: present-active
  oxfordComma: true
  contractions: allowed
copy:
  casing:
    button: sentence-case
    nav: title-case
  buttonLabelMaxWords: 4
  bannedTerms:
    - seamless
    - leverage
    - unlock
    - delight
---

## Brand & Style

`joe-ds` is a theme-first design system that aims for clarity over decoration. The visual identity is grounded in a slate-tinted neutral ramp paired with a single accent (indigo), tuned in OKLCH so that dark and light themes share a single ramp definition. Components should feel precise and quiet — generous whitespace, restrained color, predictable rhythm.

The system is built on Base UI primitives (unstyled, accessible) with shadcn-style CSS variables consumed by Tailwind v4. Components own their visible tokens via per-component `*.tokens.json` so visual changes localize cleanly.

## Colors

Single OKLCH ramps drive both light and dark themes. The primitive layer (`neutral-50` … `neutral-950`, `accent-50` … `accent-950`) is theme-agnostic; the semantic layer (`bg-default`, `fg-default`, `border-default`, `ring-default`, `accent-default`) maps light values in the YAML above. Dark theme overrides live in the build pipeline (`tools/build-tokens`) which inverts the neutral mapping: `bg-default` → `neutral-950`, `fg-default` → `neutral-50`, etc. — see `MIGRATION_PLAN.md`.

- **Neutrals** are perceptually uniform across the ramp, so steps look evenly spaced in both modes.
- **Accent** is reserved for primary actions, focus rings, and selection states — never decoration.
- **Status colors** (`success`, `warning`, `danger`) get a single 500-level token at the primitive layer; ramps can grow as needed.

Components reference semantic tokens, not primitives. Reach into the primitive ramp only when a component genuinely needs a specific step (rare).

## Typography

Inter is the system face. JetBrains Mono is the mono face for code and dense numeric data. Type tokens follow a `<role>-<size>` convention (`heading-lg`, `body-md`, `label-sm`).

- **Display** sizes are reserved for marketing and onboarding moments, not in-product hierarchy.
- **Body** is the default reading size at 14px; long-form prose can step up to `body-lg`.
- **Labels** are reserved for chips, form labels, and dense UI metadata. `label-sm` carries a small letter-spacing bump for clarity at 12px.

Avoid stacking weight changes with size changes for hierarchy — pick one. Weight changes should be intentional (e.g. emphasizing a single label).

## Layout & Spacing

The spacing scale is a 4px base grid with a few jumps (1, 2, 3, 4, 5, 6, 8, 10, 12, 16). Components compose spacing tokens; raw pixel values are flagged in review.

- **Component density** defaults to comfortable. Compact density (≈ −20%) is opt-in per surface, not global.
- **Page rhythm** uses 8 (32px) between unrelated sections, 4 (16px) within a section, 2 (8px) within a tightly-coupled group.

## Motion

Motion is restrained. Default state transitions use `120ms ease-out` for color/background changes and `200ms cubic-bezier(0.4, 0, 0.2, 1)` for entrances/exits. Layout-affecting properties (width, height, padding) are not animated. Reduce-motion users get instant transitions across the board.

## Elevation & Depth

`joe-ds` favors borders over shadows for separation in the light theme. Shadows are reserved for true overlays (popover, dialog, dropdown). In dark mode, separation comes from a one-step background lift (`bg-default` → `bg-subtle`) rather than a border.

- **Resting:** no shadow, single 1px border in `border-default`.
- **Raised (popover, menu):** shadow with 8px blur, low alpha — declared in component tokens.
- **Modal:** larger shadow + scrim layer.

## Shapes

Default radius is `md` (8px). Cards step up to `lg` (12px). Pills and full-circle shapes use `full`. Sharp corners (`none`) are reserved for tabular surfaces (data tables, code blocks).

## Components

Components are thin wrappers around Base UI primitives. Each owns:

- A `<name>.tsx` file composing Base UI parts with Tailwind classes that reference its CSS variables.
- A `<name>.tokens.json` file declaring scoped tokens that alias semantic primitives.
- An `index.ts` barrel.

The primary actions are encoded above as `button-primary`, `button-secondary`, `button-ghost`. Form inputs share the `input-field` token. Surfaces use `card-default`. Adding a new component means: scaffold via `bun run scaffold <Name>`, edit its `*.tokens.json`, ship.

## Do's and Don'ts

- **Do** reach for semantic tokens (`bg-default`, `fg-muted`) over primitives.
- **Do** add new component-scoped tokens before reaching for arbitrary Tailwind values.
- **Don't** animate layout-affecting properties.
- **Don't** stack weight + size for hierarchy when one will do.
- **Don't** use status colors decoratively — they signal state.
