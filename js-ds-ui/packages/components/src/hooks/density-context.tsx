'use client';

import * as React from 'react';
import type { DensityLevel } from './use-density';

interface DensityContextValue {
  density: DensityLevel;
  setDensity: (density: DensityLevel) => void;
}

const DensityContext = React.createContext<DensityContextValue | null>(null);

const STORAGE_KEY = 'js-ds-ui-density';

function isValidDensity(value: unknown): value is DensityLevel {
  return value === 'compact' || value === 'default' || value === 'comfortable';
}

export interface DensityProviderProps {
  children: React.ReactNode;
  /** Initial density. Defaults to 'default' for SSR safety. */
  defaultDensity?: DensityLevel;
}

/**
 * Provides density context to the component tree.
 *
 * Wraps the existing useDensity behavior in a React context so all consumers
 * share a single source of truth. SSR-safe — initializes with defaultDensity
 * and syncs from localStorage after mount.
 *
 * @example
 * ```tsx
 * <DensityProvider>
 *   <App />
 * </DensityProvider>
 * ```
 */
export function DensityProvider({ children, defaultDensity = 'default' }: DensityProviderProps) {
  const [density, setDensityState] = React.useState<DensityLevel>(defaultDensity);

  // Sync from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (isValidDensity(stored)) {
        setDensityState(stored);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  // Apply density to DOM and persist
  React.useEffect(() => {
    document.documentElement.setAttribute('data-density', density);
    try {
      localStorage.setItem(STORAGE_KEY, density);
    } catch {
      // localStorage unavailable
    }
  }, [density]);

  const setDensity = React.useCallback((newDensity: DensityLevel) => {
    setDensityState(newDensity);
  }, []);

  const value = React.useMemo(() => ({ density, setDensity }), [density, setDensity]);

  return (
    <DensityContext.Provider value={value}>
      {children}
    </DensityContext.Provider>
  );
}

/**
 * Access density from the nearest DensityProvider.
 * Throws if no provider is present.
 */
export function useDensityContext(): DensityContextValue {
  const context = React.useContext(DensityContext);
  if (!context) {
    throw new Error('useDensityContext must be used within a <DensityProvider>');
  }
  return context;
}

export { DensityContext };
