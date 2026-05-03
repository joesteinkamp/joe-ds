'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { NavigationMenu as BaseNavigationMenu } from '@base-ui-components/react/navigation-menu';
// Then export a typed wrapper that consumes `var(--navigation-menu-*)` CSS variables
// declared in navigation-menu.tokens.json.

export interface NavigationMenuProps {
  className?: string;
  children?: ReactNode;
}

export function NavigationMenu({ className, children }: NavigationMenuProps): React.ReactNode {
  return (
    <div data-component="navigation-menu" className={cn(className)}>
      {children}
    </div>
  );
}
