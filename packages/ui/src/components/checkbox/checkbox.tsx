'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { Checkbox as BaseCheckbox } from '@base-ui-components/react/checkbox';
// Then export a typed wrapper that consumes `var(--checkbox-*)` CSS variables
// declared in checkbox.tokens.json.

export interface CheckboxProps {
  className?: string;
  children?: ReactNode;
}

export function Checkbox({ className, children }: CheckboxProps): React.ReactNode {
  return (
    <div data-component="checkbox" className={cn(className)}>
      {children}
    </div>
  );
}
