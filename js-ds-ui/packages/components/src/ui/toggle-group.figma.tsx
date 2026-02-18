import figma from '@figma/code-connect';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

figma.connect(ToggleGroup, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    type: figma.enum('Type', {
      Single: 'single',
      Multiple: 'multiple',
    }),
    variant: figma.enum('Variant', {
      Primary: 'primary',
      Outline: 'outline',
      Ghost: 'ghost',
    }),
    size: figma.enum('Size', {
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
    }),
  },
  example: ({ type, variant, size }) => (
    <ToggleGroup type={type} variant={variant} size={size}>
      <ToggleGroupItem value="a">A</ToggleGroupItem>
      <ToggleGroupItem value="b">B</ToggleGroupItem>
      <ToggleGroupItem value="c">C</ToggleGroupItem>
    </ToggleGroup>
  ),
});
