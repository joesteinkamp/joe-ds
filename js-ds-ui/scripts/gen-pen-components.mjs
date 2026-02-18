#!/usr/bin/env node
/**
 * gen-pen-components.mjs
 * Outputs pen-components.json containing visual frame representations
 * of all design-system components organized into page frames.
 */
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "pen-components.json");

// ── ID generator ────────────────────────────────────────────────────
let _id = 0;
const id = (prefix = "f") => `${prefix}-${++_id}`;

// ── Shorthand builders ──────────────────────────────────────────────
const fill = (varName) => ({ type: "color", color: `$${varName}` });
const stroke = (varName, thickness = 1) => ({
  fill: { type: "color", color: `$${varName}` },
  thickness,
});

function frame(name, opts = {}) {
  return {
    id: id("frame"),
    type: "frame",
    name,
    x: opts.x ?? 0,
    y: opts.y ?? 0,
    width: opts.width ?? 200,
    height: opts.height ?? 40,
    ...(opts.layout ? { layout: opts.layout } : {}),
    ...(opts.gap != null ? { gap: opts.gap } : {}),
    ...(opts.padding ? { padding: opts.padding } : {}),
    ...(opts.cornerRadius != null ? { cornerRadius: opts.cornerRadius } : {}),
    ...(opts.fill ? { fill: opts.fill } : {}),
    ...(opts.stroke ? { stroke: opts.stroke } : {}),
    ...(opts.reusable ? { reusable: true } : {}),
    children: opts.children ?? [],
  };
}

function text(content, opts = {}) {
  return {
    id: id("text"),
    type: "text",
    x: opts.x ?? 0,
    y: opts.y ?? 0,
    content,
    fontFamily: opts.fontFamily ?? "Inter",
    fontSize: opts.fontSize ?? 14,
    fontWeight: opts.fontWeight ?? 400,
    ...(opts.fill ? { fill: opts.fill } : { fill: fill("color.text.primary") }),
  };
}

function pageTitle(t) {
  return text(t, { fontSize: 36, fontWeight: 700 });
}

function sectionHeader(t) {
  return text(t, { fontSize: 24, fontWeight: 600 });
}

function label(t, opts = {}) {
  return text(t, { fontSize: 12, fontWeight: 500, fill: fill("color.text.secondary"), ...opts });
}

function placeholder(name, w = 300, h = 60) {
  return frame(name, {
    width: w,
    height: h,
    cornerRadius: 8,
    fill: fill("color.background.secondary"),
    stroke: stroke("color.border.default"),
    layout: "horizontal",
    padding: [16, 12],
    children: [text(name, { fontSize: 14, fontWeight: 500, fill: fill("color.text.secondary") })],
  });
}

// ── PAGE 1: Color Palette ───────────────────────────────────────────
function buildColorPalette() {
  const families = ["blue", "purple", "green", "red", "amber", "cyan", "neutral"];
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  const rows = families.map((fam) => {
    const allShades = fam === "neutral" ? [...shades, 950] : shades;
    const swatches = allShades.map((s, i) =>
      frame(`${fam}-${s}`, {
        x: 120 + i * 52,
        width: 40,
        height: 40,
        cornerRadius: 4,
        fill: fill(`color.${fam}.${s}`),
        stroke: stroke("color.border.default"),
      })
    );
    return frame(`${fam}-row`, {
      width: 1344,
      height: 60,
      layout: "horizontal",
      gap: 12,
      children: [label(fam.charAt(0).toUpperCase() + fam.slice(1), { fontWeight: 600 }), ...swatches],
    });
  });

  return frame("Color Palette", {
    width: 1440,
    height: 2100,
    layout: "vertical",
    padding: [48, 48],
    gap: 32,
    children: [pageTitle("Color Palette"), ...rows],
  });
}

// ── PAGE 2: Typography ──────────────────────────────────────────────
function buildTypography() {
  const sizes = [
    ["xs", 12], ["sm", 14], ["base", 16], ["lg", 18], ["xl", 20],
    ["2xl", 24], ["3xl", 30], ["4xl", 36], ["5xl", 48],
  ];
  const sizeRows = sizes.map(([name, px]) =>
    frame(`type-size-${name}`, {
      width: 1344,
      height: Math.max(px + 16, 36),
      layout: "horizontal",
      gap: 24,
      children: [
        label(`${name} (${px}px)`, { fontWeight: 500 }),
        text("The quick brown fox jumps over the lazy dog", { fontSize: px, fontWeight: 400 }),
      ],
    })
  );

  const weights = [
    ["Normal", 400], ["Medium", 500], ["Semibold", 600], ["Bold", 700],
  ];
  const weightRows = weights.map(([name, w]) =>
    frame(`type-weight-${w}`, {
      width: 1344,
      height: 36,
      layout: "horizontal",
      gap: 24,
      children: [
        label(`${name} (${w})`),
        text("The quick brown fox jumps over the lazy dog", { fontSize: 16, fontWeight: w }),
      ],
    })
  );

  const familyRows = [
    frame("font-sans", {
      width: 1344, height: 36, layout: "horizontal", gap: 24,
      children: [
        label("Sans (Inter)"),
        text("ABCDEFGHIJKLM abcdefghijklm 0123456789", { fontFamily: "Inter", fontSize: 16 }),
      ],
    }),
    frame("font-mono", {
      width: 1344, height: 36, layout: "horizontal", gap: 24,
      children: [
        label("Mono (JetBrains Mono)"),
        text("ABCDEFGHIJKLM abcdefghijklm 0123456789", { fontFamily: "JetBrains Mono", fontSize: 16 }),
      ],
    }),
  ];

  return frame("Typography", {
    x: 0, y: 2200,
    width: 1440, height: 2100,
    layout: "vertical",
    padding: [48, 48],
    gap: 32,
    children: [
      pageTitle("Typography"),
      sectionHeader("Font Sizes"),
      ...sizeRows,
      sectionHeader("Font Weights"),
      ...weightRows,
      sectionHeader("Font Families"),
      ...familyRows,
    ],
  });
}

