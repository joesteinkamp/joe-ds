'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

// Form context for managing validation state
type FormContextValue = {
  errors: Record<string, string>;
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  isSubmitting: boolean;
};

const FormContext = React.createContext<FormContextValue>({
  errors: {},
  setError: () => {},
  clearError: () => {},
  clearAllErrors: () => {},
  isSubmitting: false,
});

export function useFormContext() {
  return React.useContext(FormContext);
}

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  /** Called on valid form submission */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  /** Validation function, return errors object or null */
  validate?: (formData: FormData) => Record<string, string> | null;
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, onSubmit, validate, children, ...props }, ref) => {
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const setError = React.useCallback((field: string, message: string) => {
      setErrors((prev) => ({ ...prev, [field]: message }));
    }, []);

    const clearError = React.useCallback((field: string) => {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }, []);

    const clearAllErrors = React.useCallback(() => {
      setErrors({});
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Run validation
      if (validate) {
        const formData = new FormData(e.currentTarget);
        const validationErrors = validate(formData);
        if (validationErrors && Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
      }

      clearAllErrors();
      setIsSubmitting(true);

      try {
        await onSubmit?.(e);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <FormContext.Provider value={{ errors, setError, clearError, clearAllErrors, isSubmitting }}>
        <form
          ref={ref}
          className={cn('space-y-4', className)}
          onSubmit={handleSubmit}
          noValidate
          {...props}
        >
          {children}
        </form>
      </FormContext.Provider>
    );
  }
);

Form.displayName = 'Form';

// FormMessage component that reads errors from context
export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  name: string;
}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, name, children, ...props }, ref) => {
    const { errors } = useFormContext();
    const error = errors[name];

    if (!error && !children) return null;

    return (
      <p
        ref={ref}
        role="alert"
        className={cn('text-[var(--font-size-xs)] text-[var(--color-semantic-error)]', className)}
        {...props}
      >
        {error || children}
      </p>
    );
  }
);

FormMessage.displayName = 'FormMessage';

// FormSubmit component aware of isSubmitting
export interface FormSubmitProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const FormSubmit = React.forwardRef<HTMLButtonElement, FormSubmitProps>(
  ({ className, disabled, children, ...props }, ref) => {
    const { isSubmitting } = useFormContext();

    return (
      <button
        ref={ref}
        type="submit"
        disabled={disabled || isSubmitting}
        className={cn(
          'inline-flex items-center justify-center rounded-[var(--component-button-border-radius)] bg-[var(--color-interactive-primary)] px-4 py-2 text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-white transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          className
        )}
        {...props}
      >
        {isSubmitting ? 'Submitting...' : children}
      </button>
    );
  }
);

FormSubmit.displayName = 'FormSubmit';

export { Form, FormMessage, FormSubmit };
