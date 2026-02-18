'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    className={cn(
      'overflow-hidden rounded-[var(--component-accordion-radius)] border border-[var(--component-accordion-border-color)] [border-width:var(--component-accordion-border-width)] border-solid',
      className
    )}
    {...props}
  />
));
Accordion.displayName = 'Accordion';

export interface AccordionItemProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {}

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('group', className)}
    {...props}
  />
));

AccordionItem.displayName = 'AccordionItem';

export interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex m-0">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between bg-transparent [font-size:var(--component-accordion-font-size)] p-[var(--component-accordion-padding)] [font-weight:var(--component-accordion-font-weight)] transition-all [transition-duration:var(--animation-duration-normal)] [transition-timing-function:var(--animation-easing-ease-in-out)] [&[data-state=open]>svg]:rotate-180 border-0 border-b border-solid border-[var(--component-accordion-border-color)] group-last:data-[state=closed]:border-b-0 [font-family:var(--component-accordion-font-family)]',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-[var(--component-accordion-icon-size)] w-[var(--component-accordion-icon-size)] shrink-0 transition-transform [transition-duration:var(--animation-duration-normal)]" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

export interface AccordionContentProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> {}

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden transition-all [transition-duration:var(--animation-duration-normal)] [transition-timing-function:var(--animation-easing-ease-in-out)] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('p-[var(--component-accordion-content-padding)] [font-size:var(--component-accordion-font-size)] text-[var(--component-accordion-content-text)] [font-family:var(--component-accordion-font-family)] border-0 border-b border-solid border-[var(--component-accordion-border-color)] group-last:border-b-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
