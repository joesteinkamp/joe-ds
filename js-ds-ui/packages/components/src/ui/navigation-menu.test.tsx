import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './navigation-menu';

expect.extend(toHaveNoViolations);

describe('NavigationMenu', () => {
  const renderNavigationMenu = () => {
    return render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div>Product 1</div>
              <div>Product 2</div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/about">About</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  };

  describe('Rendering', () => {
    it('renders navigation menu', () => {
      const { container } = renderNavigationMenu();
      expect(container.querySelector('[role="navigation"]')).toBeInTheDocument();
    });

    it('renders menu items', () => {
      renderNavigationMenu();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('does not show dropdown content initially', () => {
      renderNavigationMenu();
      expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('opens dropdown on trigger click', async () => {
      const user = userEvent.setup();
      renderNavigationMenu();

      await user.click(screen.getByText('Products'));

      await waitFor(() => {
        expect(screen.getByText('Product 1')).toBeInTheDocument();
      });
    });

    it('closes dropdown on outside click', async () => {
      const user = userEvent.setup();
      renderNavigationMenu();

      await user.click(screen.getByText('Products'));

      await waitFor(() => {
        expect(screen.getByText('Product 1')).toBeInTheDocument();
      });

      await user.click(document.body);

      await waitFor(() => {
        expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = renderNavigationMenu();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
