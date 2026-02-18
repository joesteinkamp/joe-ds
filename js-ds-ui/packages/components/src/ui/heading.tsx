'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const headingVariants = cva(
  '[font-weight:var(--component-heading-font-weight-bold)] leading-[var(--font-lineHeight-tight,1.25)] tracking-tight text-[var(--color-text-primary)]',
  {
    variants: {
      size: {
        '1': '[font-size:var(--component-heading-font-size-1)]',
        '2': '[font-size:var(--component-heading-font-size-2)]',
        '3': '[font-size:var(--component-heading-font-size-3)]',
        '4': '[font-size:var(--component-heading-font-size-4)]',
        '5': '[font-size:var(--component-heading-font-size-5)]',
        '6': '[font-size:var(--component-heading-font-size-6)]',
      },
      weight: {
        normal: '[font-weight:var(--component-heading-font-weight-normal)]',
        medium: '[font-weight:var(--component-heading-font-weight-medium)]',
        semibold: '[font-weight:var(--component-heading-font-weight-semibold)]',
        bold: '[font-weight:var(--component-heading-font-weight-bold)]',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      truncate: {
        true: 'truncate',
        false: '',
      },
    },
    defaultVariants: {
      weight: 'bold',
      truncate: false,
    },
  }
);

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    Omit<VariantProps<typeof headingVariants>, 'size'> {
  /** Semantic heading level (1-6), determines HTML element */
  level?: HeadingLevel;
  /** Visual size override (defaults to matching level) */
  size?: '1' | '2' | '3' | '4' | '5' | '6';
}

/**
 * Heading component — semantic headings with fluid token-based typography
 *
 * The `level` prop sets the HTML element (h1-h6).
 * The `size` prop overrides the visual size independently.
 *
 * @example
 * ```tsx
 * <Heading level={1}>Page Title</Heading>
 * <Heading level={2} size="3">Visually smaller h2</Heading>
 * <Heading level={3} weight="medium" align="center">Centered h3</Heading>
 * ```
 */
const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 2, size, weight, align, truncate, ...props }, ref) => {
    const Comp = `h${level}` as const;
    const visualSize = size ?? String(level) as '1' | '2' | '3' | '4' | '5' | '6';

    return (
      <Comp
        ref={ref}
        className={cn(headingVariants({ size: visualSize, weight, align, truncate, className }))}
        {...props}
      />
    );
  }
);

Heading.displayName = 'Heading';

export { Heading, headingVariants };
