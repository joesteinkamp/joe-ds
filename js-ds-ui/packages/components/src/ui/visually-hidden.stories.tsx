import type { Meta, StoryObj } from '@storybook/react';
import { VisuallyHidden } from './visually-hidden';

const meta = {
  title: 'Components/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="space-y-4">
      <button className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--color-border-default)] bg-[var(--color-background-primary)] hover:bg-[var(--color-background-secondary)]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        <VisuallyHidden>Close</VisuallyHidden>
      </button>
      <p className="text-sm text-[var(--color-text-secondary)]">
        The button above contains a visually hidden &quot;Close&quot; label. It
        is not visible on screen but will be announced by screen readers for
        accessibility.
      </p>
    </div>
  ),
};
