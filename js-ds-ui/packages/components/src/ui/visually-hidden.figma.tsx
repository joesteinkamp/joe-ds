import figma from '@figma/code-connect';
import { VisuallyHidden } from './visually-hidden';

figma.connect(VisuallyHidden, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {},
  example: () => <VisuallyHidden>Screen reader text</VisuallyHidden>,
});
