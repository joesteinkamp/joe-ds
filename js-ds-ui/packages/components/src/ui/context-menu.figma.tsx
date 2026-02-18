import figma from '@figma/code-connect';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from './context-menu';

figma.connect(ContextMenu, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    items: figma.children('Item*'),
  },
  example: ({ items }) => (
    <ContextMenu>
      <ContextMenuTrigger>Right click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Item One</ContextMenuItem>
        <ContextMenuItem>Item Two</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Item Three</ContextMenuItem>
        {items}
      </ContextMenuContent>
    </ContextMenu>
  ),
});
