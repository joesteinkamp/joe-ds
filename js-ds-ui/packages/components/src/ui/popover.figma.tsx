import figma from '@figma/code-connect';
import { Popover, PopoverTrigger, PopoverContent } from './popover';

figma.connect(Popover, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    side: figma.enum('Side', {
      Top: 'top',
      Right: 'right',
      Bottom: 'bottom',
      Left: 'left',
    }),
    align: figma.enum('Align', {
      Start: 'start',
      Center: 'center',
      End: 'end',
    }),
  },
  example: ({ side, align }) => (
    <Popover>
      <PopoverTrigger>Open Popover</PopoverTrigger>
      <PopoverContent side={side} align={align}>
        <p>Popover content goes here</p>
      </PopoverContent>
    </Popover>
  ),
});
