import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Skeleton } from './skeleton';

expect.extend(toHaveNoViolations);

describe('Skeleton', () => {
  describe('Rendering', () => {
    it('renders with animate-pulse class', () => {
      render(<Skeleton data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('renders as a div element', () => {
      render(<Skeleton data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.tagName).toBe('DIV');
    });
  });

  describe('Custom className', () => {
    it('merges custom className with default styles', () => {
      render(<Skeleton data-testid="skeleton" className="h-12 w-12 rounded-full" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('animate-pulse');
      expect(skeleton).toHaveClass('h-12');
      expect(skeleton).toHaveClass('w-12');
      expect(skeleton).toHaveClass('rounded-full');
    });
  });

  describe('Data attributes and aria', () => {
    it('supports data attributes', () => {
      render(<Skeleton data-testid="skeleton" data-loading="true" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveAttribute('data-loading', 'true');
    });

    it('supports aria-hidden', () => {
      render(<Skeleton data-testid="skeleton" aria-hidden="true" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Skeleton aria-hidden="true" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with custom sizing', async () => {
      const { container } = render(
        <div>
          <Skeleton className="h-4 w-[250px]" aria-hidden="true" />
          <Skeleton className="h-4 w-[200px]" aria-hidden="true" />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
