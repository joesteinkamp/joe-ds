import { notFound } from "next/navigation";
import ComponentPreview from "@/components/docs/ComponentPreview";
import PropsTable from "@/components/docs/PropsTable";
import { getComponentBySlug } from "@/lib/components";
import { getExamplesForComponent, getManifestEntry } from "@/lib/manifest";

export default function ComponentDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const component = getComponentBySlug(params.slug);
  if (!component) {
    notFound();
  }

  const manifest = getManifestEntry(params.slug);
  const examples = manifest?.name ? getExamplesForComponent(manifest.name) : [];

  return (
    <div>
      <h1 className="docs-h1">{component.name}</h1>
      {manifest?.description && <p className="docs-paragraph">{manifest.description}</p>}

      <ComponentPreview slug={params.slug} />

      <PropsTable slug={params.slug} />

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
          {examples.map((example: any, index: number) => (
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
