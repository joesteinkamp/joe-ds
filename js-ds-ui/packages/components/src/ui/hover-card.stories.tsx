import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './hover-card';

const meta = {
  title: 'Components/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a
          href="#"
          className="text-sm font-medium underline underline-offset-4"
          onClick={(e) => e.preventDefault()}
        >
          @janedoe
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-background-secondary)] text-sm font-semibold">
            JD
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@janedoe</h4>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Software engineer building design systems and component libraries.
            </p>
            <div className="flex items-center pt-2">
              <span className="text-xs text-[var(--color-text-tertiary)]">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
