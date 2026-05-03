'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { NumberField as BaseNumberField } from '@base-ui-components/react/number-field';
// Then export a typed wrapper that consumes `var(--number-field-*)` CSS variables
// declared in number-field.tokens.json.

export interface NumberFieldProps {
  className?: string;
  children?: ReactNode;
}

export function NumberField({ className, children }: NumberFieldProps): React.ReactNode {
  return (
    <div data-component="number-field" className={cn(className)}>
      {children}
    </div>
  );
}
