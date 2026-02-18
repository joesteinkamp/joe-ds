import type { Meta, StoryObj } from '@storybook/react';
import { Form, FormMessage, FormSubmit } from './form';
import { Input } from './input';

const meta = {
  title: 'Form/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Form onSubmit={() => alert('Form submitted!')}>
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input id="name" name="name" placeholder="Enter your name" />
      </div>
      <FormSubmit>Submit</FormSubmit>
    </Form>
  ),
};

export const WithValidation: Story = {
  render: () => (
    <Form
      validate={(formData) => {
        const errors: Record<string, string> = {};
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;

        if (!name || name.trim() === '') {
          errors.name = 'Name is required.';
        }
        if (!email || email.trim() === '') {
          errors.email = 'Email is required.';
        } else if (!email.includes('@')) {
          errors.email = 'Please enter a valid email address.';
        }

        return Object.keys(errors).length > 0 ? errors : null;
      }}
      onSubmit={() => alert('Form is valid and submitted!')}
    >
      <div className="space-y-2">
        <label htmlFor="val-name" className="text-sm font-medium">
          Name
        </label>
        <Input id="val-name" name="name" placeholder="Enter your name" />
        <FormMessage name="name" />
      </div>
      <div className="space-y-2">
        <label htmlFor="val-email" className="text-sm font-medium">
          Email
        </label>
        <Input id="val-email" name="email" type="email" placeholder="Enter your email" />
        <FormMessage name="email" />
      </div>
      <FormSubmit>Submit</FormSubmit>
    </Form>
  ),
};

export const WithAsync: Story = {
  render: () => (
    <Form
      onSubmit={async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        alert('Async submission complete!');
      }}
    >
      <div className="space-y-2">
        <label htmlFor="async-email" className="text-sm font-medium">
          Email
        </label>
        <Input id="async-email" name="email" type="email" placeholder="Enter your email" />
      </div>
      <FormSubmit>Submit</FormSubmit>
    </Form>
  ),
};
