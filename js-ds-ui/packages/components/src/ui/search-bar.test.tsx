import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import * as React from 'react';
import { SearchBar } from './search-bar';

expect.extend(toHaveNoViolations);

describe('SearchBar', () => {
  describe('Rendering', () => {
    it('renders a search input with role="searchbox"', () => {
      render(<SearchBar />);
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('renders placeholder text', () => {
      render(<SearchBar placeholder="Search components..." />);
      expect(screen.getByPlaceholderText('Search components...')).toBeInTheDocument();
    });

    it('renders default placeholder when none provided', () => {
      render(<SearchBar />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });
  });

  describe('Value Changes', () => {
    it('calls onValueChange when typing', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<SearchBar value="" onValueChange={onValueChange} />);
      const input = screen.getByRole('searchbox');

      await user.type(input, 'hello');

      expect(onValueChange).toHaveBeenCalled();
      expect(onValueChange).toHaveBeenCalledWith('h');
    });
  });

  describe('Clear Button', () => {
    it('shows clear button when value is present', () => {
      render(<SearchBar value="query" onValueChange={vi.fn()} />);
      expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
    });

    it('does not show clear button when value is empty', () => {
      render(<SearchBar value="" onValueChange={vi.fn()} />);
      expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
    });

    it('clear button calls onValueChange with empty string', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<SearchBar value="query" onValueChange={onValueChange} />);
      const clearButton = screen.getByRole('button', { name: /clear search/i });

      await user.click(clearButton);

      expect(onValueChange).toHaveBeenCalledWith('');
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when loading=true', () => {
      const { container } = render(<SearchBar loading />);
      const spinner = container.querySelector('svg.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('hides clear button when loading even if value is present', () => {
      render(<SearchBar value="query" loading onValueChange={vi.fn()} />);
      expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
    });
  });

  describe('Shortcut Hint', () => {
    it('shows shortcut hint when no value and not loading', () => {
      render(<SearchBar shortcutHint="⌘K" value="" />);
      expect(screen.getByText('⌘K')).toBeInTheDocument();
    });

    it('hides shortcut hint when value is present', () => {
      render(<SearchBar shortcutHint="⌘K" value="query" onValueChange={vi.fn()} />);
      expect(screen.queryByText('⌘K')).not.toBeInTheDocument();
    });

    it('hides shortcut hint when loading', () => {
      render(<SearchBar shortcutHint="⌘K" value="" loading />);
      expect(screen.queryByText('⌘K')).not.toBeInTheDocument();
    });
  });

  describe('Keyboard Interactions', () => {
    it('Enter key calls onSubmit with current value', () => {
      const onSubmit = vi.fn();

      render(<SearchBar value="test query" onSubmit={onSubmit} onValueChange={vi.fn()} />);
      const input = screen.getByRole('searchbox');

      fireEvent.keyDown(input, { key: 'Enter' });

      expect(onSubmit).toHaveBeenCalledWith('test query');
    });

    it('Escape key clears value', () => {
      const onValueChange = vi.fn();

      render(<SearchBar value="test" onValueChange={onValueChange} />);
      const input = screen.getByRole('searchbox');

      fireEvent.keyDown(input, { key: 'Escape' });

      expect(onValueChange).toHaveBeenCalledWith('');
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className to wrapper', () => {
      const { container } = render(<SearchBar className="custom-search" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('custom-search');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to the input element', () => {
      const ref = React.createRef<HTMLInputElement>();

      render(<SearchBar ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe('search');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <SearchBar
          value=""
          onValueChange={vi.fn()}
          placeholder="Search..."
          aria-label="Search"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with value', async () => {
      const { container } = render(
        <SearchBar
          value="query"
          onValueChange={vi.fn()}
          aria-label="Search"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
