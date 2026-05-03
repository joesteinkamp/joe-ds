'use client';

import { Fieldset as BaseFieldset } from '@base-ui-components/react/fieldset';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Root = forwardRef<HTMLFieldSetElement, ComponentPropsWithoutRef<typeof BaseFieldset.Root>>(
  function FieldsetRoot({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseFieldset.Root
        ref={ref}
        {...props}
        className={cn(
          'flex flex-col gap-3 rounded-md border border-[var(--fieldset-border)] p-4',
          className,
        )}
      />
    );
  },
);

const Legend = forwardRef<HTMLLegendElement, ComponentPropsWithoutRef<typeof BaseFieldset.Legend>>(
  function FieldsetLegend({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseFieldset.Legend
        ref={ref}
        {...props}
        className={cn('px-1 text-sm font-medium text-fg-default', className)}
      />
    );
  },
);

export const Fieldset = { ...BaseFieldset, Root, Legend };
