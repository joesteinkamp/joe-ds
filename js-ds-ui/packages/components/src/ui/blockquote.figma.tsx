import figma from '@figma/code-connect';
import { Blockquote } from './blockquote';

figma.connect(Blockquote, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    variant: figma.enum('Variant', {
      Default: 'default',
      Accent: 'accent',
      Success: 'success',
      Warning: 'warning',
      Error: 'error',
    }),
    size: figma.enum('Size', {
      Small: 'sm',
      Base: 'base',
      Large: 'lg',
    }),
    children: figma.string('Content'),
  },
  example: ({ variant, size, children }) => (
    <Blockquote variant={variant} size={size}>
      {children}
    </Blockquote>
  ),
});
