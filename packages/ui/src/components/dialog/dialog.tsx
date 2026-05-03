'use client';

import { Dialog as BaseDialog } from '@base-ui-components/react/dialog';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Backdrop = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseDialog.Backdrop>>(
  function DialogBackdrop({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseDialog.Backdrop
        ref={ref}
        {...props}
        className={cn(
          'fixed inset-0 z-50 bg-[var(--dialog-backdrop-bg)] backdrop-blur-sm',
          'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity duration-150',
          className,
        )}
      />
    );
  },
);

const Popup = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseDialog.Popup>>(
  function DialogPopup({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseDialog.Popup
        ref={ref}
        {...props}
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
          'rounded-lg border border-[var(--dialog-border)] bg-[var(--dialog-bg)] p-6 text-fg-default shadow-xl outline-none',
          'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity duration-150',
          className,
        )}
      />
    );
  },
);

const Title = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<typeof BaseDialog.Title>>(
  function DialogTitle({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseDialog.Title
        ref={ref}
        {...props}
        className={cn('text-lg font-semibold text-fg-default', className)}
      />
    );
  },
);

const Description = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof BaseDialog.Description>
>(function DialogDescription({ className, ...props }, ref) {
  // @ts-ignore — ref polymorphism
  return (
    <BaseDialog.Description
      ref={ref}
      {...props}
      className={cn('mt-2 text-sm text-fg-muted', className)}
    />
  );
});

export const Dialog = { ...BaseDialog, Backdrop, Popup, Title, Description };
