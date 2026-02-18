import figma from '@figma/code-connect';
import { ColorPicker } from './color-picker';

figma.connect(ColorPicker, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    label: figma.string('Label'),
    disabled: figma.boolean('Disabled'),
    value: figma.string('Value'),
  },
  example: ({ label, disabled, value }) => (
    <ColorPicker value={value} label={label} disabled={disabled} />
  ),
});
