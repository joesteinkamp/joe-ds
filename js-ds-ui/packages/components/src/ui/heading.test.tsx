import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Heading } from './heading';

expect.extend(toHaveNoViolations);

describe('Heading', () => {
  describe('Rendering', () => {
    it('defaults to h2 element', () => {
      render(<Heading>Default Heading</Heading>);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toBe('Default Heading');
    });

    it('renders h1 for level 1', () => {
      render(<Heading level={1}>Page Title</Heading>);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('renders h3 for level 3', () => {
      render(<Heading level={3}>Section Title</Heading>);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
    });

    it('renders h4 for level 4', () => {
      render(<Heading level={4}>Subsection</Heading>);
      const heading = screen.getByRole('heading', { level: 4 });
      expect(heading).toBeInTheDocument();
    });

    it('renders h5 for level 5', () => {
      render(<Heading level={5}>Minor heading</Heading>);
      const heading = screen.getByRole('heading', { level: 5 });
      expect(heading).toBeInTheDocument();
    });

    it('renders h6 for level 6', () => {
      render(<Heading level={6}>Smallest heading</Heading>);
      const heading = screen.getByRole('heading', { level: 6 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Size variants', () => {
    it('defaults visual size to match level', () => {
      const { container } = render(<Heading level={1}>Title</Heading>);
      expect(container.firstChild).toHaveClass('text-[var(--font-size-5xl)]');
    });

    it('defaults visual size to 2 for default level', () => {
      const { container } = render(<Heading>Title</Heading>);
      expect(container.firstChild).toHaveClass('text-[var(--font-size-4xl)]');
    });

    it('allows size override independent of level', () => {
      const { container } = render(
        <Heading level={2} size="4">Visually smaller h2</Heading>
      );
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(container.firstChild).toHaveClass('text-[var(--font-size-2xl)]');
    });

    it('applies correct size class for each size value', () => {
      const sizeMap = {
        '1': 'text-[var(--font-size-5xl)]',
        '2': 'text-[var(--font-size-4xl)]',
        '3': 'text-[var(--font-size-3xl)]',
        '4': 'text-[var(--font-size-2xl)]',
        '5': 'text-[var(--font-size-xl)]',
        '6': 'text-[var(--font-size-lg)]',
      } as const;

      (Object.entries(sizeMap) as [keyof typeof sizeMap, string][]).forEach(([size, expectedClass]) => {
        const { container, unmount } = render(<Heading size={size}>Heading</Heading>);
        expect(container.firstChild).toHaveClass(expectedClass);
        unmount();
      });
    });
  });

  describe('Weight variants', () => {
    it('defaults to bold weight', () => {
      const { container } = render(<Heading>Bold Heading</Heading>);
      expect(container.firstChild).toHaveClass('font-[var(--font-weight-bold)]');
    });

    it('applies normal weight', () => {
      const { container } = render(<Heading weight="normal">Normal</Heading>);
      expect(container.firstChild).toHaveClass('font-[var(--font-weight-normal)]');
    });

    it('applies medium weight', () => {
      const { container } = render(<Heading weight="medium">Medium</Heading>);
      expect(container.firstChild).toHaveClass('font-[var(--font-weight-medium)]');
    });

    it('applies semibold weight', () => {
      const { container } = render(<Heading weight="semibold">Semibold</Heading>);
      expect(container.firstChild).toHaveClass('font-[var(--font-weight-semibold)]');
    });
  });

  describe('Align variants', () => {
    it('applies text-left for left align', () => {
      const { container } = render(<Heading align="left">Left</Heading>);
      expect(container.firstChild).toHaveClass('text-left');
    });

    it('applies text-center for center align', () => {
      const { container } = render(<Heading align="center">Center</Heading>);
      expect(container.firstChild).toHaveClass('text-center');
    });

    it('applies text-right for right align', () => {
      const { container } = render(<Heading align="right">Right</Heading>);
      expect(container.firstChild).toHaveClass('text-right');
    });
  });

  describe('Truncate variant', () => {
    it('does not truncate by default', () => {
      const { container } = render(<Heading>Not truncated</Heading>);
      expect(container.firstChild).not.toHaveClass('truncate');
    });

    it('applies truncate class when enabled', () => {
      const { container } = render(<Heading truncate>Truncated heading</Heading>);
      expect(container.firstChild).toHaveClass('truncate');
    });
  });

  describe('Custom className', () => {
    it('merges custom className with default styles', () => {
      const { container } = render(<Heading className="custom-class">Title</Heading>);
      expect(container.firstChild).toHaveClass('custom-class');
      expect(container.firstChild).toHaveClass('tracking-tight');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to the underlying heading element', () => {
      const ref = createRef<HTMLHeadingElement>();
      render(<Heading ref={ref}>Title</Heading>);
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
      expect(ref.current?.tagName).toBe('H2');
    });

    it('forwards ref to h1 when level is 1', () => {
      const ref = createRef<HTMLHeadingElement>();
      render(<Heading ref={ref} level={1}>Title</Heading>);
      expect(ref.current?.tagName).toBe('H1');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations for default h2', async () => {
      const { container } = render(
        <div>
          <Heading level={1}>Page Title</Heading>
          <Heading>Section Title</Heading>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations for h1', async () => {
      const { container } = render(<Heading level={1}>Page Title</Heading>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with size override', async () => {
      const { container } = render(
        <Heading level={2} size="4">Visually smaller h2</Heading>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports arbitrary data attributes', () => {
      const { container } = render(<Heading data-testid="my-heading">Title</Heading>);
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-heading');
    });
  });
});
