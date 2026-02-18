#!/usr/bin/env node
/**
 * add-components-3.mjs
 * Adds 7 data & overlay components to the .pen file.
 * Must run AFTER add-components-1.mjs and add-components-2.mjs.
 *
 * Components and target pages:
 *   - command         (command palette)         → Overlays & Feedback
 *   - data-table      (sortable table)          → Data Display
 *   - date-range-picker (calendar range)        → Form Controls
 *   - context-menu    (right-click menu)        → Overlays & Feedback
 *   - confirm-dialog  (destructive confirm)     → Overlays & Feedback
 *   - hover-card      (profile popup)           → Overlays & Feedback
 *   - collapsible     (expandable sections)     → Data Display
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PEN_PATH = resolve(__dirname, "..", "js-ds-ui.pen");

// ── Read .pen ───────────────────────────────────────────────────────
const pen = JSON.parse(readFileSync(PEN_PATH, "utf-8"));

// ── Unique ID counter (30000 range to avoid collisions with other scripts) ──
let _seq = 30000;
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
    id: uid(opts.prefix || "txt"),
    content,
    fontFamily: opts.fontFamily || "Inter",
    fontSize: opts.fontSize || 14,
    fontWeight: opts.fontWeight || "400",
    fill: opts.fill || "$color.text.primary",
  };
}

function sectionTitle(title) {
  return textNode(title, { fontSize: 24, fontWeight: "600" });
}

function componentLabel(label) {
  return textNode(label, { fontSize: 12, fontWeight: "500", fill: "$color.text.secondary" });
}

function frame(name, opts = {}) {
  const node = { type: "frame", id: opts.id || uid(opts.idPrefix || "frm"), name };
  if (opts.reusable) node.reusable = true;
  if (opts.width != null) node.width = opts.width;
  if (opts.height != null) node.height = opts.height;
  if (opts.fill) node.fill = opts.fill;
  if (opts.cornerRadius != null) node.cornerRadius = opts.cornerRadius;
  if (opts.stroke) node.stroke = opts.stroke;
  if (opts.layout) node.layout = opts.layout;
  if (opts.gap != null) node.gap = opts.gap;
  if (opts.padding != null) node.padding = opts.padding;
  if (opts.justifyContent) node.justifyContent = opts.justifyContent;
  if (opts.alignItems) node.alignItems = opts.alignItems;
  if (opts.children) node.children = opts.children;
  return node;
}

function icon(iconName, opts = {}) {
  return {
    type: "icon_font",
    id: uid(opts.idPrefix || "ico"),
    iconFontName: iconName,
    iconFontFamily: "lucide",
    width: opts.width || 20,
    height: opts.height || 20,
    fill: opts.fill || "$color.text.secondary",
  };
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT 1: Command (command palette with search + grouped items)
//              → Overlays & Feedback page
// ═══════════════════════════════════════════════════════════════════════
function buildCommandSection() {
  // Search input row
  const searchRow = frame("cmd-search", {
    idPrefix: "cmd",
    width: 480,
    height: 44,
    layout: "horizontal",
    gap: 8,
    padding: [12, 10],
    alignItems: "center",
    stroke: { thickness: 1, fill: "$color.border.default", side: "bottom" },
    children: [
      icon("search", { idPrefix: "cmd", width: 16, height: 16, fill: "$color.text.tertiary" }),
      textNode("Type a command or search...", {
        prefix: "cmd", fontSize: 14, fill: "$color.text.tertiary",
      }),
    ],
  });

  // Group heading helper
  function groupHeading(label) {
    return textNode(label, {
      prefix: "cmd", fontSize: 12, fontWeight: "500", fill: "$color.text.tertiary",
    });
  }

  // Command item helper
  function cmdItem(iconName, label, shortcut) {
    const children = [
      icon(iconName, { idPrefix: "cmd", width: 16, height: 16, fill: "$color.text.secondary" }),
      textNode(label, { prefix: "cmd", fontSize: 14 }),
    ];
    if (shortcut) {
      children.push(
        textNode(shortcut, {
          prefix: "cmd", fontSize: 12, fill: "$color.text.tertiary",
        })
      );
    }
    return frame(`cmd-item-${label.toLowerCase().replace(/\s+/g, "-")}`, {
      idPrefix: "cmd",
      width: 456,
      height: 36,
      layout: "horizontal",
      gap: 8,
      padding: [8, 6],
      alignItems: "center",
      cornerRadius: 6,
      children,
    });
  }

  // Suggestions group
  const suggestionsGroup = frame("cmd-group-suggestions", {
    idPrefix: "cmd",
    width: 480,
    layout: "vertical",
    gap: 2,
    padding: [4, 4],
    children: [
      groupHeading("Suggestions"),
      cmdItem("calendar", "Calendar", null),
      cmdItem("smile", "Search Emoji", null),
      cmdItem("calculator", "Calculator", null),
    ],
  });

  // Settings group
  const settingsGroup = frame("cmd-group-settings", {
    idPrefix: "cmd",
    width: 480,
    layout: "vertical",
    gap: 2,
    padding: [4, 4],
    children: [
      groupHeading("Settings"),
      cmdItem("user", "Profile", "\u2318P"),
      cmdItem("credit-card", "Billing", "\u2318B"),
      cmdItem("settings", "Settings", "\u2318S"),
    ],
  });

  // Separator
  const separator = frame("cmd-separator", {
    idPrefix: "cmd",
    width: 456,
    height: 1,
    fill: "$color.border.default",
  });

  // Full command palette
  const palette = frame("command", {
    idPrefix: "cmd",
    reusable: true,
    width: 480,
    height: 340,
    fill: "$color.background.primary",
    cornerRadius: 8,
    stroke: { thickness: 1, fill: "$color.border.default" },
    layout: "vertical",
    children: [searchRow, suggestionsGroup, separator, settingsGroup],
  });

  return frame("Command", {
    idPrefix: "cmd",
    width: 1344,
    layout: "vertical",
    gap: 12,
    children: [sectionTitle("Command"), palette],
  });
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT 2: DataTable (sortable table with checkboxes, status badges,
//              pagination)  → Data Display page
// ═══════════════════════════════════════════════════════════════════════
function buildDataTableSection() {
  // Status badge helper
  function statusBadge(label, fillColor, textColor) {
    return frame(`dt-badge-${label.toLowerCase()}`, {
      idPrefix: "dt",
      width: 64,
      height: 24,
      cornerRadius: 12,
      fill: fillColor,
      layout: "horizontal",
      justifyContent: "center",
      alignItems: "center",
      children: [
        textNode(label, { prefix: "dt", fontSize: 12, fontWeight: "500", fill: textColor }),
      ],
    });
  }

  // Checkbox helper
  function checkbox(checked) {
    return frame(`dt-checkbox`, {
      idPrefix: "dt",
      width: 16,
      height: 16,
      cornerRadius: 3,
      stroke: { thickness: 1, fill: checked ? "$color.interactive.primary" : "$color.border.default" },
      fill: checked ? "$color.interactive.primary" : "transparent",
      justifyContent: "center",
      alignItems: "center",
      children: checked
        ? [icon("check", { idPrefix: "dt", width: 12, height: 12, fill: "$color.text.inverse" })]
        : [],
    });
  }

  // Table header cell
  function headerCell(label, width, sortable) {
    const children = [
      textNode(label, { prefix: "dt", fontSize: 14, fontWeight: "600" }),
    ];
    if (sortable) {
      children.push(icon("arrow-up-down", { idPrefix: "dt", width: 14, height: 14, fill: "$color.text.tertiary" }));
    }
    return frame(`dt-hcell-${label.toLowerCase()}`, {
      idPrefix: "dt",
      width,
      height: 44,
      layout: "horizontal",
      gap: 4,
      padding: [12, 10],
      alignItems: "center",
      children,
    });
  }

  // Table data cell
  function dataCell(content, width) {
    return frame(`dt-cell-${typeof content === "string" ? content.toLowerCase().replace(/\s+/g, "-") : "badge"}`, {
      idPrefix: "dt",
      width,
      height: 48,
      layout: "horizontal",
      padding: [12, 12],
      alignItems: "center",
      children: typeof content === "string"
        ? [textNode(content, { prefix: "dt", fontSize: 14, fill: "$color.text.secondary" })]
        : [content],
    });
  }

  // Header row
  const headerRow = frame("dt-header-row", {
    idPrefix: "dt",
    width: 700,
    height: 44,
    fill: "$color.background.secondary",
    layout: "horizontal",
    stroke: { thickness: 1, fill: "$color.border.default" },
    alignItems: "center",
    children: [
      frame("dt-hcell-check", {
        idPrefix: "dt", width: 48, height: 44,
        layout: "horizontal", justifyContent: "center", alignItems: "center",
        children: [checkbox(false)],
      }),
      headerCell("Name", 180, true),
      headerCell("Status", 120, false),
      headerCell("Email", 220, true),
      headerCell("Role", 132, false),
    ],
  });

  // Data rows
  const rows = [
    { name: "Alice Johnson", status: "Active", email: "alice@example.com", role: "Admin", checked: true },
    { name: "Bob Smith", status: "Inactive", email: "bob@example.com", role: "Editor", checked: false },
    { name: "Carol Lee", status: "Active", email: "carol@example.com", role: "Viewer", checked: false },
  ];

  const dataRows = rows.map((row) => {
    const badge = row.status === "Active"
      ? statusBadge("Active", "$color.green.100", "$color.green.700")
      : statusBadge("Inactive", "$color.red.100", "$color.red.700");

    return frame(`dt-row-${row.name.toLowerCase().replace(/\s+/g, "-")}`, {
      idPrefix: "dt",
      width: 700,
      height: 48,
      layout: "horizontal",
      stroke: { thickness: 1, fill: "$color.border.default" },
      alignItems: "center",
      children: [
        frame(`dt-rcell-check-${row.name.split(" ")[0].toLowerCase()}`, {
          idPrefix: "dt", width: 48, height: 48,
          layout: "horizontal", justifyContent: "center", alignItems: "center",
          children: [checkbox(row.checked)],
        }),
        dataCell(row.name, 180),
        dataCell(badge, 120),
        dataCell(row.email, 220),
        dataCell(row.role, 132),
      ],
    });
  });

  // Pagination bar
  const pagination = frame("dt-pagination", {
    idPrefix: "dt",
    width: 700,
    height: 40,
    layout: "horizontal",
    padding: [8, 8],
    justifyContent: "end",
    alignItems: "center",
    gap: 8,
    children: [
      textNode("1 of 3 row(s) selected.", {
        prefix: "dt", fontSize: 13, fill: "$color.text.tertiary",
      }),
      textNode("Page 1 of 1", {
        prefix: "dt", fontSize: 13, fill: "$color.text.tertiary",
      }),
      frame("dt-btn-prev", {
        idPrefix: "dt",
        width: 72,
        height: 28,
        cornerRadius: 6,
        stroke: { thickness: 1, fill: "$color.border.default" },
        layout: "horizontal",
        justifyContent: "center",
        alignItems: "center",
        children: [textNode("Previous", { prefix: "dt", fontSize: 13 })],
      }),
      frame("dt-btn-next", {
        idPrefix: "dt",
        width: 56,
        height: 28,
        cornerRadius: 6,
        stroke: { thickness: 1, fill: "$color.border.default" },
        layout: "horizontal",
        justifyContent: "center",
        alignItems: "center",
        children: [textNode("Next", { prefix: "dt", fontSize: 13 })],
      }),
    ],
  });

  // Full data table
  const table = frame("data-table", {
    idPrefix: "dt",
    reusable: true,
    width: 700,
    cornerRadius: 8,
    stroke: { thickness: 1, fill: "$color.border.default" },
    layout: "vertical",
    children: [headerRow, ...dataRows, pagination],
  });

  return frame("DataTable", {
    idPrefix: "dt",
    width: 1344,
    layout: "vertical",
    gap: 12,
    children: [sectionTitle("DataTable"), table],
  });
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT 3: DateRangePicker (calendar trigger + range selection)
//              → Form Controls page
// ═══════════════════════════════════════════════════════════════════════
function buildDateRangePickerSection() {
  // Trigger button
  const trigger = frame("drp-trigger", {
    idPrefix: "drp",
    reusable: true,
    width: 320,
    height: 40,
    cornerRadius: 6,
    stroke: { thickness: 1, fill: "$color.border.default" },
    fill: "$color.background.primary",
    layout: "horizontal",
    gap: 8,
    padding: [12, 8],
    alignItems: "center",
    children: [
      icon("calendar", { idPrefix: "drp", width: 16, height: 16, fill: "$color.text.tertiary" }),
      textNode("Jan 15, 2025", { prefix: "drp", fontSize: 14 }),
      textNode("\u2013", { prefix: "drp", fontSize: 14, fill: "$color.text.tertiary" }),
      textNode("Feb 20, 2025", { prefix: "drp", fontSize: 14 }),
    ],
  });

  // Day headers
  const dayHeaders = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) =>
    textNode(d, { prefix: "drp", fontSize: 12, fontWeight: "500", fill: "$color.text.tertiary" })
  );

  // Sample days grid row (week showing range)
  function dayCell(num, state) {
    const fill = state === "selected"
      ? "$color.interactive.primary"
      : state === "range"
        ? "$color.blue.100"
        : "transparent";
    const textFill = state === "selected"
      ? "$color.text.inverse"
      : "$color.text.primary";
    return frame(`drp-day-${num}`, {
      idPrefix: "drp",
      width: 32,
      height: 32,
      cornerRadius: state === "selected" ? 16 : 4,
      fill,
      justifyContent: "center",
      alignItems: "center",
      children: [textNode(String(num), { prefix: "drp", fontSize: 14, fill: textFill })],
    });
  }

  const week1 = frame("drp-week-1", {
    idPrefix: "drp",
    layout: "horizontal",
    gap: 4,
    children: [
      dayCell(12, "normal"), dayCell(13, "normal"), dayCell(14, "normal"),
      dayCell(15, "selected"), dayCell(16, "range"), dayCell(17, "range"),
      dayCell(18, "range"),
    ],
  });

  const week2 = frame("drp-week-2", {
    idPrefix: "drp",
    layout: "horizontal",
    gap: 4,
    children: [
      dayCell(19, "range"), dayCell(20, "selected"), dayCell(21, "normal"),
      dayCell(22, "normal"), dayCell(23, "normal"), dayCell(24, "normal"),
      dayCell(25, "normal"),
    ],
  });

  // Calendar dropdown panel
  const calendarPanel = frame("drp-calendar", {
    idPrefix: "drp",
    width: 280,
    cornerRadius: 8,
    stroke: { thickness: 1, fill: "$color.border.default" },
    fill: "$color.background.primary",
    layout: "vertical",
    gap: 8,
    padding: 16,
    children: [
      // Month nav header
      frame("drp-month-nav", {
        idPrefix: "drp",
        layout: "horizontal",
        gap: 8,
        alignItems: "center",
        justifyContent: "center",
        children: [
          icon("chevron-left", { idPrefix: "drp", width: 16, height: 16 }),
          textNode("January 2025", { prefix: "drp", fontSize: 14, fontWeight: "600" }),
          icon("chevron-right", { idPrefix: "drp", width: 16, height: 16 }),
        ],
      }),
      // Day header row
      frame("drp-day-headers", {
        idPrefix: "drp",
        layout: "horizontal",
        gap: 4,
        children: dayHeaders,
      }),
      week1,
      week2,
      // Selection hint
      textNode("Select end date", { prefix: "drp", fontSize: 12, fill: "$color.text.tertiary" }),
    ],
  });

  return frame("DateRangePicker", {
    idPrefix: "drp",
    width: 1344,
    layout: "vertical",
    gap: 12,
    children: [
      sectionTitle("DateRangePicker"),
      componentLabel("Trigger"),
      trigger,
      componentLabel("Calendar Panel"),
      calendarPanel,
    ],
  });
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT 4: ContextMenu (right-click menu with items, separators,
//              submenu arrow)  → Overlays & Feedback page
// ═══════════════════════════════════════════════════════════════════════
function buildContextMenuSection() {
  // Menu item helper
  function menuItem(label, shortcut, opts = {}) {
    const children = [
      textNode(label, { prefix: "ctx", fontSize: 14 }),
    ];
    if (shortcut) {
      children.push(textNode(shortcut, { prefix: "ctx", fontSize: 12, fill: "$color.text.tertiary" }));
    }
    if (opts.hasSubmenu) {
      children.push(icon("chevron-right", { idPrefix: "ctx", width: 14, height: 14 }));
    }
    return frame(`ctx-item-${label.toLowerCase().replace(/\s+/g, "-")}`, {
      idPrefix: "ctx",
      width: 200,
      height: 32,
      layout: "horizontal",
      gap: 8,
      padding: [8, 6],
      alignItems: "center",
      cornerRadius: 4,
      children,
    });
  }

  // Separator
  function menuSeparator() {
    return frame("ctx-sep", {
      idPrefix: "ctx",
      width: 184,
      height: 1,
      fill: "$color.border.default",
    });
  }

  // Context menu panel
  const menu = frame("context-menu", {
    idPrefix: "ctx",
    reusable: true,
    width: 200,
    cornerRadius: 6,
    stroke: { thickness: 1, fill: "$color.border.default" },
    fill: "$color.background.primary",
    layout: "vertical",
    gap: 2,
    padding: 4,
    children: [
      menuItem("Back", "\u2318["),
      menuItem("Forward", "\u2318]"),
      menuItem("Reload", "\u2318R"),
      menuSeparator(),
      menuItem("More Tools", null, { hasSubmenu: true }),
      menuSeparator(),
      menuItem("Show Bookmarks Bar", "\u2318\u21E7B"),
      menuItem("Show Full URLs", null),
    ],
  });

  // Trigger area showing right-click zone
  const triggerArea = frame("ctx-trigger-area", {
    idPrefix: "ctx",
    width: 300,
    height: 80,
    cornerRadius: 8,
    fill: "$color.background.secondary",
    stroke: { thickness: 1, fill: "$color.border.default", style: "dashed" },
    justifyContent: "center",
    alignItems: "center",
    children: [
      textNode("Right-click here", { prefix: "ctx", fontSize: 14, fill: "$color.text.tertiary" }),
    ],
  });

  return frame("ContextMenu", {
    idPrefix: "ctx",
    width: 1344,
    layout: "vertical",
    gap: 12,
    children: [
      sectionTitle("ContextMenu"),
      frame("ctx-example-row", {
        idPrefix: "ctx",
        width: 1344,
        layout: "horizontal",
        gap: 24,
        children: [triggerArea, menu],
      }),
    ],
  });
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT 5: ConfirmDialog (destructive confirmation with Cancel + red
//              Delete button)  → Overlays & Feedback page
// ═══════════════════════════════════════════════════════════════════════
function buildConfirmDialogSection() {
  const dialog = frame("confirm-dialog", {
    idPrefix: "cdlg",
    reusable: true,
    width: 440,
    height: 200,
    fill: "$color.background.primary",
    cornerRadius: "$component.dialog.border-radius",
    stroke: { thickness: 1, fill: "$color.border.default" },
    layout: "vertical",
    gap: 12,
    padding: "$component.dialog.padding",
    children: [
      // Title
      textNode("Are you sure?", {
        prefix: "cdlg", fontSize: 18, fontWeight: "600",
      }),
      // Description
      textNode("This action cannot be undone. This will permanently delete your account and remove your data from our servers.", {
        prefix: "cdlg", fontSize: 14, fill: "$color.text.secondary",
      }),
      // Action buttons
      frame("cdlg-actions", {
        idPrefix: "cdlg",
        layout: "horizontal",
        gap: 8,
        justifyContent: "end",
        alignItems: "center",
        children: [
          // Cancel button
          frame("cdlg-cancel-btn", {
            idPrefix: "cdlg",
            width: 80,
            height: 36,
            cornerRadius: 6,
            stroke: { thickness: 1, fill: "$color.border.default" },
            fill: "$color.background.primary",
            layout: "horizontal",
            justifyContent: "center",
            alignItems: "center",
            children: [
              textNode("Cancel", { prefix: "cdlg", fontSize: 14, fontWeight: "500" }),
            ],
          }),
          // Delete button (destructive)
          frame("cdlg-delete-btn", {
            idPrefix: "cdlg",
            width: 80,
            height: 36,
            cornerRadius: 6,
            fill: "$color.semantic.error",
            layout: "horizontal",
            justifyContent: "center",
            alignItems: "center",
            children: [
              textNode("Delete", {
                prefix: "cdlg", fontSize: 14, fontWeight: "500", fill: "$color.text.inverse",
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // Wrap in overlay to show context
  const overlay = frame("cdlg-overlay", {
    idPrefix: "cdlg",
    width: 600,
    height: 280,
    fill: "$color.background.overlay",
    justifyContent: "center",
    alignItems: "center",
    children: [dialog],
  });

  return frame("ConfirmDialog", {
    idPrefix: "cdlg",
    width: 1344,
    layout: "vertical",
    gap: 12,
    children: [sectionTitle("ConfirmDialog"), overlay],
  });
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT 6: HoverCard (user profile popup with avatar, bio, stats)
//              → Overlays & Feedback page
// ═══════════════════════════════════════════════════════════════════════
function buildHoverCardSection() {
  // Avatar circle
  const avatar = frame("hc-avatar", {
    idPrefix: "hc",
    width: 40,
    height: 40,
    cornerRadius: 20,
    fill: "$color.interactive.primary",
    justifyContent: "center",
    alignItems: "center",
    children: [
      textNode("JD", { prefix: "hc", fontSize: 16, fontWeight: "600", fill: "$color.text.inverse" }),
    ],
  });

  // Stat helper
  function stat(value, label) {
    return frame(`hc-stat-${label.toLowerCase()}`, {
      idPrefix: "hc",
      layout: "horizontal",
      gap: 4,
      children: [
        textNode(value, { prefix: "hc", fontSize: 14, fontWeight: "600" }),
        textNode(label, { prefix: "hc", fontSize: 14, fill: "$color.text.tertiary" }),
      ],
    });
  }

  const card = frame("hover-card", {
    idPrefix: "hc",
    reusable: true,
    width: 300,
    cornerRadius: 8,
    stroke: { thickness: 1, fill: "$color.border.default" },
    fill: "$color.background.primary",
    layout: "vertical",
    gap: 12,
    padding: 16,
    children: [
      // Header with avatar and name
      frame("hc-header", {
        idPrefix: "hc",
        layout: "horizontal",
        gap: 12,
        alignItems: "center",
        children: [
          avatar,
          frame("hc-name-col", {
            idPrefix: "hc",
            layout: "vertical",
            gap: 2,
            children: [
              textNode("@johndoe", { prefix: "hc", fontSize: 14, fontWeight: "600" }),
              textNode("John Doe", { prefix: "hc", fontSize: 13, fill: "$color.text.secondary" }),
            ],
          }),
        ],
      }),
      // Bio
      textNode("Design engineer working on UI components. Open source enthusiast and coffee addict.", {
        prefix: "hc", fontSize: 14, fill: "$color.text.secondary",
      }),
      // Stats row
      frame("hc-stats", {
        idPrefix: "hc",
        layout: "horizontal",
        gap: 16,
        children: [
          stat("42", "Following"),
          stat("1.2k", "Followers"),
        ],
      }),
      // Joined date
      frame("hc-joined", {
        idPrefix: "hc",
        layout: "horizontal",
        gap: 6,
        alignItems: "center",
        children: [
          icon("calendar", { idPrefix: "hc", width: 14, height: 14, fill: "$color.text.tertiary" }),
          textNode("Joined December 2021", { prefix: "hc", fontSize: 12, fill: "$color.text.tertiary" }),
        ],
      }),
    ],
  });

  // Trigger link showing hover target
  const trigger = frame("hc-trigger", {
    idPrefix: "hc",
    layout: "horizontal",
    gap: 4,
    children: [
      textNode("@johndoe", {
        prefix: "hc", fontSize: 14, fontWeight: "500", fill: "$color.interactive.primary",
      }),
    ],
  });

  return frame("HoverCard", {
    idPrefix: "hc",
    width: 1344,
    layout: "vertical",
    gap: 12,
    children: [
      sectionTitle("HoverCard"),
      componentLabel("Trigger"),
      trigger,
      componentLabel("Card"),
      card,
    ],
  });
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT 7: Collapsible (expandable sections with chevron)
//              → Data Display page
// ═══════════════════════════════════════════════════════════════════════
function buildCollapsibleSection() {
  // Expanded collapsible
  const expandedCollapsible = frame("collapsible-expanded", {
    idPrefix: "coll",
    reusable: true,
    width: 350,
    cornerRadius: 8,
    stroke: { thickness: 1, fill: "$color.border.default" },
    layout: "vertical",
    children: [
      // Header / trigger
      frame("coll-trigger-expanded", {
        idPrefix: "coll",
        width: 350,
        height: 44,
        layout: "horizontal",
        gap: 8,
        padding: [12, 10],
        alignItems: "center",
        children: [
          icon("chevron-down", { idPrefix: "coll", width: 16, height: 16 }),
          textNode("3 items tagged", { prefix: "coll", fontSize: 14, fontWeight: "600" }),
        ],
      }),
      // Visible item always shown
      frame("coll-item-always", {
        idPrefix: "coll",
        width: 350,
        height: 40,
        padding: [12, 8],
        stroke: { thickness: 1, fill: "$color.border.default" },
        alignItems: "center",
        children: [
          textNode("@radix-ui/primitives", { prefix: "coll", fontSize: 14 }),
        ],
      }),
      // Revealed items
      frame("coll-item-2", {
        idPrefix: "coll",
        width: 350,
        height: 40,
        padding: [12, 8],
        stroke: { thickness: 1, fill: "$color.border.default" },
        alignItems: "center",
        children: [
          textNode("@radix-ui/colors", { prefix: "coll", fontSize: 14 }),
        ],
      }),
      frame("coll-item-3", {
        idPrefix: "coll",
        width: 350,
        height: 40,
        padding: [12, 8],
        stroke: { thickness: 1, fill: "$color.border.default" },
        alignItems: "center",
        children: [
          textNode("@stitches/react", { prefix: "coll", fontSize: 14 }),
        ],
      }),
    ],
  });

  // Collapsed collapsible
  const collapsedCollapsible = frame("collapsible-collapsed", {
    idPrefix: "coll",
    reusable: true,
    width: 350,
    cornerRadius: 8,
    stroke: { thickness: 1, fill: "$color.border.default" },
    layout: "vertical",
    children: [
      frame("coll-trigger-collapsed", {
        idPrefix: "coll",
        width: 350,
        height: 44,
        layout: "horizontal",
        gap: 8,
        padding: [12, 10],
        alignItems: "center",
        children: [
          icon("chevron-right", { idPrefix: "coll", width: 16, height: 16 }),
          textNode("3 items tagged", { prefix: "coll", fontSize: 14, fontWeight: "600" }),
        ],
      }),
      frame("coll-item-always-collapsed", {
        idPrefix: "coll",
        width: 350,
        height: 40,
        padding: [12, 8],
        stroke: { thickness: 1, fill: "$color.border.default" },
        alignItems: "center",
        children: [
          textNode("@radix-ui/primitives", { prefix: "coll", fontSize: 14 }),
        ],
      }),
    ],
  });

  return frame("Collapsible", {
    idPrefix: "coll",
    width: 1344,
    layout: "vertical",
    gap: 12,
    children: [
      sectionTitle("Collapsible"),
      frame("coll-variants-row", {
        idPrefix: "coll",
        width: 1344,
        layout: "horizontal",
        gap: 24,
        children: [
          frame("coll-expanded-col", {
            idPrefix: "coll",
            layout: "vertical",
            gap: 8,
            children: [componentLabel("Expanded"), expandedCollapsible],
          }),
          frame("coll-collapsed-col", {
            idPrefix: "coll",
            layout: "vertical",
            gap: 8,
            children: [componentLabel("Collapsed"), collapsedCollapsible],
          }),
        ],
      }),
    ],
  });
}

// ═══════════════════════════════════════════════════════════════════════
// Insert sections into their target pages
// ═══════════════════════════════════════════════════════════════════════
const overlaysPage = findPage("Overlays & Feedback");
overlaysPage.children.push(buildCommandSection());
overlaysPage.children.push(buildContextMenuSection());
overlaysPage.children.push(buildConfirmDialogSection());
overlaysPage.children.push(buildHoverCardSection());

const dataDisplayPage = findPage("Data Display");
dataDisplayPage.children.push(buildDataTableSection());
dataDisplayPage.children.push(buildCollapsibleSection());

const formControlsPage = findPage("Form Controls");
formControlsPage.children.push(buildDateRangePickerSection());

// ═══════════════════════════════════════════════════════════════════════
// Write back
// ═══════════════════════════════════════════════════════════════════════
const output = JSON.stringify(pen, null, 2);
JSON.parse(output); // Validate it's valid JSON before writing
writeFileSync(PEN_PATH, output + "\n", "utf-8");

// Report
const addedSections = [
  "Command", "ContextMenu", "ConfirmDialog", "HoverCard",
  "DataTable", "Collapsible", "DateRangePicker",
];
console.log(`Successfully added ${addedSections.length} component sections:`);
addedSections.forEach((s) => console.log(`  - ${s}`));
console.log(`Overlays & Feedback page now has ${overlaysPage.children.length} children`);
console.log(`Data Display page now has ${dataDisplayPage.children.length} children`);
console.log(`Form Controls page now has ${formControlsPage.children.length} children`);
console.log(`File size: ${(Buffer.byteLength(output, "utf-8") / 1024).toFixed(1)} KB`);
