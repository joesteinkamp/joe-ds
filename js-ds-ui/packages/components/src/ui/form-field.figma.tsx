import figma from '@figma/code-connect';
import {
  FormField,
  FormLabel,
  FormControl,
  FormHelperText,
  FormErrorMessage,
} from './form-field';

figma.connect(FormField, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    label: figma.string('Label'),
    helperText: figma.string('Helper Text'),
    error: figma.string('Error'),
  },
  example: ({ label, helperText, error }) => (
    <FormField id="field-id" helperText={helperText} error={error}>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <input type="text" placeholder="Enter value..." />
      </FormControl>
      <FormHelperText />
      <FormErrorMessage />
    </FormField>
  ),
});