// ── PAGE 3: Spacing & Sizing ────────────────────────────────────────
function buildSpacingSizing() {
  const spacingScale = [
    [0, 0], [1, 4], [2, 8], [3, 12], [4, 16], [5, 20], [6, 24],
    [8, 32], [10, 40], [12, 48], [16, 64], [20, 80], [24, 96],
  ];

  const spacingRects = spacingScale.map(([key, px]) =>
    frame(`spacing-${key}`, {
      width: 1344, height: Math.max(px + 8, 24), layout: "horizontal", gap: 12,
      children: [
        label(`${key} (${px}px)`),
        frame(`spacing-bar-${key}`, {
          width: Math.max(px * 3, 4),
          height: Math.max(px, 4),
          cornerRadius: 2,
          fill: fill("color.interactive.primary"),
        }),
      ],
    })
  );

  const heights = [["xs", 24], ["sm", 32], ["md", 40], ["lg", 48], ["xl", 56]];
  const heightRects = heights.map(([name, px]) =>
    frame(`height-${name}`, {
      width: 1344, height: px + 8, layout: "horizontal", gap: 12,
      children: [
        label(`${name} (${px}px)`),
        frame(`height-bar-${name}`, {
          width: 200,
          height: px,
          cornerRadius: 4,
          fill: fill("color.background.tertiary"),
          stroke: stroke("color.border.default"),
          layout: "horizontal",
          padding: [8, 0],
          children: [text(`${px}px`, { fontSize: 12, fill: fill("color.text.secondary") })],
        }),
      ],
    })
  );

  return frame("Spacing & Sizing", {
    x: 0, y: 4400,
    width: 1440, height: 2100,
    layout: "vertical",
    padding: [48, 48],
    gap: 24,
    children: [
      pageTitle("Spacing & Sizing"),
      sectionHeader("Spacing Scale"),
      ...spacingRects,
      sectionHeader("Component Heights"),
      ...heightRects,
    ],
  });
}

