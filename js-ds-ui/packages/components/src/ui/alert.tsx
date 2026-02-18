'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const alertVariants = cva(
  'relative w-full rounded-[var(--component-alert-border-radius,0.5rem)] border p-[var(--component-alert-padding)] [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--component-alert-default-bg)] [color:var(--component-alert-default-text)] border-[var(--component-alert-default-border)]',
        info: 'bg-[var(--component-alert-info-bg)] [color:var(--component-alert-info-text)] border-[var(--component-alert-info-border)]',
        warning:
          'bg-[var(--component-alert-warning-bg)] [color:var(--component-alert-warning-text)] border-[var(--component-alert-warning-border)]',
        error:
          'bg-[var(--component-alert-error-bg)] [color:var(--component-alert-error-text)] border-[var(--component-alert-error-border)]',
        success:
          'bg-[var(--component-alert-success-bg)] [color:var(--component-alert-success-text)] border-[var(--component-alert-success-border)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

/**
 * Alert component for persistent messages and notifications
 *
 * @example
 * ```tsx
 * <Alert variant="info">
 *   <AlertTitle>Info</AlertTitle>
 *   <AlertDescription>This is an informational message.</AlertDescription>
 * </Alert>
 * <Alert variant="error">
 *   <AlertTitle>Error</AlertTitle>
 *   <AlertDescription>Something went wrong.</AlertDescription>
 * </Alert>
 * ```
 */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant, className }))}
      {...props}
    />
  )
);

Alert.displayName = 'Alert';

export interface AlertTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn(
        'mb-1 [font-weight:var(--component-alert-title-font-weight)] leading-none tracking-tight',
        className
      )}
      {...props}
    />
  )
);

AlertTitle.displayName = 'AlertTitle';

export interface AlertDescriptionProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const AlertDescription = React.forwardRef<HTMLDivElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        '[font-size:var(--component-alert-description-font-size)] [&_p]:leading-relaxed',
        className
      )}
      {...props}
    />
  )
);

AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription, alertVariants };
