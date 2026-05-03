'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { Collapsible as BaseCollapsible } from '@base-ui-components/react/collapsible';
// Then export a typed wrapper that consumes `var(--collapsible-*)` CSS variables
// declared in collapsible.tokens.json.

export interface CollapsibleProps {
  className?: string;
  children?: ReactNode;
}

export function Collapsible({ className, children }: CollapsibleProps): React.ReactNode {
  return (
    <div data-component="collapsible" className={cn(className)}>
      {children}
    </div>
  );
}
