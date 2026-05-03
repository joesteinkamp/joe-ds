'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle(): React.ReactNode {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const next = (resolvedTheme ?? theme) === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="rounded-md border border-border-default bg-bg-default px-3 py-1.5 text-sm font-medium transition-colors hover:bg-bg-subtle"
    >
      {next === 'dark' ? 'Dark' : 'Light'}
    </button>
  );
}
