import type { Meta, StoryObj } from '@storybook/react';
import { FileUpload } from './file-upload';

const meta = {
  title: 'Advanced Input/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  argTypes: {
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
    description: { control: 'text' },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    description: 'PNG, JPG, GIF up to 10MB',
  },
};

export const MultipleFiles: Story = {
  args: {
    multiple: true,
    maxFiles: 5,
    description: 'Upload up to 5 files',
  },
};

export const ImagesOnly: Story = {
  args: {
    accept: 'image/*',
    multiple: true,
    maxSize: 5 * 1024 * 1024,
    description: 'Images only, max 5MB each',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    description: 'Upload is currently disabled',
  },
};
