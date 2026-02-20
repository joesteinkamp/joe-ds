'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const inputVariants = cva(
  'flex w-full rounded-[var(--component-input-border-radius,0.375rem)] border border-[var(--component-input-border)] bg-[var(--component-input-bg)] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--component-input-placeholder-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-[var(--component-input-size-sm-height)] px-[var(--component-input-size-sm-padding-x)] py-[var(--component-input-size-sm-padding-y)] [font-size:var(--component-input-size-sm-text)]',
        md: 'h-[var(--component-input-size-md-height)] px-[var(--component-input-size-md-padding-x)] py-[var(--component-input-size-md-padding-y)] [font-size:var(--component-input-size-md-text)]',
        lg: 'h-[var(--component-input-size-lg-height)] px-[var(--component-input-size-lg-padding-x)] py-[var(--component-input-size-lg-padding-y)] [font-size:var(--component-input-size-lg-text)]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

/**
 * Input component for text entry
 *
 * Supports all HTML input types with consistent styling
 *
 * @example
 * ```tsx
 * <Input type="email" placeholder="you@example.com" />
 * <Input size="sm" placeholder="Small input" />
 * <Input size="lg" placeholder="Large input" />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
