'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { Menubar as BaseMenubar } from '@base-ui-components/react/menubar';
// Then export a typed wrapper that consumes `var(--menubar-*)` CSS variables
// declared in menubar.tokens.json.

export interface MenubarProps {
  className?: string;
  children?: ReactNode;
}

export function Menubar({ className, children }: MenubarProps): React.ReactNode {
  return (
    <div data-component="menubar" className={cn(className)}>
      {children}
    </div>
  );
}
