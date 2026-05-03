'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { Separator as BaseSeparator } from '@base-ui-components/react/separator';
// Then export a typed wrapper that consumes `var(--separator-*)` CSS variables
// declared in separator.tokens.json.

export interface SeparatorProps {
  className?: string;
  children?: ReactNode;
}

export function Separator({ className, children }: SeparatorProps): React.ReactNode {
  return (
    <div data-component="separator" className={cn(className)}>
      {children}
    </div>
  );
}
