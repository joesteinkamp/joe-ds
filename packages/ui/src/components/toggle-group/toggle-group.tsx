'use client';

import { ToggleGroup as BaseToggleGroup } from '@base-ui-components/react/toggle-group';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

export const ToggleGroup = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseToggleGroup>
>(function ToggleGroup({ className, ...props }, ref) {
  return (
    // @ts-ignore — ref polymorphism
    <BaseToggleGroup
      ref={ref}
      {...props}
      className={cn(
        'inline-flex items-center gap-1 rounded-md bg-[var(--toggle-group-bg)] p-1',
        className,
      )}
    />
  );
});
