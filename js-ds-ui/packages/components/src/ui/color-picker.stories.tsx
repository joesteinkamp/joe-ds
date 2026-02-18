import type { Meta, StoryObj } from '@storybook/react';
import { ColorPicker } from './color-picker';

const meta = {
  title: 'Advanced Input/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    format: {
      control: 'select',
      options: ['hex', 'oklch'],
    },
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '#3b82f6',
  },
};

export const WithLabel: Story = {
  args: {
    value: '#22c55e',
    label: 'Brand Color',
  },
};

export const CustomPresets: Story = {
  args: {
    value: '#ff0000',
    label: 'Theme Color',
    presets: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
  },
};

export const Disabled: Story = {
  args: {
    value: '#6366f1',
    label: 'Accent',
    disabled: true,
  },
};
