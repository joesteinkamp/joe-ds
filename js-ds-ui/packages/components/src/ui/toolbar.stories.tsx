import type { Meta, StoryObj } from '@storybook/react';
import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from './toolbar';

const meta = {
  title: 'Components/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Toolbar aria-label="Formatting options">
      <ToolbarToggleGroup type="multiple" aria-label="Text formatting">
        <ToolbarToggleItem
          value="bold"
          aria-label="Bold"
          className="inline-flex h-8 w-8 items-center justify-center rounded text-sm hover:bg-[var(--color-background-secondary)] data-[state=on]:bg-[var(--color-background-tertiary)]"
        >
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
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
          </svg>
        </ToolbarToggleItem>
        <ToolbarToggleItem
          value="italic"
          aria-label="Italic"
          className="inline-flex h-8 w-8 items-center justify-center rounded text-sm hover:bg-[var(--color-background-secondary)] data-[state=on]:bg-[var(--color-background-tertiary)]"
        >
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
            <line x1="19" y1="4" x2="10" y2="4" />
            <line x1="14" y1="20" x2="5" y2="20" />
            <line x1="15" y1="4" x2="9" y2="20" />
          </svg>
        </ToolbarToggleItem>
        <ToolbarToggleItem
          value="underline"
          aria-label="Underline"
          className="inline-flex h-8 w-8 items-center justify-center rounded text-sm hover:bg-[var(--color-background-secondary)] data-[state=on]:bg-[var(--color-background-tertiary)]"
        >
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
            <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
            <line x1="4" y1="21" x2="20" y2="21" />
          </svg>
        </ToolbarToggleItem>
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarButton
        className="inline-flex h-8 items-center justify-center rounded px-3 text-sm hover:bg-[var(--color-background-secondary)]"
      >
        Share
      </ToolbarButton>
    </Toolbar>
  ),
};
