'use client';

import * as React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Force the link to be treated as external (opens in new tab with icon)
   */
  external?: boolean;
}

/**
 * Link component with automatic external link detection
 *
 * External links automatically open in a new tab with an icon indicator
 *
 * @example
 * ```tsx
 * <Link href="/about">About</Link>
 * <Link href="https://example.com">External</Link>
 * <Link href="/docs" external>Force external</Link>
 * ```
 */
const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, external, children, href, ...props }, ref) => {
    const isExternal =
      external ?? (href?.startsWith('http') || href?.startsWith('//'));
    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          'inline-flex items-center gap-1 text-[var(--color-interactive-primary)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2',
          className
        )}
        {...(isExternal
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        {...props}
      >
        {children}
        {isExternal && <ExternalLink className="h-3 w-3" />}
      </a>
    );
  }
);

Link.displayName = 'Link';

export { Link };
