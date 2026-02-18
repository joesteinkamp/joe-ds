'use client';

import * as React from 'react';
import * as ToolbarPrimitive from '@radix-ui/react-toolbar';
import { cn } from '../lib/utils';

const Toolbar = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Root
    ref={ref}
    className={cn(
      'flex w-full min-w-max space-x-[var(--space-component-gap-sm)] rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-1',
      className
    )}
    {...props}
  />
));

Toolbar.displayName = ToolbarPrimitive.Root.displayName;

const ToolbarButton = ToolbarPrimitive.Button;
const ToolbarLink = ToolbarPrimitive.Link;
const ToolbarToggleGroup = ToolbarPrimitive.ToggleGroup;
const ToolbarToggleItem = ToolbarPrimitive.ToggleItem;
const ToolbarSeparator = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Separator
    ref={ref}
    className={cn('mx-2 w-[1px] bg-[var(--color-border-default)]', className)}
    {...props}
  />
));

ToolbarSeparator.displayName = ToolbarPrimitive.Separator.displayName;

export {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
};
