import fs from "fs";
import path from "path";

const TOKENS_ROOT = path.resolve(
  process.cwd(),
  "..",
  "js-ds-ui",
  "packages",
  "tokens",
  "src"
);

const PRIMITIVE_COLORS_PATH = path.join(TOKENS_ROOT, "primitives", "colors.json");
const SEMANTIC_COLORS_PATH = path.join(TOKENS_ROOT, "semantic", "colors.json");
const THEMES = ["light", "dark", "high-contrast"] as const;

type TokenNode = {
  $value?: string;
  $extensions?: {
    theme?: Record<string, string>;
  };
  [key: string]: unknown;
};

function flattenTokenValues(
  node: TokenNode,
  prefix: string[] = [],
  result: Record<string, string> = {}
) {
  if (node && typeof node === "object" && "$value" in node) {
    result[prefix.join(".")] = String(node.$value);
    return result;
  }

  Object.entries(node || {}).forEach(([key, value]) => {
    if (key.startsWith("$")) return;
    flattenTokenValues(value as TokenNode, [...prefix, key], result);
  });

  return result;
}

function flattenSemanticColorTokens(
  node: TokenNode,
  prefix: string[] = [],
  result: Record<string, { light: string; themed: Record<string, string> }> = {}
) {
  if (node && typeof node === "object" && "$value" in node) {
    result[prefix.join(".")] = {
      light: String(node.$value),
      themed: node.$extensions?.theme ?? {},
    };
    return result;
  }

  Object.entries(node || {}).forEach(([key, value]) => {
    if (key.startsWith("$")) return;
    flattenSemanticColorTokens(value as TokenNode, [...prefix, key], result);
  });

  return result;
}

function resolveReference(
  value: string,
  primitiveValues: Record<string, string>,
  visited: Set<string> = new Set()
): string {
  const match = value.match(/^\{([^}]+)\}$/);
  if (!match) return value;
  const ref = match[1];
  if (visited.has(ref)) return value;
  const resolved = primitiveValues[ref];
  if (!resolved) return value;
  visited.add(ref);
  return resolveReference(resolved, primitiveValues, visited);
}

export default function TokenSwatches() {
  const primitiveData = JSON.parse(
    fs.readFileSync(PRIMITIVE_COLORS_PATH, "utf-8")
  ) as { color?: TokenNode };
  const semanticData = JSON.parse(
    fs.readFileSync(SEMANTIC_COLORS_PATH, "utf-8")
  ) as { color?: TokenNode };

  const primitiveValues = flattenTokenValues(primitiveData.color ?? {});
  const semanticTokens = flattenSemanticColorTokens(semanticData.color ?? {});

  const themeSwatches = THEMES.map((theme) => {
    const colors = Object.entries(semanticTokens).map(([name, token]) => {
      const raw = theme === "light" ? token.light : token.themed[theme] ?? token.light;
      const resolved = resolveReference(raw, primitiveValues);
      return { name, value: resolved };
    });
    return { theme, colors };
  });

  return (
    <div className="docs-demo-grid">
      {themeSwatches.map(({ theme, colors }) => (
        <div key={theme} className="docs-section">
          <h3 className="docs-h3">{theme}</h3>
          <div className="docs-swatch-grid">
            {colors.map(({ name, value }) => (
              <div key={`${theme}-${name}`} className="docs-swatch">
                <div className="docs-swatch-color" style={{ background: value }} />
                <div className="docs-swatch-label">{name}</div>
                <div className="docs-swatch-label">{value}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
