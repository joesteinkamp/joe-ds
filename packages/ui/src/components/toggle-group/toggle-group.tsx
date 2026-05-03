'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { ToggleGroup as BaseToggleGroup } from '@base-ui-components/react/toggle-group';
// Then export a typed wrapper that consumes `var(--toggle-group-*)` CSS variables
// declared in toggle-group.tokens.json.

export interface ToggleGroupProps {
  className?: string;
  children?: ReactNode;
}

export function ToggleGroup({ className, children }: ToggleGroupProps): React.ReactNode {
  return (
    <div data-component="toggle-group" className={cn(className)}>
      {children}
    </div>
  );
}
