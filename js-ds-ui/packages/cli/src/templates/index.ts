/**
 * Component templates
 * These are the actual source files that get copied to user projects
 */

export function getComponentTemplate(name: string, typescript: boolean): string {
  const template = getTemplateContent(name, typescript);

  // Utils is a pure utility function, doesn't need 'use client'
  if (name === 'utils') {
    return template;
  }

  // All components and hooks need 'use client' for React 19 / RSC compatibility
  return `'use client';\n\n${template}`;
}

function getTemplateContent(name: string, typescript: boolean): string {
  switch (name) {
    // Utilities
    case 'utils':
      return getUtilsTemplate(typescript);
    case 'use-theme':
      return getUseThemeTemplate(typescript);
    case 'use-density':
      return getUseDensityTemplate(typescript);

    // Form Components
    case 'label':
      return getLabelTemplate(typescript);
    case 'checkbox':
      return getCheckboxTemplate(typescript);
    case 'radio-group':
      return getRadioGroupTemplate(typescript);
    case 'switch':
      return getSwitchTemplate(typescript);
    case 'select':
      return getSelectTemplate(typescript);
    case 'input':
      return getInputTemplate(typescript);
    case 'textarea':
      return getTextareaTemplate(typescript);
    case 'button':
      return getButtonTemplate(typescript);
    case 'slider':
      return getSliderTemplate(typescript);
    case 'form-field':
      return getFormFieldTemplate(typescript);
    case 'form':
      return getFormTemplate(typescript);
    case 'link':
      return getLinkTemplate(typescript);

    // Layout Primitives
    case 'stack':
      return getStackTemplate(typescript);
    case 'container':
      return getContainerTemplate(typescript);
    case 'heading':
      return getHeadingTemplate(typescript);
    case 'text':
      return getTextTemplate(typescript);

    // Typography & Media Components
    case 'code':
      return getCodeTemplate(typescript);
    case 'blockquote':
      return getBlockquoteTemplate(typescript);
    case 'icon':
      return getIconTemplate(typescript);
    case 'image':
      return getImageTemplate(typescript);

    // Overlay Components
    case 'dialog':
      return getDialogTemplate(typescript);
    case 'popover':
      return getPopoverTemplate(typescript);
    case 'tooltip':
      return getTooltipTemplate(typescript);
    case 'dropdown-menu':
      return getDropdownMenuTemplate(typescript);
    case 'context-menu':
      return getContextMenuTemplate(typescript);
    case 'hover-card':
      return getHoverCardTemplate(typescript);
    case 'sheet':
      return getSheetTemplate(typescript);
    case 'toast':
      return getToastTemplate(typescript);
    case 'command':
      return getCommandTemplate(typescript);
    case 'combobox':
      return getComboboxTemplate(typescript);

    // Display Components
    case 'tabs':
      return getTabsTemplate(typescript);
    case 'avatar':
      return getAvatarTemplate(typescript);
    case 'separator':
      return getSeparatorTemplate(typescript);
    case 'progress':
      return getProgressTemplate(typescript);
    case 'accordion':
      return getAccordionTemplate(typescript);
    case 'collapsible':
      return getCollapsibleTemplate(typescript);
    case 'scroll-area':
      return getScrollAreaTemplate(typescript);
    case 'aspect-ratio':
      return getAspectRatioTemplate(typescript);
    case 'visually-hidden':
      return getVisuallyHiddenTemplate(typescript);
    case 'card':
      return getCardTemplate(typescript);
    case 'badge':
      return getBadgeTemplate(typescript);
    case 'alert':
      return getAlertTemplate(typescript);
    case 'skeleton':
      return getSkeletonTemplate(typescript);
    case 'spinner':
      return getSpinnerTemplate(typescript);
    case 'table':
      return getTableTemplate(typescript);
    case 'calendar':
      return getCalendarTemplate(typescript);
    case 'date-picker':
      return getDatePickerTemplate(typescript);
    case 'data-table':
      return getDataTableTemplate(typescript);

    // Navigation Components
    case 'navigation-menu':
      return getNavigationMenuTemplate(typescript);
    case 'menubar':
      return getMenubarTemplate(typescript);
    case 'breadcrumb':
      return getBreadcrumbTemplate(typescript);
    case 'pagination':
      return getPaginationTemplate(typescript);

    // Grouping Components
    case 'toggle-group':
      return getToggleGroupTemplate(typescript);
    case 'toolbar':
      return getToolbarTemplate(typescript);

    // Composition Components
    case 'search-bar':
      return getSearchBarTemplate(typescript);
    case 'confirm-dialog':
      return getConfirmDialogTemplate(typescript);
    case 'user-menu':
      return getUserMenuTemplate(typescript);

    // Advanced Input Components
    case 'date-range-picker':
      return getDateRangePickerTemplate(typescript);
    case 'time-picker':
      return getTimePickerTemplate(typescript);
    case 'color-picker':
      return getColorPickerTemplate(typescript);
    case 'file-upload':
      return getFileUploadTemplate(typescript);

    // Accessibility Components
    case 'focus-trap':
      return getFocusTrapTemplate(typescript);
    case 'skip-nav':
      return getSkipNavTemplate(typescript);
    case 'announcement':
      return getAnnouncementTemplate(typescript);

    default:
      throw new Error(`No template found for component: ${name}`);
  }
}

// Utility Templates
function getUtilsTemplate(typescript: boolean): string {
  return `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs${typescript ? ': ClassValue[]' : ''}) {
  return twMerge(clsx(inputs));
}
`;
}

function getUseThemeTemplate(typescript: boolean): string {
  if (typescript) {
    return `import { useCallback, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'high-contrast';

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>('light');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('js-ds-ui-theme');
      if (stored === 'light' || stored === 'dark' || stored === 'high-contrast') {
        setThemeState(stored);
        return;
      }
    } catch {}
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('js-ds-ui-theme', theme); } catch {}
  }, [theme]);

  const setTheme = useCallback((t: ThemeMode) => setThemeState(t), []);

  return { theme, setTheme };
}
`;
  } else {
    return `import { useCallback, useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setThemeState] = useState('light');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('js-ds-ui-theme');
      if (stored === 'light' || stored === 'dark' || stored === 'high-contrast') {
        setThemeState(stored);
        return;
      }
    } catch {}
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('js-ds-ui-theme', theme); } catch {}
  }, [theme]);

  const setTheme = useCallback((t) => setThemeState(t), []);

  return { theme, setTheme };
}
`;
  }
}

function getUseDensityTemplate(typescript: boolean): string {
  if (typescript) {
    return `import { useCallback, useEffect, useState } from 'react';

export type DensityLevel = 'compact' | 'default' | 'comfortable';

export function useDensity() {
  const [density, setDensityState] = useState<DensityLevel>('default');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('js-ds-ui-density');
      if (stored === 'compact' || stored === 'default' || stored === 'comfortable') {
        setDensityState(stored);
      }
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-density', density);
    try { localStorage.setItem('js-ds-ui-density', density); } catch {}
  }, [density]);

  const setDensity = useCallback((d: DensityLevel) => setDensityState(d), []);

  return { density, setDensity };
}
`;
  } else {
    return `import { useCallback, useEffect, useState } from 'react';

export function useDensity() {
  const [density, setDensityState] = useState('default');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('js-ds-ui-density');
      if (stored === 'compact' || stored === 'default' || stored === 'comfortable') {
        setDensityState(stored);
      }
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-density', density);
    try { localStorage.setItem('js-ds-ui-density', density); } catch {}
  }, [density]);

  const setDensity = useCallback((d) => setDensityState(d), []);

  return { density, setDensity };
}
`;
  }
}

// Form Component Templates
function getLabelTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-[var(--font-size-sm)] font-[var(--font-weight-medium)] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
));

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
`;
  } else {
    return `import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-[var(--font-size-sm)] font-[var(--font-weight-medium)] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
));

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
`;
  }
}

function getCheckboxTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-[1.25rem] w-[1.25rem] shrink-0 rounded-[0.25rem] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--color-interactive-primary)] data-[state=checked]:text-white data-[state=checked]:border-[var(--color-interactive-primary)]',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <Check className="h-4 w-4" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
`;
  } else {
    return `import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-[1.25rem] w-[1.25rem] shrink-0 rounded-[0.25rem] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--color-interactive-primary)] data-[state=checked]:text-white data-[state=checked]:border-[var(--color-interactive-primary)]',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <Check className="h-4 w-4" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
`;
  }
}

function getRadioGroupTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-[var(--space-component-gap-sm)]', className)}
      {...props}
      ref={ref}
    />
  );
});

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square h-[1.25rem] w-[1.25rem] rounded-full border border-[var(--color-border-default)] bg-[var(--color-background-primary)] ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-[var(--color-interactive-primary)]',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-[var(--color-interactive-primary)] text-[var(--color-interactive-primary)]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
`;
  } else {
    return `import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-[var(--space-component-gap-sm)]', className)}
      {...props}
      ref={ref}
    />
  );
});

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square h-[1.25rem] w-[1.25rem] rounded-full border border-[var(--color-border-default)] bg-[var(--color-background-primary)] ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-[var(--color-interactive-primary)]',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-[var(--color-interactive-primary)] text-[var(--color-interactive-primary)]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
`;
  }
}

function getSwitchTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--color-interactive-primary)] data-[state=unchecked]:bg-[var(--color-border-default)]',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-[var(--color-background-primary)] shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
      )}
    />
  </SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
`;
  } else {
    return `import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--color-interactive-primary)] data-[state=unchecked]:bg-[var(--color-border-default)]',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-[var(--color-background-primary)] shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
      )}
    />
  </SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
`;
  }
}

function getSelectTemplate(typescript: boolean): string {
  // Due to length, I'll provide a simplified version that can be enhanced
  const tsImports = typescript
    ? `import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {}`
    : `import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;`;

  return `${tsImports}

const SelectTrigger = React.forwardRef${typescript ? '<\n  React.ElementRef<typeof SelectPrimitive.Trigger>,\n  SelectTriggerProps\n>' : ''}(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-[var(--sizing-component-height-md)] w-full items-center justify-between rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] px-[var(--space-component-padding-md)] py-[var(--space-component-padding-sm)] text-[var(--font-size-sm)] ring-offset-background placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef${typescript ? '<\n  React.ElementRef<typeof SelectPrimitive.Content>,\n  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>\n>' : ''}(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] text-[var(--color-text-primary)] shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className={cn('p-1')}>
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));

SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef${typescript ? '<\n  React.ElementRef<typeof SelectPrimitive.Item>,\n  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>\n>' : ''}(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-[var(--color-background-secondary)] focus:text-[var(--color-text-primary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));

SelectItem.displayName = SelectPrimitive.Item.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
};
`;
}

function getInputTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-[var(--sizing-component-height-md)] w-full rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] px-[var(--space-component-padding-md)] py-[var(--space-component-padding-sm)] text-[var(--font-size-sm)] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--color-text-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
`;
  } else {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-[var(--sizing-component-height-md)] w-full rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] px-[var(--space-component-padding-md)] py-[var(--space-component-padding-sm)] text-[var(--font-size-sm)] placeholder:text-[var(--color-text-tertiary)] focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
`;
  }
}

function getButtonTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-[var(--component-button-gap)] rounded-[var(--component-button-border-radius)] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-interactive-primary)] text-white hover:bg-[var(--color-interactive-primary-hover)] active:bg-[var(--color-interactive-primary-active)]',
        secondary: 'bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-background-tertiary)] border border-[var(--color-border-default)]',
        outline: 'border border-[var(--color-border-default)] bg-transparent hover:bg-[var(--color-background-secondary)]',
        ghost: 'hover:bg-[var(--color-background-secondary)]',
        danger: 'bg-[var(--color-semantic-error)] text-white hover:opacity-90',
      },
      size: {
        sm: 'h-[var(--sizing-component-height-sm)] px-[var(--space-component-padding-md)] text-[var(--font-size-xs)]',
        md: 'h-[var(--sizing-component-height-md)] px-[var(--component-button-padding-x)] py-[var(--component-button-padding-y)] text-[var(--component-button-font-size)]',
        lg: 'h-[var(--sizing-component-height-lg)] px-[var(--space-component-padding-xl)] text-[var(--font-size-base)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
`;
  } else {
    return `import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-[var(--component-button-gap)] rounded-[var(--component-button-border-radius)] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-interactive-primary)] text-white hover:bg-[var(--color-interactive-primary-hover)]',
        secondary: 'bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-background-tertiary)]',
        outline: 'border border-[var(--color-border-default)] bg-transparent hover:bg-[var(--color-background-secondary)]',
        ghost: 'hover:bg-[var(--color-background-secondary)]',
      },
      size: {
        sm: 'h-[var(--sizing-component-height-sm)] px-[var(--space-component-padding-md)]',
        md: 'h-[var(--sizing-component-height-md)] px-[var(--component-button-padding-x)]',
        lg: 'h-[var(--sizing-component-height-lg)] px-[var(--space-component-padding-xl)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});

Button.displayName = 'Button';

export { Button, buttonVariants };
`;
  }
}

function getSliderTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-[var(--color-background-secondary)]">
      <SliderPrimitive.Range className="absolute h-full bg-[var(--color-interactive-primary)]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-[var(--color-interactive-primary)] bg-[var(--color-background-primary)] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
`;
  } else {
    return `import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-[var(--color-background-secondary)]">
      <SliderPrimitive.Range className="absolute h-full bg-[var(--color-interactive-primary)]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-[var(--color-interactive-primary)] bg-[var(--color-background-primary)] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
`;
  }
}

// Due to length limits, I'll create simplified versions of the remaining templates
// In a production environment, these would be fully detailed like the above

function getDialogTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

export interface DialogOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-[var(--space-component-gap-lg)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-[var(--space-component-padding-xl)] shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-[var(--color-background-secondary)] data-[state=open]:text-[var(--color-text-secondary)]">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));

DialogContent.displayName = DialogPrimitive.Content.displayName;

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
  <div
    className={cn(
      'flex flex-col space-y-[var(--spacing-2)] text-center sm:text-left',
      className
    )}
    {...props}
  />
);

DialogHeader.displayName = 'DialogHeader';

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogFooter = ({ className, ...props }: DialogFooterProps) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-[var(--space-component-gap-sm)]',
      className
    )}
    {...props}
  />
);

DialogFooter.displayName = 'DialogFooter';

export interface DialogTitleProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {}

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-[var(--font-size-lg)] font-[var(--font-weight-semibold)] leading-none tracking-tight',
      className
    )}
    {...props}
  />
));

DialogTitle.displayName = DialogPrimitive.Title.displayName;

export interface DialogDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {}

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-[var(--font-size-sm)] text-[var(--color-text-secondary)]', className)}
    {...props}
  />
));

DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
`;
  } else {
    return `import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-[var(--space-component-gap-lg)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-[var(--space-component-padding-xl)] shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-[var(--color-background-secondary)] data-[state=open]:text-[var(--color-text-secondary)]">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));

DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      'flex flex-col space-y-[var(--spacing-2)] text-center sm:text-left',
      className
    )}
    {...props}
  />
);

DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-[var(--space-component-gap-sm)]',
      className
    )}
    {...props}
  />
);

DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-[var(--font-size-lg)] font-[var(--font-weight-semibold)] leading-none tracking-tight',
      className
    )}
    {...props}
  />
));

DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-[var(--font-size-sm)] text-[var(--color-text-secondary)]', className)}
    {...props}
  />
));

DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
`;
  }
}

function getPopoverTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-72 rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-[var(--space-component-padding-lg)] text-[var(--color-text-primary)] shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
`;
  } else {
    return `import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-72 rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-[var(--space-component-padding-lg)] text-[var(--color-text-primary)] shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
`;
  }
}

function getTooltipTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] px-[var(--space-component-padding-md)] py-[var(--space-component-padding-sm)] text-[var(--font-size-sm)] text-[var(--color-text-primary)] shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
`;
  } else {
    return `import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] px-[var(--space-component-padding-md)] py-[var(--space-component-padding-sm)] text-[var(--font-size-sm)] text-[var(--color-text-primary)] shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
`;
  }
}

function getDropdownMenuTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export interface DropdownMenuSubTriggerProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> {
  inset?: boolean;
}

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  DropdownMenuSubTriggerProps
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-[var(--color-background-secondary)] data-[state=open]:bg-[var(--color-background-secondary)]',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));

DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

export interface DropdownMenuSubContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent> {}

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  DropdownMenuSubContentProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-1 text-[var(--color-text-primary)] shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));

DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

export interface DropdownMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {}

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-1 text-[var(--color-text-primary)] shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));

DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

export interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  inset?: boolean;
}

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-[var(--color-background-secondary)] focus:text-[var(--color-text-primary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));

DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

export interface DropdownMenuCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> {}

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  DropdownMenuCheckboxItemProps
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-[var(--color-background-secondary)] focus:text-[var(--color-text-primary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));

DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

export interface DropdownMenuRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> {}

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  DropdownMenuRadioItemProps
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-[var(--color-background-secondary)] focus:text-[var(--color-text-primary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));

DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

export interface DropdownMenuLabelProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> {
  inset?: boolean;
}

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  DropdownMenuLabelProps
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));

DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

export interface DropdownMenuSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator> {}

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-[var(--color-border-default)]', className)}
    {...props}
  />
));

DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

export interface DropdownMenuShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {}

const DropdownMenuShortcut = ({ className, ...props }: DropdownMenuShortcutProps) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest opacity-60', className)}
      {...props}
    />
  );
};

DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
`;
  } else {
    return `import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-[var(--color-background-secondary)] data-[state=open]:bg-[var(--color-background-secondary)]',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));

DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-1 text-[var(--color-text-primary)] shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));

DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-1 text-[var(--color-text-primary)] shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));

DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-[var(--color-background-secondary)] focus:text-[var(--color-text-primary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));

DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-[var(--color-background-secondary)] focus:text-[var(--color-text-primary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));

DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-[var(--color-background-secondary)] focus:text-[var(--color-text-primary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));

DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));

DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-[var(--color-border-default)]', className)}
    {...props}
  />
));

DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest opacity-60', className)}
      {...props}
    />
  );
};

DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
`;
  }
}

function getContextMenuTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuGroup = ContextMenuPrimitive.Group;
const ContextMenuPortal = ContextMenuPrimitive.Portal;
const ContextMenuSub = ContextMenuPrimitive.Sub;
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

export interface ContextMenuSubTriggerProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> {
  inset?: boolean;
}

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  ContextMenuSubTriggerProps
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-[var(--color-background-secondary)] data-[state=open]:bg-[var(--color-background-secondary)]',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
));

ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

export interface ContextMenuSubContentProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent> {}

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  ContextMenuSubContentProps
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-1 text-[var(--color-text-primary)] shadow-md animate-in slide-in-from-left-1',
      className
    )}
    {...props}
  />
));

ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

export interface ContextMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content> {}

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  ContextMenuContentProps
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-1 text-[var(--color-text-primary)] shadow-md animate-in fade-in-80',
        className
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));

ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

export interface ContextMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> {
  inset?: boolean;
}

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  ContextMenuItemProps
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-[var(--color-background-secondary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));

ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

export interface ContextMenuCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem> {}

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  ContextMenuCheckboxItemProps
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-[var(--color-background-secondary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
));

ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName;

export interface ContextMenuRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem> {}

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  ContextMenuRadioItemProps
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-[var(--color-background-secondary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
));

ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

export interface ContextMenuLabelProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> {
  inset?: boolean;
}

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  ContextMenuLabelProps
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold text-[var(--color-text-primary)]',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));

ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

export interface ContextMenuSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator> {}

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  ContextMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-[var(--color-border-default)]', className)}
    {...props}
  />
));

ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

export interface ContextMenuShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {}

const ContextMenuShortcut = ({ className, ...props }: ContextMenuShortcutProps) => {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-[var(--color-text-tertiary)]',
        className
      )}
      {...props}
    />
  );
};

ContextMenuShortcut.displayName = 'ContextMenuShortcut';

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
`;
  } else {
    return `import * as React from 'react';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuGroup = ContextMenuPrimitive.Group;
const ContextMenuPortal = ContextMenuPrimitive.Portal;
const ContextMenuSub = ContextMenuPrimitive.Sub;
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

const ContextMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-[var(--color-background-secondary)] data-[state=open]:bg-[var(--color-background-secondary)]',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
));

ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

const ContextMenuSubContent = React.forwardRef(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-1 text-[var(--color-text-primary)] shadow-md animate-in slide-in-from-left-1',
      className
    )}
    {...props}
  />
));

ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

const ContextMenuContent = React.forwardRef(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-1 text-[var(--color-text-primary)] shadow-md animate-in fade-in-80',
        className
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));

ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

const ContextMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-[var(--color-background-secondary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));

ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

const ContextMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-[var(--color-background-secondary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
));

ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName;

const ContextMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-[var(--color-background-secondary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
));

ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

const ContextMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold text-[var(--color-text-primary)]',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));

ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

const ContextMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-[var(--color-border-default)]', className)}
    {...props}
  />
));

ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

const ContextMenuShortcut = ({ className, ...props }) => {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-[var(--color-text-tertiary)]',
        className
      )}
      {...props}
    />
  );
};

ContextMenuShortcut.displayName = 'ContextMenuShortcut';

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
`;
  }
}

function getHoverCardTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { cn } from '@/lib/utils';

const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;

export interface HoverCardContentProps
  extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content> {}

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  HoverCardContentProps
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      'z-50 w-64 rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-4 text-[var(--color-text-primary)] shadow-md outline-none animate-in zoom-in-90',
      className
    )}
    {...props}
  />
));

HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };
`;
  } else {
    return `import * as React from 'react';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { cn } from '@/lib/utils';

const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      'z-50 w-64 rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-4 text-[var(--color-text-primary)] shadow-md outline-none animate-in zoom-in-90',
      className
    )}
    {...props}
  />
));

HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };
`;
  }
}

function getSheetTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

export interface SheetOverlayProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay> {}

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  SheetOverlayProps
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
    ref={ref}
  />
));

SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  'fixed z-50 gap-4 bg-[var(--color-background-primary)] p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b border-[var(--color-border-default)] data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t border-[var(--color-border-default)] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r border-[var(--color-border-default)] data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-3/4 border-l border-[var(--color-border-default)] data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
);

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = 'right', className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-[var(--color-background-secondary)]">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
));

SheetContent.displayName = SheetPrimitive.Content.displayName;

export interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const SheetHeader = ({ className, ...props }: SheetHeaderProps) => (
  <div
    className={cn(
      'flex flex-col space-y-2 text-center sm:text-left',
      className
    )}
    {...props}
  />
);

SheetHeader.displayName = 'SheetHeader';

export interface SheetFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const SheetFooter = ({ className, ...props }: SheetFooterProps) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
);

SheetFooter.displayName = 'SheetFooter';

export interface SheetTitleProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title> {}

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  SheetTitleProps
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold text-[var(--color-text-primary)]', className)}
    {...props}
  />
));

SheetTitle.displayName = SheetPrimitive.Title.displayName;

export interface SheetDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description> {}

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  SheetDescriptionProps
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('text-sm text-[var(--color-text-secondary)]', className)}
    {...props}
  />
));

SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
`;
  } else {
    return `import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
    ref={ref}
  />
));

SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  'fixed z-50 gap-4 bg-[var(--color-background-primary)] p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b border-[var(--color-border-default)] data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t border-[var(--color-border-default)] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r border-[var(--color-border-default)] data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-3/4 border-l border-[var(--color-border-default)] data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
);

const SheetContent = React.forwardRef(({ side = 'right', className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-[var(--color-background-secondary)]">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
));

SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }) => (
  <div
    className={cn(
      'flex flex-col space-y-2 text-center sm:text-left',
      className
    )}
    {...props}
  />
);

SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({ className, ...props }) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
);

SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold text-[var(--color-text-primary)]', className)}
    {...props}
  />
));

SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('text-sm text-[var(--color-text-secondary)]', className)}
    {...props}
  />
));

SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
`;
  }
}

function getToastTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const ToastProvider = ToastPrimitives.Provider;

export interface ToastViewportProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport> {}

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  ToastViewportProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className
    )}
    {...props}
  />
));

ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] p-[var(--space-component-padding-lg)] shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-[var(--color-background-primary)] text-[var(--color-text-primary)]',
        success:
          'success group border-[var(--color-semantic-success)] bg-[var(--color-semantic-success-bg)] text-[var(--color-semantic-success)]',
        error:
          'error group border-[var(--color-semantic-error)] bg-[var(--color-semantic-error-bg)] text-[var(--color-semantic-error)]',
        warning:
          'warning group border-[var(--color-semantic-warning)] bg-[var(--color-semantic-warning-bg)] text-[var(--color-semantic-warning)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>,
    VariantProps<typeof toastVariants> {}

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});

Toast.displayName = ToastPrimitives.Root.displayName;

export interface ToastActionProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action> {}

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  ToastActionProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-[var(--color-border-default)] bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-[var(--color-background-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  />
));

ToastAction.displayName = ToastPrimitives.Action.displayName;

export interface ToastCloseProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close> {}

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  ToastCloseProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 text-[var(--color-text-secondary)] opacity-0 transition-opacity hover:text-[var(--color-text-primary)] focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));

ToastClose.displayName = ToastPrimitives.Close.displayName;

export interface ToastTitleProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title> {}

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  ToastTitleProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
));

ToastTitle.displayName = ToastPrimitives.Title.displayName;

export interface ToastDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description> {}

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  ToastDescriptionProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
));

ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
`;
  } else {
    return `import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className
    )}
    {...props}
  />
));

ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] p-[var(--space-component-padding-lg)] shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-[var(--color-background-primary)] text-[var(--color-text-primary)]',
        success:
          'success group border-[var(--color-semantic-success)] bg-[var(--color-semantic-success-bg)] text-[var(--color-semantic-success)]',
        error:
          'error group border-[var(--color-semantic-error)] bg-[var(--color-semantic-error-bg)] text-[var(--color-semantic-error)]',
        warning:
          'warning group border-[var(--color-semantic-warning)] bg-[var(--color-semantic-warning-bg)] text-[var(--color-semantic-warning)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});

Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-[var(--color-border-default)] bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-[var(--color-background-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  />
));

ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 text-[var(--color-text-secondary)] opacity-0 transition-opacity hover:text-[var(--color-text-primary)] focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));

ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
));

ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
));

ToastDescription.displayName = ToastPrimitives.Description.displayName;

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
`;
  }
}

function getTabsTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-[var(--sizing-component-height-md)] items-center justify-center rounded-[var(--component-button-border-radius)] bg-[var(--color-background-secondary)] p-[var(--space-component-padding-xs)] text-[var(--color-text-secondary)]',
      className
    )}
    {...props}
  />
));

TabsList.displayName = TabsPrimitive.List.displayName;

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-[0.25rem] px-[var(--space-component-padding-md)] py-[var(--space-component-padding-sm)] text-[var(--font-size-sm)] font-[var(--font-weight-medium)] ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-[var(--color-background-primary)] data-[state=active]:text-[var(--color-text-primary)] data-[state=active]:shadow-sm',
      className
    )}
    {...props}
  />
));

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export interface TabsContentProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {}

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-[var(--spacing-2)] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));

TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
`;
  } else {
    return `import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-[var(--sizing-component-height-md)] items-center justify-center rounded-[var(--component-button-border-radius)] bg-[var(--color-background-secondary)] p-[var(--space-component-padding-xs)] text-[var(--color-text-secondary)]',
      className
    )}
    {...props}
  />
));

TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-[0.25rem] px-[var(--space-component-padding-md)] py-[var(--space-component-padding-sm)] text-[var(--font-size-sm)] font-[var(--font-weight-medium)] ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-[var(--color-background-primary)] data-[state=active]:text-[var(--color-text-primary)] data-[state=active]:shadow-sm',
      className
    )}
    {...props}
  />
));

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-[var(--spacing-2)] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));

TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
`;
  }
}

function getAvatarTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className
    )}
    {...props}
  />
));

Avatar.displayName = AvatarPrimitive.Root.displayName;

export interface AvatarImageProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> {}

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
));

AvatarImage.displayName = AvatarPrimitive.Image.displayName;

export interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {}

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-[var(--color-background-secondary)] text-[var(--font-size-sm)] font-[var(--font-weight-medium)]',
      className
    )}
    {...props}
  />
));

AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
`;
  } else {
    return `import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className
    )}
    {...props}
  />
));

Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
));

AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-[var(--color-background-secondary)] text-[var(--font-size-sm)] font-[var(--font-weight-medium)]',
      className
    )}
    {...props}
  />
));

AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
`;
  }
}

function getSeparatorTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '@/lib/utils';

export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-[var(--color-border-default)]',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      {...props}
    />
  )
);

Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
`;
  } else {
    return `import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '@/lib/utils';

const Separator = React.forwardRef(
  ({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-[var(--color-border-default)]',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      {...props}
    />
  )
);

Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
`;
  }
}

function getProgressTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      'relative h-4 w-full overflow-hidden rounded-full bg-[var(--color-background-secondary)]',
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-[var(--color-interactive-primary)] transition-all"
      style={{ transform: \`translateX(-\${100 - (value || 0)}%)\` }}
    />
  </ProgressPrimitive.Root>
));

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
`;
  } else {
    return `import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      'relative h-4 w-full overflow-hidden rounded-full bg-[var(--color-background-secondary)]',
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-[var(--color-interactive-primary)] transition-all"
      style={{ transform: \`translateX(-\${100 - (value || 0)}%)\` }}
    />
  </ProgressPrimitive.Root>
));

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
`;
  }
}

function getAccordionTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Accordion = AccordionPrimitive.Root;

export interface AccordionItemProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {}

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b border-[var(--color-border-default)]', className)}
    {...props}
  />
));

AccordionItem.displayName = 'AccordionItem';

export interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-[var(--space-component-padding-lg)] font-[var(--font-weight-medium)] transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

export interface AccordionContentProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> {}

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
`;
  } else {
    return `import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b border-[var(--color-border-default)]', className)}
    {...props}
  />
));

AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-[var(--space-component-padding-lg)] font-[var(--font-weight-medium)] transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
`;
  }
}

function getCollapsibleTemplate(_typescript: boolean): string {
  return `import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
`;
}

function getScrollAreaTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from '@/lib/utils';

export interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn('relative overflow-hidden', className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));

ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

export interface ScrollBarProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> {}

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none select-none transition-colors',
      orientation === 'vertical' &&
        'h-full w-2.5 border-l border-l-transparent p-[1px]',
      orientation === 'horizontal' &&
        'h-2.5 flex-col border-t border-t-transparent p-[1px]',
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-[var(--color-border-default)]" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));

ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
`;
  } else {
    return `import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from '@/lib/utils';

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn('relative overflow-hidden', className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));

ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none select-none transition-colors',
      orientation === 'vertical' &&
        'h-full w-2.5 border-l border-l-transparent p-[1px]',
      orientation === 'horizontal' &&
        'h-2.5 flex-col border-t border-t-transparent p-[1px]',
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-[var(--color-border-default)]" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));

ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
`;
  }
}

function getAspectRatioTemplate(_typescript: boolean): string {
  return `import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';

const AspectRatio = AspectRatioPrimitive.Root;

export { AspectRatio };
`;
}

function getVisuallyHiddenTemplate(_typescript: boolean): string {
  return `import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';

const VisuallyHidden = VisuallyHiddenPrimitive.Root;

export { VisuallyHidden };
`;
}

function getNavigationMenuTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      'relative z-10 flex max-w-max flex-1 items-center justify-center',
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
));

NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      'group flex flex-1 list-none items-center justify-center space-x-1',
      className
    )}
    {...props}
  />
));

NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
  'group inline-flex h-10 w-max items-center justify-center rounded-[var(--component-button-border-radius)] bg-[var(--color-background-primary)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-primary)] focus:bg-[var(--color-background-secondary)] focus:text-[var(--color-text-primary)] focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-[var(--color-background-secondary)] data-[state=open]:bg-[var(--color-background-secondary)]'
);

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), 'group', className)}
    {...props}
  >
    {children}{' '}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
));

NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      'left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto',
      className
    )}
    {...props}
  />
));

NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn('absolute left-0 top-full flex justify-center')}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border border-[var(--color-border-default)] bg-[var(--color-background-primary)] text-[var(--color-text-primary)] shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]',
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
));

NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-[var(--color-border-default)] shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));

NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
`;
  } else {
    return `import * as React from 'react';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const NavigationMenu = React.forwardRef(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      'relative z-10 flex max-w-max flex-1 items-center justify-center',
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
));

NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      'group flex flex-1 list-none items-center justify-center space-x-1',
      className
    )}
    {...props}
  />
));

NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
  'group inline-flex h-10 w-max items-center justify-center rounded-[var(--component-button-border-radius)] bg-[var(--color-background-primary)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-primary)] focus:bg-[var(--color-background-secondary)] focus:text-[var(--color-text-primary)] focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-[var(--color-background-secondary)] data-[state=open]:bg-[var(--color-background-secondary)]'
);

const NavigationMenuTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), 'group', className)}
    {...props}
  >
    {children}{' '}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
));

NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      'left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto',
      className
    )}
    {...props}
  />
));

NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef(({ className, ...props }, ref) => (
  <div className={cn('absolute left-0 top-full flex justify-center')}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border border-[var(--color-border-default)] bg-[var(--color-background-primary)] text-[var(--color-text-primary)] shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]',
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
));

NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-[var(--color-border-default)] shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));

NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
`;
  }
}

function getMenubarTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as MenubarPrimitive from '@radix-ui/react-menubar';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const MenubarMenu = MenubarPrimitive.Menu;
const MenubarGroup = MenubarPrimitive.Group;
const MenubarPortal = MenubarPrimitive.Portal;
const MenubarSub = MenubarPrimitive.Sub;
const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      'flex h-10 items-center space-x-1 rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-1',
      className
    )}
    {...props}
  />
));

Menubar.displayName = MenubarPrimitive.Root.displayName;

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-[var(--color-background-secondary)] data-[state=open]:bg-[var(--color-background-secondary)]',
      className
    )}
    {...props}
  />
));

MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-[var(--color-background-secondary)] data-[state=open]:bg-[var(--color-background-secondary)]',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
));

MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-1 text-[var(--color-text-primary)] shadow-lg',
      className
    )}
    {...props}
  />
));

MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = 'start', alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-[12rem] overflow-hidden rounded-md border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-1 text-[var(--color-text-primary)] shadow-md',
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
);

MenubarContent.displayName = MenubarPrimitive.Content.displayName;

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-[var(--color-background-secondary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));

MenubarItem.displayName = MenubarPrimitive.Item.displayName;

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-[var(--color-background-secondary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
));

MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-[var(--color-background-secondary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
));

MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));

MenubarLabel.displayName = MenubarPrimitive.Label.displayName;

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-[var(--color-border-default)]', className)}
    {...props}
  />
));

MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-[var(--color-text-tertiary)]',
        className
      )}
      {...props}
    />
  );
};

MenubarShortcut.displayName = 'MenubarShortcut';

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
};
`;
  } else {
    return `import * as React from 'react';
import * as MenubarPrimitive from '@radix-ui/react-menubar';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const MenubarMenu = MenubarPrimitive.Menu;
const MenubarGroup = MenubarPrimitive.Group;
const MenubarPortal = MenubarPrimitive.Portal;
const MenubarSub = MenubarPrimitive.Sub;
const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

const Menubar = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      'flex h-10 items-center space-x-1 rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-1',
      className
    )}
    {...props}
  />
));

Menubar.displayName = MenubarPrimitive.Root.displayName;

const MenubarTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-[var(--color-background-secondary)] data-[state=open]:bg-[var(--color-background-secondary)]',
      className
    )}
    {...props}
  />
));

MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

const MenubarSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-[var(--color-background-secondary)] data-[state=open]:bg-[var(--color-background-secondary)]',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
));

MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

const MenubarSubContent = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-1 text-[var(--color-text-primary)] shadow-lg',
      className
    )}
    {...props}
  />
));

MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

const MenubarContent = React.forwardRef(
  ({ className, align = 'start', alignOffset = -4, sideOffset = 8, ...props }, ref) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-[12rem] overflow-hidden rounded-md border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-1 text-[var(--color-text-primary)] shadow-md',
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
);

MenubarContent.displayName = MenubarPrimitive.Content.displayName;

const MenubarItem = React.forwardRef(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-[var(--color-background-secondary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));

MenubarItem.displayName = MenubarPrimitive.Item.displayName;

const MenubarCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-[var(--color-background-secondary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
));

MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;

const MenubarRadioItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-[var(--color-background-secondary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
));

MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;

const MenubarLabel = React.forwardRef(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));

MenubarLabel.displayName = MenubarPrimitive.Label.displayName;

const MenubarSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-[var(--color-border-default)]', className)}
    {...props}
  />
));

MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

const MenubarShortcut = ({ className, ...props }) => {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-[var(--color-text-tertiary)]',
        className
      )}
      {...props}
    />
  );
};

MenubarShortcut.displayName = 'MenubarShortcut';

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
};
`;
  }
}

function getToggleGroupTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const ToggleGroupContext = React.createContext<VariantProps<typeof buttonVariants>>({
  size: 'md',
  variant: 'outline',
});

export interface ToggleGroupProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>,
    VariantProps<typeof buttonVariants> {}

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn('flex items-center justify-center gap-1', className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

export interface ToggleGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>,
    VariantProps<typeof buttonVariants> {}

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        buttonVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        'data-[state=on]:bg-[var(--color-background-tertiary)]',
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
`;
  } else {
    return `import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const ToggleGroupContext = React.createContext({
  size: 'md',
  variant: 'outline',
});

const ToggleGroup = React.forwardRef(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn('flex items-center justify-center gap-1', className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        buttonVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        'data-[state=on]:bg-[var(--color-background-tertiary)]',
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
`;
  }
}

function getToolbarTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import * as ToolbarPrimitive from '@radix-ui/react-toolbar';
import { cn } from '@/lib/utils';

const Toolbar = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Root
    ref={ref}
    className={cn(
      'flex w-full min-w-max space-x-[var(--space-component-gap-sm)] rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-1',
      className
    )}
    {...props}
  />
));

Toolbar.displayName = ToolbarPrimitive.Root.displayName;

const ToolbarButton = ToolbarPrimitive.Button;
const ToolbarLink = ToolbarPrimitive.Link;
const ToolbarToggleGroup = ToolbarPrimitive.ToggleGroup;
const ToolbarToggleItem = ToolbarPrimitive.ToggleItem;

const ToolbarSeparator = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Separator
    ref={ref}
    className={cn('mx-2 w-[1px] bg-[var(--color-border-default)]', className)}
    {...props}
  />
));

ToolbarSeparator.displayName = ToolbarPrimitive.Separator.displayName;

export {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
};
`;
  } else {
    return `import * as React from 'react';
import * as ToolbarPrimitive from '@radix-ui/react-toolbar';
import { cn } from '@/lib/utils';

const Toolbar = React.forwardRef(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Root
    ref={ref}
    className={cn(
      'flex w-full min-w-max space-x-[var(--space-component-gap-sm)] rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-1',
      className
    )}
    {...props}
  />
));

Toolbar.displayName = ToolbarPrimitive.Root.displayName;

const ToolbarButton = ToolbarPrimitive.Button;
const ToolbarLink = ToolbarPrimitive.Link;
const ToolbarToggleGroup = ToolbarPrimitive.ToggleGroup;
const ToolbarToggleItem = ToolbarPrimitive.ToggleItem;

const ToolbarSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Separator
    ref={ref}
    className={cn('mx-2 w-[1px] bg-[var(--color-border-default)]', className)}
    {...props}
  />
));

ToolbarSeparator.displayName = ToolbarPrimitive.Separator.displayName;

export {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
};
`;
  }
}

// New Component Templates

function getCardTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] shadow-sm',
        className
      )}
      {...props}
    />
  )
);

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col space-y-1.5 p-[var(--space-component-padding-lg,1.5rem)]',
        className
      )}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-[var(--font-size-lg,1.125rem)] font-[var(--font-weight-semibold)] leading-none tracking-tight',
        className
      )}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-[var(--font-size-sm)] text-[var(--color-text-secondary)]',
      className
    )}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'p-[var(--space-component-padding-lg,1.5rem)] pt-0',
        className
      )}
      {...props}
    />
  )
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center p-[var(--space-component-padding-lg,1.5rem)] pt-0',
        className
      )}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
`;
  } else {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] shadow-sm',
        className
      )}
      {...props}
    />
  )
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col space-y-1.5 p-[var(--space-component-padding-lg,1.5rem)]',
        className
      )}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-[var(--font-size-lg,1.125rem)] font-[var(--font-weight-semibold)] leading-none tracking-tight',
        className
      )}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-[var(--font-size-sm)] text-[var(--color-text-secondary)]',
      className
    )}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'p-[var(--space-component-padding-lg,1.5rem)] pt-0',
        className
      )}
      {...props}
    />
  )
);

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center p-[var(--space-component-padding-lg,1.5rem)] pt-0',
        className
      )}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
`;
  }
}

function getBadgeTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[var(--font-size-xs)] font-[var(--font-weight-semibold)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--color-interactive-primary)] text-white',
        secondary:
          'border-transparent bg-[var(--color-background-secondary)] text-[var(--color-text-primary)]',
        outline: 'text-[var(--color-text-primary)]',
        destructive:
          'border-transparent bg-[var(--color-semantic-error)] text-white',
        success:
          'border-transparent bg-[var(--color-semantic-success)] text-white',
        warning:
          'border-transparent bg-[var(--color-semantic-warning)] text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, className }))}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
`;
  } else {
    return `import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[var(--font-size-xs)] font-[var(--font-weight-semibold)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--color-interactive-primary)] text-white',
        secondary:
          'border-transparent bg-[var(--color-background-secondary)] text-[var(--color-text-primary)]',
        outline: 'text-[var(--color-text-primary)]',
        destructive:
          'border-transparent bg-[var(--color-semantic-error)] text-white',
        success:
          'border-transparent bg-[var(--color-semantic-success)] text-white',
        warning:
          'border-transparent bg-[var(--color-semantic-warning)] text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Badge = React.forwardRef(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, className }))}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
