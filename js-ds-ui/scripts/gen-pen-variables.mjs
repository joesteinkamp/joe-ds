#!/usr/bin/env node
/**
 * gen-pen-variables.mjs
 * Reads all design-token source JSON and outputs pen-variables.json
 * in the Pencil.dev variable format.
 */
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "pen-variables.json");

// ── Pre-computed hex tables (OKLCH → sRGB) ──────────────────────────
const HEX = {
  blue: {
    50: "#EEF6FF", 100: "#D7EAFF", 200: "#B4D8FF", 300: "#7CBDFF",
    400: "#299CFF", 500: "#0074C8", 600: "#0065B0", 700: "#005799",
    800: "#003C6C", 900: "#002242",
  },
  purple: {
    50: "#FBF1FE", 100: "#F7DEFD", 200: "#EFC2F9", 300: "#DC9BEB",
    400: "#C374D5", 500: "#A74FBB", 600: "#8E35A1", 700: "#742785",
    800: "#571B63", 900: "#350A3E",
  },
  green: {
    50: "#EDF9ED", 100: "#D4F1D4", 200: "#ABE6AC", 300: "#7ACF7E",
    400: "#4DB956", 500: "#11A22F", 600: "#008A23", 700: "#006818",
    800: "#00480E", 900: "#002B05",
  },
  red: {
    50: "#FFF2F0", 100: "#FFDFDC", 200: "#FFC3BD", 300: "#FF958D",
    400: "#F75D59", 500: "#DF202E", 600: "#BB061E", 700: "#990016",
    800: "#72020E", 900: "#460105",
  },
  amber: {
    50: "#FBF4E6", 100: "#F7E6C3", 200: "#F3D086", 300: "#E4B750",
    400: "#D9A514", 500: "#BF9000", 600: "#A27900", 700: "#7E5E00",
    800: "#5C4300", 900: "#3C2B00",
  },
  cyan: {
    50: "#ECF7FF", 100: "#D2ECFF", 200: "#AADBFF", 300: "#64C1FF",
    400: "#00A2EE", 500: "#0082C0", 600: "#006A9D", 700: "#005580",
    800: "#003F60", 900: "#00243A",
  },
  neutral: {
    50: "#F6F9FC", 100: "#EFF2F5", 200: "#E1E5EA", 300: "#C9CED4",
    400: "#A8AFB5", 500: "#7A8189", 600: "#5D646C", 700: "#424850",
    800: "#21272E", 900: "#0D1218", 950: "#03080F",
  },
};

// ── Spacing scale (rem → px, 1rem = 16px) ───────────────────────────
const SPACING_PX = {
  0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24,
  8: 32, 10: 40, 12: 48, 16: 64, 20: 80, 24: 96,
};

// ── Typography sizes (preferred/middle clamp value → px) ────────────
const FONT_SIZE_PX = {
  xs: 12, sm: 14, base: 16, lg: 18, xl: 20,
  "2xl": 24, "3xl": 30, "4xl": 36, "5xl": 48,
};

// ── Font weights ────────────────────────────────────────────────────
const FONT_WEIGHT = { normal: 400, medium: 500, semibold: 600, bold: 700 };

// ── Line heights ────────────────────────────────────────────────────
const LINE_HEIGHT = { tight: 1.25, normal: 1.5, relaxed: 1.75 };

// ── Component heights (rem → px) ────────────────────────────────────
const COMP_HEIGHT_PX = { xs: 24, sm: 32, md: 40, lg: 48, xl: 56 };

// ── Icon sizes (rem → px) ───────────────────────────────────────────
const ICON_SIZE_PX = { xs: 16, sm: 20, md: 24, lg: 32, xl: 40 };

// ── Touch targets (rem → px) ────────────────────────────────────────
const TOUCH_PX = { minimum: 44, comfortable: 48 };

// ── Z-index ─────────────────────────────────────────────────────────
const Z_INDEX = {
  hide: -1, base: 0, dropdown: 1000, sticky: 1020, fixed: 1030,
  "modal-backdrop": 1040, modal: 1050, popover: 1060, tooltip: 1070, toast: 1080,
};

