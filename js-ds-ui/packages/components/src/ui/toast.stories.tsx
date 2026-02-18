import type { Meta, StoryObj } from '@storybook/react';
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastProvider,
  ToastViewport,
  ToastClose,
} from './toast';

const meta = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
        <ToastViewport />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Toast open>
      <div className="grid gap-1">
        <ToastTitle>Notification</ToastTitle>
        <ToastDescription>This is a default toast message.</ToastDescription>
      </div>
      <ToastClose />
    </Toast>
  ),
};

export const Success: Story = {
  render: () => (
    <Toast variant="success" open>
      <div className="grid gap-1">
        <ToastTitle>Success</ToastTitle>
        <ToastDescription>Your changes have been saved.</ToastDescription>
      </div>
      <ToastClose />
    </Toast>
  ),
};

export const Error: Story = {
  render: () => (
    <Toast variant="error" open>
      <div className="grid gap-1">
        <ToastTitle>Error</ToastTitle>
        <ToastDescription>
          Something went wrong. Please try again.
        </ToastDescription>
      </div>
      <ToastClose />
    </Toast>
  ),
};

export const Warning: Story = {
  render: () => (
    <Toast variant="warning" open>
      <div className="grid gap-1">
        <ToastTitle>Warning</ToastTitle>
        <ToastDescription>
          Your session is about to expire in 5 minutes.
        </ToastDescription>
      </div>
      <ToastClose />
    </Toast>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Toast open>
      <div className="grid gap-1">
        <ToastTitle>Event Created</ToastTitle>
        <ToastDescription>
          Your event has been scheduled for Friday.
        </ToastDescription>
      </div>
      <ToastAction altText="Undo the event creation">Undo</ToastAction>
      <ToastClose />
    </Toast>
  ),
};
