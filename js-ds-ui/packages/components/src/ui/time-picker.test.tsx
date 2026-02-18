import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { TimePicker } from './time-picker';

describe('TimePicker', () => {
  describe('Rendering', () => {
    it('renders with hour and minute selects', () => {
      render(<TimePicker />);
      expect(screen.getByLabelText('Hour')).toBeInTheDocument();
      expect(screen.getByLabelText('Minute')).toBeInTheDocument();
    });

    it('renders the clock icon', () => {
      const { container } = render(<TimePicker />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-hidden');
    });

    it('renders with the time picker group role', () => {
      render(<TimePicker />);
      expect(screen.getByRole('group', { name: 'Time picker' })).toBeInTheDocument();
    });

    it('shows HH and MM placeholder options', () => {
      render(<TimePicker />);
      const hourSelect = screen.getByLabelText('Hour');
      const minuteSelect = screen.getByLabelText('Minute');

      // The disabled placeholder options
      expect(hourSelect.querySelector('option[disabled]')).toHaveTextContent('HH');
      expect(minuteSelect.querySelector('option[disabled]')).toHaveTextContent('MM');
    });

    it('displays the correct value when provided', () => {
      render(<TimePicker value="14:30" />);
      const hourSelect = screen.getByLabelText('Hour') as HTMLSelectElement;
      const minuteSelect = screen.getByLabelText('Minute') as HTMLSelectElement;

      expect(hourSelect.value).toBe('14');
      expect(minuteSelect.value).toBe('30');
    });
  });

  describe('12-hour mode', () => {
    it('shows AM/PM select when use12Hour=true', () => {
      render(<TimePicker use12Hour />);
      expect(screen.getByLabelText('Period')).toBeInTheDocument();
    });

    it('hides AM/PM select when use12Hour=false (default)', () => {
      render(<TimePicker />);
      expect(screen.queryByLabelText('Period')).not.toBeInTheDocument();
    });

    it('generates 12 hour options (1-12) in 12-hour mode', () => {
      render(<TimePicker use12Hour />);
      const hourSelect = screen.getByLabelText('Hour');
      // 12 hour options + 1 disabled placeholder = 13 options
      const options = hourSelect.querySelectorAll('option');
      expect(options).toHaveLength(13); // 12 hours + 1 placeholder "HH"
    });

    it('generates 24 hour options (0-23) in 24-hour mode', () => {
      render(<TimePicker />);
      const hourSelect = screen.getByLabelText('Hour');
      // 24 hour options + 1 disabled placeholder = 25 options
      const options = hourSelect.querySelectorAll('option');
      expect(options).toHaveLength(25); // 24 hours + 1 placeholder "HH"
    });

    it('displays converted 12-hour value for afternoon times', () => {
      render(<TimePicker value="14:30" use12Hour />);
      const hourSelect = screen.getByLabelText('Hour') as HTMLSelectElement;
      const periodSelect = screen.getByLabelText('Period') as HTMLSelectElement;

      // 14:00 should show as 2 in 12-hour mode
      expect(hourSelect.value).toBe('2');
      expect(periodSelect.value).toBe('PM');
    });

    it('displays 12 for noon in 12-hour mode', () => {
      render(<TimePicker value="12:00" use12Hour />);
      const hourSelect = screen.getByLabelText('Hour') as HTMLSelectElement;
      const periodSelect = screen.getByLabelText('Period') as HTMLSelectElement;

      expect(hourSelect.value).toBe('12');
      expect(periodSelect.value).toBe('PM');
    });

    it('displays 12 for midnight in 12-hour mode', () => {
      render(<TimePicker value="00:00" use12Hour />);
      const hourSelect = screen.getByLabelText('Hour') as HTMLSelectElement;
      const periodSelect = screen.getByLabelText('Period') as HTMLSelectElement;

      expect(hourSelect.value).toBe('12');
      expect(periodSelect.value).toBe('AM');
    });
  });

  describe('Interactions', () => {
    it('calls onValueChange when hour changes in 24-hour mode', () => {
      const onValueChange = vi.fn();
      render(<TimePicker value="10:30" onValueChange={onValueChange} />);

      const hourSelect = screen.getByLabelText('Hour');
      fireEvent.change(hourSelect, { target: { value: '15' } });

      expect(onValueChange).toHaveBeenCalledWith('15:30');
    });

    it('calls onValueChange when minute changes', () => {
      const onValueChange = vi.fn();
      render(<TimePicker value="10:30" onValueChange={onValueChange} />);

      const minuteSelect = screen.getByLabelText('Minute');
      fireEvent.change(minuteSelect, { target: { value: '45' } });

      expect(onValueChange).toHaveBeenCalledWith('10:45');
    });

    it('calls onValueChange when hour changes in 12-hour mode (AM)', () => {
      const onValueChange = vi.fn();
      render(
        <TimePicker value="09:00" onValueChange={onValueChange} use12Hour />
      );

      const hourSelect = screen.getByLabelText('Hour');
      fireEvent.change(hourSelect, { target: { value: '11' } });

      // 11 AM = 11:00 in 24h
      expect(onValueChange).toHaveBeenCalledWith('11:00');
    });

    it('calls onValueChange when hour changes in 12-hour mode (PM)', () => {
      const onValueChange = vi.fn();
      render(
        <TimePicker value="14:00" onValueChange={onValueChange} use12Hour />
      );

      const hourSelect = screen.getByLabelText('Hour');
      fireEvent.change(hourSelect, { target: { value: '3' } });

      // 3 PM = 15:00 in 24h
      expect(onValueChange).toHaveBeenCalledWith('15:00');
    });

    it('calls onValueChange when period changes from AM to PM', () => {
      const onValueChange = vi.fn();
      render(
        <TimePicker value="09:30" onValueChange={onValueChange} use12Hour />
      );

      const periodSelect = screen.getByLabelText('Period');
      fireEvent.change(periodSelect, { target: { value: 'PM' } });

      // 9 AM -> 9 PM = 21:30
      expect(onValueChange).toHaveBeenCalledWith('21:30');
    });

    it('calls onValueChange when period changes from PM to AM', () => {
      const onValueChange = vi.fn();
      render(
        <TimePicker value="21:30" onValueChange={onValueChange} use12Hour />
      );

      const periodSelect = screen.getByLabelText('Period');
      fireEvent.change(periodSelect, { target: { value: 'AM' } });

      // 21:30 (9 PM) -> 9 AM = 09:30
      expect(onValueChange).toHaveBeenCalledWith('09:30');
    });

    it('defaults minutes to 0 when changing hour with no prior value', () => {
      const onValueChange = vi.fn();
      render(<TimePicker onValueChange={onValueChange} />);

      const hourSelect = screen.getByLabelText('Hour');
      fireEvent.change(hourSelect, { target: { value: '8' } });

      expect(onValueChange).toHaveBeenCalledWith('08:00');
    });

    it('defaults hours to 0 when changing minute with no prior value', () => {
      const onValueChange = vi.fn();
      render(<TimePicker onValueChange={onValueChange} />);

      const minuteSelect = screen.getByLabelText('Minute');
      fireEvent.change(minuteSelect, { target: { value: '30' } });

      expect(onValueChange).toHaveBeenCalledWith('00:30');
    });
  });

  describe('minuteStep', () => {
    it('generates correct minute options with default step (1)', () => {
      render(<TimePicker />);
      const minuteSelect = screen.getByLabelText('Minute');
      // 60 minute options + 1 disabled placeholder
      const options = minuteSelect.querySelectorAll('option');
      expect(options).toHaveLength(61);
    });

    it('generates correct minute options with minuteStep=15', () => {
      render(<TimePicker minuteStep={15} />);
      const minuteSelect = screen.getByLabelText('Minute');
      // 0, 15, 30, 45 = 4 options + 1 placeholder
      const options = minuteSelect.querySelectorAll('option');
      expect(options).toHaveLength(5);

      // Verify the actual values
      const valueOptions = Array.from(options).filter(
        (opt) => !(opt as HTMLOptionElement).disabled
      );
      const values = valueOptions.map((opt) => (opt as HTMLOptionElement).value);
      expect(values).toEqual(['0', '15', '30', '45']);
    });

    it('generates correct minute options with minuteStep=30', () => {
      render(<TimePicker minuteStep={30} />);
      const minuteSelect = screen.getByLabelText('Minute');
      // 0, 30 = 2 options + 1 placeholder
      const options = minuteSelect.querySelectorAll('option');
      expect(options).toHaveLength(3);
    });

    it('generates correct minute options with minuteStep=5', () => {
      render(<TimePicker minuteStep={5} />);
      const minuteSelect = screen.getByLabelText('Minute');
      // 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55 = 12 options + 1 placeholder
      const options = minuteSelect.querySelectorAll('option');
      expect(options).toHaveLength(13);
    });
  });

  describe('Disabled state', () => {
    it('disables all selects when disabled=true', () => {
      render(<TimePicker disabled use12Hour />);
      expect(screen.getByLabelText('Hour')).toBeDisabled();
      expect(screen.getByLabelText('Minute')).toBeDisabled();
      expect(screen.getByLabelText('Period')).toBeDisabled();
    });

    it('disables hour and minute selects when disabled without 12-hour', () => {
      render(<TimePicker disabled />);
      expect(screen.getByLabelText('Hour')).toBeDisabled();
      expect(screen.getByLabelText('Minute')).toBeDisabled();
    });
  });

  describe('className', () => {
    it('applies className to the container', () => {
      render(<TimePicker className="my-time-picker" />);
      const group = screen.getByRole('group', { name: 'Time picker' });
      expect(group).toHaveClass('my-time-picker');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to the container div', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<TimePicker ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toBe(
        screen.getByRole('group', { name: 'Time picker' })
      );
    });
  });
});
