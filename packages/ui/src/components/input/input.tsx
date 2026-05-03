'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { Input as BaseInput } from '@base-ui-components/react/input';
// Then export a typed wrapper that consumes `var(--input-*)` CSS variables
// declared in input.tokens.json.

export interface InputProps {
  className?: string;
  children?: ReactNode;
}

export function Input({ className, children }: InputProps): React.ReactNode {
  return (
    <div data-component="input" className={cn(className)}>
      {children}
    </div>
  );
}
