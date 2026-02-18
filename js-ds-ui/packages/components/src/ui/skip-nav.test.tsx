import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { SkipNavLink, SkipNavContent } from './skip-nav';

describe('SkipNavLink', () => {
  describe('Rendering', () => {
    it('renders with default text "Skip to main content"', () => {
      render(<SkipNavLink />);
      expect(screen.getByText('Skip to main content')).toBeInTheDocument();
    });

    it('renders with custom children', () => {
      render(<SkipNavLink>Jump to content</SkipNavLink>);
      expect(screen.getByText('Jump to content')).toBeInTheDocument();
    });
  });

  describe('Href', () => {
    it('has correct href (default #skip-nav-content)', () => {
      render(<SkipNavLink />);
      const link = screen.getByRole('link', { name: 'Skip to main content' });
      expect(link).toHaveAttribute('href', '#skip-nav-content');
    });

    it('uses custom contentId', () => {
      render(<SkipNavLink contentId="main-content" />);
      const link = screen.getByRole('link', { name: 'Skip to main content' });
      expect(link).toHaveAttribute('href', '#main-content');
    });
  });

  describe('Styling and Ref', () => {
    it('applies className', () => {
      render(<SkipNavLink className="custom-skip" />);
      const link = screen.getByRole('link', { name: 'Skip to main content' });
      expect(link).toHaveClass('custom-skip');
    });

    it('forwards ref', () => {
      const ref = React.createRef<HTMLAnchorElement>();
      render(<SkipNavLink ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    });
  });
});

describe('SkipNavContent', () => {
  describe('Rendering', () => {
    it('renders with default id', () => {
      const { container } = render(<SkipNavContent />);
      const element = container.querySelector('#skip-nav-content');
      expect(element).toBeInTheDocument();
    });

    it('renders with custom id', () => {
      const { container } = render(<SkipNavContent id="main-content" />);
      const element = container.querySelector('#main-content');
      expect(element).toBeInTheDocument();
    });

    it('has tabIndex -1', () => {
      const { container } = render(<SkipNavContent />);
      const element = container.querySelector('#skip-nav-content');
      expect(element).toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Styling and Ref', () => {
    it('applies className', () => {
      const { container } = render(<SkipNavContent className="custom-content" />);
      const element = container.querySelector('#skip-nav-content');
      expect(element).toHaveClass('custom-content');
    });

    it('forwards ref', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<SkipNavContent ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
