'use client';

import { useCallback, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'high-contrast';

export interface UseThemeReturn {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const STORAGE_KEY = 'js-ds-ui-theme';

function isValidTheme(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'high-contrast';
}

/**
 * Hook for managing theme state
 *
 * Syncs with localStorage and applies data-theme attribute to document root.
 * SSR-safe: always initializes with 'light' to avoid hydration mismatch,
 * then syncs from localStorage/system preference in useEffect.
 */
export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<ThemeMode>('light');

  // Sync from localStorage / system preference on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (isValidTheme(stored)) {
        setThemeState(stored);
        return;
      }
    } catch {
      // localStorage unavailable (private browsing, quota exceeded, etc.)
    }

    // Detect system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('dark');
    }
  }, []);

  // Apply theme to DOM and persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage unavailable
    }
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  return { theme, setTheme };
}
