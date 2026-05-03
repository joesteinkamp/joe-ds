'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui-components/react/alert-dialog';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Backdrop = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseAlertDialog.Backdrop>
>(function AlertDialogBackdrop({ className, ...props }, ref) {
  // @ts-ignore — ref polymorphism
  return (
    <BaseAlertDialog.Backdrop
      ref={ref}
      {...props}
      className={cn(
        'fixed inset-0 z-50 bg-[var(--alert-dialog-backdrop-bg)] backdrop-blur-sm',
        className,
      )}
    />
  );
});

const Popup = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseAlertDialog.Popup>>(
  function AlertDialogPopup({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseAlertDialog.Popup
        ref={ref}
        {...props}
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2',
          'rounded-lg border border-[var(--alert-dialog-border)] bg-[var(--alert-dialog-bg)] p-6 text-fg-default shadow-xl outline-none',
          className,
        )}
      />
    );
  },
);

const Title = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<typeof BaseAlertDialog.Title>
>(function AlertDialogTitle({ className, ...props }, ref) {
  // @ts-ignore — ref polymorphism
  return (
    <BaseAlertDialog.Title
      ref={ref}
      {...props}
      className={cn('text-lg font-semibold text-fg-default', className)}
    />
  );
});

const Description = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof BaseAlertDialog.Description>
>(function AlertDialogDescription({ className, ...props }, ref) {
  // @ts-ignore — ref polymorphism
  return (
    <BaseAlertDialog.Description
      ref={ref}
      {...props}
      className={cn('mt-2 text-sm text-fg-muted', className)}
    />
  );
});

export const AlertDialog = { ...BaseAlertDialog, Backdrop, Popup, Title, Description };
