import figma from '@figma/code-connect';
import { TimePicker } from './time-picker';

figma.connect(TimePicker, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    use12Hour: figma.boolean('12 Hour'),
    disabled: figma.boolean('Disabled'),
    value: figma.string('Value'),
  },
  example: ({ use12Hour, disabled, value }) => (
    <TimePicker value={value} use12Hour={use12Hour} disabled={disabled} />
  ),
});