`;
  }
}

function getAlertTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-[var(--component-button-border-radius)] border p-[var(--space-component-padding-md)] [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-background-primary)] text-[var(--color-text-primary)] border-[var(--color-border-default)]',
        info: 'bg-[var(--color-semantic-info)]/10 text-[var(--color-semantic-info)] border-[var(--color-semantic-info)]/50',
        warning:
          'bg-[var(--color-semantic-warning)]/10 text-[var(--color-semantic-warning)] border-[var(--color-semantic-warning)]/50',
        error:
          'bg-[var(--color-semantic-error)]/10 text-[var(--color-semantic-error)] border-[var(--color-semantic-error)]/50',
        success:
          'bg-[var(--color-semantic-success)]/10 text-[var(--color-semantic-success)] border-[var(--color-semantic-success)]/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant, className }))}
      {...props}
    />
  )
);

Alert.displayName = 'Alert';

export interface AlertTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn(
        'mb-1 font-[var(--font-weight-medium)] leading-none tracking-tight',
        className
      )}
      {...props}
    />
  )
);

AlertTitle.displayName = 'AlertTitle';

export interface AlertDescriptionProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const AlertDescription = React.forwardRef<HTMLDivElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'text-[var(--font-size-sm)] [&_p]:leading-relaxed',
        className
      )}
      {...props}
    />
  )
);

AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription, alertVariants };
`;
  } else {
    return `import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-[var(--component-button-border-radius)] border p-[var(--space-component-padding-md)] [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-background-primary)] text-[var(--color-text-primary)] border-[var(--color-border-default)]',
        info: 'bg-[var(--color-semantic-info)]/10 text-[var(--color-semantic-info)] border-[var(--color-semantic-info)]/50',
        warning:
          'bg-[var(--color-semantic-warning)]/10 text-[var(--color-semantic-warning)] border-[var(--color-semantic-warning)]/50',
        error:
          'bg-[var(--color-semantic-error)]/10 text-[var(--color-semantic-error)] border-[var(--color-semantic-error)]/50',
        success:
          'bg-[var(--color-semantic-success)]/10 text-[var(--color-semantic-success)] border-[var(--color-semantic-success)]/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Alert = React.forwardRef(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant, className }))}
      {...props}
    />
  )
);

Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn(
        'mb-1 font-[var(--font-weight-medium)] leading-none tracking-tight',
        className
      )}
      {...props}
    />
  )
);

AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'text-[var(--font-size-sm)] [&_p]:leading-relaxed',
        className
      )}
      {...props}
    />
  )
);

AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription, alertVariants };
`;
  }
}

function getSkeletonTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse rounded-[var(--component-button-border-radius)] bg-[var(--color-background-tertiary,#e5e7eb)]',
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
`;
  } else {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

const Skeleton = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse rounded-[var(--component-button-border-radius)] bg-[var(--color-background-tertiary,#e5e7eb)]',
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
`;
  }
}

function getTextareaTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] px-[var(--space-component-padding-md)] py-[var(--space-component-padding-sm)] text-[var(--font-size-sm)] ring-offset-background placeholder:text-[var(--color-text-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
`;
  } else {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] px-[var(--space-component-padding-md)] py-[var(--space-component-padding-sm)] text-[var(--font-size-sm)] ring-offset-background placeholder:text-[var(--color-text-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
`;
  }
}

function getLinkTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    external?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, external, children, href, ...props }, ref) => {
    const isExternal =
      external ?? (href?.startsWith('http') || href?.startsWith('//'));
    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          'inline-flex items-center gap-1 text-[var(--color-interactive-primary)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2',
          className
        )}
        {...(isExternal
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        {...props}
      >
        {children}
        {isExternal && <ExternalLink className="h-3 w-3" />}
      </a>
    );
  }
);

Link.displayName = 'Link';

export { Link };
`;
  } else {
    return `import * as React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const Link = React.forwardRef(
  ({ className, external, children, href, ...props }, ref) => {
    const isExternal =
      external ?? (href?.startsWith('http') || href?.startsWith('//'));
    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          'inline-flex items-center gap-1 text-[var(--color-interactive-primary)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2',
          className
        )}
        {...(isExternal
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        {...props}
      >
        {children}
        {isExternal && <ExternalLink className="h-3 w-3" />}
      </a>
    );
  }
);

Link.displayName = 'Link';

export { Link };
`;
  }
}

function getSpinnerTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const spinnerVariants = cva(
  'animate-spin text-[var(--color-interactive-primary)]',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
    },
    defaultVariants: { size: 'md' },
  }
);

export interface SpinnerProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof spinnerVariants> {
    label?: string;
}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size, label = 'Loading', ...props }, ref) => (
    <svg
      ref={ref}
      className={cn(spinnerVariants({ size, className }))}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label={label}
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
);

Spinner.displayName = 'Spinner';

export { Spinner, spinnerVariants };
`;
  } else {
    return `import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const spinnerVariants = cva(
  'animate-spin text-[var(--color-interactive-primary)]',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
    },
    defaultVariants: { size: 'md' },
  }
);

const Spinner = React.forwardRef(
  ({ className, size, label = 'Loading', ...props }, ref) => (
    <svg
      ref={ref}
      className={cn(spinnerVariants({ size, className }))}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label={label}
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
);

Spinner.displayName = 'Spinner';

export { Spinner, spinnerVariants };
`;
  }
}

function getBreadcrumbTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<'nav'> {}

export interface BreadcrumbListProps
  extends React.ComponentPropsWithoutRef<'ol'> {}

export interface BreadcrumbItemProps
  extends React.ComponentPropsWithoutRef<'li'> {}

export interface BreadcrumbLinkProps
  extends React.ComponentPropsWithoutRef<'a'> {
  asChild?: boolean;
}

export interface BreadcrumbPageProps
  extends React.ComponentPropsWithoutRef<'span'> {}

export interface BreadcrumbSeparatorProps
  extends React.ComponentPropsWithoutRef<'li'> {}

export interface BreadcrumbEllipsisProps
  extends React.ComponentPropsWithoutRef<'span'> {}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />
);

Breadcrumb.displayName = 'Breadcrumb';

const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        'flex flex-wrap items-center gap-1.5 break-words text-[var(--font-size-sm)] text-[var(--color-text-secondary)] sm:gap-2.5',
        className
      )}
      {...props}
    />
  )
);

BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      className={cn('inline-flex items-center gap-1.5', className)}
      {...props}
    />
  )
);

BreadcrumbItem.displayName = 'BreadcrumbItem';

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';
    return (
      <Comp
        ref={ref}
        className={cn(
          'transition-colors hover:text-[var(--color-text-primary)]',
          className
        )}
        {...props}
      />
    );
  }
);

BreadcrumbLink.displayName = 'BreadcrumbLink';

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        'font-[var(--font-weight-medium)] text-[var(--color-text-primary)]',
        className
      )}
      {...props}
    />
  )
);

BreadcrumbPage.displayName = 'BreadcrumbPage';

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<'li'>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('[&>svg]:h-3.5 [&>svg]:w-3.5', className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn(
      'flex h-9 w-9 items-center justify-center',
      className
    )}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);

BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
`;
  } else {
    return `import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const Breadcrumb = React.forwardRef(
  ({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />
);

Breadcrumb.displayName = 'Breadcrumb';

const BreadcrumbList = React.forwardRef(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        'flex flex-wrap items-center gap-1.5 break-words text-[var(--font-size-sm)] text-[var(--color-text-secondary)] sm:gap-2.5',
        className
      )}
      {...props}
    />
  )
);

BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItem = React.forwardRef(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      className={cn('inline-flex items-center gap-1.5', className)}
      {...props}
    />
  )
);

BreadcrumbItem.displayName = 'BreadcrumbItem';

const BreadcrumbLink = React.forwardRef(
  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';
    return (
      <Comp
        ref={ref}
        className={cn(
          'transition-colors hover:text-[var(--color-text-primary)]',
          className
        )}
        {...props}
      />
    );
  }
);

BreadcrumbLink.displayName = 'BreadcrumbLink';

const BreadcrumbPage = React.forwardRef(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        'font-[var(--font-weight-medium)] text-[var(--color-text-primary)]',
        className
      )}
      {...props}
    />
  )
);

BreadcrumbPage.displayName = 'BreadcrumbPage';

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('[&>svg]:h-3.5 [&>svg]:w-3.5', className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbEllipsis = ({
  className,
  ...props
}) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn(
      'flex h-9 w-9 items-center justify-center',
      className
    )}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);

BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
`;
  }
}

function getPaginationTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps extends React.ComponentProps<'nav'> {}

export interface PaginationContentProps extends React.ComponentProps<'ul'> {}

export interface PaginationItemProps extends React.ComponentProps<'li'> {}

export interface PaginationLinkProps extends React.ComponentProps<'a'> {
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export interface PaginationPreviousProps extends PaginationLinkProps {}

export interface PaginationNextProps extends PaginationLinkProps {}

export interface PaginationEllipsisProps
  extends React.ComponentProps<'span'> {}

const Pagination = ({ className, ...props }: PaginationProps) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);

Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  PaginationContentProps
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
));

PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<HTMLLIElement, PaginationItemProps>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn('', className)} {...props} />
  )
);

PaginationItem.displayName = 'PaginationItem';

const PaginationLink = ({
  className,
  isActive,
  size = 'md',
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      'inline-flex items-center justify-center rounded-[var(--component-button-border-radius)] text-[var(--font-size-sm)] font-[var(--font-weight-medium)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2',
      size === 'sm' && 'h-8 w-8',
      size === 'md' && 'h-10 w-10',
      size === 'lg' && 'h-12 w-12',
      isActive
        ? 'border border-[var(--color-border-default)] bg-[var(--color-background-secondary)]'
        : 'hover:bg-[var(--color-background-secondary)]',
      className
    )}
    {...props}
  />
);

PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
  className,
  ...props
}: PaginationPreviousProps) => (
  <PaginationLink
    aria-label="Go to previous page"
    size={props.size}
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);

PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({ className, ...props }: PaginationNextProps) => (
  <PaginationLink
    aria-label="Go to next page"
    size={props.size}
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);

PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({
  className,
  ...props
}: PaginationEllipsisProps) => (
  <span
    aria-hidden
    className={cn(
      'flex h-9 w-9 items-center justify-center',
      className
    )}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);

PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
`;
  } else {
    return `import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const Pagination = ({ className, ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);

Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
));

PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn('', className)} {...props} />
  )
);

PaginationItem.displayName = 'PaginationItem';

const PaginationLink = ({
  className,
  isActive,
  size = 'md',
  ...props
}) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      'inline-flex items-center justify-center rounded-[var(--component-button-border-radius)] text-[var(--font-size-sm)] font-[var(--font-weight-medium)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2',
      size === 'sm' && 'h-8 w-8',
      size === 'md' && 'h-10 w-10',
      size === 'lg' && 'h-12 w-12',
      isActive
        ? 'border border-[var(--color-border-default)] bg-[var(--color-background-secondary)]'
        : 'hover:bg-[var(--color-background-secondary)]',
      className
    )}
    {...props}
  />
);

PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
  className,
  ...props
}) => (
  <PaginationLink
    aria-label="Go to previous page"
    size={props.size}
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);

PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to next page"
    size={props.size}
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);

PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({
  className,
  ...props
}) => (
  <span
    aria-hidden
    className={cn(
      'flex h-9 w-9 items-center justify-center',
      className
    )}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);

PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
`;
  }
}

function getFormFieldTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

// Context for field state
const FormFieldContext = React.createContext<{
  id: string;
  error?: string;
  helperText?: string;
}>({ id: '' });

export interface FormFieldProps extends React.ComponentPropsWithoutRef<'div'> {
    id: string;
    error?: string;
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
          'text-[var(--font-size-sm)] font-[var(--font-weight-medium)] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          error && 'text-[var(--color-semantic-error)]',
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
        helperText ? \`\${id}-helper\` : undefined,
        error ? \`\${id}-error\` : undefined,
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
      id={\`\${id}-helper\`}
      className={cn(
        'text-[var(--font-size-xs)] text-[var(--color-text-tertiary)]',
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
      id={\`\${id}-error\`}
      role="alert"
      className={cn(
        'text-[var(--font-size-xs)] text-[var(--color-semantic-error)]',
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
`;
  } else {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

// Context for field state
const FormFieldContext = React.createContext({ id: '' });

const FormField = React.forwardRef(
  ({ className, id, error, helperText, children, ...props }, ref) => (
    <FormFieldContext.Provider value={{ id, error, helperText }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {children}
      </div>
    </FormFieldContext.Provider>
  )
);

FormField.displayName = 'FormField';

const FormLabel = React.forwardRef(
  ({ className, ...props }, ref) => {
    const { id, error } = React.useContext(FormFieldContext);
    return (
      <label
        ref={ref}
        htmlFor={id}
        className={cn(
          'text-[var(--font-size-sm)] font-[var(--font-weight-medium)] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          error && 'text-[var(--color-semantic-error)]',
          className
        )}
        {...props}
      />
    );
  }
);

FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const { id, error, helperText } = React.useContext(FormFieldContext);
    const describedBy =
      [
        helperText ? \`\${id}-helper\` : undefined,
        error ? \`\${id}-error\` : undefined,
      ]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <div ref={ref} className={cn(className)} {...props}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
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

const FormHelperText = React.forwardRef(({ className, ...props }, ref) => {
  const { id, helperText } = React.useContext(FormFieldContext);
  if (!helperText) return null;
  return (
    <p
      ref={ref}
      id={\`\${id}-helper\`}
      className={cn(
        'text-[var(--font-size-xs)] text-[var(--color-text-tertiary)]',
        className
      )}
      {...props}
    >
      {helperText}
    </p>
  );
});

FormHelperText.displayName = 'FormHelperText';

const FormErrorMessage = React.forwardRef(({ className, ...props }, ref) => {
  const { id, error } = React.useContext(FormFieldContext);
  if (!error) return null;
  return (
    <p
      ref={ref}
      id={\`\${id}-error\`}
      role="alert"
      className={cn(
        'text-[var(--font-size-xs)] text-[var(--color-semantic-error)]',
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
`;
  }
}

function getCommandTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

type CommandContextValue = {
  search: string;
  setSearch: (search: string) => void;
  value: string;
  setValue: (value: string) => void;
  filteredItems: Set<string>;
};

const CommandContext = React.createContext<CommandContextValue>({
  search: '',
  setSearch: () => {},
  value: '',
  setValue: () => {},
  filteredItems: new Set(),
});

export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {}

const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  ({ className, children, ...props }, ref) => {
    const [search, setSearch] = React.useState('');
    const [value, setValue] = React.useState('');
    const filteredItems = React.useMemo(() => new Set<string>(), []);

    return (
      <CommandContext.Provider
        value={{ search, setSearch, value, setValue, filteredItems }}
      >
        <div
          ref={ref}
          className={cn(
            'flex h-full w-full flex-col overflow-hidden rounded-[var(--component-button-border-radius)] bg-[var(--color-background-primary)] text-[var(--color-text-primary)]',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </CommandContext.Provider>
    );
  }
);

Command.displayName = 'Command';

export interface CommandInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className, ...props }, ref) => {
    const { search, setSearch } = React.useContext(CommandContext);

    return (
      <div className="flex items-center border-b border-[var(--color-border-default)] px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <input
          ref={ref}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            'flex h-11 w-full rounded-[var(--component-button-border-radius)] bg-transparent py-3 text-[var(--font-size-sm)] outline-none placeholder:text-[var(--color-text-tertiary)] disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

CommandInput.displayName = 'CommandInput';

export interface CommandListProps extends React.HTMLAttributes<HTMLDivElement> {}

const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
      role="listbox"
      {...props}
    />
  )
);

CommandList.displayName = 'CommandList';

export interface CommandEmptyProps extends React.HTMLAttributes<HTMLDivElement> {}

const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('py-6 text-center text-[var(--font-size-sm)]', className)}
      {...props}
    />
  )
);

CommandEmpty.displayName = 'CommandEmpty';

export interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string;
}

const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, heading, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('overflow-hidden p-1', className)}
      role="group"
      {...props}
    >
      {heading && (
        <div className="px-2 py-1.5 text-[var(--font-size-xs)] font-[var(--font-weight-medium)] text-[var(--color-text-tertiary)]">
          {heading}
        </div>
      )}
      {children}
    </div>
  )
);

CommandGroup.displayName = 'CommandGroup';

export interface CommandItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
}

const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className, value, onSelect, disabled, children, ...props }, ref) => {
    const { search } = React.useContext(CommandContext);
    const itemValue =
      value || (typeof children === 'string' ? children : '');

    if (
      search &&
      !String(itemValue).toLowerCase().includes(search.toLowerCase())
    ) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={false}
        aria-disabled={disabled}
        data-disabled={disabled || undefined}
        className={cn(
          'relative flex cursor-default select-none items-center rounded-[var(--component-button-border-radius)] px-2 py-1.5 text-[var(--font-size-sm)] outline-none',
          'hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-primary)]',
          'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          className
        )}
        onClick={() => {
          if (!disabled && onSelect) onSelect(String(itemValue));
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CommandItem.displayName = 'CommandItem';

export interface CommandSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const CommandSeparator = React.forwardRef<
  HTMLDivElement,
  CommandSeparatorProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('-mx-1 h-px bg-[var(--color-border-default)]', className)}
    {...props}
  />
));

CommandSeparator.displayName = 'CommandSeparator';

export interface CommandShortcutProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

const CommandShortcut = ({ className, ...props }: CommandShortcutProps) => (
  <span
    className={cn(
      'ml-auto text-[var(--font-size-xs)] tracking-widest text-[var(--color-text-tertiary)]',
      className
    )}
    {...props}
  />
);

CommandShortcut.displayName = 'CommandShortcut';

export interface CommandDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const CommandDialog = ({ open, onOpenChange, children }: CommandDialogProps) => {
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange?.(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] shadow-lg">
        <Command className="rounded-lg border border-[var(--color-border-default)] shadow-lg">
          {children}
        </Command>
      </div>
    </div>
  );
};

CommandDialog.displayName = 'CommandDialog';

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
  CommandDialog,
};
`;
  } else {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

const CommandContext = React.createContext({
  search: '',
  setSearch: () => {},
  value: '',
  setValue: () => {},
  filteredItems: new Set(),
});

const Command = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const [search, setSearch] = React.useState('');
    const [value, setValue] = React.useState('');
    const filteredItems = React.useMemo(() => new Set(), []);

    return (
      <CommandContext.Provider
        value={{ search, setSearch, value, setValue, filteredItems }}
      >
        <div
          ref={ref}
          className={cn(
            'flex h-full w-full flex-col overflow-hidden rounded-[var(--component-button-border-radius)] bg-[var(--color-background-primary)] text-[var(--color-text-primary)]',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </CommandContext.Provider>
    );
  }
);

Command.displayName = 'Command';

const CommandInput = React.forwardRef(
  ({ className, ...props }, ref) => {
    const { search, setSearch } = React.useContext(CommandContext);

    return (
      <div className="flex items-center border-b border-[var(--color-border-default)] px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <input
          ref={ref}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            'flex h-11 w-full rounded-[var(--component-button-border-radius)] bg-transparent py-3 text-[var(--font-size-sm)] outline-none placeholder:text-[var(--color-text-tertiary)] disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

CommandInput.displayName = 'CommandInput';

const CommandList = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
      role="listbox"
      {...props}
    />
  )
);

CommandList.displayName = 'CommandList';

const CommandEmpty = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('py-6 text-center text-[var(--font-size-sm)]', className)}
      {...props}
    />
  )
);

CommandEmpty.displayName = 'CommandEmpty';

const CommandGroup = React.forwardRef(
  ({ className, heading, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('overflow-hidden p-1', className)}
      role="group"
      {...props}
    >
      {heading && (
        <div className="px-2 py-1.5 text-[var(--font-size-xs)] font-[var(--font-weight-medium)] text-[var(--color-text-tertiary)]">
          {heading}
        </div>
      )}
      {children}
    </div>
  )
);

CommandGroup.displayName = 'CommandGroup';

const CommandItem = React.forwardRef(
  ({ className, value, onSelect, disabled, children, ...props }, ref) => {
    const { search } = React.useContext(CommandContext);
    const itemValue =
      value || (typeof children === 'string' ? children : '');

    if (
      search &&
      !String(itemValue).toLowerCase().includes(search.toLowerCase())
    ) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={false}
        aria-disabled={disabled}
        data-disabled={disabled || undefined}
        className={cn(
          'relative flex cursor-default select-none items-center rounded-[var(--component-button-border-radius)] px-2 py-1.5 text-[var(--font-size-sm)] outline-none',
          'hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-primary)]',
          'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          className
        )}
        onClick={() => {
          if (!disabled && onSelect) onSelect(String(itemValue));
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CommandItem.displayName = 'CommandItem';

const CommandSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('-mx-1 h-px bg-[var(--color-border-default)]', className)}
    {...props}
  />
));

CommandSeparator.displayName = 'CommandSeparator';

const CommandShortcut = ({ className, ...props }) => (
  <span
    className={cn(
      'ml-auto text-[var(--font-size-xs)] tracking-widest text-[var(--color-text-tertiary)]',
      className
    )}
    {...props}
  />
);

CommandShortcut.displayName = 'CommandShortcut';

const CommandDialog = ({ open, onOpenChange, children }) => {
  React.useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange?.(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] shadow-lg">
        <Command className="rounded-lg border border-[var(--color-border-default)] shadow-lg">
          {children}
        </Command>
      </div>
    </div>
  );
};

CommandDialog.displayName = 'CommandDialog';

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
  CommandDialog,
};
`;
  }
}

function getComboboxTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
}

const Combobox = ({
  options,
  value,
  onValueChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.',
  className,
  disabled,
}: ComboboxProps) => {
  const [open, setOpen] = React.useState(false);

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-[200px] justify-between', className)}
          disabled={disabled}
        >
          {selectedLabel || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  disabled={option.disabled}
                  onSelect={() => {
                    onValueChange?.(
                      option.value === value ? '' : option.value
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

Combobox.displayName = 'Combobox';

export { Combobox };
`;
  } else {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';

const Combobox = ({
  options,
  value,
  onValueChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.',
  className,
  disabled,
}) => {
  const [open, setOpen] = React.useState(false);

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-[200px] justify-between', className)}
          disabled={disabled}
        >
          {selectedLabel || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  disabled={option.disabled}
                  onSelect={() => {
                    onValueChange?.(
                      option.value === value ? '' : option.value
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

Combobox.displayName = 'Combobox';

export { Combobox };
`;
  }
}

function getTableTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn(
          'w-full caption-bottom text-[var(--font-size-sm)]',
          className
        )}
        {...props}
      />
    </div>
  )
);

