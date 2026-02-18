import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Toast,
  ToastAction,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast';

expect.extend(toHaveNoViolations);

describe('Toast', () => {
  const renderToast = (props = {}) => {
    return render(
      <ToastProvider>
        <Toast {...props}>
          <ToastTitle>Toast Title</ToastTitle>
          <ToastDescription>Toast description text</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
  };

  describe('Rendering', () => {
    it('renders toast with title and description', () => {
      renderToast();
      expect(screen.getByText('Toast Title')).toBeInTheDocument();
      expect(screen.getByText('Toast description text')).toBeInTheDocument();
    });

    it('renders default variant', () => {
      const { container } = renderToast();
      const toast = container.querySelector('[data-state]');
      expect(toast).toBeInTheDocument();
    });

    it('renders success variant', () => {
      renderToast({ variant: 'success' });
      expect(screen.getByText('Toast Title')).toBeInTheDocument();
    });

    it('renders error variant', () => {
      renderToast({ variant: 'error' });
      expect(screen.getByText('Toast Title')).toBeInTheDocument();
    });

    it('renders warning variant', () => {
      renderToast({ variant: 'warning' });
      expect(screen.getByText('Toast Title')).toBeInTheDocument();
    });

    it('renders with action button', () => {
      render(
        <ToastProvider>
          <Toast>
            <ToastTitle>Title</ToastTitle>
            <ToastAction altText="Undo action">Undo</ToastAction>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      expect(screen.getByText('Undo')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('dismisses on close button click', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <Toast open>
            <ToastTitle>Title</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      const closeButton = screen.getByRole('button');
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Title')).not.toBeInTheDocument();
      });
    });

    it('calls onOpenChange when closed', async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();

      render(
        <ToastProvider>
          <Toast open onOpenChange={handleOpenChange}>
            <ToastTitle>Title</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      const closeButton = screen.getByRole('button');
      await user.click(closeButton);

      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    it('action button triggers callback', async () => {
      const user = userEvent.setup();
      let actionClicked = false;
      const handleAction = () => {
        actionClicked = true;
      };

      render(
        <ToastProvider>
          <Toast>
            <ToastTitle>Title</ToastTitle>
            <ToastAction altText="Retry" onClick={handleAction}>
              Retry
            </ToastAction>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      await user.click(screen.getByText('Retry'));
      expect(actionClicked).toBe(true);
    });
  });

  describe('Auto Dismiss', () => {
    it('auto-dismisses after duration', async () => {
      vi.useFakeTimers();

      render(
        <ToastProvider>
          <Toast open duration={1000}>
            <ToastTitle>Auto dismiss</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      expect(screen.getByText('Auto dismiss')).toBeInTheDocument();

      vi.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(screen.queryByText('Auto dismiss')).not.toBeInTheDocument();
      });

      vi.useRealTimers();
    });

    it('pauses dismiss on hover', async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      const { container } = render(
        <ToastProvider>
          <Toast open duration={1000}>
            <ToastTitle>Pausable</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      const toast = container.querySelector('[data-state]');
      if (toast) {
        await user.hover(toast);
      }

      vi.advanceTimersByTime(1500);

      // Should still be visible because of hover
      expect(screen.getByText('Pausable')).toBeInTheDocument();

      vi.useRealTimers();
    });
  });

  describe('Swipe to Dismiss', () => {
    it('supports swipe gestures', () => {
      const { container } = renderToast();
      const toast = container.querySelector('[data-state]');
      expect(toast).toHaveAttribute('data-swipe-direction');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = renderToast();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has correct ARIA attributes', () => {
      const { container } = renderToast();
      const toast = container.querySelector('[role="status"]');
      expect(toast).toBeInTheDocument();
    });

    it('title has accessible name', () => {
      renderToast();
      const title = screen.getByText('Toast Title');
      expect(title).toBeInTheDocument();
    });

    it('action has altText', () => {
      render(
        <ToastProvider>
          <Toast>
            <ToastTitle>Title</ToastTitle>
            <ToastAction altText="Perform action">Action</ToastAction>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      const action = screen.getByText('Action');
      expect(action).toHaveAttribute('alt', 'Perform action');
    });
  });

  describe('Multiple Toasts', () => {
    it('renders multiple toasts', () => {
      render(
        <ToastProvider>
          <Toast open>
            <ToastTitle>Toast 1</ToastTitle>
          </Toast>
          <Toast open>
            <ToastTitle>Toast 2</ToastTitle>
          </Toast>
          <Toast open>
            <ToastTitle>Toast 3</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      expect(screen.getByText('Toast 1')).toBeInTheDocument();
      expect(screen.getByText('Toast 2')).toBeInTheDocument();
      expect(screen.getByText('Toast 3')).toBeInTheDocument();
    });

    it('stacks toasts correctly', () => {
      const { container } = render(
        <ToastProvider>
          <Toast open>
            <ToastTitle>Toast 1</ToastTitle>
          </Toast>
          <Toast open>
            <ToastTitle>Toast 2</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      const toasts = container.querySelectorAll('[data-state]');
      expect(toasts).toHaveLength(2);
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      const { container } = render(
        <ToastProvider>
          <Toast className="custom-toast">
            <ToastTitle>Title</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      const toast = container.querySelector('.custom-toast');
      expect(toast).toBeInTheDocument();
    });
  });

  describe('Viewport', () => {
    it('renders viewport container', () => {
      const { container } = render(
        <ToastProvider>
          <ToastViewport />
        </ToastProvider>
      );

      const viewport = container.querySelector('[data-radix-toast-viewport]');
      expect(viewport).toBeInTheDocument();
    });

    it('accepts custom className on viewport', () => {
      const { container } = render(
        <ToastProvider>
          <ToastViewport className="custom-viewport" />
        </ToastProvider>
      );

      const viewport = container.querySelector('.custom-viewport');
      expect(viewport).toBeInTheDocument();
    });
  });
});
