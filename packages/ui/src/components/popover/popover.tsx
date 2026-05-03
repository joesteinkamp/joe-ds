'use client';

import { Popover as BasePopover } from '@base-ui-components/react/popover';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Popup = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BasePopover.Popup>>(
  function PopoverPopup({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BasePopover.Popup
        ref={ref}
        {...props}
        className={cn(
          'rounded-md border border-[var(--popover-border)] bg-[var(--popover-bg)] p-4 text-sm text-fg-default outline-none',
          'shadow-lg shadow-black/5',
          'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity duration-100',
          className,
        )}
      />
    );
  },
);

const Title = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<typeof BasePopover.Title>>(
  function PopoverTitle({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BasePopover.Title
        ref={ref}
        {...props}
        className={cn('text-sm font-semibold text-fg-default', className)}
      />
    );
  },
);

const Description = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof BasePopover.Description>
>(function PopoverDescription({ className, ...props }, ref) {
  // @ts-ignore — ref polymorphism
  return (
    <BasePopover.Description
      ref={ref}
      {...props}
      className={cn('text-sm text-fg-muted', className)}
    />
  );
});

export const Popover = { ...BasePopover, Popup, Title, Description };
