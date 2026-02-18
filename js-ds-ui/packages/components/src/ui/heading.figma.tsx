import figma from '@figma/code-connect';
import { Heading } from './heading';

figma.connect(Heading, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    level: figma.enum('Level', {
      H1: 1,
      H2: 2,
      H3: 3,
      H4: 4,
      H5: 5,
      H6: 6,
    }),
    weight: figma.enum('Weight', {
      Normal: 'normal',
      Medium: 'medium',
      Semibold: 'semibold',
      Bold: 'bold',
    }),
    children: figma.string('Text'),
  },
  example: ({ level, weight, children }) => (
    <Heading level={level} weight={weight}>{children}</Heading>
  ),
});
