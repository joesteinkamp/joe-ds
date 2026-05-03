'use client';

import { Radio as BaseRadio } from '@base-ui-components/react/radio';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Root = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof BaseRadio.Root>>(
  function RadioRoot({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseRadio.Root
        ref={ref}
        {...props}
        className={cn(
          'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border outline-none transition-colors',
          'border-[var(--radio-border)] bg-[var(--radio-bg)]',
          'focus-visible:ring-2 focus-visible:ring-ring',
          'data-[checked]:border-[var(--radio-checked-border)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      />
    );
  },
);

const Indicator = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseRadio.Indicator>>(
  function RadioIndicator({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseRadio.Indicator
        ref={ref}
        {...props}
        className={cn('block h-2 w-2 rounded-full bg-[var(--radio-indicator-bg)]', className)}
      />
    );
  },
);

export const Radio = { ...BaseRadio, Root, Indicator };