// ── Shadows (offset/blur/spread in px) ──────────────────────────────
const SHADOWS = {
  none:  { offsetX: 0, offsetY: 0, blur: 0, spread: 0 },
  xs:    { offsetX: 0, offsetY: 1, blur: 2, spread: 0 },
  sm:    { offsetX: 0, offsetY: 1, blur: 3, spread: 0 },
  md:    { offsetX: 0, offsetY: 4, blur: 6, spread: -1 },
  lg:    { offsetX: 0, offsetY: 10, blur: 15, spread: -3 },
  xl:    { offsetX: 0, offsetY: 20, blur: 25, spread: -5 },
};

// ── Animation durations (ms → number) ───────────────────────────────
const DURATIONS = { instant: 0, fast: 100, normal: 200, slow: 300, slower: 500 };

// ── Semantic spacing (component padding/gap, layout) in px ──────────
const SEMANTIC_PADDING_PX = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
const SEMANTIC_GAP_PX = { xs: 4, sm: 8, md: 12, lg: 16 };

// ── Helpers ─────────────────────────────────────────────────────────
const color = (hex) => ({ type: "color", value: hex });
const num = (n) => ({ type: "number", value: n });

function remToPx(rem) {
  const m = String(rem).match(/([\d.]+)\s*rem/);
  return m ? Math.round(parseFloat(m[1]) * 16) : parseInt(rem, 10) || 0;
}

// ── Build the variable map ──────────────────────────────────────────
const vars = {};

// 1. Primitive colors
for (const [family, shades] of Object.entries(HEX)) {
  for (const [shade, hex] of Object.entries(shades)) {
    vars[`color.${family}.${shade}`] = color(hex);
  }
}

// 2. Semantic colors — text
const semanticTextMap = {
  primary: HEX.neutral[900],
  secondary: HEX.neutral[600],
  tertiary: HEX.neutral[500],
  inverse: HEX.neutral[50],
  success: HEX.green[600],
  warning: HEX.amber[700],
  error: HEX.red[600],
  info: HEX.cyan[600],
};
for (const [k, v] of Object.entries(semanticTextMap)) {
  vars[`color.text.${k}`] = color(v);
}

// 3. Semantic colors — background
const semanticBgMap = {
  primary: HEX.neutral[50],
  secondary: HEX.neutral[100],
  tertiary: HEX.neutral[200],
  inverse: HEX.neutral[900],
  success: HEX.green[50],
  warning: HEX.amber[50],
  error: HEX.red[50],
  info: HEX.cyan[50],
  overlay: HEX.neutral[950],
};
for (const [k, v] of Object.entries(semanticBgMap)) {
  vars[`color.background.${k}`] = color(v);
}

// 4. Semantic colors — border
vars["color.border.default"] = color(HEX.neutral[300]);
vars["color.border.hover"] = color(HEX.neutral[400]);
vars["color.border.focus"] = color(HEX.blue[500]);

// 5. Semantic colors — interactive
vars["color.interactive.primary"] = color(HEX.blue[500]);
vars["color.interactive.primary-hover"] = color(HEX.blue[600]);
vars["color.interactive.primary-active"] = color(HEX.blue[700]);
vars["color.interactive.secondary"] = color(HEX.purple[500]);
vars["color.interactive.disabled"] = color(HEX.neutral[300]);

// 6. Spacing scale
for (const [k, v] of Object.entries(SPACING_PX)) {
  vars[`spacing.${k}`] = num(v);
}

// 7. Semantic spacing
for (const [k, v] of Object.entries(SEMANTIC_PADDING_PX)) {
  vars[`space.component.padding.${k}`] = num(v);
}
for (const [k, v] of Object.entries(SEMANTIC_GAP_PX)) {
  vars[`space.component.gap.${k}`] = num(v);
}
vars["space.layout.section"] = num(64);
vars["space.layout.container"] = num(32);

// 8. Typography — sizes
for (const [k, v] of Object.entries(FONT_SIZE_PX)) {
  vars[`typography.size.${k}`] = num(v);
}
// Font weights
for (const [k, v] of Object.entries(FONT_WEIGHT)) {
  vars[`typography.weight.${k}`] = num(v);
}
// Line heights
for (const [k, v] of Object.entries(LINE_HEIGHT)) {
  vars[`typography.lineHeight.${k}`] = num(v);
}

