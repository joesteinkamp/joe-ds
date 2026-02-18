import figma from '@figma/code-connect';
import { Skeleton } from './skeleton';

figma.connect(Skeleton, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {},
  example: () => (
    <Skeleton className="h-4 w-[250px]" />
  ),
});
