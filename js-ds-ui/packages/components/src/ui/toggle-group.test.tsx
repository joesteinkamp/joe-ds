import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

expect.extend(toHaveNoViolations);

describe('ToggleGroup', () => {
  describe('Single Mode', () => {
    it('renders toggle group', () => {
      render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
          <ToggleGroupItem value="c">C</ToggleGroupItem>
        </ToggleGroup>
      );

      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.getByText('C')).toBeInTheDocument();
    });

    it('toggles item on click', async () => {
      const user = userEvent.setup();
      render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>
      );

      const itemA = screen.getByText('A');
      await user.click(itemA);

      expect(itemA).toHaveAttribute('data-state', 'on');
    });

    it('only one item active at a time', async () => {
      const user = userEvent.setup();
      render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>
      );

      const itemA = screen.getByText('A');
      const itemB = screen.getByText('B');

      await user.click(itemA);
      expect(itemA).toHaveAttribute('data-state', 'on');

      await user.click(itemB);
      expect(itemA).toHaveAttribute('data-state', 'off');
      expect(itemB).toHaveAttribute('data-state', 'on');
    });
  });

  describe('Multiple Mode', () => {
    it('allows multiple items active', async () => {
      const user = userEvent.setup();
      render(
        <ToggleGroup type="multiple">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
          <ToggleGroupItem value="c">C</ToggleGroupItem>
        </ToggleGroup>
      );

      const itemA = screen.getByText('A');
      const itemB = screen.getByText('B');

      await user.click(itemA);
      await user.click(itemB);

      expect(itemA).toHaveAttribute('data-state', 'on');
      expect(itemB).toHaveAttribute('data-state', 'on');
    });

    it('toggles items independently', async () => {
      const user = userEvent.setup();
      render(
        <ToggleGroup type="multiple">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>
      );

      const itemA = screen.getByText('A');
      const itemB = screen.getByText('B');

      await user.click(itemA);
      await user.click(itemB);
      await user.click(itemA);

      expect(itemA).toHaveAttribute('data-state', 'off');
      expect(itemB).toHaveAttribute('data-state', 'on');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Disabled State', () => {
    it('renders disabled items', () => {
      render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="a" disabled>
            A
          </ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>
      );

      expect(screen.getByText('A')).toBeDisabled();
    });

    it('does not toggle disabled items', async () => {
      const user = userEvent.setup();
      render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="a" disabled>
            A
          </ToggleGroupItem>
        </ToggleGroup>
      );

      await user.click(screen.getByText('A'));
      expect(screen.getByText('A')).toHaveAttribute('data-state', 'off');
    });
  });
});
