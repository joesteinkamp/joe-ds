import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker } from './date-range-picker';

const meta = {
  title: 'Advanced Input/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    startPlaceholder: { control: 'text' },
    endPlaceholder: { control: 'text' },
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    startPlaceholder: 'Start date',
    endPlaceholder: 'End date',
  },
};

export const WithValue: Story = {
  args: {
    value: {
      from: new Date(2025, 0, 15),
      to: new Date(2025, 0, 22),
    },
  },
};

export const WithMinMax: Story = {
  args: {
    minDate: new Date(2025, 0, 1),
    maxDate: new Date(2025, 11, 31),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: {
      from: new Date(2025, 0, 10),
      to: new Date(2025, 0, 20),
    },
  },
};
