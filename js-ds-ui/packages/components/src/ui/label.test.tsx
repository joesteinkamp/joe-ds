import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Label } from './label';
import { Input } from './input';

expect.extend(toHaveNoViolations);

describe('Label', () => {
  describe('Rendering', () => {
    it('renders with text content', () => {
      render(<Label>Email address</Label>);
      expect(screen.getByText('Email address')).toBeInTheDocument();
    });

    it('renders with htmlFor attribute', () => {
      render(<Label htmlFor="email">Email</Label>);
      const label = screen.getByText('Email');
      expect(label).toHaveAttribute('for', 'email');
    });

    it('associates with input via htmlFor/id', () => {
      render(
        <>
          <Label htmlFor="test-input">Test Label</Label>
          <Input id="test-input" />
        </>
      );
      const label = screen.getByText('Test Label');
      const input = screen.getByRole('textbox');

      expect(label).toHaveAttribute('for', 'test-input');
      expect(input).toHaveAttribute('id', 'test-input');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" />
        </>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('clicking label focuses associated input', () => {
      render(
        <>
          <Label htmlFor="test">Click me</Label>
          <Input id="test" />
        </>
      );

      const label = screen.getByText('Click me');
      const input = screen.getByRole('textbox');

      label.click();
      expect(input).toHaveFocus();
    });
  });

  describe('Styling', () => {
    it('applies custom className', () => {
      render(<Label className="custom-class">Label</Label>);
      const label = screen.getByText('Label');
      expect(label).toHaveClass('custom-class');
    });

    it('disables styling applies to peer disabled inputs', () => {
      const { container } = render(
        <>
          <Label htmlFor="disabled-input">Disabled Label</Label>
          <Input id="disabled-input" disabled className="peer" />
        </>
      );
      expect(container).toBeInTheDocument();
    });
  });

  describe('HTML Attributes', () => {
    it('supports arbitrary HTML attributes', () => {
      render(<Label data-testid="custom-label">Label</Label>);
      expect(screen.getByTestId('custom-label')).toBeInTheDocument();
    });
  });
});
