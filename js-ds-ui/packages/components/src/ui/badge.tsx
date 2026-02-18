'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-[var(--component-badge-border-radius,9999px)] border px-[var(--component-badge-padding-x,0.625rem)] py-[var(--component-badge-padding-y,0.125rem)] [font-size:var(--component-badge-font-size)] [font-weight:var(--component-badge-font-weight)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--component-badge-default-bg)] text-white',
        secondary:
          'border-transparent bg-[var(--component-badge-secondary-bg)] [color:var(--component-badge-secondary-text)]',
        outline: '[color:var(--component-badge-outline-text)]',
        destructive:
          'border-transparent bg-[var(--component-badge-destructive-bg)] text-white',
        success:
          'border-transparent bg-[var(--component-badge-success-bg)] text-white',
        warning:
          'border-transparent bg-[var(--component-badge-warning-bg)] text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Badge component for status indicators and labels
 *
 * @example
 * ```tsx
 * <Badge>Default</Badge>
 * <Badge variant="success">Active</Badge>
 * <Badge variant="destructive">Error</Badge>
 * <Badge variant="warning">Pending</Badge>
 * ```
 */
const Badge = React.memo(React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, className }))}
        {...props}
      />
    );
  }
));

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
