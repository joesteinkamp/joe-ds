import figma from '@figma/code-connect';
import { Code, CodeBlock } from './code';

figma.connect(Code, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    variant: figma.enum('Variant', {
      Default: 'default',
      Ghost: 'ghost',
    }),
  },
  example: ({ variant }) => (
    <Code variant={variant}>useState()</Code>
  ),
});

figma.connect(CodeBlock, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {
    variant: figma.enum('Variant', {
      Default: 'default',
      Dark: 'dark',
    }),
    language: figma.string('Language'),
    showLineNumbers: figma.boolean('Show Line Numbers'),
    children: figma.string('Code'),
  },
  example: ({ variant, language, showLineNumbers, children }) => (
    <CodeBlock variant={variant} language={language} showLineNumbers={showLineNumbers}>
      {children}
    </CodeBlock>
  ),
});
