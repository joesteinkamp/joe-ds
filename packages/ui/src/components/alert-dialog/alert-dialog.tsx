'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { AlertDialog as BaseAlertDialog } from '@base-ui-components/react/alert-dialog';
// Then export a typed wrapper that consumes `var(--alert-dialog-*)` CSS variables
// declared in alert-dialog.tokens.json.

export interface AlertDialogProps {
  className?: string;
  children?: ReactNode;
}

export function AlertDialog({ className, children }: AlertDialogProps): React.ReactNode {
  return (
    <div data-component="alert-dialog" className={cn(className)}>
      {children}
    </div>
  );
}
