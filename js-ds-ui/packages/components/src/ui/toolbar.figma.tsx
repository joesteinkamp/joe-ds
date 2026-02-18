import figma from '@figma/code-connect';
import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from './toolbar';

figma.connect(Toolbar, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {},
  example: () => (
    <Toolbar>
      <ToolbarToggleGroup type="multiple">
        <ToolbarToggleItem value="bold">Bold</ToolbarToggleItem>
        <ToolbarToggleItem value="italic">Italic</ToolbarToggleItem>
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarButton>Action</ToolbarButton>
    </Toolbar>
  ),
});
