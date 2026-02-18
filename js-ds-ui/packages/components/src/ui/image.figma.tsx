import figma from '@figma/code-connect';
import { Image } from './image';

figma.connect(Image, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    rounded: figma.enum('Rounded', {
      None: 'none',
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
      'Extra Large': 'xl',
      Full: 'full',
    }),
    fit: figma.enum('Fit', {
      Cover: 'cover',
      Contain: 'contain',
      Fill: 'fill',
      None: 'none',
      'Scale Down': 'scale-down',
    }),
    aspectRatio: figma.string('Aspect Ratio'),
  },
  example: ({ rounded, fit, aspectRatio }) => (
    <Image
      src="/photo.jpg"
      alt="Description"
      rounded={rounded}
      fit={fit}
      aspectRatio={aspectRatio}
    />
  ),
});
