'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const textVariants = cva(
  'leading-[var(--font-lineHeight-normal,1.5)]',
  {
    variants: {
      size: {
        xs: '[font-size:var(--font-size-xs)]',
        sm: '[font-size:var(--font-size-sm)]',
        base: '[font-size:var(--font-size-base)]',
        lg: '[font-size:var(--font-size-lg)]',
        xl: '[font-size:var(--font-size-xl)]',
      },
      weight: {
        normal: '[font-weight:var(--font-weight-normal)]',
        medium: '[font-weight:var(--font-weight-medium)]',
        semibold: '[font-weight:var(--font-weight-semibold)]',
        bold: '[font-weight:var(--font-weight-bold)]',
      },
      color: {
        primary: 'text-[var(--color-text-primary)]',
        secondary: 'text-[var(--color-text-secondary)]',
        tertiary: 'text-[var(--color-text-tertiary)]',
        inverse: 'text-[var(--color-text-inverse)]',
        success: 'text-[var(--color-text-success)]',
        warning: 'text-[var(--color-text-warning)]',
        error: 'text-[var(--color-text-error)]',
        info: 'text-[var(--color-text-info)]',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify',
      },
      truncate: {
        true: 'truncate',
        false: '',
      },
      wrap: {
        balance: 'text-balance',
        pretty: 'text-pretty',
        nowrap: 'text-nowrap',
      },
    },
    defaultVariants: {
      size: 'base',
      weight: 'normal',
      color: 'primary',
      truncate: false,
    },
  }
);

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  /** Render as a different element */
  as?: React.ElementType;
}

/**
 * Text component — paragraph text with size, weight, and color variants
 *
 * @example
 * ```tsx
 * <Text>Default paragraph text</Text>
 * <Text size="sm" color="secondary">Small secondary text</Text>
 * <Text size="lg" weight="semibold">Large semibold text</Text>
 * <Text as="span" size="xs" color="tertiary">Inline small label</Text>
 * ```
 */
const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, weight, color, align, truncate, wrap, as: Comp = 'p', ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(textVariants({ size, weight, color, align, truncate, wrap, className }))}
      {...props}
    />
  )
);

Text.displayName = 'Text';

export { Text, textVariants };
