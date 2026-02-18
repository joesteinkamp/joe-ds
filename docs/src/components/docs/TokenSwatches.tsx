import fs from "fs";
import path from "path";

const THEME_PATH = path.resolve(
  process.cwd(),
  "..",
  "js-ds-ui",
  "themes",
  "light.json"
);

type ThemeValue = {
  $value?: string;
  [key: string]: any;
};

function flattenTheme(node: ThemeValue, prefix: string[] = [], result: Record<string, string> = {}) {
  if (node && typeof node === "object" && "$value" in node) {
    result[prefix.join("-")] = String(node.$value);
    return result;
  }

  Object.entries(node || {}).forEach(([key, value]) => {
    if (key.startsWith("$")) return;
    flattenTheme(value as ThemeValue, [...prefix, key], result);
  });

  return result;
}

export default function TokenSwatches() {
  const data = JSON.parse(fs.readFileSync(THEME_PATH, "utf-8"));
  const colors = flattenTheme(data.color || {});

  return (
    <div className="docs-swatch-grid">
      {Object.entries(colors).map(([name, value]) => (
        <div key={name} className="docs-swatch">
          <div className="docs-swatch-color" style={{ background: value }} />
          <div className="docs-swatch-label">{name}</div>
          <div className="docs-swatch-label">{value}</div>
        </div>
      ))}
    </div>
  );
}
