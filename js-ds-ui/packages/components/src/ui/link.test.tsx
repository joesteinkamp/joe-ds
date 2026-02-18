import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Link } from './link';

expect.extend(toHaveNoViolations);

describe('Link', () => {
  describe('Rendering', () => {
    it('renders a basic link', () => {
      render(<Link href="/about">About</Link>);
      const link = screen.getByRole('link', { name: /about/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/about');
    });

    it('renders as an anchor element', () => {
      render(<Link href="/test">Test</Link>);
      const link = screen.getByRole('link');
      expect(link.tagName).toBe('A');
    });
  });

  describe('Internal links', () => {
    it('does not add target="_blank" for internal links', () => {
      render(<Link href="/about">About</Link>);
      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('target');
      expect(link).not.toHaveAttribute('rel');
    });

    it('does not add target="_blank" for relative paths', () => {
      render(<Link href="./page">Page</Link>);
      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('target');
    });
  });

  describe('External links', () => {
    it('auto-detects http:// links as external', () => {
      render(<Link href="http://example.com">Example</Link>);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('auto-detects https:// links as external', () => {
      render(<Link href="https://example.com">Example</Link>);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('auto-detects // protocol-relative links as external', () => {
      render(<Link href="//example.com">Example</Link>);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('shows ExternalLink icon for external links', () => {
      render(<Link href="https://example.com">Example</Link>);
      const link = screen.getByRole('link');
      const svg = link.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('does not show ExternalLink icon for internal links', () => {
      render(<Link href="/about">About</Link>);
      const link = screen.getByRole('link');
      const svg = link.querySelector('svg');
      expect(svg).not.toBeInTheDocument();
    });
  });

  describe('External prop override', () => {
    it('forces internal link to behave as external', () => {
      render(<Link href="/docs" external>Docs</Link>);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('shows ExternalLink icon when external prop is true', () => {
      render(<Link href="/docs" external>Docs</Link>);
      const link = screen.getByRole('link');
      const svg = link.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('forces external link to behave as internal when external={false}', () => {
      render(<Link href="https://example.com" external={false}>Example</Link>);
      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('target');
      expect(link).not.toHaveAttribute('rel');
    });
  });

  describe('Custom className', () => {
    it('merges custom className with default styles', () => {
      render(<Link href="/test" className="custom-link">Test</Link>);
      const link = screen.getByRole('link');
      expect(link).toHaveClass('custom-link');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations for an internal link', async () => {
      const { container } = render(<Link href="/about">About Us</Link>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations for an external link', async () => {
      const { container } = render(<Link href="https://example.com">External Site</Link>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with external prop', async () => {
      const { container } = render(<Link href="/docs" external>Documentation</Link>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
