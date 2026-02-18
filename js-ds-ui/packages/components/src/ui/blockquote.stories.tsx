import type { Meta, StoryObj } from '@storybook/react';
import { Blockquote } from './blockquote';

const meta = {
  title: 'Typography/Blockquote',
  component: Blockquote,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'accent', 'success', 'warning', 'error'],
    },
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
    },
  },
} satisfies Meta<typeof Blockquote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'The best way to predict the future is to invent it.',
  },
};

export const Accent: Story = {
  args: {
    variant: 'accent',
    children: 'Design is not just what it looks like. Design is how it works.',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Blockquote variant="default">
        Default variant — neutral styling for general quotes.
      </Blockquote>
      <Blockquote variant="accent">
        Accent variant — highlighted with the primary brand color.
      </Blockquote>
      <Blockquote variant="success">
        Success variant — positive or confirming information.
      </Blockquote>
      <Blockquote variant="warning">
        Warning variant — cautionary or important callouts.
      </Blockquote>
      <Blockquote variant="error">
        Error variant — critical or error-related information.
      </Blockquote>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Blockquote size="sm">
        Small — compact text for tight layouts.
      </Blockquote>
      <Blockquote size="base">
        Base — default size for standard reading.
      </Blockquote>
      <Blockquote size="lg">
        Large — prominent text for emphasis.
      </Blockquote>
    </div>
  ),
};
