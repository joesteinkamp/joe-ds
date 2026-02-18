import Link from "next/link";
import ComponentPreview from "@/components/docs/ComponentPreview";
import { getComponentList } from "@/lib/components";

export default function ComponentsPage() {
  const components = getComponentList();

  return (
    <div>
      <h1 className="docs-h1">Components</h1>
      <p className="docs-paragraph">
        Browse the full component catalog with live previews and metadata.
      </p>
      <div className="docs-grid">
        {components.map((component) => (
          <div key={component.slug} className="docs-card">
            <div className="docs-card-title">{component.name}</div>
            <div className="docs-card-meta">/{component.slug}</div>
            <ComponentPreview slug={component.slug} />
            <Link className="docs-nav-link" href={`/components/${component.slug}`}>
              View details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