Table.displayName = 'Table';

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
));

TableHeader.displayName = 'TableHeader';

export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
);

TableBody.displayName = 'TableBody';

export interface TableFooterProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  TableFooterProps
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t bg-[var(--color-background-secondary)]/50 font-[var(--font-weight-medium)] [&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
));

TableFooter.displayName = 'TableFooter';

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-[var(--color-border-default)] transition-colors hover:bg-[var(--color-background-secondary)]/50 data-[state=selected]:bg-[var(--color-background-secondary)]',
        className
      )}
      {...props}
    />
  )
);

TableRow.displayName = 'TableRow';

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-12 px-4 text-left align-middle font-[var(--font-weight-medium)] text-[var(--color-text-tertiary)] [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  )
);

TableHead.displayName = 'TableHead';

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'p-4 align-middle [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  )
);

TableCell.displayName = 'TableCell';

export interface TableCaptionProps
  extends React.HTMLAttributes<HTMLTableCaptionElement> {}

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      'mt-4 text-[var(--font-size-sm)] text-[var(--color-text-tertiary)]',
      className
    )}
    {...props}
  />
));

TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
`;
  } else {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

const Table = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn(
          'w-full caption-bottom text-[var(--font-size-sm)]',
          className
        )}
        {...props}
      />
    </div>
  )
);

Table.displayName = 'Table';

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
));

TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
);

TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t bg-[var(--color-background-secondary)]/50 font-[var(--font-weight-medium)] [&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
));

TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-[var(--color-border-default)] transition-colors hover:bg-[var(--color-background-secondary)]/50 data-[state=selected]:bg-[var(--color-background-secondary)]',
        className
      )}
      {...props}
    />
  )
);

TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-12 px-4 text-left align-middle font-[var(--font-weight-medium)] text-[var(--color-text-tertiary)] [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  )
);

TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'p-4 align-middle [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  )
);

TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      'mt-4 text-[var(--font-size-sm)] text-[var(--color-text-tertiary)]',
      className
    )}
    {...props}
  />
));

TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
`;
  }
}

function getCalendarTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
  disabled?: (date: Date) => boolean;
  /** Month to display (controlled) */
  month?: Date;
  onMonthChange?: (month: Date) => void;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

