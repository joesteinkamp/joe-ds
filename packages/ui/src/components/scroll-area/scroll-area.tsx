'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { ScrollArea as BaseScrollArea } from '@base-ui-components/react/scroll-area';
// Then export a typed wrapper that consumes `var(--scroll-area-*)` CSS variables
// declared in scroll-area.tokens.json.

export interface ScrollAreaProps {
  className?: string;
  children?: ReactNode;
}

export function ScrollArea({ className, children }: ScrollAreaProps): React.ReactNode {
  return (
    <div data-component="scroll-area" className={cn(className)}>
      {children}
    </div>
  );
}
