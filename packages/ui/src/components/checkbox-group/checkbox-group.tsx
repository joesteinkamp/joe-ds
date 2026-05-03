'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui-components/react/checkbox-group';
// Then export a typed wrapper that consumes `var(--checkbox-group-*)` CSS variables
// declared in checkbox-group.tokens.json.

export interface CheckboxGroupProps {
  className?: string;
  children?: ReactNode;
}

export function CheckboxGroup({ className, children }: CheckboxGroupProps): React.ReactNode {
  return (
    <div data-component="checkbox-group" className={cn(className)}>
      {children}
    </div>
  );
}
