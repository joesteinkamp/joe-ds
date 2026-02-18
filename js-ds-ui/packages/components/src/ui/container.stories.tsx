import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './container';

const meta = {
  title: 'Layout/Container',
  component: Container,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', 'full', 'prose'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
    },
    center: { control: 'boolean' },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { size: 'lg' },
  render: (args) => (
    <Container {...args} style={{ background: '#f3f4f6' }}>
      <p>Content within a max-width container with responsive padding.</p>
    </Container>
  ),
};

export const Prose: Story = {
  args: { size: 'prose', center: true },
  render: (args) => (
    <Container {...args}>
      <h2>Article Title</h2>
      <p>This container uses max-w-prose for optimal reading width (about 65 characters per line).</p>
    </Container>
  ),
};

export const SizeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {(['sm', 'md', 'lg', 'xl', '2xl'] as const).map((s) => (
        <Container key={s} size={s} style={{ background: '#e5e7eb', padding: '0.5rem' }}>
          size="{s}"
        </Container>
      ))}
    </div>
  ),
};
