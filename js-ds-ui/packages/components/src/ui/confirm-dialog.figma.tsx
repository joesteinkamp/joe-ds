import figma from '@figma/code-connect';
import { ConfirmDialog } from './confirm-dialog';

figma.connect(ConfirmDialog, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    title: figma.string('Title'),
    description: figma.string('Description'),
    variant: figma.enum('Variant', { Default: 'default', Danger: 'danger' }),
    confirmText: figma.string('Confirm Text'),
    cancelText: figma.string('Cancel Text'),
  },
  example: ({ title, description, variant, confirmText, cancelText }) => (
    <ConfirmDialog
      open
      title={title}
      description={description}
      variant={variant}
      confirmText={confirmText}
      cancelText={cancelText}
    />
  ),
});
