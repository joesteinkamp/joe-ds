import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';

expect.extend(toHaveNoViolations);

describe('HoverCard', () => {
  const renderHoverCard = () => {
    return render(
      <HoverCard>
        <HoverCardTrigger asChild>
          <span>Hover over me</span>
        </HoverCardTrigger>
        <HoverCardContent>
          <div>Hover card content</div>
        </HoverCardContent>
      </HoverCard>
    );
  };

  describe('Rendering', () => {
    it('renders trigger', () => {
      renderHoverCard();
      expect(screen.getByText('Hover over me')).toBeInTheDocument();
    });

    it('does not show content initially', () => {
      renderHoverCard();
      expect(screen.queryByText('Hover card content')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('shows content on hover', async () => {
      const user = userEvent.setup();
      renderHoverCard();

      await user.hover(screen.getByText('Hover over me'));

      await waitFor(() => {
        expect(screen.getByText('Hover card content')).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('hides content on unhover', async () => {
      const user = userEvent.setup();
      renderHoverCard();

      const trigger = screen.getByText('Hover over me');
      await user.hover(trigger);

      await waitFor(() => {
        expect(screen.getByText('Hover card content')).toBeInTheDocument();
      });

      await user.unhover(trigger);

      await waitFor(() => {
        expect(screen.queryByText('Hover card content')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = renderHoverCard();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
