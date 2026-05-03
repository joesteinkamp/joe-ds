'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { Progress as BaseProgress } from '@base-ui-components/react/progress';
// Then export a typed wrapper that consumes `var(--progress-*)` CSS variables
// declared in progress.tokens.json.

export interface ProgressProps {
  className?: string;
  children?: ReactNode;
}

export function Progress({ className, children }: ProgressProps): React.ReactNode {
  return (
    <div data-component="progress" className={cn(className)}>
      {children}
    </div>
  );
}
