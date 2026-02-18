import type { Meta, StoryObj } from '@storybook/react';
import { Heading } from './heading';

const meta = {
  title: 'Typography/Heading',
  component: Heading,
  tags: ['autodocs'],
  argTypes: {
    level: { control: { type: 'number', min: 1, max: 6 } },
    size: {
      control: 'select',
      options: ['1', '2', '3', '4', '5', '6'],
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { level: 2, children: 'Heading Level 2' },
};

export const AllLevels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Heading level={1}>Heading Level 1</Heading>
      <Heading level={2}>Heading Level 2</Heading>
      <Heading level={3}>Heading Level 3</Heading>
      <Heading level={4}>Heading Level 4</Heading>
      <Heading level={5}>Heading Level 5</Heading>
      <Heading level={6}>Heading Level 6</Heading>
    </div>
  ),
};

export const SizeOverride: Story = {
  args: { level: 3, size: '1', children: 'h3 with size of h1' },
};

export const Centered: Story = {
  args: { level: 2, align: 'center', children: 'Centered Heading' },
};
