'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
  disabled?: (date: Date) => boolean;
  /** Month to display (controlled) */
  month?: Date;
  onMonthChange?: (month: Date) => void;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

const Calendar = ({ selected, onSelect, className, disabled, month: controlledMonth, onMonthChange }: CalendarProps) => {
  const [internalMonth, setInternalMonth] = React.useState(() => selected || new Date());
  const displayMonth = controlledMonth || internalMonth;

  const setMonth = (date: Date) => {
    if (onMonthChange) {
      onMonthChange(date);
    } else {
      setInternalMonth(date);
    }
  };

  const year = displayMonth.getFullYear();
  const monthIndex = displayMonth.getMonth();
  const days = getDaysInMonth(year, monthIndex);
  const firstDayOfWeek = days[0].getDay(); // 0 = Sunday

  const prevMonth = () => setMonth(new Date(year, monthIndex - 1, 1));
  const nextMonth = () => setMonth(new Date(year, monthIndex + 1, 1));

  // Pad with empty cells for alignment
  const paddedDays: (Date | null)[] = [
    ...Array.from({ length: firstDayOfWeek }, () => null),
    ...days,
  ];

  return (
    <div className={cn('p-3', className)} role="application" aria-label="Calendar">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={prevMonth}
          className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--component-button-border-radius)] hover:bg-[var(--color-background-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-[var(--font-size-sm)] font-[var(--font-weight-medium)]">
          {MONTHS[monthIndex]} {year}
        </div>
        <button
          type="button"
          onClick={nextMonth}
          className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--component-button-border-radius)] hover:bg-[var(--color-background-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-[var(--font-size-xs)] text-[var(--color-text-tertiary)] font-[var(--font-weight-medium)] h-8 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1" role="grid">
        {paddedDays.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;
          const isSelected = selected && isSameDay(date, selected);
          const isTodayDate = isToday(date);
          const isDisabled = disabled?.(date);

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelect?.(date)}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-[var(--component-button-border-radius)] text-[var(--font-size-sm)] transition-colors',
                'hover:bg-[var(--color-background-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]',
                isSelected && 'bg-[var(--color-interactive-primary)] text-white hover:bg-[var(--color-interactive-primary)]',
                isTodayDate && !isSelected && 'bg-[var(--color-background-secondary)] font-[var(--font-weight-semibold)]',
                isDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
              )}
              aria-selected={isSelected}
              aria-label={date.toLocaleDateString()}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

Calendar.displayName = 'Calendar';

export { Calendar };
