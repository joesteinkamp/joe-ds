import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from './menubar';

expect.extend(toHaveNoViolations);

describe('Menubar', () => {
  const renderMenubar = () => {
    return render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
            <MenubarItem>Open</MenubarItem>
            <MenubarItem>Save</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Cut</MenubarItem>
            <MenubarItem>Copy</MenubarItem>
            <MenubarItem>Paste</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  };

  describe('Rendering', () => {
    it('renders menubar', () => {
      const { container } = renderMenubar();
      expect(container.querySelector('[role="menubar"]')).toBeInTheDocument();
    });

    it('renders menu triggers', () => {
      renderMenubar();
      expect(screen.getByText('File')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    it('does not show menu content initially', () => {
      renderMenubar();
      expect(screen.queryByText('New')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('opens menu on trigger click', async () => {
      const user = userEvent.setup();
      renderMenubar();

      await user.click(screen.getByText('File'));

      await waitFor(() => {
        expect(screen.getByText('New')).toBeInTheDocument();
        expect(screen.getByText('Open')).toBeInTheDocument();
      });
    });

    it('closes menu after selecting item', async () => {
      const user = userEvent.setup();
      renderMenubar();

      await user.click(screen.getByText('File'));

      await waitFor(() => {
        expect(screen.getByText('New')).toBeInTheDocument();
      });

      await user.click(screen.getByText('New'));

      await waitFor(() => {
        expect(screen.queryByText('New')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = renderMenubar();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has menubar role', () => {
      const { container } = renderMenubar();
      expect(container.querySelector('[role="menubar"]')).toBeInTheDocument();
    });
  });
});
