# Tech Stack Migration: Archive & Rebuild (Bun edition)

> Status: Phase 1 complete (archive + wipe). Phase 2 in progress.
> Pre-migration history preserved on branch `archive/v0.1-pre-migration`.

## Context

The previous `joe-ds` monorepo (Radix UI + Style Dictionary + Penpot + Turborepo/pnpm) is being replaced wholesale. The new stack:

- **Bun** for runtime, package manager, and workspace tooling.
- **Base UI** (`@base-ui-components/react`) for unstyled primitives.
- **Tailwind v4** with shadcn-style `globals.css` (CSS-first `@theme`).
- **DESIGN.md** (fork: `joesteinkamp/design.md`) as source of truth for primitive + semantic tokens. Vendored as a git subtree under `vendor/design-md/` and run with Bun.
- **AGENTS.md** kit (fork: `joesteinkamp/agents-md`) installed via its `install.sh`.
- Component-level tokens live next to each component as `<name>.tokens.json` and compile into a generated `tokens.css` consumed by Tailwind v4.
- Light + dark mode via `next-themes` (`.dark` class) and CSS variable swaps in `:root` / `.dark`.
- Every Base UI component scaffolded with its own token set in one pass.

## Confirmed decisions

| Area              | Decision                                                                  |
| ----------------- | ------------------------------------------------------------------------- |
| Archive           | Branch `archive/v0.1-pre-migration` pushed; old code wiped on migration.  |
| AGENTS.md         | Installed via `install.sh` (✅ Phase 2).                                   |
| DESIGN.md         | Vendored as git subtree at `vendor/design-md/`; run via Bun.              |
| Repo shape        | Bun workspaces: `apps/docs` + `packages/ui` + `tools/*`.                  |
| Tokens            | Full reset. DESIGN.md → DTCG JSON → Bun script merges `*.tokens.json`.    |
| Components        | All Base UI components scaffolded in one pass via Bun generator.          |
| Theme             | `next-themes` + `.dark` class, Tailwind v4 dark variant.                  |
| Tailwind          | v4, `@theme` in `globals.css`.                                            |
| CI                | Minimal workflow: `oven-sh/setup-bun` + install/typecheck/lint/build.     |

## Tooling baseline

- **Runtime / PM**: Bun ≥ 1.1 (pinned via `.bun-version`, `engines.bun`).
- **Workspaces**: Bun workspaces (`workspaces` field in root `package.json`). No Turborepo.
- **Commands**:
  - `bun install` — install all deps
  - `bun run <script>` — run a script
  - `bun --filter <pkg> <script>` — workspace-filtered run
  - `bunx <bin>` — exec a one-off
- **TypeScript**: shared `tsconfig.base.json`; `bun-types` in root devDeps.
- **Lint/format**: Biome (single tool, fast under Bun).
- **Tests** (later): `bun test`.

## Migration plan

### Phase 1 — Archive ✅

- Created branch `archive/v0.1-pre-migration` from `main` HEAD and pushed (tag pushes were blocked by the remote, branch is functionally equivalent).
- Deleted on `claude/plan-tech-stack-migration-wrfI2`: `js-ds-ui/`, `docs/`, `.github/workflows/*`, `.cursor/`, `.mcp.json`, `.npmrc`, root planning docs, root `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `turbo.json`.
- Kept: `LICENSE`, `.nvmrc`, `.gitignore`, `.github/ISSUE_TEMPLATE/`, `.github/pull_request_template.md`.

### Phase 2 — Sources of truth

**AGENTS.md** ✅: installed via `install.sh` from `joesteinkamp/agents-md`. Created `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`, `.agents/`.

**DESIGN.md**:

1. Add fork as git subtree:
   ```
   git subtree add --prefix=vendor/design-md \
     https://github.com/joesteinkamp/design.md.git main --squash
   ```
2. Install its deps in isolation: `cd vendor/design-md && bun install`. Do **not** add it as a workspace — keep it isolated.
3. Author `DESIGN.md` at repo root with YAML frontmatter:
   - Color ramps per hue (single ramp, OKLCH-derived, Tailwind-style 50–950).
   - Typography, spacing, radii, shadows, motion scales.
   - Semantic mappings (`bg.default`, `fg.default`, `border.default`, `ring`, `accent.*`) with explicit light + dark values.
4. Wire root scripts:
   - `tokens:design` → `bun run vendor/design-md/packages/cli/src/index.ts export --format dtcg DESIGN.md > tokens/design.json`
   - `tokens:lint` → `bun run vendor/design-md/packages/cli/src/index.ts lint DESIGN.md`
   - `tokens` → `bun run tokens:design && bun run tokens:build`

### Phase 3 — Bun workspace scaffold

Final layout:

```
/
  AGENTS.md, CLAUDE.md, DESIGN.md, .cursorrules, .agents/
  package.json                 # workspaces: apps/*, packages/*, tools/*
  bunfig.toml
  .bun-version
  tsconfig.base.json
  biome.json
  .gitignore, LICENSE
  apps/
    docs/                      # Next.js 15 + React 19 + Tailwind v4
  packages/
    ui/                        # Base UI wrappers + per-component tokens
  tools/
    build-tokens/              # Bun: tokens/design.json + *.tokens.json -> tokens.css
    scaffold-component/        # Bun: generates Base UI component skeleton
  tokens/
    design.json                # DTCG output (committed)
  vendor/
    design-md/                 # git subtree of fork
