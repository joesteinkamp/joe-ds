'use client';

import { Progress as BaseProgress } from '@base-ui-components/react/progress';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Root = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseProgress.Root>>(
  function ProgressRoot({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseProgress.Root ref={ref} {...props} className={cn('flex flex-col gap-2', className)} />
    );
  },
);

const Track = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseProgress.Track>>(
  function ProgressTrack({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseProgress.Track
        ref={ref}
        {...props}
        className={cn(
          'h-2 w-full overflow-hidden rounded-full bg-[var(--progress-track-bg)]',
          className,
        )}
      />
    );
  },
);

const Indicator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseProgress.Indicator>
>(function ProgressIndicator({ className, ...props }, ref) {
  // @ts-ignore — ref polymorphism
  return (
    <BaseProgress.Indicator
      ref={ref}
      {...props}
      className={cn('h-full bg-[var(--progress-indicator-bg)] transition-all', className)}
    />
  );
});

const Label = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseProgress.Label>>(
  function ProgressLabel({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseProgress.Label
        ref={ref}
        {...props}
        className={cn('text-sm font-medium text-fg-default', className)}
      />
    );
  },
);

const Value = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseProgress.Value>>(
  function ProgressValue({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseProgress.Value ref={ref} {...props} className={cn('text-xs text-fg-muted', className)} />
    );
  },
);

export const Progress = { ...BaseProgress, Root, Track, Indicator, Label, Value };
