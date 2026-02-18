'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Input component for text entry
 *
 * Supports all HTML input types with consistent styling
 *
 * @example
 * ```tsx
 * <Input type="email" placeholder="you@example.com" />
 * <Input type="password" />
 * <Input type="search" placeholder="Search..." />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-[var(--component-input-height,2.5rem)] w-full rounded-[var(--component-input-border-radius,0.375rem)] border border-[var(--component-input-border)] bg-[var(--component-input-bg)] px-[var(--component-input-padding-x,0.75rem)] py-[var(--component-input-padding-y,0.5rem)] [font-size:var(--component-input-font-size,0.875rem)] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--component-input-placeholder-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
