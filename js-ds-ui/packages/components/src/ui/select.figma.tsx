import figma from '@figma/code-connect';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './select';

figma.connect(Select, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    placeholder: figma.string('Placeholder'),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ placeholder, disabled }) => (
    <Select disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option-one">Option One</SelectItem>
        <SelectItem value="option-two">Option Two</SelectItem>
        <SelectItem value="option-three">Option Three</SelectItem>
      </SelectContent>
    </Select>
  ),
});
