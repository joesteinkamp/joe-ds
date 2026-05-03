'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { Toggle as BaseToggle } from '@base-ui-components/react/toggle';
// Then export a typed wrapper that consumes `var(--toggle-*)` CSS variables
// declared in toggle.tokens.json.

export interface ToggleProps {
  className?: string;
  children?: ReactNode;
}

export function Toggle({ className, children }: ToggleProps): React.ReactNode {
  return (
    <div data-component="toggle" className={cn(className)}>
      {children}
    </div>
  );
}
