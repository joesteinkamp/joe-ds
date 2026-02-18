import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Badge } from './badge';

expect.extend(toHaveNoViolations);

describe('Badge', () => {
  describe('Rendering', () => {
    it('renders with default variant', () => {
      render(<Badge>Default</Badge>);
      const badge = screen.getByText('Default');
      expect(badge).toBeInTheDocument();
    });

    it('renders all variants', () => {
      const variants = ['default', 'secondary', 'outline', 'destructive', 'success', 'warning'] as const;

      variants.forEach((variant) => {
        const { unmount } = render(<Badge variant={variant}>{variant}</Badge>);
        expect(screen.getByText(variant)).toBeInTheDocument();
        unmount();
      });
    });

    it('renders children content', () => {
      render(<Badge>Status Active</Badge>);
      expect(screen.getByText('Status Active')).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('merges custom className with default styles', () => {
      render(<Badge className="custom-badge">Custom</Badge>);
      const badge = screen.getByText('Custom');
      expect(badge).toHaveClass('custom-badge');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations (default variant)', async () => {
      const { container } = render(<Badge>Default</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (secondary variant)', async () => {
      const { container } = render(<Badge variant="secondary">Secondary</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (outline variant)', async () => {
      const { container } = render(<Badge variant="outline">Outline</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (destructive variant)', async () => {
      const { container } = render(<Badge variant="destructive">Error</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (success variant)', async () => {
      const { container } = render(<Badge variant="success">Active</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (warning variant)', async () => {
      const { container } = render(<Badge variant="warning">Pending</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
