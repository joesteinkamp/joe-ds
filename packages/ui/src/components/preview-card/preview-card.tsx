'use client';

import { PreviewCard as BasePreviewCard } from '@base-ui-components/react/preview-card';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Popup = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof BasePreviewCard.Popup>>(
  function PreviewCardPopup({ className, ...props }, ref) {
    // @ts-ignore — ref polymorphism
    return (
      <BasePreviewCard.Popup
        ref={ref}
        {...props}
        className={cn(
          'rounded-md border border-[var(--preview-card-border)] bg-[var(--preview-card-bg)] p-3 text-sm text-fg-default outline-none',
          'shadow-lg shadow-black/5',
          className,
        )}
      />
    );
  },
);

export const PreviewCard = { ...BasePreviewCard, Popup };
