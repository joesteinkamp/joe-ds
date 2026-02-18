import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './dropdown-menu';
import { Button } from './button';

expect.extend(toHaveNoViolations);

describe('DropdownMenu', () => {
  const renderDropdownMenu = () => {
    return render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
          <DropdownMenuItem>Item 3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  describe('Rendering', () => {
    it('renders trigger button', () => {
      renderDropdownMenu();
      expect(screen.getByText('Open Menu')).toBeInTheDocument();
    });

    it('does not show menu initially', () => {
      renderDropdownMenu();
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    });

    it('shows menu when opened', async () => {
      const user = userEvent.setup();
      renderDropdownMenu();

      await user.click(screen.getByText('Open Menu'));

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
        expect(screen.getByText('Item 3')).toBeInTheDocument();
      });
    });
  });

  describe('Interactions', () => {
    it('opens on trigger click', async () => {
      const user = userEvent.setup();
      renderDropdownMenu();

      await user.click(screen.getByText('Open Menu'));

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });

    it('closes after selecting an item', async () => {
      const user = userEvent.setup();
      renderDropdownMenu();

      await user.click(screen.getByText('Open Menu'));

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Item 1'));

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('closes on outside click', async () => {
      const user = userEvent.setup();
      renderDropdownMenu();

      await user.click(screen.getByText('Open Menu'));

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      await user.click(document.body);

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('closes on Escape key', async () => {
      const user = userEvent.setup();
      renderDropdownMenu();

      await user.click(screen.getByText('Open Menu'));

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('calls onClick handler', async () => {
      const user = userEvent.setup();
      let clicked = false;
      const handleClick = () => {
        clicked = true;
      };

      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Trigger</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleClick}>Click me</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Trigger'));
      await waitFor(() => {
        expect(screen.getByText('Click me')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Click me'));
      expect(clicked).toBe(true);
    });
  });

  describe('Keyboard Navigation', () => {
    it('opens with Enter key', async () => {
      const user = userEvent.setup();
      renderDropdownMenu();

      const trigger = screen.getByText('Open Menu');
      trigger.focus();

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });

    it('navigates with Arrow keys', async () => {
      const user = userEvent.setup();
      renderDropdownMenu();

      await user.click(screen.getByText('Open Menu'));

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
      });

      await user.keyboard('{ArrowDown}');
      expect(screen.getByText('Item 1')).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(screen.getByText('Item 2')).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(screen.getByText('Item 1')).toHaveFocus();
    });

    it('selects item with Enter key', async () => {
      const user = userEvent.setup();
      let selected = '';

      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Trigger</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => (selected = 'item1')}>
              Item 1
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Trigger'));
      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
      });

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(selected).toBe('item1');
    });
  });

  describe('Checkbox Items', () => {
    it('renders checkbox items', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Trigger</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked>Checked</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Unchecked</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Trigger'));

      await waitFor(() => {
        expect(screen.getByRole('menuitemcheckbox', { name: 'Checked' })).toBeInTheDocument();
      });
    });

    it('toggles checkbox items', async () => {
      const user = userEvent.setup();
      let checked = false;

      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Trigger</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={checked}
              onCheckedChange={(val) => (checked = val)}
            >
              Toggle me
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Trigger'));
      await waitFor(() => {
        expect(screen.getByText('Toggle me')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Toggle me'));
      expect(checked).toBe(true);
    });
  });

  describe('Radio Items', () => {
    it('renders radio group', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Trigger</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="option1">
              <DropdownMenuRadioItem value="option1">Option 1</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="option2">Option 2</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Trigger'));

      await waitFor(() => {
        expect(screen.getByRole('menuitemradio', { name: 'Option 1' })).toBeInTheDocument();
      });
    });
  });

  describe('Separators and Labels', () => {
    it('renders separators and labels', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Trigger</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Section 1</DropdownMenuLabel>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Section 2</DropdownMenuLabel>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Trigger'));

      await waitFor(() => {
        expect(screen.getByText('Section 1')).toBeInTheDocument();
        expect(screen.getByText('Section 2')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = renderDropdownMenu();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has correct ARIA attributes', async () => {
      const user = userEvent.setup();
      renderDropdownMenu();

      const trigger = screen.getByText('Open Menu');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      await user.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  describe('Disabled Items', () => {
    it('renders disabled items', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Trigger</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Enabled</DropdownMenuItem>
            <DropdownMenuItem disabled>Disabled</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('Trigger'));

      await waitFor(() => {
        const disabled = screen.getByText('Disabled');
        expect(disabled).toHaveAttribute('data-disabled');
      });
    });
  });
});
