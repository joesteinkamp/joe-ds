import figma from '@figma/code-connect';
import { FileUpload } from './file-upload';

figma.connect(FileUpload, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    multiple: figma.boolean('Multiple'),
    disabled: figma.boolean('Disabled'),
    description: figma.string('Description'),
  },
  example: ({ multiple, disabled, description }) => (
    <FileUpload multiple={multiple} disabled={disabled} description={description} />
  ),
});
