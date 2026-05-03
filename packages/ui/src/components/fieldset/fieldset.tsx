'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { Fieldset as BaseFieldset } from '@base-ui-components/react/fieldset';
// Then export a typed wrapper that consumes `var(--fieldset-*)` CSS variables
// declared in fieldset.tokens.json.

export interface FieldsetProps {
  className?: string;
  children?: ReactNode;
}

export function Fieldset({ className, children }: FieldsetProps): React.ReactNode {
  return (
    <div data-component="fieldset" className={cn(className)}>
      {children}
    </div>
  );
}
