'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const textareaVariants = cva(
  'flex w-full rounded-[var(--component-input-border-radius)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] ring-offset-background placeholder:text-[var(--color-text-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'min-h-[var(--component-textarea-size-sm-min-height,3.75rem)] px-[var(--component-textarea-size-sm-padding-x)] py-[var(--component-textarea-size-sm-padding-y)] [font-size:var(--component-textarea-size-sm-text)]',
        md: 'min-h-[var(--component-textarea-size-md-min-height,5rem)] px-[var(--component-textarea-size-md-padding-x)] py-[var(--component-textarea-size-md-padding-y)] [font-size:var(--component-textarea-size-md-text)]',
        lg: 'min-h-[var(--component-textarea-size-lg-min-height,6.25rem)] px-[var(--component-textarea-size-lg-padding-x)] py-[var(--component-textarea-size-lg-padding-y)] [font-size:var(--component-textarea-size-lg-text)]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {}

/**
 * Textarea component for multi-line text entry
 *
 * Supports all HTML textarea attributes with consistent styling
 *
 * @example
 * ```tsx
 * <Textarea placeholder="Type your message here." />
 * <Textarea size="sm" rows={3} />
 * <Textarea size="lg" rows={8} />
 * ```
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
