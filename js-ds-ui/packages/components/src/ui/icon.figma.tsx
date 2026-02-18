import figma from '@figma/code-connect';
import { Icon } from './icon';

figma.connect(Icon, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    size: figma.enum('Size', {
      'Extra Small': 'xs',
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
      'Extra Large': 'xl',
    }),
    color: figma.enum('Color', {
      Current: 'current',
      Primary: 'primary',
      Secondary: 'secondary',
      Tertiary: 'tertiary',
      Accent: 'accent',
      Success: 'success',
      Warning: 'warning',
      Error: 'error',
      Info: 'info',
    }),
  },
  example: ({ size, color }) => (
    <Icon size={size} color={color}>
      {/* Replace with your icon */}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="10" />
      </svg>
    </Icon>
  ),
});
