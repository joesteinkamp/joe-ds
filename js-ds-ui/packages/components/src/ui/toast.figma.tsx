import figma from '@figma/code-connect';
import { Toast, ToastTitle, ToastDescription, ToastAction } from './toast';

figma.connect(Toast, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    variant: figma.enum('Variant', {
      Default: 'default',
      Success: 'success',
      Error: 'error',
      Warning: 'warning',
    }),
    title: figma.string('Title'),
    description: figma.string('Description'),
  },
  example: ({ variant, title, description }) => (
    <Toast variant={variant}>
      <ToastTitle>{title}</ToastTitle>
      <ToastDescription>{description}</ToastDescription>
      <ToastAction altText="Undo">Undo</ToastAction>
    </Toast>
  ),
});
