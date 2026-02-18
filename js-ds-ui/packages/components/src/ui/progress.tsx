'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '../lib/utils';

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {}

/**
 * Progress component for showing completion status
 *
 * @example
 * ```tsx
 * <Progress value={60} className="w-full" />
 * ```
 */
const Progress = React.memo(React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      'relative h-4 w-full overflow-hidden rounded-full bg-[var(--color-background-secondary)]',
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-[var(--color-interactive-primary)] transition-all [transition-duration:var(--animation-duration-slow)] [transition-timing-function:var(--animation-easing-ease-in-out)]"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
)));

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
