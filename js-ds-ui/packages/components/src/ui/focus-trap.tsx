'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

const FOCUSABLE_SELECTOR =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

export interface FocusTrapProps {
  /** Whether the focus trap is active */
  active?: boolean;
  /** Return focus to previously focused element on deactivate */
  returnFocusOnDeactivate?: boolean;
  /** Initial element to focus (CSS selector) */
  initialFocus?: string;
  /** Allow clicking outside the trap to deactivate */
  clickOutsideDeactivates?: boolean;
  /** Called when Escape is pressed */
  onEscapeKey?: () => void;
  /** Children to trap focus within */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
}

const FocusTrap = React.forwardRef<HTMLDivElement, FocusTrapProps>(
  (
    {
      active = true,
      returnFocusOnDeactivate = true,
      initialFocus,
      clickOutsideDeactivates = false,
      onEscapeKey,
      children,
      className,
    },
    ref
  ) => {
    const internalRef = React.useRef<HTMLDivElement>(null);
    const previouslyFocusedRef = React.useRef<Element | null>(null);

    // Merge the forwarded ref with the internal ref
    const containerRef = React.useMemo(() => {
      return (node: HTMLDivElement | null) => {
        internalRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      };
    }, [ref]);

    React.useEffect(() => {
      if (!active) {
        return;
      }

      const container = internalRef.current;
      if (!container) {
        return;
      }

      // Store the previously focused element
      previouslyFocusedRef.current = document.activeElement;

      // Set initial focus
      const setInitialFocus = () => {
        if (initialFocus) {
          const initialElement = container.querySelector<HTMLElement>(initialFocus);
          if (initialElement) {
            initialElement.focus();
            return;
          }
        }

        const focusableElements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      };

      setInitialFocus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onEscapeKey?.();
          return;
        }

        if (event.key !== 'Tab') {
          return;
        }

        const focusableElements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      };

      const handleMouseDown = (event: MouseEvent) => {
        if (
          clickOutsideDeactivates &&
          container &&
          !container.contains(event.target as Node)
        ) {
          onEscapeKey?.();
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      if (clickOutsideDeactivates) {
        document.addEventListener('mousedown', handleMouseDown);
      }

      return () => {
        document.removeEventListener('keydown', handleKeyDown);

        if (clickOutsideDeactivates) {
          document.removeEventListener('mousedown', handleMouseDown);
        }

        if (returnFocusOnDeactivate && previouslyFocusedRef.current) {
          (previouslyFocusedRef.current as HTMLElement).focus?.();
        }
      };
    }, [active, initialFocus, returnFocusOnDeactivate, clickOutsideDeactivates, onEscapeKey]);

    return (
      <div ref={containerRef} className={cn(className)}>
        {children}
      </div>
    );
  }
);

FocusTrap.displayName = 'FocusTrap';

export { FocusTrap };
