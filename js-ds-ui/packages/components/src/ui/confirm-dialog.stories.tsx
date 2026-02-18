import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmDialog } from './confirm-dialog';

const meta = {
  title: 'Composition/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'danger'],
    },
    loading: { control: 'boolean' },
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Are you sure?',
    description: 'This action will update your settings.',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    trigger: <button type="button" style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' }}>Open Dialog</button>,
  },
};

export const Danger: Story = {
  args: {
    title: 'Delete item?',
    description: 'This action cannot be undone. The item will be permanently removed.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
    trigger: <button type="button" style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', color: 'red' }}>Delete</button>,
  },
};

export const WithChildren: Story = {
  args: {
    title: 'Confirm transfer',
    description: 'Please review the details below before confirming.',
    confirmText: 'Transfer',
    cancelText: 'Cancel',
    trigger: <button type="button" style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' }}>Transfer</button>,
    children: (
      <div style={{ padding: '12px', background: 'var(--color-background-secondary, #f5f5f5)', borderRadius: '6px', fontSize: '14px' }}>
        <p><strong>From:</strong> Checking Account</p>
        <p><strong>To:</strong> Savings Account</p>
        <p><strong>Amount:</strong> $500.00</p>
      </div>
    ),
  },
};

export const Loading: Story = {
  args: {
    open: true,
    title: 'Processing...',
    description: 'Please wait while we process your request.',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    loading: true,
  },
};
