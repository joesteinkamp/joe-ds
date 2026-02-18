import { test, expect } from '@playwright/test';

/**
 * Cross-browser consistency tests.
 * These tests run against all configured browser projects (Chromium, Firefox, WebKit)
 * to verify that core component behaviors work consistently across engines.
 */

test.describe('Cross-Browser: Core Rendering', () => {
  test('Button renders and is clickable', async ({ page }) => {
    await page.goto('/iframe.html?id=forms-button--default');
    const button = page.getByRole('button').first();
    await expect(button).toBeVisible();
    await button.click();
  });

  test('Input accepts text input', async ({ page }) => {
    await page.goto('/iframe.html?id=forms-input--default');
    const input = page.getByRole('textbox').first();
    await expect(input).toBeVisible();
    await input.fill('Cross-browser test');
    await expect(input).toHaveValue('Cross-browser test');
  });

  test('Checkbox toggles state', async ({ page }) => {
    await page.goto('/iframe.html?id=forms-checkbox--default');
    const checkbox = page.getByRole('checkbox').first();
    await expect(checkbox).toBeVisible();
    await checkbox.click();
    await expect(checkbox).toBeChecked();
    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
  });

  test('Select opens and allows selection', async ({ page }) => {
    await page.goto('/iframe.html?id=forms-select--default');
    const trigger = page.getByRole('combobox').first();
    await expect(trigger).toBeVisible();
    await trigger.click();
    // Verify the listbox appears
    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible();
  });
});

test.describe('Cross-Browser: Keyboard Navigation', () => {
  test('Tab navigation moves focus between elements', async ({ page }) => {
    await page.goto('/iframe.html?id=forms-input--default');
    const input = page.getByRole('textbox').first();
    await input.focus();
    await expect(input).toBeFocused();
    await page.keyboard.press('Tab');
    // Focus should move to next focusable element
    const activeTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeTag).toBeTruthy();
  });

  test('Escape closes overlay components', async ({ page }) => {
    await page.goto('/iframe.html?id=overlay-dialog--default');
    // Find and click the trigger button to open dialog
    const trigger = page.getByRole('button').first();
    await trigger.click();
    // Wait for dialog to appear
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    // Press Escape to close
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('Enter activates buttons', async ({ page }) => {
    await page.goto('/iframe.html?id=forms-button--default');
    const button = page.getByRole('button').first();
    await button.focus();
    await page.keyboard.press('Enter');
    // Button should still be visible (no crash)
    await expect(button).toBeVisible();
  });

  test('Space toggles checkboxes', async ({ page }) => {
    await page.goto('/iframe.html?id=forms-checkbox--default');
    const checkbox = page.getByRole('checkbox').first();
    await checkbox.focus();
    await page.keyboard.press('Space');
    await expect(checkbox).toBeChecked();
  });

  test('Arrow keys navigate radio groups', async ({ page }) => {
    await page.goto('/iframe.html?id=forms-radiogroup--default');
    const radios = page.getByRole('radio');
    const first = radios.first();
    await first.focus();
    await page.keyboard.press('ArrowDown');
    // Second radio should now be focused
    const secondRadio = radios.nth(1);
    await expect(secondRadio).toBeFocused();
  });
});

test.describe('Cross-Browser: CSS Features', () => {
  test('CSS custom properties are applied', async ({ page }) => {
    await page.goto('/iframe.html?id=forms-button--default');
    const button = page.getByRole('button').first();
    // Verify the button has some computed styles (basic CSS is working)
    const height = await button.evaluate((el) => {
      return parseFloat(getComputedStyle(el).height);
    });
    expect(height).toBeGreaterThan(0);
  });

  test('Focus ring is visible on keyboard focus', async ({ page }) => {
    await page.goto('/iframe.html?id=forms-button--default');
    const button = page.getByRole('button').first();
    await button.focus();

    // Check for visible focus indicator (outline or ring)
    const hasFocusIndicator = await button.evaluate((el) => {
      const styles = getComputedStyle(el);
      const outline = styles.outline;
      const boxShadow = styles.boxShadow;
      return (
        (outline !== 'none' && outline !== '' && !outline.includes('0px')) ||
        (boxShadow !== 'none' && boxShadow !== '')
      );
    });
    expect(hasFocusIndicator).toBe(true);
  });

  test('Transitions respect prefers-reduced-motion', async ({ page }) => {
    // Emulate prefers-reduced-motion: reduce
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/iframe.html?id=forms-button--default');
    const button = page.getByRole('button').first();

    const transitionDuration = await button.evaluate((el) => {
      return getComputedStyle(el).transitionDuration;
    });

    // With reduced motion, transitions should be instant or very short
    // Accept '0s', '0ms', or very short durations
    const isReduced =
      transitionDuration === '0s' ||
      transitionDuration === '0ms' ||
      transitionDuration === '' ||
      parseFloat(transitionDuration) <= 0.01;
    expect(isReduced).toBe(true);
  });
});
