'use client';

import { Toggle as BaseToggle } from '@base-ui-components/react/toggle';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

export const Toggle = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof BaseToggle>>(
  function Toggle({ className, ...props }, ref) {
    return (
      // @ts-ignore — ref polymorphism
      <BaseToggle
        ref={ref}
        {...props}
        className={cn(
          'inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium outline-none transition-colors',
          'text-fg-default hover:bg-[var(--toggle-hover-bg)]',
          'focus-visible:ring-2 focus-visible:ring-ring',
          'data-[pressed]:bg-[var(--toggle-pressed-bg)] data-[pressed]:text-fg-default',
          'disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
      />
    );
  },
);
