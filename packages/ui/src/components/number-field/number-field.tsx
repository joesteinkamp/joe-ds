'use client';

import { NumberField as BaseNumberField } from '@base-ui-components/react/number-field';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Group = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseNumberField.Group>>(
  function NumberFieldGroup({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseNumberField.Group
        ref={ref}
        {...props}
        className={cn(
          'inline-flex items-center rounded-md border border-[var(--number-field-border)] bg-[var(--number-field-bg)]',
          className,
        )}
      />
    );
  },
);

const Input = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<typeof BaseNumberField.Input>>(
  function NumberFieldInput({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseNumberField.Input
        ref={ref}
        {...props}
        className={cn(
          'h-9 w-20 bg-transparent px-2 text-sm text-fg-default outline-none',
          className,
        )}
      />
    );
  },
);

const Increment = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof BaseNumberField.Increment>
>(function NumberFieldIncrement({ className, ...props }, ref) {
  // @ts-ignore — ref polymorphism
  return (
    <BaseNumberField.Increment
      ref={ref}
      {...props}
      className={cn(
        'inline-flex h-9 w-7 items-center justify-center text-fg-muted hover:bg-[var(--number-field-button-hover-bg)] disabled:opacity-50',
        className,
      )}
    />
  );
});

const Decrement = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof BaseNumberField.Decrement>
>(function NumberFieldDecrement({ className, ...props }, ref) {
  // @ts-ignore — ref polymorphism
  return (
    <BaseNumberField.Decrement
      ref={ref}
      {...props}
      className={cn(
        'inline-flex h-9 w-7 items-center justify-center text-fg-muted hover:bg-[var(--number-field-button-hover-bg)] disabled:opacity-50',
        className,
      )}
    />
  );
});

export const NumberField = { ...BaseNumberField, Group, Input, Increment, Decrement };
