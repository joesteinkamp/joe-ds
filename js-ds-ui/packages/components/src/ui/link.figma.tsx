import figma from '@figma/code-connect';
import { Link } from './link';

figma.connect(Link, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    label: figma.string('Label'),
    external: figma.boolean('External'),
  },
  example: ({ label, external }) => (
    <Link href="#" external={external}>{label}</Link>
  ),
});
