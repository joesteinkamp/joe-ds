'use client';

import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui-components/react/checkbox-group';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

export const CheckboxGroup = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof BaseCheckboxGroup>
>(function CheckboxGroup({ className, ...props }, ref) {
  return (
    // @ts-ignore — ref polymorphism
    <BaseCheckboxGroup ref={ref} {...props} className={cn('flex flex-col gap-2', className)} />
  );
});
