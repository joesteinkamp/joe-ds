import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Stack } from './stack';

expect.extend(toHaveNoViolations);

describe('Stack', () => {
  describe('Rendering', () => {
    it('renders children', () => {
      render(
        <Stack>
          <div>First</div>
          <div>Second</div>
        </Stack>
      );
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });

    it('renders as a div by default', () => {
      const { container } = render(<Stack>Content</Stack>);
      expect(container.firstChild?.nodeName).toBe('DIV');
    });
  });

  describe('Direction variants', () => {
    it('defaults to vertical direction (flex-col)', () => {
      const { container } = render(<Stack>Content</Stack>);
      expect(container.firstChild).toHaveClass('flex-col');
    });

    it('applies flex-row for horizontal direction', () => {
      const { container } = render(<Stack direction="horizontal">Content</Stack>);
      expect(container.firstChild).toHaveClass('flex-row');
    });
  });

  describe('Spacing variants', () => {
    it('applies gap-0 for none spacing', () => {
      const { container } = render(<Stack spacing="none">Content</Stack>);
      expect(container.firstChild).toHaveClass('gap-0');
    });

    it('applies xs spacing', () => {
      const { container } = render(<Stack spacing="xs">Content</Stack>);
      expect(container.firstChild).toHaveClass('gap-[var(--space-component-gap-xs,0.25rem)]');
    });

    it('applies sm spacing', () => {
      const { container } = render(<Stack spacing="sm">Content</Stack>);
      expect(container.firstChild).toHaveClass('gap-[var(--space-component-gap-sm,0.5rem)]');
    });

    it('applies md spacing (default)', () => {
      const { container } = render(<Stack>Content</Stack>);
      expect(container.firstChild).toHaveClass('gap-[var(--space-component-gap-md,0.75rem)]');
    });

    it('applies lg spacing', () => {
      const { container } = render(<Stack spacing="lg">Content</Stack>);
      expect(container.firstChild).toHaveClass('gap-[var(--space-component-gap-lg,1rem)]');
    });

    it('applies xl spacing', () => {
      const { container } = render(<Stack spacing="xl">Content</Stack>);
      expect(container.firstChild).toHaveClass('gap-[var(--space-layout-section,4rem)]');
    });
  });

  describe('Align variants', () => {
    it('defaults to stretch alignment', () => {
      const { container } = render(<Stack>Content</Stack>);
      expect(container.firstChild).toHaveClass('items-stretch');
    });

    it('applies items-start', () => {
      const { container } = render(<Stack align="start">Content</Stack>);
      expect(container.firstChild).toHaveClass('items-start');
    });

    it('applies items-center', () => {
      const { container } = render(<Stack align="center">Content</Stack>);
      expect(container.firstChild).toHaveClass('items-center');
    });

    it('applies items-end', () => {
      const { container } = render(<Stack align="end">Content</Stack>);
      expect(container.firstChild).toHaveClass('items-end');
    });

    it('applies items-baseline', () => {
      const { container } = render(<Stack align="baseline">Content</Stack>);
      expect(container.firstChild).toHaveClass('items-baseline');
    });
  });

  describe('Justify variants', () => {
    it('applies justify-start', () => {
      const { container } = render(<Stack justify="start">Content</Stack>);
      expect(container.firstChild).toHaveClass('justify-start');
    });

    it('applies justify-center', () => {
      const { container } = render(<Stack justify="center">Content</Stack>);
      expect(container.firstChild).toHaveClass('justify-center');
    });

    it('applies justify-end', () => {
      const { container } = render(<Stack justify="end">Content</Stack>);
      expect(container.firstChild).toHaveClass('justify-end');
    });

    it('applies justify-between', () => {
      const { container } = render(<Stack justify="between">Content</Stack>);
      expect(container.firstChild).toHaveClass('justify-between');
    });

    it('applies justify-around', () => {
      const { container } = render(<Stack justify="around">Content</Stack>);
      expect(container.firstChild).toHaveClass('justify-around');
    });

    it('applies justify-evenly', () => {
      const { container } = render(<Stack justify="evenly">Content</Stack>);
      expect(container.firstChild).toHaveClass('justify-evenly');
    });
  });

  describe('Wrap variant', () => {
    it('defaults to flex-nowrap', () => {
      const { container } = render(<Stack>Content</Stack>);
      expect(container.firstChild).toHaveClass('flex-nowrap');
    });

    it('applies flex-wrap when wrap is true', () => {
      const { container } = render(<Stack wrap>Content</Stack>);
      expect(container.firstChild).toHaveClass('flex-wrap');
    });
  });

  describe('Custom className', () => {
    it('merges custom className with default styles', () => {
      const { container } = render(<Stack className="custom-class">Content</Stack>);
      expect(container.firstChild).toHaveClass('custom-class');
      expect(container.firstChild).toHaveClass('flex');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to the underlying element', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Stack ref={ref}>Content</Stack>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.textContent).toBe('Content');
    });
  });

  describe('Polymorphic as prop', () => {
    it('renders as a section element', () => {
      const { container } = render(<Stack as="section">Content</Stack>);
      expect(container.firstChild?.nodeName).toBe('SECTION');
    });

    it('renders as a nav element', () => {
      render(<Stack as="nav" aria-label="Main">Content</Stack>);
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('renders as a ul element', () => {
      const { container } = render(<Stack as="ul">Content</Stack>);
      expect(container.firstChild?.nodeName).toBe('UL');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations with default props', async () => {
      const { container } = render(
        <Stack>
          <p>First item</p>
          <p>Second item</p>
        </Stack>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations as nav', async () => {
      const { container } = render(
        <Stack as="nav" aria-label="Navigation">
          <a href="/home">Home</a>
          <a href="/about">About</a>
        </Stack>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports arbitrary data attributes', () => {
      const { container } = render(<Stack data-testid="my-stack">Content</Stack>);
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-stack');
    });
  });
});
