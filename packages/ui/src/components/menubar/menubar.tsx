'use client';

import { Menubar as BaseMenubar } from '@base-ui-components/react/menubar';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

export const Menubar = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseMenubar>>(
  function Menubar({ className, ...props }, ref) {
    return (
      // @ts-ignore — ref polymorphism
      <BaseMenubar
        ref={ref}
        {...props}
        className={cn(
          'inline-flex items-center gap-1 rounded-md border border-[var(--menubar-border)] bg-[var(--menubar-bg)] p-1',
          className,
        )}
      />
    );
  },
);
