import type { Meta, StoryObj } from '@storybook/react';
import { FocusTrap } from './focus-trap';

const meta = {
  title: 'Accessibility/FocusTrap',
  component: FocusTrap,
  tags: ['autodocs'],
  argTypes: {
    active: { control: 'boolean' },
    returnFocusOnDeactivate: { control: 'boolean' },
    clickOutsideDeactivates: { control: 'boolean' },
  },
} satisfies Meta<typeof FocusTrap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    active: true,
    children: (
      <div style={{ padding: '20px', border: '2px solid #3b82f6', borderRadius: '8px' }}>
        <p>Focus is trapped within this container.</p>
        <input placeholder="First input" style={{ display: 'block', margin: '8px 0', padding: '4px 8px' }} />
        <input placeholder="Second input" style={{ display: 'block', margin: '8px 0', padding: '4px 8px' }} />
        <button type="button" style={{ padding: '4px 12px' }}>Button</button>
      </div>
    ),
  },
};

export const Inactive: Story = {
  args: {
    active: false,
    children: (
      <div style={{ padding: '20px', border: '2px dashed #ccc', borderRadius: '8px' }}>
        <p>Focus trap is inactive.</p>
        <input placeholder="Input" style={{ display: 'block', margin: '8px 0', padding: '4px 8px' }} />
        <button type="button" style={{ padding: '4px 12px' }}>Button</button>
      </div>
    ),
  },
};
