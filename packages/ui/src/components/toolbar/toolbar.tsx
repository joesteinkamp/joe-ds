'use client';

import { Toolbar as BaseToolbar } from '@base-ui-components/react/toolbar';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Root = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseToolbar.Root>>(
  function ToolbarRoot({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseToolbar.Root
        ref={ref}
        {...props}
        className={cn(
          'inline-flex items-center gap-1 rounded-md border border-[var(--toolbar-border)] bg-[var(--toolbar-bg)] p-1',
          className,
        )}
      />
    );
  },
);

const Group = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseToolbar.Group>>(
  function ToolbarGroup({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseToolbar.Group
        ref={ref}
        {...props}
        className={cn('flex items-center gap-0.5', className)}
      />
    );
  },
);

const Button = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof BaseToolbar.Button>>(
  function ToolbarButton({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseToolbar.Button
        ref={ref}
        {...props}
        className={cn(
          'inline-flex h-8 items-center justify-center rounded-sm px-2 text-sm font-medium text-fg-default outline-none transition-colors',
          'hover:bg-[var(--toolbar-button-hover-bg)] focus-visible:ring-2 focus-visible:ring-ring',
          'data-[pressed]:bg-[var(--toolbar-button-pressed-bg)]',
          className,
        )}
      />
    );
  },
);

const Link = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<typeof BaseToolbar.Link>>(
  function ToolbarLink({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseToolbar.Link
        ref={ref}
        {...props}
        className={cn(
          'inline-flex h-8 items-center px-2 text-sm font-medium text-fg-default underline-offset-2 hover:underline',
          className,
        )}
      />
    );
  },
);

const Input = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<typeof BaseToolbar.Input>>(
  function ToolbarInput({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseToolbar.Input
        ref={ref}
        {...props}
        className={cn(
          'h-8 rounded-sm border border-border-default bg-bg-default px-2 text-sm outline-none',
          className,
        )}
      />
    );
  },
);

const Separator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseToolbar.Separator>
>(function ToolbarSeparator({ className, ...props }, ref) {
  // @ts-ignore — ref polymorphism
  return (
    <BaseToolbar.Separator
      ref={ref}
      {...props}
      className={cn('mx-1 h-5 w-px bg-[var(--toolbar-separator-bg)]', className)}
    />
  );
});

export const Toolbar = { ...BaseToolbar, Root, Group, Button, Link, Input, Separator };
