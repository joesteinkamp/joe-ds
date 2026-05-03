'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { Tooltip as BaseTooltip } from '@base-ui-components/react/tooltip';
// Then export a typed wrapper that consumes `var(--tooltip-*)` CSS variables
// declared in tooltip.tokens.json.

export interface TooltipProps {
  className?: string;
  children?: ReactNode;
}

export function Tooltip({ className, children }: TooltipProps): React.ReactNode {
  return (
    <div data-component="tooltip" className={cn(className)}>
      {children}
    </div>
  );
}