// ── PAGE 4: Form Controls ───────────────────────────────────────────
function buildFormControls() {
  // ── Buttons ──
  function btn(lbl, variant, size, opts = {}) {
    const sizeMap = { sm: { h: 32, fs: 12, px: 12 }, md: { h: 40, fs: 14, px: 16 }, lg: { h: 48, fs: 16, px: 20 } };
    const s = sizeMap[size] || sizeMap.md;
    const bgMap = {
      primary: fill("color.interactive.primary"),
      secondary: fill("color.background.secondary"),
      outline: fill("color.background.primary"),
      danger: fill("color.red.500"),
      disabled: fill("color.interactive.disabled"),
    };
    const textFillMap = {
      primary: fill("color.text.inverse"),
      secondary: fill("color.text.primary"),
      outline: fill("color.interactive.primary"),
      danger: fill("color.text.inverse"),
      disabled: fill("color.text.tertiary"),
    };
    return frame(`btn-${variant}-${size}`, {
      width: Math.max(lbl.length * (s.fs * 0.6) + s.px * 2, 80),
      height: s.h,
      cornerRadius: 6,
      fill: bgMap[variant],
      stroke: variant === "outline" ? stroke("color.interactive.primary") : stroke("color.border.default"),
      layout: "horizontal",
      gap: 8,
      padding: [s.px, (s.h - s.fs) / 2],
      reusable: variant === "primary" && size === "md",
      children: [text(lbl, { fontSize: s.fs, fontWeight: 500, fill: textFillMap[variant] })],
    });
  }

  const buttonVariants = [
    btn("Primary", "primary", "sm"), btn("Primary", "primary", "md"), btn("Primary", "primary", "lg"),
    btn("Secondary", "secondary", "sm"), btn("Secondary", "secondary", "md"), btn("Secondary", "secondary", "lg"),
    btn("Outline", "outline", "sm"), btn("Outline", "outline", "md"), btn("Outline", "outline", "lg"),
    btn("Danger", "danger", "sm"), btn("Danger", "danger", "md"), btn("Danger", "danger", "lg"),
    btn("Disabled", "disabled", "sm"), btn("Disabled", "disabled", "md"), btn("Disabled", "disabled", "lg"),
  ];

  const buttonSection = frame("Buttons", {
    width: 1344, height: 320, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Button"),
      frame("btn-row-primary", { width: 1344, height: 52, layout: "horizontal", gap: 16, children: [label("Primary"), buttonVariants[0], buttonVariants[1], buttonVariants[2]] }),
      frame("btn-row-secondary", { width: 1344, height: 52, layout: "horizontal", gap: 16, children: [label("Secondary"), buttonVariants[3], buttonVariants[4], buttonVariants[5]] }),
      frame("btn-row-outline", { width: 1344, height: 52, layout: "horizontal", gap: 16, children: [label("Outline"), buttonVariants[6], buttonVariants[7], buttonVariants[8]] }),
      frame("btn-row-danger", { width: 1344, height: 52, layout: "horizontal", gap: 16, children: [label("Danger"), buttonVariants[9], buttonVariants[10], buttonVariants[11]] }),
      frame("btn-row-disabled", { width: 1344, height: 52, layout: "horizontal", gap: 16, children: [label("Disabled"), buttonVariants[12], buttonVariants[13], buttonVariants[14]] }),
    ],
  });

  // ── Input ──
  function inputField(lbl, state) {
    const borderColor = state === "focused" ? "color.border.focus" : state === "error" ? "color.red.500" : "color.border.default";
    const bg = state === "disabled" ? fill("color.background.secondary") : fill("color.background.primary");
    return frame(`input-${state}`, {
      width: 280, height: 40, cornerRadius: 6,
      fill: bg, stroke: stroke(borderColor),
      layout: "horizontal", padding: [12, 10],
      reusable: state === "default",
      children: [text(lbl, { fontSize: 14, fill: fill(state === "disabled" ? "color.text.tertiary" : "color.text.secondary") })],
    });
  }
  const inputSection = frame("Inputs", {
    width: 1344, height: 100, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Input"),
      frame("input-row", {
        width: 1344, height: 48, layout: "horizontal", gap: 16,
        children: [
          inputField("Default", "default"),
          inputField("Focused", "focused"),
          inputField("Error", "error"),
          inputField("Disabled", "disabled"),
        ],
      }),
    ],
  });

  // ── Textarea ──
  const textareaSection = frame("Textarea", {
    width: 1344, height: 140, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Textarea"),
      frame("textarea-default", {
        width: 400, height: 100, cornerRadius: 6,
        fill: fill("color.background.primary"), stroke: stroke("color.border.default"),
        layout: "vertical", padding: [12, 10],
        reusable: true,
        children: [text("Enter text here...", { fontSize: 14, fill: fill("color.text.tertiary") })],
      }),
    ],
  });

  // ── Label ──
  const labelSection = frame("Label", {
    width: 1344, height: 60, layout: "vertical", gap: 8,
    children: [
      sectionHeader("Label"),
      text("Form Label", { fontSize: 14, fontWeight: 500, fill: fill("color.text.primary") }),
    ],
  });

  // ── Checkbox ──
  function checkbox(lbl, state) {
    const checked = state === "checked";
    const disabled = state === "disabled";
    const boxFill = checked ? fill("color.interactive.primary") : fill("color.background.primary");
    const boxBorder = disabled ? "color.interactive.disabled" : checked ? "color.interactive.primary" : "color.border.default";
    return frame(`checkbox-${state}`, {
      width: 160, height: 24, layout: "horizontal", gap: 8,
      children: [
        frame(`cb-box-${state}`, {
          width: 20, height: 20, cornerRadius: 4,
          fill: boxFill, stroke: stroke(boxBorder),
          children: checked ? [text("\u2713", { fontSize: 14, fontWeight: 700, fill: fill("color.text.inverse") })] : [],
        }),
        text(lbl, { fontSize: 14, fill: fill(disabled ? "color.text.tertiary" : "color.text.primary") }),
      ],
    });
  }
  const checkboxSection = frame("Checkbox", {
    width: 1344, height: 70, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Checkbox"),
      frame("cb-row", { width: 1344, height: 28, layout: "horizontal", gap: 24, children: [checkbox("Unchecked", "unchecked"), checkbox("Checked", "checked"), checkbox("Disabled", "disabled")] }),
    ],
  });

  // ── RadioGroup ──
  function radio(lbl, selected) {
    return frame(`radio-${lbl}`, {
      width: 160, height: 24, layout: "horizontal", gap: 8,
      children: [
        frame(`radio-circle-${lbl}`, {
          width: 20, height: 20, cornerRadius: 9999,
          fill: fill("color.background.primary"),
          stroke: stroke(selected ? "color.interactive.primary" : "color.border.default", selected ? 6 : 1),
        }),
        text(lbl, { fontSize: 14 }),
      ],
    });
  }
  const radioSection = frame("RadioGroup", {
    width: 1344, height: 100, layout: "vertical", gap: 12,
    children: [
      sectionHeader("RadioGroup"),
      frame("radio-group", { width: 300, height: 60, layout: "vertical", gap: 12, children: [radio("Option A", true), radio("Option B", false)] }),
    ],
  });

  // ── Switch ──
  function switchComp(state) {
    const on = state === "on";
    return frame(`switch-${state}`, {
      width: 44, height: 24, cornerRadius: 9999,
      fill: fill(on ? "color.interactive.primary" : "color.neutral.300"),
      reusable: state === "on",
      children: [
        frame(`switch-thumb-${state}`, {
          x: on ? 22 : 2, y: 2,
          width: 20, height: 20, cornerRadius: 9999,
          fill: fill("color.background.primary"),
        }),
      ],
    });
  }
  const switchSection = frame("Switch", {
    width: 1344, height: 70, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Switch"),
      frame("switch-row", { width: 1344, height: 28, layout: "horizontal", gap: 24, children: [label("On"), switchComp("on"), label("Off"), switchComp("off")] }),
    ],
  });

  // ── Select ──
  const selectSection = frame("Select", {
    width: 1344, height: 90, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Select"),
      frame("select-closed", {
        width: 280, height: 40, cornerRadius: 6,
        fill: fill("color.background.primary"), stroke: stroke("color.border.default"),
        layout: "horizontal", padding: [12, 10],
        reusable: true,
        children: [
          text("Select an option...", { fontSize: 14, fill: fill("color.text.tertiary") }),
          text("\u25BE", { fontSize: 14, fill: fill("color.text.secondary"), x: 240 }),
        ],
      }),
    ],
  });

  // ── Slider ──
  const sliderSection = frame("Slider", {
    width: 1344, height: 70, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Slider"),
      frame("slider-track", {
        width: 300, height: 24, layout: "horizontal",
        children: [
          frame("slider-filled", { width: 180, height: 6, y: 9, cornerRadius: 3, fill: fill("color.interactive.primary") }),
          frame("slider-empty", { x: 180, width: 120, height: 6, y: 9, cornerRadius: 3, fill: fill("color.neutral.200") }),
          frame("slider-thumb", { x: 172, y: 2, width: 20, height: 20, cornerRadius: 9999, fill: fill("color.background.primary"), stroke: stroke("color.interactive.primary", 2) }),
        ],
      }),
    ],
  });

  // ── FormField ──
  const formFieldSection = frame("FormField", {
    width: 1344, height: 120, layout: "vertical", gap: 12,
    children: [
      sectionHeader("FormField"),
      frame("formfield-example", {
        width: 320, height: 80, layout: "vertical", gap: 4,
        reusable: true,
        children: [
          text("Email Address", { fontSize: 14, fontWeight: 500 }),
          frame("formfield-input", {
            width: 320, height: 40, cornerRadius: 6,
            fill: fill("color.background.primary"), stroke: stroke("color.border.default"),
            layout: "horizontal", padding: [12, 10],
            children: [text("you@example.com", { fontSize: 14, fill: fill("color.text.tertiary") })],
          }),
          text("We'll never share your email.", { fontSize: 12, fill: fill("color.text.secondary") }),
        ],
      }),
    ],
  });

  // ── Complex placeholders ──
  const complexPlaceholders = [
    "DatePicker", "ComboBox", "TimePicker", "FileUpload",
    "ColorPicker", "RangeSlider", "MultiSelect", "Autocomplete",
  ].map((n) => placeholder(n));

  const complexSection = frame("Complex Form Controls", {
    width: 1344, height: 200, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Complex Controls (Placeholders)"),
      frame("complex-grid", {
        width: 1344, height: 140, layout: "horizontal", gap: 16,
        children: complexPlaceholders,
      }),
    ],
  });

  return frame("Form Controls", {
    x: 0, y: 6600,
    width: 1440, height: 2100,
    layout: "vertical",
    padding: [48, 48],
    gap: 24,
    children: [
      pageTitle("Form Controls"),
      buttonSection,
      inputSection,
      textareaSection,
      labelSection,
      checkboxSection,
      radioSection,
      switchSection,
      selectSection,
      sliderSection,
      formFieldSection,
      complexSection,
    ],
  });
}

