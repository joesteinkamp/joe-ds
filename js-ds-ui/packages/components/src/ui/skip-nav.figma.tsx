import figma from '@figma/code-connect';
import { SkipNavLink, SkipNavContent } from './skip-nav';

figma.connect(SkipNavLink, 'FIGMA_URL_PLACEHOLDER', {
  props: {},
  example: () => (
    <>
      <SkipNavLink />
      <SkipNavContent>
        <main>Page content</main>
      </SkipNavContent>
    </>
  ),
});
