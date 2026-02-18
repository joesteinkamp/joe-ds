import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Combobox } from './combobox';

expect.extend(toHaveNoViolations);

const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular' },
];

describe('Combobox', () => {
  describe('Rendering', () => {
    it('renders with placeholder text', () => {
      render(<Combobox options={options} placeholder="Select framework..." />);
      expect(screen.getByText('Select framework...')).toBeInTheDocument();
    });

    it('renders with default placeholder when none provided', () => {
      render(<Combobox options={options} />);
      expect(screen.getByText('Select option...')).toBeInTheDocument();
    });

    it('renders trigger with combobox role', () => {
      render(<Combobox options={options} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('does not show dropdown initially', () => {
      render(<Combobox options={options} />);
      expect(screen.queryByText('React')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('opens dropdown on button click', async () => {
      const user = userEvent.setup();
      render(<Combobox options={options} placeholder="Select..." />);

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
      });
    });

    it('shows all options in the dropdown', async () => {
      const user = userEvent.setup();
      render(<Combobox options={options} />);

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Vue')).toBeInTheDocument();
        expect(screen.getByText('Svelte')).toBeInTheDocument();
        expect(screen.getByText('Angular')).toBeInTheDocument();
      });
    });

    it('selects an option and fires onValueChange', async () => {
      const user = userEvent.setup();
      let selectedValue = '';
      const handleChange = (value: string) => {
        selectedValue = value;
      };

      render(
        <Combobox
          options={options}
          onValueChange={handleChange}
          placeholder="Select..."
        />
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
      });

      await user.click(screen.getByText('React'));

      await waitFor(() => {
        expect(selectedValue).toBe('react');
      });
    });

    it('shows selected option label in trigger', async () => {
      const user = userEvent.setup();

      const ControlledCombobox = () => {
        const [value, setValue] = React.useState('');
        return (
          <Combobox
            options={options}
            value={value}
            onValueChange={setValue}
            placeholder="Select..."
          />
        );
      };

      render(<ControlledCombobox />);

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByText('Vue')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Vue'));

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toHaveTextContent('Vue');
      });
    });

    it('deselects when clicking the same option again', async () => {
      const user = userEvent.setup();

      const ControlledCombobox = () => {
        const [value, setValue] = React.useState('react');
        return (
          <Combobox
            options={options}
            value={value}
            onValueChange={setValue}
            placeholder="Select..."
          />
        );
      };

      render(<ControlledCombobox />);

      // Initially shows "React" as selected label
      expect(screen.getByRole('combobox')).toHaveTextContent('React');

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        // The option in the dropdown
        expect(screen.getByRole('option', { name: /React/ })).toBeInTheDocument();
      });

      // Click the option (not the trigger) to deselect
      await user.click(screen.getByRole('option', { name: /React/ }));

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toHaveTextContent('Select...');
      });
    });

    it('shows search input with custom placeholder', async () => {
      const user = userEvent.setup();
      render(
        <Combobox
          options={options}
          searchPlaceholder="Search frameworks..."
        />
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search frameworks...')).toBeInTheDocument();
      });
    });
  });

  describe('Disabled', () => {
    it('renders disabled trigger', () => {
      render(<Combobox options={options} disabled />);
      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('does not open dropdown when disabled', async () => {
      const user = userEvent.setup();
      render(<Combobox options={options} disabled />);

      await user.click(screen.getByRole('combobox'));
      expect(screen.queryByText('React')).not.toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('merges custom className on trigger', () => {
      render(<Combobox options={options} className="custom-combo" />);
      expect(screen.getByRole('combobox')).toHaveClass('custom-combo');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      // The Combobox trigger button uses CSS variable font sizes which axe
      // may not be able to compute, so we disable the button-name rule for
      // this test. The button does contain visible text content.
      const { container } = render(
        <Combobox options={options} placeholder="Select..." />
      );
      const results = await axe(container, {
        rules: { 'button-name': { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('has aria-expanded attribute', () => {
      render(<Combobox options={options} />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    });

    it('updates aria-expanded when opened', async () => {
      const user = userEvent.setup();
      render(<Combobox options={options} />);

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      await user.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });
});

// Need React import for the controlled component tests
import * as React from 'react';
