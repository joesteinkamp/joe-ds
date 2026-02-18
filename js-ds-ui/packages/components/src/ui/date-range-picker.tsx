'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface DateRangePickerProps {
  /** Current selected range */
  value?: DateRange;
  /** Called when the range changes */
  onValueChange?: (range: DateRange) => void;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Disabled dates */
  disabled?: boolean;
  /** Placeholder for start */
  startPlaceholder?: string;
  /** Placeholder for end */
  endPlaceholder?: string;
  /** Additional className */
  className?: string;
}

// Helper functions
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(date: Date, from: Date | null, to: Date | null): boolean {
  if (!from || !to) return false;
  return date > from && date < to;
}

function formatDate(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * DateRangePicker component — select a start and end date range
 *
 * @example
 * ```tsx
 * const [range, setRange] = React.useState<DateRange>({ from: null, to: null });
 * <DateRangePicker value={range} onValueChange={setRange} />
 * ```
 */
const DateRangePicker = ({
  value = { from: null, to: null },
  onValueChange,
  minDate,
  maxDate,
  disabled = false,
  startPlaceholder = 'Start date',
  endPlaceholder = 'End date',
  className,
}: DateRangePickerProps) => {
  const [open, setOpen] = React.useState(false);
  const [viewDate, setViewDate] = React.useState(() => value.from || new Date());
  const [selecting, setSelecting] = React.useState<'from' | 'to'>('from');
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleDayClick = (day: number) => {
    const clicked = new Date(year, month, day);

    if (selecting === 'from') {
      onValueChange?.({ from: clicked, to: null });
      setSelecting('to');
    } else {
      const from = value.from;
      if (from && clicked >= from) {
        onValueChange?.({ from, to: clicked });
      } else {
        onValueChange?.({ from: clicked, to: null });
      }
      setSelecting('from');
      setOpen(false);
    }
  };

  const isDisabledDate = (day: number): boolean => {
    const date = new Date(year, month, day);
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 rounded-[var(--component-date-range-picker-border-radius,0.375rem)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] px-3 py-[var(--component-date-range-picker-padding-y,0.5rem)] [font-size:var(--component-date-range-picker-font-size)] transition-colors hover:border-[var(--color-border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <svg className="h-4 w-4 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        <span className={value.from ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-tertiary)]'}>
          {value.from ? formatDate(value.from) : startPlaceholder}
        </span>
        <span className="text-[var(--color-text-tertiary)]">–</span>
        <span className={value.to ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-tertiary)]'}>
          {value.to ? formatDate(value.to) : endPlaceholder}
        </span>
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-[var(--z-index-popover,1060)] mt-2 rounded-[var(--component-date-range-picker-border-radius,0.375rem)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-4 shadow-lg">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <button type="button" onClick={prevMonth} className="rounded p-1 hover:bg-[var(--color-background-secondary)] focus:outline-none" aria-label="Previous month">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <span className="[font-size:var(--component-date-range-picker-font-size)] [font-weight:var(--component-date-range-picker-header-font-weight)]">
              {MONTHS[month]} {year}
            </span>
            <button type="button" onClick={nextMonth} className="rounded p-1 hover:bg-[var(--color-background-secondary)] focus:outline-none" aria-label="Next month">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="mb-1 grid grid-cols-7 gap-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center [font-size:var(--component-date-range-picker-day-header-font-size)] [font-weight:var(--component-date-range-picker-day-header-font-weight)] text-[var(--color-text-tertiary)]">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1" role="grid">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(year, month, day);
              const isFrom = value.from && isSameDay(date, value.from);
              const isTo = value.to && isSameDay(date, value.to);
              const inRange = isInRange(date, value.from, value.to);
              const isDisabled = isDisabledDate(day);

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded [font-size:var(--component-date-range-picker-font-size)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]',
                    isFrom || isTo
                      ? 'bg-[var(--color-interactive-primary)] text-white'
                      : inRange
                        ? 'bg-[var(--color-interactive-primary)]/10 text-[var(--color-interactive-primary)]'
                        : 'hover:bg-[var(--color-background-secondary)]',
                    isDisabled && 'cursor-not-allowed opacity-30'
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Selection hint */}
          <p className="mt-3 text-center [font-size:var(--component-date-range-picker-hint-font-size)] text-[var(--color-text-tertiary)]">
            {selecting === 'from' ? 'Select start date' : 'Select end date'}
          </p>
        </div>
      )}
    </div>
  );
};

DateRangePicker.displayName = 'DateRangePicker';

export { DateRangePicker };
