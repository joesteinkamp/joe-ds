import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './calendar';
import * as React from 'react';

const meta = {
  title: 'Form/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Calendar />,
};

export const WithSelected: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date>(new Date());

    return <Calendar selected={date} onSelect={setDate} />;
  },
};

export const WithDisabledDates: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(undefined);

    const isWeekend = (d: Date) => {
      const day = d.getDay();
      return day === 0 || day === 6;
    };

    return (
      <Calendar
        selected={date}
        onSelect={setDate}
        disabled={isWeekend}
      />
    );
  },
};
