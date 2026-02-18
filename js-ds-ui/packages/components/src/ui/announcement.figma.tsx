import figma from '@figma/code-connect';
import { Announcement } from './announcement';

figma.connect(Announcement, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    message: figma.string('Message'),
    politeness: figma.enum('Politeness', { Polite: 'polite', Assertive: 'assertive' }),
  },
  example: ({ message, politeness }) => (
    <Announcement message={message} politeness={politeness} />
  ),
});
