'use client';

import { Form as BaseForm } from '@base-ui-components/react/form';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

export const Form = forwardRef<HTMLFormElement, ComponentPropsWithoutRef<typeof BaseForm>>(
  function Form({ className, ...props }, ref) {
    return (
      // @ts-ignore — ref polymorphism
      <BaseForm ref={ref} {...props} className={cn('flex flex-col gap-4', className)} />
    );
  },
);
