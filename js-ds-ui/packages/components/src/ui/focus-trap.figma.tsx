import figma from '@figma/code-connect';
import { FocusTrap } from './focus-trap';

figma.connect(FocusTrap, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    active: figma.boolean('Active'),
  },
  example: ({ active }) => (
    <FocusTrap active={active}>
      <div>Trapped content</div>
    </FocusTrap>
  ),
});
