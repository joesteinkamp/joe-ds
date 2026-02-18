import figma from '@figma/code-connect';
import { Switch } from './switch';

figma.connect(Switch, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    checked: figma.boolean('Checked'),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ checked, disabled }) => (
    <Switch checked={checked} disabled={disabled} />
  ),
});
