'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '../lib/utils';

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {}

/**
 * Switch component for boolean toggle
 *
 * Provides an on/off toggle with smooth animation
 *
 * @example
 * ```tsx
 * <div className="flex items-center space-x-2">
 *   <Switch id="airplane-mode" />
 *   <Label htmlFor="airplane-mode">Airplane Mode</Label>
 * </div>
 * ```
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-[var(--component-switch-height,1.5rem)] w-[var(--component-switch-width,2.75rem)] shrink-0 cursor-pointer items-center rounded-[var(--component-switch-border-radius,9999px)] border-2 border-transparent transition-colors [transition-duration:var(--animation-duration-normal)] [transition-timing-function:var(--animation-easing-ease-in-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--color-interactive-primary)] data-[state=unchecked]:bg-[var(--color-border-default)]',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-[var(--component-switch-thumb-size,1.25rem)] w-[var(--component-switch-thumb-size,1.25rem)] rounded-[var(--component-switch-border-radius,9999px)] bg-[var(--color-background-primary)] shadow-lg ring-0 transition-transform [transition-duration:var(--animation-duration-normal)] [transition-timing-function:var(--animation-easing-ease-in-out)] data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
      )}
    />
  </SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
