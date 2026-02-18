'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Skeleton component for loading placeholder states
 *
 * @example
 * ```tsx
 * <Skeleton className="h-12 w-12 rounded-full" />
 * <Skeleton className="h-4 w-[250px]" />
 * <Skeleton className="h-4 w-[200px]" />
 * ```
 */
const Skeleton = React.memo(React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse rounded-[var(--component-card-border-radius,0.5rem)] bg-[var(--color-background-tertiary,#e5e7eb)]',
          className
        )}
        {...props}
      />
    );
  }
));

Skeleton.displayName = 'Skeleton';

export { Skeleton };
