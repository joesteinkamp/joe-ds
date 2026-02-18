import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

expect.extend(toHaveNoViolations);

describe('Select', () => {
  const renderSelect = () => {
    return render(
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
        </SelectContent>
      </Select>
    );
  };

  describe('Rendering', () => {
    it('renders trigger with placeholder', () => {
      renderSelect();
      expect(screen.getByText('Select a fruit')).toBeInTheDocument();
    });

    it('renders trigger button', () => {
      renderSelect();
      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeInTheDocument();
    });

    it('does not show content initially', () => {
      renderSelect();
      expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });

    it('renders with default value', () => {
      render(
        <Select defaultValue="banana">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectContent>
        </Select>
      );
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('renders disabled trigger', () => {
      render(
        <Select>
          <SelectTrigger disabled>
            <SelectValue placeholder="Disabled" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">A</SelectItem>
          </SelectContent>
        </Select>
      );
      expect(screen.getByRole('combobox')).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('opens dropdown on trigger click', async () => {
      const user = userEvent.setup();
      renderSelect();

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
      });
    });

    it('selects item on click', async () => {
      const user = userEvent.setup();
      renderSelect();

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Banana' }));

      await waitFor(() => {
        expect(screen.getByText('Banana')).toBeInTheDocument();
      });
    });

    it('calls onValueChange callback', async () => {
      const user = userEvent.setup();
      let value = '';
      const handleChange = (val: string) => {
        value = val;
      };

      render(
        <Select onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectContent>
        </Select>
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Apple' }));

      await waitFor(() => {
        expect(value).toBe('apple');
      });
    });

    it('closes dropdown after selection', async () => {
      const user = userEvent.setup();
      renderSelect();

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Apple' }));

      await waitFor(() => {
        expect(screen.queryByRole('option')).not.toBeInTheDocument();
      });
    });

    it('does not open when disabled', async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger disabled>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">A</SelectItem>
          </SelectContent>
        </Select>
      );

      await user.click(screen.getByRole('combobox'));
      expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('opens with Enter key', async () => {
      const user = userEvent.setup();
      renderSelect();

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
      });
    });

    it('opens with Space key', async () => {
      const user = userEvent.setup();
      renderSelect();

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      await user.keyboard(' ');

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
      });
    });

    it('navigates with Arrow keys', async () => {
      const user = userEvent.setup();
      renderSelect();

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
      });

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText('Banana')).toBeInTheDocument();
      });
    });

    it('closes with Escape key', async () => {
      const user = userEvent.setup();
      renderSelect();

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('option')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations (closed)', async () => {
      const { container } = renderSelect();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has correct ARIA attributes', () => {
      renderSelect();
      const trigger = screen.getByRole('combobox');

      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('updates aria-expanded when opened', async () => {
      const user = userEvent.setup();
      renderSelect();

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      await user.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  describe('Disabled Items', () => {
    it('renders disabled items', async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b" disabled>
              Option B (disabled)
            </SelectItem>
          </SelectContent>
        </Select>
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        const disabledOption = screen.getByRole('option', { name: /Option B/ });
        expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
      });
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className on trigger', () => {
      render(
        <Select>
          <SelectTrigger className="custom-trigger">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">A</SelectItem>
          </SelectContent>
        </Select>
      );
      expect(screen.getByRole('combobox')).toHaveClass('custom-trigger');
    });
  });
});
