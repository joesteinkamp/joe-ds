# Consuming Design Tokens in Native Apps

The `@js-ds-ui/tokens` package exports design tokens for iOS (Swift), Android (Kotlin/Compose), and a flat JSON format for design tools.

## Build

```bash
cd packages/tokens
pnpm build
```

This generates:

| Platform | Output | Description |
|----------|--------|-------------|
| Web (CSS) | `dist/tokens.css` | CSS custom properties with OKLCH fallbacks |
| Web (JS) | `dist/tokens.js` | ES module exports |
| Web (TS) | `dist/types.d.ts` | TypeScript token types |
| iOS | `dist/ios/DesignTokens.swift` | Swift enum with typed constants |
| Android | `dist/android/DesignTokens.kt` | Kotlin object for Jetpack Compose |
| Design Tools | `dist/tokens.json` | Flat JSON (DTCG-compatible) |

---

## iOS (Swift)

### Setup

Copy `dist/ios/DesignTokens.swift` into your Xcode project. The file has no external dependencies beyond `UIKit`.

### Usage

```swift
import UIKit

// Colors
let primaryColor = DesignTokens.Color.Brand.primary  // UIColor

// Spacing
let padding = DesignTokens.Spacing.s4  // CGFloat (16.0 pt)

// Typography
let fontName = DesignTokens.Font.Family.sans  // "Inter"
let fontSize = DesignTokens.Font.Size.base     // CGFloat (16.0 pt)
let fontWeight = DesignTokens.Font.Weight.semibold  // UIFont.Weight.semibold

// Animation
let duration = DesignTokens.Animation.Duration.normal  // TimeInterval (0.2s)
let easing = DesignTokens.Animation.Easing.easeInOut   // CAMediaTimingFunction

// Shadows
let shadowColor = DesignTokens.Shadow.mdColor   // UIColor
let shadowRadius = DesignTokens.Shadow.mdRadius  // CGFloat
let shadowOffset = DesignTokens.Shadow.mdOffset  // CGSize
```

### Platform-Specific Transforms

| Web Token | iOS Output | Notes |
|-----------|-----------|-------|
| `1rem` | `16.0` (CGFloat, pt) | 1rem = 16pt |
| `oklch(0.55 0.22 250)` | `UIColor(red:green:blue:alpha:)` | Converted to sRGB |
| `200ms` | `0.2` (TimeInterval, seconds) | ms → seconds |
| `clamp(1rem, 0.95rem + 0.25vw, 1.125rem)` | `15.2` (CGFloat) | Uses preferred value |
| `cubic-bezier(0.4, 0, 0.2, 1)` | `CAMediaTimingFunction(controlPoints:)` | Native easing |

### Dynamic Values

Some semantic tokens use `calc()` with CSS custom properties (e.g., density multiplier). These are marked with comments in the generated Swift file. For density support in iOS, apply a multiplier at runtime:

```swift
let densityMultiplier: CGFloat = 1.0  // or 0.85 (compact), 1.15 (comfortable)
let padding = DesignTokens.Spacing.s4 * densityMultiplier
```

---

## Android (Kotlin / Jetpack Compose)

### Setup

Copy `dist/android/DesignTokens.kt` into your Android project under the appropriate package directory. Update the `package` declaration if needed.

The generated file uses Jetpack Compose types. Add these dependencies:

```kotlin
// build.gradle.kts
dependencies {
    implementation("androidx.compose.ui:ui:1.6+")
    implementation("androidx.compose.animation:animation-core:1.6+")
}
```

### Usage

```kotlin
import com.example.design.tokens.DesignTokens

// Colors
val primary = DesignTokens.Color.Brand.primary  // Color(0xFF...)

// Spacing
val padding = DesignTokens.Spacing.s4  // 16.dp

// Typography
val fontName = DesignTokens.Font.Family.sans  // "Inter"
val fontSize = DesignTokens.Font.Size.base     // 16.sp
val fontWeight = DesignTokens.Font.Weight.semibold  // FontWeight.SemiBold

// Animation
val duration = DesignTokens.Animation.Duration.normal  // 200L (ms)
val easing = DesignTokens.Animation.Easing.easeInOut   // CubicBezierEasing

// Shadows (mapped to elevation)
val cardElevation = DesignTokens.Shadow.mdElevation  // 6.dp
```

### Platform-Specific Transforms

| Web Token | Android Output | Notes |
|-----------|---------------|-------|
| `1rem` | `16.dp` | 1rem = 16dp |
| Font `1rem` | `16.sp` | Font sizes use sp for accessibility |
| `oklch(0.55 0.22 250)` | `Color(0xAARRGGBB)` | Converted to sRGB ARGB |
| `200ms` | `200L` (Long, ms) | Kept as milliseconds |
| Shadow `blur: 6px` | `6.dp` (elevation) | Mapped to Material elevation |

### Customizing the Package Name

The generated file uses `com.example.design.tokens`. To change it, either:
1. Edit the generated file
2. Add a post-build script to replace the package declaration

---

## Design Tools (JSON)

### Format

The `dist/tokens.json` file uses DTCG-compatible flat format:

```json
{
  "color.brand.primary": {
    "$value": "oklch(0.55 0.22 250)",
    "$type": "color",
    "$description": "Primary brand color - Blue"
  },
  "spacing.4": {
    "$value": "1rem",
    "$type": "dimension",
    "$description": "16px - Base spacing unit"
  }
}
```

### Importing into Design Tools

**Tokens Studio for Figma:**
1. Open Tokens Studio plugin
2. Click "Import" → "File"
3. Select `dist/tokens.json`

**Supernova:**
1. Go to Design System → Tokens
2. Import → JSON file
3. Select `dist/tokens.json`

**Style Dictionary (downstream):**
The JSON can be used as a source for another Style Dictionary pipeline targeting additional platforms.

---

## Token Categories

| Category | Token Count | Types |
|----------|------------|-------|
| Colors | ~20 | Brand, semantic, text, background, border, interactive |
| Spacing | ~13 | Numeric scale (0–24) |
| Typography | ~16 | Font family, size, weight, line-height |
| Sizing | ~12 | Component heights, icon sizes, touch targets |
| Motion | ~10 | Durations, easing curves |
| Shadows | ~6 | None through XL |
| Z-Index | ~9 | Stacking order layers |
| Semantic Spacing | ~11 | Density-aware padding/gap, layout |
| Component (Button) | ~8 | Button-specific dimensions |

---

## CI Integration

Add token generation to your CI pipeline:

```yaml
# GitHub Actions example
- name: Build tokens
  run: cd packages/tokens && pnpm build

- name: Upload iOS tokens
  uses: actions/upload-artifact@v4
  with:
    name: ios-tokens
    path: packages/tokens/dist/ios/

- name: Upload Android tokens
  uses: actions/upload-artifact@v4
  with:
    name: android-tokens
    path: packages/tokens/dist/android/
```

For automated distribution, consider publishing the generated files to a shared artifact repository or syncing them to native app repos via a GitHub Action.
