'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

// Scaffolded placeholder. Replace the body with composed Base UI parts:
//   import { Slider as BaseSlider } from '@base-ui-components/react/slider';
// Then export a typed wrapper that consumes `var(--slider-*)` CSS variables
// declared in slider.tokens.json.

export interface SliderProps {
  className?: string;
  children?: ReactNode;
}

export function Slider({ className, children }: SliderProps): React.ReactNode {
  return (
    <div data-component="slider" className={cn(className)}>
      {children}
    </div>
  );
}
