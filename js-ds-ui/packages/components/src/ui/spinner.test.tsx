import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Spinner } from './spinner';

expect.extend(toHaveNoViolations);

describe('Spinner', () => {
  describe('Rendering', () => {
    it('renders with role="status"', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
    });

    it('renders as an SVG element', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner.tagName).toBe('svg');
    });

    it('renders with default aria-label="Loading"', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-label', 'Loading');
    });

    it('renders with custom label prop', () => {
      render(<Spinner label="Submitting" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-label', 'Submitting');
    });
  });

  describe('Size variants', () => {
    it('renders with sm size', () => {
      render(<Spinner size="sm" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('h-4', 'w-4');
    });

    it('renders with md size (default)', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('h-6', 'w-6');
    });

    it('renders with lg size', () => {
      render(<Spinner size="lg" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('h-8', 'w-8');
    });

    it('renders with xl size', () => {
      render(<Spinner size="xl" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('h-12', 'w-12');
    });

    it('renders all size variants', () => {
      const sizes = ['sm', 'md', 'lg', 'xl'] as const;

      sizes.forEach((size) => {
        const { unmount } = render(<Spinner size={size} />);
        expect(screen.getByRole('status')).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Custom className', () => {
    it('merges custom className with default styles', () => {
      render(<Spinner className="custom-spinner" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('custom-spinner');
      expect(spinner).toHaveClass('animate-spin');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Spinner />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with custom label', async () => {
      const { container } = render(<Spinner label="Processing request" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (lg size)', async () => {
      const { container } = render(<Spinner size="lg" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
