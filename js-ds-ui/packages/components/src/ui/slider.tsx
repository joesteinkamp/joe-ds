'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '../lib/utils';

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {}

/**
 * Slider component for selecting a value from a range
 *
 * @example
 * ```tsx
 * <Slider
 *   defaultValue={[50]}
 *   max={100}
 *   step={1}
 *   className="w-[60%]"
 * />
 * ```
 */
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-[var(--component-slider-track-height,0.5rem)] w-full grow overflow-hidden rounded-[var(--component-slider-border-radius,9999px)] bg-[var(--component-slider-track-bg)]">
      <SliderPrimitive.Range className="absolute h-full bg-[var(--component-slider-range-bg)]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-[var(--component-slider-thumb-size,1.25rem)] w-[var(--component-slider-thumb-size,1.25rem)] rounded-[var(--component-slider-border-radius,9999px)] border-[length:var(--component-slider-thumb-border-width,2px)] border-[var(--component-slider-thumb-border)] bg-[var(--component-slider-thumb-bg)] ring-offset-background transition-colors [transition-duration:var(--animation-duration-normal)] [transition-timing-function:var(--animation-easing-ease-in-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--component-slider-focus-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