const Calendar = ({ selected, onSelect, className, disabled, month: controlledMonth, onMonthChange }: CalendarProps) => {
  const [internalMonth, setInternalMonth] = React.useState(() => selected || new Date());
  const displayMonth = controlledMonth || internalMonth;

  const setMonth = (date: Date) => {
    if (onMonthChange) {
      onMonthChange(date);
    } else {
      setInternalMonth(date);
    }
  };

  const year = displayMonth.getFullYear();
  const monthIndex = displayMonth.getMonth();
  const days = getDaysInMonth(year, monthIndex);
  const firstDayOfWeek = days[0].getDay();

  const prevMonth = () => setMonth(new Date(year, monthIndex - 1, 1));
  const nextMonth = () => setMonth(new Date(year, monthIndex + 1, 1));

  const paddedDays: (Date | null)[] = [
    ...Array.from({ length: firstDayOfWeek }, () => null),
    ...days,
  ];

  return (
    <div className={cn('p-3', className)} role="application" aria-label="Calendar">
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={prevMonth}
          className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--component-button-border-radius)] hover:bg-[var(--color-background-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-[var(--font-size-sm)] font-[var(--font-weight-medium)]">
          {MONTHS[monthIndex]} {year}
        </div>
        <button
          type="button"
          onClick={nextMonth}
          className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--component-button-border-radius)] hover:bg-[var(--color-background-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-[var(--font-size-xs)] text-[var(--color-text-tertiary)] font-[var(--font-weight-medium)] h-8 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1" role="grid">
        {paddedDays.map((date, i) => {
          if (!date) return <div key={\`empty-\${i}\`} />;
          const isSelected = selected && isSameDay(date, selected);
          const isTodayDate = isToday(date);
          const isDisabled = disabled?.(date);

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelect?.(date)}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-[var(--component-button-border-radius)] text-[var(--font-size-sm)] transition-colors',
                'hover:bg-[var(--color-background-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]',
                isSelected && 'bg-[var(--color-interactive-primary)] text-white hover:bg-[var(--color-interactive-primary)]',
                isTodayDate && !isSelected && 'bg-[var(--color-background-secondary)] font-[var(--font-weight-semibold)]',
                isDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
              )}
              aria-selected={isSelected}
              aria-label={date.toLocaleDateString()}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

Calendar.displayName = 'Calendar';

export { Calendar };
`;
  } else {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year, month) {
  const days = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isToday(date) {
  return isSameDay(date, new Date());
}

const Calendar = ({ selected, onSelect, className, disabled, month: controlledMonth, onMonthChange }) => {
  const [internalMonth, setInternalMonth] = React.useState(() => selected || new Date());
  const displayMonth = controlledMonth || internalMonth;

  const setMonth = (date) => {
    if (onMonthChange) {
      onMonthChange(date);
    } else {
      setInternalMonth(date);
    }
  };

  const year = displayMonth.getFullYear();
  const monthIndex = displayMonth.getMonth();
  const days = getDaysInMonth(year, monthIndex);
  const firstDayOfWeek = days[0].getDay();

  const prevMonth = () => setMonth(new Date(year, monthIndex - 1, 1));
  const nextMonth = () => setMonth(new Date(year, monthIndex + 1, 1));

  const paddedDays = [
    ...Array.from({ length: firstDayOfWeek }, () => null),
    ...days,
  ];

  return (
    <div className={cn('p-3', className)} role="application" aria-label="Calendar">
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={prevMonth}
          className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--component-button-border-radius)] hover:bg-[var(--color-background-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-[var(--font-size-sm)] font-[var(--font-weight-medium)]">
          {MONTHS[monthIndex]} {year}
        </div>
        <button
          type="button"
          onClick={nextMonth}
          className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--component-button-border-radius)] hover:bg-[var(--color-background-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-[var(--font-size-xs)] text-[var(--color-text-tertiary)] font-[var(--font-weight-medium)] h-8 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1" role="grid">
        {paddedDays.map((date, i) => {
          if (!date) return <div key={\`empty-\${i}\`} />;
          const isSelected = selected && isSameDay(date, selected);
          const isTodayDate = isToday(date);
          const isDisabled = disabled?.(date);

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelect?.(date)}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-[var(--component-button-border-radius)] text-[var(--font-size-sm)] transition-colors',
                'hover:bg-[var(--color-background-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]',
                isSelected && 'bg-[var(--color-interactive-primary)] text-white hover:bg-[var(--color-interactive-primary)]',
                isTodayDate && !isSelected && 'bg-[var(--color-background-secondary)] font-[var(--font-weight-semibold)]',
                isDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
              )}
              aria-selected={isSelected}
              aria-label={date.toLocaleDateString()}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

Calendar.displayName = 'Calendar';

export { Calendar };
`;
  }
}

function getDatePickerTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  disabledDates?: (date: Date) => boolean;
  className?: string;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

const DatePicker = ({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled,
  disabledDates,
  className,
}: DatePickerProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !value && 'text-[var(--color-text-tertiary)]',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? formatDate(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          selected={value}
          onSelect={(date) => {
            onChange?.(date);
            setOpen(false);
          }}
          disabled={disabledDates}
        />
      </PopoverContent>
    </Popover>
  );
};

DatePicker.displayName = 'DatePicker';

export { DatePicker };
`;
  } else {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

const DatePicker = ({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled,
  disabledDates,
  className,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !value && 'text-[var(--color-text-tertiary)]',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? formatDate(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          selected={value}
          onSelect={(date) => {
            onChange?.(date);
            setOpen(false);
          }}
          disabled={disabledDates}
        />
      </PopoverContent>
    </Popover>
  );
};

DatePicker.displayName = 'DatePicker';

export { DatePicker };
`;
  }
}

function getDataTableTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

export interface DataTableColumn<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  className?: string;
  selectable?: boolean;
  selectedRows?: Set<number>;
  onSelectionChange?: (selected: Set<number>) => void;
  pageSize?: number;
}

function DataTableInner<T extends Record<string, unknown>>(
  {
    columns,
    data,
    className,
    selectable = false,
    selectedRows: controlledSelected,
    onSelectionChange,
    pageSize = 0,
  }: DataTableProps<T>,
) {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [page, setPage] = React.useState(0);
  const [internalSelected, setInternalSelected] = React.useState<Set<number>>(new Set());

  const selected = controlledSelected ?? internalSelected;
  const setSelected = onSelectionChange ?? setInternalSelected;

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;
    const col = columns.find((c) => c.id === sortColumn);
    if (!col || !col.accessorKey) return data;
    const key = col.accessorKey;
    return [...data].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [data, sortColumn, sortDirection, columns]);

  const paginatedData = pageSize > 0
    ? sortedData.slice(page * pageSize, (page + 1) * pageSize)
    : sortedData;
  const totalPages = pageSize > 0 ? Math.ceil(sortedData.length / pageSize) : 1;

  const toggleSort = (colId: string) => {
    if (sortColumn === colId) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(colId);
      setSortDirection('asc');
    }
  };

  const toggleRow = (index: number) => {
    const next = new Set(selected);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === sortedData.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(sortedData.map((_, i) => i)));
    }
  };

  const getCellValue = (row: T, col: DataTableColumn<T>) => {
    if (col.cell) return col.cell(row);
    if (col.accessorKey) return String(row[col.accessorKey] ?? '');
    return '';
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-[var(--font-size-sm)]">
          <thead className="[&_tr]:border-b">
            <tr className="border-b border-[var(--color-border-default)] transition-colors">
              {selectable && (
                <th className="h-12 w-12 px-4 align-middle">
                  <input
                    type="checkbox"
                    checked={selected.size === sortedData.length && sortedData.length > 0}
                    onChange={toggleAll}
                    className="h-4 w-4"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={cn(
                    'h-12 px-4 text-left align-middle font-[var(--font-weight-medium)] text-[var(--color-text-tertiary)]',
                    col.sortable && 'cursor-pointer select-none',
                    col.className
                  )}
                  onClick={() => col.sortable && toggleSort(col.id)}
                >
                  <div className="flex items-center gap-2">
                    {col.header}
                    {col.sortable && (
                      <span className="inline-flex flex-col">
                        {sortColumn === col.id ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4 opacity-50" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="h-24 text-center text-[var(--color-text-tertiary)]">
                  No results.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const actualIndex = pageSize > 0 ? page * pageSize + rowIndex : rowIndex;
                return (
                  <tr
                    key={rowIndex}
                    className={cn(
                      'border-b border-[var(--color-border-default)] transition-colors hover:bg-[var(--color-background-secondary)]/50',
                      selected.has(actualIndex) && 'bg-[var(--color-background-secondary)]'
                    )}
                    data-state={selected.has(actualIndex) ? 'selected' : undefined}
                  >
                    {selectable && (
                      <td className="p-4 align-middle">
                        <input
                          type="checkbox"
                          checked={selected.has(actualIndex)}
                          onChange={() => toggleRow(actualIndex)}
                          className="h-4 w-4"
                          aria-label={\`Select row \${actualIndex + 1}\`}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.id} className={cn('p-4 align-middle', col.className)}>
                        {getCellValue(row, col)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pageSize > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-[var(--font-size-sm)] text-[var(--color-text-tertiary)]">
            {selectable && \`\${selected.size} of \${sortedData.length} row(s) selected. \`}
            Page {page + 1} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="inline-flex h-8 items-center justify-center rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] px-3 text-[var(--font-size-sm)] hover:bg-[var(--color-background-secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex h-8 items-center justify-center rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] px-3 text-[var(--font-size-sm)] hover:bg-[var(--color-background-secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const DataTable = DataTableInner as typeof DataTableInner & { displayName: string };
DataTable.displayName = 'DataTable';

export { DataTable };
`;
  } else {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

function DataTableInner(
  {
    columns,
    data,
    className,
    selectable = false,
    selectedRows: controlledSelected,
    onSelectionChange,
    pageSize = 0,
  },
) {
  const [sortColumn, setSortColumn] = React.useState(null);
  const [sortDirection, setSortDirection] = React.useState('asc');
  const [page, setPage] = React.useState(0);
  const [internalSelected, setInternalSelected] = React.useState(new Set());

  const selected = controlledSelected ?? internalSelected;
  const setSelected = onSelectionChange ?? setInternalSelected;

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;
    const col = columns.find((c) => c.id === sortColumn);
    if (!col || !col.accessorKey) return data;
    const key = col.accessorKey;
    return [...data].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [data, sortColumn, sortDirection, columns]);

  const paginatedData = pageSize > 0
    ? sortedData.slice(page * pageSize, (page + 1) * pageSize)
    : sortedData;
  const totalPages = pageSize > 0 ? Math.ceil(sortedData.length / pageSize) : 1;

  const toggleSort = (colId) => {
    if (sortColumn === colId) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(colId);
      setSortDirection('asc');
    }
  };

  const toggleRow = (index) => {
    const next = new Set(selected);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === sortedData.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(sortedData.map((_, i) => i)));
    }
  };

  const getCellValue = (row, col) => {
    if (col.cell) return col.cell(row);
    if (col.accessorKey) return String(row[col.accessorKey] ?? '');
    return '';
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-[var(--font-size-sm)]">
          <thead className="[&_tr]:border-b">
            <tr className="border-b border-[var(--color-border-default)] transition-colors">
              {selectable && (
                <th className="h-12 w-12 px-4 align-middle">
                  <input
                    type="checkbox"
                    checked={selected.size === sortedData.length && sortedData.length > 0}
                    onChange={toggleAll}
                    className="h-4 w-4"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={cn(
                    'h-12 px-4 text-left align-middle font-[var(--font-weight-medium)] text-[var(--color-text-tertiary)]',
                    col.sortable && 'cursor-pointer select-none',
                    col.className
                  )}
                  onClick={() => col.sortable && toggleSort(col.id)}
                >
                  <div className="flex items-center gap-2">
                    {col.header}
                    {col.sortable && (
                      <span className="inline-flex flex-col">
                        {sortColumn === col.id ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4 opacity-50" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="h-24 text-center text-[var(--color-text-tertiary)]">
                  No results.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const actualIndex = pageSize > 0 ? page * pageSize + rowIndex : rowIndex;
                return (
                  <tr
                    key={rowIndex}
                    className={cn(
                      'border-b border-[var(--color-border-default)] transition-colors hover:bg-[var(--color-background-secondary)]/50',
                      selected.has(actualIndex) && 'bg-[var(--color-background-secondary)]'
                    )}
                    data-state={selected.has(actualIndex) ? 'selected' : undefined}
                  >
                    {selectable && (
                      <td className="p-4 align-middle">
                        <input
                          type="checkbox"
                          checked={selected.has(actualIndex)}
                          onChange={() => toggleRow(actualIndex)}
                          className="h-4 w-4"
                          aria-label={\`Select row \${actualIndex + 1}\`}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.id} className={cn('p-4 align-middle', col.className)}>
                        {getCellValue(row, col)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pageSize > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-[var(--font-size-sm)] text-[var(--color-text-tertiary)]">
            {selectable && \`\${selected.size} of \${sortedData.length} row(s) selected. \`}
            Page {page + 1} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="inline-flex h-8 items-center justify-center rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] px-3 text-[var(--font-size-sm)] hover:bg-[var(--color-background-secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex h-8 items-center justify-center rounded-[var(--component-button-border-radius)] border border-[var(--color-border-default)] px-3 text-[var(--font-size-sm)] hover:bg-[var(--color-background-secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const DataTable = DataTableInner;
DataTable.displayName = 'DataTable';

export { DataTable };
`;
  }
}

function getFormTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

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
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
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
`;
  } else {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

const FormContext = React.createContext({
  errors: {},
  setError: () => {},
  clearError: () => {},
  clearAllErrors: () => {},
  isSubmitting: false,
});

export function useFormContext() {
  return React.useContext(FormContext);
}

const Form = React.forwardRef(
  ({ className, onSubmit, validate, children, ...props }, ref) => {
    const [errors, setErrors] = React.useState({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const setError = React.useCallback((field, message) => {
      setErrors((prev) => ({ ...prev, [field]: message }));
    }, []);

    const clearError = React.useCallback((field) => {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }, []);

    const clearAllErrors = React.useCallback(() => {
      setErrors({});
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();

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

const FormMessage = React.forwardRef(
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

const FormSubmit = React.forwardRef(
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
`;
  }
}

// Layout Primitive Templates

function getStackTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const stackVariants = cva('flex', {
  variants: {
    direction: {
      vertical: 'flex-col',
      horizontal: 'flex-row',
    },
    spacing: {
      none: 'gap-0',
      xs: 'gap-[var(--space-component-gap-xs,0.25rem)]',
      sm: 'gap-[var(--space-component-gap-sm,0.5rem)]',
      md: 'gap-[var(--space-component-gap-md,0.75rem)]',
      lg: 'gap-[var(--space-component-gap-lg,1rem)]',
      xl: 'gap-[var(--space-layout-section,4rem)]',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    wrap: {
      true: 'flex-wrap',
      false: 'flex-nowrap',
    },
  },
  defaultVariants: {
    direction: 'vertical',
    spacing: 'md',
    align: 'stretch',
    wrap: false,
  },
});

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
  /** Render as a different element */
  as?: React.ElementType;
}

/**
 * Stack component — flex layout wrapper with density-aware spacing
 *
 * @example
 * ${'```'}tsx
 * <Stack spacing="lg">
 *   <Card>First</Card>
 *   <Card>Second</Card>
 * </Stack>
 *
 * <Stack direction="horizontal" spacing="sm" align="center">
 *   <Avatar />
 *   <Text>Username</Text>
 * </Stack>
 * ${'```'}
 */
const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, direction, spacing, align, justify, wrap, as: Comp = 'div', ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(stackVariants({ direction, spacing, align, justify, wrap, className }))}
      {...props}
    />
  )
);

Stack.displayName = 'Stack';

export { Stack, stackVariants };
`;
  } else {
    return `import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const stackVariants = cva('flex', {
  variants: {
    direction: {
      vertical: 'flex-col',
      horizontal: 'flex-row',
    },
    spacing: {
      none: 'gap-0',
      xs: 'gap-[var(--space-component-gap-xs,0.25rem)]',
      sm: 'gap-[var(--space-component-gap-sm,0.5rem)]',
      md: 'gap-[var(--space-component-gap-md,0.75rem)]',
      lg: 'gap-[var(--space-component-gap-lg,1rem)]',
      xl: 'gap-[var(--space-layout-section,4rem)]',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    wrap: {
      true: 'flex-wrap',
      false: 'flex-nowrap',
    },
  },
  defaultVariants: {
    direction: 'vertical',
    spacing: 'md',
    align: 'stretch',
    wrap: false,
  },
});

/**
 * Stack component — flex layout wrapper with density-aware spacing
 */
const Stack = React.forwardRef(
  ({ className, direction, spacing, align, justify, wrap, as: Comp = 'div', ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(stackVariants({ direction, spacing, align, justify, wrap, className }))}
      {...props}
    />
  )
);

Stack.displayName = 'Stack';

export { Stack, stackVariants };
`;
  }
}

function getContainerTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const containerVariants = cva(
  'mx-auto w-full px-[var(--space-layout-container,2rem)]',
  {
    variants: {
      size: {
        sm: 'max-w-screen-sm',
        md: 'max-w-screen-md',
        lg: 'max-w-screen-lg',
        xl: 'max-w-screen-xl',
        '2xl': 'max-w-screen-2xl',
        full: 'max-w-full',
        prose: 'max-w-prose',
      },
      padding: {
        none: 'px-0',
        sm: 'px-[var(--space-component-padding-sm,0.5rem)]',
        md: 'px-[var(--space-component-padding-md,0.75rem)]',
        lg: 'px-[var(--space-layout-container,2rem)]',
        xl: 'px-[var(--space-layout-section,4rem)]',
      },
      center: {
        true: 'flex flex-col items-center',
        false: '',
      },
    },
    defaultVariants: {
      size: 'lg',
      center: false,
    },
  }
);

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  /** Render as a different element */
  as?: React.ElementType;
}

/**
 * Container component — max-width wrapper with responsive padding
 *
 * @example
 * ${'```'}tsx
 * <Container size="lg">
 *   <h1>Page Title</h1>
 *   <p>Content within a max-width container.</p>
 * </Container>
 *
 * <Container size="prose" center>
 *   <article>Long-form content...</article>
 * </Container>
 * ${'```'}
 */
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, center, as: Comp = 'div', ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(containerVariants({ size, padding, center, className }))}
      {...props}
    />
  )
);

Container.displayName = 'Container';

export { Container, containerVariants };
`;
  } else {
    return `import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const containerVariants = cva(
  'mx-auto w-full px-[var(--space-layout-container,2rem)]',
  {
    variants: {
      size: {
        sm: 'max-w-screen-sm',
        md: 'max-w-screen-md',
        lg: 'max-w-screen-lg',
        xl: 'max-w-screen-xl',
        '2xl': 'max-w-screen-2xl',
        full: 'max-w-full',
        prose: 'max-w-prose',
      },
      padding: {
        none: 'px-0',
        sm: 'px-[var(--space-component-padding-sm,0.5rem)]',
        md: 'px-[var(--space-component-padding-md,0.75rem)]',
        lg: 'px-[var(--space-layout-container,2rem)]',
        xl: 'px-[var(--space-layout-section,4rem)]',
      },
      center: {
        true: 'flex flex-col items-center',
        false: '',
      },
    },
    defaultVariants: {
      size: 'lg',
      center: false,
    },
  }
);

/**
 * Container component — max-width wrapper with responsive padding
 */
const Container = React.forwardRef(
  ({ className, size, padding, center, as: Comp = 'div', ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(containerVariants({ size, padding, center, className }))}
      {...props}
    />
  )
);

Container.displayName = 'Container';

export { Container, containerVariants };
`;
  }
}

function getHeadingTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const headingVariants = cva(
  'font-[var(--font-weight-bold)] leading-[var(--font-lineHeight-tight,1.25)] tracking-tight text-[var(--color-text-primary)]',
  {
    variants: {
      size: {
        '1': 'text-[var(--font-size-5xl)]',
        '2': 'text-[var(--font-size-4xl)]',
        '3': 'text-[var(--font-size-3xl)]',
        '4': 'text-[var(--font-size-2xl)]',
        '5': 'text-[var(--font-size-xl)]',
        '6': 'text-[var(--font-size-lg)]',
      },
      weight: {
        normal: 'font-[var(--font-weight-normal)]',
        medium: 'font-[var(--font-weight-medium)]',
        semibold: 'font-[var(--font-weight-semibold)]',
        bold: 'font-[var(--font-weight-bold)]',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      truncate: {
        true: 'truncate',
        false: '',
      },
    },
    defaultVariants: {
      weight: 'bold',
      truncate: false,
    },
  }
);

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    Omit<VariantProps<typeof headingVariants>, 'size'> {
  /** Semantic heading level (1-6), determines HTML element */
  level?: HeadingLevel;
  /** Visual size override (defaults to matching level) */
  size?: '1' | '2' | '3' | '4' | '5' | '6';
}

/**
 * Heading component — semantic headings with fluid token-based typography
 *
 * The ${'`'}level${'`'} prop sets the HTML element (h1-h6).
 * The ${'`'}size${'`'} prop overrides the visual size independently.
 *
 * @example
 * ${'```'}tsx
 * <Heading level={1}>Page Title</Heading>
 * <Heading level={2} size="3">Visually smaller h2</Heading>
 * <Heading level={3} weight="medium" align="center">Centered h3</Heading>
 * ${'```'}
 */
const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 2, size, weight, align, truncate, ...props }, ref) => {
    const Comp = ${'`'}h${'${level}`'} as const;
    const visualSize = size ?? String(level) as '1' | '2' | '3' | '4' | '5' | '6';

    return (
      <Comp
        ref={ref}
        className={cn(headingVariants({ size: visualSize, weight, align, truncate, className }))}
        {...props}
      />
    );
  }
);

Heading.displayName = 'Heading';

export { Heading, headingVariants };
`;
  } else {
    return `import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const headingVariants = cva(
  'font-[var(--font-weight-bold)] leading-[var(--font-lineHeight-tight,1.25)] tracking-tight text-[var(--color-text-primary)]',
  {
    variants: {
      size: {
        '1': 'text-[var(--font-size-5xl)]',
        '2': 'text-[var(--font-size-4xl)]',
        '3': 'text-[var(--font-size-3xl)]',
        '4': 'text-[var(--font-size-2xl)]',
        '5': 'text-[var(--font-size-xl)]',
        '6': 'text-[var(--font-size-lg)]',
      },
      weight: {
        normal: 'font-[var(--font-weight-normal)]',
        medium: 'font-[var(--font-weight-medium)]',
        semibold: 'font-[var(--font-weight-semibold)]',
        bold: 'font-[var(--font-weight-bold)]',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      truncate: {
        true: 'truncate',
        false: '',
      },
    },
    defaultVariants: {
      weight: 'bold',
      truncate: false,
    },
  }
);

/**
 * Heading component — semantic headings with fluid token-based typography
 */
const Heading = React.forwardRef(
  ({ className, level = 2, size, weight, align, truncate, ...props }, ref) => {
    const Comp = ${'`'}h${'${level}`'};
    const visualSize = size ?? String(level);

    return (
      <Comp
        ref={ref}
        className={cn(headingVariants({ size: visualSize, weight, align, truncate, className }))}
        {...props}
      />
    );
  }
);

Heading.displayName = 'Heading';

export { Heading, headingVariants };
`;
  }
}

function getTextTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textVariants = cva(
  'leading-[var(--font-lineHeight-normal,1.5)]',
  {
    variants: {
      size: {
        xs: 'text-[var(--font-size-xs)]',
        sm: 'text-[var(--font-size-sm)]',
        base: 'text-[var(--font-size-base)]',
        lg: 'text-[var(--font-size-lg)]',
        xl: 'text-[var(--font-size-xl)]',
      },
      weight: {
        normal: 'font-[var(--font-weight-normal)]',
        medium: 'font-[var(--font-weight-medium)]',
        semibold: 'font-[var(--font-weight-semibold)]',
        bold: 'font-[var(--font-weight-bold)]',
      },
      color: {
        primary: 'text-[var(--color-text-primary)]',
        secondary: 'text-[var(--color-text-secondary)]',
        tertiary: 'text-[var(--color-text-tertiary)]',
        inverse: 'text-[var(--color-text-inverse)]',
        success: 'text-[var(--color-text-success)]',
        warning: 'text-[var(--color-text-warning)]',
        error: 'text-[var(--color-text-error)]',
        info: 'text-[var(--color-text-info)]',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify',
      },
      truncate: {
        true: 'truncate',
        false: '',
      },
      wrap: {
        balance: 'text-balance',
        pretty: 'text-pretty',
        nowrap: 'text-nowrap',
      },
    },
    defaultVariants: {
      size: 'base',
      weight: 'normal',
      color: 'primary',
      truncate: false,
    },
  }
);

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  /** Render as a different element */
  as?: React.ElementType;
}

/**
 * Text component — paragraph text with size, weight, and color variants
 *
 * @example
 * ${'```'}tsx
 * <Text>Default paragraph text</Text>
 * <Text size="sm" color="secondary">Small secondary text</Text>
 * <Text size="lg" weight="semibold">Large semibold text</Text>
 * <Text as="span" size="xs" color="tertiary">Inline small label</Text>
 * ${'```'}
 */
const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, weight, color, align, truncate, wrap, as: Comp = 'p', ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(textVariants({ size, weight, color, align, truncate, wrap, className }))}
      {...props}
    />
  )
);

Text.displayName = 'Text';

export { Text, textVariants };
`;
  } else {
    return `import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textVariants = cva(
  'leading-[var(--font-lineHeight-normal,1.5)]',
  {
    variants: {
      size: {
        xs: 'text-[var(--font-size-xs)]',
        sm: 'text-[var(--font-size-sm)]',
        base: 'text-[var(--font-size-base)]',
        lg: 'text-[var(--font-size-lg)]',
        xl: 'text-[var(--font-size-xl)]',
      },
      weight: {
        normal: 'font-[var(--font-weight-normal)]',
        medium: 'font-[var(--font-weight-medium)]',
        semibold: 'font-[var(--font-weight-semibold)]',
        bold: 'font-[var(--font-weight-bold)]',
      },
      color: {
        primary: 'text-[var(--color-text-primary)]',
        secondary: 'text-[var(--color-text-secondary)]',
        tertiary: 'text-[var(--color-text-tertiary)]',
        inverse: 'text-[var(--color-text-inverse)]',
        success: 'text-[var(--color-text-success)]',
        warning: 'text-[var(--color-text-warning)]',
        error: 'text-[var(--color-text-error)]',
        info: 'text-[var(--color-text-info)]',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify',
      },
      truncate: {
        true: 'truncate',
        false: '',
      },
      wrap: {
        balance: 'text-balance',
        pretty: 'text-pretty',
        nowrap: 'text-nowrap',
      },
    },
    defaultVariants: {
      size: 'base',
      weight: 'normal',
      color: 'primary',
      truncate: false,
    },
  }
);

/**
 * Text component — paragraph text with size, weight, and color variants
 */
const Text = React.forwardRef(
  ({ className, size, weight, color, align, truncate, wrap, as: Comp = 'p', ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(textVariants({ size, weight, color, align, truncate, wrap, className }))}
      {...props}
    />
  )
);

Text.displayName = 'Text';

export { Text, textVariants };
`;
  }
}

function getCodeTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inlineCodeVariants = cva(
  'rounded-[var(--component-button-border-radius,0.375rem)] font-[var(--font-family-mono,monospace)] text-[var(--font-size-sm)]',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-background-secondary)] px-1.5 py-0.5 text-[var(--color-text-primary)]',
        ghost: 'text-[var(--color-text-primary)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface CodeProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof inlineCodeVariants> {}

/**
 * Code component — inline code snippet
 *
 * @example
 * ${'```'}tsx
 * <p>Use the <Code>useState</Code> hook for state.</p>
 * <Code variant="ghost">console.log()</Code>
 * ${'```'}
 */
const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ className, variant, ...props }, ref) => (
    <code
      ref={ref}
      className={cn(inlineCodeVariants({ variant, className }))}
      {...props}
    />
  )
);

Code.displayName = 'Code';

const codeBlockVariants = cva(
  'overflow-x-auto rounded-[var(--component-button-border-radius,0.375rem)] font-[var(--font-family-mono,monospace)] text-[var(--font-size-sm)] leading-[var(--font-lineHeight-relaxed,1.75)]',
  {
    variants: {
      variant: {
        default: 'border border-[var(--color-border-default)] bg-[var(--color-background-secondary)] p-[var(--space-component-padding-lg,1rem)] text-[var(--color-text-primary)]',
        dark: 'bg-[var(--color-background-inverse,#1e1e2e)] p-[var(--space-component-padding-lg,1rem)] text-[var(--color-text-inverse,#fff)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface CodeBlockProps
  extends React.HTMLAttributes<HTMLPreElement>,
    VariantProps<typeof codeBlockVariants> {
  /** Language label shown in the header */
  language?: string;
  /** Show line numbers */
  showLineNumbers?: boolean;
}

/**
 * CodeBlock component — multi-line code block with optional language label
 *
 * @example
 * ${'```'}tsx
 * <CodeBlock language="tsx">
 *   {${'`'}const greeting = "Hello";
 * console.log(greeting);${'`'}}
 * </CodeBlock>
 *
 * <CodeBlock variant="dark" language="bash" showLineNumbers>
 *   {${'`'}npm install @js-ds-ui/components
 * npm run dev${'`'}}
 * </CodeBlock>
 * ${'```'}
 */
const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
  ({ className, variant, language, showLineNumbers = false, children, ...props }, ref) => {
    const lines = typeof children === 'string' ? children.split('\\n') : null;

    return (
      <div className="relative">
        {language && (
          <div className="flex items-center justify-between rounded-t-[var(--component-button-border-radius,0.375rem)] border border-b-0 border-[var(--color-border-default)] bg-[var(--color-background-tertiary)] px-[var(--space-component-padding-md,0.75rem)] py-[var(--space-component-padding-xs,0.25rem)]">
            <span className="text-[var(--font-size-xs)] font-[var(--font-weight-medium)] text-[var(--color-text-secondary)]">
              {language}
            </span>
          </div>
        )}
        <pre
          ref={ref}
          className={cn(
            codeBlockVariants({ variant, className }),
            language && 'rounded-t-none border-t-0'
          )}
          {...props}
        >
          {showLineNumbers && lines ? (
            <code>
              {lines.map((line, i) => (
                <span key={i} className="table-row">
                  <span className="table-cell select-none pr-4 text-right text-[var(--color-text-tertiary)] opacity-50">
                    {i + 1}
                  </span>
                  <span className="table-cell">{line}</span>
                  {i < lines.length - 1 && '\\n'}
                </span>
              ))}
            </code>
          ) : (
            <code>{children}</code>
          )}
        </pre>
      </div>
    );
  }
);

CodeBlock.displayName = 'CodeBlock';

export { Code, CodeBlock, inlineCodeVariants, codeBlockVariants };
`;
  } else {
    return `import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inlineCodeVariants = cva(
  'rounded-[var(--component-button-border-radius,0.375rem)] font-[var(--font-family-mono,monospace)] text-[var(--font-size-sm)]',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-background-secondary)] px-1.5 py-0.5 text-[var(--color-text-primary)]',
        ghost: 'text-[var(--color-text-primary)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Code component — inline code snippet
 */
const Code = React.forwardRef(
  ({ className, variant, ...props }, ref) => (
    <code
      ref={ref}
      className={cn(inlineCodeVariants({ variant, className }))}
      {...props}
    />
  )
);

Code.displayName = 'Code';

const codeBlockVariants = cva(
  'overflow-x-auto rounded-[var(--component-button-border-radius,0.375rem)] font-[var(--font-family-mono,monospace)] text-[var(--font-size-sm)] leading-[var(--font-lineHeight-relaxed,1.75)]',
  {
    variants: {
      variant: {
        default: 'border border-[var(--color-border-default)] bg-[var(--color-background-secondary)] p-[var(--space-component-padding-lg,1rem)] text-[var(--color-text-primary)]',
        dark: 'bg-[var(--color-background-inverse,#1e1e2e)] p-[var(--space-component-padding-lg,1rem)] text-[var(--color-text-inverse,#fff)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * CodeBlock component — multi-line code block with optional language label
 */
const CodeBlock = React.forwardRef(
  ({ className, variant, language, showLineNumbers = false, children, ...props }, ref) => {
    const lines = typeof children === 'string' ? children.split('\\n') : null;

    return (
      <div className="relative">
        {language && (
          <div className="flex items-center justify-between rounded-t-[var(--component-button-border-radius,0.375rem)] border border-b-0 border-[var(--color-border-default)] bg-[var(--color-background-tertiary)] px-[var(--space-component-padding-md,0.75rem)] py-[var(--space-component-padding-xs,0.25rem)]">
            <span className="text-[var(--font-size-xs)] font-[var(--font-weight-medium)] text-[var(--color-text-secondary)]">
              {language}
            </span>
          </div>
        )}
        <pre
          ref={ref}
          className={cn(
            codeBlockVariants({ variant, className }),
            language && 'rounded-t-none border-t-0'
          )}
          {...props}
        >
          {showLineNumbers && lines ? (
            <code>
              {lines.map((line, i) => (
                <span key={i} className="table-row">
                  <span className="table-cell select-none pr-4 text-right text-[var(--color-text-tertiary)] opacity-50">
                    {i + 1}
                  </span>
                  <span className="table-cell">{line}</span>
                  {i < lines.length - 1 && '\\n'}
                </span>
              ))}
            </code>
          ) : (
            <code>{children}</code>
          )}
        </pre>
      </div>
    );
  }
);

CodeBlock.displayName = 'CodeBlock';

export { Code, CodeBlock, inlineCodeVariants, codeBlockVariants };
`;
  }
}

function getBlockquoteTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const blockquoteVariants = cva(
  'border-l-4 pl-[var(--space-component-padding-lg,1rem)] italic leading-[var(--font-lineHeight-relaxed,1.75)]',
  {
    variants: {
      variant: {
        default: 'border-[var(--color-border-default)] text-[var(--color-text-secondary)]',
        accent: 'border-[var(--color-interactive-primary)] text-[var(--color-text-primary)]',
        success: 'border-[var(--color-semantic-success)] text-[var(--color-text-primary)]',
        warning: 'border-[var(--color-semantic-warning)] text-[var(--color-text-primary)]',
        error: 'border-[var(--color-semantic-error)] text-[var(--color-text-primary)]',
      },
      size: {
        sm: 'text-[var(--font-size-sm)]',
        base: 'text-[var(--font-size-base)]',
        lg: 'text-[var(--font-size-lg)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'base',
    },
  }
);

export interface BlockquoteProps
  extends React.BlockquoteHTMLAttributes<HTMLQuoteElement>,
    VariantProps<typeof blockquoteVariants> {}

/**
 * Blockquote component — styled quote block
 *
 * @example
 * ${'```'}tsx
 * <Blockquote>
 *   The best way to predict the future is to invent it.
 * </Blockquote>
 *
 * <Blockquote variant="accent" size="lg">
 *   Design is not just what it looks like. Design is how it works.
 * </Blockquote>
 * ${'```'}
 */
const Blockquote = React.forwardRef<HTMLQuoteElement, BlockquoteProps>(
  ({ className, variant, size, ...props }, ref) => (
    <blockquote
      ref={ref}
      className={cn(blockquoteVariants({ variant, size, className }))}
      {...props}
    />
  )
);

Blockquote.displayName = 'Blockquote';

export { Blockquote, blockquoteVariants };
`;
  } else {
    return `import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const blockquoteVariants = cva(
  'border-l-4 pl-[var(--space-component-padding-lg,1rem)] italic leading-[var(--font-lineHeight-relaxed,1.75)]',
  {
    variants: {
      variant: {
        default: 'border-[var(--color-border-default)] text-[var(--color-text-secondary)]',
        accent: 'border-[var(--color-interactive-primary)] text-[var(--color-text-primary)]',
        success: 'border-[var(--color-semantic-success)] text-[var(--color-text-primary)]',
        warning: 'border-[var(--color-semantic-warning)] text-[var(--color-text-primary)]',
        error: 'border-[var(--color-semantic-error)] text-[var(--color-text-primary)]',
      },
      size: {
        sm: 'text-[var(--font-size-sm)]',
        base: 'text-[var(--font-size-base)]',
        lg: 'text-[var(--font-size-lg)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'base',
    },
  }
);

/**
 * Blockquote component — styled quote block
 */
const Blockquote = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => (
    <blockquote
      ref={ref}
      className={cn(blockquoteVariants({ variant, size, className }))}
      {...props}
    />
  )
);

Blockquote.displayName = 'Blockquote';

export { Blockquote, blockquoteVariants };
`;
  }
}

function getIconTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const iconVariants = cva('inline-flex shrink-0', {
  variants: {
    size: {
      xs: 'h-[var(--sizing-component-icon-xs,1rem)] w-[var(--sizing-component-icon-xs,1rem)]',
      sm: 'h-[var(--sizing-component-icon-sm,1.25rem)] w-[var(--sizing-component-icon-sm,1.25rem)]',
      md: 'h-[var(--sizing-component-icon-md,1.5rem)] w-[var(--sizing-component-icon-md,1.5rem)]',
      lg: 'h-[var(--sizing-component-icon-lg,2rem)] w-[var(--sizing-component-icon-lg,2rem)]',
      xl: 'h-[var(--sizing-component-icon-xl,2.5rem)] w-[var(--sizing-component-icon-xl,2.5rem)]',
    },
    color: {
      current: 'text-current',
      primary: 'text-[var(--color-text-primary)]',
      secondary: 'text-[var(--color-text-secondary)]',
      tertiary: 'text-[var(--color-text-tertiary)]',
      accent: 'text-[var(--color-interactive-primary)]',
      success: 'text-[var(--color-text-success)]',
      warning: 'text-[var(--color-text-warning)]',
      error: 'text-[var(--color-text-error)]',
      info: 'text-[var(--color-text-info)]',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'current',
  },
});

export interface IconProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof iconVariants> {
  /** The icon element to render (e.g., a lucide-react icon component instance) */
  icon?: React.ReactNode;
  /** Accessible label for the icon (sets aria-label) */
  label?: string;
}

/**
 * Icon component — wrapper for SVG icons with size and color tokens
 *
 * Wraps any icon (lucide-react, custom SVG, etc.) with consistent sizing and color.
 * When used decoratively (no label), adds aria-hidden automatically.
 *
 * @example
 * ${'```'}tsx
 * import { Search, AlertCircle } from 'lucide-react';
 *
 * <Icon icon={<Search />} size="sm" />
 * <Icon icon={<AlertCircle />} color="error" label="Error" />
 * <Icon size="lg" color="accent">
 *   <Search />
 * </Icon>
 * ${'```'}
 */
const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  ({ className, size, color, icon, label, children, ...props }, ref) => (
    <span
      ref={ref}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(iconVariants({ size, color, className }))}
      {...props}
    >
      {icon || children}
    </span>
  )
);

Icon.displayName = 'Icon';

export { Icon, iconVariants };
`;
  } else {
    return `import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const iconVariants = cva('inline-flex shrink-0', {
  variants: {
    size: {
      xs: 'h-[var(--sizing-component-icon-xs,1rem)] w-[var(--sizing-component-icon-xs,1rem)]',
      sm: 'h-[var(--sizing-component-icon-sm,1.25rem)] w-[var(--sizing-component-icon-sm,1.25rem)]',
      md: 'h-[var(--sizing-component-icon-md,1.5rem)] w-[var(--sizing-component-icon-md,1.5rem)]',
      lg: 'h-[var(--sizing-component-icon-lg,2rem)] w-[var(--sizing-component-icon-lg,2rem)]',
      xl: 'h-[var(--sizing-component-icon-xl,2.5rem)] w-[var(--sizing-component-icon-xl,2.5rem)]',
    },
    color: {
      current: 'text-current',
      primary: 'text-[var(--color-text-primary)]',
      secondary: 'text-[var(--color-text-secondary)]',
      tertiary: 'text-[var(--color-text-tertiary)]',
      accent: 'text-[var(--color-interactive-primary)]',
      success: 'text-[var(--color-text-success)]',
      warning: 'text-[var(--color-text-warning)]',
      error: 'text-[var(--color-text-error)]',
      info: 'text-[var(--color-text-info)]',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'current',
  },
});

/**
 * Icon component — wrapper for SVG icons with size and color tokens
 */
const Icon = React.forwardRef(
  ({ className, size, color, icon, label, children, ...props }, ref) => (
    <span
      ref={ref}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(iconVariants({ size, color, className }))}
      {...props}
    >
      {icon || children}
    </span>
  )
);

Icon.displayName = 'Icon';

export { Icon, iconVariants };
`;
  }
}

function getImageTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const imageVariants = cva('', {
  variants: {
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-[var(--component-button-border-radius,0.375rem)]',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    },
    fit: {
      cover: 'object-cover',
      contain: 'object-contain',
      fill: 'object-fill',
      none: 'object-none',
      'scale-down': 'object-scale-down',
    },
  },
  defaultVariants: {
    rounded: 'md',
    fit: 'cover',
  },
});

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'>,
    VariantProps<typeof imageVariants> {
  /** Aspect ratio (e.g., "16/9", "1/1", "4/3") */
  aspectRatio?: string;
  /** Custom fallback content shown on error */
  fallback?: React.ReactNode;
  /** Callback when image loads */
  onLoad?: () => void;
  /** Callback on load error */
  onError?: () => void;
}

/**
 * Image component — enhanced img with loading states and error fallback
 *
 * Shows a skeleton pulse while loading and a fallback on error.
 *
 * @example
 * ${'```'}tsx
 * <Image src="/photo.jpg" alt="Photo" aspectRatio="16/9" />
 * <Image src="/avatar.jpg" alt="User" rounded="full" className="h-16 w-16" />
 * <Image
 *   src="/missing.jpg"
 *   alt="Missing"
 *   fallback={<span>No image</span>}
 * />
 * ${'```'}
 */
const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      className,
      rounded,
      fit,
      aspectRatio,
      fallback,
      alt,
      src,
      onLoad: onLoadProp,
      onError: onErrorProp,
      ...props
    },
    ref
  ) => {
    const [status, setStatus] = React.useState<'loading' | 'loaded' | 'error'>(
      'loading'
    );

    React.useEffect(() => {
      if (src) {
        setStatus('loading');
      }
    }, [src]);

    const handleLoad = React.useCallback(() => {
      setStatus('loaded');
      onLoadProp?.();
    }, [onLoadProp]);

    const handleError = React.useCallback(() => {
      setStatus('error');
      onErrorProp?.();
    }, [onErrorProp]);

    const wrapperStyle: React.CSSProperties = aspectRatio
      ? { aspectRatio }
      : {};

    return (
      <div
        className={cn(
          'relative overflow-hidden',
          imageVariants({ rounded }),
          aspectRatio && 'w-full'
        )}
        style={wrapperStyle}
      >
        {/* Loading skeleton */}
        {status === 'loading' && (
          <div
            className="absolute inset-0 animate-pulse bg-[var(--color-background-tertiary,#e5e7eb)]"
            aria-hidden
          />
        )}

        {/* Error fallback */}
        {status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-background-secondary)] text-[var(--font-size-sm)] text-[var(--color-text-tertiary)]">
            {fallback || (
              <svg
                className="h-8 w-8 opacity-40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                />
              </svg>
            )}
          </div>
        )}

        {/* Actual image */}
        {src && (
          <img
            ref={ref}
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'h-full w-full',
              imageVariants({ fit }),
              status !== 'loaded' && 'invisible',
              className
            )}
            {...props}
          />
        )}
      </div>
    );
  }
);

