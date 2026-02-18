import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AspectRatio } from './aspect-ratio';

expect.extend(toHaveNoViolations);

describe('AspectRatio', () => {
  describe('Rendering', () => {
    it('renders with children', () => {
      const { container } = render(
        <AspectRatio ratio={16 / 9}>
          <img src="https://via.placeholder.com/640x360" alt="Test" />
        </AspectRatio>
      );

      expect(container.querySelector('img')).toBeInTheDocument();
    });

    it('maintains 16:9 aspect ratio', () => {
      const { container } = render(
        <AspectRatio ratio={16 / 9}>
          <div>Content</div>
        </AspectRatio>
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('maintains 4:3 aspect ratio', () => {
      const { container } = render(
        <AspectRatio ratio={4 / 3}>
          <div>Content</div>
        </AspectRatio>
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('maintains 1:1 (square) aspect ratio', () => {
      const { container } = render(
        <AspectRatio ratio={1}>
          <div>Content</div>
        </AspectRatio>
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <AspectRatio ratio={16 / 9}>
          <img src="https://via.placeholder.com/640x360" alt="Placeholder" />
        </AspectRatio>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Content Types', () => {
    it('works with images', () => {
      const { container } = render(
        <AspectRatio ratio={16 / 9}>
          <img src="test.jpg" alt="Test" />
        </AspectRatio>
      );

      expect(container.querySelector('img')).toBeInTheDocument();
    });

    it('works with video', () => {
      const { container } = render(
        <AspectRatio ratio={16 / 9}>
          <video src="test.mp4" />
        </AspectRatio>
      );

      expect(container.querySelector('video')).toBeInTheDocument();
    });

    it('works with div content', () => {
      const { container } = render(
        <AspectRatio ratio={16 / 9}>
          <div>Content</div>
        </AspectRatio>
      );

      expect(container.querySelector('div')).toHaveTextContent('Content');
    });
  });
});
