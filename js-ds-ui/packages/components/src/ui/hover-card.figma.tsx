import figma from '@figma/code-connect';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './hover-card';

figma.connect(HoverCard, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {},
  example: () => (
    <HoverCard>
      <HoverCardTrigger>Hover over me</HoverCardTrigger>
      <HoverCardContent>
        <p>Hover card content goes here</p>
      </HoverCardContent>
    </HoverCard>
  ),
});
