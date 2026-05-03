'use client';

import { Input as BaseInput } from '@base-ui-components/react/input';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

export const Input = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<typeof BaseInput>>(
  function Input({ className, ...props }, ref) {
    return (
      // @ts-ignore — ref polymorphism
      <BaseInput
        ref={ref}
        {...props}
        className={cn(
          'h-9 w-full rounded-md border bg-[var(--input-bg)] text-fg-default border-[var(--input-border)] px-3 text-sm outline-none',
          'placeholder:text-fg-subtle',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-[var(--input-border-focus)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      />
    );
  },
);
