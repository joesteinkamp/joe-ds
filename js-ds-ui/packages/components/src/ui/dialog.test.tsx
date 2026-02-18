import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Button } from './button';

expect.extend(toHaveNoViolations);

describe('Dialog', () => {
  const renderDialog = () => {
    return render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description text</DialogDescription>
          </DialogHeader>
          <div>Dialog body content</div>
        </DialogContent>
      </Dialog>
    );
  };

  describe('Rendering', () => {
    it('renders trigger button', () => {
      renderDialog();
      expect(screen.getByText('Open Dialog')).toBeInTheDocument();
    });

    it('does not show content initially', () => {
      renderDialog();
      expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();
    });

    it('shows content when opened', async () => {
      const user = userEvent.setup();
      renderDialog();

      await user.click(screen.getByText('Open Dialog'));

      await waitFor(() => {
        expect(screen.getByText('Dialog Title')).toBeInTheDocument();
        expect(screen.getByText('Dialog description text')).toBeInTheDocument();
      });
    });

    it('renders close button', async () => {
      const user = userEvent.setup();
      renderDialog();

      await user.click(screen.getByText('Open Dialog'));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
      });
    });
  });

  describe('Interactions', () => {
    it('opens on trigger click', async () => {
      const user = userEvent.setup();
      renderDialog();

      await user.click(screen.getByText('Open Dialog'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('closes on close button click', async () => {
      const user = userEvent.setup();
      renderDialog();

      await user.click(screen.getByText('Open Dialog'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /close/i }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('closes on Escape key', async () => {
      const user = userEvent.setup();
      renderDialog();

      await user.click(screen.getByText('Open Dialog'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('closes on overlay click', async () => {
      const user = userEvent.setup();
      renderDialog();

      await user.click(screen.getByText('Open Dialog'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Click overlay (outside dialog content)
      const overlay = document.querySelector('[data-radix-dialog-overlay]');
      if (overlay) {
        await user.click(overlay);

        await waitFor(() => {
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
      }
    });
  });

  describe('Keyboard Navigation', () => {
    it('traps focus within dialog', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <Button>Button 1</Button>
            <Button>Button 2</Button>
          </DialogContent>
        </Dialog>
      );

      await user.click(screen.getByText('Open'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Focus should be trapped inside dialog
      await user.tab();
      expect(screen.getByText('Button 1')).toHaveFocus();

      await user.tab();
      expect(screen.getByText('Button 2')).toHaveFocus();
    });

    it('returns focus to trigger after close', async () => {
      const user = userEvent.setup();
      renderDialog();

      const trigger = screen.getByText('Open Dialog');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(trigger).toHaveFocus();
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations when closed', async () => {
      const { container } = renderDialog();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has correct ARIA attributes', async () => {
      const user = userEvent.setup();
      renderDialog();

      await user.click(screen.getByText('Open Dialog'));

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-labelledby');
        expect(dialog).toHaveAttribute('aria-describedby');
      });
    });

    it('has accessible title', async () => {
      const user = userEvent.setup();
      renderDialog();

      await user.click(screen.getByText('Open Dialog'));

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /Dialog Title/i })).toBeInTheDocument();
      });
    });
  });

  describe('Controlled Mode', () => {
    it('works in controlled mode', async () => {
      const user = userEvent.setup();
      const ControlledDialog = () => {
        const [open, setOpen] = React.useState(false);
        return (
          <>
            <Button onClick={() => setOpen(true)}>Open Controlled</Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogTitle>Controlled Dialog</DialogTitle>
              </DialogContent>
            </Dialog>
          </>
        );
      };

      render(<ControlledDialog />);

      await user.click(screen.getByText('Open Controlled'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });
});
