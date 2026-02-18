import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Container } from './container';

expect.extend(toHaveNoViolations);

describe('Container', () => {
  describe('Rendering', () => {
    it('renders children', () => {
      render(<Container>Hello World</Container>);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('renders as a div by default', () => {
      const { container } = render(<Container>Content</Container>);
      expect(container.firstChild?.nodeName).toBe('DIV');
    });

    it('has mx-auto and w-full base classes', () => {
      const { container } = render(<Container>Content</Container>);
      expect(container.firstChild).toHaveClass('mx-auto');
      expect(container.firstChild).toHaveClass('w-full');
    });
  });

  describe('Size variants', () => {
    it('defaults to lg (max-w-screen-lg)', () => {
      const { container } = render(<Container>Content</Container>);
      expect(container.firstChild).toHaveClass('max-w-screen-lg');
    });

    it('applies max-w-screen-sm for sm size', () => {
      const { container } = render(<Container size="sm">Content</Container>);
      expect(container.firstChild).toHaveClass('max-w-screen-sm');
    });

    it('applies max-w-screen-md for md size', () => {
      const { container } = render(<Container size="md">Content</Container>);
      expect(container.firstChild).toHaveClass('max-w-screen-md');
    });

    it('applies max-w-screen-xl for xl size', () => {
      const { container } = render(<Container size="xl">Content</Container>);
      expect(container.firstChild).toHaveClass('max-w-screen-xl');
    });

    it('applies max-w-screen-2xl for 2xl size', () => {
      const { container } = render(<Container size="2xl">Content</Container>);
      expect(container.firstChild).toHaveClass('max-w-screen-2xl');
    });

    it('applies max-w-full for full size', () => {
      const { container } = render(<Container size="full">Content</Container>);
      expect(container.firstChild).toHaveClass('max-w-full');
    });

    it('applies max-w-prose for prose size', () => {
      const { container } = render(<Container size="prose">Content</Container>);
      expect(container.firstChild).toHaveClass('max-w-prose');
    });
  });

  describe('Padding variants', () => {
    it('applies default padding from base class', () => {
      const { container } = render(<Container>Content</Container>);
      expect(container.firstChild).toHaveClass('px-[var(--space-layout-container,2rem)]');
    });

    it('applies px-0 for none padding', () => {
      const { container } = render(<Container padding="none">Content</Container>);
      expect(container.firstChild).toHaveClass('px-0');
    });

    it('applies sm padding', () => {
      const { container } = render(<Container padding="sm">Content</Container>);
      expect(container.firstChild).toHaveClass('px-[var(--space-component-padding-sm,0.5rem)]');
    });

    it('applies md padding', () => {
      const { container } = render(<Container padding="md">Content</Container>);
      expect(container.firstChild).toHaveClass('px-[var(--space-component-padding-md,0.75rem)]');
    });

    it('applies lg padding', () => {
      const { container } = render(<Container padding="lg">Content</Container>);
      expect(container.firstChild).toHaveClass('px-[var(--space-layout-container,2rem)]');
    });

    it('applies xl padding', () => {
      const { container } = render(<Container padding="xl">Content</Container>);
      expect(container.firstChild).toHaveClass('px-[var(--space-layout-section,4rem)]');
    });
  });

  describe('Center variant', () => {
    it('does not apply center classes by default', () => {
      const { container } = render(<Container>Content</Container>);
      expect(container.firstChild).not.toHaveClass('items-center');
    });

    it('applies flex and items-center when center is true', () => {
      const { container } = render(<Container center>Content</Container>);
      expect(container.firstChild).toHaveClass('flex');
      expect(container.firstChild).toHaveClass('flex-col');
      expect(container.firstChild).toHaveClass('items-center');
    });
  });

  describe('Custom className', () => {
    it('merges custom className with default styles', () => {
      const { container } = render(<Container className="custom-class">Content</Container>);
      expect(container.firstChild).toHaveClass('custom-class');
      expect(container.firstChild).toHaveClass('mx-auto');
      expect(container.firstChild).toHaveClass('w-full');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to the underlying element', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Container ref={ref}>Content</Container>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.textContent).toBe('Content');
    });
  });

  describe('Polymorphic as prop', () => {
    it('renders as a section element', () => {
      const { container } = render(<Container as="section">Content</Container>);
      expect(container.firstChild?.nodeName).toBe('SECTION');
    });

    it('renders as a main element', () => {
      render(<Container as="main">Content</Container>);
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });

    it('renders as an article element', () => {
      render(<Container as="article">Content</Container>);
      const article = screen.getByRole('article');
      expect(article).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations with default props', async () => {
      const { container } = render(
        <Container>
          <p>Page content</p>
        </Container>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations as main', async () => {
      const { container } = render(
        <Container as="main">
          <h1>Page Title</h1>
          <p>Page content</p>
        </Container>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with center variant', async () => {
      const { container } = render(
        <Container center>
          <p>Centered content</p>
        </Container>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports arbitrary data attributes', () => {
      const { container } = render(<Container data-testid="my-container">Content</Container>);
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-container');
    });
  });
});
