import { test, expect } from '@playwright/test';

const STORYBOOK_URL = 'http://localhost:6006';

function storyUrl(
  storyId: string,
  globals?: { theme?: string; density?: string }
): string {
  let url = `${STORYBOOK_URL}/iframe.html?id=${storyId}`;
  if (globals) {
    const pairs = Object.entries(globals)
      .map(([key, value]) => `${key}:${value}`)
      .join(';');
    url += `&globals=${pairs}`;
  }
  return url;
}

const components = [
  { name: 'button', storyId: 'forms-button--default' },
  { name: 'input', storyId: 'forms-input--default' },
  { name: 'card', storyId: 'display-card--default' },
  { name: 'badge', storyId: 'display-badge--default' },
  { name: 'checkbox', storyId: 'forms-checkbox--default' },
  { name: 'switch', storyId: 'forms-switch--default' },
  { name: 'alert', storyId: 'feedback-alert--default' },
] as const;

const themes = ['light', 'dark'] as const;

for (const component of components) {
  for (const theme of themes) {
    test(`${component.name} — ${theme} theme`, async ({ page }) => {
      await page.goto(storyUrl(component.storyId, { theme }));
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot(
        `${component.name}-${theme}.png`
      );
    });
  }
}
