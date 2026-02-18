import figma from '@figma/code-connect';
import { ScrollArea, ScrollBar } from './scroll-area';

figma.connect(ScrollArea, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {},
  example: () => (
    <ScrollArea className="h-72 w-48">
      {/* Scrollable content */}
    </ScrollArea>
  ),
});
