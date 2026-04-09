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
  components: Record<string, ManifestComponent>;
  patterns?: Record<string, unknown>;
};

type Examples = {
  examples: Record<string, UsageExample>;
};

export interface ManifestProp {
  type?: string;
  default?: unknown;
  description?: string;
}

export interface ManifestAccessibility {
  role?: string;
  keyboardNavigation?: string[];
  ariaSupport?: string[];
  focusManagement?: string;
  wcag?: string;
}

export interface ManifestComponent {
  name: string;
  description?: string;
  props?: Record<string, ManifestProp>;
  accessibility?: ManifestAccessibility;
  usage?: {
    when?: string;
    avoid?: string;
    examples?: Array<{
      scenario?: string;
      code?: string;
    }>;
  };
}

interface UsageExampleSolution {
  component?: string;
  components?: string[];
  code?: string;
  explanation?: string;
}

export interface UsageExample {
  intent?: string;
  solution?: UsageExampleSolution;
}

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
  return Object.values(examples).filter((example) => {
    if (example?.solution?.component) {
      return example.solution.component === componentName;
    }
    if (Array.isArray(example?.solution?.components)) {
      return example.solution.components.includes(componentName);
    }
    return false;
  });
}
