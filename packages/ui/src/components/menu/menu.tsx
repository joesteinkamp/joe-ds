'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { Menu as BaseMenu } from '@base-ui-components/react/menu';
// Then export a typed wrapper that consumes `var(--menu-*)` CSS variables
// declared in menu.tokens.json.

export interface MenuProps {
  className?: string;
  children?: ReactNode;
}

export function Menu({ className, children }: MenuProps): React.ReactNode {
  return (
    <div data-component="menu" className={cn(className)}>
      {children}
    </div>
  );
}
