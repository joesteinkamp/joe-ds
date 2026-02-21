import type { Config } from "tailwindcss";

const config: Config = {
  // Only scan DS component sources — docs site uses plain CSS utilities
  content: [
    "../js-ds-ui/packages/components/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
