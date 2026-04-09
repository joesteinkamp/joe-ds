import { notFound } from "next/navigation";
import ComponentPreview from "@/components/docs/ComponentPreview";
import PropsTable from "@/components/docs/PropsTable";
import { getComponentBySlug } from "@/lib/components";
import {
  getExamplesForComponent,
  getManifestEntry,
  type UsageExample,
} from "@/lib/manifest";

export default async function ComponentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const component = getComponentBySlug(slug);
  if (!component) {
    notFound();
  }

  const manifest = getManifestEntry(slug);
  const examples = manifest?.name ? getExamplesForComponent(manifest.name) : [];

  return (
    <div>
      <h1 className="docs-h1">{component.name}</h1>
      {manifest?.description && <p className="docs-paragraph">{manifest.description}</p>}

      <ComponentPreview slug={slug} />

      <PropsTable slug={slug} />

      {manifest?.accessibility && (
        <div className="docs-section">
          <h3 className="docs-h3">Accessibility</h3>
          <div className="docs-card">
            <div className="docs-card-meta">Role: {manifest.accessibility.role}</div>
            <div className="docs-card-meta">
              Keyboard: {manifest.accessibility.keyboardNavigation?.join(", ")}
            </div>
            <div className="docs-card-meta">
              ARIA: {manifest.accessibility.ariaSupport?.join(", ")}
            </div>
            <div className="docs-card-meta">{manifest.accessibility.wcag}</div>
          </div>
        </div>
      )}

      {examples.length > 0 && (
        <div className="docs-section">
          <h3 className="docs-h3">Examples</h3>
          {examples.map((example: UsageExample, index: number) => (
            <div key={index} className="docs-card">
              <div className="docs-card-title">{example.intent}</div>
              <pre className="docs-pre">{example.solution?.code}</pre>
              <div className="docs-card-meta">{example.solution?.explanation}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
