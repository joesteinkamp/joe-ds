'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const inlineCodeVariants = cva(
  'rounded-[var(--component-code-border-radius,0.5rem)] [font-family:var(--component-code-font-family,monospace)] [font-size:var(--component-code-font-size)]',
  {
    variants: {
      variant: {
        default: 'bg-[var(--component-code-bg)] px-1.5 py-0.5 [color:var(--component-code-text)]',
        ghost: '[color:var(--component-code-text)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface CodeProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof inlineCodeVariants> {}

/**
 * Code component — inline code snippet
 *
 * @example
 * ```tsx
 * <p>Use the <Code>useState</Code> hook for state.</p>
 * <Code variant="ghost">console.log()</Code>
 * ```
 */
const Code = React.memo(React.forwardRef<HTMLElement, CodeProps>(
  ({ className, variant, ...props }, ref) => (
    <code
      ref={ref}
      className={cn(inlineCodeVariants({ variant, className }))}
      {...props}
    />
  )
));

Code.displayName = 'Code';

const codeBlockVariants = cva(
  'overflow-x-auto rounded-[var(--component-code-block-border-radius,0.5rem)] [font-family:var(--component-code-font-family,monospace)] [font-size:var(--component-code-font-size)] leading-[var(--font-lineHeight-relaxed,1.75)]',
  {
    variants: {
      variant: {
        default: 'border border-[var(--component-code-block-border)] bg-[var(--component-code-block-bg)] p-[var(--component-code-block-padding,1rem)] [color:var(--component-code-block-text)]',
        dark: 'bg-[var(--component-code-block-dark-bg,#1e1e2e)] p-[var(--component-code-block-padding,1rem)] [color:var(--component-code-block-dark-text,#fff)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface CodeBlockProps
  extends React.HTMLAttributes<HTMLPreElement>,
    VariantProps<typeof codeBlockVariants> {
  /** Language label shown in the header */
  language?: string;
  /** Show line numbers */
  showLineNumbers?: boolean;
}

/**
 * CodeBlock component — multi-line code block with optional language label
 *
 * @example
 * ```tsx
 * <CodeBlock language="tsx">
 *   {`const greeting = "Hello";
 * console.log(greeting);`}
 * </CodeBlock>
 *
 * <CodeBlock variant="dark" language="bash" showLineNumbers>
 *   {`npm install @js-ds-ui/components
 * npm run dev`}
 * </CodeBlock>
 * ```
 */
const CodeBlock = React.memo(React.forwardRef<HTMLPreElement, CodeBlockProps>(
  ({ className, variant, language, showLineNumbers = false, children, ...props }, ref) => {
    const lines = typeof children === 'string' ? children.split('\n') : null;

    return (
      <div className="relative">
        {language && (
          <div className="flex items-center justify-between rounded-t-[var(--component-code-block-border-radius,0.5rem)] border border-b-0 border-[var(--component-code-block-border)] bg-[var(--component-code-block-header-bg)] px-[var(--component-code-block-header-padding-x,0.75rem)] py-[var(--component-code-block-header-padding-y,0.25rem)]">
            <span className="[font-size:var(--component-code-block-header-font-size)] [font-weight:var(--component-code-block-header-font-weight)] text-[var(--color-text-secondary)]">
              {language}
            </span>
          </div>
        )}
        <pre
          ref={ref}
          className={cn(
            codeBlockVariants({ variant, className }),
            language && 'rounded-t-none border-t-0'
          )}
          {...props}
        >
          {showLineNumbers && lines ? (
            <code>
              {lines.map((line, i) => (
                <span key={i} className="table-row">
                  <span className="table-cell select-none pr-4 text-right text-[var(--color-text-tertiary)] opacity-50">
                    {i + 1}
                  </span>
                  <span className="table-cell">{line}</span>
                  {i < lines.length - 1 && '\n'}
                </span>
              ))}
            </code>
          ) : (
            <code>{children}</code>
          )}
        </pre>
      </div>
    );
  }
));

CodeBlock.displayName = 'CodeBlock';

export { Code, CodeBlock, inlineCodeVariants, codeBlockVariants };
