import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Checkbox } from './checkbox';
import { Label } from './label';

expect.extend(toHaveNoViolations);

describe('Checkbox', () => {
  describe('Rendering', () => {
    it('renders unchecked by default', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    it('renders checked when defaultChecked is true', () => {
      render(<Checkbox defaultChecked />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('renders with label', () => {
      render(
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">Accept terms</Label>
        </div>
      );
      expect(screen.getByText('Accept terms')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders disabled state', () => {
      render(<Checkbox disabled />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('toggles on click', async () => {
      const user = userEvent.setup();
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('calls onCheckedChange callback', async () => {
      const user = userEvent.setup();
      let checked = false;
      const handleChange = (value: boolean) => {
        checked = value;
      };

      render(<Checkbox onCheckedChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      await user.click(checkbox);
      expect(checked).toBe(true);

      await user.click(checkbox);
      expect(checked).toBe(false);
    });

    it('does not toggle when disabled', async () => {
      const user = userEvent.setup();
      render(<Checkbox disabled />);
      const checkbox = screen.getByRole('checkbox');

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('can be controlled', async () => {
      const user = userEvent.setup();
      const ControlledCheckbox = () => {
        const [checked, setChecked] = React.useState(false);
        return (
          <Checkbox checked={checked} onCheckedChange={setChecked} />
        );
      };

      render(<ControlledCheckbox />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).not.toBeChecked();
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  describe('Keyboard Navigation', () => {
    it('can be focused with Tab', async () => {
      const user = userEvent.setup();
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');

      await user.tab();
      expect(checkbox).toHaveFocus();
    });

    it('toggles with Space key', async () => {
      const user = userEvent.setup();
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');

      checkbox.focus();
      expect(checkbox).not.toBeChecked();

      await user.keyboard(' ');
      expect(checkbox).toBeChecked();

      await user.keyboard(' ');
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations (unchecked)', async () => {
      const { container } = render(<Checkbox aria-label="Accept" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (checked)', async () => {
      const { container } = render(<Checkbox checked aria-label="Accept" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (disabled)', async () => {
      const { container } = render(<Checkbox disabled aria-label="Accept" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports aria-label', () => {
      render(<Checkbox aria-label="Custom label" />);
      expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(
        <>
          <Checkbox aria-describedby="help" />
          <span id="help">Help text</span>
        </>
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-describedby', 'help');
    });

    it('associates with label via htmlFor/id', () => {
      render(
        <>
          <Checkbox id="checkbox1" />
          <Label htmlFor="checkbox1">Label text</Label>
        </>
      );
      expect(screen.getByLabelText('Label text')).toBeInTheDocument();
    });
  });

  describe('Indeterminate State', () => {
    it('supports indeterminate state', () => {
      render(<Checkbox checked="indeterminate" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      // Indeterminate is a visual state, checked status in DOM is neither true nor false
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      render(<Checkbox className="custom-checkbox" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('custom-checkbox');
    });
  });
});
