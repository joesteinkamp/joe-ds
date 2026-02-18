import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { FocusTrap } from './focus-trap';

describe('FocusTrap', () => {
  describe('Rendering', () => {
    it('renders children', () => {
      render(
        <FocusTrap active={false}>
          <span>Trap content</span>
        </FocusTrap>
      );
      expect(screen.getByText('Trap content')).toBeInTheDocument();
    });

    it('applies className', () => {
      const { container } = render(
        <FocusTrap active={false} className="custom-trap">
          <button>Focusable</button>
        </FocusTrap>
      );
      expect(container.firstChild).toHaveClass('custom-trap');
    });

    it('forwards ref', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <FocusTrap ref={ref} active={false}>
          <button>Focusable</button>
        </FocusTrap>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Focus Management', () => {
    it('focuses first focusable element when active', () => {
      render(
        <FocusTrap active>
          <button>First</button>
          <button>Second</button>
        </FocusTrap>
      );
      expect(screen.getByText('First')).toHaveFocus();
    });

    it('focuses initialFocus element when provided', () => {
      render(
        <FocusTrap active initialFocus="[data-initial]">
          <button>First</button>
          <button data-initial>Target</button>
        </FocusTrap>
      );
      expect(screen.getByText('Target')).toHaveFocus();
    });

    it('does not trap focus when active=false', () => {
      const outer = document.createElement('button');
      outer.textContent = 'Outside';
      document.body.appendChild(outer);
      outer.focus();

      render(
        <FocusTrap active={false}>
          <button>Inside</button>
        </FocusTrap>
      );

      // Focus should remain on the outside element, not moved into the trap
      expect(outer).toHaveFocus();
      document.body.removeChild(outer);
    });

    it('restores focus when deactivated (returnFocusOnDeactivate=true)', () => {
      const outer = document.createElement('button');
      outer.textContent = 'Outside';
      document.body.appendChild(outer);
      outer.focus();

      const { rerender } = render(
        <FocusTrap active returnFocusOnDeactivate>
          <button>Inside</button>
        </FocusTrap>
      );

      // Focus should have moved inside the trap
      expect(screen.getByText('Inside')).toHaveFocus();

      // Deactivate the trap
      rerender(
        <FocusTrap active={false} returnFocusOnDeactivate>
          <button>Inside</button>
        </FocusTrap>
      );

      // Focus should return to the previously focused element
      expect(outer).toHaveFocus();
      document.body.removeChild(outer);
    });
  });

  describe('Keyboard Navigation', () => {
    it('calls onEscapeKey when Escape is pressed', () => {
      const handleEscape = vi.fn();
      render(
        <FocusTrap active onEscapeKey={handleEscape}>
          <button>Focusable</button>
        </FocusTrap>
      );

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(handleEscape).toHaveBeenCalledTimes(1);
    });

    it('traps Tab at last element (wraps to first)', () => {
      render(
        <FocusTrap active>
          <button>First</button>
          <button>Second</button>
          <button>Third</button>
        </FocusTrap>
      );

      // Focus the last button
      screen.getByText('Third').focus();
      expect(screen.getByText('Third')).toHaveFocus();

      // Press Tab on the last element
      fireEvent.keyDown(document, { key: 'Tab' });

      // Focus should wrap to the first element
      expect(screen.getByText('First')).toHaveFocus();
    });

    it('traps Shift+Tab at first element (wraps to last)', () => {
      render(
        <FocusTrap active>
          <button>First</button>
          <button>Second</button>
          <button>Third</button>
        </FocusTrap>
      );

      // Focus should already be on the first element
      expect(screen.getByText('First')).toHaveFocus();

      // Press Shift+Tab on the first element
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });

      // Focus should wrap to the last element
      expect(screen.getByText('Third')).toHaveFocus();
    });
  });
});
