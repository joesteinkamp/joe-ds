import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ScrollArea } from './scroll-area';

expect.extend(toHaveNoViolations);

describe('ScrollArea', () => {
  describe('Rendering', () => {
    it('renders scroll area with content', () => {
      const { container } = render(
        <ScrollArea className="h-[200px] w-[200px]">
          <div>Scrollable content goes here</div>
        </ScrollArea>
      );

      expect(container.querySelector('[data-radix-scroll-area-viewport]')).toBeInTheDocument();
    });

    it('renders with long content', () => {
      const { container } = render(
        <ScrollArea className="h-[200px]">
          {Array.from({ length: 50 }, (_, i) => (
            <p key={i}>Line {i + 1}</p>
          ))}
        </ScrollArea>
      );

      expect(container).toBeInTheDocument();
    });
  });

  describe('Scrollbar', () => {
    it('renders scrollbar', () => {
      const { container } = render(
        <ScrollArea className="h-[200px]">
          {Array.from({ length: 50 }, (_, i) => (
            <p key={i}>Line {i}</p>
          ))}
        </ScrollArea>
      );

      const scrollbar = container.querySelector('[data-radix-scroll-area-scrollbar]');
      expect(scrollbar).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <ScrollArea className="h-[200px]">
          <div>Content</div>
        </ScrollArea>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      const { container } = render(
        <ScrollArea className="custom-scroll">
          <div>Content</div>
        </ScrollArea>
      );

      expect(container.querySelector('.custom-scroll')).toBeInTheDocument();
    });
  });
});
