import figma from '@figma/code-connect';
import { Container } from './container';

figma.connect(Container, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    size: figma.enum('Size', {
      SM: 'sm',
      MD: 'md',
      LG: 'lg',
      XL: 'xl',
      '2XL': '2xl',
      Full: 'full',
      Prose: 'prose',
    }),
    children: figma.children('*'),
  },
  example: ({ size, children }) => (
    <Container size={size}>{children}</Container>
  ),
});
