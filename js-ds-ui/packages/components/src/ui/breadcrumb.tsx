'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<'nav'> {}

export interface BreadcrumbListProps
  extends React.ComponentPropsWithoutRef<'ol'> {}

export interface BreadcrumbItemProps
  extends React.ComponentPropsWithoutRef<'li'> {}

export interface BreadcrumbLinkProps
  extends React.ComponentPropsWithoutRef<'a'> {
  asChild?: boolean;
}

export interface BreadcrumbPageProps
  extends React.ComponentPropsWithoutRef<'span'> {}

export interface BreadcrumbSeparatorProps
  extends React.ComponentPropsWithoutRef<'li'> {}

export interface BreadcrumbEllipsisProps
  extends React.ComponentPropsWithoutRef<'span'> {}

/**
 * Breadcrumb navigation component
 *
 * Provides a hierarchical trail of links for page navigation
 *
 * @example
 * ```tsx
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/">Home</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbPage>Current</BreadcrumbPage>
 *     </BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 * ```
 */
const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />
);

Breadcrumb.displayName = 'Breadcrumb';

const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        'flex flex-wrap items-center gap-[var(--component-breadcrumb-gap)] break-words [font-size:var(--component-breadcrumb-font-size)] text-[var(--component-breadcrumb-text)]',
        className
      )}
      {...props}
    />
  )
);

BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      className={cn('inline-flex items-center gap-[var(--component-breadcrumb-gap)]', className)}
      {...props}
    />
  )
);

BreadcrumbItem.displayName = 'BreadcrumbItem';

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';
    return (
      <Comp
        ref={ref}
        className={cn(
          'transition-colors text-[var(--component-breadcrumb-text)] hover:text-[var(--component-breadcrumb-text-hover)]',
          className
        )}
        {...props}
      />
    );
  }
);

BreadcrumbLink.displayName = 'BreadcrumbLink';

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        '[font-weight:var(--component-breadcrumb-font-weight)] text-[var(--component-breadcrumb-current-text)]',
        className
      )}
      {...props}
    />
  )
);

BreadcrumbPage.displayName = 'BreadcrumbPage';

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<'li'>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('[&>svg]:h-3.5 [&>svg]:w-3.5', className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn(
      'flex h-9 w-9 items-center justify-center',
      className
    )}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);

BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
