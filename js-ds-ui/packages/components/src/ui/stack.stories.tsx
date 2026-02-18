import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from './stack';

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    spacing: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const Box = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: '1rem', background: '#e5e7eb', borderRadius: '0.375rem' }}>
    {children}
  </div>
);

export const Vertical: Story = {
  args: { direction: 'vertical', spacing: 'md' },
  render: (args) => (
    <Stack {...args}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

export const Horizontal: Story = {
  args: { direction: 'horizontal', spacing: 'md', align: 'center' },
  render: (args) => (
    <Stack {...args}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

export const SpacingVariants: Story = {
  render: () => (
    <Stack spacing="lg">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
        <div key={s}>
          <p style={{ marginBottom: '0.25rem', fontSize: '0.875rem', color: '#6b7280' }}>spacing="{s}"</p>
          <Stack direction="horizontal" spacing={s}>
            <Box>A</Box>
            <Box>B</Box>
            <Box>C</Box>
          </Stack>
        </div>
      ))}
    </Stack>
  ),
};
