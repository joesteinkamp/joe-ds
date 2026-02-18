import figma from '@figma/code-connect';
import { Form, FormMessage, FormSubmit } from './form';

figma.connect(Form, 'https://www.figma.com/design/YOUR_FILE_ID/js-ds-ui?node-id=PASTE_NODE_ID', {
  props: {},
  example: () => (
    <Form onSubmit={(e) => console.log('submitted', e)}>
      <input name="email" type="email" placeholder="Email" />
      <FormMessage name="email" />
      <FormSubmit>Submit</FormSubmit>
    </Form>
  ),
});
