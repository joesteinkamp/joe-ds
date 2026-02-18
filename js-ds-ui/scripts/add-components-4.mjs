#!/usr/bin/env node
/**
 * add-components-4.mjs
 * Adds nav, layout & utility component sections to the .pen file.
 *
 * Components handled:
 *   Visual: user-menu, toolbar, scroll-area, aspect-ratio
 *   Doc frames: form, skip-nav, focus-trap
 *
 * Must run AFTER scripts 1–3 (reads whatever state the file is in).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const penPath = resolve(__dirname, "..", "js-ds-ui.pen");

// ── Read .pen ───────────────────────────────────────────────────────
const pen = JSON.parse(readFileSync(penPath, "utf-8"));

// ── ID helpers ──────────────────────────────────────────────────────
let _seq = 40000;
const uid = (prefix) => `${prefix}${++_seq}`;

// ── Node builders (matching assembled .pen format) ──────────────────
function frame(name, opts = {}) {
  const n = { type: "frame", id: uid(opts.idPrefix || "f4-"), name };
  if (opts.reusable) n.reusable = true;
  if (opts.x != null) n.x = opts.x;
  if (opts.y != null) n.y = opts.y;
  if (opts.width != null) n.width = opts.width;
  if (opts.height != null) n.height = opts.height;
  if (opts.fill) n.fill = opts.fill;
  if (opts.cornerRadius != null) n.cornerRadius = opts.cornerRadius;
  if (opts.stroke) n.stroke = opts.stroke;
  if (opts.layout === "vertical") n.layout = "vertical";
  // horizontal is the default in .pen — omit layout
  if (opts.gap != null) n.gap = opts.gap;
  if (opts.padding != null) n.padding = opts.padding;
  if (opts.justifyContent) n.justifyContent = opts.justifyContent;
  if (opts.alignItems) n.alignItems = opts.alignItems;
  n.children = opts.children || [];
  return n;
}

function text(content, opts = {}) {
  return {
    type: "text",
    id: uid(opts.idPrefix || "t4-"),
    fill: opts.fill || "$color.text.primary",
    content,
    fontFamily: opts.fontFamily || "Inter",
    fontSize: opts.fontSize || 14,
    fontWeight: String(opts.fontWeight || 400),
  };
}

function sectionHeader(t) {
  return text(t, { fontSize: 24, fontWeight: 600 });
}

function label(t, opts = {}) {
  return text(t, { fontSize: 12, fontWeight: 500, fill: "$color.text.secondary", ...opts });
}

const stk = (varName, thickness = 1) => ({ thickness, fill: `$${varName}` });

// ── Find page frames by name ────────────────────────────────────────
function findPage(name) {
  const page = pen.children.find((c) => c.name === name);
  if (!page) throw new Error(`Page "${name}" not found in .pen children`);
  return page;
}

// ====================================================================
//  VISUAL COMPONENTS
// ====================================================================

// ── UserMenu ────────────────────────────────────────────────────────
function buildUserMenu() {
  // Avatar trigger
  const avatarTrigger = frame("um-avatar-trigger", {
    idPrefix: "um-",
    width: 40, height: 40, cornerRadius: 9999,
    fill: "$color.background.secondary",
    justifyContent: "center", alignItems: "center",
    children: [
      text("JD", { idPrefix: "um-", fontSize: 14, fontWeight: 600, fill: "$color.text.primary" }),
    ],
  });

  // Dropdown panel
  const separator = frame("um-separator", {
    idPrefix: "um-", width: 208, height: 1,
    fill: "$color.border.default",
  });

  const menuItem = (label, opts = {}) =>
    frame(`um-item-${label.toLowerCase().replace(/\s+/g, "-")}`, {
      idPrefix: "um-",
      width: 208, height: 32, cornerRadius: 4,
      padding: [12, 6],
      children: [
        text(label, {
          idPrefix: "um-",
          fontSize: 14,
          fill: opts.destructive ? "$color.text.error" : "$color.text.primary",
        }),
      ],
    });

  const dropdown = frame("um-dropdown", {
    idPrefix: "um-",
    width: 220, height: 220, cornerRadius: 8,
    fill: "$color.background.primary",
    stroke: stk("color.border.default"),
    layout: "vertical", padding: [6, 6], gap: 2,
    children: [
      // User info header
      frame("um-header", {
        idPrefix: "um-",
        width: 208, height: 44, layout: "vertical", padding: [12, 6], gap: 2,
        children: [
          text("John Doe", { idPrefix: "um-", fontSize: 14, fontWeight: 500 }),
          text("john@example.com", { idPrefix: "um-", fontSize: 12, fill: "$color.text.tertiary" }),
        ],
      }),
      separator,
      menuItem("Profile"),
      menuItem("Settings"),
      menuItem("Billing"),
      frame("um-separator-2", { idPrefix: "um-", width: 208, height: 1, fill: "$color.border.default" }),
      menuItem("Sign out", { destructive: true }),
    ],
  });

  const userMenuComp = frame("user-menu", {
    idPrefix: "um-",
    reusable: true,
    width: 280, height: 280, layout: "vertical", gap: 8,
    children: [avatarTrigger, dropdown],
  });

  return frame("UserMenu", {
    idPrefix: "um-",
    width: 1344, height: 340, layout: "vertical", gap: 12,
    children: [sectionHeader("UserMenu"), userMenuComp],
  });
}

// ── Toolbar ─────────────────────────────────────────────────────────
function buildToolbar() {
  const tbButton = (label) =>
    frame(`tb-btn-${label.toLowerCase()}`, {
      idPrefix: "tb-",
      width: 36, height: 32, cornerRadius: 4,
      fill: "$color.background.primary",
      justifyContent: "center", alignItems: "center",
      children: [text(label, { idPrefix: "tb-", fontSize: 14, fontWeight: 500 })],
    });

  const tbSeparator = () =>
    frame(`tb-sep-${uid("s")}`, {
      idPrefix: "tb-",
      width: 1, height: 24,
      fill: "$color.border.default",
    });

  const toolbarComp = frame("toolbar", {
    idPrefix: "tb-",
    reusable: true,
    width: 360, height: 40, cornerRadius: 6,
    fill: "$color.background.primary",
    stroke: stk("color.border.default"),
    padding: [4, 4], gap: 4,
    children: [
      tbButton("B"),
      tbButton("I"),
      tbButton("U"),
      tbSeparator(),
      tbButton("L"),
      tbButton("C"),
      tbButton("R"),
      tbSeparator(),
      tbButton("1"),
      tbButton("2"),
    ],
  });

  return frame("Toolbar", {
    idPrefix: "tb-",
    width: 1344, height: 100, layout: "vertical", gap: 12,
    children: [sectionHeader("Toolbar"), toolbarComp],
  });
}

// ── ScrollArea ──────────────────────────────────────────────────────
function buildScrollArea() {
  const listItems = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7", "Item 8"].map(
    (lbl) =>
      frame(`sa-item-${lbl.replace(/\s+/g, "-").toLowerCase()}`, {
        idPrefix: "sa-",
        width: 260, height: 36, padding: [12, 8],
        stroke: stk("color.border.default"),
        children: [text(lbl, { idPrefix: "sa-", fontSize: 14 })],
      })
  );

  // Scrollbar track + thumb
  const scrollbar = frame("sa-scrollbar", {
    idPrefix: "sa-",
    width: 8, height: 180,
    fill: "$color.background.secondary",
    cornerRadius: 4,
    children: [
      frame("sa-thumb", {
        idPrefix: "sa-",
        width: 8, height: 60, y: 10,
        cornerRadius: 4,
        fill: "$color.border.default",
      }),
    ],
  });

  const scrollAreaComp = frame("scroll-area", {
    idPrefix: "sa-",
    reusable: true,
    width: 280, height: 200, cornerRadius: 8,
    fill: "$color.background.primary",
    stroke: stk("color.border.default"),
    children: [
      frame("sa-viewport", {
        idPrefix: "sa-",
        width: 268, height: 200, layout: "vertical", gap: 0,
        children: listItems,
      }),
      scrollbar,
    ],
  });

  return frame("ScrollArea", {
    idPrefix: "sa-",
    width: 1344, height: 260, layout: "vertical", gap: 12,
    children: [sectionHeader("ScrollArea"), scrollAreaComp],
  });
}

// ── AspectRatio ─────────────────────────────────────────────────────
function buildAspectRatio() {
  const ratioExample = (label, w, h) =>
    frame(`ar-${label.replace(/[:/]/g, "-")}`, {
      idPrefix: "ar-",
      width: w, height: h, cornerRadius: 8,
      fill: "$color.background.secondary",
      stroke: stk("color.border.default"),
      justifyContent: "center", alignItems: "center",
      children: [text(label, { idPrefix: "ar-", fontSize: 14, fontWeight: 500, fill: "$color.text.secondary" })],
    });

  return frame("AspectRatio", {
    idPrefix: "ar-",
    width: 1344, height: 200, layout: "vertical", gap: 12,
    children: [
      sectionHeader("AspectRatio"),
      frame("ar-examples", {
        idPrefix: "ar-",
        width: 1344, height: 140, gap: 24,
        children: [
          ratioExample("16:9", 256, 144),
          ratioExample("4:3", 192, 144),
          ratioExample("1:1", 144, 144),
        ],
      }),
    ],
  });
}

// ====================================================================
//  DOC FRAMES (utility components — not reusable, just documentation)
// ====================================================================

function docFrame(name, opts) {
  const { idPrefix, title, description, exports, props } = opts;

  const children = [
    text(title, { idPrefix, fontSize: 18, fontWeight: 600 }),
    text(description, { idPrefix, fontSize: 14, fill: "$color.text.secondary" }),
  ];

  if (exports && exports.length > 0) {
    children.push(
      text("Exports", { idPrefix, fontSize: 14, fontWeight: 600, fill: "$color.text.primary" }),
      ...exports.map((e) =>
        text(`  ${e}`, { idPrefix, fontSize: 13, fontFamily: "JetBrains Mono", fill: "$color.text.secondary" })
      )
    );
  }

  if (props && props.length > 0) {
    children.push(
      text("Key Props", { idPrefix, fontSize: 14, fontWeight: 600, fill: "$color.text.primary" }),
      ...props.map((p) =>
        text(`  ${p}`, { idPrefix, fontSize: 13, fontFamily: "JetBrains Mono", fill: "$color.text.secondary" })
      )
    );
  }

  return frame(name, {
    idPrefix,
    width: 600,
    height: 20 + children.length * 24,
    cornerRadius: 8,
    fill: "$color.background.secondary",
    stroke: stk("color.border.default"),
    layout: "vertical",
    padding: [20, 20],
    gap: 8,
    children,
  });
}

// ── Form (doc frame) ────────────────────────────────────────────────
function buildFormDoc() {
  const formDoc = docFrame("form", {
    idPrefix: "fm-",
    title: "Form",
    description:
      "Form wrapper with built-in validation context. Provides useFormContext() for child components to access errors and submission state.",
    exports: ["Form", "FormMessage", "FormSubmit", "useFormContext"],
    props: [
      "onSubmit: (e: FormEvent) => void | Promise<void>",
      "validate: (formData: FormData) => Record<string, string> | null",
    ],
  });

  return frame("Form", {
    idPrefix: "fm-",
    width: 1344, height: 320, layout: "vertical", gap: 12,
    children: [sectionHeader("Form"), formDoc],
  });
}

// ── SkipNav (doc frame) ─────────────────────────────────────────────
function buildSkipNavDoc() {
  const skipNavDoc = docFrame("skip-nav", {
    idPrefix: "sn-",
    title: "SkipNav",
    description:
      "Accessibility utility providing a skip-to-content link that becomes visible on keyboard focus. Consists of SkipNavLink (the focusable anchor) and SkipNavContent (the target landmark).",
    exports: ["SkipNavLink", "SkipNavContent"],
    props: [
      "contentId: string — target element ID (default: 'skip-nav-content')",
      "children: ReactNode — link text (default: 'Skip to main content')",
    ],
  });

  return frame("SkipNav", {
    idPrefix: "sn-",
    width: 1344, height: 280, layout: "vertical", gap: 12,
    children: [sectionHeader("SkipNav"), skipNavDoc],
  });
}

// ── FocusTrap (doc frame) ───────────────────────────────────────────
function buildFocusTrapDoc() {
  const focusTrapDoc = docFrame("focus-trap", {
    idPrefix: "ft-",
    title: "FocusTrap",
    description:
      "Traps keyboard focus within a container. Used inside dialogs, modals, and sheets to keep focus cycling through interactive elements. Supports Escape key handling and return-focus on deactivate.",
    exports: ["FocusTrap"],
    props: [
      "active: boolean — whether the trap is active (default: true)",
      "returnFocusOnDeactivate: boolean — restore focus on close (default: true)",
      "initialFocus: string — CSS selector for initial focus target",
      "clickOutsideDeactivates: boolean — click outside to close",
      "onEscapeKey: () => void — escape key handler",
    ],
  });

  return frame("FocusTrap", {
    idPrefix: "ft-",
    width: 1344, height: 340, layout: "vertical", gap: 12,
    children: [sectionHeader("FocusTrap"), focusTrapDoc],
  });
}

// ====================================================================
//  INSERT INTO PAGES
// ====================================================================

const navPage = findPage("Navigation & Layout");
const dataPage = findPage("Data Display");
const formPage = findPage("Form Controls");

// Navigation & Layout page: user-menu, toolbar, skip-nav, focus-trap
navPage.children.push(buildUserMenu());
navPage.children.push(buildToolbar());
navPage.children.push(buildSkipNavDoc());
navPage.children.push(buildFocusTrapDoc());

// Data Display page: scroll-area, aspect-ratio
dataPage.children.push(buildScrollArea());
dataPage.children.push(buildAspectRatio());

// Form Controls page: form
formPage.children.push(buildFormDoc());

// ── Write back ──────────────────────────────────────────────────────
writeFileSync(penPath, JSON.stringify(pen, null, 2) + "\n");

// ── Summary ─────────────────────────────────────────────────────────
function countNodes(node) {
  let c = 1;
  if (node.children) for (const ch of node.children) c += countNodes(ch);
  return c;
}

const added = [
  buildUserMenu, buildToolbar, buildScrollArea, buildAspectRatio,
  buildFormDoc, buildSkipNavDoc, buildFocusTrapDoc,
];
// Reset seq for counting (we already wrote, this is just for summary)
console.log("add-components-4: Added 7 component sections:");
console.log("  Navigation & Layout: UserMenu, Toolbar, SkipNav, FocusTrap");
console.log("  Data Display: ScrollArea, AspectRatio");
console.log("  Form Controls: Form");
console.log(`  Total .pen children: ${pen.children.length} pages`);
