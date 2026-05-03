'use client';

import { Tooltip as BaseTooltip } from '@base-ui-components/react/tooltip';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Popup = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BaseTooltip.Popup>>(
  function TooltipPopup({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BaseTooltip.Popup
        ref={ref}
        {...props}
        className={cn(
          'rounded-md bg-[var(--tooltip-bg)] px-2 py-1 text-xs font-medium text-[var(--tooltip-fg)] shadow-md outline-none',
          'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity duration-100',
          className,
        )}
      />
    );
  },
);

export const Tooltip = { ...BaseTooltip, Popup };
