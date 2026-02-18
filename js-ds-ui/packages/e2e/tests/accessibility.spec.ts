import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const STORYBOOK_URL = 'http://localhost:6006';

function storyUrl(storyId: string): string {
  return `${STORYBOOK_URL}/iframe.html?id=${storyId}`;
}

test.describe('Automated accessibility scans', () => {
  test('Button has no critical or serious a11y violations', async ({
    page,
  }) => {
    await page.goto(storyUrl('forms-button--default'));
    await page.locator('button').waitFor({ state: 'visible' });

    const results = await new AxeBuilder({ page }).analyze();

    const criticalOrSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalOrSerious).toHaveLength(0);
  });

  test('Input with label has no critical or serious a11y violations', async ({
    page,
  }) => {
    await page.goto(storyUrl('forms-input--default'));
    await page.locator('input').waitFor({ state: 'visible' });

    const results = await new AxeBuilder({ page }).analyze();

    const criticalOrSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalOrSerious).toHaveLength(0);
  });

  test('Dialog in open state has no critical or serious a11y violations', async ({
    page,
  }) => {
    await page.goto(storyUrl('overlay-dialog--default'));

    // Wait for the dialog trigger and open it
    const trigger = page.locator('[data-testid="dialog-trigger"], button');
    await trigger.first().waitFor({ state: 'visible' });
    await trigger.first().click();

    // Wait for the dialog content to appear
    const dialog = page.locator('[role="dialog"], dialog');
    await dialog.waitFor({ state: 'visible' });

    const results = await new AxeBuilder({ page }).analyze();

    const criticalOrSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalOrSerious).toHaveLength(0);
  });

  test('Checkbox has no critical or serious a11y violations', async ({
    page,
  }) => {
    await page.goto(storyUrl('forms-checkbox--default'));
    await page
      .locator('[role="checkbox"], input[type="checkbox"]')
      .first()
      .waitFor({ state: 'visible' });

    const results = await new AxeBuilder({ page }).analyze();

    const criticalOrSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalOrSerious).toHaveLength(0);
  });

  test('NavigationMenu has no critical or serious a11y violations', async ({
    page,
  }) => {
    await page.goto(storyUrl('navigation-navigationmenu--default'));
    await page.locator('nav').first().waitFor({ state: 'visible' });

    const results = await new AxeBuilder({ page }).analyze();

    const criticalOrSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalOrSerious).toHaveLength(0);
  });
});

test.describe('Keyboard accessibility', () => {
  test('focus ring is visible when tabbing to a button', async ({ page }) => {
    await page.goto(storyUrl('forms-button--default'));
    const button = page.locator('button');
    await button.waitFor({ state: 'visible' });

    // Tab to move focus to the button
    await page.keyboard.press('Tab');

    // Verify the button received focus
    await expect(button).toBeFocused();

    // Check that a visible focus indicator is present via outline or box-shadow
    const focusStyles = await button.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        outlineStyle: styles.outlineStyle,
        boxShadow: styles.boxShadow,
      };
    });

    const hasVisibleOutline =
      focusStyles.outlineStyle !== 'none' &&
      focusStyles.outlineWidth !== '0px';
    const hasBoxShadow =
      focusStyles.boxShadow !== 'none' && focusStyles.boxShadow !== '';

    expect(
      hasVisibleOutline || hasBoxShadow,
      `Expected a visible focus indicator on the button. ` +
        `outline: ${focusStyles.outline}, box-shadow: ${focusStyles.boxShadow}`
    ).toBe(true);
  });

  test('focus ring is visible when tabbing to an input', async ({ page }) => {
    await page.goto(storyUrl('forms-input--default'));
    const input = page.locator('input');
    await input.waitFor({ state: 'visible' });

    await page.keyboard.press('Tab');
    await expect(input).toBeFocused();

    const focusStyles = await input.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        outlineStyle: styles.outlineStyle,
        outlineWidth: styles.outlineWidth,
        boxShadow: styles.boxShadow,
      };
    });

    const hasVisibleOutline =
      focusStyles.outlineStyle !== 'none' &&
      focusStyles.outlineWidth !== '0px';
    const hasBoxShadow =
      focusStyles.boxShadow !== 'none' && focusStyles.boxShadow !== '';

    expect(
      hasVisibleOutline || hasBoxShadow,
      `Expected a visible focus indicator on the input. ` +
        `outline-style: ${focusStyles.outlineStyle}, ` +
        `outline-width: ${focusStyles.outlineWidth}, ` +
        `box-shadow: ${focusStyles.boxShadow}`
    ).toBe(true);
  });
});

test.describe('Skip navigation', () => {
  test('SkipNavLink becomes visible on focus', async ({ page }) => {
    await page.goto(storyUrl('accessibility-skipnav--default'));

    // The skip nav link is typically visually hidden until focused
    const skipLink = page.locator(
      'a[href="#main-content"], [data-testid="skip-nav"], a:has-text("Skip")'
    );

    // Before focus, the link should exist but may be visually hidden
    await expect(skipLink.first()).toBeAttached();

    // Tab to bring focus to the skip nav link
    await page.keyboard.press('Tab');

    // After receiving focus the link should become visible
    await expect(skipLink.first()).toBeVisible();

    // Verify it is actually focused
    await expect(skipLink.first()).toBeFocused();
  });
});
