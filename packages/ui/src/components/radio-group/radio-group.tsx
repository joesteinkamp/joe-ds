'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { RadioGroup as BaseRadioGroup } from '@base-ui-components/react/radio-group';
// Then export a typed wrapper that consumes `var(--radio-group-*)` CSS variables
// declared in radio-group.tokens.json.

export interface RadioGroupProps {
  className?: string;
  children?: ReactNode;
}

export function RadioGroup({ className, children }: RadioGroupProps): React.ReactNode {
  return (
    <div data-component="radio-group" className={cn(className)}>
      {children}
    </div>
  );
}
