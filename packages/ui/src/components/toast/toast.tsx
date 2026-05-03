'use client';

import { Toast as BaseToast } from '@base-ui-components/react/toast';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Viewport = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseToast.Viewport>>(
  function ToastViewport({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseToast.Viewport
        ref={ref}
        {...props}
        className={cn(
          'fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2 outline-none',
          className,
        )}
      />
    );
  },
);

const Root = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseToast.Root>>(
  function ToastRoot({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseToast.Root
        ref={ref}
        {...props}
        className={cn(
          'pointer-events-auto rounded-md border border-[var(--toast-border)] bg-[var(--toast-bg)] p-4 text-sm text-fg-default shadow-lg shadow-black/5 outline-none',
          className,
        )}
      />
    );
  },
);

const Title = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseToast.Title>>(
  function ToastTitle({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseToast.Title
        ref={ref}
        {...props}
        className={cn('text-sm font-semibold text-fg-default', className)}
      />
    );
  },
);

const Description = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseToast.Description>
>(function ToastDescription({ className, ...props }, ref) {
  // @ts-ignore — ref polymorphism
  return (
    <BaseToast.Description
      ref={ref}
      {...props}
      className={cn('text-sm text-fg-muted', className)}
    />
  );
});

export const Toast = { ...BaseToast, Viewport, Root, Title, Description };
