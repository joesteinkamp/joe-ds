import figma from '@figma/code-connect';
import { Checkbox } from './checkbox';

figma.connect(Checkbox, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    checked: figma.boolean('Checked'),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ checked, disabled }) => (
    <Checkbox checked={checked} disabled={disabled} />
  ),
});
