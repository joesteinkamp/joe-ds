'use client';

import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '../lib/utils';

export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {}

/**
 * Separator component for visual division
 *
 * Creates a horizontal or vertical divider line
 *
 * @example
 * ```tsx
 * <div>
 *   <p>Content above</p>
 *   <Separator className="my-4" />
 *   <p>Content below</p>
 * </div>
 * ```
 */
const Separator = React.memo(React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-[var(--color-border-default)]',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      {...props}
    />
  )
));

Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
