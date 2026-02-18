import fs from "fs";
import path from "path";

const MANIFEST_PATH = path.resolve(
  process.cwd(),
  "..",
  "js-ds-ui",
  "metadata",
  "component-manifest.json"
);

const EXAMPLES_PATH = path.resolve(
  process.cwd(),
  "..",
  "js-ds-ui",
  "metadata",
  "usage-examples.json"
);

type Manifest = {
  components: Record<string, any>;
  patterns?: Record<string, any>;
};

type Examples = {
  examples: Record<string, any>;
};

let manifestCache: Manifest | null = null;
let examplesCache: Examples | null = null;

export function getComponentManifest(): Manifest {
  if (!manifestCache) {
    const json = fs.readFileSync(MANIFEST_PATH, "utf-8");
    manifestCache = JSON.parse(json) as Manifest;
  }
  return manifestCache;
}

export function getUsageExamples(): Examples {
  if (!examplesCache) {
    const json = fs.readFileSync(EXAMPLES_PATH, "utf-8");
    examplesCache = JSON.parse(json) as Examples;
  }
  return examplesCache;
}

export function getManifestEntry(slug: string) {
  const manifest = getComponentManifest();
  return manifest.components?.[slug] ?? null;
}

export function getExamplesForComponent(componentName: string) {
  const examples = getUsageExamples().examples ?? {};
  return Object.values(examples).filter((example: any) => {
    if (example?.solution?.component) {
      return example.solution.component === componentName;
    }
    if (Array.isArray(example?.solution?.components)) {
      return example.solution.components.includes(componentName);
    }
    return false;
  });
}
