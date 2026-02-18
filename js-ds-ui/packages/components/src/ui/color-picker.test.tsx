import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { ColorPicker, DEFAULT_PRESETS } from './color-picker';

describe('ColorPicker', () => {
  describe('Rendering', () => {
    it('renders with native color input and text input', () => {
      render(<ColorPicker />);
      expect(screen.getByLabelText('Color picker')).toBeInTheDocument();
      expect(screen.getByLabelText('Color value')).toBeInTheDocument();
    });

    it('renders the native color input with type="color"', () => {
      render(<ColorPicker />);
      const nativeInput = screen.getByLabelText('Color picker');
      expect(nativeInput).toHaveAttribute('type', 'color');
    });

    it('renders the text input with type="text"', () => {
      render(<ColorPicker />);
      const textInput = screen.getByLabelText('Color value');
      expect(textInput).toHaveAttribute('type', 'text');
    });

    it('displays the provided value in the text input', () => {
      render(<ColorPicker value="#ff0000" />);
      const textInput = screen.getByLabelText('Color value') as HTMLInputElement;
      expect(textInput.value).toBe('#ff0000');
    });

    it('displays the provided value in the native color input', () => {
      render(<ColorPicker value="#3b82f6" />);
      const nativeInput = screen.getByLabelText('Color picker') as HTMLInputElement;
      expect(nativeInput.value).toBe('#3b82f6');
    });

    it('defaults value to #000000', () => {
      render(<ColorPicker />);
      const nativeInput = screen.getByLabelText('Color picker') as HTMLInputElement;
      expect(nativeInput.value).toBe('#000000');
    });

    it('uses custom label for the native color input aria-label', () => {
      render(<ColorPicker label="Theme color" />);
      expect(screen.getByLabelText('Theme color')).toBeInTheDocument();
    });
  });

  describe('Label', () => {
    it('displays label text when provided', () => {
      render(<ColorPicker label="Pick a color" />);
      expect(screen.getByText('Pick a color')).toBeInTheDocument();
    });

    it('does not render label element when label is not provided', () => {
      const { container } = render(<ColorPicker />);
      const labels = container.querySelectorAll('label');
      // Only the internal label element should not exist as text label
      expect(labels).toHaveLength(0);
    });
  });

  describe('Presets', () => {
    it('renders default preset swatches (10 colors)', () => {
      render(<ColorPicker />);
      const listbox = screen.getByRole('listbox', { name: 'Color presets' });
      const options = listbox.querySelectorAll('[role="option"]');
      expect(options).toHaveLength(10);
      expect(DEFAULT_PRESETS).toHaveLength(10);
    });

    it('renders each preset with the correct background color', () => {
      render(<ColorPicker />);
      DEFAULT_PRESETS.forEach((preset) => {
        const swatch = screen.getByLabelText(preset);
        expect(swatch).toHaveStyle({ backgroundColor: preset });
      });
    });

    it('renders custom presets when provided', () => {
      const customPresets = ['#ff0000', '#00ff00', '#0000ff'];
      render(<ColorPicker presets={customPresets} />);
      const listbox = screen.getByRole('listbox', { name: 'Color presets' });
      const options = listbox.querySelectorAll('[role="option"]');
      expect(options).toHaveLength(3);
    });

    it('does not render preset section when presets is empty', () => {
      render(<ColorPicker presets={[]} />);
      expect(
        screen.queryByRole('listbox', { name: 'Color presets' })
      ).not.toBeInTheDocument();
    });

    it('marks the active preset as aria-selected', () => {
      render(<ColorPicker value="#ef4444" />);
      const activeSwatch = screen.getByLabelText('#ef4444');
      expect(activeSwatch).toHaveAttribute('aria-selected', 'true');
    });

    it('marks non-active presets as aria-selected false', () => {
      render(<ColorPicker value="#ef4444" />);
      const inactiveSwatch = screen.getByLabelText('#3b82f6');
      expect(inactiveSwatch).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('Interactions', () => {
    it('calls onValueChange when native color input changes', () => {
      const onValueChange = vi.fn();
      render(<ColorPicker onValueChange={onValueChange} />);

      const nativeInput = screen.getByLabelText('Color picker');
      fireEvent.change(nativeInput, { target: { value: '#ff5733' } });

      expect(onValueChange).toHaveBeenCalledWith('#ff5733');
    });

    it('updates text input when native color input changes', () => {
      const onValueChange = vi.fn();
      render(<ColorPicker value="#000000" onValueChange={onValueChange} />);

      const nativeInput = screen.getByLabelText('Color picker');
      fireEvent.change(nativeInput, { target: { value: '#ff5733' } });

      // The text input should reflect the change (through internal state)
      const textInput = screen.getByLabelText('Color value') as HTMLInputElement;
      expect(textInput.value).toBe('#ff5733');
    });

    it('calls onValueChange when a preset swatch is clicked', () => {
      const onValueChange = vi.fn();
      render(<ColorPicker onValueChange={onValueChange} />);

      const swatch = screen.getByLabelText('#3b82f6');
      fireEvent.click(swatch);

      expect(onValueChange).toHaveBeenCalledWith('#3b82f6');
    });

    it('updates text input when a preset is clicked', () => {
      render(<ColorPicker />);

      const swatch = screen.getByLabelText('#ef4444');
      fireEvent.click(swatch);

      const textInput = screen.getByLabelText('Color value') as HTMLInputElement;
      expect(textInput.value).toBe('#ef4444');
    });

    it('allows typing in the text input without immediate callback', () => {
      const onValueChange = vi.fn();
      render(<ColorPicker value="#000000" onValueChange={onValueChange} />);

      const textInput = screen.getByLabelText('Color value');
      fireEvent.change(textInput, { target: { value: '#ff' } });

      // onValueChange should NOT be called on change -- only on blur
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('Text validation on blur', () => {
    it('validates and calls onValueChange with a valid 6-char hex on blur', () => {
      const onValueChange = vi.fn();
      render(<ColorPicker value="#000000" onValueChange={onValueChange} />);

      const textInput = screen.getByLabelText('Color value');
      fireEvent.change(textInput, { target: { value: '#abcdef' } });
      fireEvent.blur(textInput);

      expect(onValueChange).toHaveBeenCalledWith('#abcdef');
    });

    it('validates and calls onValueChange with a valid 3-char hex on blur', () => {
      const onValueChange = vi.fn();
      render(<ColorPicker value="#000000" onValueChange={onValueChange} />);

      const textInput = screen.getByLabelText('Color value');
      fireEvent.change(textInput, { target: { value: '#abc' } });
      fireEvent.blur(textInput);

      expect(onValueChange).toHaveBeenCalledWith('#abc');
    });

    it('validates and calls onValueChange with oklch format on blur', () => {
      const onValueChange = vi.fn();
      render(
        <ColorPicker value="#000000" onValueChange={onValueChange} format="oklch" />
      );

      const textInput = screen.getByLabelText('Color value');
      fireEvent.change(textInput, {
        target: { value: 'oklch(0.5 0.2 250)' },
      });
      fireEvent.blur(textInput);

      expect(onValueChange).toHaveBeenCalledWith('oklch(0.5 0.2 250)');
    });

    it('reverts invalid text on blur to previous value', () => {
      const onValueChange = vi.fn();
      render(<ColorPicker value="#3b82f6" onValueChange={onValueChange} />);

      const textInput = screen.getByLabelText('Color value') as HTMLInputElement;
      fireEvent.change(textInput, { target: { value: 'not-a-color' } });
      expect(textInput.value).toBe('not-a-color');

      fireEvent.blur(textInput);

      // Should revert to the prop value
      expect(textInput.value).toBe('#3b82f6');
      // onValueChange should NOT have been called with invalid value
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('reverts hex without # prefix on blur', () => {
      const onValueChange = vi.fn();
      render(<ColorPicker value="#3b82f6" onValueChange={onValueChange} />);

      const textInput = screen.getByLabelText('Color value') as HTMLInputElement;
      fireEvent.change(textInput, { target: { value: '3b82f6' } });
      fireEvent.blur(textInput);

      // Missing # prefix is invalid per the regex
      expect(textInput.value).toBe('#3b82f6');
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('calls handleTextBlur on Enter key', () => {
      const onValueChange = vi.fn();
      render(<ColorPicker value="#000000" onValueChange={onValueChange} />);

      const textInput = screen.getByLabelText('Color value');
      fireEvent.change(textInput, { target: { value: '#ff0000' } });
      fireEvent.keyDown(textInput, { key: 'Enter' });

      expect(onValueChange).toHaveBeenCalledWith('#ff0000');
    });
  });

  describe('Disabled state', () => {
    it('disables native color input when disabled=true', () => {
      render(<ColorPicker disabled />);
      expect(screen.getByLabelText('Color picker')).toBeDisabled();
    });

    it('disables text input when disabled=true', () => {
      render(<ColorPicker disabled />);
      expect(screen.getByLabelText('Color value')).toBeDisabled();
    });

    it('disables all preset swatch buttons when disabled=true', () => {
      render(<ColorPicker disabled />);
      const listbox = screen.getByRole('listbox', { name: 'Color presets' });
      const swatches = listbox.querySelectorAll('button');
      swatches.forEach((swatch) => {
        expect(swatch).toBeDisabled();
      });
    });
  });

  describe('className', () => {
    it('applies className to the container div', () => {
      const { container } = render(
        <ColorPicker className="my-color-picker" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('my-color-picker');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to the container div', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ColorPicker ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.tagName).toBe('DIV');
    });
  });

  describe('Placeholder text', () => {
    it('shows hex placeholder by default', () => {
      render(<ColorPicker />);
      const textInput = screen.getByLabelText('Color value');
      expect(textInput).toHaveAttribute('placeholder', '#000000');
    });

    it('shows oklch placeholder when format is oklch', () => {
      render(<ColorPicker format="oklch" />);
      const textInput = screen.getByLabelText('Color value');
      expect(textInput).toHaveAttribute('placeholder', 'oklch(0.5 0.2 250)');
    });
  });
});
