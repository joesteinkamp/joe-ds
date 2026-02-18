import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Switch } from './switch';
import { Label } from './label';

expect.extend(toHaveNoViolations);

describe('Switch', () => {
  describe('Rendering', () => {
    it('renders unchecked by default', () => {
      render(<Switch />);
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toBeInTheDocument();
      expect(switchEl).not.toBeChecked();
    });

    it('renders checked when defaultChecked is true', () => {
      render(<Switch defaultChecked />);
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toBeChecked();
    });

    it('renders with label', () => {
      render(
        <div className="flex items-center space-x-2">
          <Switch id="airplane" />
          <Label htmlFor="airplane">Airplane Mode</Label>
        </div>
      );
      expect(screen.getByText('Airplane Mode')).toBeInTheDocument();
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('renders disabled state', () => {
      render(<Switch disabled />);
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('toggles on click', async () => {
      const user = userEvent.setup();
      render(<Switch />);
      const switchEl = screen.getByRole('switch');

      expect(switchEl).not.toBeChecked();

      await user.click(switchEl);
      expect(switchEl).toBeChecked();

      await user.click(switchEl);
      expect(switchEl).not.toBeChecked();
    });

    it('calls onCheckedChange callback', async () => {
      const user = userEvent.setup();
      let checked = false;
      const handleChange = (value: boolean) => {
        checked = value;
      };

      render(<Switch onCheckedChange={handleChange} />);
      const switchEl = screen.getByRole('switch');

      await user.click(switchEl);
      expect(checked).toBe(true);

      await user.click(switchEl);
      expect(checked).toBe(false);
    });

    it('does not toggle when disabled', async () => {
      const user = userEvent.setup();
      render(<Switch disabled />);
      const switchEl = screen.getByRole('switch');

      await user.click(switchEl);
      expect(switchEl).not.toBeChecked();
    });

    it('can be controlled', async () => {
      const user = userEvent.setup();
      const ControlledSwitch = () => {
        const [checked, setChecked] = React.useState(false);
        return (
          <Switch checked={checked} onCheckedChange={setChecked} />
        );
      };

      render(<ControlledSwitch />);
      const switchEl = screen.getByRole('switch');

      expect(switchEl).not.toBeChecked();
      await user.click(switchEl);
      expect(switchEl).toBeChecked();
    });
  });

  describe('Keyboard Navigation', () => {
    it('can be focused with Tab', async () => {
      const user = userEvent.setup();
      render(<Switch />);
      const switchEl = screen.getByRole('switch');

      await user.tab();
      expect(switchEl).toHaveFocus();
    });

    it('toggles with Space key', async () => {
      const user = userEvent.setup();
      render(<Switch />);
      const switchEl = screen.getByRole('switch');

      switchEl.focus();
      expect(switchEl).not.toBeChecked();

      await user.keyboard(' ');
      expect(switchEl).toBeChecked();

      await user.keyboard(' ');
      expect(switchEl).not.toBeChecked();
    });

    it('toggles with Enter key', async () => {
      const user = userEvent.setup();
      render(<Switch />);
      const switchEl = screen.getByRole('switch');

      switchEl.focus();
      expect(switchEl).not.toBeChecked();

      await user.keyboard('{Enter}');
      expect(switchEl).toBeChecked();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations (unchecked)', async () => {
      const { container } = render(<Switch aria-label="Toggle" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (checked)', async () => {
      const { container } = render(<Switch checked aria-label="Toggle" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (disabled)', async () => {
      const { container } = render(<Switch disabled aria-label="Toggle" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (with label)', async () => {
      const { container } = render(
        <>
          <Switch id="test-switch" />
          <Label htmlFor="test-switch">Test Label</Label>
        </>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports aria-label', () => {
      render(<Switch aria-label="Airplane mode toggle" />);
      expect(screen.getByLabelText('Airplane mode toggle')).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(
        <>
          <Switch aria-describedby="help" />
          <span id="help">Toggle this setting</span>
        </>
      );
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('aria-describedby', 'help');
    });

    it('associates with label via htmlFor/id', () => {
      render(
        <>
          <Switch id="switch1" />
          <Label htmlFor="switch1">Enable feature</Label>
        </>
      );
      expect(screen.getByLabelText('Enable feature')).toBeInTheDocument();
    });

    it('has correct aria-checked attribute', async () => {
      const user = userEvent.setup();
      render(<Switch />);
      const switchEl = screen.getByRole('switch');

      expect(switchEl).toHaveAttribute('aria-checked', 'false');

      await user.click(switchEl);
      expect(switchEl).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Visual States', () => {
    it('shows thumb in correct position when unchecked', () => {
      const { container } = render(<Switch />);
      const thumb = container.querySelector('[data-state="unchecked"]');
      expect(thumb).toBeInTheDocument();
    });

    it('shows thumb in correct position when checked', () => {
      const { container } = render(<Switch checked />);
      const thumb = container.querySelector('[data-state="checked"]');
      expect(thumb).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      render(<Switch className="custom-switch" />);
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveClass('custom-switch');
    });
  });
});
