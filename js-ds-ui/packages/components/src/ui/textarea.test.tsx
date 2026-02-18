import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Textarea } from './textarea';

expect.extend(toHaveNoViolations);

describe('Textarea', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(<Textarea placeholder="Enter your message" />);
      const textarea = screen.getByPlaceholderText(/enter your message/i);
      expect(textarea).toBeInTheDocument();
    });

    it('renders as a textarea element', () => {
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea.tagName).toBe('TEXTAREA');
    });
  });

  describe('Interactions', () => {
    it('handles value changes', async () => {
      const user = userEvent.setup();
      render(<Textarea placeholder="Type here" />);
      const textarea = screen.getByPlaceholderText(/type here/i);

      await user.type(textarea, 'Hello World');
      expect(textarea).toHaveValue('Hello World');
    });

    it('handles onChange events', async () => {
      const user = userEvent.setup();
      let value = '';
      const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        value = e.target.value;
      };

      render(<Textarea onChange={handleChange} />);
      const textarea = screen.getByRole('textbox');

      await user.type(textarea, 'Test');
      expect(value).toBe('Test');
    });

    it('does not accept input when disabled', async () => {
      const user = userEvent.setup();
      render(<Textarea disabled />);
      const textarea = screen.getByRole('textbox');

      await user.type(textarea, 'Test');
      expect(textarea).toHaveValue('');
    });

    it('can be focused with Tab', async () => {
      const user = userEvent.setup();
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');

      await user.tab();
      expect(textarea).toHaveFocus();
    });

    it('handles focus events', async () => {
      let focused = false;
      const handleFocus = () => {
        focused = true;
      };

      render(<Textarea onFocus={handleFocus} />);
      const textarea = screen.getByRole('textbox');

      textarea.focus();
      expect(focused).toBe(true);
    });

    it('handles blur events', async () => {
      let blurred = false;
      const handleBlur = () => {
        blurred = true;
      };

      render(<Textarea onBlur={handleBlur} />);
      const textarea = screen.getByRole('textbox');

      textarea.focus();
      textarea.blur();
      expect(blurred).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <div>
          <label htmlFor="test-textarea">Message</label>
          <Textarea id="test-textarea" />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (disabled)', async () => {
      const { container } = render(
        <div>
          <label htmlFor="test-textarea">Message</label>
          <Textarea id="test-textarea" disabled />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports aria-label', () => {
      render(<Textarea aria-label="Enter comments" />);
      const textarea = screen.getByLabelText(/enter comments/i);
      expect(textarea).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(
        <>
          <Textarea aria-describedby="help-text" />
          <span id="help-text">Maximum 500 characters</span>
        </>
      );
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('supports aria-invalid for validation', () => {
      render(<Textarea aria-invalid="true" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Custom className', () => {
    it('merges custom className with default styles', () => {
      render(<Textarea className="custom-textarea" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('custom-textarea');
    });
  });
});
