import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './icon';

/** Placeholder SVG icon used in stories (avoids external icon library dependency) */
const PlaceholderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const meta = {
  title: 'Media/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'select',
      options: ['current', 'primary', 'secondary', 'tertiary', 'accent', 'success', 'warning', 'error', 'info'],
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <PlaceholderIcon />,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon size="xs"><PlaceholderIcon /></Icon>
      <Icon size="sm"><PlaceholderIcon /></Icon>
      <Icon size="md"><PlaceholderIcon /></Icon>
      <Icon size="lg"><PlaceholderIcon /></Icon>
      <Icon size="xl"><PlaceholderIcon /></Icon>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon color="current"><PlaceholderIcon /></Icon>
      <Icon color="primary"><PlaceholderIcon /></Icon>
      <Icon color="secondary"><PlaceholderIcon /></Icon>
      <Icon color="tertiary"><PlaceholderIcon /></Icon>
      <Icon color="accent"><PlaceholderIcon /></Icon>
      <Icon color="success"><PlaceholderIcon /></Icon>
      <Icon color="warning"><PlaceholderIcon /></Icon>
      <Icon color="error"><PlaceholderIcon /></Icon>
      <Icon color="info"><PlaceholderIcon /></Icon>
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    label: 'Add item',
    children: <PlaceholderIcon />,
  },
};

export const Decorative: Story = {
  args: {
    children: <PlaceholderIcon />,
  },
};
