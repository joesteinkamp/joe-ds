"use client";

import { componentDemos } from "@/components/docs/ComponentDemos";

export default function ComponentPreview({ slug }: { slug: string }) {
  const demo = componentDemos[slug];

  if (!demo) {
    return (
      <div className="docs-card">
        <div className="docs-card-title">Demo unavailable</div>
        <div className="docs-card-meta">
          A live demo for this component is being added.
        </div>
      </div>
    );
  }

  return <div className="docs-demo">{demo}</div>;
}
