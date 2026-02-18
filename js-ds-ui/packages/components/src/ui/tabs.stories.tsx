import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Manage your account settings and preferences.
        </p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Change your password and security options.
        </p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Configure your application settings.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="active" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
        <TabsTrigger value="other">Other</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <p className="text-sm text-[var(--color-text-secondary)]">
          This tab is active and interactive.
        </p>
      </TabsContent>
      <TabsContent value="disabled">
        <p className="text-sm text-[var(--color-text-secondary)]">
          This content is not reachable because the tab is disabled.
        </p>
      </TabsContent>
      <TabsContent value="other">
        <p className="text-sm text-[var(--color-text-secondary)]">
          This is another active tab.
        </p>
      </TabsContent>
    </Tabs>
  ),
};