// 9. Sizing — component heights
for (const [k, v] of Object.entries(COMP_HEIGHT_PX)) {
  vars[`sizing.component.height.${k}`] = num(v);
}
// semantic alias
for (const [k, v] of Object.entries(COMP_HEIGHT_PX)) {
  vars[`size.component.height.${k}`] = num(v);
}

// 10. Sizing — icons
for (const [k, v] of Object.entries(ICON_SIZE_PX)) {
  vars[`sizing.component.icon.${k}`] = num(v);
}
for (const [k, v] of Object.entries(ICON_SIZE_PX)) {
  vars[`size.component.icon.${k}`] = num(v);
}

// 11. Touch targets
vars["sizing.touch.minimum"] = num(TOUCH_PX.minimum);
vars["sizing.touch.comfortable"] = num(TOUCH_PX.comfortable);
vars["size.touch.minimum"] = num(TOUCH_PX.minimum);
vars["size.touch.comfortable"] = num(TOUCH_PX.comfortable);

// 12. Z-index
for (const [k, v] of Object.entries(Z_INDEX)) {
  vars[`z-index.${k}`] = num(v);
}

// 13. Shadows
for (const [name, s] of Object.entries(SHADOWS)) {
  vars[`shadow.${name}.offsetX`] = num(s.offsetX);
  vars[`shadow.${name}.offsetY`] = num(s.offsetY);
  vars[`shadow.${name}.blur`] = num(s.blur);
  vars[`shadow.${name}.spread`] = num(s.spread);
}

// 14. Animation durations
for (const [k, v] of Object.entries(DURATIONS)) {
  vars[`animation.duration.${k}`] = num(v);
}

// 15. Component tokens — Button
vars["component.button.padding-x"] = num(16);
vars["component.button.padding-y"] = num(8);
vars["component.button.height-sm"] = num(32);
vars["component.button.height-md"] = num(40);
vars["component.button.height-lg"] = num(48);
vars["component.button.gap"] = num(8);
vars["component.button.font-size"] = num(14);
vars["component.button.font-weight"] = num(500);
vars["component.button.border-radius"] = num(6);
vars["component.button.border-width"] = num(1);

// 16. Component tokens — Input
vars["component.input.height"] = num(40);
vars["component.input.padding-x"] = num(12);
vars["component.input.padding-y"] = num(8);
vars["component.input.font-size"] = num(14);
vars["component.input.border-radius"] = num(6);
vars["component.input.border-width"] = num(1);

// 17. Component tokens — Alert
vars["component.alert.padding"] = num(12);
vars["component.alert.border-radius"] = num(8);
vars["component.alert.border-width"] = num(1);

// 18. Component tokens — Badge
vars["component.badge.padding-x"] = num(10);
vars["component.badge.padding-y"] = num(2);
vars["component.badge.font-size"] = num(12);
vars["component.badge.font-weight"] = num(600);
vars["component.badge.border-radius"] = num(9999);
vars["component.badge.border-width"] = num(1);

// 19. Component tokens — Card
vars["component.card.padding"] = num(16);
vars["component.card.border-radius"] = num(8);
vars["component.card.border-width"] = num(1);
vars["component.card.header-gap"] = num(8);

// 20. Component tokens — Checkbox
vars["component.checkbox.size"] = num(20);
vars["component.checkbox.border-radius"] = num(4);
vars["component.checkbox.border-width"] = num(1);
vars["component.checkbox.icon-size"] = num(16);

// 21. Component tokens — Dialog
vars["component.dialog.padding"] = num(24);
vars["component.dialog.gap"] = num(8);
vars["component.dialog.border-radius"] = num(8);
vars["component.dialog.border-width"] = num(1);
vars["component.dialog.max-width"] = num(512);

// 22. Component tokens — Switch
vars["component.switch.width"] = num(44);
vars["component.switch.height"] = num(24);
vars["component.switch.thumb-size"] = num(20);
vars["component.switch.border-radius"] = num(9999);

// 23. Component tokens — Toast
vars["component.toast.padding"] = num(16);
vars["component.toast.border-radius"] = num(8);
vars["component.toast.border-width"] = num(1);
vars["component.toast.max-width"] = num(420);

// ── Write output ────────────────────────────────────────────────────
writeFileSync(OUT, JSON.stringify(vars, null, 2) + "\n");
console.log(`Wrote ${Object.keys(vars).length} variables to ${OUT}`);
