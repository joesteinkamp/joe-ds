import type { Meta, StoryObj } from '@storybook/react';
import { SkipNavLink, SkipNavContent } from './skip-nav';

const meta = {
  title: 'Accessibility/SkipNav',
  component: SkipNavLink,
  tags: ['autodocs'],
} satisfies Meta<typeof SkipNavLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div>
      <SkipNavLink />
      <nav style={{ padding: '16px', background: '#f5f5f5' }}>
        <p>Navigation area (Tab to see the skip link appear)</p>
      </nav>
      <SkipNavContent>
        <main style={{ padding: '16px' }}>
          <h1>Main Content</h1>
          <p>This is the target of the skip link.</p>
        </main>
      </SkipNavContent>
    </div>
  ),
};

export const CustomText: Story = {
  render: () => (
    <div>
      <SkipNavLink contentId="custom-content">Skip to article</SkipNavLink>
      <nav style={{ padding: '16px', background: '#f5f5f5' }}>
        <p>Navigation</p>
      </nav>
      <SkipNavContent id="custom-content">
        <article style={{ padding: '16px' }}>
          <h1>Article Content</h1>
        </article>
      </SkipNavContent>
    </div>
  ),
};
