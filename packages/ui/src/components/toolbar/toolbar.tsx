'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { Toolbar as BaseToolbar } from '@base-ui-components/react/toolbar';
// Then export a typed wrapper that consumes `var(--toolbar-*)` CSS variables
// declared in toolbar.tokens.json.

export interface ToolbarProps {
  className?: string;
  children?: ReactNode;
}

export function Toolbar({ className, children }: ToolbarProps): React.ReactNode {
  return (
    <div data-component="toolbar" className={cn(className)}>
      {children}
    </div>
  );
}
