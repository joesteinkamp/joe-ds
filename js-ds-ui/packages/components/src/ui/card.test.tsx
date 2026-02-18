import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './card';

expect.extend(toHaveNoViolations);

describe('Card', () => {
  describe('Rendering', () => {
    it('renders a basic card with all sub-components', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Test content</p>
          </CardContent>
          <CardFooter>
            <button>Action</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('renders Card as a div element', () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card.tagName).toBe('DIV');
    });

    it('renders CardTitle as an h3 element', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByText('Title');
      expect(title.tagName).toBe('H3');
    });

    it('renders CardDescription as a p element', () => {
      render(<CardDescription>Description</CardDescription>);
      const description = screen.getByText('Description');
      expect(description.tagName).toBe('P');
    });

    it('renders CardHeader as a div element', () => {
      render(<CardHeader data-testid="header">Header</CardHeader>);
      const header = screen.getByTestId('header');
      expect(header.tagName).toBe('DIV');
    });

    it('renders CardContent as a div element', () => {
      render(<CardContent data-testid="content">Content</CardContent>);
      const content = screen.getByTestId('content');
      expect(content.tagName).toBe('DIV');
    });

    it('renders CardFooter as a div element', () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>);
      const footer = screen.getByTestId('footer');
      expect(footer.tagName).toBe('DIV');
    });
  });

  describe('Custom className', () => {
    it('merges custom className on Card', () => {
      render(<Card data-testid="card" className="custom-card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-card');
    });

    it('merges custom className on CardHeader', () => {
      render(<CardHeader data-testid="header" className="custom-header">Header</CardHeader>);
      const header = screen.getByTestId('header');
      expect(header).toHaveClass('custom-header');
    });

    it('merges custom className on CardTitle', () => {
      render(<CardTitle className="custom-title">Title</CardTitle>);
      const title = screen.getByText('Title');
      expect(title).toHaveClass('custom-title');
    });

    it('merges custom className on CardDescription', () => {
      render(<CardDescription className="custom-desc">Desc</CardDescription>);
      const desc = screen.getByText('Desc');
      expect(desc).toHaveClass('custom-desc');
    });

    it('merges custom className on CardContent', () => {
      render(<CardContent data-testid="content" className="custom-content">Content</CardContent>);
      const content = screen.getByTestId('content');
      expect(content).toHaveClass('custom-content');
    });

    it('merges custom className on CardFooter', () => {
      render(<CardFooter data-testid="footer" className="custom-footer">Footer</CardFooter>);
      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('custom-footer');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations for a complete card', async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Accessible Card</CardTitle>
            <CardDescription>This card has all sub-components</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card body content goes here.</p>
          </CardContent>
          <CardFooter>
            <button>Save</button>
          </CardFooter>
        </Card>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations for a minimal card', async () => {
      const { container } = render(
        <Card>
          <CardContent>
            <p>Simple content</p>
          </CardContent>
        </Card>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
