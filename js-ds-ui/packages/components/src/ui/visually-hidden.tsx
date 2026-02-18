'use client';

import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';

/**
 * VisuallyHidden component for screen reader only content
 *
 * Hides content visually but keeps it accessible to screen readers
 *
 * @example
 * ```tsx
 * <button>
 *   <Icon name="close" />
 *   <VisuallyHidden>Close</VisuallyHidden>
 * </button>
 * ```
 */
const VisuallyHidden = VisuallyHiddenPrimitive.Root;

export { VisuallyHidden };
