'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { PreviewCard as BasePreviewCard } from '@base-ui-components/react/preview-card';
// Then export a typed wrapper that consumes `var(--preview-card-*)` CSS variables
// declared in preview-card.tokens.json.

export interface PreviewCardProps {
  className?: string;
  children?: ReactNode;
}

export function PreviewCard({ className, children }: PreviewCardProps): React.ReactNode {
  return (
    <div data-component="preview-card" className={cn(className)}>
      {children}
    </div>
  );
}
