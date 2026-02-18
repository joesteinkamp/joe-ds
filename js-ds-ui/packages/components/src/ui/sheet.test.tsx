import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';
import { Button } from './button';

expect.extend(toHaveNoViolations);

describe('Sheet', () => {
  const renderSheet = (side: 'top' | 'right' | 'bottom' | 'left' = 'right') => {
    return render(
      <Sheet>
        <SheetTrigger asChild>
          <Button>Open Sheet</Button>
        </SheetTrigger>
        <SheetContent side={side}>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet description</SheetDescription>
          </SheetHeader>
          <div>Sheet body content</div>
        </SheetContent>
      </Sheet>
    );
  };

  describe('Rendering', () => {
    it('renders trigger button', () => {
      renderSheet();
      expect(screen.getByText('Open Sheet')).toBeInTheDocument();
    });

    it('does not show content initially', () => {
      renderSheet();
      expect(screen.queryByText('Sheet Title')).not.toBeInTheDocument();
    });

    it('shows content when opened', async () => {
      const user = userEvent.setup();
      renderSheet();

      await user.click(screen.getByText('Open Sheet'));

      await waitFor(() => {
        expect(screen.getByText('Sheet Title')).toBeInTheDocument();
        expect(screen.getByText('Sheet description')).toBeInTheDocument();
      });
    });

    it('renders close button', async () => {
      const user = userEvent.setup();
      renderSheet();

      await user.click(screen.getByText('Open Sheet'));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
      });
    });
  });

  describe('Side Variants', () => {
    it('renders from right side', async () => {
      const user = userEvent.setup();
      renderSheet('right');

      await user.click(screen.getByText('Open Sheet'));

      await waitFor(() => {
        expect(screen.getByText('Sheet Title')).toBeInTheDocument();
      });
    });

    it('renders from left side', async () => {
      const user = userEvent.setup();
      renderSheet('left');

      await user.click(screen.getByText('Open Sheet'));

      await waitFor(() => {
        expect(screen.getByText('Sheet Title')).toBeInTheDocument();
      });
    });

    it('renders from top', async () => {
      const user = userEvent.setup();
      renderSheet('top');

      await user.click(screen.getByText('Open Sheet'));

      await waitFor(() => {
        expect(screen.getByText('Sheet Title')).toBeInTheDocument();
      });
    });

    it('renders from bottom', async () => {
      const user = userEvent.setup();
      renderSheet('bottom');

      await user.click(screen.getByText('Open Sheet'));

      await waitFor(() => {
        expect(screen.getByText('Sheet Title')).toBeInTheDocument();
      });
    });
  });

  describe('Interactions', () => {
    it('opens on trigger click', async () => {
      const user = userEvent.setup();
      renderSheet();

      await user.click(screen.getByText('Open Sheet'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('closes on close button click', async () => {
      const user = userEvent.setup();
      renderSheet();

      await user.click(screen.getByText('Open Sheet'));

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
      renderSheet();

      await user.click(screen.getByText('Open Sheet'));

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
      renderSheet();

      await user.click(screen.getByText('Open Sheet'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const overlay = document.querySelector('[data-radix-dialog-overlay]');
      if (overlay) {
        await user.click(overlay);

        await waitFor(() => {
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
      }
    });

    it('uses SheetClose component', async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
            <SheetClose asChild>
              <Button>Close Sheet</Button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByText('Open'));

      await waitFor(() => {
        expect(screen.getByText('Close Sheet')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Close Sheet'));

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('traps focus within sheet', async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
            <Button>Button 1</Button>
            <Button>Button 2</Button>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByText('Open'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await user.tab();
      expect(screen.getByText('Button 1')).toHaveFocus();

      await user.tab();
      expect(screen.getByText('Button 2')).toHaveFocus();
    });

    it('returns focus to trigger after close', async () => {
      const user = userEvent.setup();
      renderSheet();

      const trigger = screen.getByText('Open Sheet');
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
    it('has no accessibility violations (closed)', async () => {
      const { container } = renderSheet();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has correct ARIA attributes', async () => {
      const user = userEvent.setup();
      renderSheet();

      await user.click(screen.getByText('Open Sheet'));

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-labelledby');
        expect(dialog).toHaveAttribute('aria-describedby');
      });
    });

    it('has accessible title', async () => {
      const user = userEvent.setup();
      renderSheet();

      await user.click(screen.getByText('Open Sheet'));

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /Sheet Title/i })).toBeInTheDocument();
      });
    });
  });

  describe('Controlled Mode', () => {
    it('works in controlled mode', async () => {
      const user = userEvent.setup();
      const ControlledSheet = () => {
        const [open, setOpen] = React.useState(false);
        return (
          <>
            <Button onClick={() => setOpen(true)}>Open Controlled</Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetContent>
                <SheetTitle>Controlled Sheet</SheetTitle>
              </SheetContent>
            </Sheet>
          </>
        );
      };

      render(<ControlledSheet />);

      await user.click(screen.getByText('Open Controlled'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent className="custom-sheet">
            <SheetTitle>Title</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByText('Open'));

      await waitFor(() => {
        const sheet = document.querySelector('.custom-sheet');
        expect(sheet).toBeInTheDocument();
      });
    });
  });
});
