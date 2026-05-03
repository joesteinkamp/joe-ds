'use client';

import { Tabs as BaseTabs } from '@base-ui-components/react/tabs';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Root = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseTabs.Root>>(
  function TabsRoot({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return <BaseTabs.Root ref={ref} {...props} className={cn('flex flex-col gap-2', className)} />;
  },
);

const List = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseTabs.List>>(
  function TabsList({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseTabs.List
        ref={ref}
        {...props}
        className={cn(
          'inline-flex h-9 items-center justify-center rounded-md bg-[var(--tabs-list-bg)] p-1 text-fg-muted',
          className,
        )}
      />
    );
  },
);

const Tab = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof BaseTabs.Tab>>(
  function TabsTab({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseTabs.Tab
        ref={ref}
        {...props}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium outline-none transition-colors',
          'focus-visible:ring-2 focus-visible:ring-ring',
          'data-[selected]:bg-[var(--tabs-tab-active-bg)] data-[selected]:text-[var(--tabs-tab-active-fg)] data-[selected]:shadow',
          'disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
      />
    );
  },
);

const Panel = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseTabs.Panel>>(
  function TabsPanel({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseTabs.Panel
        ref={ref}
        {...props}
        className={cn('mt-2 outline-none focus-visible:ring-2 focus-visible:ring-ring', className)}
      />
    );
  },
);

export const Tabs = { ...BaseTabs, Root, List, Tab, Panel };
