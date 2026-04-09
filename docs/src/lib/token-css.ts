import fs from "fs";
import path from "path";

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

const ROOT = path.resolve(process.cwd(), "..", "js-ds-ui");
const TOKENS_SRC = path.join(ROOT, "packages", "tokens", "src");

const REFERENCE_PATTERN = /\{([^}]+)\}/g;

function readJson(filePath: string): JsonObject {
  const json = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(json) as JsonObject;
}

function readAllTokenFiles(dirPath: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...readAllTokenFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(fullPath);
    }
  }
  return files.sort();
}

function toVarName(pathParts: string[]) {
  return pathParts.join("-").replace(/\s+/g, "-").toLowerCase();
}

function normalizeValue(value: JsonValue): string {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return JSON.stringify(value);
  }
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
  output: Record<string, string>,
  themedOutput: Record<string, Record<string, string>>
) {
  if (!node || typeof node !== "object") return;

  if ("$value" in (node as JsonObject)) {
    const tokenNode = node as JsonObject;
    const varName = `--${toVarName(pathParts)}`;
    const raw = normalizeValue(tokenNode["$value"] as JsonValue);
    output[varName] = replaceReferences(raw);

    const extensions = tokenNode["$extensions"] as JsonObject | undefined;
    const themeExtensions = extensions?.["theme"] as JsonObject | undefined;
    if (themeExtensions && typeof themeExtensions === "object") {
      for (const [themeName, value] of Object.entries(themeExtensions)) {
        if (!themedOutput[themeName]) {
          themedOutput[themeName] = {};
        }
        themedOutput[themeName][varName] = replaceReferences(
          normalizeValue(value)
        );
      }
    }
    return;
  }

  Object.entries(node as JsonObject).forEach(([key, value]) => {
    if (key.startsWith("$")) return;
    collectTokens(value, [...pathParts, key], output, themedOutput);
  });
}

function buildTokenCss() {
  const vars: Record<string, string> = {};
  const themeVars: Record<string, Record<string, string>> = {};

  readAllTokenFiles(TOKENS_SRC).forEach((fullPath) => {
    collectTokens(readJson(fullPath), [], vars, themeVars);
  });

  const lines = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .sort();

  const rootCss = `:root {\n  --density-multiplier: 1;\n${lines.join("\n")}\n}`;
  const themeCss = Object.entries(themeVars)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([themeName, values]) => {
      const selector =
        themeName === "light"
          ? ":root, [data-theme=\"light\"]"
          : `[data-theme="${themeName}"]`;
      const themeLines = Object.entries(values)
        .map(([key, value]) => `  ${key}: ${value};`)
        .sort();
      return `${selector} {\n${themeLines.join("\n")}\n}`;
    })
    .join("\n\n");

  return `${rootCss}\n\n${themeCss}`;
}

export function getDocsTokenCss(): string {
  const densityCss = `[data-density="compact"] { --density-multiplier: 0.85; }\n[data-density="comfortable"] { --density-multiplier: 1.15; }`;

  return `${buildTokenCss()}\n\n${densityCss}`;
}