Image.displayName = 'Image';

export { Image, imageVariants };
`;
  } else {
    return `import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const imageVariants = cva('', {
  variants: {
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-[var(--component-button-border-radius,0.375rem)]',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    },
    fit: {
      cover: 'object-cover',
      contain: 'object-contain',
      fill: 'object-fill',
      none: 'object-none',
      'scale-down': 'object-scale-down',
    },
  },
  defaultVariants: {
    rounded: 'md',
    fit: 'cover',
  },
});

/**
 * Image component — enhanced img with loading states and error fallback
 */
const Image = React.forwardRef(
  (
    {
      className,
      rounded,
      fit,
      aspectRatio,
      fallback,
      alt,
      src,
      onLoad: onLoadProp,
      onError: onErrorProp,
      ...props
    },
    ref
  ) => {
    const [status, setStatus] = React.useState('loading');

    React.useEffect(() => {
      if (src) {
        setStatus('loading');
      }
    }, [src]);

    const handleLoad = React.useCallback(() => {
      setStatus('loaded');
      onLoadProp?.();
    }, [onLoadProp]);

    const handleError = React.useCallback(() => {
      setStatus('error');
      onErrorProp?.();
    }, [onErrorProp]);

    const wrapperStyle = aspectRatio
      ? { aspectRatio }
      : {};

    return (
      <div
        className={cn(
          'relative overflow-hidden',
          imageVariants({ rounded }),
          aspectRatio && 'w-full'
        )}
        style={wrapperStyle}
      >
        {/* Loading skeleton */}
        {status === 'loading' && (
          <div
            className="absolute inset-0 animate-pulse bg-[var(--color-background-tertiary,#e5e7eb)]"
            aria-hidden
          />
        )}

        {/* Error fallback */}
        {status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-background-secondary)] text-[var(--font-size-sm)] text-[var(--color-text-tertiary)]">
            {fallback || (
              <svg
                className="h-8 w-8 opacity-40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                />
              </svg>
            )}
          </div>
        )}

        {/* Actual image */}
        {src && (
          <img
            ref={ref}
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'h-full w-full',
              imageVariants({ fit }),
              status !== 'loaded' && 'invisible',
              className
            )}
            {...props}
          />
        )}
      </div>
    );
  }
);

Image.displayName = 'Image';

