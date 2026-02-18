import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Icon } from './icon';

expect.extend(toHaveNoViolations);

const MockSvgIcon = () => (
  <svg data-testid="mock-svg" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

describe('Icon', () => {
  describe('Rendering', () => {
    it('renders as a span element', () => {
      const { container } = render(<Icon icon={<MockSvgIcon />} />);
      const span = container.querySelector('span');
      expect(span).toBeInTheDocument();
    });

    it('renders icon prop content', () => {
      render(<Icon icon={<MockSvgIcon />} />);
      expect(screen.getByTestId('mock-svg')).toBeInTheDocument();
    });

    it('renders children when no icon prop is provided', () => {
      render(
        <Icon>
          <MockSvgIcon />
        </Icon>
      );
      expect(screen.getByTestId('mock-svg')).toBeInTheDocument();
    });

    it('prefers icon prop over children', () => {
      render(
        <Icon icon={<span data-testid="icon-prop">icon</span>}>
          <span data-testid="children">children</span>
        </Icon>
      );
      expect(screen.getByTestId('icon-prop')).toBeInTheDocument();
      expect(screen.queryByTestId('children')).not.toBeInTheDocument();
    });
  });

  describe('Size variants', () => {
    it('defaults to md size', () => {
      const { container } = render(<Icon icon={<MockSvgIcon />} />);
      const span = container.querySelector('span');
      expect(span).toHaveClass('h-[var(--sizing-component-icon-md,1.5rem)]');
      expect(span).toHaveClass('w-[var(--sizing-component-icon-md,1.5rem)]');
    });

    it('applies xs size', () => {
      const { container } = render(<Icon icon={<MockSvgIcon />} size="xs" />);
      const span = container.querySelector('span');
      expect(span).toHaveClass('h-[var(--sizing-component-icon-xs,1rem)]');
      expect(span).toHaveClass('w-[var(--sizing-component-icon-xs,1rem)]');
    });

    it('applies sm size', () => {
      const { container } = render(<Icon icon={<MockSvgIcon />} size="sm" />);
      const span = container.querySelector('span');
      expect(span).toHaveClass('h-[var(--sizing-component-icon-sm,1.25rem)]');
      expect(span).toHaveClass('w-[var(--sizing-component-icon-sm,1.25rem)]');
    });

    it('applies lg size', () => {
      const { container } = render(<Icon icon={<MockSvgIcon />} size="lg" />);
      const span = container.querySelector('span');
      expect(span).toHaveClass('h-[var(--sizing-component-icon-lg,2rem)]');
      expect(span).toHaveClass('w-[var(--sizing-component-icon-lg,2rem)]');
    });

    it('applies xl size', () => {
      const { container } = render(<Icon icon={<MockSvgIcon />} size="xl" />);
      const span = container.querySelector('span');
      expect(span).toHaveClass('h-[var(--sizing-component-icon-xl,2.5rem)]');
      expect(span).toHaveClass('w-[var(--sizing-component-icon-xl,2.5rem)]');
    });
  });

  describe('Color variants', () => {
    it('defaults to current color', () => {
      const { container } = render(<Icon icon={<MockSvgIcon />} />);
      const span = container.querySelector('span');
      expect(span).toHaveClass('text-current');
    });

    it('applies primary color', () => {
      const { container } = render(<Icon icon={<MockSvgIcon />} color="primary" />);
      const span = container.querySelector('span');
      expect(span).toHaveClass('text-[var(--color-text-primary)]');
    });

    it('applies secondary color', () => {
      const { container } = render(<Icon icon={<MockSvgIcon />} color="secondary" />);
      const span = container.querySelector('span');
      expect(span).toHaveClass('text-[var(--color-text-secondary)]');
    });

    it('applies tertiary color', () => {
      const { container } = render(<Icon icon={<MockSvgIcon />} color="tertiary" />);
      const span = container.querySelector('span');
      expect(span).toHaveClass('text-[var(--color-text-tertiary)]');
    });

    it('applies accent color', () => {
      const { container } = render(<Icon icon={<MockSvgIcon />} color="accent" />);
      const span = container.querySelector('span');
      expect(span).toHaveClass('text-[var(--color-interactive-primary)]');
    });

    it('applies success color', () => {
      const { container } = render(<Icon icon={<MockSvgIcon />} color="success" />);
      const span = container.querySelector('span');
      expect(span).toHaveClass('text-[var(--color-text-success)]');
    });

    it('applies warning color', () => {
      const { container } = render(<Icon icon={<MockSvgIcon />} color="warning" />);
      const span = container.querySelector('span');
      expect(span).toHaveClass('text-[var(--color-text-warning)]');
    });

    it('applies error color', () => {
      const { container } = render(<Icon icon={<MockSvgIcon />} color="error" />);
      const span = container.querySelector('span');
      expect(span).toHaveClass('text-[var(--color-text-error)]');
    });

    it('applies info color', () => {
      const { container } = render(<Icon icon={<MockSvgIcon />} color="info" />);
      const span = container.querySelector('span');
      expect(span).toHaveClass('text-[var(--color-text-info)]');
    });
  });

  describe('Accessibility attributes', () => {
    it('without label: sets aria-hidden="true" and no role', () => {
      const { container } = render(<Icon icon={<MockSvgIcon />} />);
      const span = container.querySelector('span');
      expect(span).toHaveAttribute('aria-hidden', 'true');
      expect(span).not.toHaveAttribute('role');
    });

    it('with label: sets role="img" and aria-label', () => {
      render(<Icon icon={<MockSvgIcon />} label="Search icon" />);
      const span = screen.getByRole('img');
      expect(span).toHaveAttribute('aria-label', 'Search icon');
      expect(span).not.toHaveAttribute('aria-hidden');
    });
  });

  describe('Custom className', () => {
    it('merges custom className with default styles', () => {
      const { container } = render(<Icon icon={<MockSvgIcon />} className="custom-icon" />);
      const span = container.querySelector('span');
      expect(span).toHaveClass('custom-icon');
      expect(span).toHaveClass('inline-flex');
      expect(span).toHaveClass('shrink-0');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to the underlying span element', () => {
      const ref = createRef<HTMLSpanElement>();
      render(<Icon ref={ref} icon={<MockSvgIcon />} />);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current?.tagName).toBe('SPAN');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations with label', async () => {
      const { container } = render(
        <Icon icon={<MockSvgIcon />} label="Search" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations without label (decorative)', async () => {
      const { container } = render(<Icon icon={<MockSvgIcon />} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with color and size', async () => {
      const { container } = render(
        <Icon icon={<MockSvgIcon />} color="error" size="lg" label="Error" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
