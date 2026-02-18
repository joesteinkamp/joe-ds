import type { Preview } from '@storybook/react';

// Token CSS (primitives → semantic → components cascade)
import '../../tokens/dist/primitives.css';
import '../../tokens/dist/semantic.css';
import '../../tokens/dist/components.css';

// Base styles (layers, container queries, utilities)
import '../src/styles/base.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
  },
  globalTypes: {
    theme: {
      description: 'Theme mode',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'high-contrast', title: 'High Contrast', icon: 'eye' },
        ],
        dynamicTitle: true,
      },
    },
    density: {
      description: 'Density level',
      toolbar: {
        title: 'Density',
        icon: 'component',
        items: [
          { value: 'compact', title: 'Compact' },
          { value: 'default', title: 'Default' },
          { value: 'comfortable', title: 'Comfortable' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    density: 'default',
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';
      const density = context.globals.density || 'default';

      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.setAttribute('data-density', density);

      // Set color-scheme so browser chrome (scrollbars, form controls) matches
      document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light';

      return Story();
    },
  ],
};

export default preview;
