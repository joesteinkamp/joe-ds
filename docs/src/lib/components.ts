import fs from "fs";
import path from "path";

const COMPONENTS_DIR = path.resolve(
  process.cwd(),
  "..",
  "js-ds-ui",
  "packages",
  "components",
  "src",
  "ui"
);

export interface ComponentItem {
  slug: string;
  name: string;
}

function toTitleCase(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getComponentList(): ComponentItem[] {
  const files = fs.readdirSync(COMPONENTS_DIR);
  return files
    .filter((file) => file.endsWith(".tsx") && !file.endsWith(".test.tsx"))
    .map((file) => file.replace(".tsx", ""))
    .map((slug) => ({ slug, name: toTitleCase(slug) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getComponentBySlug(slug: string): ComponentItem | null {
  const components = getComponentList();
  return components.find((component) => component.slug === slug) ?? null;
}
