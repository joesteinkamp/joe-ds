import figma from '@figma/code-connect';
import { Text } from './text';

figma.connect(Text, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    size: figma.enum('Size', {
      XS: 'xs',
      SM: 'sm',
      Base: 'base',
      LG: 'lg',
      XL: 'xl',
    }),
    weight: figma.enum('Weight', {
      Normal: 'normal',
      Medium: 'medium',
      Semibold: 'semibold',
      Bold: 'bold',
    }),
    color: figma.enum('Color', {
      Primary: 'primary',
      Secondary: 'secondary',
      Tertiary: 'tertiary',
    }),
    children: figma.string('Text'),
  },
  example: ({ size, weight, color, children }) => (
    <Text size={size} weight={weight} color={color}>{children}</Text>
  ),
});
