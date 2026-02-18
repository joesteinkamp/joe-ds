import fs from "fs";
import path from "path";

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

const ROOT = path.resolve(process.cwd(), "..", "js-ds-ui");

const TOKEN_PATHS = [
  "packages/tokens/src/primitives/spacing.json",
  "packages/tokens/src/primitives/sizing.json",
  "packages/tokens/src/primitives/typography.json",
  "packages/tokens/src/semantic/spacing.json",
  "packages/tokens/src/component/button.json",
];

const THEME_PATHS = {
  light: "themes/light.json",
  dark: "themes/dark.json",
  "high-contrast": "themes/high-contrast.json",
};

const REFERENCE_PATTERN = /\{([^}]+)\}/g;

function readJson(filePath: string): JsonObject {
  const json = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(json) as JsonObject;
}

function toVarName(pathParts: string[]) {
  return pathParts.join("-").replace(/\s+/g, "-").toLowerCase();
}

function normalizeValue(value: JsonValue): string {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        const str = String(item);
        return /\s/.test(str) ? `"${str}"` : str;
      })
      .join(", ");
  }
  return String(value);
}

function replaceReferences(value: string) {
  return value.replace(REFERENCE_PATTERN, (_, reference) => {
    const parts = String(reference).split(".");
    return `var(--${toVarName(parts)})`;
  });
}

function collectTokens(
  node: JsonValue,
  pathParts: string[],
  output: Record<string, string>
) {
  if (!node || typeof node !== "object") return;

  if ("$value" in (node as JsonObject)) {
    const raw = normalizeValue((node as JsonObject)["$value"] as JsonValue);
    output[`--${toVarName(pathParts)}`] = replaceReferences(raw);
    return;
  }

  Object.entries(node as JsonObject).forEach(([key, value]) => {
    if (key.startsWith("$")) return;
    collectTokens(value, [...pathParts, key], output);
  });
}

function buildTokenCss() {
  const vars: Record<string, string> = {};

  TOKEN_PATHS.forEach((relativePath) => {
    const fullPath = path.join(ROOT, relativePath);
    const data = readJson(fullPath);
    collectTokens(data, [], vars);
  });

  const lines = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .sort();

  return `:root {\n  --density-multiplier: 1;\n${lines.join("\n")}\n}`;
}

function buildThemeCss(themeName: string, themeData: JsonObject) {
  const vars: Record<string, string> = {};
  if ("color" in themeData) {
    collectTokens(themeData.color, ["color"], vars);
  }

  const lines = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .sort();

  const selector = themeName === "light" ? ":root, [data-theme=\"light\"]" : `[data-theme="${themeName}"]`;
  return `${selector} {\n${lines.join("\n")}\n}`;
}

export function getDocsTokenCss(): string {
  const themeCss = Object.entries(THEME_PATHS)
    .map(([name, relativePath]) => {
      const data = readJson(path.join(ROOT, relativePath));
      return buildThemeCss(name, data);
    })
    .join("\n\n");

  const densityCss = `[data-density="compact"] { --density-multiplier: 0.85; }\n[data-density="comfortable"] { --density-multiplier: 1.15; }`;

  return `${buildTokenCss()}\n\n${densityCss}\n\n${themeCss}`;
}
