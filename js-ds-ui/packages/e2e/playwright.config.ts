import { defineConfig, devices } from '@playwright/test';

const STORYBOOK_URL = process.env.STORYBOOK_URL || 'http://localhost:6006';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['github']]
    : [['html', { open: 'on-failure' }]],

  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },

  use: {
    baseURL: STORYBOOK_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  // Start Storybook before running tests (if not already running)
  webServer: {
    command: 'pnpm --filter @js-ds-ui/components storybook --ci',
    url: STORYBOOK_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },

  projects: [
    // ── Desktop browsers ──
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // ── Mobile viewports ──
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
    },

    // ── Visual regression (Chromium only) ──
    {
      name: 'visual-regression',
      testMatch: 'visual-regression.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
