import figma from '@figma/code-connect';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from './collapsible';

figma.connect(Collapsible, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    open: figma.boolean('Open'),
  },
  example: ({ open }) => (
    <Collapsible open={open}>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent>
        <p>Collapsible content goes here</p>
      </CollapsibleContent>
    </Collapsible>
  ),
});
