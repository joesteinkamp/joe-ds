'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export interface TimePickerProps {
  /** Current time value (HH:MM format, 24h) */
  value?: string;
  /** Called when time changes */
  onValueChange?: (time: string) => void;
  /** Use 12-hour format with AM/PM */
  use12Hour?: boolean;
  /** Minute step interval */
  minuteStep?: number;
  /** Minimum time (HH:MM) */
  minTime?: string;
  /** Maximum time (HH:MM) */
  maxTime?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
  /** Placeholder */
  placeholder?: string;
}

function padZero(n: number): string {
  return n.toString().padStart(2, '0');
}

function parseTime(str: string): { hours: number; minutes: number } {
  const [h, m] = str.split(':').map(Number);
  return { hours: h || 0, minutes: m || 0 };
}

/**
 * TimePicker component — time selection with hour/minute controls
 *
 * @example
 * ```tsx
 * const [time, setTime] = React.useState('09:00');
 * <TimePicker value={time} onValueChange={setTime} />
 * <TimePicker value={time} onValueChange={setTime} use12Hour minuteStep={15} />
 * ```
 */
const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      value = '',
      onValueChange,
      use12Hour = false,
      minuteStep = 1,
      minTime,
      maxTime,
      disabled = false,
      className,
      placeholder = 'Select time',
      ...props
    },
    ref
  ) => {
    const parsed = value ? parseTime(value) : null;
    const hours = parsed?.hours ?? -1;
    const minutes = parsed?.minutes ?? -1;
    const period = hours >= 12 ? 'PM' : 'AM';

    const display12Hour = use12Hour && hours >= 0
      ? hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
      : hours;

    const handleHourChange = React.useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        let h = parseInt(e.target.value, 10);
        if (use12Hour) {
          if (period === 'PM' && h !== 12) h += 12;
          if (period === 'AM' && h === 12) h = 0;
        }
        const m = minutes >= 0 ? minutes : 0;
        onValueChange?.(`${padZero(h)}:${padZero(m)}`);
      },
      [use12Hour, period, minutes, onValueChange]
    );

    const handleMinuteChange = React.useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const m = parseInt(e.target.value, 10);
        const h = hours >= 0 ? hours : 0;
        onValueChange?.(`${padZero(h)}:${padZero(m)}`);
      },
      [hours, onValueChange]
    );

    const handlePeriodChange = React.useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPeriod = e.target.value;
        let h = hours;
        if (newPeriod === 'PM' && h < 12) h += 12;
        if (newPeriod === 'AM' && h >= 12) h -= 12;
        onValueChange?.(`${padZero(h)}:${padZero(minutes >= 0 ? minutes : 0)}`);
      },
      [hours, minutes, onValueChange]
    );

    const hourOptions = use12Hour
      ? Array.from({ length: 12 }, (_, i) => i + 1)
      : Array.from({ length: 24 }, (_, i) => i);

    const minuteOptions = Array.from(
      { length: Math.ceil(60 / minuteStep) },
      (_, i) => i * minuteStep
    );

    const selectClass = cn(
      'appearance-none rounded-[var(--component-button-border-radius,0.375rem)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] px-2 py-[var(--space-component-padding-sm,0.5rem)] text-center [font-size:var(--font-size-sm)] [color:var(--color-text-primary)] focus:border-[var(--color-border-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]',
      disabled && 'cursor-not-allowed opacity-50'
    );

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center gap-1', className)}
        role="group"
        aria-label="Time picker"
        {...props}
      >
        {/* Clock icon */}
        <svg className="mr-1 h-4 w-4 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        {/* Hours */}
        <select
          value={hours >= 0 ? (use12Hour ? display12Hour : hours) : ''}
          onChange={handleHourChange}
          disabled={disabled}
          className={selectClass}
          aria-label="Hour"
        >
          <option value="" disabled>HH</option>
          {hourOptions.map((h) => (
            <option key={h} value={h}>{padZero(h)}</option>
          ))}
        </select>

        <span className="text-[var(--color-text-tertiary)] [font-weight:var(--font-weight-medium)]">:</span>

        {/* Minutes */}
        <select
          value={minutes >= 0 ? minutes : ''}
          onChange={handleMinuteChange}
          disabled={disabled}
          className={selectClass}
          aria-label="Minute"
        >
          <option value="" disabled>MM</option>
          {minuteOptions.map((m) => (
            <option key={m} value={m}>{padZero(m)}</option>
          ))}
        </select>

        {/* AM/PM */}
        {use12Hour && (
          <select
            value={period}
            onChange={handlePeriodChange}
            disabled={disabled}
            className={selectClass}
            aria-label="Period"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        )}
      </div>
    );
  }
);

TimePicker.displayName = 'TimePicker';

export { TimePicker };
