import Link from "next/link";

export default function DocsHome() {
  return (
    <div>
      <section className="docs-hero">
        <h1>js-ds-ui documentation</h1>
        <p>
          A modern design system with OKLCH tokens, density controls, and theme-first
          architecture. Explore components, foundations, and live demos.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link className="docs-nav-link" href="/components">
            Browse components
          </Link>
          <Link className="docs-nav-link" href="/foundations/theme">
            Explore foundations
          </Link>
        </div>
      </section>

      <section className="docs-section">
        <h2 className="docs-h2">What makes js-ds-ui different</h2>
        <div className="docs-grid">
          <div className="docs-card">
            <div className="docs-card-title">Theme-first</div>
            <div className="docs-card-meta">
              Light, dark, and high-contrast themes powered by OKLCH tokens.
            </div>
          </div>
          <div className="docs-card">
            <div className="docs-card-title">Density-aware</div>
            <div className="docs-card-meta">
              Compact, default, and comfortable spacing without re-rendering.
            </div>
          </div>
          <div className="docs-card">
            <div className="docs-card-title">Token-driven</div>
            <div className="docs-card-meta">
              Semantic tokens for colors, spacing, and typography.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
