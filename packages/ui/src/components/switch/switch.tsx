'use client';

import { Switch as BaseSwitch } from '@base-ui-components/react/switch';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Root = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof BaseSwitch.Root>>(
  function SwitchRoot({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseSwitch.Root
        ref={ref}
        {...props}
        className={cn(
          'inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent outline-none transition-colors',
          'bg-[var(--switch-bg)]',
          'focus-visible:ring-2 focus-visible:ring-ring',
          'data-[checked]:bg-[var(--switch-checked-bg)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      />
    );
  },
);

const Thumb = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseSwitch.Thumb>>(
  function SwitchThumb({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseSwitch.Thumb
        ref={ref}
        {...props}
        className={cn(
          'pointer-events-none block h-4 w-4 translate-x-0 rounded-full bg-[var(--switch-thumb-bg)] shadow ring-0 transition-transform',
          'data-[checked]:translate-x-4',
          className,
        )}
      />
    );
  },
);

export const Switch = { ...BaseSwitch, Root, Thumb };