export { Image, imageVariants };
`;
  }
}

// Composition Component Templates
function getSearchBarTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** Controlled value */
  value?: string;
  /** Called when the search value changes */
  onValueChange?: (value: string) => void;
  /** Show a loading spinner */
  loading?: boolean;
  /** Keyboard shortcut hint (e.g., "\u2318K") */
  shortcutHint?: string;
  /** Called when user presses Enter */
  onSubmit?: (value: string) => void;
}

/**
 * SearchBar component \u2014 search input with icon, clear button, and shortcut hint
 */
const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      className,
      value,
      onValueChange,
      loading = false,
      shortcutHint,
      onSubmit,
      placeholder = 'Search...',
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const combinedRef = ref || inputRef;

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange?.(e.target.value);
      },
      [onValueChange]
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSubmit) {
          onSubmit(value ?? (e.target as HTMLInputElement).value);
        }
        if (e.key === 'Escape') {
          onValueChange?.('');
        }
      },
      [onSubmit, onValueChange, value]
    );

    const handleClear = React.useCallback(() => {
      onValueChange?.('');
      (typeof combinedRef === 'object' && combinedRef?.current)?.focus();
    }, [onValueChange, combinedRef]);

    return (
      <div
        className={cn(
          'relative flex items-center rounded-[var(--component-button-border-radius,0.375rem)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] transition-colors focus-within:border-[var(--color-border-focus)] focus-within:ring-2 focus-within:ring-[var(--color-border-focus)] focus-within:ring-offset-2',
          className
        )}
      >
        {/* Search icon */}
        <svg
          className="ml-3 h-4 w-4 shrink-0 text-[var(--color-text-tertiary)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>

        <input
          ref={combinedRef as React.Ref<HTMLInputElement>}
          type="search"
          role="searchbox"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-[var(--space-component-padding-sm,0.5rem)] text-[var(--font-size-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none"
          {...props}
        />

        {/* Loading spinner */}
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin text-[var(--color-text-tertiary)]"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}

        {/* Clear button */}
        {value && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="mr-2 rounded-sm p-0.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Shortcut hint */}
        {shortcutHint && !value && !loading && (
          <kbd className="mr-3 hidden rounded border border-[var(--color-border-default)] bg-[var(--color-background-secondary)] px-1.5 py-0.5 text-[var(--font-size-xs)] text-[var(--color-text-tertiary)] sm:inline-block">
            {shortcutHint}
          </kbd>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export { SearchBar };
`;
  } else {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * SearchBar component \u2014 search input with icon, clear button, and shortcut hint
 */
const SearchBar = React.forwardRef(
  (
    {
      className,
      value,
      onValueChange,
      loading = false,
      shortcutHint,
      onSubmit,
      placeholder = 'Search...',
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef(null);
    const combinedRef = ref || inputRef;

    const handleChange = React.useCallback(
      (e) => {
        onValueChange?.(e.target.value);
      },
      [onValueChange]
    );

    const handleKeyDown = React.useCallback(
      (e) => {
        if (e.key === 'Enter' && onSubmit) {
          onSubmit(value ?? e.target.value);
        }
        if (e.key === 'Escape') {
          onValueChange?.('');
        }
      },
      [onSubmit, onValueChange, value]
    );

    const handleClear = React.useCallback(() => {
      onValueChange?.('');
      (typeof combinedRef === 'object' && combinedRef?.current)?.focus();
    }, [onValueChange, combinedRef]);

    return (
      <div
        className={cn(
          'relative flex items-center rounded-[var(--component-button-border-radius,0.375rem)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] transition-colors focus-within:border-[var(--color-border-focus)] focus-within:ring-2 focus-within:ring-[var(--color-border-focus)] focus-within:ring-offset-2',
          className
        )}
      >
        {/* Search icon */}
        <svg
          className="ml-3 h-4 w-4 shrink-0 text-[var(--color-text-tertiary)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>

        <input
          ref={combinedRef}
          type="search"
          role="searchbox"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-[var(--space-component-padding-sm,0.5rem)] text-[var(--font-size-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none"
          {...props}
        />

        {/* Loading spinner */}
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin text-[var(--color-text-tertiary)]"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}

        {/* Clear button */}
        {value && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="mr-2 rounded-sm p-0.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Shortcut hint */}
        {shortcutHint && !value && !loading && (
          <kbd className="mr-3 hidden rounded border border-[var(--color-border-default)] bg-[var(--color-background-secondary)] px-1.5 py-0.5 text-[var(--font-size-xs)] text-[var(--color-text-tertiary)] sm:inline-block">
            {shortcutHint}
          </kbd>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export { SearchBar };
`;
  }
}

function getConfirmDialogTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ConfirmDialogProps {
  /** Whether the dialog is open */
  open?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Dialog title */
  title: string;
  /** Dialog description */
  description?: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Called when user confirms */
  onConfirm?: () => void;
  /** Called when user cancels */
  onCancel?: () => void;
  /** Visual variant for the confirm button */
  variant?: 'default' | 'danger';
  /** Whether the confirm action is loading */
  loading?: boolean;
  /** Optional trigger element */
  trigger?: React.ReactNode;
  /** Additional content between description and buttons */
  children?: React.ReactNode;
}

/**
 * ConfirmDialog component \u2014 pre-built confirmation dialog
 */
const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  loading = false,
  trigger,
  children,
}: ConfirmDialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = React.useCallback(
    (value: boolean) => {
      if (!isControlled) setInternalOpen(value);
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange]
  );

  const handleConfirm = React.useCallback(() => {
    onConfirm?.();
    if (!loading) handleOpenChange(false);
  }, [onConfirm, loading, handleOpenChange]);

  const handleCancel = React.useCallback(() => {
    onCancel?.();
    handleOpenChange(false);
  }, [onCancel, handleOpenChange]);

  return (
    <>
      {trigger && (
        <span onClick={() => handleOpenChange(true)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpenChange(true); }}>
          {trigger}
        </span>
      )}
      {isOpen && (
        <div
          className="fixed inset-0 z-[var(--z-index-modal-backdrop,1040)]"
          aria-hidden
        >
          <div
            className="fixed inset-0 bg-black/80"
            onClick={() => handleOpenChange(false)}
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby={description ? 'confirm-dialog-description' : undefined}
            className="fixed left-[50%] top-[50%] z-[var(--z-index-modal,1050)] w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-[var(--space-component-padding-xl,1.5rem)] shadow-lg"
          >
            <h2
              id="confirm-dialog-title"
              className="text-[var(--font-size-lg)] font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]"
            >
              {title}
            </h2>
            {description && (
              <p
                id="confirm-dialog-description"
                className="mt-2 text-[var(--font-size-sm)] text-[var(--color-text-secondary)]"
              >
                {description}
              </p>
            )}
            {children && <div className="mt-4">{children}</div>}
            <div className="mt-6 flex justify-end gap-[var(--space-component-gap-sm,0.5rem)]">
              <button
                type="button"
                onClick={handleCancel}
                className={cn(
                  'rounded-[var(--component-button-border-radius,0.375rem)] border border-[var(--color-border-default)] bg-transparent px-4 py-2 text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-background-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2'
                )}
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className={cn(
                  'rounded-[var(--component-button-border-radius,0.375rem)] px-4 py-2 text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50',
                  variant === 'danger'
                    ? 'bg-[var(--color-semantic-error)] hover:bg-[var(--color-semantic-error)]/90 focus:ring-[var(--color-semantic-error)]'
                    : 'bg-[var(--color-interactive-primary)] hover:bg-[var(--color-interactive-primary-hover)] focus:ring-[var(--color-border-focus)]'
                )}
              >
                {loading && (
                  <svg className="mr-2 inline-block h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ConfirmDialog.displayName = 'ConfirmDialog';

export { ConfirmDialog };
`;
  } else {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * ConfirmDialog component \u2014 pre-built confirmation dialog
 */
const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  loading = false,
  trigger,
  children,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = React.useCallback(
    (value) => {
      if (!isControlled) setInternalOpen(value);
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange]
  );

  const handleConfirm = React.useCallback(() => {
    onConfirm?.();
    if (!loading) handleOpenChange(false);
  }, [onConfirm, loading, handleOpenChange]);

  const handleCancel = React.useCallback(() => {
    onCancel?.();
    handleOpenChange(false);
  }, [onCancel, handleOpenChange]);

  return (
    <>
      {trigger && (
        <span onClick={() => handleOpenChange(true)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpenChange(true); }}>
          {trigger}
        </span>
      )}
      {isOpen && (
        <div
          className="fixed inset-0 z-[var(--z-index-modal-backdrop,1040)]"
          aria-hidden
        >
          <div
            className="fixed inset-0 bg-black/80"
            onClick={() => handleOpenChange(false)}
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby={description ? 'confirm-dialog-description' : undefined}
            className="fixed left-[50%] top-[50%] z-[var(--z-index-modal,1050)] w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-[var(--space-component-padding-xl,1.5rem)] shadow-lg"
          >
            <h2
              id="confirm-dialog-title"
              className="text-[var(--font-size-lg)] font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]"
            >
              {title}
            </h2>
            {description && (
              <p
                id="confirm-dialog-description"
                className="mt-2 text-[var(--font-size-sm)] text-[var(--color-text-secondary)]"
              >
                {description}
              </p>
            )}
            {children && <div className="mt-4">{children}</div>}
            <div className="mt-6 flex justify-end gap-[var(--space-component-gap-sm,0.5rem)]">
              <button
                type="button"
                onClick={handleCancel}
                className={cn(
                  'rounded-[var(--component-button-border-radius,0.375rem)] border border-[var(--color-border-default)] bg-transparent px-4 py-2 text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-background-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2'
                )}
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className={cn(
                  'rounded-[var(--component-button-border-radius,0.375rem)] px-4 py-2 text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50',
                  variant === 'danger'
                    ? 'bg-[var(--color-semantic-error)] hover:bg-[var(--color-semantic-error)]/90 focus:ring-[var(--color-semantic-error)]'
                    : 'bg-[var(--color-interactive-primary)] hover:bg-[var(--color-interactive-primary-hover)] focus:ring-[var(--color-border-focus)]'
                )}
              >
                {loading && (
                  <svg className="mr-2 inline-block h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ConfirmDialog.displayName = 'ConfirmDialog';

export { ConfirmDialog };
`;
  }
}

function getUserMenuTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

export interface UserMenuItem {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
  destructive?: boolean;
  disabled?: boolean;
}

export interface UserMenuGroup {
  label?: string;
  items: UserMenuItem[];
}

export interface UserMenuProps {
  /** User display name */
  name: string;
  /** User email */
  email?: string;
  /** Avatar image URL */
  avatarUrl?: string;
  /** Avatar fallback (initials) */
  avatarFallback?: string;
  /** Menu item groups */
  groups: UserMenuGroup[];
  /** Additional className for the trigger */
  className?: string;
}

/**
 * UserMenu component \u2014 avatar-triggered dropdown menu
 */
const UserMenu = ({ name, email, avatarUrl, avatarFallback, groups, className }: UserMenuProps) => {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const initials = avatarFallback || name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          'relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-background-secondary)] ring-offset-2 transition-all hover:ring-2 hover:ring-[var(--color-border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]',
          className
        )}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--color-text-primary)]">
            {initials}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute right-0 top-full z-[var(--z-index-dropdown,1000)] mt-2 min-w-[220px] rounded-[var(--component-button-border-radius,0.375rem)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-1 shadow-lg"
        >
          {/* User info header */}
          <div className="px-3 py-2">
            <p className="text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--color-text-primary)]">
              {name}
            </p>
            {email && (
              <p className="text-[var(--font-size-xs)] text-[var(--color-text-tertiary)]">
                {email}
              </p>
            )}
          </div>

          {groups.map((group, groupIdx) => (
            <React.Fragment key={groupIdx}>
              {/* Separator between groups */}
              <div className="my-1 h-px bg-[var(--color-border-default)]" role="separator" />

              {group.label && (
                <p className="px-3 py-1 text-[var(--font-size-xs)] font-[var(--font-weight-medium)] text-[var(--color-text-tertiary)]">
                  {group.label}
                </p>
              )}

              {group.items.map((item, itemIdx) => {
                const Wrapper = item.href ? 'a' : 'button';
                const wrapperProps = item.href
                  ? { href: item.href }
                  : { type: 'button' as const, onClick: item.onClick };

                return (
                  <Wrapper
                    key={itemIdx}
                    role="menuitem"
                    disabled={item.disabled}
                    className={cn(
                      'flex w-full items-center rounded-sm px-3 py-2 text-left text-[var(--font-size-sm)] transition-colors focus:outline-none focus:bg-[var(--color-background-secondary)]',
                      item.destructive
                        ? 'text-[var(--color-text-error)] hover:bg-[var(--color-background-error)]'
                        : 'text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)]',
                      item.disabled && 'pointer-events-none opacity-50'
                    )}
                    {...wrapperProps}
                  >
                    {item.icon && (
                      <span className="mr-2 h-4 w-4 shrink-0" aria-hidden>
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </Wrapper>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

UserMenu.displayName = 'UserMenu';

export { UserMenu };
`;
  } else {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * UserMenu component \u2014 avatar-triggered dropdown menu
 */
const UserMenu = ({ name, email, avatarUrl, avatarFallback, groups, className }) => {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef(null);
  const triggerRef = React.useRef(null);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const initials = avatarFallback || name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          'relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-background-secondary)] ring-offset-2 transition-all hover:ring-2 hover:ring-[var(--color-border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]',
          className
        )}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--color-text-primary)]">
            {initials}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute right-0 top-full z-[var(--z-index-dropdown,1000)] mt-2 min-w-[220px] rounded-[var(--component-button-border-radius,0.375rem)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-1 shadow-lg"
        >
          {/* User info header */}
          <div className="px-3 py-2">
            <p className="text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--color-text-primary)]">
              {name}
            </p>
            {email && (
              <p className="text-[var(--font-size-xs)] text-[var(--color-text-tertiary)]">
                {email}
              </p>
            )}
          </div>

          {groups.map((group, groupIdx) => (
            <React.Fragment key={groupIdx}>
              {/* Separator between groups */}
              <div className="my-1 h-px bg-[var(--color-border-default)]" role="separator" />

              {group.label && (
                <p className="px-3 py-1 text-[var(--font-size-xs)] font-[var(--font-weight-medium)] text-[var(--color-text-tertiary)]">
                  {group.label}
                </p>
              )}

              {group.items.map((item, itemIdx) => {
                const Wrapper = item.href ? 'a' : 'button';
                const wrapperProps = item.href
                  ? { href: item.href }
                  : { type: 'button', onClick: item.onClick };

                return (
                  <Wrapper
                    key={itemIdx}
                    role="menuitem"
                    disabled={item.disabled}
                    className={cn(
                      'flex w-full items-center rounded-sm px-3 py-2 text-left text-[var(--font-size-sm)] transition-colors focus:outline-none focus:bg-[var(--color-background-secondary)]',
                      item.destructive
                        ? 'text-[var(--color-text-error)] hover:bg-[var(--color-background-error)]'
                        : 'text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)]',
                      item.disabled && 'pointer-events-none opacity-50'
                    )}
                    {...wrapperProps}
                  >
                    {item.icon && (
                      <span className="mr-2 h-4 w-4 shrink-0" aria-hidden>
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </Wrapper>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

UserMenu.displayName = 'UserMenu';

export { UserMenu };
`;
  }
}


function getDateRangePickerTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface DateRangePickerProps {
  /** Current selected range */
  value?: DateRange;
  /** Called when the range changes */
  onValueChange?: (range: DateRange) => void;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Disabled dates */
  disabled?: boolean;
  /** Placeholder for start */
  startPlaceholder?: string;
  /** Placeholder for end */
  endPlaceholder?: string;
  /** Additional className */
  className?: string;
}

// Helper functions
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(date: Date, from: Date | null, to: Date | null): boolean {
  if (!from || !to) return false;
  return date > from && date < to;
}

function formatDate(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * DateRangePicker component — select a start and end date range
 *
 * @example
 * \`\`\`tsx
 * const [range, setRange] = React.useState<DateRange>({ from: null, to: null });
 * <DateRangePicker value={range} onValueChange={setRange} />
 * \`\`\`
 */
const DateRangePicker = ({
  value = { from: null, to: null },
  onValueChange,
  minDate,
  maxDate,
  disabled = false,
  startPlaceholder = 'Start date',
  endPlaceholder = 'End date',
  className,
}: DateRangePickerProps) => {
  const [open, setOpen] = React.useState(false);
  const [viewDate, setViewDate] = React.useState(() => value.from || new Date());
  const [selecting, setSelecting] = React.useState<'from' | 'to'>('from');
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleDayClick = (day: number) => {
    const clicked = new Date(year, month, day);

    if (selecting === 'from') {
      onValueChange?.({ from: clicked, to: null });
      setSelecting('to');
    } else {
      const from = value.from;
      if (from && clicked >= from) {
        onValueChange?.({ from, to: clicked });
      } else {
        onValueChange?.({ from: clicked, to: null });
      }
      setSelecting('from');
      setOpen(false);
    }
  };

  const isDisabledDate = (day: number): boolean => {
    const date = new Date(year, month, day);
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 rounded-[var(--component-button-border-radius,0.375rem)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] px-3 py-[var(--space-component-padding-sm,0.5rem)] text-[var(--font-size-sm)] transition-colors hover:border-[var(--color-border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <svg className="h-4 w-4 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        <span className={value.from ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-tertiary)]'}>
          {value.from ? formatDate(value.from) : startPlaceholder}
        </span>
        <span className="text-[var(--color-text-tertiary)]">–</span>
        <span className={value.to ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-tertiary)]'}>
          {value.to ? formatDate(value.to) : endPlaceholder}
        </span>
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-[var(--z-index-popover,1060)] mt-2 rounded-[var(--component-button-border-radius,0.375rem)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-4 shadow-lg">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <button type="button" onClick={prevMonth} className="rounded p-1 hover:bg-[var(--color-background-secondary)] focus:outline-none" aria-label="Previous month">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <span className="text-[var(--font-size-sm)] font-[var(--font-weight-semibold)]">
              {MONTHS[month]} {year}
            </span>
            <button type="button" onClick={nextMonth} className="rounded p-1 hover:bg-[var(--color-background-secondary)] focus:outline-none" aria-label="Next month">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="mb-1 grid grid-cols-7 gap-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[var(--font-size-xs)] font-[var(--font-weight-medium)] text-[var(--color-text-tertiary)]">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1" role="grid">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={\`empty-\${i}\`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(year, month, day);
              const isFrom = value.from && isSameDay(date, value.from);
              const isTo = value.to && isSameDay(date, value.to);
              const inRange = isInRange(date, value.from, value.to);
              const isDisabled = isDisabledDate(day);

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded text-[var(--font-size-sm)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]',
                    isFrom || isTo
                      ? 'bg-[var(--color-interactive-primary)] text-white'
                      : inRange
                        ? 'bg-[var(--color-interactive-primary)]/10 text-[var(--color-interactive-primary)]'
                        : 'hover:bg-[var(--color-background-secondary)]',
                    isDisabled && 'cursor-not-allowed opacity-30'
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Selection hint */}
          <p className="mt-3 text-center text-[var(--font-size-xs)] text-[var(--color-text-tertiary)]">
            {selecting === 'from' ? 'Select start date' : 'Select end date'}
          </p>
        </div>
      )}
    </div>
  );
};

DateRangePicker.displayName = 'DateRangePicker';

export { DateRangePicker };
`;
  } else {
    return `import * from 'react';
import { cn } from '@/lib/utils';

// Helper functions
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(date, from | null, to | null) {
  if (!from || !to) return false;
  return date > from && date < to;
}

function formatDate(date | null) {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * DateRangePicker component — select a start and end date range
 *
 * @example
 * \`\`\`tsx
 * const [range, setRange] = React.useState<DateRange>({ from, to });
 * <DateRangePicker value={range} onValueChange={setRange} />
 * \`\`\`
 */
const DateRangePicker = ({
  value = { from, to },
  onValueChange,
  minDate,
  maxDate,
  disabled = false,
  startPlaceholder = 'Start date',
  endPlaceholder = 'End date',
  className,
}: DateRangePickerProps) => {
  const [open, setOpen] = React.useState(false);
  const [viewDate, setViewDate] = React.useState(() => value.from || new Date());
  const [selecting, setSelecting] = React.useState<'from' | 'to'>('from');
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleDayClick = (day) => {
    const clicked = new Date(year, month, day);

    if (selecting === 'from') {
      onValueChange?.({ from: clicked, to });
      setSelecting('to');
    } else {
      const from = value.from;
      if (from && clicked >= from) {
        onValueChange?.({ from, to: clicked });
      } else {
        onValueChange?.({ from: clicked, to });
      }
      setSelecting('from');
      setOpen(false);
    }
  };

  const isDisabledDate = (day) => {
    const date = new Date(year, month, day);
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 rounded-[var(--component-button-border-radius,0.375rem)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] px-3 py-[var(--space-component-padding-sm,0.5rem)] text-[var(--font-size-sm)] transition-colors hover:border-[var(--color-border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <svg className="h-4 w-4 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        <span className={value.from ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-tertiary)]'}>
          {value.from ? formatDate(value.from) : startPlaceholder}
        </span>
        <span className="text-[var(--color-text-tertiary)]">–</span>
        <span className={value.to ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-tertiary)]'}>
          {value.to ? formatDate(value.to) : endPlaceholder}
        </span>
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-[var(--z-index-popover,1060)] mt-2 rounded-[var(--component-button-border-radius,0.375rem)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] p-4 shadow-lg">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <button type="button" onClick={prevMonth} className="rounded p-1 hover:bg-[var(--color-background-secondary)] focus:outline-none" aria-label="Previous month">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <span className="text-[var(--font-size-sm)] font-[var(--font-weight-semibold)]">
              {MONTHS[month]} {year}
            </span>
            <button type="button" onClick={nextMonth} className="rounded p-1 hover:bg-[var(--color-background-secondary)] focus:outline-none" aria-label="Next month">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="mb-1 grid grid-cols-7 gap-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[var(--font-size-xs)] font-[var(--font-weight-medium)] text-[var(--color-text-tertiary)]">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1" role="grid">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={\`empty-\${i}\`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(year, month, day);
              const isFrom = value.from && isSameDay(date, value.from);
              const isTo = value.to && isSameDay(date, value.to);
              const inRange = isInRange(date, value.from, value.to);
              const isDisabled = isDisabledDate(day);

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded text-[var(--font-size-sm)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]',
                    isFrom || isTo
                      ? 'bg-[var(--color-interactive-primary)] text-white'
                      : inRange
                        ? 'bg-[var(--color-interactive-primary)]/10 text-[var(--color-interactive-primary)]'
                        : 'hover:bg-[var(--color-background-secondary)]',
                    isDisabled && 'cursor-not-allowed opacity-30'
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Selection hint */}
          <p className="mt-3 text-center text-[var(--font-size-xs)] text-[var(--color-text-tertiary)]">
            {selecting === 'from' ? 'Select start date' : 'Select end date'}
          </p>
        </div>
      )}
    </div>
  );
};

DateRangePicker.displayName = 'DateRangePicker';

export { DateRangePicker };`;
  }
}

function getTimePickerTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TimePickerProps {
  /** Current time value (HH:MM format, 24h) */
  value?: string;
  /** Called when time changes */
  onValueChange?: (time: string) => void;
  /** Use 12-hour format with AM/PM */
  use12Hour?: boolean;
  /** Minute step interval */
  minuteStep?: number;
  /** Minimum time (HH:MM) */
  minTime?: string;
  /** Maximum time (HH:MM) */
  maxTime?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
  /** Placeholder */
  placeholder?: string;
}

function padZero(n: number): string {
  return n.toString().padStart(2, '0');
}

function parseTime(str: string): { hours: number; minutes: number } {
  const [h, m] = str.split(':').map(Number);
  return { hours: h || 0, minutes: m || 0 };
}

/**
 * TimePicker component — time selection with hour/minute controls
 *
 * @example
 * \`\`\`tsx
 * const [time, setTime] = React.useState('09:00');
 * <TimePicker value={time} onValueChange={setTime} />
 * <TimePicker value={time} onValueChange={setTime} use12Hour minuteStep={15} />
 * \`\`\`
 */
const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      value = '',
      onValueChange,
      use12Hour = false,
      minuteStep = 1,
      minTime,
      maxTime,
      disabled = false,
      className,
      placeholder = 'Select time',
      ...props
    },
    ref
  ) => {
    const parsed = value ? parseTime(value) : null;
    const hours = parsed?.hours ?? -1;
    const minutes = parsed?.minutes ?? -1;
    const period = hours >= 12 ? 'PM' : 'AM';

    const display12Hour = use12Hour && hours >= 0
      ? hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
      : hours;

    const handleHourChange = React.useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        let h = parseInt(e.target.value, 10);
        if (use12Hour) {
          if (period === 'PM' && h !== 12) h += 12;
          if (period === 'AM' && h === 12) h = 0;
        }
        const m = minutes >= 0 ? minutes : 0;
        onValueChange?.(\`\${padZero(h)}:\${padZero(m)}\`);
      },
      [use12Hour, period, minutes, onValueChange]
    );

    const handleMinuteChange = React.useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const m = parseInt(e.target.value, 10);
        const h = hours >= 0 ? hours : 0;
        onValueChange?.(\`\${padZero(h)}:\${padZero(m)}\`);
      },
      [hours, onValueChange]
    );

    const handlePeriodChange = React.useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPeriod = e.target.value;
        let h = hours;
        if (newPeriod === 'PM' && h < 12) h += 12;
        if (newPeriod === 'AM' && h >= 12) h -= 12;
        onValueChange?.(\`\${padZero(h)}:\${padZero(minutes >= 0 ? minutes : 0)}\`);
      },
      [hours, minutes, onValueChange]
    );

    const hourOptions = use12Hour
      ? Array.from({ length: 12 }, (_, i) => i + 1)
      : Array.from({ length: 24 }, (_, i) => i);

    const minuteOptions = Array.from(
      { length: Math.ceil(60 / minuteStep) },
      (_, i) => i * minuteStep
    );

    const selectClass = cn(
      'appearance-none rounded-[var(--component-button-border-radius,0.375rem)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] px-2 py-[var(--space-component-padding-sm,0.5rem)] text-center text-[var(--font-size-sm)] text-[var(--color-text-primary)] focus:border-[var(--color-border-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]',
      disabled && 'cursor-not-allowed opacity-50'
    );

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center gap-1', className)}
        role="group"
        aria-label="Time picker"
        {...props}
      >
        {/* Clock icon */}
        <svg className="mr-1 h-4 w-4 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        {/* Hours */}
        <select
          value={hours >= 0 ? (use12Hour ? display12Hour : hours) : ''}
          onChange={handleHourChange}
          disabled={disabled}
          className={selectClass}
          aria-label="Hour"
        >
          <option value="" disabled>HH</option>
          {hourOptions.map((h) => (
            <option key={h} value={h}>{padZero(h)}</option>
          ))}
        </select>

        <span className="text-[var(--color-text-tertiary)] font-[var(--font-weight-medium)]">:</span>

        {/* Minutes */}
        <select
          value={minutes >= 0 ? minutes : ''}
          onChange={handleMinuteChange}
          disabled={disabled}
          className={selectClass}
          aria-label="Minute"
        >
          <option value="" disabled>MM</option>
          {minuteOptions.map((m) => (
            <option key={m} value={m}>{padZero(m)}</option>
          ))}
        </select>

        {/* AM/PM */}
        {use12Hour && (
          <select
            value={period}
            onChange={handlePeriodChange}
            disabled={disabled}
            className={selectClass}
            aria-label="Period"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        )}
      </div>
    );
  }
);

TimePicker.displayName = 'TimePicker';

export { TimePicker };
`;
  } else {
    return `import * from 'react';
import { cn } from '@/lib/utils';

function padZero(n) {
  return n.toString().padStart(2, '0');
}

function parseTime(str): { hours; minutes } {
  const [h, m] = str.split(':').map(Number);
  return { hours: h || 0, minutes: m || 0 };
}

/**
 * TimePicker component — time selection with hour/minute controls
 *
 * @example
 * \`\`\`tsx
 * const [time, setTime] = React.useState('09:00');
 * <TimePicker value={time} onValueChange={setTime} />
 * <TimePicker value={time} onValueChange={setTime} use12Hour minuteStep={15} />
 * \`\`\`
 */
const TimePicker = React.forwardRef(
  (
    {
      value = '',
      onValueChange,
      use12Hour = false,
      minuteStep = 1,
      minTime,
      maxTime,
      disabled = false,
      className,
      placeholder = 'Select time',
      ...props
    },
    ref
  ) => {
    const parsed = value ? parseTime(value) ;
    const hours = parsed?.hours ?? -1;
    const minutes = parsed?.minutes ?? -1;
    const period = hours >= 12 ? 'PM' : 'AM';

    const display12Hour = use12Hour && hours >= 0
      ? hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
      : hours;

    const handleHourChange = React.useCallback(
      (e) => {
        let h = parseInt(e.target.value, 10);
        if (use12Hour) {
          if (period === 'PM' && h !== 12) h += 12;
          if (period === 'AM' && h === 12) h = 0;
        }
        const m = minutes >= 0 ? minutes : 0;
        onValueChange?.(\`\${padZero(h)}:\${padZero(m)}\`);
      },
      [use12Hour, period, minutes, onValueChange]
    );

    const handleMinuteChange = React.useCallback(
      (e) => {
        const m = parseInt(e.target.value, 10);
        const h = hours >= 0 ? hours : 0;
        onValueChange?.(\`\${padZero(h)}:\${padZero(m)}\`);
      },
      [hours, onValueChange]
    );

    const handlePeriodChange = React.useCallback(
      (e) => {
        const newPeriod = e.target.value;
        let h = hours;
        if (newPeriod === 'PM' && h < 12) h += 12;
        if (newPeriod === 'AM' && h >= 12) h -= 12;
        onValueChange?.(\`\${padZero(h)}:\${padZero(minutes >= 0 ? minutes : 0)}\`);
      },
      [hours, minutes, onValueChange]
    );

    const hourOptions = use12Hour
      ? Array.from({ length: 12 }, (_, i) => i + 1)
      : Array.from({ length: 24 }, (_, i) => i);

    const minuteOptions = Array.from(
      { length: Math.ceil(60 / minuteStep) },
      (_, i) => i * minuteStep
    );

    const selectClass = cn(
      'appearance-none rounded-[var(--component-button-border-radius,0.375rem)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] px-2 py-[var(--space-component-padding-sm,0.5rem)] text-center text-[var(--font-size-sm)] text-[var(--color-text-primary)] focus:border-[var(--color-border-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]',
      disabled && 'cursor-not-allowed opacity-50'
    );

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center gap-1', className)}
        role="group"
        aria-label="Time picker"
        {...props}
      >
        {/* Clock icon */}
        <svg className="mr-1 h-4 w-4 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        {/* Hours */}
        <select
          value={hours >= 0 ? (use12Hour ? display12Hour : hours) : ''}
          onChange={handleHourChange}
          disabled={disabled}
          className={selectClass}
          aria-label="Hour"
        >
          <option value="" disabled>HH</option>
          {hourOptions.map((h) => (
            <option key={h} value={h}>{padZero(h)}</option>
          ))}
        </select>

        <span className="text-[var(--color-text-tertiary)] font-[var(--font-weight-medium)]">:</span>

        {/* Minutes */}
        <select
          value={minutes >= 0 ? minutes : ''}
          onChange={handleMinuteChange}
          disabled={disabled}
          className={selectClass}
          aria-label="Minute"
        >
          <option value="" disabled>MM</option>
          {minuteOptions.map((m) => (
            <option key={m} value={m}>{padZero(m)}</option>
          ))}
        </select>

        {/* AM/PM */}
        {use12Hour && (
          <select
            value={period}
            onChange={handlePeriodChange}
            disabled={disabled}
            className={selectClass}
            aria-label="Period"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        )}
      </div>
    );
  }
);

TimePicker.displayName = 'TimePicker';

export { TimePicker };`;
  }
}

function getColorPickerTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

export type ColorFormat = 'hex' | 'oklch';

export interface ColorPickerProps {
  /** Color value (hex string like #3b82f6 or oklch string) */
  value?: string;
  /** Called when color changes */
  onValueChange?: (color: string) => void;
  /** Display format */
  format?: ColorFormat;
  /** Show a list of preset colors */
  presets?: string[];
  /** Label text */
  label?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

const DEFAULT_PRESETS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#6b7280',
];

/**
 * ColorPicker component — color selection with native input and text entry
 *
 * @example
 * \`\`\`tsx
 * const [color, setColor] = React.useState('#3b82f6');
 * <ColorPicker value={color} onValueChange={setColor} />
 * <ColorPicker value={color} onValueChange={setColor} presets={['#f00', '#0f0', '#00f']} />
 * \`\`\`
 */
const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    {
      value = '#000000',
      onValueChange,
      format = 'hex',
      presets = DEFAULT_PRESETS,
      label,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const [textValue, setTextValue] = React.useState(value);

    React.useEffect(() => {
      setTextValue(value);
    }, [value]);

    const handleNativeChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setTextValue(newColor);
        onValueChange?.(newColor);
      },
      [onValueChange]
    );

    const handleTextChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setTextValue(e.target.value);
      },
      []
    );

    const handleTextBlur = React.useCallback(() => {
      // Validate and emit on blur
      if (textValue.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\$/)) {
        onValueChange?.(textValue);
      } else if (textValue.match(/^oklch\\(/)) {
        onValueChange?.(textValue);
      } else {
        setTextValue(value);
      }
    }, [textValue, value, onValueChange]);

    const handleTextKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          handleTextBlur();
        }
      },
      [handleTextBlur]
    );

    const handlePresetClick = React.useCallback(
      (preset: string) => {
        setTextValue(preset);
        onValueChange?.(preset);
      },
      [onValueChange]
    );

    return (
      <div
        ref={ref}
        className={cn('inline-flex flex-col gap-2', className)}
        {...props}
      >
        {label && (
          <label className="text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--color-text-primary)]">
            {label}
          </label>
        )}

        <div className="flex items-center gap-2">
          {/* Native color input */}
          <div className="relative">
            <input
              type="color"
              value={value.startsWith('#') ? value : '#000000'}
              onChange={handleNativeChange}
              disabled={disabled}
              className={cn(
                'h-10 w-10 cursor-pointer rounded-[var(--component-button-border-radius,0.375rem)] border border-[var(--color-border-default)] p-0.5',
                disabled && 'cursor-not-allowed opacity-50'
              )}
              aria-label={label || 'Color picker'}
            />
          </div>

          {/* Text input */}
          <input
            type="text"
            value={textValue}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            onKeyDown={handleTextKeyDown}
            disabled={disabled}
            className={cn(
              'w-[140px] rounded-[var(--component-button-border-radius,0.375rem)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] px-3 py-[var(--space-component-padding-sm,0.5rem)] font-[var(--font-family-mono,monospace)] text-[var(--font-size-sm)] text-[var(--color-text-primary)] focus:border-[var(--color-border-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            placeholder={format === 'oklch' ? 'oklch(0.5 0.2 250)' : '#000000'}
            aria-label="Color value"
          />
        </div>

        {/* Preset swatches */}
        {presets.length > 0 && (
          <div className="flex flex-wrap gap-1.5" role="listbox" aria-label="Color presets">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                role="option"
                aria-selected={value === preset}
                onClick={() => handlePresetClick(preset)}
                disabled={disabled}
                className={cn(
                  'h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2',
                  value === preset ? 'border-[var(--color-text-primary)] ring-1 ring-[var(--color-text-primary)]' : 'border-transparent',
                  disabled && 'cursor-not-allowed opacity-50'
                )}
                style={{ backgroundColor: preset }}
                aria-label={preset}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

ColorPicker.displayName = 'ColorPicker';

export { ColorPicker, DEFAULT_PRESETS };
`;
  } else {
    return `import * from 'react';
import { cn } from '@/lib/utils';

const DEFAULT_PRESETS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#6b7280',
];

/**
 * ColorPicker component — color selection with native input and text entry
 *
 * @example
 * \`\`\`tsx
 * const [color, setColor] = React.useState('#3b82f6');
 * <ColorPicker value={color} onValueChange={setColor} />
 * <ColorPicker value={color} onValueChange={setColor} presets={['#f00', '#0f0', '#00f']} />
 * \`\`\`
 */
const ColorPicker = React.forwardRef(
  (
    {
      value = '#000000',
      onValueChange,
      format = 'hex',
      presets = DEFAULT_PRESETS,
      label,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const [textValue, setTextValue] = React.useState(value);

    React.useEffect(() => {
      setTextValue(value);
    }, [value]);

    const handleNativeChange = React.useCallback(
      (e) => {
        const newColor = e.target.value;
        setTextValue(newColor);
        onValueChange?.(newColor);
      },
      [onValueChange]
    );

    const handleTextChange = React.useCallback(
      (e) => {
        setTextValue(e.target.value);
      },
      []
    );

    const handleTextBlur = React.useCallback(() => {
      // Validate and emit on blur
      if (textValue.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\$/)) {
        onValueChange?.(textValue);
      } else if (textValue.match(/^oklch\\(/)) {
        onValueChange?.(textValue);
      } else {
        setTextValue(value);
      }
    }, [textValue, value, onValueChange]);

    const handleTextKeyDown = React.useCallback(
      (e) => {
        if (e.key === 'Enter') {
          handleTextBlur();
        }
      },
      [handleTextBlur]
    );

    const handlePresetClick = React.useCallback(
      (preset) => {
        setTextValue(preset);
        onValueChange?.(preset);
      },
      [onValueChange]
    );

    return (
      <div
        ref={ref}
        className={cn('inline-flex flex-col gap-2', className)}
        {...props}
      >
        {label && (
          <label className="text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--color-text-primary)]">
            {label}
          </label>
        )}

        <div className="flex items-center gap-2">
          {/* Native color input */}
          <div className="relative">
            <input
              type="color"
              value={value.startsWith('#') ? value : '#000000'}
              onChange={handleNativeChange}
              disabled={disabled}
              className={cn(
                'h-10 w-10 cursor-pointer rounded-[var(--component-button-border-radius,0.375rem)] border border-[var(--color-border-default)] p-0.5',
                disabled && 'cursor-not-allowed opacity-50'
              )}
              aria-label={label || 'Color picker'}
            />
          </div>

          {/* Text input */}
          <input
            type="text"
            value={textValue}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            onKeyDown={handleTextKeyDown}
            disabled={disabled}
            className={cn(
              'w-[140px] rounded-[var(--component-button-border-radius,0.375rem)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] px-3 py-[var(--space-component-padding-sm,0.5rem)] font-[var(--font-family-mono,monospace)] text-[var(--font-size-sm)] text-[var(--color-text-primary)] focus:border-[var(--color-border-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            placeholder={format === 'oklch' ? 'oklch(0.5 0.2 250)' : '#000000'}
            aria-label="Color value"
          />
        </div>

        {/* Preset swatches */}
        {presets.length > 0 && (
          <div className="flex flex-wrap gap-1.5" role="listbox" aria-label="Color presets">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                role="option"
                aria-selected={value === preset}
                onClick={() => handlePresetClick(preset)}
                disabled={disabled}
                className={cn(
                  'h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2',
                  value === preset ? 'border-[var(--color-text-primary)] ring-1 ring-[var(--color-text-primary)]' : 'border-transparent',
                  disabled && 'cursor-not-allowed opacity-50'
                )}
                style={{ backgroundColor: preset }}
                aria-label={preset}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

ColorPicker.displayName = 'ColorPicker';

export { ColorPicker, DEFAULT_PRESETS };`;
  }
}

function getFileUploadTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FileUploadFile {
  file: File;
  id: string;
  preview?: string;
}

export interface FileUploadProps {
  /** Called when files are selected or dropped */
  onFilesChange?: (files: FileUploadFile[]) => void;
  /** Accepted file types (e.g., "image/*,.pdf") */
  accept?: string;
  /** Allow multiple file selection */
  multiple?: boolean;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Maximum number of files */
  maxFiles?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
  /** Descriptive text */
  description?: string;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return \`\${bytes} B\`;
  if (bytes < 1024 * 1024) return \`\${(bytes / 1024).toFixed(1)} KB\`;
  return \`\${(bytes / (1024 * 1024)).toFixed(1)} MB\`;
}

/**
 * FileUpload component — drag-and-drop file upload with preview
 *
 * @example
 * \`\`\`tsx
 * <FileUpload
 *   accept="image/*"
 *   multiple
 *   maxSize={5 * 1024 * 1024}
 *   onFilesChange={(files) => console.log(files)}
 *   description="PNG, JPG up to 5MB"
 * />
 * \`\`\`
 */
const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      onFilesChange,
      accept,
      multiple = false,
      maxSize,
      maxFiles,
      disabled = false,
      className,
      description,
      ...props
    },
    ref
  ) => {
    const [files, setFiles] = React.useState<FileUploadFile[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const processFiles = React.useCallback(
      (fileList: FileList | File[]) => {
        setError(null);
        const newFiles: FileUploadFile[] = [];

        const incoming = Array.from(fileList);

        for (const file of incoming) {
          if (maxSize && file.size > maxSize) {
            setError(\`File "\${file.name}" exceeds \${formatFileSize(maxSize)} limit.\`);
            continue;
          }

          const uploadFile: FileUploadFile = {
            file,
            id: generateId(),
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
          };
          newFiles.push(uploadFile);
        }

        const updated = multiple ? [...files, ...newFiles] : newFiles.slice(0, 1);
        const limited = maxFiles ? updated.slice(0, maxFiles) : updated;

        setFiles(limited);
        onFilesChange?.(limited);
      },
      [files, multiple, maxSize, maxFiles, onFilesChange]
    );

    const handleDrop = React.useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;
        processFiles(e.dataTransfer.files);
      },
      [disabled, processFiles]
    );

    const handleDragOver = React.useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      },
      [disabled]
    );

    const handleDragLeave = React.useCallback(() => {
      setIsDragging(false);
    }, []);

    const handleInputChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          processFiles(e.target.files);
        }
      },
      [processFiles]
    );

    const handleRemove = React.useCallback(
      (id: string) => {
        const file = files.find((f) => f.id === id);
        if (file?.preview) URL.revokeObjectURL(file.preview);
        const updated = files.filter((f) => f.id !== id);
        setFiles(updated);
        onFilesChange?.(updated);
      },
      [files, onFilesChange]
    );

    // Cleanup previews on unmount
    React.useEffect(() => {
      return () => {
        files.forEach((f) => {
          if (f.preview) URL.revokeObjectURL(f.preview);
        });
      };
    }, []);

    return (
      <div ref={ref} className={cn('flex flex-col gap-3', className)} {...props}>
        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && inputRef.current?.click()}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-[var(--component-button-border-radius,0.375rem)] border-2 border-dashed px-6 py-8 text-center transition-colors',
            isDragging
              ? 'border-[var(--color-interactive-primary)] bg-[var(--color-interactive-primary)]/5'
              : 'border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-background-secondary)]',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <svg className="mb-3 h-10 w-10 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--color-text-primary)]">
            {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
          </p>
          {description && (
            <p className="mt-1 text-[var(--font-size-xs)] text-[var(--color-text-tertiary)]">
              {description}
            </p>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled}
            aria-label="File upload"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-[var(--font-size-sm)] text-[var(--color-text-error)]" role="alert">
            {error}
          </p>
        )}

        {/* File list */}
        {files.length > 0 && (
          <ul className="flex flex-col gap-2" role="list">
            {files.map((f) => (
              <li
                key={f.id}
                className="flex items-center gap-3 rounded-[var(--component-button-border-radius,0.375rem)] border border-[var(--color-border-default)] p-2"
              >
                {/* Preview */}
                {f.preview ? (
                  <img src={f.preview} alt={f.file.name} className="h-10 w-10 rounded object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-[var(--color-background-secondary)]">
                    <svg className="h-5 w-5 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                )}
                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--color-text-primary)]">
                    {f.file.name}
                  </p>
                  <p className="text-[var(--font-size-xs)] text-[var(--color-text-tertiary)]">
                    {formatFileSize(f.file.size)}
                  </p>
                </div>
                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemove(f.id); }}
                  className="shrink-0 rounded p-1 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-error)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]"
                  aria-label={\`Remove \${f.file.name}\`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export { FileUpload };
`;
  } else {
    return `import * from 'react';
import { cn } from '@/lib/utils';

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function formatFileSize(bytes) {
  if (bytes < 1024) return \`\${bytes} B\`;
  if (bytes < 1024 * 1024) return \`\${(bytes / 1024).toFixed(1)} KB\`;
  return \`\${(bytes / (1024 * 1024)).toFixed(1)} MB\`;
}

/**
 * FileUpload component — drag-and-drop file upload with preview
 *
 * @example
 * \`\`\`tsx
 * <FileUpload
 *   accept="image/*"
 *   multiple
 *   maxSize={5 * 1024 * 1024}
 *   onFilesChange={(files) => console.log(files)}
 *   description="PNG, JPG up to 5MB"
 * />
 * \`\`\`
 */
const FileUpload = React.forwardRef(
  (
    {
      onFilesChange,
      accept,
      multiple = false,
      maxSize,
      maxFiles,
      disabled = false,
      className,
      description,
      ...props
    },
    ref
  ) => {
    const [files, setFiles] = React.useState<FileUploadFile[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const processFiles = React.useCallback(
      (fileList: FileList | File[]) => {
        setError(null);
        const newFiles: FileUploadFile[] = [];

        const incoming = Array.from(fileList);

        for (const file of incoming) {
          if (maxSize && file.size > maxSize) {
            setError(\`File "\${file.name}" exceeds \${formatFileSize(maxSize)} limit.\`);
            continue;
          }

          const uploadFile: FileUploadFile = {
            file,
            id: generateId(),
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
          };
          newFiles.push(uploadFile);
        }

        const updated = multiple ? [...files, ...newFiles] : newFiles.slice(0, 1);
        const limited = maxFiles ? updated.slice(0, maxFiles) : updated;

        setFiles(limited);
        onFilesChange?.(limited);
      },
      [files, multiple, maxSize, maxFiles, onFilesChange]
    );

    const handleDrop = React.useCallback(
      (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;
        processFiles(e.dataTransfer.files);
      },
      [disabled, processFiles]
    );

    const handleDragOver = React.useCallback(
      (e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      },
      [disabled]
    );

    const handleDragLeave = React.useCallback(() => {
      setIsDragging(false);
    }, []);

    const handleInputChange = React.useCallback(
      (e) => {
        if (e.target.files) {
          processFiles(e.target.files);
        }
      },
      [processFiles]
    );

    const handleRemove = React.useCallback(
      (id) => {
        const file = files.find((f) => f.id === id);
        if (file?.preview) URL.revokeObjectURL(file.preview);
        const updated = files.filter((f) => f.id !== id);
        setFiles(updated);
        onFilesChange?.(updated);
      },
      [files, onFilesChange]
    );

    // Cleanup previews on unmount
    React.useEffect(() => {
      return () => {
        files.forEach((f) => {
          if (f.preview) URL.revokeObjectURL(f.preview);
        });
      };
    }, []);

    return (
      <div ref={ref} className={cn('flex flex-col gap-3', className)} {...props}>
        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && inputRef.current?.click()}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-[var(--component-button-border-radius,0.375rem)] border-2 border-dashed px-6 py-8 text-center transition-colors',
            isDragging
              ? 'border-[var(--color-interactive-primary)] bg-[var(--color-interactive-primary)]/5'
              : 'border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-background-secondary)]',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <svg className="mb-3 h-10 w-10 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--color-text-primary)]">
            {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
          </p>
          {description && (
            <p className="mt-1 text-[var(--font-size-xs)] text-[var(--color-text-tertiary)]">
              {description}
            </p>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled}
            aria-label="File upload"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-[var(--font-size-sm)] text-[var(--color-text-error)]" role="alert">
            {error}
          </p>
        )}

        {/* File list */}
        {files.length > 0 && (
          <ul className="flex flex-col gap-2" role="list">
            {files.map((f) => (
              <li
                key={f.id}
                className="flex items-center gap-3 rounded-[var(--component-button-border-radius,0.375rem)] border border-[var(--color-border-default)] p-2"
              >
                {/* Preview */}
                {f.preview ? (
                  <img src={f.preview} alt={f.file.name} className="h-10 w-10 rounded object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-[var(--color-background-secondary)]">
                    <svg className="h-5 w-5 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                )}
                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--color-text-primary)]">
                    {f.file.name}
                  </p>
                  <p className="text-[var(--font-size-xs)] text-[var(--color-text-tertiary)]">
                    {formatFileSize(f.file.size)}
                  </p>
                </div>
                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemove(f.id); }}
                  className="shrink-0 rounded p-1 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-error)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]"
                  aria-label={\`Remove \${f.file.name}\`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export { FileUpload };`;
  }
}


function getFocusTrapTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

const FOCUSABLE_SELECTOR =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

export interface FocusTrapProps {
  /** Whether the focus trap is active */
  active?: boolean;
  /** Return focus to previously focused element on deactivate */
  returnFocusOnDeactivate?: boolean;
  /** Initial element to focus (CSS selector) */
  initialFocus?: string;
  /** Allow clicking outside the trap to deactivate */
  clickOutsideDeactivates?: boolean;
  /** Called when Escape is pressed */
  onEscapeKey?: () => void;
  /** Children to trap focus within */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
}

const FocusTrap = React.forwardRef<HTMLDivElement, FocusTrapProps>(
  (
    {
      active = true,
      returnFocusOnDeactivate = true,
      initialFocus,
      clickOutsideDeactivates = false,
      onEscapeKey,
      children,
      className,
    },
    ref
  ) => {
    const internalRef = React.useRef<HTMLDivElement>(null);
    const previouslyFocusedRef = React.useRef<Element | null>(null);

    // Merge the forwarded ref with the internal ref
    const containerRef = React.useMemo(() => {
      return (node: HTMLDivElement | null) => {
        internalRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      };
    }, [ref]);

    React.useEffect(() => {
      if (!active) {
        return;
      }

      const container = internalRef.current;
      if (!container) {
        return;
      }

      // Store the previously focused element
      previouslyFocusedRef.current = document.activeElement;

      // Set initial focus
      const setInitialFocus = () => {
        if (initialFocus) {
          const initialElement = container.querySelector<HTMLElement>(initialFocus);
          if (initialElement) {
            initialElement.focus();
            return;
          }
        }

        const focusableElements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      };

      setInitialFocus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onEscapeKey?.();
          return;
        }

        if (event.key !== 'Tab') {
          return;
        }

        const focusableElements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      };

      const handleMouseDown = (event: MouseEvent) => {
        if (
          clickOutsideDeactivates &&
          container &&
          !container.contains(event.target as Node)
        ) {
          onEscapeKey?.();
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      if (clickOutsideDeactivates) {
        document.addEventListener('mousedown', handleMouseDown);
      }

      return () => {
        document.removeEventListener('keydown', handleKeyDown);

        if (clickOutsideDeactivates) {
          document.removeEventListener('mousedown', handleMouseDown);
        }

        if (returnFocusOnDeactivate && previouslyFocusedRef.current) {
          (previouslyFocusedRef.current as HTMLElement).focus?.();
        }
      };
    }, [active, initialFocus, returnFocusOnDeactivate, clickOutsideDeactivates, onEscapeKey]);

    return (
      <div ref={containerRef} className={cn(className)}>
        {children}
      </div>
    );
  }
);

FocusTrap.displayName = 'FocusTrap';

export { FocusTrap };
`;
  } else {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

const FOCUSABLE_SELECTOR =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

const FocusTrap = React.forwardRef(
  (
    {
      active = true,
      returnFocusOnDeactivate = true,
      initialFocus,
      clickOutsideDeactivates = false,
      onEscapeKey,
      children,
      className,
    },
    ref
  ) => {
    const internalRef = React.useRef<HTMLDivElement>(null);
    const previouslyFocusedRef = React.useRef<Element | null>(null);

    // Merge the forwarded ref with the internal ref
    const containerRef = React.useMemo(() => {
      return (node: HTMLDivElement | null) => {
        internalRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      };
    }, [ref]);

    React.useEffect(() => {
      if (!active) {
        return;
      }

      const container = internalRef.current;
      if (!container) {
        return;
      }

      // Store the previously focused element
      previouslyFocusedRef.current = document.activeElement;

      // Set initial focus
      const setInitialFocus = () => {
        if (initialFocus) {
          const initialElement = container.querySelector<HTMLElement>(initialFocus);
          if (initialElement) {
            initialElement.focus();
            return;
          }
        }

        const focusableElements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      };

      setInitialFocus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onEscapeKey?.();
          return;
        }

        if (event.key !== 'Tab') {
          return;
        }

        const focusableElements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      };

      const handleMouseDown = (event: MouseEvent) => {
        if (
          clickOutsideDeactivates &&
          container &&
          !container.contains(event.target as Node)
        ) {
          onEscapeKey?.();
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      if (clickOutsideDeactivates) {
        document.addEventListener('mousedown', handleMouseDown);
      }

      return () => {
        document.removeEventListener('keydown', handleKeyDown);

        if (clickOutsideDeactivates) {
          document.removeEventListener('mousedown', handleMouseDown);
        }

        if (returnFocusOnDeactivate && previouslyFocusedRef.current) {
          (previouslyFocusedRef.current).focus?.();
        }
      };
    }, [active, initialFocus, returnFocusOnDeactivate, clickOutsideDeactivates, onEscapeKey]);

    return (
      <div ref={containerRef} className={cn(className)}>
        {children}
      </div>
    );
  }
);

FocusTrap.displayName = 'FocusTrap';

export { FocusTrap };`;
  }
}

function getSkipNavTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkipNavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Target element ID (without #) */
  contentId?: string;
  /** Link text */
  children?: React.ReactNode;
}

export interface SkipNavContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The ID that SkipNavLink targets */
  id?: string;
}

const SkipNavLink = React.forwardRef<HTMLAnchorElement, SkipNavLinkProps>(
  ({ contentId = 'skip-nav-content', children = 'Skip to main content', className, ...props }, ref) => (
    <a
      ref={ref}
      href={\`#\${contentId}\`}
      className={cn(
        'fixed left-4 top-4 z-[var(--z-index-overlay,1070)] -translate-y-full rounded-[var(--component-button-border-radius,0.375rem)] bg-[var(--color-background-primary)] px-4 py-2 text-[var(--font-size-sm)] font-[var(--font-weight-semibold)] text-[var(--color-interactive-primary)] shadow-lg ring-2 ring-[var(--color-border-focus)] transition-transform focus:translate-y-0 focus:outline-none',
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
);
SkipNavLink.displayName = 'SkipNavLink';

const SkipNavContent = React.forwardRef<HTMLDivElement, SkipNavContentProps>(
  ({ id = 'skip-nav-content', className, ...props }, ref) => (
    <div
      ref={ref}
      id={id}
      tabIndex={-1}
      className={cn('outline-none', className)}
      {...props}
    />
  )
);
SkipNavContent.displayName = 'SkipNavContent';

export { SkipNavLink, SkipNavContent };
`;
  } else {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

const SkipNavLink = React.forwardRef(
  ({ contentId = 'skip-nav-content', children = 'Skip to main content', className, ...props }, ref) => (
    <a
      ref={ref}
      href={\`#\${contentId}\`}
      className={cn(
        'fixed left-4 top-4 z-[var(--z-index-overlay,1070)] -translate-y-full rounded-[var(--component-button-border-radius,0.375rem)] bg-[var(--color-background-primary)] px-4 py-2 text-[var(--font-size-sm)] font-[var(--font-weight-semibold)] text-[var(--color-interactive-primary)] shadow-lg ring-2 ring-[var(--color-border-focus)] transition-transform focus:translate-y-0 focus:outline-none',
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
);
SkipNavLink.displayName = 'SkipNavLink';

const SkipNavContent = React.forwardRef(
  ({ id = 'skip-nav-content', className, ...props }, ref) => (
    <div
      ref={ref}
      id={id}
      tabIndex={-1}
      className={cn('outline-none', className)}
      {...props}
    />
  )
);
SkipNavContent.displayName = 'SkipNavContent';

export { SkipNavLink, SkipNavContent };`;
  }
}

function getAnnouncementTemplate(typescript: boolean): string {
  if (typescript) {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

export type AnnouncementPoliteness = 'polite' | 'assertive';

export interface AnnouncementProps {
  /** The message to announce */
  message?: string;
  /** Politeness level — 'polite' waits for idle, 'assertive' interrupts */
  politeness?: AnnouncementPoliteness;
  /** Clear the announcement after this many milliseconds */
  clearAfterMs?: number;
  /** Additional className for the visually-hidden container */
  className?: string;
}

/**
 * Announcement component — screen reader live region
 *
 * Renders a visually hidden aria-live region. When \`message\` changes,
 * screen readers announce the new content.
 */
const Announcement = React.forwardRef<HTMLDivElement, AnnouncementProps>(
  (
    {
      message = '',
      politeness = 'polite',
      clearAfterMs,
      className,
      ...props
    },
    ref
  ) => {
    const [current, setCurrent] = React.useState(message);

    React.useEffect(() => {
      setCurrent(message);

      if (clearAfterMs && message) {
        const timer = setTimeout(() => setCurrent(''), clearAfterMs);
        return () => clearTimeout(timer);
      }
    }, [message, clearAfterMs]);

    return (
      <div
        ref={ref}
        role="status"
        aria-live={politeness}
        aria-atomic="true"
        className={cn(
          'sr-only pointer-events-none fixed left-0 top-0 h-px w-px overflow-hidden',
          className
        )}
        style={{
          clip: 'rect(0, 0, 0, 0)',
          clipPath: 'inset(50%)',
          whiteSpace: 'nowrap',
        }}
        {...props}
      >
        {current}
      </div>
    );
  }
);

Announcement.displayName = 'Announcement';

export { Announcement };
`;
  } else {
    return `import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Announcement component — screen reader live region
 *
 * Renders a visually hidden aria-live region. When \`message\` changes,
 * screen readers announce the new content.
 */
const Announcement = React.forwardRef(
  (
    {
      message = '',
      politeness = 'polite',
      clearAfterMs,
      className,
      ...props
    },
    ref
  ) => {
    const [current, setCurrent] = React.useState(message);

    React.useEffect(() => {
      setCurrent(message);

      if (clearAfterMs && message) {
        const timer = setTimeout(() => setCurrent(''), clearAfterMs);
        return () => clearTimeout(timer);
      }
    }, [message, clearAfterMs]);

    return (
      <div
        ref={ref}
        role="status"
        aria-live={politeness}
        aria-atomic="true"
        className={cn(
          'sr-only pointer-events-none fixed left-0 top-0 h-px w-px overflow-hidden',
          className
        )}
        style={{
          clip: 'rect(0, 0, 0, 0)',
          clipPath: 'inset(50%)',
          whiteSpace: 'nowrap',
        }}
        {...props}
      >
        {current}
      </div>
    );
  }
);

Announcement.displayName = 'Announcement';

export { Announcement };`;
  }
}
