import type { Meta, StoryObj } from '@storybook/react';
import { UserMenu } from './user-menu';

const meta = {
  title: 'Composition/UserMenu',
  component: UserMenu,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    email: { control: 'text' },
    avatarUrl: { control: 'text' },
    avatarFallback: { control: 'text' },
  },
} satisfies Meta<typeof UserMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Jane Doe',
    email: 'jane@example.com',
    avatarFallback: 'JD',
    groups: [
      {
        items: [
          { label: 'Profile' },
          { label: 'Settings' },
        ],
      },
      {
        items: [
          { label: 'Sign out', destructive: true },
        ],
      },
    ],
  },
};

export const WithImage: Story = {
  args: {
    name: 'John Smith',
    email: 'john@example.com',
    avatarUrl: 'https://via.placeholder.com/80x80',
    groups: [
      {
        items: [
          { label: 'Profile' },
          { label: 'Settings' },
        ],
      },
      {
        items: [
          { label: 'Sign out', destructive: true },
        ],
      },
    ],
  },
};

export const WithGroups: Story = {
  args: {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatarFallback: 'AJ',
    groups: [
      {
        label: 'Account',
        items: [
          { label: 'Profile' },
          { label: 'Billing' },
          { label: 'Settings' },
        ],
      },
      {
        label: 'Team',
        items: [
          { label: 'Invite members' },
          { label: 'Team settings' },
        ],
      },
      {
        items: [
          { label: 'Help & Support' },
          { label: 'Sign out', destructive: true },
        ],
      },
    ],
  },
};
