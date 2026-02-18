import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const variablesPath = join(__dirname, "pen-variables.json");
const componentsPath = join(__dirname, "pen-components.json");
const outputPath = join(root, "js-ds-ui.pen");

// Read input files
let variables;
try {
  variables = JSON.parse(readFileSync(variablesPath, "utf-8"));
} catch (err) {
  console.error(`Failed to read ${variablesPath}:`, err.message);
  process.exit(1);
}

let components;
try {
  components = JSON.parse(readFileSync(componentsPath, "utf-8"));
} catch (err) {
  console.error(`Failed to read ${componentsPath}:`, err.message);
  process.exit(1);
}

// Assemble the .pen structure
const pen = {
  version: "2.8",
  themes: { mode: ["light", "dark"] },
  variables,
  children: components,
};

// Validate it serializes to valid JSON
const output = JSON.stringify(pen, null, 2);
JSON.parse(output); // will throw if invalid

// Write the output file
writeFileSync(outputPath, output + "\n", "utf-8");

// Report stats
const fileSizeKB = (Buffer.byteLength(output, "utf-8") / 1024).toFixed(1);
const variableCount = Object.keys(variables).length;
const componentCount = components.length;

console.log(`Wrote ${outputPath}`);
console.log(`  File size: ${fileSizeKB} KB`);
console.log(`  Variables: ${variableCount} collections`);
console.log(`  Components: ${componentCount} frames`);

// Clean up intermediate files
unlinkSync(variablesPath);
unlinkSync(componentsPath);
console.log("Cleaned up intermediate files.");
