'use client';

import { RadioGroup as BaseRadioGroup } from '@base-ui-components/react/radio-group';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

export const RadioGroup = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseRadioGroup>
>(function RadioGroup({ className, ...props }, ref) {
  return (
    // @ts-ignore — ref polymorphism
    <BaseRadioGroup ref={ref} {...props} className={cn('flex flex-col gap-2', className)} />
  );
});
