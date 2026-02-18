'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const iconVariants = cva('inline-flex shrink-0', {
  variants: {
    size: {
      xs: 'h-[var(--component-icon-size-xs,1rem)] w-[var(--component-icon-size-xs,1rem)]',
      sm: 'h-[var(--component-icon-size-sm,1.25rem)] w-[var(--component-icon-size-sm,1.25rem)]',
      md: 'h-[var(--component-icon-size-md,1.5rem)] w-[var(--component-icon-size-md,1.5rem)]',
      lg: 'h-[var(--component-icon-size-lg,2rem)] w-[var(--component-icon-size-lg,2rem)]',
      xl: 'h-[var(--component-icon-size-xl,2.5rem)] w-[var(--component-icon-size-xl,2.5rem)]',
    },
    color: {
      current: 'text-current',
      primary: 'text-[var(--color-text-primary)]',
      secondary: 'text-[var(--color-text-secondary)]',
      tertiary: 'text-[var(--color-text-tertiary)]',
      accent: 'text-[var(--color-interactive-primary)]',
      success: 'text-[var(--color-text-success)]',
      warning: 'text-[var(--color-text-warning)]',
      error: 'text-[var(--color-text-error)]',
      info: 'text-[var(--color-text-info)]',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'current',
  },
});

export interface IconProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof iconVariants> {
  /** The icon element to render (e.g., a lucide-react icon component instance) */
  icon?: React.ReactNode;
  /** Accessible label for the icon (sets aria-label) */
  label?: string;
}

/**
 * Icon component — wrapper for SVG icons with size and color tokens
 *
 * Wraps any icon (lucide-react, custom SVG, etc.) with consistent sizing and color.
 * When used decoratively (no label), adds aria-hidden automatically.
 *
 * @example
 * ```tsx
 * import { Search, AlertCircle } from 'lucide-react';
 *
 * <Icon icon={<Search />} size="sm" />
 * <Icon icon={<AlertCircle />} color="error" label="Error" />
 * <Icon size="lg" color="accent">
 *   <Search />
 * </Icon>
 * ```
 */
const Icon = React.memo(React.forwardRef<HTMLSpanElement, IconProps>(
  ({ className, size, color, icon, label, children, ...props }, ref) => (
    <span
      ref={ref}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(iconVariants({ size, color, className }))}
      {...props}
    >
      {icon || children}
    </span>
  )
));

Icon.displayName = 'Icon';

export { Icon, iconVariants };
