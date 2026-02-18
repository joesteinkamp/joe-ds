import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './link';

const meta = {
  title: 'Navigation/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: '/about',
    children: 'Internal Link',
  },
};

export const External: Story = {
  args: {
    href: 'https://example.com',
    external: true,
    children: 'External Link',
  },
};

export const CustomStyle: Story = {
  args: {
    href: '/styled',
    className: 'text-lg font-bold',
    children: 'Custom Styled Link',
  },
};
