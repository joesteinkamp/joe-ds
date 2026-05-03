'use client';

import { Menu as BaseMenu } from '@base-ui-components/react/menu';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Popup = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseMenu.Popup>>(
  function MenuPopup({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseMenu.Popup
        ref={ref}
        {...props}
        className={cn(
          'min-w-32 rounded-md border border-[var(--menu-border)] bg-[var(--menu-bg)] p-1 text-fg-default outline-none',
          'shadow-lg shadow-black/5',
          className,
        )}
      />
    );
  },
);

const Item = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseMenu.Item>>(
  function MenuItem({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseMenu.Item
        ref={ref}
        {...props}
        className={cn(
          'flex cursor-default select-none items-center gap-2 rounded px-2 py-1.5 text-sm outline-none',
          'data-[highlighted]:bg-[var(--menu-item-hover-bg)] data-[disabled]:opacity-50',
          className,
        )}
      />
    );
  },
);

const GroupLabel = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseMenu.GroupLabel>>(
  function MenuGroupLabel({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseMenu.GroupLabel
        ref={ref}
        {...props}
        className={cn('px-2 py-1 text-xs font-semibold text-fg-muted', className)}
      />
    );
  },
);

export const Menu = { ...BaseMenu, Popup, Item, GroupLabel };
