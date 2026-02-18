'use client';

import * as React from 'react';
import { Button } from './button';

export interface ConfirmDialogProps {
  /** Whether the dialog is open */
  open?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Dialog title */
  title: string;
  /** Dialog description */
  description?: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Called when user confirms */
  onConfirm?: () => void;
  /** Called when user cancels */
  onCancel?: () => void;
  /** Visual variant for the confirm button */
  variant?: 'default' | 'danger';
  /** Whether the confirm action is loading */
  loading?: boolean;
  /** Optional trigger element */
  trigger?: React.ReactNode;
  /** Additional content between description and buttons */
  children?: React.ReactNode;
}

/**
 * ConfirmDialog component — pre-built confirmation dialog
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   trigger={<Button variant="danger">Delete</Button>}
 *   title="Delete item?"
 *   description="This action cannot be undone."
 *   confirmText="Delete"
 *   variant="danger"
 *   onConfirm={() => deleteItem()}
 * />
 * ```
 */
const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  loading = false,
  trigger,
  children,
}: ConfirmDialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = React.useCallback(
    (value: boolean) => {
      if (!isControlled) setInternalOpen(value);
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange]
  );

  const handleConfirm = React.useCallback(() => {
    onConfirm?.();
    if (!loading) handleOpenChange(false);
  }, [onConfirm, loading, handleOpenChange]);

  const handleCancel = React.useCallback(() => {
    onCancel?.();
    handleOpenChange(false);
  }, [onCancel, handleOpenChange]);

  return (
    <>
      {trigger && (
        <span onClick={() => handleOpenChange(true)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpenChange(true); }}>
          {trigger}
        </span>
      )}
      {isOpen && (
        <div
          className="fixed inset-0 z-[var(--z-index-modal-backdrop,1040)]"
          aria-hidden
        >
          <div
            className="fixed inset-0 bg-black/80"
            onClick={() => handleOpenChange(false)}
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby={description ? 'confirm-dialog-description' : undefined}
            className="fixed left-[50%] top-[50%] z-[var(--z-index-modal,1050)] w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg border border-[var(--component-confirm-dialog-border)] bg-[var(--component-confirm-dialog-bg)] p-[var(--component-confirm-dialog-padding,1.5rem)] shadow-lg"
          >
            <h2
              id="confirm-dialog-title"
              className="[font-size:var(--component-confirm-dialog-title-font-size)] [font-weight:var(--component-confirm-dialog-title-font-weight)] text-[var(--color-text-primary)] leading-none tracking-tight"
            >
              {title}
            </h2>
            {description && (
              <p
                id="confirm-dialog-description"
                className="mt-2 [font-size:var(--component-confirm-dialog-description-font-size)] text-[var(--color-text-secondary)]"
              >
                {description}
              </p>
            )}
            {children && <div className="mt-4">{children}</div>}
            <div className="mt-6 flex justify-end gap-[var(--component-confirm-dialog-footer-gap,0.5rem)]">
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                {cancelText}
              </Button>
              <Button
                variant={variant === 'danger' ? 'danger' : 'primary'}
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading && (
                  <svg className="mr-2 inline-block h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ConfirmDialog.displayName = 'ConfirmDialog';

export { ConfirmDialog };
