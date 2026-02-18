'use client';

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

/**
 * Collapsible component for expanding/collapsing content
 *
 * @example
 * ```tsx
 * <Collapsible>
 *   <CollapsibleTrigger asChild>
 *     <Button variant="ghost">Toggle</Button>
 *   </CollapsibleTrigger>
 *   <CollapsibleContent>
 *     <p>Hidden content goes here</p>
 *   </CollapsibleContent>
 * </Collapsible>
 * ```
 */
const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
