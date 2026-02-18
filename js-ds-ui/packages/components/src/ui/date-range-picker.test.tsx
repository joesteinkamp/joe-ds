import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DateRangePicker, type DateRange } from './date-range-picker';

describe('DateRangePicker', () => {
  describe('Rendering', () => {
    it('renders with default placeholders (Start date, End date)', () => {
      render(<DateRangePicker />);
      expect(screen.getByText('Start date')).toBeInTheDocument();
      expect(screen.getByText('End date')).toBeInTheDocument();
    });

    it('renders with custom placeholders', () => {
      render(
        <DateRangePicker
          startPlaceholder="Check-in"
          endPlaceholder="Check-out"
        />
      );
      expect(screen.getByText('Check-in')).toBeInTheDocument();
      expect(screen.getByText('Check-out')).toBeInTheDocument();
    });

    it('displays formatted dates when value is provided', () => {
      const value: DateRange = {
        from: new Date(2025, 0, 15), // Jan 15, 2025
        to: new Date(2025, 0, 20),   // Jan 20, 2025
      };
      render(<DateRangePicker value={value} />);

      // toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      // produces something like "Jan 15, 2025"
      expect(screen.getByText(/Jan 15, 2025/)).toBeInTheDocument();
      expect(screen.getByText(/Jan 20, 2025/)).toBeInTheDocument();
    });

    it('renders the trigger button', () => {
      render(<DateRangePicker />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('does not show calendar dropdown initially', () => {
      render(<DateRangePicker />);
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });

    it('applies className to the container', () => {
      const { container } = render(
        <DateRangePicker className="my-custom-class" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('my-custom-class');
    });
  });

  describe('Interactions', () => {
    it('opens calendar dropdown on click', () => {
      render(<DateRangePicker />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      // When open, the calendar grid and navigation should be visible
      expect(screen.getByRole('grid')).toBeInTheDocument();
      expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
      expect(screen.getByLabelText('Next month')).toBeInTheDocument();
    });

    it('toggles calendar open and closed on successive clicks', () => {
      render(<DateRangePicker />);
      const button = screen.getByRole('button');

      fireEvent.click(button);
      expect(screen.getByRole('grid')).toBeInTheDocument();

      fireEvent.click(button);
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });

    it('calls onValueChange when selecting the first date (from)', () => {
      const onValueChange = vi.fn();
      render(
        <DateRangePicker
          value={{ from: null, to: null }}
          onValueChange={onValueChange}
        />
      );

      // Open the calendar
      fireEvent.click(screen.getByRole('button'));

      // Click on a day button within the grid (find a day button, e.g. "15")
      const dayButtons = screen.getByRole('grid').querySelectorAll('button');
      // dayButtons are the day number buttons; pick one that shows "15"
      const day15 = Array.from(dayButtons).find(
        (btn) => btn.textContent === '15'
      );
      expect(day15).toBeTruthy();
      fireEvent.click(day15!);

      expect(onValueChange).toHaveBeenCalledTimes(1);
      const call = onValueChange.mock.calls[0][0] as DateRange;
      expect(call.from).toBeInstanceOf(Date);
      expect(call.from!.getDate()).toBe(15);
      // First click sets "from" and clears "to"
      expect(call.to).toBeNull();
    });

    it('calls onValueChange with full range on second click (from + to)', () => {
      const fromDate = new Date(2025, 5, 10); // June 10, 2025
      const onValueChange = vi.fn();

      render(
        <DateRangePicker
          value={{ from: fromDate, to: null }}
          onValueChange={onValueChange}
        />
      );

      // Open the calendar
      fireEvent.click(screen.getByRole('button'));

      // Select a later day (e.g. "20") -- the component is in "to" selection mode
      // after the first selection, but since we pass value with from set and
      // the component internally tracks selecting state, we need to simulate
      // the second step. The component defaults selecting='from', so clicking
      // once would set from. Let's click day 10 first to set from, then 20 for to.
      const dayButtons = screen.getByRole('grid').querySelectorAll('button');
      const day10 = Array.from(dayButtons).find(
        (btn) => btn.textContent === '10'
      );
      fireEvent.click(day10!);

      // Now the component is in "to" selection mode
      // The calendar may close after a complete selection. Let's check if it's
      // still open; the first click sets from, so selecting='to' now.
      // But since we set value.from via props, the second click on 20 should
      // produce the full range. Re-open if needed.
      expect(screen.getByText('Select end date')).toBeInTheDocument();

      const day20 = Array.from(
        screen.getByRole('grid').querySelectorAll('button')
      ).find((btn) => btn.textContent === '20');
      fireEvent.click(day20!);

      // The second call to onValueChange should have both from and to
      const lastCall =
        onValueChange.mock.calls[onValueChange.mock.calls.length - 1][0] as DateRange;
      expect(lastCall.to).toBeInstanceOf(Date);
      expect(lastCall.to!.getDate()).toBe(20);
    });

    it('shows "Select start date" hint initially and "Select end date" after first pick', () => {
      const onValueChange = vi.fn();
      render(
        <DateRangePicker
          value={{ from: null, to: null }}
          onValueChange={onValueChange}
        />
      );

      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('Select start date')).toBeInTheDocument();

      // Click a day
      const dayButtons = screen.getByRole('grid').querySelectorAll('button');
      const firstDay = Array.from(dayButtons).find(
        (btn) => btn.textContent === '1'
      );
      fireEvent.click(firstDay!);

      // After picking the start, it should say "Select end date"
      expect(screen.getByText('Select end date')).toBeInTheDocument();
    });

    it('navigates to previous month', () => {
      render(<DateRangePicker />);
      fireEvent.click(screen.getByRole('button'));

      const currentMonthText = screen.getByText(/\w+ \d{4}/);
      const initialText = currentMonthText.textContent;

      fireEvent.click(screen.getByLabelText('Previous month'));
      const newMonthText = screen.getByText(/\w+ \d{4}/);
      expect(newMonthText.textContent).not.toBe(initialText);
    });

    it('navigates to next month', () => {
      render(<DateRangePicker />);
      fireEvent.click(screen.getByRole('button'));

      const currentMonthText = screen.getByText(/\w+ \d{4}/);
      const initialText = currentMonthText.textContent;

      fireEvent.click(screen.getByLabelText('Next month'));
      const newMonthText = screen.getByText(/\w+ \d{4}/);
      expect(newMonthText.textContent).not.toBe(initialText);
    });

    it('closes calendar on outside click', () => {
      render(
        <div>
          <DateRangePicker />
          <button data-testid="outside">Outside</button>
        </div>
      );

      // Open calendar
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('grid')).toBeInTheDocument();

      // Click outside
      fireEvent.mouseDown(screen.getByTestId('outside'));
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });
  });

  describe('Disabled state', () => {
    it('disables the trigger button when disabled=true', () => {
      render(<DateRangePicker disabled />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('does not open calendar when disabled', () => {
      render(<DateRangePicker disabled />);
      fireEvent.click(screen.getByRole('button'));
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });
  });

  describe('Date constraints', () => {
    it('disables dates before minDate', () => {
      // Set minDate to the 15th of the current month
      const now = new Date();
      const minDate = new Date(now.getFullYear(), now.getMonth(), 15);

      render(
        <DateRangePicker
          value={{ from: null, to: null }}
          minDate={minDate}
        />
      );

      fireEvent.click(screen.getByRole('button'));

      const dayButtons = screen.getByRole('grid').querySelectorAll('button');
      // Day 5 should be disabled (before minDate on the 15th)
      const day5 = Array.from(dayButtons).find(
        (btn) => btn.textContent === '5'
      );
      if (day5) {
        expect(day5).toBeDisabled();
      }
    });

    it('disables dates after maxDate', () => {
      const now = new Date();
      const maxDate = new Date(now.getFullYear(), now.getMonth(), 10);

      render(
        <DateRangePicker
          value={{ from: null, to: null }}
          maxDate={maxDate}
        />
      );

      fireEvent.click(screen.getByRole('button'));

      const dayButtons = screen.getByRole('grid').querySelectorAll('button');
      // Day 20 should be disabled (after maxDate on the 10th)
      const day20 = Array.from(dayButtons).find(
        (btn) => btn.textContent === '20'
      );
      if (day20) {
        expect(day20).toBeDisabled();
      }
    });
  });

  describe('Day headers', () => {
    it('renders day-of-week headers', () => {
      render(<DateRangePicker />);
      fireEvent.click(screen.getByRole('button'));

      expect(screen.getByText('Su')).toBeInTheDocument();
      expect(screen.getByText('Mo')).toBeInTheDocument();
      expect(screen.getByText('Tu')).toBeInTheDocument();
      expect(screen.getByText('We')).toBeInTheDocument();
      expect(screen.getByText('Th')).toBeInTheDocument();
      expect(screen.getByText('Fr')).toBeInTheDocument();
      expect(screen.getByText('Sa')).toBeInTheDocument();
    });
  });
});