// ── PAGE 5: Overlays & Feedback ─────────────────────────────────────
function buildOverlaysFeedback() {
  // ── Dialog ──
  const dialogSection = frame("Dialog", {
    width: 1344, height: 280, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Dialog"),
      frame("dialog-overlay", {
        width: 600, height: 240, cornerRadius: 0,
        fill: fill("color.background.overlay"),
        children: [
          frame("dialog-content", {
            x: 50, y: 20, width: 500, height: 200, cornerRadius: 8,
            fill: fill("color.background.primary"), stroke: stroke("color.border.default"),
            layout: "vertical", padding: [24, 24], gap: 12,
            reusable: true,
            children: [
              text("Dialog Title", { fontSize: 18, fontWeight: 600 }),
              text("Are you sure you want to continue? This action cannot be undone.", { fontSize: 14, fill: fill("color.text.secondary") }),
              frame("dialog-actions", {
                width: 452, height: 40, layout: "horizontal", gap: 12,
                children: [
                  frame("dialog-cancel", {
                    width: 80, height: 36, cornerRadius: 6,
                    fill: fill("color.background.secondary"), stroke: stroke("color.border.default"),
                    layout: "horizontal", padding: [16, 8],
                    children: [text("Cancel", { fontSize: 14, fontWeight: 500 })],
                  }),
                  frame("dialog-confirm", {
                    width: 80, height: 36, cornerRadius: 6,
                    fill: fill("color.interactive.primary"),
                    layout: "horizontal", padding: [16, 8],
                    children: [text("Confirm", { fontSize: 14, fontWeight: 500, fill: fill("color.text.inverse") })],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // ── Sheet ──
  const sheetSection = frame("Sheet", {
    width: 1344, height: 280, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Sheet"),
      frame("sheet-container", {
        width: 600, height: 240, cornerRadius: 0,
        fill: fill("color.background.overlay"),
        children: [
          frame("sheet-panel", {
            x: 260, y: 0, width: 340, height: 240, cornerRadius: 0,
            fill: fill("color.background.primary"), stroke: stroke("color.border.default"),
            layout: "vertical", padding: [24, 24], gap: 16,
            reusable: true,
            children: [
              text("Sheet Title", { fontSize: 18, fontWeight: 600 }),
              text("Sheet content goes here. This panel slides in from the side.", { fontSize: 14, fill: fill("color.text.secondary") }),
            ],
          }),
        ],
      }),
    ],
  });

  // ── Toast ──
  function toast(variant) {
    const colorMap = { success: "green", warning: "amber", error: "red", info: "cyan" };
    const c = colorMap[variant];
    return frame(`toast-${variant}`, {
      width: 320, height: 64, cornerRadius: 8,
      fill: fill(`color.background.${variant === "error" ? "error" : variant}`),
      stroke: stroke(`color.${c}.300`),
      layout: "horizontal", padding: [16, 12], gap: 12,
      reusable: true,
      children: [
        frame(`toast-icon-${variant}`, {
          width: 20, height: 20, cornerRadius: 9999,
          fill: fill(`color.${c}.500`),
          children: [text(variant === "success" ? "\u2713" : variant === "warning" ? "!" : variant === "error" ? "\u2717" : "i", { fontSize: 12, fontWeight: 700, fill: fill("color.text.inverse") })],
        }),
        frame(`toast-text-${variant}`, {
          width: 252, height: 40, layout: "vertical", gap: 2,
          children: [
            text(`${variant.charAt(0).toUpperCase() + variant.slice(1)}`, { fontSize: 14, fontWeight: 600, fill: fill(`color.text.${variant === "warning" ? "warning" : variant === "error" ? "error" : variant === "success" ? "success" : "info"}`) }),
            text(`This is a ${variant} notification message.`, { fontSize: 12, fill: fill("color.text.secondary") }),
          ],
        }),
      ],
    });
  }
  const toastSection = frame("Toast", {
    width: 1344, height: 180, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Toast"),
      frame("toast-row", { width: 1344, height: 120, layout: "vertical", gap: 12, children: [
        frame("toast-row-1", { width: 1344, height: 64, layout: "horizontal", gap: 16, children: [toast("success"), toast("warning")] }),
        frame("toast-row-2", { width: 1344, height: 64, layout: "horizontal", gap: 16, children: [toast("error"), toast("info")] }),
      ]}),
    ],
  });

  // ── Alert ──
  function alert(variant) {
    const colorMap = { success: "green", warning: "amber", error: "red", info: "cyan" };
    const c = colorMap[variant];
    return frame(`alert-${variant}`, {
      width: 600, height: 60, cornerRadius: 8,
      fill: fill(`color.background.${variant === "error" ? "error" : variant}`),
      stroke: stroke(`color.${c}.300`),
      layout: "horizontal", padding: [12, 12], gap: 12,
      reusable: true,
      children: [
        text(`${variant.charAt(0).toUpperCase() + variant.slice(1)}: This is a ${variant} alert message.`, {
          fontSize: 14, fill: fill(`color.text.${variant === "warning" ? "warning" : variant === "error" ? "error" : variant === "success" ? "success" : "info"}`),
        }),
      ],
    });
  }
  const alertSection = frame("Alert", {
    width: 1344, height: 200, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Alert"),
      frame("alert-list", { width: 1344, height: 160, layout: "vertical", gap: 12, children: [alert("success"), alert("warning"), alert("error"), alert("info")] }),
    ],
  });

  // ── Popover ──
  const popoverSection = frame("Popover", {
    width: 1344, height: 160, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Popover"),
      frame("popover-group", {
        width: 300, height: 120, layout: "vertical", gap: 4,
        children: [
          frame("popover-trigger", {
            width: 120, height: 36, cornerRadius: 6,
            fill: fill("color.background.secondary"), stroke: stroke("color.border.default"),
            layout: "horizontal", padding: [16, 8],
            children: [text("Open", { fontSize: 14, fontWeight: 500 })],
          }),
          frame("popover-content", {
            width: 240, height: 80, cornerRadius: 8,
            fill: fill("color.background.primary"), stroke: stroke("color.border.default"),
            layout: "vertical", padding: [12, 12], gap: 4,
            reusable: true,
            children: [
              text("Popover Title", { fontSize: 14, fontWeight: 600 }),
              text("Additional contextual content displayed in a floating panel.", { fontSize: 12, fill: fill("color.text.secondary") }),
            ],
          }),
        ],
      }),
    ],
  });

  // ── Tooltip ──
  const tooltipSection = frame("Tooltip", {
    width: 1344, height: 100, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Tooltip"),
      frame("tooltip-group", {
        width: 300, height: 60, layout: "vertical", gap: 4,
        children: [
          text("Hover target", { fontSize: 14, fill: fill("color.interactive.primary") }),
          frame("tooltip-bubble", {
            width: 180, height: 32, cornerRadius: 4,
            fill: fill("color.background.inverse"),
            layout: "horizontal", padding: [8, 6],
            reusable: true,
            children: [text("Tooltip message", { fontSize: 12, fill: fill("color.text.inverse") })],
          }),
        ],
      }),
    ],
  });

  // ── Spinner ──
  const spinnerSection = frame("Spinner", {
    width: 1344, height: 80, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Spinner"),
      frame("spinner-examples", {
        width: 300, height: 40, layout: "horizontal", gap: 24,
        children: [
          frame("spinner-sm", { width: 20, height: 20, cornerRadius: 9999, stroke: stroke("color.interactive.primary", 2) }),
          frame("spinner-md", { width: 32, height: 32, cornerRadius: 9999, stroke: stroke("color.interactive.primary", 3) }),
          frame("spinner-lg", { width: 40, height: 40, cornerRadius: 9999, stroke: stroke("color.interactive.primary", 3) }),
        ],
      }),
    ],
  });

  // ── DropdownMenu ──
  const dropdownSection = frame("DropdownMenu", {
    width: 1344, height: 100, layout: "vertical", gap: 12,
    children: [
      sectionHeader("DropdownMenu"),
      frame("dropdown-trigger", {
        width: 160, height: 40, cornerRadius: 6,
        fill: fill("color.background.secondary"), stroke: stroke("color.border.default"),
        layout: "horizontal", padding: [16, 10], gap: 8,
        reusable: true,
        children: [
          text("Actions", { fontSize: 14, fontWeight: 500 }),
          text("\u25BE", { fontSize: 14, fill: fill("color.text.secondary") }),
        ],
      }),
    ],
  });

  return frame("Overlays & Feedback", {
    x: 0, y: 8800,
    width: 1440, height: 2100,
    layout: "vertical",
    padding: [48, 48],
    gap: 24,
    children: [
      pageTitle("Overlays & Feedback"),
      dialogSection,
      sheetSection,
      toastSection,
      alertSection,
      popoverSection,
      tooltipSection,
      spinnerSection,
      dropdownSection,
    ],
  });
}

// ── PAGE 6: Data Display ────────────────────────────────────────────
function buildDataDisplay() {
  // ── Card ──
  const cardSection = frame("Card", {
    width: 1344, height: 240, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Card"),
      frame("card-example", {
        width: 360, height: 200, cornerRadius: 8,
        fill: fill("color.background.primary"), stroke: stroke("color.border.default"),
        layout: "vertical", gap: 0,
        reusable: true,
        children: [
          frame("card-header", {
            width: 360, height: 52, layout: "horizontal", padding: [16, 16], gap: 8,
            stroke: stroke("color.border.default"),
            children: [
              frame("card-header-text", { width: 328, height: 20, layout: "vertical", gap: 2, children: [
                text("Card Title", { fontSize: 16, fontWeight: 600 }),
                text("Card description text", { fontSize: 12, fill: fill("color.text.secondary") }),
              ]}),
            ],
          }),
          frame("card-content", {
            width: 360, height: 100, layout: "vertical", padding: [16, 16],
            children: [text("Card body content goes here. This area can contain any content.", { fontSize: 14, fill: fill("color.text.secondary") })],
          }),
          frame("card-footer", {
            width: 360, height: 48, layout: "horizontal", padding: [16, 12], gap: 8,
            stroke: stroke("color.border.default"),
            children: [
              frame("card-btn", {
                width: 80, height: 32, cornerRadius: 6,
                fill: fill("color.interactive.primary"),
                layout: "horizontal", padding: [16, 6],
                children: [text("Action", { fontSize: 13, fontWeight: 500, fill: fill("color.text.inverse") })],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // ── Badge ──
  function badge(variant) {
    const colorMap = { default: "neutral", success: "green", warning: "amber", error: "red", info: "cyan" };
    const c = colorMap[variant];
    return frame(`badge-${variant}`, {
      width: 80, height: 22, cornerRadius: 9999,
      fill: fill(`color.${c}.100`),
      stroke: stroke(`color.${c}.300`),
      layout: "horizontal", padding: [10, 2],
      reusable: variant === "default",
      children: [text(variant.charAt(0).toUpperCase() + variant.slice(1), { fontSize: 12, fontWeight: 600, fill: fill(`color.${c}.700`) })],
    });
  }
  const badgeSection = frame("Badge", {
    width: 1344, height: 70, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Badge"),
      frame("badge-row", { width: 1344, height: 28, layout: "horizontal", gap: 12, children: [badge("default"), badge("success"), badge("warning"), badge("error"), badge("info")] }),
    ],
  });

  // ── Avatar ──
  const avatarSection = frame("Avatar", {
    width: 1344, height: 80, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Avatar"),
      frame("avatar-row", {
        width: 300, height: 48, layout: "horizontal", gap: 16,
        children: [
          frame("avatar-sm", { width: 32, height: 32, cornerRadius: 9999, fill: fill("color.interactive.primary"), children: [text("JS", { fontSize: 12, fontWeight: 600, fill: fill("color.text.inverse") })] }),
          frame("avatar-md", { width: 40, height: 40, cornerRadius: 9999, fill: fill("color.purple.500"), children: [text("AB", { fontSize: 14, fontWeight: 600, fill: fill("color.text.inverse") })] }),
          frame("avatar-lg", { width: 48, height: 48, cornerRadius: 9999, fill: fill("color.green.500"), children: [text("CD", { fontSize: 16, fontWeight: 600, fill: fill("color.text.inverse") })] }),
        ],
      }),
    ],
  });

  // ── Progress ──
  const progressSection = frame("Progress", {
    width: 1344, height: 70, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Progress"),
      frame("progress-bar-bg", {
        width: 400, height: 8, cornerRadius: 4,
        fill: fill("color.neutral.200"),
        reusable: true,
        children: [
          frame("progress-bar-fill", { width: 240, height: 8, cornerRadius: 4, fill: fill("color.interactive.primary") }),
        ],
      }),
    ],
  });

  // ── Accordion ──
  function accordionItem(title, isOpen, content) {
    const children = [
      frame(`acc-header-${title}`, {
        width: 400, height: 44, layout: "horizontal", padding: [12, 12], gap: 8,
        stroke: stroke("color.border.default"),
        children: [
          text(isOpen ? "\u25BC" : "\u25B6", { fontSize: 10, fill: fill("color.text.secondary") }),
          text(title, { fontSize: 14, fontWeight: 500 }),
        ],
      }),
    ];
    if (isOpen) {
      children.push(
        frame(`acc-content-${title}`, {
          width: 400, height: 48, layout: "horizontal", padding: [12, 12],
          children: [text(content, { fontSize: 14, fill: fill("color.text.secondary") })],
        })
      );
    }
    return frame(`accordion-item-${title}`, { width: 400, height: isOpen ? 92 : 44, layout: "vertical", gap: 0, children });
  }
  const accordionSection = frame("Accordion", {
    width: 1344, height: 240, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Accordion"),
      frame("accordion-group", {
        width: 400, height: 180, cornerRadius: 8, layout: "vertical", gap: 0,
        stroke: stroke("color.border.default"),
        reusable: true,
        children: [
          accordionItem("Section One", true, "This section is expanded and shows its content."),
          accordionItem("Section Two", false, ""),
          accordionItem("Section Three", false, ""),
        ],
      }),
    ],
  });

  // ── Tabs ──
  const tabsSection = frame("Tabs", {
    width: 1344, height: 100, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Tabs"),
      frame("tabs-bar", {
        width: 400, height: 40, layout: "horizontal", gap: 0,
        stroke: stroke("color.border.default"),
        reusable: true,
        children: [
          frame("tab-1", {
            width: 120, height: 40, layout: "horizontal", padding: [16, 10],
            stroke: stroke("color.interactive.primary"),
            children: [text("Tab One", { fontSize: 14, fontWeight: 600, fill: fill("color.interactive.primary") })],
          }),
          frame("tab-2", {
            width: 120, height: 40, layout: "horizontal", padding: [16, 10],
            children: [text("Tab Two", { fontSize: 14, fill: fill("color.text.secondary") })],
          }),
          frame("tab-3", {
            width: 120, height: 40, layout: "horizontal", padding: [16, 10],
            children: [text("Tab Three", { fontSize: 14, fill: fill("color.text.secondary") })],
          }),
        ],
      }),
    ],
  });

  // ── Separator ──
  const separatorSection = frame("Separator", {
    width: 1344, height: 50, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Separator"),
      frame("separator-line", { width: 400, height: 1, fill: fill("color.border.default") }),
    ],
  });

  // ── Skeleton ──
  const skeletonSection = frame("Skeleton", {
    width: 1344, height: 100, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Skeleton"),
      frame("skeleton-group", {
        width: 360, height: 60, layout: "vertical", gap: 8,
        reusable: true,
        children: [
          frame("skeleton-line-1", { width: 360, height: 16, cornerRadius: 4, fill: fill("color.neutral.200") }),
          frame("skeleton-line-2", { width: 280, height: 16, cornerRadius: 4, fill: fill("color.neutral.200") }),
          frame("skeleton-line-3", { width: 200, height: 16, cornerRadius: 4, fill: fill("color.neutral.200") }),
        ],
      }),
    ],
  });

  // ── Table ──
  function tableRow(cells, isHeader) {
    return frame(`table-row-${cells[0]}`, {
      width: 600, height: 40, layout: "horizontal", gap: 0,
      stroke: stroke("color.border.default"),
      fill: isHeader ? fill("color.background.secondary") : undefined,
      children: cells.map((c) =>
        frame(`table-cell-${c}`, {
          width: 200, height: 40, layout: "horizontal", padding: [12, 10],
          children: [text(c, { fontSize: 14, fontWeight: isHeader ? 600 : 400, fill: fill(isHeader ? "color.text.primary" : "color.text.secondary") })],
        })
      ),
    });
  }
  const tableSection = frame("Table", {
    width: 1344, height: 240, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Table"),
      frame("table-example", {
        width: 600, height: 160, cornerRadius: 8, layout: "vertical", gap: 0,
        stroke: stroke("color.border.default"),
        reusable: true,
        children: [
          tableRow(["Name", "Status", "Role"], true),
          tableRow(["Alice Smith", "Active", "Admin"], false),
          tableRow(["Bob Jones", "Inactive", "Editor"], false),
          tableRow(["Carol Lee", "Active", "Viewer"], false),
        ],
      }),
    ],
  });

  // ── Calendar placeholder ──
  const calendarSection = frame("Calendar", {
    width: 1344, height: 80, layout: "vertical", gap: 12,
    children: [sectionHeader("Calendar"), placeholder("Calendar", 320, 40)],
  });

  return frame("Data Display", {
    x: 0, y: 11000,
    width: 1440, height: 2100,
    layout: "vertical",
    padding: [48, 48],
    gap: 24,
    children: [
      pageTitle("Data Display"),
      cardSection,
      badgeSection,
      avatarSection,
      progressSection,
      accordionSection,
      tabsSection,
      separatorSection,
      skeletonSection,
      tableSection,
      calendarSection,
    ],
  });
}

// ── PAGE 7: Navigation & Layout ─────────────────────────────────────
function buildNavigationLayout() {
  // ── Breadcrumb ──
  const breadcrumbSection = frame("Breadcrumb", {
    width: 1344, height: 70, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Breadcrumb"),
      frame("breadcrumb-bar", {
        width: 400, height: 28, layout: "horizontal", gap: 8,
        reusable: true,
        children: [
          text("Home", { fontSize: 14, fill: fill("color.interactive.primary") }),
          text("/", { fontSize: 14, fill: fill("color.text.tertiary") }),
          text("Products", { fontSize: 14, fill: fill("color.interactive.primary") }),
          text("/", { fontSize: 14, fill: fill("color.text.tertiary") }),
          text("Widget", { fontSize: 14, fontWeight: 500, fill: fill("color.text.primary") }),
        ],
      }),
    ],
  });

  // ── Pagination ──
  function pageBtn(lbl, active) {
    return frame(`page-${lbl}`, {
      width: 36, height: 36, cornerRadius: 6,
      fill: fill(active ? "color.interactive.primary" : "color.background.primary"),
      stroke: stroke(active ? "color.interactive.primary" : "color.border.default"),
      layout: "horizontal", padding: [0, 8],
      children: [text(String(lbl), { fontSize: 14, fontWeight: active ? 600 : 400, fill: fill(active ? "color.text.inverse" : "color.text.primary") })],
    });
  }
  const paginationSection = frame("Pagination", {
    width: 1344, height: 80, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Pagination"),
      frame("pagination-bar", {
        width: 400, height: 40, layout: "horizontal", gap: 4,
        reusable: true,
        children: [
          frame("page-prev", { width: 36, height: 36, cornerRadius: 6, stroke: stroke("color.border.default"), layout: "horizontal", padding: [0, 8], children: [text("\u2190", { fontSize: 14 })] }),
          pageBtn(1, true), pageBtn(2, false), pageBtn(3, false), pageBtn(4, false), pageBtn(5, false),
          frame("page-next", { width: 36, height: 36, cornerRadius: 6, stroke: stroke("color.border.default"), layout: "horizontal", padding: [0, 8], children: [text("\u2192", { fontSize: 14 })] }),
        ],
      }),
    ],
  });

  // ── NavigationMenu ──
  const navMenuSection = frame("NavigationMenu", {
    width: 1344, height: 90, layout: "vertical", gap: 12,
    children: [
      sectionHeader("NavigationMenu"),
      frame("nav-menu-bar", {
        width: 600, height: 48, cornerRadius: 0, layout: "horizontal", gap: 0,
        fill: fill("color.background.primary"), stroke: stroke("color.border.default"),
        reusable: true,
        children: [
          frame("nav-item-1", { width: 200, height: 48, layout: "horizontal", padding: [24, 14], children: [text("Dashboard", { fontSize: 14, fontWeight: 600, fill: fill("color.interactive.primary") })] }),
          frame("nav-item-2", { width: 200, height: 48, layout: "horizontal", padding: [24, 14], children: [text("Settings", { fontSize: 14, fill: fill("color.text.secondary") })] }),
          frame("nav-item-3", { width: 200, height: 48, layout: "horizontal", padding: [24, 14], children: [text("Profile", { fontSize: 14, fill: fill("color.text.secondary") })] }),
        ],
      }),
    ],
  });

  // ── Menubar ──
  const menubarSection = frame("Menubar", {
    width: 1344, height: 90, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Menubar"),
      frame("menubar-bar", {
        width: 400, height: 40, layout: "horizontal", gap: 0,
        fill: fill("color.background.secondary"), cornerRadius: 6,
        reusable: true,
        children: [
          frame("menu-item-1", { width: 100, height: 40, layout: "horizontal", padding: [16, 10], children: [text("File", { fontSize: 14, fontWeight: 500 })] }),
          frame("menu-item-2", { width: 100, height: 40, layout: "horizontal", padding: [16, 10], children: [text("Edit", { fontSize: 14, fontWeight: 500 })] }),
          frame("menu-item-3", { width: 100, height: 40, layout: "horizontal", padding: [16, 10], children: [text("View", { fontSize: 14, fontWeight: 500 })] }),
        ],
      }),
    ],
  });

  // ── Link ──
  const linkSection = frame("Link", {
    width: 1344, height: 60, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Link"),
      frame("link-examples", {
        width: 400, height: 24, layout: "horizontal", gap: 24,
        children: [
          text("Default Link", { fontSize: 14, fill: fill("color.interactive.primary") }),
          text("Visited Link", { fontSize: 14, fill: fill("color.purple.600") }),
          text("Hover Link", { fontSize: 14, fontWeight: 500, fill: fill("color.interactive.primary-hover") }),
        ],
      }),
    ],
  });

  // ── Container ──
  const containerSection = frame("Container", {
    width: 1344, height: 120, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Container"),
      frame("container-example", {
        width: 800, height: 80, cornerRadius: 0,
        fill: fill("color.background.secondary"),
        layout: "horizontal", padding: [32, 24],
        reusable: true,
        children: [text("Container (max-width with padding)", { fontSize: 14, fill: fill("color.text.secondary") })],
      }),
    ],
  });

  // ── Stack ──
  const stackSection = frame("Stack", {
    width: 1344, height: 260, layout: "vertical", gap: 12,
    children: [
      sectionHeader("Stack"),
      frame("stack-examples", {
        width: 1344, height: 200, layout: "horizontal", gap: 48,
        children: [
          frame("vstack-example", {
            width: 200, height: 200, layout: "vertical", gap: 8,
            children: [
              label("Vertical Stack"),
              frame("vstack-item-1", { width: 200, height: 40, cornerRadius: 4, fill: fill("color.blue.100"), layout: "horizontal", padding: [8, 10], children: [text("Item 1", { fontSize: 14 })] }),
              frame("vstack-item-2", { width: 200, height: 40, cornerRadius: 4, fill: fill("color.blue.100"), layout: "horizontal", padding: [8, 10], children: [text("Item 2", { fontSize: 14 })] }),
              frame("vstack-item-3", { width: 200, height: 40, cornerRadius: 4, fill: fill("color.blue.100"), layout: "horizontal", padding: [8, 10], children: [text("Item 3", { fontSize: 14 })] }),
            ],
          }),
          frame("hstack-example", {
            width: 500, height: 200, layout: "vertical", gap: 8,
            children: [
              label("Horizontal Stack"),
              frame("hstack-items", {
                width: 500, height: 60, layout: "horizontal", gap: 8,
                children: [
                  frame("hstack-item-1", { width: 150, height: 60, cornerRadius: 4, fill: fill("color.purple.100"), layout: "horizontal", padding: [8, 20], children: [text("Item A", { fontSize: 14 })] }),
                  frame("hstack-item-2", { width: 150, height: 60, cornerRadius: 4, fill: fill("color.purple.100"), layout: "horizontal", padding: [8, 20], children: [text("Item B", { fontSize: 14 })] }),
                  frame("hstack-item-3", { width: 150, height: 60, cornerRadius: 4, fill: fill("color.purple.100"), layout: "horizontal", padding: [8, 20], children: [text("Item C", { fontSize: 14 })] }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  return frame("Navigation & Layout", {
    x: 0, y: 13200,
    width: 1440, height: 2100,
    layout: "vertical",
    padding: [48, 48],
    gap: 24,
    children: [
      pageTitle("Navigation & Layout"),
      breadcrumbSection,
      paginationSection,
      navMenuSection,
      menubarSection,
      linkSection,
      containerSection,
      stackSection,
    ],
  });
}

// ── Assemble all pages ──────────────────────────────────────────────
const pages = [
  buildColorPalette(),
  buildTypography(),
  buildSpacingSizing(),
  buildFormControls(),
  buildOverlaysFeedback(),
  buildDataDisplay(),
  buildNavigationLayout(),
];

writeFileSync(OUT, JSON.stringify(pages, null, 2) + "\n");

// count all nodes recursively
function countNodes(node) {
  let c = 1;
  if (node.children) for (const ch of node.children) c += countNodes(ch);
  return c;
}
const total = pages.reduce((s, p) => s + countNodes(p), 0);
console.log(`Wrote ${pages.length} pages (${total} total nodes) to ${OUT}`);
