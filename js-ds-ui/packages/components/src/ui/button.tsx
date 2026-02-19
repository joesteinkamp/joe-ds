'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-[var(--component-button-gap)] rounded-[var(--component-button-border-radius)] [font-weight:var(--component-button-font-weight)] transition-colors [transition-duration:var(--animation-duration-normal)] [transition-timing-function:var(--animation-easing-ease-in-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-[length:var(--component-button-border-width)]',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--component-button-primary-bg)] text-white hover:bg-[var(--component-button-primary-bg-hover)] active:bg-[var(--component-button-primary-bg-active)] focus-visible:ring-[var(--color-border-focus)] border-transparent',
        secondary:
          'bg-[var(--component-button-secondary-bg)] [color:var(--component-button-secondary-text)] hover:bg-[var(--component-button-secondary-bg-hover)] border-[var(--component-button-secondary-border)] focus-visible:ring-[var(--color-border-focus)]',
        outline:
          'border-[var(--component-button-outline-border)] bg-transparent hover:bg-[var(--component-button-outline-bg-hover)] focus-visible:ring-[var(--color-border-focus)]',
        ghost: 'bg-[var(--component-button-ghost-bg)] hover:bg-[var(--component-button-ghost-bg-hover)] focus-visible:ring-[var(--color-border-focus)] border-transparent',
        danger:
          'bg-[var(--component-button-danger-bg)] text-white hover:bg-[var(--component-button-danger-bg-hover)] focus-visible:ring-[var(--component-button-danger-bg)] border-transparent',
      },
      size: {
        sm: 'h-[var(--component-button-size-sm-height)] px-[var(--component-button-size-sm-padding-x)] py-[var(--component-button-size-sm-padding-y)] [font-size:var(--component-button-size-sm-text)]',
        md: 'h-[var(--component-button-size-md-height)] px-[var(--component-button-size-md-padding-x)] py-[var(--component-button-size-md-padding-y)] [font-size:var(--component-button-size-md-text)]',
        lg: 'h-[var(--component-button-size-lg-height)] px-[var(--component-button-size-lg-padding-x)] py-[var(--component-button-size-lg-padding-y)] [font-size:var(--component-button-size-lg-text)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Render as a child element (e.g., Link) using Radix Slot
   */
  asChild?: boolean;
}

/**
 * Button component with multiple variants and sizes
 *
 * @example
 * ```tsx
 * <Button variant="primary">Click me</Button>
 * <Button variant="danger" size="lg">Delete</Button>
 * <Button asChild><Link to="/home">Home</Link></Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
