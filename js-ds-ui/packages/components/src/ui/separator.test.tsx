import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Separator } from './separator';

expect.extend(toHaveNoViolations);

describe('Separator', () => {
  describe('Rendering', () => {
    it('renders horizontal separator by default', () => {
      const { container } = render(<Separator />);
      const separator = container.querySelector('[data-orientation="horizontal"]');
      expect(separator).toBeInTheDocument();
    });

    it('renders vertical separator', () => {
      const { container } = render(<Separator orientation="vertical" />);
      const separator = container.querySelector('[data-orientation="vertical"]');
      expect(separator).toBeInTheDocument();
    });

    it('is decorative by default', () => {
      const { container } = render(<Separator />);
      const separator = container.firstChild;
      expect(separator).toHaveAttribute('data-orientation');
    });

    it('can be non-decorative', () => {
      const { container } = render(<Separator decorative={false} />);
      const separator = container.firstChild;
      expect(separator).toHaveAttribute('role', 'separator');
    });
  });

  describe('Orientation', () => {
    it('applies horizontal styles', () => {
      const { container } = render(<Separator orientation="horizontal" />);
      const separator = container.firstChild;
      expect(separator).toHaveClass('h-[1px]', 'w-full');
    });

    it('applies vertical styles', () => {
      const { container } = render(<Separator orientation="vertical" />);
      const separator = container.firstChild;
      expect(separator).toHaveClass('h-full', 'w-[1px]');
    });

    it('defaults to horizontal', () => {
      const { container } = render(<Separator />);
      const separator = container.firstChild;
      expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations (decorative)', async () => {
      const { container } = render(<Separator />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (non-decorative)', async () => {
      const { container } = render(<Separator decorative={false} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has correct role when non-decorative', () => {
      const { container } = render(<Separator decorative={false} />);
      const separator = container.firstChild;
      expect(separator).toHaveAttribute('role', 'separator');
    });

    it('has correct aria-orientation', () => {
      const { container: horizontal } = render(
        <Separator orientation="horizontal" decorative={false} />
      );
      expect(horizontal.firstChild).toHaveAttribute('aria-orientation', 'horizontal');

      const { container: vertical } = render(
        <Separator orientation="vertical" decorative={false} />
      );
      expect(vertical.firstChild).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      const { container } = render(<Separator className="custom-separator" />);
      expect(container.firstChild).toHaveClass('custom-separator');
    });

    it('merges custom className with default styles', () => {
      const { container } = render(<Separator className="my-4" />);
      const separator = container.firstChild;
      expect(separator).toHaveClass('my-4');
      expect(separator).toHaveClass('bg-[var(--color-border-default)]');
    });

    it('accepts custom styles', () => {
      const { container } = render(<Separator style={{ opacity: 0.5 }} />);
      expect(container.firstChild).toHaveStyle({ opacity: 0.5 });
    });
  });

  describe('Usage in Content', () => {
    it('works in vertical layout', () => {
      const { container } = render(
        <div>
          <p>Content above</p>
          <Separator className="my-4" />
          <p>Content below</p>
        </div>
      );

      const separator = container.querySelector('[data-orientation="horizontal"]');
      expect(separator).toBeInTheDocument();
    });

    it('works in horizontal layout', () => {
      const { container } = render(
        <div className="flex">
          <div>Left content</div>
          <Separator orientation="vertical" className="mx-4" />
          <div>Right content</div>
        </div>
      );

      const separator = container.querySelector('[data-orientation="vertical"]');
      expect(separator).toBeInTheDocument();
    });
  });

  describe('Data Attributes', () => {
    it('has data-orientation attribute', () => {
      const { container: horizontal } = render(<Separator />);
      expect(horizontal.firstChild).toHaveAttribute('data-orientation', 'horizontal');

      const { container: vertical } = render(<Separator orientation="vertical" />);
      expect(vertical.firstChild).toHaveAttribute('data-orientation', 'vertical');
    });
  });

  describe('HTML Attributes', () => {
    it('supports arbitrary data attributes', () => {
      const { container } = render(<Separator data-testid="my-separator" />);
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-separator');
    });

    it('supports id attribute', () => {
      const { container } = render(<Separator id="unique-separator" />);
      expect(container.firstChild).toHaveAttribute('id', 'unique-separator');
    });
  });
});
