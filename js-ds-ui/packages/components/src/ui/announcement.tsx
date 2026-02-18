'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export type AnnouncementPoliteness = 'polite' | 'assertive';

export interface AnnouncementProps {
  /** The message to announce */
  message?: string;
  /** Politeness level — 'polite' waits for idle, 'assertive' interrupts */
  politeness?: AnnouncementPoliteness;
  /** Clear the announcement after this many milliseconds */
  clearAfterMs?: number;
  /** Additional className for the visually-hidden container */
  className?: string;
}

/**
 * Announcement component — screen reader live region
 *
 * Renders a visually hidden aria-live region. When `message` changes,
 * screen readers announce the new content.
 */
const Announcement = React.forwardRef<HTMLDivElement, AnnouncementProps>(
  (
    {
      message = '',
      politeness = 'polite',
      clearAfterMs,
      className,
      ...props
    },
    ref
  ) => {
    const [current, setCurrent] = React.useState(message);

    React.useEffect(() => {
      setCurrent(message);

      if (clearAfterMs && message) {
        const timer = setTimeout(() => setCurrent(''), clearAfterMs);
        return () => clearTimeout(timer);
      }
    }, [message, clearAfterMs]);

    return (
      <div
        ref={ref}
        role="status"
        aria-live={politeness}
        aria-atomic="true"
        className={cn(
          'sr-only pointer-events-none fixed left-0 top-0 h-px w-px overflow-hidden',
          className
        )}
        style={{
          clip: 'rect(0, 0, 0, 0)',
          clipPath: 'inset(50%)',
          whiteSpace: 'nowrap',
        }}
        {...props}
      >
        {current}
      </div>
    );
  }
);

Announcement.displayName = 'Announcement';

export { Announcement };
