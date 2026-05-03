'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { Tabs as BaseTabs } from '@base-ui-components/react/tabs';
// Then export a typed wrapper that consumes `var(--tabs-*)` CSS variables
// declared in tabs.tokens.json.

export interface TabsProps {
  className?: string;
  children?: ReactNode;
}

export function Tabs({ className, children }: TabsProps): React.ReactNode {
  return (
    <div data-component="tabs" className={cn(className)}>
      {children}
    </div>
  );
}
