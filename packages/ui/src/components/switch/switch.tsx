'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { Switch as BaseSwitch } from '@base-ui-components/react/switch';
// Then export a typed wrapper that consumes `var(--switch-*)` CSS variables
// declared in switch.tokens.json.

export interface SwitchProps {
  className?: string;
  children?: ReactNode;
}

export function Switch({ className, children }: SwitchProps): React.ReactNode {
  return (
    <div data-component="switch" className={cn(className)}>
      {children}
    </div>
  );
}
