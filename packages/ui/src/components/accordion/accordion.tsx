'use client';

import { Accordion as BaseAccordion } from '@base-ui-components/react/accordion';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Root = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseAccordion.Root>>(
  function AccordionRoot({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return <BaseAccordion.Root ref={ref} {...props} className={cn('w-full', className)} />;
  },
);

const Item = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseAccordion.Item>>(
  function AccordionItem({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseAccordion.Item
        ref={ref}
        {...props}
        className={cn('border-b border-[var(--accordion-border)] last:border-b-0', className)}
      />
    );
  },
);

const Trigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof BaseAccordion.Trigger>
>(function AccordionTrigger({ className, ...props }, ref) {
  // @ts-ignore — ref polymorphism
  return (
    <BaseAccordion.Trigger
      ref={ref}
      {...props}
      className={cn(
        'flex w-full items-center justify-between py-3 text-sm font-medium text-fg-default outline-none transition-colors',
        'hover:text-fg-default focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    />
  );
});

const Panel = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseAccordion.Panel>>(
  function AccordionPanel({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseAccordion.Panel
        ref={ref}
        {...props}
        className={cn('overflow-hidden text-sm text-fg-muted pb-3', className)}
      />
    );
  },
);

export const Accordion = {
  ...BaseAccordion,
  Root,
  Item,
  Trigger,
  Panel,
};
