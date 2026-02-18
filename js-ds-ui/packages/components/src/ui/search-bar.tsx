'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** Controlled value */
  value?: string;
  /** Called when the search value changes */
  onValueChange?: (value: string) => void;
  /** Show a loading spinner */
  loading?: boolean;
  /** Keyboard shortcut hint (e.g., "⌘K") */
  shortcutHint?: string;
  /** Called when user presses Enter */
  onSubmit?: (value: string) => void;
}

/**
 * SearchBar component — search input with icon, clear button, and shortcut hint
 *
 * @example
 * ```tsx
 * const [query, setQuery] = React.useState('');
 * <SearchBar
 *   value={query}
 *   onValueChange={setQuery}
 *   placeholder="Search components..."
 *   shortcutHint="⌘K"
 * />
 * ```
 */
const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      className,
      value,
      onValueChange,
      loading = false,
      shortcutHint,
      onSubmit,
      placeholder = 'Search...',
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const combinedRef = ref || inputRef;

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange?.(e.target.value);
      },
      [onValueChange]
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSubmit) {
          onSubmit(value ?? (e.target as HTMLInputElement).value);
        }
        if (e.key === 'Escape') {
          onValueChange?.('');
        }
      },
      [onSubmit, onValueChange, value]
    );

    const handleClear = React.useCallback(() => {
      onValueChange?.('');
      (typeof combinedRef === 'object' && combinedRef?.current)?.focus();
    }, [onValueChange, combinedRef]);

    return (
      <div
        className={cn(
          'relative flex items-center rounded-[var(--component-button-border-radius,0.375rem)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] transition-colors focus-within:border-[var(--color-border-focus)] focus-within:ring-2 focus-within:ring-[var(--color-border-focus)] focus-within:ring-offset-2',
          className
        )}
      >
        {/* Search icon */}
        <svg
          className="ml-3 h-4 w-4 shrink-0 text-[var(--color-text-tertiary)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>

        <input
          ref={combinedRef as React.Ref<HTMLInputElement>}
          type="search"
          role="searchbox"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-[var(--space-component-padding-sm,0.5rem)] [font-size:var(--component-search-bar-font-size,var(--font-size-sm))] [color:var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none"
          {...props}
        />

        {/* Loading spinner */}
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin text-[var(--color-text-tertiary)]"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}

        {/* Clear button */}
        {value && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="mr-2 rounded-sm p-0.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Shortcut hint */}
        {shortcutHint && !value && !loading && (
          <kbd className="mr-3 hidden rounded border border-[var(--color-border-default)] bg-[var(--color-background-secondary)] px-1.5 py-0.5 [font-size:var(--font-size-xs)] text-[var(--color-text-tertiary)] sm:inline-block">
            {shortcutHint}
          </kbd>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export { SearchBar };
