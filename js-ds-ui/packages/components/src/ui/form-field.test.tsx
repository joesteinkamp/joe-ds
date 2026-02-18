import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  FormField,
  FormLabel,
  FormControl,
  FormHelperText,
  FormErrorMessage,
} from './form-field';

expect.extend(toHaveNoViolations);

describe('FormField', () => {
  describe('FormLabel', () => {
    it('renders with htmlFor linked to field id', () => {
      render(
        <FormField id="email">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <input type="email" />
          </FormControl>
        </FormField>
      );
      const label = screen.getByText('Email');
      expect(label).toHaveAttribute('for', 'email');
    });

    it('renders as a label element', () => {
      render(
        <FormField id="name">
          <FormLabel>Name</FormLabel>
        </FormField>
      );
      const label = screen.getByText('Name');
      expect(label.tagName).toBe('LABEL');
    });
  });

  describe('FormControl', () => {
    it('injects id on child elements', () => {
      render(
        <FormField id="username">
          <FormControl>
            <input type="text" />
          </FormControl>
        </FormField>
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'username');
    });

    it('injects aria-describedby with helper text id', () => {
      render(
        <FormField id="email" helperText="We'll never share your email.">
          <FormControl>
            <input type="email" />
          </FormControl>
          <FormHelperText />
        </FormField>
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'email-helper');
    });

    it('injects aria-describedby with error id when error present', () => {
      render(
        <FormField id="email" error="Email is required">
          <FormControl>
            <input type="email" />
          </FormControl>
          <FormErrorMessage />
        </FormField>
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
    });

    it('injects aria-describedby with both helper and error ids', () => {
      render(
        <FormField id="email" helperText="Enter your email" error="Invalid email">
          <FormControl>
            <input type="email" />
          </FormControl>
          <FormHelperText />
          <FormErrorMessage />
        </FormField>
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'email-helper email-error');
    });
  });

  describe('FormHelperText', () => {
    it('renders with correct id ({id}-helper)', () => {
      render(
        <FormField id="name" helperText="Enter your full name">
          <FormHelperText />
        </FormField>
      );
      const helperText = screen.getByText('Enter your full name');
      expect(helperText).toHaveAttribute('id', 'name-helper');
    });

    it('renders as a p element', () => {
      render(
        <FormField id="name" helperText="Helper text">
          <FormHelperText />
        </FormField>
      );
      const helperText = screen.getByText('Helper text');
      expect(helperText.tagName).toBe('P');
    });

    it('does not render when no helperText is provided', () => {
      const { container } = render(
        <FormField id="name">
          <FormHelperText />
        </FormField>
      );
      expect(container.querySelector('#name-helper')).not.toBeInTheDocument();
    });
  });

  describe('FormErrorMessage', () => {
    it('renders with role="alert"', () => {
      render(
        <FormField id="email" error="Email is required">
          <FormErrorMessage />
        </FormField>
      );
      const errorMsg = screen.getByRole('alert');
      expect(errorMsg).toBeInTheDocument();
    });

    it('renders with correct id ({id}-error)', () => {
      render(
        <FormField id="email" error="Email is required">
          <FormErrorMessage />
        </FormField>
      );
      const errorMsg = screen.getByRole('alert');
      expect(errorMsg).toHaveAttribute('id', 'email-error');
    });

    it('renders the error message text', () => {
      render(
        <FormField id="email" error="Email is required">
          <FormErrorMessage />
        </FormField>
      );
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('does not render when no error is provided', () => {
      const { container } = render(
        <FormField id="email">
          <FormErrorMessage />
        </FormField>
      );
      expect(container.querySelector('#email-error')).not.toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('sets aria-invalid on control when error exists', () => {
      render(
        <FormField id="email" error="Invalid email">
          <FormControl>
            <input type="email" />
          </FormControl>
          <FormErrorMessage />
        </FormField>
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not set aria-invalid when no error', () => {
      render(
        <FormField id="email">
          <FormControl>
            <input type="email" />
          </FormControl>
        </FormField>
      );
      const input = screen.getByRole('textbox');
      expect(input).not.toHaveAttribute('aria-invalid');
    });

    it('shows error message and hides helper text appropriately', () => {
      render(
        <FormField id="email" error="Invalid email">
          <FormControl>
            <input type="email" />
          </FormControl>
          <FormHelperText />
          <FormErrorMessage />
        </FormField>
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('shows helper text when no error exists', () => {
      render(
        <FormField id="email" helperText="We'll never share your email.">
          <FormControl>
            <input type="email" />
          </FormControl>
          <FormHelperText />
          <FormErrorMessage />
        </FormField>
      );
      expect(screen.getByText("We'll never share your email.")).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('merges custom className on FormField', () => {
      render(
        <FormField id="name" className="custom-field" data-testid="field">
          <FormLabel>Name</FormLabel>
        </FormField>
      );
      const field = screen.getByTestId('field');
      expect(field).toHaveClass('custom-field');
    });

    it('merges custom className on FormLabel', () => {
      render(
        <FormField id="name">
          <FormLabel className="custom-label">Name</FormLabel>
        </FormField>
      );
      const label = screen.getByText('Name');
      expect(label).toHaveClass('custom-label');
    });

    it('merges custom className on FormHelperText', () => {
      render(
        <FormField id="name" helperText="Help text">
          <FormHelperText className="custom-helper" />
        </FormField>
      );
      const helper = screen.getByText('Help text');
      expect(helper).toHaveClass('custom-helper');
    });

    it('merges custom className on FormErrorMessage', () => {
      render(
        <FormField id="name" error="Required">
          <FormErrorMessage className="custom-error" />
        </FormField>
      );
      const error = screen.getByRole('alert');
      expect(error).toHaveClass('custom-error');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations for field with error', async () => {
      const { container } = render(
        <FormField id="email" error="Email is required">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <input type="email" />
          </FormControl>
          <FormErrorMessage />
        </FormField>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations for field without error', async () => {
      const { container } = render(
        <FormField id="email" helperText="We'll never share your email.">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <input type="email" />
          </FormControl>
          <FormHelperText />
        </FormField>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations for complete form field', async () => {
      const { container } = render(
        <FormField id="name" helperText="Your full name" error="Name is required">
          <FormLabel>Full Name</FormLabel>
          <FormControl>
            <input type="text" />
          </FormControl>
          <FormHelperText />
          <FormErrorMessage />
        </FormField>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
