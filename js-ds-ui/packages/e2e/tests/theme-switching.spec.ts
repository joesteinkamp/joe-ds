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

test.describe('Theme switching', () => {
  test('renders Button story in light mode by default', async ({ page }) => {
    await page.goto(storyUrl('forms-button--default', { theme: 'light' }));
    const button = page.locator('button');
    await expect(button).toBeVisible();
  });

  test('switches to dark theme via URL globals', async ({ page }) => {
    await page.goto(storyUrl('forms-button--default', { theme: 'dark' }));
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });

  test('switches to high-contrast theme via URL globals', async ({ page }) => {
    await page.goto(
      storyUrl('forms-button--default', { theme: 'high-contrast' })
    );
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'high-contrast');
  });

  test('cycles through all three themes in sequence', async ({ page }) => {
    const html = page.locator('html');

    await page.goto(storyUrl('forms-button--default', { theme: 'light' }));
    await expect(html).toHaveAttribute('data-theme', 'light');

    await page.goto(storyUrl('forms-button--default', { theme: 'dark' }));
    await expect(html).toHaveAttribute('data-theme', 'dark');

    await page.goto(
      storyUrl('forms-button--default', { theme: 'high-contrast' })
    );
    await expect(html).toHaveAttribute('data-theme', 'high-contrast');
  });

  test('color token values differ between light and dark themes', async ({
    page,
  }) => {
    await page.goto(storyUrl('forms-button--default', { theme: 'light' }));
    const lightValue = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-background')
        .trim()
    );

    await page.goto(storyUrl('forms-button--default', { theme: 'dark' }));
    const darkValue = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-background')
        .trim()
    );

    expect(lightValue).not.toBe('');
    expect(darkValue).not.toBe('');
    expect(lightValue).not.toEqual(darkValue);
  });
});

test.describe('Density switching', () => {
  test('sets compact density via URL globals', async ({ page }) => {
    await page.goto(
      storyUrl('forms-button--default', { density: 'compact' })
    );
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-density', 'compact');
  });

  test('sets default density via URL globals', async ({ page }) => {
    await page.goto(
      storyUrl('forms-button--default', { density: 'default' })
    );
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-density', 'default');
  });

  test('sets comfortable density via URL globals', async ({ page }) => {
    await page.goto(
      storyUrl('forms-button--default', { density: 'comfortable' })
    );
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-density', 'comfortable');
  });

  test('density attribute changes when switching between densities', async ({
    page,
  }) => {
    const html = page.locator('html');

    await page.goto(
      storyUrl('forms-input--default', { density: 'compact' })
    );
    await expect(html).toHaveAttribute('data-density', 'compact');

    await page.goto(
      storyUrl('forms-input--default', { density: 'comfortable' })
    );
    await expect(html).toHaveAttribute('data-density', 'comfortable');
  });
});

test.describe('Component usability across themes', () => {
  const themes = ['light', 'dark', 'high-contrast'] as const;

  for (const theme of themes) {
    test(`button is clickable in ${theme} theme`, async ({ page }) => {
      await page.goto(storyUrl('forms-button--default', { theme }));
      const button = page.locator('button');
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
      await button.click();
    });

    test(`input is typeable in ${theme} theme`, async ({ page }) => {
      await page.goto(storyUrl('forms-input--default', { theme }));
      const input = page.locator('input');
      await expect(input).toBeVisible();
      await input.fill('Test input text');
      await expect(input).toHaveValue('Test input text');
    });
  }
});

test.describe('Combined theme and density globals', () => {
  test('applies both theme and density simultaneously', async ({ page }) => {
    await page.goto(
      storyUrl('forms-button--default', {
        theme: 'dark',
        density: 'compact',
      })
    );
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(html).toHaveAttribute('data-density', 'compact');
  });
});
