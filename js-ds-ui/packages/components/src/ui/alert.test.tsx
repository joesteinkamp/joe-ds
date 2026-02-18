import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Alert, AlertTitle, AlertDescription } from './alert';

expect.extend(toHaveNoViolations);

describe('Alert', () => {
  describe('Rendering', () => {
    it('renders with role="alert"', () => {
      render(<Alert>Alert content</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('renders all variants', () => {
      const variants = ['default', 'info', 'warning', 'error', 'success'] as const;

      variants.forEach((variant) => {
        const { unmount } = render(<Alert variant={variant}>{variant}</Alert>);
        expect(screen.getByRole('alert')).toBeInTheDocument();
        unmount();
      });
    });

    it('renders title and description', () => {
      render(
        <Alert>
          <AlertTitle>Warning Title</AlertTitle>
          <AlertDescription>This is a warning description.</AlertDescription>
        </Alert>
      );

      expect(screen.getByText('Warning Title')).toBeInTheDocument();
      expect(screen.getByText('This is a warning description.')).toBeInTheDocument();
    });

    it('renders AlertTitle as an h5 element', () => {
      render(<AlertTitle>Title</AlertTitle>);
      const title = screen.getByText('Title');
      expect(title.tagName).toBe('H5');
    });

    it('renders AlertDescription as a div element', () => {
      render(<AlertDescription data-testid="desc">Description</AlertDescription>);
      const desc = screen.getByTestId('desc');
      expect(desc.tagName).toBe('DIV');
    });
  });

  describe('Custom className', () => {
    it('merges custom className on Alert', () => {
      render(<Alert className="custom-alert">Content</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('custom-alert');
    });

    it('merges custom className on AlertTitle', () => {
      render(<AlertTitle className="custom-title">Title</AlertTitle>);
      const title = screen.getByText('Title');
      expect(title).toHaveClass('custom-title');
    });

    it('merges custom className on AlertDescription', () => {
      render(<AlertDescription className="custom-desc">Desc</AlertDescription>);
      const desc = screen.getByText('Desc');
      expect(desc).toHaveClass('custom-desc');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations (default)', async () => {
      const { container } = render(
        <Alert>
          <AlertTitle>Default Alert</AlertTitle>
          <AlertDescription>Default description</AlertDescription>
        </Alert>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (error)', async () => {
      const { container } = render(
        <Alert variant="error">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Something went wrong.</AlertDescription>
        </Alert>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (success)', async () => {
      const { container } = render(
        <Alert variant="success">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Operation completed.</AlertDescription>
        </Alert>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
