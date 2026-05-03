'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui-components/react/context-menu';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Popup = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseContextMenu.Popup>>(
  function ContextMenuPopup({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseContextMenu.Popup
        ref={ref}
        {...props}
        className={cn(
          'min-w-32 rounded-md border border-[var(--context-menu-border)] bg-[var(--context-menu-bg)] p-1 text-fg-default outline-none',
          'shadow-lg shadow-black/5',
          className,
        )}
      />
    );
  },
);

const Item = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseContextMenu.Item>>(
  function ContextMenuItem({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseContextMenu.Item
        ref={ref}
        {...props}
        className={cn(
          'flex cursor-default select-none items-center gap-2 rounded px-2 py-1.5 text-sm outline-none',
          'data-[highlighted]:bg-[var(--context-menu-item-hover-bg)] data-[disabled]:opacity-50',
          className,
        )}
      />
    );
  },
);

export const ContextMenu = { ...BaseContextMenu, Popup, Item };
