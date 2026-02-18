import type { Meta, StoryObj } from '@storybook/react';
import {
  FormField,
  FormLabel,
  FormControl,
  FormHelperText,
  FormErrorMessage,
} from './form-field';
import { Input } from './input';

const meta = {
  title: 'Form/FormField',
  component: FormField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <FormField {...args}>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input type="email" placeholder="you@example.com" />
      </FormControl>
      <FormHelperText />
    </FormField>
  ),
  args: {
    id: 'email',
    helperText: "We'll never share your email with anyone else.",
  },
};

export const WithError: Story = {
  render: (args) => (
    <FormField {...args}>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input type="email" placeholder="you@example.com" />
      </FormControl>
      <FormHelperText />
      <FormErrorMessage />
    </FormField>
  ),
  args: {
    id: 'email-error',
    helperText: "We'll never share your email with anyone else.",
    error: 'Please enter a valid email address.',
  },
};

export const WithoutHelperText: Story = {
  render: (args) => (
    <FormField {...args}>
      <FormLabel>Username</FormLabel>
      <FormControl>
        <Input type="text" placeholder="Enter your username" />
      </FormControl>
    </FormField>
  ),
  args: {
    id: 'username',
  },
};
