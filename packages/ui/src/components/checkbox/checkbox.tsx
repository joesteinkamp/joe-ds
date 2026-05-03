'use client';

import { Checkbox as BaseCheckbox } from '@base-ui-components/react/checkbox';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Root = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof BaseCheckbox.Root>>(
  function CheckboxRoot({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseCheckbox.Root
        ref={ref}
        {...props}
        className={cn(
          'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border outline-none transition-colors',
          'border-[var(--checkbox-border)] bg-[var(--checkbox-bg)]',
          'focus-visible:ring-2 focus-visible:ring-ring',
          'data-[checked]:border-[var(--checkbox-checked-bg)] data-[checked]:bg-[var(--checkbox-checked-bg)]',
          'data-[indeterminate]:border-[var(--checkbox-checked-bg)] data-[indeterminate]:bg-[var(--checkbox-checked-bg)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      />
    );
  },
);

const Indicator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseCheckbox.Indicator>
>(function CheckboxIndicator({ className, ...props }, ref) {
  // @ts-ignore — ref polymorphism
  return (
    <BaseCheckbox.Indicator
      ref={ref}
      {...props}
      className={cn(
        'flex items-center justify-center text-[var(--checkbox-checked-fg)]',
        className,
      )}
    />
  );
});

export const Checkbox = { ...BaseCheckbox, Root, Indicator };
