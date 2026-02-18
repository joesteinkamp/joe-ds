'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const containerVariants = cva(
  'mx-auto w-full px-[var(--component-container-padding,2rem)]',
  {
    variants: {
      size: {
        sm: 'max-w-screen-sm',
        md: 'max-w-screen-md',
        lg: 'max-w-screen-lg',
        xl: 'max-w-screen-xl',
        '2xl': 'max-w-screen-2xl',
        full: 'max-w-full',
        prose: 'max-w-prose',
      },
      padding: {
        none: 'px-0',
        sm: 'px-[var(--component-container-padding-sm,0.5rem)]',
        md: 'px-[var(--component-container-padding-md,0.75rem)]',
        lg: 'px-[var(--component-container-padding,2rem)]',
        xl: 'px-[var(--component-container-padding-xl,4rem)]',
      },
      center: {
        true: 'flex flex-col items-center',
        false: '',
      },
    },
    defaultVariants: {
      size: 'lg',
      center: false,
    },
  }
);

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  /** Render as a different element */
  as?: React.ElementType;
}

/**
 * Container component — max-width wrapper with responsive padding
 *
 * @example
 * ```tsx
 * <Container size="lg">
 *   <h1>Page Title</h1>
 *   <p>Content within a max-width container.</p>
 * </Container>
 *
 * <Container size="prose" center>
 *   <article>Long-form content...</article>
 * </Container>
 * ```
 */
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, center, as: Comp = 'div', ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(containerVariants({ size, padding, center, className }))}
      {...props}
    />
  )
);

Container.displayName = 'Container';

export { Container, containerVariants };
