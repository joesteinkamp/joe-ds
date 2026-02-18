import figma from '@figma/code-connect';
import { Slider } from './slider';

figma.connect(Slider, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    disabled: figma.boolean('Disabled'),
  },
  example: ({ disabled }) => (
    <Slider defaultValue={[50]} max={100} step={1} disabled={disabled} />
  ),
});
