import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from './search-bar';

const meta = {
  title: 'Composition/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    shortcutHint: { control: 'text' },
    loading: { control: 'boolean' },
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Search...',
  },
};

export const WithShortcut: Story = {
  args: {
    placeholder: 'Search components...',
    shortcutHint: '\u2318K',
  },
};

export const Loading: Story = {
  args: {
    placeholder: 'Searching...',
    loading: true,
    value: 'button',
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Search...',
    value: 'dialog component',
  },
};
