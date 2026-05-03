'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { Select as BaseSelect } from '@base-ui-components/react/select';
// Then export a typed wrapper that consumes `var(--select-*)` CSS variables
// declared in select.tokens.json.

export interface SelectProps {
  className?: string;
  children?: ReactNode;
}

export function Select({ className, children }: SelectProps): React.ReactNode {
  return (
    <div data-component="select" className={cn(className)}>
      {children}
    </div>
  );
}
