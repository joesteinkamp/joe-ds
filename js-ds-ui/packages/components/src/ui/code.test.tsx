import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Code, CodeBlock } from './code';

expect.extend(toHaveNoViolations);

describe('Code', () => {
  describe('Rendering', () => {
    it('renders as a code element', () => {
      const { container } = render(<Code>useState</Code>);
      const code = container.querySelector('code');
      expect(code).toBeInTheDocument();
      expect(code?.textContent).toBe('useState');
    });

    it('renders children text', () => {
      render(<Code>console.log()</Code>);
      expect(screen.getByText('console.log()')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('default variant has background class', () => {
      const { container } = render(<Code>code</Code>);
      expect(container.firstChild).toHaveClass('bg-[var(--color-background-secondary)]');
    });

    it('ghost variant does not have background class', () => {
      const { container } = render(<Code variant="ghost">code</Code>);
      expect(container.firstChild).not.toHaveClass('bg-[var(--color-background-secondary)]');
      expect(container.firstChild).toHaveClass('text-[var(--color-text-primary)]');
    });
  });

  describe('Custom className', () => {
    it('merges custom className with default styles', () => {
      const { container } = render(<Code className="custom-code">code</Code>);
      expect(container.firstChild).toHaveClass('custom-code');
      expect(container.firstChild).toHaveClass('font-[var(--font-family-mono,monospace)]');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to the underlying code element', () => {
      const ref = createRef<HTMLElement>();
      render(<Code ref={ref}>code</Code>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe('CODE');
    });
  });
});

describe('CodeBlock', () => {
  describe('Rendering', () => {
    it('renders as a pre element containing a code element', () => {
      const { container } = render(<CodeBlock>const x = 1;</CodeBlock>);
      const pre = container.querySelector('pre');
      const code = pre?.querySelector('code');
      expect(pre).toBeInTheDocument();
      expect(code).toBeInTheDocument();
    });

    it('renders children text', () => {
      render(<CodeBlock>const greeting = "hello";</CodeBlock>);
      expect(screen.getByText('const greeting = "hello";')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('default variant has border and background', () => {
      const { container } = render(<CodeBlock>code</CodeBlock>);
      const pre = container.querySelector('pre');
      expect(pre).toHaveClass('border');
      expect(pre).toHaveClass('bg-[var(--color-background-secondary)]');
    });

    it('dark variant has inverse background', () => {
      const { container } = render(<CodeBlock variant="dark">code</CodeBlock>);
      const pre = container.querySelector('pre');
      expect(pre).toHaveClass('bg-[var(--color-background-inverse,#1e1e2e)]');
      expect(pre).toHaveClass('text-[var(--color-text-inverse,#fff)]');
    });
  });

  describe('Language prop', () => {
    it('shows header with language label when language is provided', () => {
      render(<CodeBlock language="tsx">code</CodeBlock>);
      expect(screen.getByText('tsx')).toBeInTheDocument();
    });

    it('does not show header when language is not provided', () => {
      const { container } = render(<CodeBlock>code</CodeBlock>);
      const pre = container.querySelector('pre');
      expect(pre).not.toHaveClass('rounded-t-none');
    });
  });

  describe('Line numbers', () => {
    it('renders line numbers when showLineNumbers is true', () => {
      render(
        <CodeBlock showLineNumbers>
          {'line one\nline two\nline three'}
        </CodeBlock>
      );
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('does not render line numbers by default', () => {
      render(<CodeBlock>{'line one\nline two'}</CodeBlock>);
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('merges custom className with default styles', () => {
      const { container } = render(<CodeBlock className="custom-block">code</CodeBlock>);
      const pre = container.querySelector('pre');
      expect(pre).toHaveClass('custom-block');
      expect(pre).toHaveClass('overflow-x-auto');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to the underlying pre element', () => {
      const ref = createRef<HTMLPreElement>();
      render(<CodeBlock ref={ref}>code</CodeBlock>);
      expect(ref.current).toBeInstanceOf(HTMLPreElement);
      expect(ref.current?.tagName).toBe('PRE');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations (default)', async () => {
      const { container } = render(<CodeBlock>const x = 1;</CodeBlock>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (dark variant with language)', async () => {
      const { container } = render(
        <CodeBlock variant="dark" language="typescript">
          const x: number = 1;
        </CodeBlock>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (with line numbers)', async () => {
      const { container } = render(
        <CodeBlock showLineNumbers>
          {'const a = 1;\nconst b = 2;'}
        </CodeBlock>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
