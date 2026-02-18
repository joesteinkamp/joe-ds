import type { Meta, StoryObj } from '@storybook/react';
import { Image } from './image';

const meta = {
  title: 'Media/Image',
  component: Image,
  tags: ['autodocs'],
  argTypes: {
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
    },
    fit: {
      control: 'select',
      options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
    },
    aspectRatio: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: 'https://via.placeholder.com/600x400',
    alt: 'Placeholder image',
    className: 'w-[600px]',
  },
};

export const WithAspectRatio: Story = {
  args: {
    src: 'https://via.placeholder.com/800x450',
    alt: 'Widescreen image',
    aspectRatio: '16/9',
    className: 'w-[400px]',
  },
};

export const Rounded: Story = {
  args: {
    src: 'https://via.placeholder.com/200x200',
    alt: 'Avatar',
    rounded: 'full',
    className: 'h-24 w-24',
  },
};

export const ErrorState: Story = {
  args: {
    src: 'https://broken-link.invalid/missing.jpg',
    alt: 'Broken image',
    className: 'h-48 w-64',
  },
};

export const CustomFallback: Story = {
  args: {
    src: 'https://broken-link.invalid/missing.jpg',
    alt: 'Broken image with custom fallback',
    fallback: <span>Image not available</span>,
    className: 'h-48 w-64',
  },
};
