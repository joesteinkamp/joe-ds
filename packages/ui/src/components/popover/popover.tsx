'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { Popover as BasePopover } from '@base-ui-components/react/popover';
// Then export a typed wrapper that consumes `var(--popover-*)` CSS variables
// declared in popover.tokens.json.

export interface PopoverProps {
  className?: string;
  children?: ReactNode;
}

export function Popover({ className, children }: PopoverProps): React.ReactNode {
  return (
    <div data-component="popover" className={cn(className)}>
      {children}
    </div>
  );
}
