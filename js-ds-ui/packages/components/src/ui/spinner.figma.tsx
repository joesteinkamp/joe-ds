import figma from '@figma/code-connect';
import { Spinner } from './spinner';

figma.connect(Spinner, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    size: figma.enum('Size', {
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
      XL: 'xl',
    }),
    label: figma.string('Label'),
  },
  example: ({ size, label }) => (
    <Spinner size={size} label={label} />
  ),
});
