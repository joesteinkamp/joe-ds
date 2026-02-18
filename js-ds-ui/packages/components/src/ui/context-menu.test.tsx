import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from './context-menu';

expect.extend(toHaveNoViolations);

describe('ContextMenu', () => {
  const renderContextMenu = () => {
    return render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div style={{ width: 200, height: 200, border: '1px solid' }}>
            Right click me
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item 1</ContextMenuItem>
          <ContextMenuItem>Item 2</ContextMenuItem>
          <ContextMenuItem>Item 3</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  describe('Rendering', () => {
    it('renders trigger area', () => {
      renderContextMenu();
      expect(screen.getByText('Right click me')).toBeInTheDocument();
    });

    it('does not show menu initially', () => {
      renderContextMenu();
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('opens on right click', async () => {
      const user = userEvent.setup();
      renderContextMenu();

      await user.pointer({
        keys: '[MouseRight]',
        target: screen.getByText('Right click me'),
      });

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
      });
    });

    it('closes after selecting item', async () => {
      const user = userEvent.setup();
      renderContextMenu();

      await user.pointer({
        keys: '[MouseRight]',
        target: screen.getByText('Right click me'),
      });

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Item 1'));

      await waitFor(() => {
        expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
      });
    });

    it('closes on Escape', async () => {
      const user = userEvent.setup();
      renderContextMenu();

      await user.pointer({
        keys: '[MouseRight]',
        target: screen.getByText('Right click me'),
      });

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = renderContextMenu();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
