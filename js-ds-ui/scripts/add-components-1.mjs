#!/usr/bin/env node
/**
 * add-components-1.mjs
 * Adds typography & display component sections to the .pen file:
 *   - heading (h1-h6 variants)         → Typography page
 *   - text (size variants)             → Typography page
 *   - blockquote (with left border)    → Data Display page
 *   - code (inline Code + CodeBlock)   → Data Display page
 *   - icon (size variants, lucide)     → Data Display page
 *   - image (rounded variants)         → Data Display page
 *   - announcement (a11y live region)  → Navigation & Layout page
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PEN_PATH = resolve(__dirname, "..", "js-ds-ui.pen");

// ── Read .pen ───────────────────────────────────────────────────────
const pen = JSON.parse(readFileSync(PEN_PATH, "utf-8"));

// ── Unique ID counter (start high to avoid clashing with existing ids) ──
let _seq = 9000;
const uid = (prefix) => `${prefix}-${++_seq}`;

// ── Find a top-level page frame by name ─────────────────────────────
function findPage(name) {
  const page = pen.children.find((c) => c.name === name);
  if (!page) throw new Error(`Page "${name}" not found in .pen children`);
  return page;
}

// ── Builder helpers (matching existing .pen format) ─────────────────
function textNode(content, opts = {}) {
  return {
    type: "text",
    id: uid("txt"),
    content,
    fontFamily: opts.fontFamily ?? "Inter",
    fontSize: opts.fontSize ?? 14,
    fontWeight: opts.fontWeight ?? "400",
    ...(opts.fill ? { fill: opts.fill } : { fill: "$color.text.primary" }),
    ...(opts.fontStyle ? { fontStyle: opts.fontStyle } : {}),
  };
}

function sectionTitle(t) {
  return textNode(t, { fontSize: 24, fontWeight: "600" });
}

function componentLabel(t) {
  return textNode(t, { fontSize: 12, fontWeight: "500", fill: "$color.text.secondary" });
}

function frame(name, opts = {}) {
  const node = {
    type: "frame",
    id: opts.id ?? uid("frm"),
    name,
  };
  if (opts.width != null) node.width = opts.width;
  if (opts.height != null) node.height = opts.height;
  if (opts.layout) node.layout = opts.layout;
  if (opts.gap != null) node.gap = opts.gap;
  if (opts.padding != null) node.padding = opts.padding;
  if (opts.cornerRadius != null) node.cornerRadius = opts.cornerRadius;
  if (opts.fill) node.fill = opts.fill;
  if (opts.stroke) node.stroke = opts.stroke;
  if (opts.reusable) node.reusable = true;
  if (opts.children) node.children = opts.children;
  return node;
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT 1: Heading (h1–h6)  →  Typography page
// ═══════════════════════════════════════════════════════════════════════
function buildHeadingSection() {
  const levels = [
    { level: 1, label: "h1", fontSize: 48, fontWeight: "700" },
    { level: 2, label: "h2", fontSize: 36, fontWeight: "700" },
    { level: 3, label: "h3", fontSize: 30, fontWeight: "700" },
    { level: 4, label: "h4", fontSize: 24, fontWeight: "700" },
    { level: 5, label: "h5", fontSize: 20, fontWeight: "700" },
    { level: 6, label: "h6", fontSize: 18, fontWeight: "700" },
  ];

  const rows = levels.map(({ level, label, fontSize, fontWeight }) =>
    frame(`heading-${label}`, {
      id: `heading-${label}`,
      width: 1344,
      height: Math.max(fontSize + 20, 44),
      layout: "horizontal",
      gap: 24,
      reusable: true,
      children: [
        componentLabel(`${label} (${fontSize}px)`),
        textNode(`Heading Level ${level}`, { fontSize, fontWeight }),
      ],
    })
  );

  return frame("Heading", {
    width: 1344,
    layout: "vertical",
    gap: 12,
    children: [sectionTitle("Heading"), ...rows],
  });
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT 2: Text (size variants)  →  Typography page
// ═══════════════════════════════════════════════════════════════════════
function buildTextSection() {
  const sizes = [
    { name: "xs", px: 12 },
    { name: "sm", px: 14 },
    { name: "base", px: 16 },
    { name: "lg", px: 18 },
    { name: "xl", px: 20 },
  ];

  const rows = sizes.map(({ name, px }) =>
    frame(`text-${name}`, {
      id: `text-size-${name}`,
      width: 1344,
      height: Math.max(px + 16, 36),
      layout: "horizontal",
      gap: 24,
      reusable: true,
      children: [
        componentLabel(`${name} (${px}px)`),
        textNode("The quick brown fox jumps over the lazy dog", { fontSize: px }),
      ],
    })
  );

  // Color variants row
  const colorVariants = [
    { name: "primary", fill: "$color.text.primary" },
    { name: "secondary", fill: "$color.text.secondary" },
    { name: "tertiary", fill: "$color.text.tertiary" },
    { name: "success", fill: "$color.text.success" },
    { name: "warning", fill: "$color.text.warning" },
    { name: "error", fill: "$color.text.error" },
    { name: "info", fill: "$color.text.info" },
  ];

  const colorRow = frame("text-colors", {
    width: 1344,
    layout: "horizontal",
    gap: 16,
    children: colorVariants.map(({ name, fill }) =>
      textNode(name, { fontSize: 14, fontWeight: "500", fill })
    ),
  });

  return frame("Text", {
    width: 1344,
    layout: "vertical",
    gap: 12,
    children: [sectionTitle("Text"), ...rows, componentLabel("Color Variants"), colorRow],
  });
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT 3: Blockquote  →  Data Display page
// ═══════════════════════════════════════════════════════════════════════
function buildBlockquoteSection() {
  const variants = [
    { name: "default", borderFill: "$color.border.default", textFill: "$color.text.secondary" },
    { name: "accent", borderFill: "$color.interactive.primary", textFill: "$color.text.primary" },
    { name: "success", borderFill: "$color.green.500", textFill: "$color.text.primary" },
    { name: "warning", borderFill: "$color.amber.500", textFill: "$color.text.primary" },
    { name: "error", borderFill: "$color.red.500", textFill: "$color.text.primary" },
  ];

  const examples = variants.map(({ name, borderFill, textFill }) =>
    frame(`blockquote-${name}`, {
      id: `blockquote-${name}`,
      width: 500,
      height: 64,
      layout: "horizontal",
      padding: [16, 12],
      reusable: true,
      stroke: { thickness: 4, fill: borderFill, side: "left" },
      children: [
        textNode(
          name === "default"
            ? "The best way to predict the future is to invent it."
            : name === "accent"
            ? "Design is not just what it looks like. Design is how it works."
            : name === "success"
            ? "Operation completed successfully."
            : name === "warning"
            ? "Please review your changes before proceeding."
            : "An error occurred while processing your request.",
          { fontSize: 16, fontStyle: "italic", fill: textFill }
        ),
      ],
    })
  );

  return frame("Blockquote", {
    width: 1344,
    layout: "vertical",
    gap: 12,
    children: [
      sectionTitle("Blockquote"),
      frame("blockquote-variants", {
        width: 1344,
        layout: "vertical",
        gap: 12,
        children: examples.map((ex, i) => {
          return frame(`blockquote-row-${variants[i].name}`, {
            width: 1344,
            layout: "horizontal",
            gap: 16,
            children: [componentLabel(variants[i].name), ex],
          });
        }),
      }),
    ],
  });
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT 4: Code (inline + block)  →  Data Display page
// ═══════════════════════════════════════════════════════════════════════
function buildCodeSection() {
  // Inline Code
  const inlineCode = frame("code-inline", {
    id: "code-inline",
    width: 120,
    height: 28,
    cornerRadius: 6,
    fill: "$color.background.secondary",
    layout: "horizontal",
    padding: [8, 4],
    reusable: true,
    children: [
      textNode("useState()", { fontSize: 13, fontFamily: "JetBrains Mono", fill: "$color.text.primary" }),
    ],
  });

  const inlineCodeGhost = frame("code-inline-ghost", {
    id: "code-inline-ghost",
    width: 120,
    height: 28,
    layout: "horizontal",
    padding: [8, 4],
    children: [
      textNode("console.log()", { fontSize: 13, fontFamily: "JetBrains Mono", fill: "$color.text.primary" }),
    ],
  });

  // Code Block (default variant)
  const codeBlockDefault = frame("code-block-default", {
    id: "code-block-default",
    width: 480,
    height: 120,
    cornerRadius: 8,
    fill: "$color.background.secondary",
    stroke: { thickness: 1, fill: "$color.border.default" },
    layout: "vertical",
    gap: 0,
    reusable: true,
    children: [
      frame("code-block-header", {
        width: 480,
        height: 28,
        fill: "$color.background.tertiary",
        stroke: { thickness: 1, fill: "$color.border.default" },
        layout: "horizontal",
        padding: [12, 4],
        children: [
          textNode("tsx", { fontSize: 12, fontWeight: "500", fill: "$color.text.secondary" }),
        ],
      }),
      frame("code-block-body", {
        width: 480,
        height: 92,
        layout: "vertical",
        padding: [16, 12],
        gap: 2,
        children: [
          textNode('const greeting = "Hello";', { fontSize: 13, fontFamily: "JetBrains Mono" }),
          textNode("console.log(greeting);", { fontSize: 13, fontFamily: "JetBrains Mono" }),
        ],
      }),
    ],
  });

  // Code Block (dark variant)
  const codeBlockDark = frame("code-block-dark", {
    id: "code-block-dark",
    width: 480,
    height: 100,
    cornerRadius: 8,
    fill: "$color.background.inverse",
    layout: "vertical",
    padding: [16, 12],
    gap: 2,
    reusable: true,
    children: [
      textNode("npm install @js-ds-ui/components", { fontSize: 13, fontFamily: "JetBrains Mono", fill: "$color.text.inverse" }),
      textNode("npm run dev", { fontSize: 13, fontFamily: "JetBrains Mono", fill: "$color.text.inverse" }),
    ],
  });

  return frame("Code", {
    width: 1344,
    layout: "vertical",
    gap: 16,
    children: [
      sectionTitle("Code"),
      componentLabel("Inline Code"),
      frame("code-inline-row", {
        width: 1344,
        layout: "horizontal",
        gap: 16,
        children: [
          componentLabel("default"),
          inlineCode,
          componentLabel("ghost"),
          inlineCodeGhost,
        ],
      }),
      componentLabel("Code Block"),
      frame("code-blocks-row", {
        width: 1344,
        layout: "horizontal",
        gap: 24,
        children: [codeBlockDefault, codeBlockDark],
      }),
    ],
  });
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT 5: Icon (size variants, lucide icon_font)  →  Data Display
// ═══════════════════════════════════════════════════════════════════════
function buildIconSection() {
  const sizes = [
    { name: "xs", px: 16 },
    { name: "sm", px: 20 },
    { name: "md", px: 24 },
    { name: "lg", px: 32 },
    { name: "xl", px: 40 },
  ];

  const sizeExamples = sizes.map(({ name, px }) =>
    frame(`icon-size-${name}`, {
      width: 80,
      height: 60,
      layout: "vertical",
      gap: 4,
      children: [
        componentLabel(`${name} (${px}px)`),
        {
          type: "icon_font",
          id: uid("icon"),
          iconFontName: "search",
          iconFontFamily: "lucide",
          width: px,
          height: px,
          fill: "$color.text.primary",
        },
      ],
    })
  );

  // Color variants
  const colorIcons = [
    { name: "primary", fill: "$color.text.primary", icon: "circle" },
    { name: "secondary", fill: "$color.text.secondary", icon: "info" },
    { name: "accent", fill: "$color.interactive.primary", icon: "star" },
    { name: "success", fill: "$color.text.success", icon: "check-circle" },
    { name: "warning", fill: "$color.text.warning", icon: "alert-triangle" },
    { name: "error", fill: "$color.text.error", icon: "x-circle" },
  ];

  const colorExamples = colorIcons.map(({ name, fill, icon }) =>
    frame(`icon-color-${name}`, {
      width: 80,
      height: 60,
      layout: "vertical",
      gap: 4,
      children: [
        componentLabel(name),
        {
          type: "icon_font",
          id: uid("icon"),
          iconFontName: icon,
          iconFontFamily: "lucide",
          width: 24,
          height: 24,
          fill,
        },
      ],
    })
  );

  return frame("Icon", {
    width: 1344,
    layout: "vertical",
    gap: 12,
    children: [
      sectionTitle("Icon"),
      componentLabel("Sizes"),
      frame("icon-sizes-row", {
        width: 1344,
        layout: "horizontal",
        gap: 24,
        children: sizeExamples,
      }),
      componentLabel("Colors"),
      frame("icon-colors-row", {
        width: 1344,
        layout: "horizontal",
        gap: 24,
        children: colorExamples,
      }),
    ],
  });
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT 6: Image (rounded variants with placeholder fills)
//              → Data Display page
// ═══════════════════════════════════════════════════════════════════════
function buildImageSection() {
  const roundedVariants = [
    { name: "none", radius: 0 },
    { name: "sm", radius: 2 },
    { name: "md", radius: 6 },
    { name: "lg", radius: 8 },
    { name: "xl", radius: 12 },
    { name: "full", radius: 9999 },
  ];

  const examples = roundedVariants.map(({ name, radius }) => {
    const isCircle = name === "full";
    return frame(`image-rounded-${name}`, {
      id: `image-${name}`,
      width: isCircle ? 120 : 180,
      height: 120,
      layout: "vertical",
      gap: 8,
      children: [
        componentLabel(`rounded-${name}`),
        frame(`image-placeholder-${name}`, {
          width: isCircle ? 96 : 160,
          height: isCircle ? 96 : 96,
          cornerRadius: radius,
          fill: "$color.background.tertiary",
          reusable: name === "md",
          layout: "horizontal",
          padding: [0, 0],
          children: [
            {
              type: "icon_font",
              id: uid("icon"),
              iconFontName: "image",
              iconFontFamily: "lucide",
              width: 32,
              height: 32,
              fill: "$color.text.tertiary",
            },
          ],
        }),
      ],
    });
  });

  return frame("Image", {
    width: 1344,
    layout: "vertical",
    gap: 12,
    children: [
      sectionTitle("Image"),
      componentLabel("Rounded Variants"),
      frame("image-variants-row", {
        width: 1344,
        layout: "horizontal",
        gap: 16,
        children: examples,
      }),
    ],
  });
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT 7: Announcement (a11y live region doc frame)
//              → Navigation & Layout page
// ═══════════════════════════════════════════════════════════════════════
function buildAnnouncementSection() {
  // This is a non-visual a11y utility; we represent it as a documentation
  // frame showing how it works.
  const politeExample = frame("announcement-polite", {
    id: "announcement-polite",
    width: 440,
    height: 100,
    cornerRadius: 8,
    fill: "$color.background.secondary",
    stroke: { thickness: 1, fill: "$color.border.default" },
    layout: "vertical",
    padding: [16, 12],
    gap: 8,
    reusable: true,
    children: [
      frame("announcement-polite-header", {
        layout: "horizontal",
        gap: 8,
        children: [
          {
            type: "icon_font",
            id: uid("icon"),
            iconFontName: "volume-2",
            iconFontFamily: "lucide",
            width: 20,
            height: 20,
            fill: "$color.interactive.primary",
          },
          textNode("aria-live=\"polite\"", { fontSize: 14, fontWeight: "600", fontFamily: "JetBrains Mono" }),
        ],
      }),
      textNode("Screen reader announces when idle. Use for non-urgent status updates.", {
        fontSize: 13,
        fill: "$color.text.secondary",
      }),
    ],
  });

  const assertiveExample = frame("announcement-assertive", {
    id: "announcement-assertive",
    width: 440,
    height: 100,
    cornerRadius: 8,
    fill: "$color.background.secondary",
    stroke: { thickness: 1, fill: "$color.border.default" },
    layout: "vertical",
    padding: [16, 12],
    gap: 8,
    reusable: true,
    children: [
      frame("announcement-assertive-header", {
        layout: "horizontal",
        gap: 8,
        children: [
          {
            type: "icon_font",
            id: uid("icon"),
            iconFontName: "alert-circle",
            iconFontFamily: "lucide",
            width: 20,
            height: 20,
            fill: "$color.red.500",
          },
          textNode("aria-live=\"assertive\"", { fontSize: 14, fontWeight: "600", fontFamily: "JetBrains Mono" }),
        ],
      }),
      textNode("Screen reader interrupts immediately. Use for urgent alerts and errors.", {
        fontSize: 13,
        fill: "$color.text.secondary",
      }),
    ],
  });

  return frame("Announcement", {
    width: 1344,
    layout: "vertical",
    gap: 12,
    children: [
      sectionTitle("Announcement"),
      textNode("Visually hidden aria-live region for screen reader announcements.", {
        fontSize: 14,
        fill: "$color.text.secondary",
      }),
      frame("announcement-examples", {
        width: 1344,
        layout: "horizontal",
        gap: 24,
        children: [politeExample, assertiveExample],
      }),
    ],
  });
}

// ═══════════════════════════════════════════════════════════════════════
// Insert sections into their target pages
// ═══════════════════════════════════════════════════════════════════════
const typographyPage = findPage("Typography");
typographyPage.children.push(buildHeadingSection());
typographyPage.children.push(buildTextSection());

const dataDisplayPage = findPage("Data Display");
dataDisplayPage.children.push(buildBlockquoteSection());
dataDisplayPage.children.push(buildCodeSection());
dataDisplayPage.children.push(buildIconSection());
dataDisplayPage.children.push(buildImageSection());

const navLayoutPage = findPage("Navigation & Layout");
navLayoutPage.children.push(buildAnnouncementSection());

// ═══════════════════════════════════════════════════════════════════════
// Write back
// ═══════════════════════════════════════════════════════════════════════
const output = JSON.stringify(pen, null, 2);
JSON.parse(output); // Validate it's valid JSON
writeFileSync(PEN_PATH, output + "\n", "utf-8");

// Report
function countNodes(node) {
  let c = 1;
  if (node.children) for (const ch of node.children) c += countNodes(ch);
  return c;
}

const addedSections = [
  "Heading", "Text", "Blockquote", "Code", "Icon", "Image", "Announcement",
];
console.log(`Successfully added ${addedSections.length} component sections:`);
addedSections.forEach((s) => console.log(`  - ${s}`));
console.log(`Typography page now has ${typographyPage.children.length} children`);
console.log(`Data Display page now has ${dataDisplayPage.children.length} children`);
console.log(`Navigation & Layout page now has ${navLayoutPage.children.length} children`);
console.log(`File size: ${(Buffer.byteLength(output, "utf-8") / 1024).toFixed(1)} KB`);
