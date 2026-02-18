import type { Meta, StoryObj } from '@storybook/react';
import { Announcement } from './announcement';

const meta = {
  title: 'Accessibility/Announcement',
  component: Announcement,
  tags: ['autodocs'],
  argTypes: {
    message: { control: 'text' },
    politeness: {
      control: 'select',
      options: ['polite', 'assertive'],
    },
    clearAfterMs: { control: 'number' },
  },
} satisfies Meta<typeof Announcement>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'Form submitted successfully',
    politeness: 'polite',
  },
};

export const Assertive: Story = {
  args: {
    message: 'Error: Please fix the form',
    politeness: 'assertive',
  },
};

export const AutoClear: Story = {
  args: {
    message: 'This message will clear after 3 seconds',
    politeness: 'polite',
    clearAfterMs: 3000,
  },
};
