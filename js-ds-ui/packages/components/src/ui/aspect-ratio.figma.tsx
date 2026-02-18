import figma from '@figma/code-connect';
import { AspectRatio } from './aspect-ratio';

figma.connect(AspectRatio, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    ratio: figma.number('Ratio'),
  },
  example: ({ ratio }) => (
    <AspectRatio ratio={ratio}>
      {/* Content */}
    </AspectRatio>
  ),
});
