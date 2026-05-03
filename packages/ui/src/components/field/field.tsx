'use client';

import { Field as BaseField } from '@base-ui-components/react/field';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Root = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseField.Root>>(
  function FieldRoot({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseField.Root ref={ref} {...props} className={cn('flex flex-col gap-1.5', className)} />
    );
  },
);

const Label = forwardRef<HTMLLabelElement, ComponentPropsWithoutRef<typeof BaseField.Label>>(
  function FieldLabel({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseField.Label
        ref={ref}
        {...props}
        className={cn('text-sm font-medium text-fg-default', className)}
      />
    );
  },
);

const Description = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof BaseField.Description>
>(function FieldDescription({ className, ...props }, ref) {
  // @ts-ignore — ref polymorphism
  return (
    <BaseField.Description
      ref={ref}
      {...props}
      className={cn('text-xs text-fg-muted', className)}
    />
  );
});

const FieldError = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseField.Error>>(
  function FieldError({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseField.Error ref={ref} {...props} className={cn('text-xs text-danger', className)} />
    );
  },
);

const Control = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<typeof BaseField.Control>>(
  function FieldControl({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseField.Control
        ref={ref}
        {...props}
        className={cn(
          'h-9 w-full rounded-md border border-border-default bg-bg-default px-3 text-sm outline-none',
          'placeholder:text-fg-subtle',
          'focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      />
    );
  },
);

export const Field = { ...BaseField, Root, Label, Description, Error: FieldError, Control };
