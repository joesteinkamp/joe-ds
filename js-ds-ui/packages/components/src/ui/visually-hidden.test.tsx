import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { VisuallyHidden } from './visually-hidden';

expect.extend(toHaveNoViolations);

describe('VisuallyHidden', () => {
  describe('Rendering', () => {
    it('renders children', () => {
      render(<VisuallyHidden>Hidden text</VisuallyHidden>);
      expect(screen.getByText('Hidden text')).toBeInTheDocument();
    });

    it('content is not visible', () => {
      const { container } = render(<VisuallyHidden>Hidden content</VisuallyHidden>);
      const element = container.firstChild as HTMLElement;

      const styles = window.getComputedStyle(element);

      // Check for visually hidden styles
      expect(
        styles.position === 'absolute' ||
        styles.clip === 'rect(0, 0, 0, 0)' ||
        styles.width === '1px' ||
        styles.height === '1px' ||
        styles.overflow === 'hidden'
      ).toBe(true);
    });

    it('content is accessible to screen readers', () => {
      render(<VisuallyHidden>Screen reader text</VisuallyHidden>);

      // Content should be in the document (accessible to screen readers)
      expect(screen.getByText('Screen reader text')).toBeInTheDocument();
    });
  });

  describe('Use Cases', () => {
    it('works with icon-only buttons', () => {
      render(
        <button>
          <span aria-hidden="true">❌</span>
          <VisuallyHidden>Close</VisuallyHidden>
        </button>
      );

      expect(screen.getByText('Close')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('provides accessible labels', () => {
      render(
        <div>
          <VisuallyHidden id="chart-label">Sales chart for 2024</VisuallyHidden>
          <div aria-labelledby="chart-label">Chart visualization</div>
        </div>
      );

      expect(screen.getByText('Sales chart for 2024')).toBeInTheDocument();
    });

    it('adds context for screen readers', () => {
      render(
        <a href="/products">
          View products
          <VisuallyHidden>(opens in new tab)</VisuallyHidden>
        </a>
      );

      expect(screen.getByText('(opens in new tab)')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <VisuallyHidden>Accessible content</VisuallyHidden>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations in button', async () => {
      const { container } = render(
        <button>
          <span>Icon</span>
          <VisuallyHidden>Button label</VisuallyHidden>
        </button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Multiple Children', () => {
    it('renders multiple children', () => {
      render(
        <VisuallyHidden>
          <span>Part 1</span>
          <span>Part 2</span>
        </VisuallyHidden>
      );

      expect(screen.getByText('Part 1')).toBeInTheDocument();
      expect(screen.getByText('Part 2')).toBeInTheDocument();
    });

    it('renders nested content', () => {
      render(
        <VisuallyHidden>
          <div>
            <p>Nested paragraph</p>
          </div>
        </VisuallyHidden>
      );

      expect(screen.getByText('Nested paragraph')).toBeInTheDocument();
    });
  });
});