```

Root `package.json` essentials:
- `"workspaces": ["apps/*", "packages/*", "tools/*"]`
- `"engines": { "bun": ">=1.1.0" }`
- Scripts: `dev`, `build`, `lint`, `type-check`, `tokens`, `tokens:design`, `tokens:build`, `tokens:lint`, `scaffold`.

### Phase 4 — `packages/ui` and tokens pipeline

Per-component layout under `packages/ui/src/components/<name>/`:
- `<name>.tsx` — Base UI composition with Tailwind classes consuming component CSS variables. Variants via `class-variance-authority`.
- `<name>.tokens.json` — DTCG-shaped JSON declaring component-scoped tokens aliasing semantic primitives.
- `index.ts` — barrel.

`tools/build-tokens/index.ts` (Bun script):
1. Read `tokens/design.json` (primitives + semantic, light + dark).
2. Glob `packages/ui/src/components/**/*.tokens.json`.
3. Resolve aliases (e.g. `{semantic.bg.accent}` → `var(--bg-accent)`).
4. Emit `packages/ui/src/styles/tokens.css`:
   - `:root { --<token>: ... }` (primitives + semantic light + component tokens).
   - `.dark { --<token>: ... }` (semantic dark + dark component overrides).

`apps/docs/app/globals.css`:
- `@import "@joe-ds/ui/styles/tokens.css";`
- `@import "tailwindcss";`
- `@theme { --color-bg: var(--bg-default); ... }` to alias CSS variables into Tailwind's namespaces.

`apps/docs/app/providers.tsx`: `next-themes` `ThemeProvider` with `attribute="class"`.

### Phase 5 — Scaffold all Base UI components

`tools/scaffold-component/index.ts` iterates the full Base UI component list (Accordion, AlertDialog, Avatar, Checkbox, Collapsible, ContextMenu, Dialog, Field, Form, Input, Menu, Menubar, NavigationMenu, NumberField, Popover, PreviewCard, Progress, RadioGroup, ScrollArea, Select, Separator, Slider, Switch, Tabs, Toast, Toggle, ToggleGroup, Toolbar, Tooltip, …) and emits each component's three files with sensible defaults (mostly aliasing semantic tokens).

After scaffold: `bun run tokens && bun run type-check && bun run build`.

### Phase 6 — Docs app

- `apps/docs` is a fresh Next.js 15 (App Router, React 19): `bunx create-next-app apps/docs --ts --tailwind --app --no-eslint --import-alias "@/*"`, then upgrade Tailwind to v4.
- `next-themes` provider in root layout.
- Token explorer page introspecting `tokens/design.json`.
- Per-component preview routes consuming `@joe-ds/ui`.

### Phase 7 — CI

`.github/workflows/ci.yml`:
- Triggers: push + PR to `main`.
- Steps: checkout → `oven-sh/setup-bun@v2` (reads `.bun-version`) → `bun install --frozen-lockfile` → `bun run tokens` → `bun run type-check` → `bun run lint` → `bun run build`.

## Critical files

- **Phase 2**: `vendor/design-md/` (subtree), `DESIGN.md`.
- **Phase 3**: `package.json`, `bunfig.toml`, `.bun-version`, `tsconfig.base.json`, `biome.json`, `apps/docs/*`, `packages/ui/*`, `tools/build-tokens/index.ts`, `tools/scaffold-component/index.ts`, `tokens/.gitkeep`.
- **Phase 4**: `packages/ui/src/styles/tokens.css` (generated), `apps/docs/app/globals.css`, `apps/docs/app/layout.tsx`, `apps/docs/app/providers.tsx`.
- **Phase 5**: `packages/ui/src/components/<name>/{<name>.tsx, <name>.tokens.json, index.ts}` per Base UI component.
- **Phase 7**: `.github/workflows/ci.yml`.

## Verification

| Phase | How to verify                                                                                              |
| ----- | ---------------------------------------------------------------------------------------------------------- |
| 2     | `bun run tokens:lint` passes; `tokens/design.json` has primitives + semantic, light + dark.                |
| 3     | `bun install` succeeds; `bun --filter '*' run type-check` passes on empty packages.                         |
| 4     | `bun run tokens` regenerates `tokens.css`; `bun --filter docs run dev` shows correct light/dark; toggle works. |
| 5     | Each component renders at `apps/docs/app/_dev/<name>`; `bun --filter '*' run build` succeeds.              |
| 7     | Branch push triggers CI; workflow goes green.                                                              |

End-to-end smoke: `bun install && bun run tokens && bun --filter docs run dev`, toggle theme, verify Button/Dialog/Select render in both modes.
