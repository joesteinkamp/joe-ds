import type { Meta, StoryObj } from '@storybook/react';
import { Code, CodeBlock } from './code';

const meta = {
  title: 'Typography/Code',
  component: Code,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'ghost'],
    },
  },
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InlineCode: Story = {
  render: () => (
    <p>
      Use the <Code>useState</Code> hook to manage local state.
    </p>
  ),
};

export const InlineGhost: Story = {
  render: () => (
    <p>
      Run <Code variant="ghost">npm install</Code> to get started.
    </p>
  ),
};

export const BasicBlock: StoryObj<typeof CodeBlock> = {
  render: () => (
    <CodeBlock>
      {`const greeting = "Hello, world!";
console.log(greeting);`}
    </CodeBlock>
  ),
};

export const WithLanguage: StoryObj<typeof CodeBlock> = {
  render: () => (
    <CodeBlock language="tsx">
      {`import { Button } from './button';

export function App() {
  return <Button variant="primary">Click me</Button>;
}`}
    </CodeBlock>
  ),
};

export const WithLineNumbers: StoryObj<typeof CodeBlock> = {
  render: () => (
    <CodeBlock language="tsx" showLineNumbers>
      {`import * as React from 'react';

function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}`}
    </CodeBlock>
  ),
};

export const DarkVariant: StoryObj<typeof CodeBlock> = {
  render: () => (
    <CodeBlock variant="dark" language="bash" showLineNumbers>
      {`npm install @js-ds-ui/components
npm run dev`}
    </CodeBlock>
  ),
};
