import type { Meta, StoryObj } from '@storybook/react';
import { TimePicker } from './time-picker';

const meta = {
  title: 'Advanced Input/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
  argTypes: {
    use12Hour: { control: 'boolean' },
    minuteStep: { control: 'number' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '09:00',
  },
};

export const TwelveHour: Story = {
  args: {
    value: '14:30',
    use12Hour: true,
  },
};

export const FifteenMinuteStep: Story = {
  args: {
    value: '10:15',
    minuteStep: 15,
  },
};

export const Disabled: Story = {
  args: {
    value: '08:00',
    disabled: true,
  },
};
