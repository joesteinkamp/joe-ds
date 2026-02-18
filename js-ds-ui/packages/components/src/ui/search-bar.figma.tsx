import figma from '@figma/code-connect';
import { SearchBar } from './search-bar';

figma.connect(SearchBar, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    placeholder: figma.string('Placeholder'),
    shortcutHint: figma.string('Shortcut'),
    loading: figma.boolean('Loading'),
  },
  example: ({ placeholder, shortcutHint, loading }) => (
    <SearchBar placeholder={placeholder} shortcutHint={shortcutHint} loading={loading} />
  ),
});
