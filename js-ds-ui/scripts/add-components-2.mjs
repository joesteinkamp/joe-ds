#!/usr/bin/env node
/**
 * add-components-2.mjs
 * Adds 7 advanced form control components to the "Form Controls" page
 * in the .pen file. Must run AFTER add-components-1.mjs.
 *
 * Components: color-picker, combobox, file-upload, search-bar,
 *             time-picker, toggle-group, date-picker
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PEN_PATH = resolve(__dirname, "..", "js-ds-ui.pen");

// ── Read the .pen file ──────────────────────────────────────────────
const pen = JSON.parse(readFileSync(PEN_PATH, "utf-8"));

// ── ID generator (prefix-based to avoid collisions) ─────────────────
let _seq = 0;
const uid = (prefix) => `${prefix}-${++_seq}`;

// ── Shorthand builders ──────────────────────────────────────────────
function frame(id, name, opts = {}) {
  return {
    type: "frame",
    id,
    name,
    ...(opts.reusable ? { reusable: true } : {}),
    ...(opts.width != null ? { width: opts.width } : {}),
    ...(opts.height != null ? { height: opts.height } : {}),
    ...(opts.fill ? { fill: opts.fill } : {}),
    ...(opts.cornerRadius != null ? { cornerRadius: opts.cornerRadius } : {}),
    ...(opts.stroke ? { stroke: opts.stroke } : {}),
    ...(opts.layout ? { layout: opts.layout } : {}),
    ...(opts.gap != null ? { gap: opts.gap } : {}),
    ...(opts.padding ? { padding: opts.padding } : {}),
    ...(opts.justifyContent ? { justifyContent: opts.justifyContent } : {}),
    ...(opts.alignItems ? { alignItems: opts.alignItems } : {}),
    children: opts.children || [],
  };
}

function text(id, content, opts = {}) {
  return {
    type: "text",
    id,
    fill: opts.fill || "$color.text.primary",
    content,
    fontFamily: opts.fontFamily || "Inter",
    fontSize: opts.fontSize || 14,
    fontWeight: opts.fontWeight || "400",
  };
}

function icon(id, name, opts = {}) {
  return {
    type: "icon_font",
    id,
    iconFontName: name,
    iconFontFamily: "lucide",
    width: opts.width || 20,
    height: opts.height || 20,
    fill: opts.fill || "$color.text.secondary",
  };
}

function stroke(fillVar, thickness = 1) {
  return { thickness, fill: fillVar };
}

function sectionHeader(prefix, title) {
  return text(uid(prefix), title, { fontSize: 24, fontWeight: "600" });
}

// ── 1. ColorPicker ──────────────────────────────────────────────────
function buildColorPicker() {
  // Color swatch (native input representation)
  const swatch = frame(uid("cp"), "cp-swatch", {
    width: 40,
    height: 40,
    cornerRadius: 6,
    fill: "$color.interactive.primary",
    stroke: stroke("$color.border.default"),
  });

  // Hex text input
  const hexInput = frame(uid("cp"), "cp-hex-input", {
    width: 140,
    height: 40,
    cornerRadius: 6,
    fill: "$color.background.primary",
    stroke: stroke("$color.border.default"),
    layout: "horizontal",
    padding: [12, 10],
    children: [
      text(uid("cp"), "#3b82f6", {
        fontSize: 14,
        fontFamily: "JetBrains Mono",
        fill: "$color.text.primary",
      }),
    ],
  });

  // Swatch + input row
  const inputRow = frame(uid("cp"), "cp-input-row", {
    width: 200,
    height: 40,
    layout: "horizontal",
    gap: 8,
    alignItems: "center",
    children: [swatch, hexInput],
  });

  // Preset color circles
  const presetColors = [
    "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6",
    "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#6b7280",
  ];
  const presetCircles = presetColors.map((color, i) =>
    frame(uid("cp"), `cp-preset-${i}`, {
      width: 24,
      height: 24,
      cornerRadius: 9999,
      fill: color,
      stroke: stroke("$color.border.default"),
    })
  );

  const presetsRow = frame(uid("cp"), "cp-presets", {
    width: 300,
    height: 24,
    layout: "horizontal",
    gap: 6,
    children: presetCircles,
  });

  const component = frame(uid("cp"), "color-picker", {
    reusable: true,
    width: 300,
    height: 80,
    layout: "vertical",
    gap: 8,
    children: [inputRow, presetsRow],
  });

  return frame(uid("cp"), "ColorPicker", {
    width: 1344,
    height: 140,
    layout: "vertical",
    gap: 12,
    children: [sectionHeader("cp", "ColorPicker"), component],
  });
}

// ── 2. Combobox ─────────────────────────────────────────────────────
function buildCombobox() {
  const trigger = frame(uid("cb"), "combobox", {
    reusable: true,
    width: 200,
    height: 40,
    cornerRadius: 6,
    fill: "$color.background.primary",
    stroke: stroke("$color.border.default"),
    layout: "horizontal",
    padding: [12, 10],
    gap: 8,
    justifyContent: "space-between",
    alignItems: "center",
    children: [
      text(uid("cb"), "Select framework...", {
        fontSize: 14,
        fill: "$color.text.tertiary",
      }),
      icon(uid("cb"), "chevrons-up-down", {
        width: 16,
        height: 16,
        fill: "$color.text.tertiary",
      }),
    ],
  });

  return frame(uid("cb"), "Combobox", {
    width: 1344,
    height: 100,
    layout: "vertical",
    gap: 12,
    children: [sectionHeader("cb", "Combobox"), trigger],
  });
}

// ── 3. FileUpload ───────────────────────────────────────────────────
function buildFileUpload() {
  const dropZone = frame(uid("fu"), "file-upload", {
    reusable: true,
    width: 400,
    height: 140,
    cornerRadius: 6,
    fill: "$color.background.primary",
    stroke: stroke("$color.border.default", 2),
    layout: "vertical",
    gap: 8,
    padding: [24, 32],
    justifyContent: "center",
    alignItems: "center",
    children: [
      icon(uid("fu"), "upload", {
        width: 40,
        height: 40,
        fill: "$color.text.tertiary",
      }),
      text(uid("fu"), "Click to upload or drag and drop", {
        fontSize: 14,
        fontWeight: "500",
        fill: "$color.text.primary",
      }),
      text(uid("fu"), "PNG, JPG up to 5MB", {
        fontSize: 12,
        fill: "$color.text.tertiary",
      }),
    ],
  });

  return frame(uid("fu"), "FileUpload", {
    width: 1344,
    height: 200,
    layout: "vertical",
    gap: 12,
    children: [sectionHeader("fu", "FileUpload"), dropZone],
  });
}

// ── 4. SearchBar ────────────────────────────────────────────────────
function buildSearchBar() {
  const searchInput = frame(uid("sb"), "search-bar", {
    reusable: true,
    width: 320,
    height: 40,
    cornerRadius: 6,
    fill: "$color.background.primary",
    stroke: stroke("$color.border.default"),
    layout: "horizontal",
    padding: [12, 10],
    gap: 8,
    alignItems: "center",
    children: [
      icon(uid("sb"), "search", {
        width: 16,
        height: 16,
        fill: "$color.text.tertiary",
      }),
      text(uid("sb"), "Search components...", {
        fontSize: 14,
        fill: "$color.text.tertiary",
      }),
      // Shortcut badge
      frame(uid("sb"), "sb-shortcut-badge", {
        width: 36,
        height: 22,
        cornerRadius: 4,
        fill: "$color.background.secondary",
        stroke: stroke("$color.border.default"),
        layout: "horizontal",
        padding: [6, 2],
        justifyContent: "center",
        alignItems: "center",
        children: [
          text(uid("sb"), "\u2318K", {
            fontSize: 11,
            fill: "$color.text.tertiary",
          }),
        ],
      }),
    ],
  });

  return frame(uid("sb"), "SearchBar", {
    width: 1344,
    height: 100,
    layout: "vertical",
    gap: 12,
    children: [sectionHeader("sb", "SearchBar"), searchInput],
  });
}

// ── 5. TimePicker ───────────────────────────────────────────────────
function buildTimePicker() {
  function selectBox(prefix, placeholder) {
    return frame(uid(prefix), `tp-select-${placeholder}`, {
      width: 56,
      height: 40,
      cornerRadius: 6,
      fill: "$color.background.primary",
      stroke: stroke("$color.border.default"),
      layout: "horizontal",
      padding: [8, 10],
      justifyContent: "center",
      alignItems: "center",
      children: [
        text(uid(prefix), placeholder, {
          fontSize: 14,
          fill: "$color.text.primary",
        }),
      ],
    });
  }

  const component = frame(uid("tp"), "time-picker", {
    reusable: true,
    width: 260,
    height: 40,
    layout: "horizontal",
    gap: 4,
    alignItems: "center",
    children: [
      icon(uid("tp"), "clock", {
        width: 16,
        height: 16,
        fill: "$color.text.tertiary",
      }),
      selectBox("tp", "09"),
      text(uid("tp"), ":", {
        fontSize: 14,
        fontWeight: "500",
        fill: "$color.text.tertiary",
      }),
      selectBox("tp", "00"),
      selectBox("tp", "AM"),
    ],
  });

  return frame(uid("tp"), "TimePicker", {
    width: 1344,
    height: 100,
    layout: "vertical",
    gap: 12,
    children: [sectionHeader("tp", "TimePicker"), component],
  });
}

// ── 6. ToggleGroup ──────────────────────────────────────────────────
function buildToggleGroup() {
  function toggleBtn(prefix, label, active) {
    return frame(uid(prefix), `tg-btn-${label}`, {
      width: 80,
      height: 36,
      cornerRadius: 6,
      fill: active ? "$color.background.tertiary" : "$color.background.primary",
      stroke: stroke("$color.border.default"),
      layout: "horizontal",
      padding: [16, 8],
      justifyContent: "center",
      alignItems: "center",
      children: [
        text(uid(prefix), label, {
          fontSize: 14,
          fontWeight: active ? "600" : "400",
          fill: active ? "$color.text.primary" : "$color.text.secondary",
        }),
      ],
    });
  }

  const component = frame(uid("tg"), "toggle-group", {
    reusable: true,
    width: 248,
    height: 36,
    layout: "horizontal",
    gap: 1,
    children: [
      toggleBtn("tg", "Bold", true),
      toggleBtn("tg", "Italic", false),
      toggleBtn("tg", "Strike", false),
    ],
  });

  return frame(uid("tg"), "ToggleGroup", {
    width: 1344,
    height: 100,
    layout: "vertical",
    gap: 12,
    children: [sectionHeader("tg", "ToggleGroup"), component],
  });
}

// ── 7. DatePicker ───────────────────────────────────────────────────
function buildDatePicker() {
  const trigger = frame(uid("dp"), "date-picker", {
    reusable: true,
    width: 240,
    height: 40,
    cornerRadius: 6,
    fill: "$color.background.primary",
    stroke: stroke("$color.border.default"),
    layout: "horizontal",
    padding: [12, 10],
    gap: 8,
    alignItems: "center",
    children: [
      icon(uid("dp"), "calendar", {
        width: 16,
        height: 16,
        fill: "$color.text.tertiary",
      }),
      text(uid("dp"), "Pick a date", {
        fontSize: 14,
        fill: "$color.text.tertiary",
      }),
    ],
  });

  return frame(uid("dp"), "DatePicker", {
    width: 1344,
    height: 100,
    layout: "vertical",
    gap: 12,
    children: [sectionHeader("dp", "DatePicker"), trigger],
  });
}

// ── Find the Form Controls page and append sections ─────────────────
const formControlsPage = pen.children.find(
  (child) => child.name === "Form Controls"
);

if (!formControlsPage) {
  console.error('Could not find "Form Controls" page frame in pen.children');
  process.exit(1);
}

const newSections = [
  buildColorPicker(),
  buildCombobox(),
  buildFileUpload(),
  buildSearchBar(),
  buildTimePicker(),
  buildToggleGroup(),
  buildDatePicker(),
];

formControlsPage.children.push(...newSections);

// Increase page height to accommodate new sections
formControlsPage.height += 900;

// ── Write back ──────────────────────────────────────────────────────
writeFileSync(PEN_PATH, JSON.stringify(pen, null, 2) + "\n", "utf-8");

console.log(
  `Added ${newSections.length} advanced form control sections to "Form Controls" page.`
);
