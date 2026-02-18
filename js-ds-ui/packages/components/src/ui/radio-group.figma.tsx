import figma from '@figma/code-connect';
import { RadioGroup, RadioGroupItem } from './radio-group';

figma.connect(RadioGroup, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    disabled: figma.boolean('Disabled'),
  },
  example: ({ disabled }) => (
    <RadioGroup defaultValue="option-one" disabled={disabled}>
      <RadioGroupItem value="option-one" id="option-one" />
      <RadioGroupItem value="option-two" id="option-two" />
      <RadioGroupItem value="option-three" id="option-three" />
    </RadioGroup>
  ),
});
