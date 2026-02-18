import figma from '@figma/code-connect';
import { Textarea } from './textarea';

figma.connect(Textarea, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    placeholder: figma.string('Placeholder'),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ placeholder, disabled }) => (
    <Textarea placeholder={placeholder} disabled={disabled} />
  ),
});
