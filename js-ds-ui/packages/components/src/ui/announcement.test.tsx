import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { Announcement } from './announcement';

describe('Announcement', () => {
  describe('ARIA Attributes', () => {
    it('renders with role="status"', () => {
      render(<Announcement message="Hello" />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders with aria-live="polite" by default', () => {
      render(<Announcement message="Hello" />);
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });

    it('renders with aria-live="assertive" when politeness="assertive"', () => {
      render(<Announcement message="Urgent" politeness="assertive" />);
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'assertive');
    });

    it('has aria-atomic="true"', () => {
      render(<Announcement message="Hello" />);
      expect(screen.getByRole('status')).toHaveAttribute('aria-atomic', 'true');
    });
  });

  describe('Message Display', () => {
    it('displays message text', () => {
      render(<Announcement message="New notification" />);
      expect(screen.getByRole('status')).toHaveTextContent('New notification');
    });

    it('updates when message prop changes', () => {
      const { rerender } = render(<Announcement message="First" />);
      expect(screen.getByRole('status')).toHaveTextContent('First');

      rerender(<Announcement message="Second" />);
      expect(screen.getByRole('status')).toHaveTextContent('Second');
    });
  });

  describe('Styling and Ref', () => {
    it('applies className', () => {
      render(<Announcement message="Hello" className="custom-announce" />);
      expect(screen.getByRole('status')).toHaveClass('custom-announce');
    });

    it('forwards ref', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Announcement ref={ref} message="Hello" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Clear After Timeout', () => {
    it('clears message after clearAfterMs', () => {
      vi.useFakeTimers();

      render(<Announcement message="Temporary" clearAfterMs={3000} />);
      expect(screen.getByRole('status')).toHaveTextContent('Temporary');

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(screen.getByRole('status')).toHaveTextContent('');

      vi.useRealTimers();
    });
  });
});
