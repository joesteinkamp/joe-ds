# Figma Token Sync

js-ds-ui supports bidirectional token sync between code (DTCG format) and Figma (Variables API).

## Architecture

```
Code (DTCG JSON)  <-->  Figma (Variables API)
     |                       |
Style Dictionary        Figma Variables
     |                       |
tokens.css              Figma Components
tokens.js               bound to variables
types.d.ts
```

## Token Tier to Figma Collection Mapping

| DTCG Tier | Directory | Figma Collection | Modes |
|-----------|-----------|-----------------|-------|
| Primitives | `src/primitives/` | Primitives | Default |
| Semantic | `src/semantic/` | Semantic | Light, Dark, High Contrast |
| Component | `src/component/` | Component | Compact, Default, Comfortable |

## DTCG Type to Figma Variable Mapping

| DTCG $type | Figma resolvedType | Notes |
|-----------|-------------------|-------|
| color | COLOR | OKLCH values need conversion to sRGB for Figma |
| dimension | FLOAT | rem/px values converted to raw numbers |
| fontFamily | STRING | Font stack arrays joined to string |
| fontWeight | FLOAT | Numeric weight values |
| duration | FLOAT | Millisecond values |
| cubicBezier | STRING | Array serialized as cubic-bezier() string |
| number | FLOAT | Raw numeric values (z-index, line-height) |
| shadow | STRING | Shadow object serialized to CSS shorthand |

## Setup

### Prerequisites

1. **Figma Personal Access Token** with `file:read` and `variables:write` scopes
   - Generate at: https://www.figma.com/developers/api#access-tokens

2. **Figma File Key** from the file URL: `figma.com/file/<FILE_KEY>/...`

### Environment Variables

Create a `.env` file in `packages/tokens/` (git-ignored):

```env
FIGMA_ACCESS_TOKEN=figd_xxxxxxxxxxxxxxxxxxxx
FIGMA_FILE_KEY=abc123def456
```

Or set them inline:

```bash
FIGMA_ACCESS_TOKEN=xxx FIGMA_FILE_KEY=yyy pnpm figma:push
```

## Usage

### Push Tokens: Code to Figma

Preview what would be synced (dry run, no API calls):

```bash
cd packages/tokens
pnpm figma:preview
```

This generates `.figma-sync-preview.json` showing the full payload.

Push tokens to Figma:

```bash
cd packages/tokens
DRY_RUN=false pnpm figma:push
```

This will:
1. Read all DTCG token files from `src/primitives/`, `src/semantic/`, `src/component/`
2. Flatten tokens and map to Figma variable format
3. Create/update Figma variable collections with correct modes
4. Create/update individual variables with values per mode
5. Preserve references (token aliases become Figma variable aliases)

### Pull Tokens: Figma to Code

Preview what would be pulled (dry run, no file writes):

```bash
cd packages/tokens
pnpm figma:pull
```

This generates `.figma-pull-preview-{tier}.json` files.

Pull and write token files:

```bash
cd packages/tokens
DRY_RUN=false pnpm figma:pull
```

After pulling:

```bash
pnpm build  # Regenerate CSS, JS, and TypeScript outputs
```

### Recommended Workflow

1. **Design changes in Figma**: Designer updates variable values in Figma
2. **Pull to code**: `DRY_RUN=false pnpm figma:pull`
3. **Review changes**: `git diff src/` to review token changes
4. **Rebuild outputs**: `pnpm build`
5. **Test**: Verify visual regression tests pass
6. **Commit**: Standard PR process

For the reverse (developer updates tokens in code):

1. **Edit DTCG JSON files** in `src/primitives/`, `src/semantic/`, or `src/component/`
2. **Preview**: `pnpm figma:preview`
3. **Push to Figma**: `DRY_RUN=false pnpm figma:push`
4. **Rebuild**: `pnpm build` to regenerate CSS/JS/TS
5. **Verify**: Check Figma file shows updated variables

## Token Reference Handling

DTCG references like `{color.brand.primary}` are mapped to Figma variable aliases. This preserves the token hierarchy:

```json
// In semantic/colors.json
{
  "color": {
    "interactive": {
      "primary": {
        "$value": "{color.brand.primary}",
        "$description": "Primary interactive color"
      }
    }
  }
}
```

In Figma, `color/interactive/primary` will show as an alias pointing to `color/brand/primary` in the Primitives collection.

## Mode Mapping

### Theme Modes (Semantic Collection)

The semantic token collection supports three modes in Figma. Currently, the same values are pushed to all modes. To support true multi-mode values:

1. Create `src/semantic/colors.dark.json` and `src/semantic/colors.high-contrast.json`
2. The sync script will detect `*.{mode}.json` files and map them to the corresponding Figma mode

### Density Modes (Component Collection)

Component tokens use `var(--density-multiplier, 1)` in CSS. In Figma, density is represented as variable modes:

| Mode | Multiplier | Effect |
|------|-----------|--------|
| Compact | 0.85 | Tighter spacing for dense UIs |
| Default | 1.0 | Standard spacing |
| Comfortable | 1.15 | Looser spacing for touch interfaces |

## Limitations

1. **OKLCH colors**: Figma uses sRGB. OKLCH values are approximated during conversion. For accurate color transfer, use hex/rgb values or install a color conversion library (culori).

2. **Complex values**: CSS functions like `clamp()`, `calc()`, and `var()` references cannot be directly represented as Figma variables. These are synced as STRING type for documentation purposes.

3. **Shadow tokens**: Multi-shadow values need manual mapping in Figma using the effect system rather than variables.

4. **Font families**: Array values are joined to a single string. Figma will only use the first available font.

## Troubleshooting

| Issue | Solution |
|-------|---------|
| `401 Unauthorized` | Check FIGMA_ACCESS_TOKEN is valid and has correct scopes |
| `403 Forbidden` | Ensure token has `variables:write` scope for push operations |
| `404 Not Found` | Verify FIGMA_FILE_KEY matches the correct Figma file |
| Colors look wrong | OKLCH to sRGB conversion is approximate; use hex values for exact colors |
| Variables not updating | Check the variable name matches (uses `/` separator, not `.`) |
