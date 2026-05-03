'use client';

import { Select as BaseSelect } from '@base-ui-components/react/select';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Trigger = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof BaseSelect.Trigger>>(
  function SelectTrigger({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseSelect.Trigger
        ref={ref}
        {...props}
        className={cn(
          'inline-flex h-9 w-full items-center justify-between gap-2 rounded-md border px-3 text-sm outline-none',
          'border-[var(--select-trigger-border)] bg-[var(--select-trigger-bg)] text-fg-default',
          'focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      />
    );
  },
);

const Popup = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseSelect.Popup>>(
  function SelectPopup({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseSelect.Popup
        ref={ref}
        {...props}
        className={cn(
          'min-w-[var(--anchor-width)] rounded-md border border-[var(--select-popup-border)] bg-[var(--select-popup-bg)] p-1 text-fg-default outline-none',
          'shadow-lg shadow-black/5',
          className,
        )}
      />
    );
  },
);

const Item = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseSelect.Item>>(
  function SelectItem({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseSelect.Item
        ref={ref}
        {...props}
        className={cn(
          'flex cursor-default select-none items-center gap-2 rounded px-2 py-1.5 text-sm outline-none',
          'data-[highlighted]:bg-[var(--select-item-hover-bg)] data-[disabled]:opacity-50',
          className,
        )}
      />
    );
  },
);

const GroupLabel = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseSelect.GroupLabel>
>(function SelectGroupLabel({ className, ...props }, ref) {
  // @ts-ignore — ref polymorphism
  return (
    <BaseSelect.GroupLabel
      ref={ref}
      {...props}
      className={cn('px-2 py-1 text-xs font-semibold text-fg-muted', className)}
    />
  );
});

export const Select = { ...BaseSelect, Trigger, Popup, Item, GroupLabel };
