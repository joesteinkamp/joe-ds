import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';
import { Button } from './button';

expect.extend(toHaveNoViolations);

describe('Tooltip', () => {
  const renderTooltip = (props = {}) => {
    return render(
      <TooltipProvider>
        <Tooltip {...props}>
          <TooltipTrigger asChild>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tooltip content</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  describe('Rendering', () => {
    it('renders trigger', () => {
      renderTooltip();
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('does not show tooltip initially', () => {
      renderTooltip();
      expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('shows tooltip on hover', async () => {
      const user = userEvent.setup();
      renderTooltip();

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        expect(screen.getByText('Tooltip content')).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('hides tooltip on unhover', async () => {
      const user = userEvent.setup();
      renderTooltip();

      const trigger = screen.getByText('Hover me');
      await user.hover(trigger);

      await waitFor(() => {
        expect(screen.getByText('Tooltip content')).toBeInTheDocument();
      });

      await user.unhover(trigger);

      await waitFor(() => {
        expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
      });
    });

    it('shows tooltip on focus', async () => {
      const user = userEvent.setup();
      renderTooltip();

      const trigger = screen.getByText('Hover me');
      trigger.focus();

      await waitFor(() => {
        expect(screen.getByText('Tooltip content')).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('hides tooltip on blur', async () => {
      const user = userEvent.setup();
      renderTooltip();

      const trigger = screen.getByText('Hover me');
      trigger.focus();

      await waitFor(() => {
        expect(screen.getByText('Tooltip content')).toBeInTheDocument();
      });

      trigger.blur();

      await waitFor(() => {
        expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
      });
    });

    it('hides tooltip on Escape', async () => {
      const user = userEvent.setup();
      renderTooltip();

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        expect(screen.getByText('Tooltip content')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
      });
    });
  });

  describe('Delays', () => {
    it('respects delayDuration', async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      render(
        <TooltipProvider delayDuration={500}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Trigger</Button>
            </TooltipTrigger>
            <TooltipContent>Delayed tooltip</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      await user.hover(screen.getByText('Trigger'));

      // Should not appear immediately
      expect(screen.queryByText('Delayed tooltip')).not.toBeInTheDocument();

      // Fast-forward time
      vi.advanceTimersByTime(500);

      await waitFor(() => {
        expect(screen.getByText('Delayed tooltip')).toBeInTheDocument();
      });

      vi.useRealTimers();
    });
  });

  describe('Positioning', () => {
    it('renders with different sides', async () => {
      const user = userEvent.setup();

      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Trigger</Button>
            </TooltipTrigger>
            <TooltipContent side="top">Top tooltip</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      await user.hover(screen.getByText('Trigger'));

      await waitFor(() => {
        expect(screen.getByText('Top tooltip')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = renderTooltip();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has correct ARIA attributes', async () => {
      const user = userEvent.setup();
      renderTooltip();

      const trigger = screen.getByText('Hover me');

      await user.hover(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-describedby');
      });
    });

    it('tooltip has role="tooltip"', async () => {
      const user = userEvent.setup();
      renderTooltip();

      await user.hover(screen.getByText('Hover me'));

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', async () => {
      const user = userEvent.setup();
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Trigger</Button>
            </TooltipTrigger>
            <TooltipContent className="custom-tooltip">Content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      await user.hover(screen.getByText('Trigger'));

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveClass('custom-tooltip');
      });
    });
  });
});
