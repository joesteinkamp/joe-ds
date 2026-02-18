'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

// Context for field state
const FormFieldContext = React.createContext<{
  id: string;
  error?: string;
  helperText?: string;
}>({ id: '' });

export interface FormFieldProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Unique field ID for aria-describedby linkage */
  id: string;
  /** Error message to display */
  error?: string;
  /** Helper text displayed below the field */
  helperText?: string;
}

export interface FormLabelProps
  extends React.ComponentPropsWithoutRef<'label'> {}

export interface FormControlProps
  extends React.ComponentPropsWithoutRef<'div'> {}

export interface FormHelperTextProps
  extends React.ComponentPropsWithoutRef<'p'> {}

export interface FormErrorMessageProps
  extends React.ComponentPropsWithoutRef<'p'> {}

/**
 * FormField component for composing form inputs with labels and messages
 *
 * Provides context for aria-describedby linkage between label, input,
 * helper text, and error message
 *
 * @example
 * ```tsx
 * <FormField id="email" error={errors.email} helperText="We'll never share your email.">
 *   <FormLabel>Email</FormLabel>
 *   <FormControl>
 *     <Input type="email" placeholder="you@example.com" />
 *   </FormControl>
 *   <FormHelperText />
 *   <FormErrorMessage />
 * </FormField>
 * ```
 */
const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, id, error, helperText, children, ...props }, ref) => (
    <FormFieldContext.Provider value={{ id, error, helperText }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {children}
      </div>
    </FormFieldContext.Provider>
  )
);

FormField.displayName = 'FormField';

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, ...props }, ref) => {
    const { id, error } = React.useContext(FormFieldContext);
    return (
      <label
        ref={ref}
        htmlFor={id}
        className={cn(
          '[font-size:var(--component-form-field-label-font-size)] [font-weight:var(--component-form-field-label-font-weight)] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          error && 'text-[var(--color-text-error)]',
          className
        )}
        {...props}
      />
    );
  }
);

FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ className, children, ...props }, ref) => {
    const { id, error, helperText } = React.useContext(FormFieldContext);
    const describedBy =
      [
        helperText ? `${id}-helper` : undefined,
        error ? `${id}-error` : undefined,
      ]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <div ref={ref} className={cn(className)} {...props}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              id,
              'aria-describedby': describedBy,
              'aria-invalid': error ? true : undefined,
            });
          }
          return child;
        })}
      </div>
    );
  }
);

FormControl.displayName = 'FormControl';

const FormHelperText = React.forwardRef<
  HTMLParagraphElement,
  FormHelperTextProps
>(({ className, ...props }, ref) => {
  const { id, helperText } = React.useContext(FormFieldContext);
  if (!helperText) return null;
  return (
    <p
      ref={ref}
      id={`${id}-helper`}
      className={cn(
        '[font-size:var(--component-form-field-helper-font-size)] text-[var(--color-text-tertiary)]',
        className
      )}
      {...props}
    >
      {helperText}
    </p>
  );
});

FormHelperText.displayName = 'FormHelperText';

const FormErrorMessage = React.forwardRef<
  HTMLParagraphElement,
  FormErrorMessageProps
>(({ className, ...props }, ref) => {
  const { id, error } = React.useContext(FormFieldContext);
  if (!error) return null;
  return (
    <p
      ref={ref}
      id={`${id}-error`}
      role="alert"
      className={cn(
        '[font-size:var(--component-form-field-error-font-size)] text-[var(--color-text-error)]',
        className
      )}
      {...props}
    >
      {error}
    </p>
  );
});

FormErrorMessage.displayName = 'FormErrorMessage';

export {
  FormField,
  FormLabel,
  FormControl,
  FormHelperText,
  FormErrorMessage,
};
