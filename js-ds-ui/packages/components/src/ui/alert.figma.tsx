import figma from '@figma/code-connect';
import { Alert, AlertTitle, AlertDescription } from './alert';

figma.connect(Alert, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    variant: figma.enum('Variant', {
      Default: 'default',
      Info: 'info',
      Warning: 'warning',
      Error: 'error',
      Success: 'success',
    }),
    title: figma.string('Title'),
    description: figma.string('Description'),
  },
  example: ({ variant, title, description }) => (
    <Alert variant={variant}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  ),
});
