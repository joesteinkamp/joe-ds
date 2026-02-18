import type { Meta, StoryObj } from '@storybook/react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from './navigation-menu';

const meta = {
  title: 'Components/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
              <li>
                <NavigationMenuLink
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[var(--color-background-secondary)] focus:bg-[var(--color-background-secondary)]"
                  href="#"
                >
                  <div className="text-sm font-medium leading-none">
                    Introduction
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-[var(--color-text-secondary)]">
                    Learn the basics and get up and running quickly.
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[var(--color-background-secondary)] focus:bg-[var(--color-background-secondary)]"
                  href="#"
                >
                  <div className="text-sm font-medium leading-none">
                    Installation
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-[var(--color-text-secondary)]">
                    Step-by-step guide to install and configure the library.
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[var(--color-background-secondary)] focus:bg-[var(--color-background-secondary)]"
                  href="#"
                >
                  <div className="text-sm font-medium leading-none">
                    Typography
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-[var(--color-text-secondary)]">
                    Styles for headings, paragraphs, and other text elements.
                  </p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
              <li>
                <NavigationMenuLink
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[var(--color-background-secondary)] focus:bg-[var(--color-background-secondary)]"
                  href="#"
                >
                  <div className="text-sm font-medium leading-none">Alert</div>
                  <p className="line-clamp-2 text-sm leading-snug text-[var(--color-text-secondary)]">
                    Displays a callout for user attention.
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[var(--color-background-secondary)] focus:bg-[var(--color-background-secondary)]"
                  href="#"
                >
                  <div className="text-sm font-medium leading-none">
                    Dialog
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-[var(--color-text-secondary)]">
                    A modal dialog that interrupts the user.
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[var(--color-background-secondary)] focus:bg-[var(--color-background-secondary)]"
                  href="#"
                >
                  <div className="text-sm font-medium leading-none">
                    Tooltip
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-[var(--color-text-secondary)]">
                    A popup with information on hover or focus.
                  </p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
