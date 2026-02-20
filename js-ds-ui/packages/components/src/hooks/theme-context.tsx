'use client';

import * as React from 'react';
import type { ThemeMode } from './use-theme';

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'js-ds-ui-theme';

function isValidTheme(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'high-contrast';
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** Initial theme. Defaults to 'light' for SSR safety. */
  defaultTheme?: ThemeMode;
}

/**
 * Provides theme context to the component tree.
 *
 * Wraps the existing useTheme behavior in a React context so all consumers
 * share a single source of truth. SSR-safe — initializes with defaultTheme
 * and syncs from localStorage/system preference after mount.
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<ThemeMode>(defaultTheme);

  // Sync from localStorage / system preference on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (isValidTheme(stored)) {
        setThemeState(stored);
        return;
      }
    } catch {
      // localStorage unavailable
    }

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('dark');
    }
  }, []);

  // Apply theme to DOM and persist
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage unavailable
    }
  }, [theme]);

  const setTheme = React.useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  const value = React.useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Access theme from the nearest ThemeProvider.
 * Falls back to standalone localStorage behavior if no provider is present.
 */
export function useThemeContext(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a <ThemeProvider>');
  }
  return context;
}

export { ThemeContext };
