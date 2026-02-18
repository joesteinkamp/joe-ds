import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

expect.extend(toHaveNoViolations);

describe('Avatar', () => {
  describe('Rendering', () => {
    it('renders avatar container', () => {
      render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('shows fallback when no image provided', () => {
      render(
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      );
      expect(screen.getByText('AB')).toBeInTheDocument();
    });

    it('shows image when loaded', async () => {
      render(
        <Avatar>
          <AvatarImage src="https://via.placeholder.com/150" alt="User avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      await waitFor(() => {
        const img = screen.getByAltText('User avatar');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'https://via.placeholder.com/150');
      });
    });

    it('shows fallback when image fails to load', async () => {
      render(
        <Avatar>
          <AvatarImage src="invalid-url.jpg" alt="User avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      await waitFor(() => {
        expect(screen.getByText('JD')).toBeInTheDocument();
      });
    });

    it('renders with initials', () => {
      render(
        <Avatar>
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
      );
      expect(screen.getByText('JS')).toBeInTheDocument();
    });

    it('renders with delayMs prop', async () => {
      render(
        <Avatar>
          <AvatarImage src="https://via.placeholder.com/150" alt="Avatar" />
          <AvatarFallback delayMs={300}>JD</AvatarFallback>
        </Avatar>
      );

      // Fallback should show during delay
      expect(screen.getByText('JD')).toBeInTheDocument();
    });
  });

  describe('Image Loading States', () => {
    it('handles loading state', async () => {
      const { rerender } = render(
        <Avatar>
          <AvatarImage src="https://via.placeholder.com/150" alt="Avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      // Initially shows fallback
      expect(screen.getByText('JD')).toBeInTheDocument();

      // Wait for image to load
      await waitFor(() => {
        expect(screen.getByAltText('Avatar')).toBeInTheDocument();
      });
    });

    it('handles src change', async () => {
      const { rerender } = render(
        <Avatar>
          <AvatarImage src="https://via.placeholder.com/150" alt="Avatar 1" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      await waitFor(() => {
        expect(screen.getByAltText('Avatar 1')).toBeInTheDocument();
      });

      rerender(
        <Avatar>
          <AvatarImage src="https://via.placeholder.com/200" alt="Avatar 2" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      await waitFor(() => {
        expect(screen.getByAltText('Avatar 2')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations (with image)', async () => {
      const { container } = render(
        <Avatar>
          <AvatarImage src="https://via.placeholder.com/150" alt="John Doe" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      await waitFor(() => {
        expect(screen.getByAltText('John Doe')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (fallback only)', async () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('image has alt text', async () => {
      render(
        <Avatar>
          <AvatarImage src="https://via.placeholder.com/150" alt="Profile picture" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      await waitFor(() => {
        const img = screen.getByAltText('Profile picture');
        expect(img).toBeInTheDocument();
      });
    });

    it('fallback has meaningful content', () => {
      render(
        <Avatar>
          <AvatarFallback aria-label="John Doe avatar">JD</AvatarFallback>
        </Avatar>
      );

      const fallback = screen.getByLabelText('John Doe avatar');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent('JD');
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className on Avatar', () => {
      const { container } = render(
        <Avatar className="custom-avatar">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      const avatar = container.firstChild;
      expect(avatar).toHaveClass('custom-avatar');
    });

    it('accepts custom className on AvatarImage', async () => {
      render(
        <Avatar>
          <AvatarImage
            src="https://via.placeholder.com/150"
            alt="Avatar"
            className="custom-image"
          />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      await waitFor(() => {
        const img = screen.getByAltText('Avatar');
        expect(img).toHaveClass('custom-image');
      });
    });

    it('accepts custom className on AvatarFallback', () => {
      render(
        <Avatar>
          <AvatarFallback className="custom-fallback">JD</AvatarFallback>
        </Avatar>
      );

      const fallback = screen.getByText('JD');
      expect(fallback).toHaveClass('custom-fallback');
    });
  });

  describe('Different Sizes', () => {
    it('renders with custom sizes', () => {
      const { container: small } = render(
        <Avatar className="h-8 w-8">
          <AvatarFallback>S</AvatarFallback>
        </Avatar>
      );

      const { container: large } = render(
        <Avatar className="h-16 w-16">
          <AvatarFallback>L</AvatarFallback>
        </Avatar>
      );

      expect(small.firstChild).toHaveClass('h-8', 'w-8');
      expect(large.firstChild).toHaveClass('h-16', 'w-16');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty fallback', () => {
      render(
        <Avatar>
          <AvatarFallback></AvatarFallback>
        </Avatar>
      );

      const { container } = render(
        <Avatar>
          <AvatarFallback />
        </Avatar>
      );

      expect(container).toBeInTheDocument();
    });

    it('handles long fallback text', () => {
      render(
        <Avatar>
          <AvatarFallback>ABCD</AvatarFallback>
        </Avatar>
      );

      expect(screen.getByText('ABCD')).toBeInTheDocument();
    });
  });
});
