import figma from '@figma/code-connect';
import { Badge } from './badge';

figma.connect(Badge, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    variant: figma.enum('Variant', {
      Default: 'default',
      Secondary: 'secondary',
      Outline: 'outline',
      Destructive: 'destructive',
      Success: 'success',
      Warning: 'warning',
    }),
    label: figma.string('Label'),
  },
  example: ({ variant, label }) => (
    <Badge variant={variant}>{label}</Badge>
  ),
});
