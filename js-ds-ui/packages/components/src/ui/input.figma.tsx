import figma from '@figma/code-connect';
import { Input } from './input';

figma.connect(Input, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    type: figma.enum('Type', {
      Text: 'text',
      Email: 'email',
      Password: 'password',
      Search: 'search',
    }),
    placeholder: figma.string('Placeholder'),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ type, placeholder, disabled }) => (
    <Input type={type} placeholder={placeholder} disabled={disabled} />
  ),
});
