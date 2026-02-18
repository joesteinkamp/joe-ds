import figma from '@figma/code-connect';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';

figma.connect(Avatar, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    src: figma.string('Src'),
    fallback: figma.string('Fallback'),
  },
  example: ({ src, fallback }) => (
    <Avatar>
      <AvatarImage src={src} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  ),
});
