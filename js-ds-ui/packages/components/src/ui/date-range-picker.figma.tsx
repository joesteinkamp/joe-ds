import figma from '@figma/code-connect';
import { DateRangePicker } from './date-range-picker';

figma.connect(DateRangePicker, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    disabled: figma.boolean('Disabled'),
    startPlaceholder: figma.string('Start Placeholder'),
    endPlaceholder: figma.string('End Placeholder'),
  },
  example: ({ disabled, startPlaceholder, endPlaceholder }) => (
    <DateRangePicker disabled={disabled} startPlaceholder={startPlaceholder} endPlaceholder={endPlaceholder} />
  ),
});
