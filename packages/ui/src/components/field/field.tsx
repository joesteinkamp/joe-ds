'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { Field as BaseField } from '@base-ui-components/react/field';
// Then export a typed wrapper that consumes `var(--field-*)` CSS variables
// declared in field.tokens.json.

export interface FieldProps {
  className?: string;
  children?: ReactNode;
}

export function Field({ className, children }: FieldProps): React.ReactNode {
  return (
    <div data-component="field" className={cn(className)}>
      {children}
    </div>
  );
}
