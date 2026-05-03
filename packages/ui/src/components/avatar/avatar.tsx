'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { Avatar as BaseAvatar } from '@base-ui-components/react/avatar';
// Then export a typed wrapper that consumes `var(--avatar-*)` CSS variables
// declared in avatar.tokens.json.

export interface AvatarProps {
  className?: string;
  children?: ReactNode;
}

export function Avatar({ className, children }: AvatarProps): React.ReactNode {
  return (
    <div data-component="avatar" className={cn(className)}>
      {children}
    </div>
  );
}
