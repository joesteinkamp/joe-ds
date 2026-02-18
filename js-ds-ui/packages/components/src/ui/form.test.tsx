import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Form, FormMessage, FormSubmit } from './form';

expect.extend(toHaveNoViolations);

describe('Form', () => {
  describe('Rendering', () => {
    it('renders a form element', () => {
      const { container } = render(
        <Form>
          <input name="test" />
        </Form>
      );
      expect(container.querySelector('form')).toBeInTheDocument();
    });

    it('renders form with accessible name when aria-label is provided', () => {
      render(
        <Form aria-label="Test form">
          <input name="test" />
        </Form>
      );
      expect(screen.getByRole('form', { name: 'Test form' })).toBeInTheDocument();
    });

    it('renders children inside the form', () => {
      render(
        <Form>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" />
        </Form>
      );
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
    });

    it('has noValidate attribute', () => {
      render(<Form data-testid="form" />);
      expect(screen.getByTestId('form')).toHaveAttribute('noValidate');
    });
  });

  describe('FormSubmit', () => {
    it('renders a submit button', () => {
      render(
        <Form>
          <FormSubmit>Submit</FormSubmit>
        </Form>
      );
      const button = screen.getByRole('button', { name: 'Submit' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('submits the form on click', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();

      render(
        <Form onSubmit={handleSubmit}>
          <FormSubmit>Submit</FormSubmit>
        </Form>
      );

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledTimes(1);
      });
    });

    it('shows "Submitting..." text when isSubmitting', async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      });

      render(
        <Form onSubmit={() => submitPromise}>
          <FormSubmit>Submit</FormSubmit>
        </Form>
      );

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(screen.getByText('Submitting...')).toBeInTheDocument();
      });

      // Resolve to clean up
      resolveSubmit!();

      await waitFor(() => {
        expect(screen.getByText('Submit')).toBeInTheDocument();
      });
    });

    it('is disabled while isSubmitting', async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      });

      render(
        <Form onSubmit={() => submitPromise}>
          <FormSubmit>Submit</FormSubmit>
        </Form>
      );

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeDisabled();
      });

      resolveSubmit!();

      await waitFor(() => {
        expect(screen.getByRole('button')).not.toBeDisabled();
      });
    });

    it('respects disabled prop', () => {
      render(
        <Form>
          <FormSubmit disabled>Submit</FormSubmit>
        </Form>
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('FormMessage', () => {
    it('shows error message for a field when errors exist', async () => {
      const user = userEvent.setup();

      render(
        <Form
          validate={() => ({ email: 'Email is required' })}
        >
          <input name="email" />
          <FormMessage name="email" />
          <FormSubmit>Submit</FormSubmit>
        </Form>
      );

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });

    it('is hidden when there is no error for the field', () => {
      render(
        <Form>
          <FormMessage name="email" />
        </Form>
      );
      // FormMessage returns null when no error and no children
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('renders with alert role when visible', async () => {
      const user = userEvent.setup();

      render(
        <Form validate={() => ({ name: 'Name required' })}>
          <input name="name" />
          <FormMessage name="name" />
          <FormSubmit>Submit</FormSubmit>
        </Form>
      );

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent('Name required');
      });
    });

    it('shows children when no error exists', () => {
      render(
        <Form>
          <FormMessage name="email">Helper text</FormMessage>
        </Form>
      );
      expect(screen.getByText('Helper text')).toBeInTheDocument();
    });

    it('shows error instead of children when error exists', async () => {
      const user = userEvent.setup();

      render(
        <Form validate={() => ({ email: 'Invalid email' })}>
          <input name="email" />
          <FormMessage name="email">Helper text</FormMessage>
          <FormSubmit>Submit</FormSubmit>
        </Form>
      );

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(screen.getByText('Invalid email')).toBeInTheDocument();
        expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
      });
    });
  });

  describe('Validation', () => {
    it('validate function prevents submit on errors', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();

      render(
        <Form
          onSubmit={handleSubmit}
          validate={() => ({ field: 'Error' })}
        >
          <input name="field" />
          <FormMessage name="field" />
          <FormSubmit>Submit</FormSubmit>
        </Form>
      );

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
      });

      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('validate returning null allows submit', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();

      render(
        <Form
          onSubmit={handleSubmit}
          validate={() => null}
        >
          <FormSubmit>Submit</FormSubmit>
        </Form>
      );

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledTimes(1);
      });
    });

    it('validate returning empty object allows submit', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();

      render(
        <Form
          onSubmit={handleSubmit}
          validate={() => ({})}
        >
          <FormSubmit>Submit</FormSubmit>
        </Form>
      );

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledTimes(1);
      });
    });

    it('clears errors on successful submit', async () => {
      const user = userEvent.setup();
      let shouldFail = true;

      const TestForm = () => (
        <Form
          onSubmit={() => {}}
          validate={() => {
            if (shouldFail) {
              shouldFail = false;
              return { email: 'Required' };
            }
            return null;
          }}
        >
          <input name="email" />
          <FormMessage name="email" />
          <FormSubmit>Submit</FormSubmit>
        </Form>
      );

      render(<TestForm />);

      // First submit fails validation
      await user.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(screen.getByText('Required')).toBeInTheDocument();
      });

      // Second submit passes validation - errors should clear
      await user.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(screen.queryByText('Required')).not.toBeInTheDocument();
      });
    });

    it('shows multiple field errors', async () => {
      const user = userEvent.setup();

      render(
        <Form
          validate={() => ({
            name: 'Name is required',
            email: 'Email is required',
          })}
        >
          <input name="name" />
          <FormMessage name="name" />
          <input name="email" />
          <FormMessage name="email" />
          <FormSubmit>Submit</FormSubmit>
        </Form>
      );

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });
  });

  describe('Custom className', () => {
    it('merges custom className on Form', () => {
      render(<Form className="custom-form" data-testid="form" />);
      expect(screen.getByTestId('form')).toHaveClass('custom-form');
    });

    it('merges custom className on FormSubmit', () => {
      render(
        <Form>
          <FormSubmit className="custom-submit">Submit</FormSubmit>
        </Form>
      );
      expect(screen.getByRole('button')).toHaveClass('custom-submit');
    });

    it('merges custom className on FormMessage', async () => {
      const user = userEvent.setup();

      render(
        <Form validate={() => ({ name: 'Error' })}>
          <input name="name" />
          <FormMessage name="name" className="custom-message" />
          <FormSubmit>Submit</FormSubmit>
        </Form>
      );

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveClass('custom-message');
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <Form aria-label="Test form">
          <label htmlFor="name-input">Name</label>
          <input id="name-input" name="name" />
          <FormSubmit>Submit</FormSubmit>
        </Form>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('FormMessage has role="alert"', async () => {
      const user = userEvent.setup();

      render(
        <Form validate={() => ({ test: 'Error message' })} aria-label="Test">
          <input name="test" />
          <FormMessage name="test" />
          <FormSubmit>Submit</FormSubmit>
        </Form>
      );

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveTextContent('Error message');
      });
    });
  });
});
