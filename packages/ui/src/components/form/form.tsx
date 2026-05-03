'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { Form as BaseForm } from '@base-ui-components/react/form';
// Then export a typed wrapper that consumes `var(--form-*)` CSS variables
// declared in form.tokens.json.

export interface FormProps {
  className?: string;
  children?: ReactNode;
}

export function Form({ className, children }: FormProps): React.ReactNode {
  return (
    <div data-component="form" className={cn(className)}>
      {children}
    </div>
  );
}
