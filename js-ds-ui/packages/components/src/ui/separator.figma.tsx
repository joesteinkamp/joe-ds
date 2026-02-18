import figma from '@figma/code-connect';
import { Separator } from './separator';

figma.connect(Separator, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    orientation: figma.enum('Orientation', {
      Horizontal: 'horizontal',
      Vertical: 'vertical',
    }),
  },
  example: ({ orientation }) => <Separator orientation={orientation} />,
});
