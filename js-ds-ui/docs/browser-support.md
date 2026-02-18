# Browser Support Matrix

js-ds-ui targets modern evergreen browsers. The design system uses progressive enhancement where possible, with PostCSS fallbacks for OKLCH colors.

## Feature Support

| CSS Feature | Chrome | Firefox | Safari | Edge | Fallback Strategy |
|---|---|---|---|---|---|
| CSS Custom Properties | 49+ | 31+ | 9.1+ | 15+ | None (baseline) |
| `clamp()` | 79+ | 75+ | 13.1+ | 79+ | None (baseline) |
| `calc()` | 26+ | 16+ | 7+ | 12+ | None (baseline) |
| `focus-visible` | 86+ | 85+ | 15.4+ | 86+ | Falls back to `:focus` |
| OKLCH colors | 111+ | 113+ | 15.4+ | 111+ | PostCSS generates rgb() fallbacks |
| `@layer` | 99+ | 97+ | 15.4+ | 99+ | Graceful degradation — styles still apply without cascade control |
| Container Queries | 105+ | 110+ | 16+ | 105+ | Components use default layout; no container query = no responsive adaptation |
| `:has()` selector | 105+ | 121+ | 15.4+ | 105+ | Utility classes provide fallback; form validation uses ARIA attributes as primary mechanism |
| CSS Nesting | 120+ | 117+ | 17.2+ | 120+ | Flat selectors as fallback in generated CSS |
| `color-scheme` | 81+ | 96+ | 12.1+ | 81+ | Manual dark mode class toggle |

## Minimum Recommended Browsers

For full design system support (including container queries and `:has()`):

- **Chrome/Edge**: 120+
- **Firefox**: 121+
- **Safari**: 17.2+

For core functionality (components render and work correctly without responsive container behavior):

- **Chrome/Edge**: 99+
- **Firefox**: 97+
- **Safari**: 15.4+

## Progressive Enhancement Strategy

### Tier 1: Core (works everywhere above minimum)
- CSS Custom Properties for theming
- `clamp()` for fluid typography
- `calc()` for density-aware spacing
- OKLCH with rgb() fallbacks via PostCSS

### Tier 2: Enhanced (modern browsers)
- `@layer` for predictable cascade ordering
- Container Queries for component-responsive layouts
- `:has()` for contextual styling
- CSS Nesting for maintainable stylesheets

### Tier 3: Optimal (latest browsers)
- All features active
- P3 color gamut support (future)
- View Transitions API integration (future)

## Token Pipeline

The `@js-ds-ui/tokens` package uses Style Dictionary 4 with PostCSS to generate CSS with automatic fallbacks:

1. OKLCH color values are processed through `@csstools/postcss-oklab-function`
2. The `preserve: true` option keeps the original OKLCH value while prepending an rgb() fallback
3. Token CSS is wrapped in `@layer tokens` for cascade control
4. Browsers that don't support `@layer` still get the CSS variables — they just don't have layer-based cascade control

## Testing

When testing browser compatibility:
- Use `CSS.supports()` API to feature-detect at runtime
- The `useCSSSupports` hook provides React-friendly feature detection
- Container query components gracefully degrade to their default layout
- `:has()` patterns always have ARIA-based fallbacks for accessibility
