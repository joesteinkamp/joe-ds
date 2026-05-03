'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { Toast as BaseToast } from '@base-ui-components/react/toast';
// Then export a typed wrapper that consumes `var(--toast-*)` CSS variables
// declared in toast.tokens.json.

export interface ToastProps {
  className?: string;
  children?: ReactNode;
}

export function Toast({ className, children }: ToastProps): React.ReactNode {
  return (
    <div data-component="toast" className={cn(className)}>
      {children}
    </div>
  );
}
