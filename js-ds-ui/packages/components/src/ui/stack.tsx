'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const stackVariants = cva('flex', {
  variants: {
    direction: {
      vertical: 'flex-col',
      horizontal: 'flex-row',
    },
    spacing: {
      none: 'gap-0',
      xs: 'gap-[var(--space-component-gap-xs,0.25rem)]',
      sm: 'gap-[var(--space-component-gap-sm,0.5rem)]',
      md: 'gap-[var(--space-component-gap-md,0.75rem)]',
      lg: 'gap-[var(--space-component-gap-lg,1rem)]',
      xl: 'gap-[var(--space-layout-section,4rem)]',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    wrap: {
      true: 'flex-wrap',
      false: 'flex-nowrap',
    },
  },
  defaultVariants: {
    direction: 'vertical',
    spacing: 'md',
    align: 'stretch',
    wrap: false,
  },
});

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
  /** Render as a different element */
  as?: React.ElementType;
}

/**
 * Stack component — flex layout wrapper with density-aware spacing
 *
 * @example
 * ```tsx
 * <Stack spacing="lg">
 *   <Card>First</Card>
 *   <Card>Second</Card>
 * </Stack>
 *
 * <Stack direction="horizontal" spacing="sm" align="center">
 *   <Avatar />
 *   <Text>Username</Text>
 * </Stack>
 * ```
 */
const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, direction, spacing, align, justify, wrap, as: Comp = 'div', ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(stackVariants({ direction, spacing, align, justify, wrap, className }))}
      {...props}
    />
  )
);

Stack.displayName = 'Stack';

export { Stack, stackVariants };
