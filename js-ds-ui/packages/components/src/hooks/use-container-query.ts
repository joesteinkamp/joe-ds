'use client';

import * as React from 'react';

/**
 * Hook to set up a container query context on a ref.
 * Adds `container-type: inline-size` and optionally a `container-name`.
 *
 * @example
 * ```tsx
 * const { containerRef, containerProps } = useContainerQuery({ name: 'card' });
 * return <div ref={containerRef} {...containerProps}>...</div>;
 * ```
 */
export function useContainerQuery(options?: {
  name?: string;
  type?: 'inline-size' | 'size' | 'normal';
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const containerStyle: React.CSSProperties = React.useMemo(
    () => ({
      containerType: options?.type ?? 'inline-size',
      ...(options?.name ? { containerName: options.name } : {}),
    }),
    [options?.type, options?.name]
  );

  const containerProps = React.useMemo(
    () => ({
      style: containerStyle,
    }),
    [containerStyle]
  );

  return { containerRef, containerProps, containerStyle };
}
