'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import { cn } from '../lib/utils';

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {}

/**
 * Checkbox component for boolean input
 *
 * Supports checked, unchecked, and indeterminate states with full keyboard navigation
 *
 * @example
 * ```tsx
 * <Checkbox id="terms" />
 * <Label htmlFor="terms">Accept terms</Label>
 * ```
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, checked, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    checked={checked}
    className={cn(
      'peer h-[var(--component-checkbox-size,1.25rem)] w-[var(--component-checkbox-size,1.25rem)] shrink-0 rounded-[var(--component-checkbox-border-radius,0.25rem)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--color-interactive-primary)] data-[state=checked]:text-white data-[state=checked]:border-[var(--color-interactive-primary)] data-[state=indeterminate]:bg-[var(--color-interactive-primary)] data-[state=indeterminate]:text-white data-[state=indeterminate]:border-[var(--color-interactive-primary)]',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      {checked === 'indeterminate' ? (
        <Minus className="h-[var(--component-checkbox-icon-size,1rem)] w-[var(--component-checkbox-icon-size,1rem)]" strokeWidth={3} />
      ) : (
        <Check className="h-[var(--component-checkbox-icon-size,1rem)] w-[var(--component-checkbox-icon-size,1rem)]" strokeWidth={3} />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
