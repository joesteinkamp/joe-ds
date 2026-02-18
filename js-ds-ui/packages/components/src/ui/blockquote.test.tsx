import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Blockquote } from './blockquote';

expect.extend(toHaveNoViolations);

describe('Blockquote', () => {
  describe('Rendering', () => {
    it('renders as a blockquote element', () => {
      const { container } = render(<Blockquote>A wise quote</Blockquote>);
      const blockquote = container.querySelector('blockquote');
      expect(blockquote).toBeInTheDocument();
    });

    it('renders children content', () => {
      render(<Blockquote>The best way to predict the future is to invent it.</Blockquote>);
      expect(screen.getByText('The best way to predict the future is to invent it.')).toBeInTheDocument();
    });
  });

  describe('Variant styles', () => {
    it('default variant has left border and default border color', () => {
      const { container } = render(<Blockquote>Quote</Blockquote>);
      const blockquote = container.querySelector('blockquote');
      expect(blockquote).toHaveClass('border-l-4');
      expect(blockquote).toHaveClass('border-[var(--color-border-default)]');
    });

    it('accent variant has primary interactive border', () => {
      const { container } = render(<Blockquote variant="accent">Quote</Blockquote>);
      const blockquote = container.querySelector('blockquote');
      expect(blockquote).toHaveClass('border-[var(--color-interactive-primary)]');
    });

    it('success variant has success border', () => {
      const { container } = render(<Blockquote variant="success">Quote</Blockquote>);
      const blockquote = container.querySelector('blockquote');
      expect(blockquote).toHaveClass('border-[var(--color-semantic-success)]');
    });

    it('warning variant has warning border', () => {
      const { container } = render(<Blockquote variant="warning">Quote</Blockquote>);
      const blockquote = container.querySelector('blockquote');
      expect(blockquote).toHaveClass('border-[var(--color-semantic-warning)]');
    });

    it('error variant has error border', () => {
      const { container } = render(<Blockquote variant="error">Quote</Blockquote>);
      const blockquote = container.querySelector('blockquote');
      expect(blockquote).toHaveClass('border-[var(--color-semantic-error)]');
    });
  });

  describe('Size variants', () => {
    it('sm size applies small text class', () => {
      const { container } = render(<Blockquote size="sm">Small</Blockquote>);
      const blockquote = container.querySelector('blockquote');
      expect(blockquote).toHaveClass('text-[var(--font-size-sm)]');
    });

    it('base size applies base text class', () => {
      const { container } = render(<Blockquote size="base">Base</Blockquote>);
      const blockquote = container.querySelector('blockquote');
      expect(blockquote).toHaveClass('text-[var(--font-size-base)]');
    });

    it('lg size applies large text class', () => {
      const { container } = render(<Blockquote size="lg">Large</Blockquote>);
      const blockquote = container.querySelector('blockquote');
      expect(blockquote).toHaveClass('text-[var(--font-size-lg)]');
    });

    it('defaults to base size', () => {
      const { container } = render(<Blockquote>Default size</Blockquote>);
      const blockquote = container.querySelector('blockquote');
      expect(blockquote).toHaveClass('text-[var(--font-size-base)]');
    });
  });

  describe('Custom className', () => {
    it('merges custom className with default styles', () => {
      const { container } = render(<Blockquote className="custom-quote">Quote</Blockquote>);
      const blockquote = container.querySelector('blockquote');
      expect(blockquote).toHaveClass('custom-quote');
      expect(blockquote).toHaveClass('border-l-4');
      expect(blockquote).toHaveClass('italic');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to the underlying blockquote element', () => {
      const ref = createRef<HTMLQuoteElement>();
      render(<Blockquote ref={ref}>Quote</Blockquote>);
      expect(ref.current).toBeInstanceOf(HTMLQuoteElement);
      expect(ref.current?.tagName).toBe('BLOCKQUOTE');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations (default variant)', async () => {
      const { container } = render(<Blockquote>A wise quote</Blockquote>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (accent variant)', async () => {
      const { container } = render(
        <Blockquote variant="accent" size="lg">Design is how it works.</Blockquote>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (error variant)', async () => {
      const { container } = render(
        <Blockquote variant="error">Something went wrong.</Blockquote>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
