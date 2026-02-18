'use client';

import * as React from 'react';

/**
 * Hook to detect CSS feature support at runtime.
 *
 * @example
 * ```tsx
 * const supportsContainerQueries = useCSSSupports('container-type: inline-size');
 * const supportsHas = useCSSSupports('selector(:has(*))');
 * ```
 */
export function useCSSSupports(query: string): boolean {
  const [supported, setSupported] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'CSS' in window && 'supports' in CSS) {
      setSupported(CSS.supports(query));
    }
  }, [query]);

  return supported;
}

/**
 * Hook to detect prefers-reduced-motion media query.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

/**
 * Hook to detect prefers-color-scheme media query.
 */
export function usePrefersColorScheme(): 'light' | 'dark' {
  const [scheme, setScheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setScheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (event: MediaQueryListEvent) => {
      setScheme(event.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return scheme;
}
