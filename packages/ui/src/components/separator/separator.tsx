'use client';

import { Separator as BaseSeparator } from '@base-ui-components/react/separator';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

export const Separator = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseSeparator>>(
  function Separator({ className, ...props }, ref) {
    return (
      // @ts-ignore — ref polymorphism
      <BaseSeparator
        ref={ref}
        {...props}
        className={cn(
          'shrink-0 bg-[var(--separator-bg)]',
          'data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full',
          'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
          className,
        )}
      />
    );
  },
);
