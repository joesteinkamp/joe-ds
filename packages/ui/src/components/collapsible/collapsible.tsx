'use client';

import { Collapsible as BaseCollapsible } from '@base-ui-components/react/collapsible';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Trigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof BaseCollapsible.Trigger>
>(function CollapsibleTrigger({ className, ...props }, ref) {
  // @ts-ignore — ref polymorphism
  return (
    <BaseCollapsible.Trigger
      ref={ref}
      {...props}
      className={cn(
        'inline-flex items-center gap-1 text-sm font-medium text-fg-default outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    />
  );
});

const Panel = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseCollapsible.Panel>>(
  function CollapsiblePanel({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseCollapsible.Panel
        ref={ref}
        {...props}
        className={cn('overflow-hidden text-sm text-fg-muted', className)}
      />
    );
  },
);

export const Collapsible = { ...BaseCollapsible, Trigger, Panel };
