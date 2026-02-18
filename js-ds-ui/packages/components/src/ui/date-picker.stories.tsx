import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './date-picker';
import * as React from 'react';

const meta = {
  title: 'Form/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(undefined);

    return <DatePicker value={date} onChange={setDate} />;
  },
};

export const WithSelected: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    return <DatePicker value={date} onChange={setDate} />;
  },
};

export const Disabled: Story = {
  render: () => (
    <DatePicker placeholder="Pick a date" disabled />
  ),
};
