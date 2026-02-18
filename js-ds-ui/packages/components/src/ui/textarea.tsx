'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * Textarea component for multi-line text entry
 *
 * Supports all HTML textarea attributes with consistent styling
 *
 * @example
 * ```tsx
 * <Textarea placeholder="Type your message here." />
 * <Textarea rows={6} />
 * <Textarea disabled placeholder="Disabled textarea" />
 * ```
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-[var(--component-input-border-radius)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] px-[var(--space-component-padding-md)] py-[var(--space-component-padding-sm)] [font-size:var(--component-textarea-font-size,var(--font-size-sm))] ring-offset-background placeholder:text-[var(--color-text-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
