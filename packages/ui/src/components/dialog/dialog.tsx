'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { Dialog as BaseDialog } from '@base-ui-components/react/dialog';
// Then export a typed wrapper that consumes `var(--dialog-*)` CSS variables
// declared in dialog.tokens.json.

export interface DialogProps {
  className?: string;
  children?: ReactNode;
}

export function Dialog({ className, children }: DialogProps): React.ReactNode {
  return (
    <div data-component="dialog" className={cn(className)}>
      {children}
    </div>
  );
}
