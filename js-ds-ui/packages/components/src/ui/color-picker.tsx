'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export type ColorFormat = 'hex' | 'oklch';

export interface ColorPickerProps {
  /** Color value (hex string like #3b82f6 or oklch string) */
  value?: string;
  /** Called when color changes */
  onValueChange?: (color: string) => void;
  /** Display format */
  format?: ColorFormat;
  /** Show a list of preset colors */
  presets?: string[];
  /** Label text */
  label?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

const DEFAULT_PRESETS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#6b7280',
];

/**
 * ColorPicker component — color selection with native input and text entry
 *
 * @example
 * ```tsx
 * const [color, setColor] = React.useState('#3b82f6');
 * <ColorPicker value={color} onValueChange={setColor} />
 * <ColorPicker value={color} onValueChange={setColor} presets={['#f00', '#0f0', '#00f']} />
 * ```
 */
const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    {
      value = '#000000',
      onValueChange,
      format = 'hex',
      presets = DEFAULT_PRESETS,
      label,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const [textValue, setTextValue] = React.useState(value);

    React.useEffect(() => {
      setTextValue(value);
    }, [value]);

    const handleNativeChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setTextValue(newColor);
        onValueChange?.(newColor);
      },
      [onValueChange]
    );

    const handleTextChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setTextValue(e.target.value);
      },
      []
    );

    const handleTextBlur = React.useCallback(() => {
      // Validate and emit on blur
      if (textValue.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)) {
        onValueChange?.(textValue);
      } else if (textValue.match(/^oklch\(/)) {
        onValueChange?.(textValue);
      } else {
        setTextValue(value);
      }
    }, [textValue, value, onValueChange]);

    const handleTextKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          handleTextBlur();
        }
      },
      [handleTextBlur]
    );

    const handlePresetClick = React.useCallback(
      (preset: string) => {
        setTextValue(preset);
        onValueChange?.(preset);
      },
      [onValueChange]
    );

    return (
      <div
        ref={ref}
        className={cn('inline-flex flex-col gap-2', className)}
        {...props}
      >
        {label && (
          <label className="[font-size:var(--component-color-picker-label-font-size)] [font-weight:var(--component-color-picker-label-font-weight)] text-[var(--color-text-primary)]">
            {label}
          </label>
        )}

        <div className="flex items-center gap-2">
          {/* Native color input */}
          <div className="relative">
            <input
              type="color"
              value={value.startsWith('#') ? value : '#000000'}
              onChange={handleNativeChange}
              disabled={disabled}
              className={cn(
                'h-10 w-10 cursor-pointer rounded-[var(--component-color-picker-border-radius,0.375rem)] border border-[var(--color-border-default)] p-0.5',
                disabled && 'cursor-not-allowed opacity-50'
              )}
              aria-label={label || 'Color picker'}
            />
          </div>

          {/* Text input */}
          <input
            type="text"
            value={textValue}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            onKeyDown={handleTextKeyDown}
            disabled={disabled}
            className={cn(
              'w-[140px] rounded-[var(--component-color-picker-border-radius,0.375rem)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] px-3 py-[var(--component-color-picker-input-padding-y,0.5rem)] [font-family:var(--component-color-picker-font-family,monospace)] [font-size:var(--component-color-picker-font-size)] [color:var(--color-text-primary)] focus:border-[var(--color-border-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            placeholder={format === 'oklch' ? 'oklch(0.5 0.2 250)' : '#000000'}
            aria-label="Color value"
          />
        </div>

        {/* Preset swatches */}
        {presets.length > 0 && (
          <div className="flex flex-wrap gap-1.5" role="listbox" aria-label="Color presets">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                role="option"
                aria-selected={value === preset}
                onClick={() => handlePresetClick(preset)}
                disabled={disabled}
                className={cn(
                  'h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2',
                  value === preset ? 'border-[var(--color-text-primary)] ring-1 ring-[var(--color-text-primary)]' : 'border-transparent',
                  disabled && 'cursor-not-allowed opacity-50'
                )}
                style={{ backgroundColor: preset }}
                aria-label={preset}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

ColorPicker.displayName = 'ColorPicker';

export { ColorPicker, DEFAULT_PRESETS };
