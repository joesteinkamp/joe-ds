import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';

expect.extend(toHaveNoViolations);

describe('Popover', () => {
  const renderPopover = () => {
    return render(
      <Popover>
        <PopoverTrigger asChild>
          <Button>Open Popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div>Popover content</div>
        </PopoverContent>
      </Popover>
    );
  };

  describe('Rendering', () => {
    it('renders trigger button', () => {
      renderPopover();
      expect(screen.getByText('Open Popover')).toBeInTheDocument();
    });

    it('does not show content initially', () => {
      renderPopover();
      expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
    });

    it('shows content when opened', async () => {
      const user = userEvent.setup();
      renderPopover();

      await user.click(screen.getByText('Open Popover'));

      await waitFor(() => {
        expect(screen.getByText('Popover content')).toBeInTheDocument();
      });
    });
  });

  describe('Interactions', () => {
    it('opens on trigger click', async () => {
      const user = userEvent.setup();
      renderPopover();

      await user.click(screen.getByText('Open Popover'));

      await waitFor(() => {
        expect(screen.getByText('Popover content')).toBeInTheDocument();
      });
    });

    it('closes on outside click', async () => {
      const user = userEvent.setup();
      renderPopover();

      await user.click(screen.getByText('Open Popover'));

      await waitFor(() => {
        expect(screen.getByText('Popover content')).toBeInTheDocument();
      });

      await user.click(document.body);

      await waitFor(() => {
        expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
      });
    });

    it('closes on Escape key', async () => {
      const user = userEvent.setup();
      renderPopover();

      await user.click(screen.getByText('Open Popover'));

      await waitFor(() => {
        expect(screen.getByText('Popover content')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
      });
    });

    it('toggles on repeated trigger clicks', async () => {
      const user = userEvent.setup();
      renderPopover();

      const trigger = screen.getByText('Open Popover');

      await user.click(trigger);
      await waitFor(() => {
        expect(screen.getByText('Popover content')).toBeInTheDocument();
      });

      await user.click(trigger);
      await waitFor(() => {
        expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
      });
    });
  });

  describe('Positioning', () => {
    it('renders with different sides', async () => {
      const user = userEvent.setup();

      const { rerender } = render(
        <Popover>
          <PopoverTrigger asChild>
            <Button>Trigger</Button>
          </PopoverTrigger>
          <PopoverContent side="top">Top content</PopoverContent>
        </Popover>
      );

      await user.click(screen.getByText('Trigger'));
      await waitFor(() => {
        expect(screen.getByText('Top content')).toBeInTheDocument();
      });

      rerender(
        <Popover>
          <PopoverTrigger asChild>
            <Button>Trigger</Button>
          </PopoverTrigger>
          <PopoverContent side="bottom">Bottom content</PopoverContent>
        </Popover>
      );
    });

    it('renders with different alignments', async () => {
      const user = userEvent.setup();
      render(
        <Popover>
          <PopoverTrigger asChild>
            <Button>Trigger</Button>
          </PopoverTrigger>
          <PopoverContent align="start">Aligned start</PopoverContent>
        </Popover>
      );

      await user.click(screen.getByText('Trigger'));
      await waitFor(() => {
        expect(screen.getByText('Aligned start')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = renderPopover();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has correct ARIA attributes', async () => {
      const user = userEvent.setup();
      renderPopover();

      const trigger = screen.getByText('Open Popover');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      await user.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  describe('Controlled Mode', () => {
    it('works in controlled mode', async () => {
      const user = userEvent.setup();
      const ControlledPopover = () => {
        const [open, setOpen] = React.useState(false);
        return (
          <>
            <Button onClick={() => setOpen(true)}>Open Controlled</Button>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverContent>Controlled content</PopoverContent>
            </Popover>
          </>
        );
      };

      render(<ControlledPopover />);

      await user.click(screen.getByText('Open Controlled'));

      await waitFor(() => {
        expect(screen.getByText('Controlled content')).toBeInTheDocument();
      });
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', async () => {
      const user = userEvent.setup();
      render(
        <Popover>
          <PopoverTrigger asChild>
            <Button>Trigger</Button>
          </PopoverTrigger>
          <PopoverContent className="custom-popover">Content</PopoverContent>
        </Popover>
      );

      await user.click(screen.getByText('Trigger'));

      await waitFor(() => {
        const content = screen.getByText('Content').parentElement;
        expect(content).toHaveClass('custom-popover');
      });
    });
  });
});
