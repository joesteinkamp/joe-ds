import figma from '@figma/code-connect';
import { Stack } from './stack';

figma.connect(Stack, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    direction: figma.enum('Direction', {
      Vertical: 'vertical',
      Horizontal: 'horizontal',
    }),
    spacing: figma.enum('Spacing', {
      None: 'none',
      XS: 'xs',
      SM: 'sm',
      MD: 'md',
      LG: 'lg',
      XL: 'xl',
    }),
    align: figma.enum('Align', {
      Start: 'start',
      Center: 'center',
      End: 'end',
      Stretch: 'stretch',
    }),
    children: figma.children('*'),
  },
  example: ({ direction, spacing, align, children }) => (
    <Stack direction={direction} spacing={spacing} align={align}>
      {children}
    </Stack>
  ),
});
