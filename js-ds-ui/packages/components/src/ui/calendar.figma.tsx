import figma from '@figma/code-connect';
import { Calendar } from './calendar';

figma.connect(Calendar, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {},
  example: () => <Calendar />,
});
