/**
 * Component registry
 * Maps component names to their source files and dependencies
 */

export interface ComponentFile {
  path: string;
  type: 'component' | 'hook' | 'util';
}

export type ComponentStatus = 'stable' | 'beta' | 'alpha' | 'deprecated';

export interface ComponentRegistryItem {
  name: string;
  label: string;
  description: string;
  status: ComponentStatus;
  since: string; // Version when component was added (e.g., '0.1.0')
  files: ComponentFile[];
  dependencies: string[]; // Other components this depends on
  npmDependencies: Record<string, string>; // NPM packages required
  registryDependencies?: string[]; // Other registry components needed
}

export const REGISTRY: Record<string, ComponentRegistryItem> = {
  // Utilities
  utils: {
    name: 'utils',
    label: 'Utils',
    description: 'Utility functions (cn helper)',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'lib/utils.ts',

        type: 'util',
      },
    ],
    dependencies: [],
    npmDependencies: {
      clsx: '^2.1.1',
      'tailwind-merge': '^2.6.0',
    },
  },
  'use-theme': {
    name: 'use-theme',
    label: 'useTheme Hook',
    description: 'Hook for theme management',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'hooks/use-theme.ts',

        type: 'hook',
      },
    ],
    dependencies: [],
    npmDependencies: {},
  },
  'use-density': {
    name: 'use-density',
    label: 'useDensity Hook',
    description: 'Hook for density control',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'hooks/use-density.ts',

        type: 'hook',
      },
    ],
    dependencies: [],
    npmDependencies: {},
  },

  // Form Components
  label: {
    name: 'label',
    label: 'Label',
    description: 'Accessible label component for form fields',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/label.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-label': '^2.1.1',
    },
    registryDependencies: ['utils'],
  },
  checkbox: {
    name: 'checkbox',
    label: 'Checkbox',
    description: 'Checkbox component for boolean input',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/checkbox.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-checkbox': '^1.1.3',
      'lucide-react': '^0.468.0',
    },
    registryDependencies: ['utils'],
  },
  'radio-group': {
    name: 'radio-group',
    label: 'Radio Group',
    description: 'Radio group for single selection from multiple options',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/radio-group.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-radio-group': '^1.2.2',
      'lucide-react': '^0.468.0',
    },
    registryDependencies: ['utils'],
  },
  switch: {
    name: 'switch',
    label: 'Switch',
    description: 'Toggle switch component for boolean input',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/switch.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-switch': '^1.1.2',
    },
    registryDependencies: ['utils'],
  },
  select: {
    name: 'select',
    label: 'Select',
    description: 'Dropdown select component',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/select.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-select': '^2.1.3',
      'lucide-react': '^0.468.0',
    },
    registryDependencies: ['utils'],
  },
  input: {
    name: 'input',
    label: 'Input',
    description: 'Text input component',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/input.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {},
    registryDependencies: ['utils'],
  },
  textarea: {
    name: 'textarea',
    label: 'Textarea',
    description: 'Multi-line text input component',
    status: 'beta',
    since: '0.2.0',
    files: [
      {
        path: 'components/ui/textarea.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {},
    registryDependencies: ['utils'],
  },
  button: {
    name: 'button',
    label: 'Button',
    description: 'Button component with multiple variants and sizes',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/button.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-slot': '^1.1.1',
      'class-variance-authority': '^0.7.1',
      clsx: '^2.1.1',
    },
    registryDependencies: ['utils'],
  },
  slider: {
    name: 'slider',
    label: 'Slider',
    description: 'Range slider component with keyboard support',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/slider.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-slider': '^1.2.2',
    },
    registryDependencies: ['utils'],
  },
  'form-field': {
    name: 'form-field',
    label: 'Form Field',
    description: 'Composite form field with label, control, helper text, and error message',
    status: 'beta',
    since: '0.2.0',
    files: [
      {
        path: 'components/ui/form-field.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {},
    registryDependencies: ['utils'],
  },
  form: {
    name: 'form',
    label: 'Form',
    description: 'Form wrapper with validation state management',
    status: 'beta',
    since: '0.2.0',
    files: [{ path: 'components/ui/form.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: {},
    registryDependencies: ['utils'],
  },
  link: {
    name: 'link',
    label: 'Link',
    description: 'Styled hyperlink with external link detection',
    status: 'beta',
    since: '0.2.0',
    files: [
      {
        path: 'components/ui/link.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      'lucide-react': '^0.468.0',
    },
    registryDependencies: ['utils'],
  },

  // Layout Primitives
  stack: {
    name: 'stack',
    label: 'Stack',
    description: 'Flex layout wrapper with density-aware spacing. Supports vertical/horizontal direction, gap, alignment, and wrap.',
    status: 'beta' as ComponentStatus,
    since: '0.2.0',
    files: [{ path: 'components/ui/stack.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: {
      'class-variance-authority': '^0.7.1',
      clsx: '^2.1.1',
      'tailwind-merge': '^2.6.0',
    },
    registryDependencies: ['utils'],
  },
  container: {
    name: 'container',
    label: 'Container',
    description: 'Max-width wrapper with responsive padding. Supports size presets and centering.',
    status: 'beta' as ComponentStatus,
    since: '0.2.0',
    files: [{ path: 'components/ui/container.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: {
      'class-variance-authority': '^0.7.1',
      clsx: '^2.1.1',
      'tailwind-merge': '^2.6.0',
    },
    registryDependencies: ['utils'],
  },
  heading: {
    name: 'heading',
    label: 'Heading',
    description: 'Semantic heading (h1-h6) with fluid token-based typography. Supports independent visual size override.',
    status: 'beta' as ComponentStatus,
    since: '0.2.0',
    files: [{ path: 'components/ui/heading.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: {
      'class-variance-authority': '^0.7.1',
      clsx: '^2.1.1',
      'tailwind-merge': '^2.6.0',
    },
    registryDependencies: ['utils'],
  },
  text: {
    name: 'text',
    label: 'Text',
    description: 'Paragraph text with size, weight, and color variants using design tokens.',
    status: 'beta' as ComponentStatus,
    since: '0.2.0',
    files: [{ path: 'components/ui/text.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: {
      'class-variance-authority': '^0.7.1',
      clsx: '^2.1.1',
      'tailwind-merge': '^2.6.0',
    },
    registryDependencies: ['utils'],
  },

  // Typography & Media Components
  code: {
    name: 'code',
    label: 'Code',
    description:
      'Inline code and multi-line code block components with optional language label and line numbers.',
    status: 'beta' as ComponentStatus,
    since: '0.3.0',
    files: [{ path: 'components/ui/code.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: {
      'class-variance-authority': '^0.7.1',
      clsx: '^2.1.1',
      'tailwind-merge': '^2.6.0',
    },
    registryDependencies: ['utils'],
  },
  blockquote: {
    name: 'blockquote',
    label: 'Blockquote',
    description: 'Styled quote block with accent variants and size options.',
    status: 'beta' as ComponentStatus,
    since: '0.3.0',
    files: [{ path: 'components/ui/blockquote.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: {
      'class-variance-authority': '^0.7.1',
      clsx: '^2.1.1',
      'tailwind-merge': '^2.6.0',
    },
    registryDependencies: ['utils'],
  },
  icon: {
    name: 'icon',
    label: 'Icon',
    description:
      'Icon wrapper with size and color token variants. Works with any SVG icon library.',
    status: 'beta' as ComponentStatus,
    since: '0.3.0',
    files: [{ path: 'components/ui/icon.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: {
      'class-variance-authority': '^0.7.1',
      clsx: '^2.1.1',
      'tailwind-merge': '^2.6.0',
    },
    registryDependencies: ['utils'],
  },
  image: {
    name: 'image',
    label: 'Image',
    description:
      'Enhanced image with loading skeleton, error fallback, aspect ratio, and rounded variants.',
    status: 'beta' as ComponentStatus,
    since: '0.3.0',
    files: [{ path: 'components/ui/image.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: {
      'class-variance-authority': '^0.7.1',
      clsx: '^2.1.1',
      'tailwind-merge': '^2.6.0',
    },
    registryDependencies: ['utils'],
  },

  // Overlay Components
  dialog: {
    name: 'dialog',
    label: 'Dialog',
    description: 'Modal dialog component with overlay',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/dialog.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-dialog': '^1.1.3',
      'lucide-react': '^0.468.0',
    },
    registryDependencies: ['utils'],
  },
  popover: {
    name: 'popover',
    label: 'Popover',
    description: 'Floating popover component',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/popover.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-popover': '^1.1.3',
    },
    registryDependencies: ['utils'],
  },
  tooltip: {
    name: 'tooltip',
    label: 'Tooltip',
    description: 'Tooltip component for hover information',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/tooltip.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-tooltip': '^1.1.5',
    },
    registryDependencies: ['utils'],
  },
  'dropdown-menu': {
    name: 'dropdown-menu',
    label: 'Dropdown Menu',
    description: 'Dropdown menu with submenus and actions',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/dropdown-menu.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-dropdown-menu': '^2.1.3',
      'lucide-react': '^0.468.0',
    },
    registryDependencies: ['utils'],
  },
  'context-menu': {
    name: 'context-menu',
    label: 'Context Menu',
    description: 'Right-click context menu component',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/context-menu.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-context-menu': '^2.2.3',
      'lucide-react': '^0.468.0',
    },
    registryDependencies: ['utils'],
  },
  'hover-card': {
    name: 'hover-card',
    label: 'Hover Card',
    description: 'Rich hover preview card component',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/hover-card.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-hover-card': '^1.1.3',
    },
    registryDependencies: ['utils'],
  },
  sheet: {
    name: 'sheet',
    label: 'Sheet',
    description: 'Side drawer component with multiple positions',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/sheet.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-dialog': '^1.1.3',
      'class-variance-authority': '^0.7.1',
      'lucide-react': '^0.468.0',
    },
    registryDependencies: ['utils'],
  },
  toast: {
    name: 'toast',
    label: 'Toast',
    description: 'Toast notification component',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/toast.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-toast': '^1.2.3',
      'class-variance-authority': '^0.7.1',
      'lucide-react': '^0.468.0',
    },
    registryDependencies: ['utils'],
  },
  command: {
    name: 'command',
    label: 'Command',
    description: 'Command palette with search and keyboard navigation',
    status: 'beta',
    since: '0.2.0',
    files: [{ path: 'components/ui/command.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: { 'lucide-react': '^0.468.0' },
    registryDependencies: ['utils'],
  },
  combobox: {
    name: 'combobox',
    label: 'Combobox',
    description: 'Searchable select dropdown with autocomplete',
    status: 'beta',
    since: '0.2.0',
    files: [{ path: 'components/ui/combobox.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: { 'lucide-react': '^0.468.0' },
    registryDependencies: ['utils', 'popover', 'command', 'button'],
  },

  // Display Components
  tabs: {
    name: 'tabs',
    label: 'Tabs',
    description: 'Tabbed navigation component',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/tabs.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-tabs': '^1.1.2',
    },
    registryDependencies: ['utils'],
  },
  avatar: {
    name: 'avatar',
    label: 'Avatar',
    description: 'Avatar component with image and fallback',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/avatar.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-avatar': '^1.1.2',
    },
    registryDependencies: ['utils'],
  },
  separator: {
    name: 'separator',
    label: 'Separator',
    description: 'Horizontal or vertical separator component',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/separator.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-separator': '^1.1.1',
    },
    registryDependencies: ['utils'],
  },
  progress: {
    name: 'progress',
    label: 'Progress',
    description: 'Progress bar component',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/progress.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-progress': '^1.1.1',
    },
    registryDependencies: ['utils'],
  },
  accordion: {
    name: 'accordion',
    label: 'Accordion',
    description: 'Collapsible accordion sections',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/accordion.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-accordion': '^1.2.2',
      'lucide-react': '^0.468.0',
    },
    registryDependencies: ['utils'],
  },
  collapsible: {
    name: 'collapsible',
    label: 'Collapsible',
    description: 'Generic collapsible wrapper component',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/collapsible.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-collapsible': '^1.1.2',
    },
    registryDependencies: ['utils'],
  },
  'scroll-area': {
    name: 'scroll-area',
    label: 'Scroll Area',
    description: 'Custom scrollbar wrapper component',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/scroll-area.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-scroll-area': '^1.2.1',
    },
    registryDependencies: ['utils'],
  },
  'aspect-ratio': {
    name: 'aspect-ratio',
    label: 'Aspect Ratio',
    description: 'Aspect ratio container component',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/aspect-ratio.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-aspect-ratio': '^1.1.1',
    },
  },
  'visually-hidden': {
    name: 'visually-hidden',
    label: 'Visually Hidden',
    description: 'Screen reader only content component',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/visually-hidden.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-visually-hidden': '^1.1.1',
    },
    registryDependencies: ['utils'],
  },
  card: {
    name: 'card',
    label: 'Card',
    description: 'Content container with header, content, and footer sections',
    status: 'beta',
    since: '0.2.0',
    files: [
      {
        path: 'components/ui/card.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {},
    registryDependencies: ['utils'],
  },
  badge: {
    name: 'badge',
    label: 'Badge',
    description: 'Status badge with multiple variants',
    status: 'beta',
    since: '0.2.0',
    files: [
      {
        path: 'components/ui/badge.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      'class-variance-authority': '^0.7.1',
    },
    registryDependencies: ['utils'],
  },
  alert: {
    name: 'alert',
    label: 'Alert',
    description: 'Persistent message with info, warning, error, success variants',
    status: 'beta',
    since: '0.2.0',
    files: [
      {
        path: 'components/ui/alert.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      'class-variance-authority': '^0.7.1',
    },
    registryDependencies: ['utils'],
  },
  skeleton: {
    name: 'skeleton',
    label: 'Skeleton',
    description: 'Loading placeholder with pulse animation',
    status: 'beta',
    since: '0.2.0',
    files: [
      {
        path: 'components/ui/skeleton.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {},
    registryDependencies: ['utils'],
  },
  spinner: {
    name: 'spinner',
    label: 'Spinner',
    description: 'Loading indicator with size variants',
    status: 'beta',
    since: '0.2.0',
    files: [
      {
        path: 'components/ui/spinner.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      'class-variance-authority': '^0.7.1',
    },
    registryDependencies: ['utils'],
  },
  table: {
    name: 'table',
    label: 'Table',
    description: 'Styled HTML table with header, body, footer, and caption',
    status: 'beta',
    since: '0.2.0',
    files: [{ path: 'components/ui/table.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: {},
    registryDependencies: ['utils'],
  },
  calendar: {
    name: 'calendar',
    label: 'Calendar',
    description: 'Grid calendar with date selection and navigation',
    status: 'beta',
    since: '0.2.0',
    files: [{ path: 'components/ui/calendar.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: { 'lucide-react': '^0.468.0' },
    registryDependencies: ['utils'],
  },
  'date-picker': {
    name: 'date-picker',
    label: 'Date Picker',
    description: 'Date selection with popover calendar',
    status: 'beta',
    since: '0.2.0',
    files: [{ path: 'components/ui/date-picker.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: { 'lucide-react': '^0.468.0' },
    registryDependencies: ['utils', 'popover', 'calendar', 'button'],
  },
  'data-table': {
    name: 'data-table',
    label: 'Data Table',
    description: 'Advanced table with sorting, pagination, and row selection',
    status: 'beta',
    since: '0.2.0',
    files: [{ path: 'components/ui/data-table.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: { 'lucide-react': '^0.468.0' },
    registryDependencies: ['utils'],
  },

  // Navigation Components
  'navigation-menu': {
    name: 'navigation-menu',
    label: 'Navigation Menu',
    description: 'Complex navigation menu with dropdowns',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/navigation-menu.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-navigation-menu': '^1.2.2',
      'lucide-react': '^0.468.0',
      'class-variance-authority': '^0.7.1',
    },
    registryDependencies: ['utils'],
  },
  menubar: {
    name: 'menubar',
    label: 'Menubar',
    description: 'Application menu bar component',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/menubar.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-menubar': '^1.1.3',
      'lucide-react': '^0.468.0',
    },
    registryDependencies: ['utils'],
  },
  breadcrumb: {
    name: 'breadcrumb',
    label: 'Breadcrumb',
    description: 'Navigation breadcrumb with customizable separator',
    status: 'beta',
    since: '0.2.0',
    files: [
      {
        path: 'components/ui/breadcrumb.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-slot': '^1.1.1',
      'lucide-react': '^0.468.0',
    },
    registryDependencies: ['utils'],
  },
  pagination: {
    name: 'pagination',
    label: 'Pagination',
    description: 'Page navigation with previous, next, and ellipsis',
    status: 'beta',
    since: '0.2.0',
    files: [
      {
        path: 'components/ui/pagination.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      'lucide-react': '^0.468.0',
    },
    registryDependencies: ['utils'],
  },

  // Grouping Components
  'toggle-group': {
    name: 'toggle-group',
    label: 'Toggle Group',
    description: 'Multi-toggle button group component',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/toggle-group.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-toggle-group': '^1.1.1',
      'class-variance-authority': '^0.7.1',
    },
    registryDependencies: ['utils'],
  },
  toolbar: {
    name: 'toolbar',
    label: 'Toolbar',
    description: 'Action toolbar component with separators',
    status: 'stable',
    since: '0.1.0',
    files: [
      {
        path: 'components/ui/toolbar.tsx',

        type: 'component',
      },
    ],
    dependencies: [],
    npmDependencies: {
      '@radix-ui/react-toolbar': '^1.1.1',
    },
    registryDependencies: ['utils'],
  },

  // Composition Components
  'search-bar': {
    name: 'search-bar',
    label: 'SearchBar',
    description: 'Search input with icon, clear button, loading state, and keyboard shortcut hint.',
    status: 'beta' as ComponentStatus,
    since: '0.3.0',
    files: [{ path: 'components/ui/search-bar.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: {
      'clsx': '^2.1.1',
      'tailwind-merge': '^2.6.0',
    },
    registryDependencies: ['utils'],
  },
  'confirm-dialog': {
    name: 'confirm-dialog',
    label: 'ConfirmDialog',
    description: 'Pre-built confirmation dialog with title, description, and confirm/cancel actions.',
    status: 'beta' as ComponentStatus,
    since: '0.3.0',
    files: [{ path: 'components/ui/confirm-dialog.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: {
      'clsx': '^2.1.1',
      'tailwind-merge': '^2.6.0',
    },
    registryDependencies: ['utils'],
  },
  'user-menu': {
    name: 'user-menu',
    label: 'UserMenu',
    description: 'Avatar-triggered dropdown menu with user info header and grouped menu items.',
    status: 'beta' as ComponentStatus,
    since: '0.3.0',
    files: [{ path: 'components/ui/user-menu.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: {
      'clsx': '^2.1.1',
      'tailwind-merge': '^2.6.0',
    },
    registryDependencies: ['utils'],
  },

  // Advanced Input Components
  'date-range-picker': {
    name: 'date-range-picker',
    label: 'DateRangePicker',
    description: 'Date range selection with built-in calendar dropdown. Two-step from/to selection with min/max constraints.',
    status: 'beta' as ComponentStatus,
    since: '0.3.0',
    files: [{ path: 'components/ui/date-range-picker.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: {
      'clsx': '^2.1.1',
      'tailwind-merge': '^2.6.0',
    },
    registryDependencies: ['utils'],
  },
  'time-picker': {
    name: 'time-picker',
    label: 'TimePicker',
    description: 'Time selection with hour/minute selects, 12/24h format, and configurable minute step.',
    status: 'beta' as ComponentStatus,
    since: '0.3.0',
    files: [{ path: 'components/ui/time-picker.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: {
      'clsx': '^2.1.1',
      'tailwind-merge': '^2.6.0',
    },
    registryDependencies: ['utils'],
  },
  'color-picker': {
    name: 'color-picker',
    label: 'ColorPicker',
    description: 'Color selection with native input, text entry, and preset swatches.',
    status: 'beta' as ComponentStatus,
    since: '0.3.0',
    files: [{ path: 'components/ui/color-picker.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: {
      'clsx': '^2.1.1',
      'tailwind-merge': '^2.6.0',
    },
    registryDependencies: ['utils'],
  },
  'file-upload': {
    name: 'file-upload',
    label: 'FileUpload',
    description: 'Drag-and-drop file upload with preview thumbnails, size validation, and remove.',
    status: 'beta' as ComponentStatus,
    since: '0.3.0',
    files: [{ path: 'components/ui/file-upload.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: {
      'clsx': '^2.1.1',
      'tailwind-merge': '^2.6.0',
    },
    registryDependencies: ['utils'],
  },

  // Accessibility Components
  'focus-trap': {
    name: 'focus-trap',
    label: 'FocusTrap',
    description: 'Traps keyboard focus within a container. Supports Tab wrapping, initial focus, escape key, and focus restoration.',
    status: 'beta' as ComponentStatus,
    since: '0.3.0',
    files: [{ path: 'components/ui/focus-trap.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: {
      'clsx': '^2.1.1',
      'tailwind-merge': '^2.6.0',
    },
    registryDependencies: ['utils'],
  },
  'skip-nav': {
    name: 'skip-nav',
    label: 'SkipNav',
    description: 'Skip to main content link. Visually hidden until focused for keyboard navigation.',
    status: 'beta' as ComponentStatus,
    since: '0.3.0',
    files: [{ path: 'components/ui/skip-nav.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: {
      'clsx': '^2.1.1',
      'tailwind-merge': '^2.6.0',
    },
    registryDependencies: ['utils'],
  },
  announcement: {
    name: 'announcement',
    label: 'Announcement',
    description: 'Screen reader live region for dynamic announcements with polite/assertive modes.',
    status: 'beta' as ComponentStatus,
    since: '0.3.0',
    files: [{ path: 'components/ui/announcement.tsx', type: 'component' }],
    dependencies: [],
    npmDependencies: {
      'clsx': '^2.1.1',
      'tailwind-merge': '^2.6.0',
    },
    registryDependencies: ['utils'],
  },
};

export function getComponent(name: string): ComponentRegistryItem | undefined {
  return REGISTRY[name];
}

export function getAllComponents(): ComponentRegistryItem[] {
  return Object.values(REGISTRY);
}

export function resolveComponentDependencies(name: string): string[] {
  const component = getComponent(name);
  if (!component) return [];

  const deps = new Set<string>([name]);

  function addDeps(compName: string) {
    const comp = getComponent(compName);
    if (!comp) return;

    comp.registryDependencies?.forEach((dep) => {
      if (!deps.has(dep)) {
        deps.add(dep);
        addDeps(dep);
      }
    });
  }

  addDeps(name);

  return Array.from(deps);
}
