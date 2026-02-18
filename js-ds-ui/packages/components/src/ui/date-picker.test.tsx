import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import * as React from 'react';
import { DatePicker } from './date-picker';

expect.extend(toHaveNoViolations);

describe('DatePicker', () => {
  describe('Rendering', () => {
    it('renders with placeholder text', () => {
      render(<DatePicker placeholder="Pick a date" />);
      expect(screen.getByText('Pick a date')).toBeInTheDocument();
    });

    it('renders with default placeholder when none provided', () => {
      render(<DatePicker />);
      expect(screen.getByText('Pick a date')).toBeInTheDocument();
    });

    it('renders trigger button', () => {
      render(<DatePicker />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('does not show calendar initially', () => {
      render(<DatePicker />);
      expect(screen.queryByRole('application', { name: 'Calendar' })).not.toBeInTheDocument();
    });

    it('shows selected date formatted text', () => {
      const date = new Date(2025, 0, 15); // January 15, 2025
      render(<DatePicker value={date} />);
      expect(screen.getByText('January 15, 2025')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('opens calendar popover on click', async () => {
      const user = userEvent.setup();
      render(<DatePicker placeholder="Pick a date" />);

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('application', { name: 'Calendar' })).toBeInTheDocument();
      });
    });

    it('selects a date and fires onChange', async () => {
      const user = userEvent.setup();
      let selectedDate: Date | null = null;
      const handleChange = (date: Date) => {
        selectedDate = date;
      };

      render(<DatePicker onChange={handleChange} placeholder="Pick a date" />);

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('application', { name: 'Calendar' })).toBeInTheDocument();
      });

      // Click on a day number
      await user.click(screen.getByText('15'));

      await waitFor(() => {
        expect(selectedDate).not.toBeNull();
        expect(selectedDate!.getDate()).toBe(15);
      });
    });

    it('closes popover after selecting a date', async () => {
      const user = userEvent.setup();

      const ControlledDatePicker = () => {
        const [value, setValue] = React.useState<Date | undefined>();
        return <DatePicker value={value} onChange={setValue} />;
      };

      render(<ControlledDatePicker />);

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('application', { name: 'Calendar' })).toBeInTheDocument();
      });

      await user.click(screen.getByText('10'));

      await waitFor(() => {
        expect(screen.queryByRole('application', { name: 'Calendar' })).not.toBeInTheDocument();
      });
    });

    it('displays formatted date after selection', async () => {
      const user = userEvent.setup();

      const ControlledDatePicker = () => {
        const [value, setValue] = React.useState<Date | undefined>();
        return <DatePicker value={value} onChange={setValue} placeholder="Pick a date" />;
      };

      render(<ControlledDatePicker />);

      // The formatted date text should appear after selection
      expect(screen.getByText('Pick a date')).toBeInTheDocument();

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('application', { name: 'Calendar' })).toBeInTheDocument();
      });

      await user.click(screen.getByText('20'));

      await waitFor(() => {
        // Date should now be displayed (not the placeholder)
        expect(screen.queryByText('Pick a date')).not.toBeInTheDocument();
      });
    });
  });

  describe('Disabled', () => {
    it('renders disabled trigger', () => {
      render(<DatePicker disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not open calendar when disabled', async () => {
      const user = userEvent.setup();
      render(<DatePicker disabled />);

      await user.click(screen.getByRole('button'));
      expect(screen.queryByRole('application', { name: 'Calendar' })).not.toBeInTheDocument();
    });
  });

  describe('Disabled dates', () => {
    it('passes disabledDates to calendar', async () => {
      const user = userEvent.setup();
      const disableWeekends = (date: Date) =>
        date.getDay() === 0 || date.getDay() === 6;

      render(<DatePicker disabledDates={disableWeekends} />);

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('application', { name: 'Calendar' })).toBeInTheDocument();
      });

      // Find a disabled button (weekend day)
      const grid = screen.getByRole('grid');
      const disabledButtons = grid.querySelectorAll('button[disabled]');
      expect(disabledButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Custom className', () => {
    it('merges custom className on trigger', () => {
      render(<DatePicker className="custom-picker" />);
      expect(screen.getByRole('button')).toHaveClass('custom-picker');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<DatePicker placeholder="Pick a date" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
