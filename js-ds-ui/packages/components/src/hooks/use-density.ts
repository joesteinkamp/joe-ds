'use client';

import { useCallback, useEffect, useState } from 'react';

export type DensityLevel = 'compact' | 'default' | 'comfortable';

export interface UseDensityReturn {
  density: DensityLevel;
  setDensity: (density: DensityLevel) => void;
}

const STORAGE_KEY = 'js-ds-ui-density';

function isValidDensity(value: unknown): value is DensityLevel {
  return value === 'compact' || value === 'default' || value === 'comfortable';
}

/**
 * Hook for managing density state
 *
 * Syncs with localStorage and applies data-density attribute to document root.
 * Controls --density-multiplier CSS variable.
 * SSR-safe: always initializes with 'default' to avoid hydration mismatch,
 * then syncs from localStorage in useEffect.
 */
export function useDensity(): UseDensityReturn {
  const [density, setDensityState] = useState<DensityLevel>('default');

  // Sync from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (isValidDensity(stored)) {
        setDensityState(stored);
      }
    } catch {
      // localStorage unavailable (private browsing, quota exceeded, etc.)
    }
  }, []);

  // Apply density to DOM and persist
  useEffect(() => {
    document.documentElement.setAttribute('data-density', density);
    try {
      localStorage.setItem(STORAGE_KEY, density);
    } catch {
      // localStorage unavailable
    }
  }, [density]);

  const setDensity = useCallback((newDensity: DensityLevel) => {
    setDensityState(newDensity);
  }, []);

  return { density, setDensity };
}
