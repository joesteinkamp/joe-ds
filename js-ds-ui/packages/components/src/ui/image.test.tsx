import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Image } from './image';

expect.extend(toHaveNoViolations);

describe('Image', () => {
  describe('Rendering', () => {
    it('renders an img element with src and alt', () => {
      render(<Image src="/photo.jpg" alt="A photo" />);
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/photo.jpg');
      expect(img).toHaveAttribute('alt', 'A photo');
    });
  });

  describe('Loading state', () => {
    it('shows skeleton (animate-pulse div) while loading', () => {
      const { container } = render(<Image src="/photo.jpg" alt="Photo" />);
      const skeleton = container.querySelector('.animate-pulse');
      expect(skeleton).toBeInTheDocument();
    });

    it('after load event, skeleton is hidden and image is visible', () => {
      const { container } = render(<Image src="/photo.jpg" alt="Photo" />);
      const img = screen.getByRole('img');

      // Before load: skeleton visible, image invisible
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
      expect(img).toHaveClass('invisible');

      // Fire load event
      fireEvent.load(img);

      // After load: skeleton gone, image visible
      expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument();
      expect(img).not.toHaveClass('invisible');
    });
  });

  describe('Error state', () => {
    it('shows default fallback SVG on error', () => {
      const { container } = render(<Image src="/missing.jpg" alt="Missing" />);
      const img = screen.getByRole('img');

      fireEvent.error(img);

      const fallbackSvg = container.querySelector('svg');
      expect(fallbackSvg).toBeInTheDocument();
    });

    it('shows custom fallback content on error', () => {
      render(
        <Image
          src="/missing.jpg"
          alt="Missing"
          fallback={<span>No image available</span>}
        />
      );
      const img = screen.getByRole('img');

      fireEvent.error(img);

      expect(screen.getByText('No image available')).toBeInTheDocument();
    });
  });

  describe('Callbacks', () => {
    it('calls onLoad callback when image loads', () => {
      const onLoad = vi.fn();
      render(<Image src="/photo.jpg" alt="Photo" onLoad={onLoad} />);
      const img = screen.getByRole('img');

      fireEvent.load(img);

      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    it('calls onError callback when image fails', () => {
      const onError = vi.fn();
      render(<Image src="/missing.jpg" alt="Missing" onError={onError} />);
      const img = screen.getByRole('img');

      fireEvent.error(img);

      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  describe('Aspect ratio', () => {
    it('sets aspect ratio style on wrapper', () => {
      const { container } = render(
        <Image src="/photo.jpg" alt="Photo" aspectRatio="16/9" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.aspectRatio).toBe('16/9');
    });

    it('does not set aspect ratio style when not provided', () => {
      const { container } = render(<Image src="/photo.jpg" alt="Photo" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.aspectRatio).toBe('');
    });
  });

  describe('Rounded variants', () => {
    it('applies rounded-none', () => {
      const { container } = render(<Image src="/photo.jpg" alt="Photo" rounded="none" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('rounded-none');
    });

    it('applies rounded-sm', () => {
      const { container } = render(<Image src="/photo.jpg" alt="Photo" rounded="sm" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('rounded-sm');
    });

    it('defaults to md rounded', () => {
      const { container } = render(<Image src="/photo.jpg" alt="Photo" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('rounded-[var(--component-button-border-radius,0.375rem)]');
    });

    it('applies rounded-lg', () => {
      const { container } = render(<Image src="/photo.jpg" alt="Photo" rounded="lg" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('rounded-lg');
    });

    it('applies rounded-xl', () => {
      const { container } = render(<Image src="/photo.jpg" alt="Photo" rounded="xl" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('rounded-xl');
    });

    it('applies rounded-full', () => {
      const { container } = render(<Image src="/photo.jpg" alt="Photo" rounded="full" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('rounded-full');
    });
  });

  describe('Fit variants', () => {
    it('defaults to object-cover on the img', () => {
      render(<Image src="/photo.jpg" alt="Photo" />);
      const img = screen.getByRole('img');
      fireEvent.load(img);
      expect(img).toHaveClass('object-cover');
    });

    it('applies object-contain', () => {
      render(<Image src="/photo.jpg" alt="Photo" fit="contain" />);
      const img = screen.getByRole('img');
      fireEvent.load(img);
      expect(img).toHaveClass('object-contain');
    });

    it('applies object-fill', () => {
      render(<Image src="/photo.jpg" alt="Photo" fit="fill" />);
      const img = screen.getByRole('img');
      fireEvent.load(img);
      expect(img).toHaveClass('object-fill');
    });

    it('applies object-none', () => {
      render(<Image src="/photo.jpg" alt="Photo" fit="none" />);
      const img = screen.getByRole('img');
      fireEvent.load(img);
      expect(img).toHaveClass('object-none');
    });

    it('applies object-scale-down', () => {
      render(<Image src="/photo.jpg" alt="Photo" fit="scale-down" />);
      const img = screen.getByRole('img');
      fireEvent.load(img);
      expect(img).toHaveClass('object-scale-down');
    });
  });

  describe('Custom className', () => {
    it('merges custom className on the img element', () => {
      render(<Image src="/photo.jpg" alt="Photo" className="custom-image" />);
      const img = screen.getByRole('img');
      expect(img).toHaveClass('custom-image');
      expect(img).toHaveClass('h-full');
      expect(img).toHaveClass('w-full');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to the underlying img element', () => {
      const ref = createRef<HTMLImageElement>();
      render(<Image ref={ref} src="/photo.jpg" alt="Photo" />);
      expect(ref.current).toBeInstanceOf(HTMLImageElement);
      expect(ref.current?.tagName).toBe('IMG');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations with alt text', async () => {
      const { container } = render(<Image src="/photo.jpg" alt="A scenic photo" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with aspect ratio', async () => {
      const { container } = render(
        <Image src="/photo.jpg" alt="Photo" aspectRatio="16/9" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when loaded', async () => {
      const { container } = render(<Image src="/photo.jpg" alt="Photo" />);
      const img = screen.getByRole('img');
      fireEvent.load(img);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
