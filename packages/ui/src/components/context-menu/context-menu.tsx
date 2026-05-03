'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { ContextMenu as BaseContextMenu } from '@base-ui-components/react/context-menu';
// Then export a typed wrapper that consumes `var(--context-menu-*)` CSS variables
// declared in context-menu.tokens.json.

export interface ContextMenuProps {
  className?: string;
  children?: ReactNode;
}

export function ContextMenu({ className, children }: ContextMenuProps): React.ReactNode {
  return (
    <div data-component="context-menu" className={cn(className)}>
      {children}
    </div>
  );
}
