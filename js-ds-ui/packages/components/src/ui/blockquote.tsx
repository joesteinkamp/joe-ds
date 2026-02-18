'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const blockquoteVariants = cva(
  'border-l-4 pl-[var(--space-component-padding-lg,1rem)] italic leading-[var(--font-lineHeight-relaxed,1.75)]',
  {
    variants: {
      variant: {
        default: 'border-[var(--color-border-default)] text-[var(--color-text-secondary)]',
        accent: 'border-[var(--color-interactive-primary)] text-[var(--color-text-primary)]',
        success: 'border-[var(--color-semantic-success)] text-[var(--color-text-primary)]',
        warning: 'border-[var(--color-semantic-warning)] text-[var(--color-text-primary)]',
        error: 'border-[var(--color-semantic-error)] text-[var(--color-text-primary)]',
      },
      size: {
        sm: 'text-[var(--font-size-sm)]',
        base: 'text-[var(--font-size-base)]',
        lg: 'text-[var(--font-size-lg)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'base',
    },
  }
);

export interface BlockquoteProps
  extends React.BlockquoteHTMLAttributes<HTMLQuoteElement>,
    VariantProps<typeof blockquoteVariants> {}

/**
 * Blockquote component — styled quote block
 *
 * @example
 * ```tsx
 * <Blockquote>
 *   The best way to predict the future is to invent it.
 * </Blockquote>
 *
 * <Blockquote variant="accent" size="lg">
 *   Design is not just what it looks like. Design is how it works.
 * </Blockquote>
 * ```
 */
const Blockquote = React.memo(React.forwardRef<HTMLQuoteElement, BlockquoteProps>(
  ({ className, variant, size, ...props }, ref) => (
    <blockquote
      ref={ref}
      className={cn(blockquoteVariants({ variant, size, className }))}
      {...props}
    />
  )
));

Blockquote.displayName = 'Blockquote';

export { Blockquote, blockquoteVariants };
