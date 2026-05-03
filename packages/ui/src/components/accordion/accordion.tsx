'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { Accordion as BaseAccordion } from '@base-ui-components/react/accordion';
// Then export a typed wrapper that consumes `var(--accordion-*)` CSS variables
// declared in accordion.tokens.json.

export interface AccordionProps {
  className?: string;
  children?: ReactNode;
}

export function Accordion({ className, children }: AccordionProps): React.ReactNode {
  return (
    <div data-component="accordion" className={cn(className)}>
      {children}
    </div>
  );
}
