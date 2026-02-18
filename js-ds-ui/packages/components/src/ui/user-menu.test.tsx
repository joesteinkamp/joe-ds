import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { UserMenu } from './user-menu';
import type { UserMenuProps } from './user-menu';

expect.extend(toHaveNoViolations);

const defaultGroups: UserMenuProps['groups'] = [
  {
    items: [
      { label: 'Profile', onClick: vi.fn() },
      { label: 'Settings', onClick: vi.fn() },
    ],
  },
  {
    items: [
      { label: 'Log out', onClick: vi.fn(), destructive: true },
    ],
  },
];

const renderUserMenu = (props: Partial<UserMenuProps> = {}) => {
  return render(
    <UserMenu
      name="Jane Doe"
      email="jane@example.com"
      groups={defaultGroups}
      {...props}
    />
  );
};

describe('UserMenu', () => {
  describe('Rendering', () => {
    it('renders trigger button with avatar', () => {
      renderUserMenu();
      const trigger = screen.getByRole('button');
      expect(trigger).toBeInTheDocument();
    });

    it('shows initials when no avatarUrl', () => {
      renderUserMenu({ name: 'Jane Doe' });
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('shows img when avatarUrl is provided', async () => {
      renderUserMenu({ avatarUrl: 'https://via.placeholder.com/40' });

      await waitFor(() => {
        const img = screen.getByAltText(/jane doe/i);
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'https://via.placeholder.com/40');
      });
    });

    it('custom avatarFallback overrides auto-initials', () => {
      renderUserMenu({ name: 'Jane Doe', avatarFallback: 'XY' });
      expect(screen.getByText('XY')).toBeInTheDocument();
      expect(screen.queryByText('JD')).not.toBeInTheDocument();
    });
  });

  describe('Menu Open/Close', () => {
    it('menu is closed by default', () => {
      renderUserMenu();
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('click trigger opens menu', async () => {
      const user = userEvent.setup();
      renderUserMenu();

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });
  });

  describe('Menu Content', () => {
    it('shows user name and email in menu header', async () => {
      const user = userEvent.setup();
      renderUserMenu();

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
        expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      });
    });

    it('renders menu items from groups', async () => {
      const user = userEvent.setup();
      renderUserMenu();

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByText('Log out')).toBeInTheDocument();
      });
    });

    it('clicking menu item calls onClick', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <UserMenu
          name="Jane Doe"
          email="jane@example.com"
          groups={[
            {
              items: [
                { label: 'Profile', onClick },
              ],
            },
          ]}
        />
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Profile')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Profile'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Item Variants', () => {
    it('destructive item has error text color class', async () => {
      const user = userEvent.setup();
      renderUserMenu();

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        const logoutItem = screen.getByText('Log out');
        expect(logoutItem.className).toMatch(/error|destructive|danger/);
      });
    });

    it('disabled item has opacity-50 and pointer-events-none', async () => {
      const user = userEvent.setup();
      render(
        <UserMenu
          name="Jane Doe"
          email="jane@example.com"
          groups={[
            {
              items: [
                { label: 'Disabled action', onClick: vi.fn(), disabled: true },
              ],
            },
          ]}
        />
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        const disabledItem = screen.getByText('Disabled action');
        const itemEl = disabledItem.closest('[role="menuitem"]') || disabledItem;
        expect(itemEl.className).toMatch(/opacity-50/);
        expect(itemEl.className).toMatch(/pointer-events-none/);
      });
    });

    it('link items render as anchor tags with href', async () => {
      const user = userEvent.setup();
      render(
        <UserMenu
          name="Jane Doe"
          email="jane@example.com"
          groups={[
            {
              items: [
                { label: 'Documentation', href: 'https://docs.example.com' },
              ],
            },
          ]}
        />
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        const link = screen.getByText('Documentation').closest('a');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', 'https://docs.example.com');
      });
    });
  });

  describe('Separators', () => {
    it('renders separator between groups', async () => {
      const user = userEvent.setup();
      const { container } = renderUserMenu();

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      const separators = container.querySelectorAll('[role="separator"]');
      expect(separators.length).toBeGreaterThan(0);
    });
  });

  describe('ARIA Attributes', () => {
    it('trigger has aria-haspopup', () => {
      renderUserMenu();
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-haspopup');
    });

    it('trigger has aria-expanded false when closed', () => {
      renderUserMenu();
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('trigger has aria-expanded true when open', async () => {
      const user = userEvent.setup();
      renderUserMenu();

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      const { container } = renderUserMenu({ className: 'custom-menu' });
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toMatch(/custom-menu/);
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations with menu open', async () => {
      const user = userEvent.setup();
      const { container } = renderUserMenu();

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
