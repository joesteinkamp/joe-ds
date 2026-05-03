'use client';

import { ScrollArea as BaseScrollArea } from '@base-ui-components/react/scroll-area';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Root = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseScrollArea.Root>>(
  function ScrollAreaRoot({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseScrollArea.Root
        ref={ref}
        {...props}
        className={cn('relative overflow-hidden', className)}
      />
    );
  },
);

const Viewport = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseScrollArea.Viewport>
>(function ScrollAreaViewport({ className, ...props }, ref) {
  // @ts-ignore — ref polymorphism
  return (
    <BaseScrollArea.Viewport ref={ref} {...props} className={cn('h-full w-full', className)} />
  );
});

const Scrollbar = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseScrollArea.Scrollbar>
>(function ScrollAreaScrollbar({ className, ...props }, ref) {
  // @ts-ignore — ref polymorphism
  return (
    <BaseScrollArea.Scrollbar
      ref={ref}
      {...props}
      className={cn(
        'flex touch-none select-none p-0.5 bg-[var(--scroll-area-scrollbar-bg)] transition-colors',
        'data-[orientation=vertical]:w-2 data-[orientation=horizontal]:h-2',
        className,
      )}
    />
  );
});

const Thumb = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseScrollArea.Thumb>>(
  function ScrollAreaThumb({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseScrollArea.Thumb
        ref={ref}
        {...props}
        className={cn('relative flex-1 rounded-full bg-[var(--scroll-area-thumb-bg)]', className)}
      />
    );
  },
);

export const ScrollArea = { ...BaseScrollArea, Root, Viewport, Scrollbar, Thumb };
