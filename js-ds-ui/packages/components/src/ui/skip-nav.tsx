'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export interface SkipNavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Target element ID (without #) */
  contentId?: string;
  /** Link text */
  children?: React.ReactNode;
}

export interface SkipNavContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The ID that SkipNavLink targets */
  id?: string;
}

const SkipNavLink = React.forwardRef<HTMLAnchorElement, SkipNavLinkProps>(
  ({ contentId = 'skip-nav-content', children = 'Skip to main content', className, ...props }, ref) => (
    <a
      ref={ref}
      href={`#${contentId}`}
      className={cn(
        'fixed left-4 top-4 z-[var(--z-index-overlay,1070)] -translate-y-full rounded-[var(--component-button-border-radius,0.375rem)] bg-[var(--color-background-primary)] px-4 py-2 [font-size:var(--font-size-sm)] [font-weight:var(--font-weight-semibold)] text-[var(--color-interactive-primary)] shadow-lg ring-2 ring-[var(--color-border-focus)] transition-transform focus:translate-y-0 focus:outline-none',
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
);
SkipNavLink.displayName = 'SkipNavLink';

const SkipNavContent = React.forwardRef<HTMLDivElement, SkipNavContentProps>(
  ({ id = 'skip-nav-content', className, ...props }, ref) => (
    <div
      ref={ref}
      id={id}
      tabIndex={-1}
      className={cn('outline-none', className)}
      {...props}
    />
  )
);
SkipNavContent.displayName = 'SkipNavContent';

export { SkipNavLink, SkipNavContent };
