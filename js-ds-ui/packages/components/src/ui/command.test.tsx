import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from './command';

expect.extend(toHaveNoViolations);

describe('Command', () => {
  const renderCommand = () => {
    return render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem value="calendar">Calendar</CommandItem>
            <CommandItem value="search">Search</CommandItem>
            <CommandItem value="settings">Settings</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem value="create">
              Create New
              <CommandShortcut>Ctrl+N</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
  };

  describe('Rendering', () => {
    it('renders Command with input, list, and items', () => {
      renderCommand();
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      expect(screen.getByText('Calendar')).toBeInTheDocument();
      expect(screen.getByText('Search')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Create New')).toBeInTheDocument();
    });

    it('renders CommandGroup with heading', () => {
      renderCommand();
      expect(screen.getByText('Suggestions')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('renders CommandShortcut text', () => {
      renderCommand();
      expect(screen.getByText('Ctrl+N')).toBeInTheDocument();
    });

    it('renders CommandList with listbox role', () => {
      renderCommand();
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('renders CommandGroup with group role', () => {
      renderCommand();
      const groups = screen.getAllByRole('group');
      expect(groups.length).toBe(2);
    });

    it('renders CommandItem with option role', () => {
      renderCommand();
      const options = screen.getAllByRole('option');
      expect(options.length).toBe(4);
    });
  });

  describe('Filtering', () => {
    it('filters items based on search text', async () => {
      const user = userEvent.setup();
      renderCommand();

      const input = screen.getByPlaceholderText('Search...');
      await user.type(input, 'cal');

      expect(screen.getByText('Calendar')).toBeInTheDocument();
      expect(screen.queryByText('Search')).not.toBeInTheDocument();
      expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    });

    it('hides CommandItem when search does not match', async () => {
      const user = userEvent.setup();
      renderCommand();

      const input = screen.getByPlaceholderText('Search...');
      await user.type(input, 'xyz');

      expect(screen.queryByText('Calendar')).not.toBeInTheDocument();
      expect(screen.queryByText('Search')).not.toBeInTheDocument();
      expect(screen.queryByText('Settings')).not.toBeInTheDocument();
      expect(screen.queryByText('Create New')).not.toBeInTheDocument();
    });

    it('shows CommandEmpty when no items match', async () => {
      const user = userEvent.setup();
      renderCommand();

      const input = screen.getByPlaceholderText('Search...');
      await user.type(input, 'xyz');

      expect(screen.getByText('No results found.')).toBeInTheDocument();
    });

    it('filter is case-insensitive', async () => {
      const user = userEvent.setup();
      renderCommand();

      const input = screen.getByPlaceholderText('Search...');
      await user.type(input, 'CALENDAR');

      expect(screen.getByText('Calendar')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('fires onSelect callback on CommandItem click', async () => {
      const user = userEvent.setup();
      let selectedValue = '';
      const handleSelect = (value: string) => {
        selectedValue = value;
      };

      render(
        <Command>
          <CommandList>
            <CommandItem value="test" onSelect={handleSelect}>
              Test Item
            </CommandItem>
          </CommandList>
        </Command>
      );

      await user.click(screen.getByText('Test Item'));
      expect(selectedValue).toBe('test');
    });

    it('does not fire onSelect on disabled CommandItem', async () => {
      const user = userEvent.setup();
      let selectedValue = '';
      const handleSelect = (value: string) => {
        selectedValue = value;
      };

      render(
        <Command>
          <CommandList>
            <CommandItem value="disabled-item" onSelect={handleSelect} disabled>
              Disabled Item
            </CommandItem>
          </CommandList>
        </Command>
      );

      await user.click(screen.getByText('Disabled Item'));
      expect(selectedValue).toBe('');
    });

    it('uses children text as value when no value prop given', async () => {
      const user = userEvent.setup();
      let selectedValue = '';
      const handleSelect = (value: string) => {
        selectedValue = value;
      };

      render(
        <Command>
          <CommandList>
            <CommandItem onSelect={handleSelect}>My Item</CommandItem>
          </CommandList>
        </Command>
      );

      await user.click(screen.getByText('My Item'));
      expect(selectedValue).toBe('My Item');
    });
  });

  describe('CommandSeparator', () => {
    it('renders a separator element', () => {
      const { container } = render(
        <Command>
          <CommandSeparator data-testid="separator" />
        </Command>
      );
      expect(screen.getByTestId('separator')).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('merges custom className on Command', () => {
      const { container } = render(
        <Command className="custom-command">
          <CommandList>
            <CommandItem>Item</CommandItem>
          </CommandList>
        </Command>
      );
      const commandEl = container.firstChild as HTMLElement;
      expect(commandEl).toHaveClass('custom-command');
    });

    it('merges custom className on CommandInput', () => {
      render(
        <Command>
          <CommandInput className="custom-input" placeholder="Test" />
        </Command>
      );
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveClass('custom-input');
    });

    it('merges custom className on CommandItem', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem className="custom-item">Item</CommandItem>
          </CommandList>
        </Command>
      );
      expect(screen.getByText('Item')).toHaveClass('custom-item');
    });

    it('merges custom className on CommandGroup', () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup className="custom-group" heading="Group">
              <CommandItem>Item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );
      const group = screen.getByRole('group');
      expect(group).toHaveClass('custom-group');
    });

    it('merges custom className on CommandShortcut', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem>
              Item
              <CommandShortcut className="custom-shortcut">Ctrl+K</CommandShortcut>
            </CommandItem>
          </CommandList>
        </Command>
      );
      expect(screen.getByText('Ctrl+K')).toHaveClass('custom-shortcut');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList aria-label="Command options">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem value="calendar">Calendar</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has correct aria-disabled on disabled items', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem disabled>Disabled Item</CommandItem>
          </CommandList>
        </Command>
      );
      const item = screen.getByRole('option');
      expect(item).toHaveAttribute('aria-disabled', 'true');
    });
  });
});
