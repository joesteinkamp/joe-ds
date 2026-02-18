import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Text } from './text';

expect.extend(toHaveNoViolations);

describe('Text', () => {
  describe('Rendering', () => {
    it('renders as a p element by default', () => {
      const { container } = render(<Text>Hello World</Text>);
      expect(container.firstChild?.nodeName).toBe('P');
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });
  });

  describe('Size variants', () => {
    it('defaults to base size', () => {
      const { container } = render(<Text>Content</Text>);
      expect(container.firstChild).toHaveClass('[font-size:var(--font-size-base)]');
    });

    it('applies xs size', () => {
      const { container } = render(<Text size="xs">Extra small</Text>);
      expect(container.firstChild).toHaveClass('[font-size:var(--font-size-xs)]');
    });

    it('applies sm size', () => {
      const { container } = render(<Text size="sm">Small</Text>);
      expect(container.firstChild).toHaveClass('[font-size:var(--font-size-sm)]');
    });

    it('applies lg size', () => {
      const { container } = render(<Text size="lg">Large</Text>);
      expect(container.firstChild).toHaveClass('[font-size:var(--font-size-lg)]');
    });

    it('applies xl size', () => {
      const { container } = render(<Text size="xl">Extra large</Text>);
      expect(container.firstChild).toHaveClass('[font-size:var(--font-size-xl)]');
    });
  });

  describe('Weight variants', () => {
    it('defaults to normal weight', () => {
      const { container } = render(<Text>Content</Text>);
      expect(container.firstChild).toHaveClass('[font-weight:var(--font-weight-normal)]');
    });

    it('applies medium weight', () => {
      const { container } = render(<Text weight="medium">Medium</Text>);
      expect(container.firstChild).toHaveClass('[font-weight:var(--font-weight-medium)]');
    });

    it('applies semibold weight', () => {
      const { container } = render(<Text weight="semibold">Semibold</Text>);
      expect(container.firstChild).toHaveClass('[font-weight:var(--font-weight-semibold)]');
    });

    it('applies bold weight', () => {
      const { container } = render(<Text weight="bold">Bold</Text>);
      expect(container.firstChild).toHaveClass('[font-weight:var(--font-weight-bold)]');
    });
  });

  describe('Color variants', () => {
    it('defaults to primary color', () => {
      const { container } = render(<Text>Content</Text>);
      expect(container.firstChild).toHaveClass('text-[var(--color-text-primary)]');
    });

    it('applies secondary color', () => {
      const { container } = render(<Text color="secondary">Secondary</Text>);
      expect(container.firstChild).toHaveClass('text-[var(--color-text-secondary)]');
    });

    it('applies tertiary color', () => {
      const { container } = render(<Text color="tertiary">Tertiary</Text>);
      expect(container.firstChild).toHaveClass('text-[var(--color-text-tertiary)]');
    });

    it('applies inverse color', () => {
      const { container } = render(<Text color="inverse">Inverse</Text>);
      expect(container.firstChild).toHaveClass('text-[var(--color-text-inverse)]');
    });

    it('applies success color', () => {
      const { container } = render(<Text color="success">Success</Text>);
      expect(container.firstChild).toHaveClass('text-[var(--color-text-success)]');
    });

    it('applies warning color', () => {
      const { container } = render(<Text color="warning">Warning</Text>);
      expect(container.firstChild).toHaveClass('text-[var(--color-text-warning)]');
    });

    it('applies error color', () => {
      const { container } = render(<Text color="error">Error</Text>);
      expect(container.firstChild).toHaveClass('text-[var(--color-text-error)]');
    });

    it('applies info color', () => {
      const { container } = render(<Text color="info">Info</Text>);
      expect(container.firstChild).toHaveClass('text-[var(--color-text-info)]');
    });
  });

  describe('Align variants', () => {
    it('applies text-left for left align', () => {
      const { container } = render(<Text align="left">Left</Text>);
      expect(container.firstChild).toHaveClass('text-left');
    });

    it('applies text-center for center align', () => {
      const { container } = render(<Text align="center">Center</Text>);
      expect(container.firstChild).toHaveClass('text-center');
    });

    it('applies text-right for right align', () => {
      const { container } = render(<Text align="right">Right</Text>);
      expect(container.firstChild).toHaveClass('text-right');
    });

    it('applies text-justify for justify align', () => {
      const { container } = render(<Text align="justify">Justified</Text>);
      expect(container.firstChild).toHaveClass('text-justify');
    });
  });

  describe('Truncate variant', () => {
    it('does not truncate by default', () => {
      const { container } = render(<Text>Not truncated</Text>);
      expect(container.firstChild).not.toHaveClass('truncate');
    });

    it('applies truncate class when enabled', () => {
      const { container } = render(<Text truncate>Truncated text</Text>);
      expect(container.firstChild).toHaveClass('truncate');
    });
  });

  describe('Wrap variants', () => {
    it('applies text-balance for balance wrap', () => {
      const { container } = render(<Text wrap="balance">Balanced text</Text>);
      expect(container.firstChild).toHaveClass('text-balance');
    });

    it('applies text-pretty for pretty wrap', () => {
      const { container } = render(<Text wrap="pretty">Pretty text</Text>);
      expect(container.firstChild).toHaveClass('text-pretty');
    });

    it('applies text-nowrap for nowrap', () => {
      const { container } = render(<Text wrap="nowrap">No wrap text</Text>);
      expect(container.firstChild).toHaveClass('text-nowrap');
    });
  });

  describe('Polymorphic as prop', () => {
    it('renders as a span element', () => {
      const { container } = render(<Text as="span">Inline text</Text>);
      expect(container.firstChild?.nodeName).toBe('SPAN');
    });

    it('renders as a label element', () => {
      render(<Text as="label" htmlFor="input-id">Label text</Text>);
      const label = screen.getByText('Label text');
      expect(label.nodeName).toBe('LABEL');
    });

    it('renders as a div element', () => {
      const { container } = render(<Text as="div">Block text</Text>);
      expect(container.firstChild?.nodeName).toBe('DIV');
    });
  });

  describe('Custom className', () => {
    it('merges custom className with default styles', () => {
      const { container } = render(<Text className="custom-class">Content</Text>);
      expect(container.firstChild).toHaveClass('custom-class');
      expect(container.firstChild).toHaveClass('leading-[var(--font-lineHeight-normal,1.5)]');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to the underlying element', () => {
      const ref = createRef<HTMLParagraphElement>();
      render(<Text ref={ref}>Content</Text>);
      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
      expect(ref.current?.textContent).toBe('Content');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations with default props', async () => {
      const { container } = render(<Text>Some paragraph text</Text>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with color variants', async () => {
      const { container } = render(
        <div>
          <Text color="primary">Primary text</Text>
          <Text color="error">Error message</Text>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations as span', async () => {
      const { container } = render(
        <p>
          This has <Text as="span" weight="bold">bold inline</Text> text.
        </p>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports arbitrary data attributes', () => {
      const { container } = render(<Text data-testid="my-text">Content</Text>);
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-text');
    });
  });
});
