import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Input } from './input';

expect.extend(toHaveNoViolations);

describe('Input', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText(/enter text/i);
      expect(input).toBeInTheDocument();
    });

    it('renders different input types', () => {
      const types = ['text', 'email', 'password', 'number', 'tel', 'url', 'search'];

      types.forEach((type) => {
        const { unmount } = render(<Input type={type} data-testid={`input-${type}`} />);
        const input = screen.getByTestId(`input-${type}`);
        expect(input).toHaveAttribute('type', type);
        unmount();
      });
    });
  });

  describe('Interactions', () => {
    it('handles text input', async () => {
      const user = userEvent.setup();
      render(<Input placeholder="Type here" />);
      const input = screen.getByPlaceholderText(/type here/i);

      await user.type(input, 'Hello World');
      expect(input).toHaveValue('Hello World');
    });

    it('handles onChange events', async () => {
      const user = userEvent.setup();
      let value = '';
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        value = e.target.value;
      };

      render(<Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'Test');
      expect(value).toBe('Test');
    });

    it('can be focused with keyboard', async () => {
      const user = userEvent.setup();
      render(<Input />);
      const input = screen.getByRole('textbox');

      await user.tab();
      expect(input).toHaveFocus();
    });

    it('does not accept input when disabled', async () => {
      const user = userEvent.setup();
      render(<Input disabled />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'Test');
      expect(input).toHaveValue('');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <div>
          <label htmlFor="test-input">Email</label>
          <Input id="test-input" type="email" />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (disabled)', async () => {
      const { container } = render(
        <div>
          <label htmlFor="test-input">Email</label>
          <Input id="test-input" disabled />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports aria-label', () => {
      render(<Input aria-label="Search query" type="search" />);
      const input = screen.getByLabelText(/search query/i);
      expect(input).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(
        <>
          <Input aria-describedby="help-text" />
          <span id="help-text">Enter your email address</span>
        </>
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('supports aria-invalid for validation', () => {
      render(<Input aria-invalid="true" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('supports aria-required', () => {
      render(<Input required aria-required="true" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).toBeRequired();
    });
  });

  describe('Form integration', () => {
    it('works in a controlled component', async () => {
      const user = userEvent.setup();
      const ControlledInput = () => {
        const [value, setValue] = React.useState('');
        return (
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        );
      };

      render(<ControlledInput />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'Controlled');
      expect(input).toHaveValue('Controlled');
    });

    it('supports required attribute', () => {
      render(<Input required />);
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('supports minLength and maxLength', () => {
      render(<Input minLength={3} maxLength={10} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('minLength', '3');
      expect(input).toHaveAttribute('maxLength', '10');
    });
  });

  describe('Custom className', () => {
    it('merges custom className with default styles', () => {
      render(<Input className="custom-input" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-input');
    });
  });
});
