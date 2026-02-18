import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ConfirmDialog } from './confirm-dialog';
import { Button } from './button';

expect.extend(toHaveNoViolations);

describe('ConfirmDialog', () => {
  describe('Rendering', () => {
    it('does not render dialog content when closed', () => {
      render(
        <ConfirmDialog
          open={false}
          onOpenChange={vi.fn()}
          title="Delete item?"
          onConfirm={vi.fn()}
        />
      );

      expect(screen.queryByText('Delete item?')).not.toBeInTheDocument();
    });

    it('renders dialog with title when open', () => {
      render(
        <ConfirmDialog
          open
          onOpenChange={vi.fn()}
          title="Delete item?"
          onConfirm={vi.fn()}
        />
      );

      expect(screen.getByText('Delete item?')).toBeInTheDocument();
    });

    it('renders description when provided', () => {
      render(
        <ConfirmDialog
          open
          onOpenChange={vi.fn()}
          title="Delete item?"
          description="This action cannot be undone."
          onConfirm={vi.fn()}
        />
      );

      expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    });

    it('renders default confirm text as "Confirm"', () => {
      render(
        <ConfirmDialog
          open
          onOpenChange={vi.fn()}
          title="Confirm action"
          onConfirm={vi.fn()}
        />
      );

      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });

    it('renders default cancel text as "Cancel"', () => {
      render(
        <ConfirmDialog
          open
          onOpenChange={vi.fn()}
          title="Confirm action"
          onConfirm={vi.fn()}
        />
      );

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('renders custom confirmText and cancelText', () => {
      render(
        <ConfirmDialog
          open
          onOpenChange={vi.fn()}
          title="Remove user?"
          confirmText="Yes, remove"
          cancelText="No, keep"
          onConfirm={vi.fn()}
        />
      );

      expect(screen.getByRole('button', { name: 'Yes, remove' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'No, keep' })).toBeInTheDocument();
    });

    it('renders children content between description and buttons', () => {
      render(
        <ConfirmDialog
          open
          onOpenChange={vi.fn()}
          title="Confirm action"
          description="Are you sure?"
          onConfirm={vi.fn()}
        >
          <p>Extra warning content</p>
        </ConfirmDialog>
      );

      expect(screen.getByText('Extra warning content')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onConfirm when confirm button is clicked', async () => {
      const user = userEvent.setup();
      const onConfirm = vi.fn();

      render(
        <ConfirmDialog
          open
          onOpenChange={vi.fn()}
          title="Confirm?"
          onConfirm={onConfirm}
        />
      );

      await user.click(screen.getByRole('button', { name: 'Confirm' }));

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();

      render(
        <ConfirmDialog
          open
          onOpenChange={vi.fn()}
          title="Confirm?"
          onConfirm={vi.fn()}
          onCancel={onCancel}
        />
      );

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('trigger opens dialog', async () => {
      const user = userEvent.setup();

      render(
        <ConfirmDialog
          title="Delete item?"
          onConfirm={vi.fn()}
          trigger={<Button>Delete</Button>}
        />
      );

      expect(screen.queryByText('Delete item?')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Delete' }));

      await waitFor(() => {
        expect(screen.getByText('Delete item?')).toBeInTheDocument();
      });
    });
  });

  describe('Variants', () => {
    it('danger variant applies error color to confirm button', () => {
      render(
        <ConfirmDialog
          open
          onOpenChange={vi.fn()}
          title="Delete permanently?"
          variant="danger"
          onConfirm={vi.fn()}
        />
      );

      const confirmButton = screen.getByRole('button', { name: 'Confirm' });
      expect(confirmButton.className).toMatch(/error|danger|destructive/);
    });
  });

  describe('Loading State', () => {
    it('disables confirm button when loading', () => {
      render(
        <ConfirmDialog
          open
          onOpenChange={vi.fn()}
          title="Processing..."
          loading
          onConfirm={vi.fn()}
        />
      );

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      expect(confirmButton).toBeDisabled();
    });

    it('shows spinner when loading', () => {
      const { container } = render(
        <ConfirmDialog
          open
          onOpenChange={vi.fn()}
          title="Processing..."
          loading
          onConfirm={vi.fn()}
        />
      );

      const spinner = container.querySelector('[role="status"], .animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('ARIA Attributes', () => {
    it('has role="alertdialog"', () => {
      render(
        <ConfirmDialog
          open
          onOpenChange={vi.fn()}
          title="Confirm?"
          onConfirm={vi.fn()}
        />
      );

      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    it('has aria-modal attribute', () => {
      render(
        <ConfirmDialog
          open
          onOpenChange={vi.fn()}
          title="Confirm?"
          onConfirm={vi.fn()}
        />
      );

      const dialog = screen.getByRole('alertdialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('title has correct id for aria-labelledby', () => {
      render(
        <ConfirmDialog
          open
          onOpenChange={vi.fn()}
          title="Confirm action"
          onConfirm={vi.fn()}
        />
      );

      const dialog = screen.getByRole('alertdialog');
      const labelledBy = dialog.getAttribute('aria-labelledby');
      expect(labelledBy).toBeTruthy();

      const titleEl = document.getElementById(labelledBy!);
      expect(titleEl).toBeInTheDocument();
      expect(titleEl).toHaveTextContent('Confirm action');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations when open', async () => {
      const { container } = render(
        <ConfirmDialog
          open
          onOpenChange={vi.fn()}
          title="Confirm deletion"
          description="This cannot be undone."
          onConfirm={vi.fn()}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
