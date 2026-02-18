import type { Meta, StoryObj } from '@storybook/react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from './sheet';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';

const meta = {
  title: 'Components/Sheet',
  component: Sheet,
  tags: ['autodocs'],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Right Sheet</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you are done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sheet-name" className="text-right">
              Name
            </Label>
            <Input
              id="sheet-name"
              defaultValue="Jane Doe"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sheet-username" className="text-right">
              Username
            </Label>
            <Input
              id="sheet-username"
              defaultValue="@janedoe"
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <SheetClose asChild>
            <Button variant="primary">Save Changes</Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Left Sheet</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>
            Browse through the application sections.
          </SheetDescription>
        </SheetHeader>
        <nav className="grid gap-2 py-4">
          <a
            href="#"
            className="block rounded-sm px-2 py-1.5 text-sm hover:bg-[var(--color-background-secondary)]"
            onClick={(e) => e.preventDefault()}
          >
            Dashboard
          </a>
          <a
            href="#"
            className="block rounded-sm px-2 py-1.5 text-sm hover:bg-[var(--color-background-secondary)]"
            onClick={(e) => e.preventDefault()}
          >
            Projects
          </a>
          <a
            href="#"
            className="block rounded-sm px-2 py-1.5 text-sm hover:bg-[var(--color-background-secondary)]"
            onClick={(e) => e.preventDefault()}
          >
            Team
          </a>
          <a
            href="#"
            className="block rounded-sm px-2 py-1.5 text-sm hover:bg-[var(--color-background-secondary)]"
            onClick={(e) => e.preventDefault()}
          >
            Settings
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  ),
};

export const Top: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Top Sheet</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            You have 3 unread notifications.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-2 py-4">
          <div className="rounded-md border border-[var(--color-border-default)] p-3 text-sm">
            Your deployment was successful.
          </div>
          <div className="rounded-md border border-[var(--color-border-default)] p-3 text-sm">
            New comment on your pull request.
          </div>
          <div className="rounded-md border border-[var(--color-border-default)] p-3 text-sm">
            Your subscription is about to expire.
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Bottom Sheet</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Share Document</SheetTitle>
          <SheetDescription>
            Choose how you would like to share this document.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-wrap gap-2 py-4">
          <Button variant="outline" size="sm">
            Copy Link
          </Button>
          <Button variant="outline" size="sm">
            Email
          </Button>
          <Button variant="outline" size="sm">
            Message
          </Button>
          <Button variant="outline" size="sm">
            Embed
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
};
