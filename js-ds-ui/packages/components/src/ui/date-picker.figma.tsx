import figma from '@figma/code-connect';
import { DatePicker } from './date-picker';

figma.connect(DatePicker, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    placeholder: figma.string('Placeholder'),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ placeholder, disabled }) => (
    <DatePicker placeholder={placeholder} disabled={disabled} />
  ),
});
