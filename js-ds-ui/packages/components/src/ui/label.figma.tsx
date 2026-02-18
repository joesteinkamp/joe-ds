import figma from '@figma/code-connect';
import { Label } from './label';

figma.connect(Label, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    text: figma.string('Text'),
  },
  example: ({ text }) => <Label>{text}</Label>,
});
