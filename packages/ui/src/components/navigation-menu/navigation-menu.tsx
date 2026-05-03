'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui-components/react/navigation-menu';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Root = forwardRef<HTMLElement, ComponentPropsWithoutRef<typeof BaseNavigationMenu.Root>>(
  function NavRoot({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseNavigationMenu.Root
        ref={ref}
        {...props}
        className={cn('relative z-10 flex w-max items-center justify-center', className)}
      />
    );
  },
);

const List = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseNavigationMenu.List>>(
  function NavList({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseNavigationMenu.List
        ref={ref}
        {...props}
        className={cn('flex items-center gap-1', className)}
      />
    );
  },
);

const Trigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof BaseNavigationMenu.Trigger>
>(function NavTrigger({ className, ...props }, ref) {
  // @ts-ignore — ref polymorphism
  return (
    <BaseNavigationMenu.Trigger
      ref={ref}
      {...props}
      className={cn(
        'inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium text-fg-default outline-none transition-colors',
        'hover:bg-[var(--navigation-menu-trigger-hover-bg)] focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    />
  );
});

const Popup = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseNavigationMenu.Popup>>(
  function NavPopup({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseNavigationMenu.Popup
        ref={ref}
        {...props}
        className={cn(
          'rounded-md border border-[var(--navigation-menu-border)] bg-[var(--navigation-menu-bg)] p-2 text-fg-default shadow-lg shadow-black/5 outline-none',
          className,
        )}
      />
    );
  },
);

const Link = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<typeof BaseNavigationMenu.Link>
>(function NavLink({ className, ...props }, ref) {
  // @ts-ignore — ref polymorphism
  return (
    <BaseNavigationMenu.Link
      ref={ref}
      {...props}
      className={cn(
        'inline-flex items-center text-sm font-medium text-fg-default outline-none focus-visible:underline',
        className,
      )}
    />
  );
});

export const NavigationMenu = { ...BaseNavigationMenu, Root, List, Trigger, Popup, Link };
