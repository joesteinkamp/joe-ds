import figma from '@figma/code-connect';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './dropdown-menu';

figma.connect(DropdownMenu, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    items: figma.children('Item*'),
  },
  example: ({ items }) => (
    <DropdownMenu>
      <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Item One</DropdownMenuItem>
        <DropdownMenuItem>Item Two</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Item Three</DropdownMenuItem>
        {items}
      </DropdownMenuContent>
    </DropdownMenu>
  ),
});
