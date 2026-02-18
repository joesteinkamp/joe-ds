import figma from '@figma/code-connect';
import { Progress } from './progress';

figma.connect(Progress, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    value: figma.number('Value'),
  },
  example: ({ value }) => <Progress value={value} />,
});
