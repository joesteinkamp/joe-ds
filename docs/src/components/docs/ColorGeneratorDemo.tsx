"use client";

import * as React from "react";
import { generateColorScales } from "@js-ds-ui/color-generator";
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@js-ds-ui/components";

type ColorInput = { name: string; baseColor: string };

const DEFAULT_COLORS: ColorInput[] = [
  { name: "primary", baseColor: "oklch(0.55 0.22 250)" },
  { name: "secondary", baseColor: "oklch(0.65 0.18 320)" },
  { name: "accent", baseColor: "oklch(0.70 0.20 140)" },
  { name: "neutral", baseColor: "oklch(0.55 0.02 250)" },
];

const DEFAULT_TARGETS: Record<string, number> = {
  50: 1.05,
  100: 1.15,
  200: 1.3,
  300: 1.6,
  400: 2.5,
  500: 4.5,
  600: 7.0,
  700: 10.0,
  800: 13.0,
  900: 15.0,
  950: 18.0,
};

const SCALE_STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

function formatCss(scales: Record<string, Record<string, string>>) {
  const lines = Object.entries(scales).flatMap(([name, scale]) =>
    Object.entries(scale).map(([step, value]) => `  --color-${name}-${step}: ${value};`)
  );
  return `:root {\n${lines.join("\n")}\n}`;
}

export default function ColorGeneratorDemo() {
  const [colors, setColors] = React.useState<ColorInput[]>(DEFAULT_COLORS);
  const [targets, setTargets] = React.useState<Record<string, number>>(DEFAULT_TARGETS);
  const [stepCount, setStepCount] = React.useState("11");

  const scales = React.useMemo(() => {
    return generateColorScales(
      colors.map((color) => ({
        name: color.name,
        baseColor: color.baseColor,
        targetContrasts: targets,
      }))
    );
  }, [colors, targets]);

  const displayedSteps = stepCount === "9" ? SCALE_STEPS.slice(1, -1) : SCALE_STEPS;
  const cssOutput = React.useMemo(() => formatCss(scales), [scales]);

  function updateColor(index: number, key: keyof ColorInput, value: string) {
    setColors((prev) => prev.map((item, idx) => (idx === index ? { ...item, [key]: value } : item)));
  }

  function updateTarget(step: string, value: string) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return;
    setTargets((prev) => ({ ...prev, [step]: numeric }));
  }

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
  }

  return (
    <div className="docs-section">
      <div className="docs-card">
        <div className="docs-card-title">Primitive inputs</div>
        <div className="docs-card-meta">Adjust base OKLCH values to regenerate scales.</div>
        <div className="docs-demo-grid">
          {colors.map((color, index) => (
            <div key={color.name} className="docs-demo-grid">
              <Label htmlFor={`${color.name}-name`}>Name</Label>
              <Input
                id={`${color.name}-name`}
                value={color.name}
                onChange={(event) => updateColor(index, "name", event.target.value)}
              />
              <Label htmlFor={`${color.name}-value`}>Base OKLCH</Label>
              <Input
                id={`${color.name}-value`}
                value={color.baseColor}
                onChange={(event) => updateColor(index, "baseColor", event.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="docs-card">
        <div className="docs-card-title">Contrast targets</div>
        <div className="docs-card-meta">Tune contrast ratios per step.</div>
        <div className="docs-grid">
          {SCALE_STEPS.map((step) => (
            <div key={step} className="docs-demo-grid">
              <Label htmlFor={`contrast-${step}`}>{step}</Label>
              <Input
                id={`contrast-${step}`}
                type="number"
                step="0.05"
                value={targets[step]}
                onChange={(event) => updateTarget(step, event.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="docs-card">
        <div className="docs-card-title">Scale display</div>
        <div className="docs-card-meta">Choose which steps to render.</div>
        <Select value={stepCount} onValueChange={setStepCount}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Select steps" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="11">11-step scale (50-950)</SelectItem>
            <SelectItem value="9">9-step scale (100-900)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="docs-section">
        {Object.entries(scales).map(([name, scale]) => (
          <div key={name} className="docs-card">
            <div className="docs-card-title">{name}</div>
            <div className="docs-swatch-grid">
              {displayedSteps.map((step) => (
                <div key={step} className="docs-swatch">
                  <div className="docs-swatch-color" style={{ background: scale[step] }} />
                  <div className="docs-swatch-label">{step}</div>
                  <div className="docs-swatch-label">{scale[step]}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="docs-card">
        <div className="docs-card-title">CSS variables</div>
        <div className="docs-card-meta">Copy generated CSS for your tokens layer.</div>
        <Button variant="outline" onClick={() => copy(cssOutput)}>
          Copy CSS
        </Button>
        <pre className="docs-pre">{cssOutput}</pre>
      </div>

      <div className="docs-card">
        <div className="docs-card-title">JSON output</div>
        <div className="docs-card-meta">Copy JSON for token pipelines.</div>
        <Button variant="outline" onClick={() => copy(JSON.stringify(scales, null, 2))}>
          Copy JSON
        </Button>
        <pre className="docs-pre">{JSON.stringify(scales, null, 2)}</pre>
      </div>
    </div>
  );
}
