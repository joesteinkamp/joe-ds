'use client';

import { Slider as BaseSlider } from '@base-ui-components/react/slider';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Root = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseSlider.Root>>(
  function SliderRoot({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseSlider.Root
        ref={ref}
        {...props}
        className={cn('relative flex w-full touch-none select-none items-center', className)}
      />
    );
  },
);

const Control = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseSlider.Control>>(
  function SliderControl({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseSlider.Control
        ref={ref}
        {...props}
        className={cn('relative flex w-full items-center', className)}
      />
    );
  },
);

const Track = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseSlider.Track>>(
  function SliderTrack({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseSlider.Track
        ref={ref}
        {...props}
        className={cn(
          'relative h-1 w-full grow overflow-hidden rounded-full bg-[var(--slider-track-bg)]',
          className,
        )}
      />
    );
  },
);

const Indicator = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseSlider.Indicator>>(
  function SliderIndicator({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseSlider.Indicator
        ref={ref}
        {...props}
        className={cn('absolute h-full bg-[var(--slider-indicator-bg)]', className)}
      />
    );
  },
);

const Thumb = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseSlider.Thumb>>(
  function SliderThumb({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseSlider.Thumb
        ref={ref}
        {...props}
        className={cn(
          'block h-4 w-4 rounded-full border bg-[var(--slider-thumb-bg)] border-[var(--slider-thumb-border)] shadow outline-none',
          'focus-visible:ring-2 focus-visible:ring-ring',
          className,
        )}
      />
    );
  },
);

export const Slider = { ...BaseSlider, Root, Control, Track, Indicator, Thumb };
