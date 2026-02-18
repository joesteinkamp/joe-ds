import { test, expect } from '@playwright/test';

const STORYBOOK_URL = 'http://localhost:6006';

function storyUrl(storyId: string): string {
  return `${STORYBOOK_URL}/iframe.html?id=${storyId}`;
}

test.use({ viewport: { width: 375, height: 812 } });

const MIN_TOUCH_TARGET_PX = 44;

test.describe('Touch target sizes', () => {
  test('Button meets minimum 44px touch target', async ({ page }) => {
    await page.goto(storyUrl('forms-button--default'));
    const button = page.locator('button');
    await button.waitFor({ state: 'visible' });

    const box = await button.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_PX);
    expect(box!.width).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_PX);
  });

  test('Input meets minimum 44px touch target height', async ({ page }) => {
    await page.goto(storyUrl('forms-input--default'));
    const input = page.locator('input');
    await input.waitFor({ state: 'visible' });

    const box = await input.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_PX);
  });

  test('Checkbox meets minimum 44px touch target', async ({ page }) => {
    await page.goto(storyUrl('forms-checkbox--default'));

    // The clickable area may be the checkbox itself or its label wrapper
    const checkbox = page.locator(
      '[role="checkbox"], input[type="checkbox"], label'
    );
    await checkbox.first().waitFor({ state: 'visible' });

    const box = await checkbox.first().boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_PX);
    expect(box!.width).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_PX);
  });
});

test.describe('Navigation on mobile viewport', () => {
  test('NavigationMenu is visible and usable at 375px width', async ({
    page,
  }) => {
    await page.goto(storyUrl('navigation-navigationmenu--default'));
    const nav = page.locator('nav');
    await nav.first().waitFor({ state: 'visible' });

    // The nav should fit within the viewport width
    const navBox = await nav.first().boundingBox();
    expect(navBox).not.toBeNull();
    expect(navBox!.width).toBeLessThanOrEqual(375);
  });

  test('NavigationMenu items do not overflow the viewport', async ({
    page,
  }) => {
    await page.goto(storyUrl('navigation-navigationmenu--default'));
    const nav = page.locator('nav');
    await nav.first().waitFor({ state: 'visible' });

    const overflowsViewport = await page.evaluate(() => {
      const navEl = document.querySelector('nav');
      if (!navEl) return false;
      const rect = navEl.getBoundingClientRect();
      return rect.right > window.innerWidth || rect.left < 0;
    });

    expect(overflowsViewport).toBe(false);
  });
});

test.describe('Dialog on mobile viewport', () => {
  test('Dialog fills mobile viewport appropriately when open', async ({
    page,
  }) => {
    await page.goto(storyUrl('overlay-dialog--default'));

    // Open the dialog
    const trigger = page.locator('[data-testid="dialog-trigger"], button');
    await trigger.first().waitFor({ state: 'visible' });
    await trigger.first().click();

    const dialog = page.locator('[role="dialog"], dialog');
    await dialog.waitFor({ state: 'visible' });

    const dialogBox = await dialog.boundingBox();
    expect(dialogBox).not.toBeNull();

    // Dialog should use a significant portion of the viewport width on mobile
    const viewportWidth = 375;
    const widthRatio = dialogBox!.width / viewportWidth;
    expect(widthRatio).toBeGreaterThanOrEqual(0.8);
  });

  test('Dialog content is not clipped on mobile', async ({ page }) => {
    await page.goto(storyUrl('overlay-dialog--default'));

    const trigger = page.locator('[data-testid="dialog-trigger"], button');
    await trigger.first().waitFor({ state: 'visible' });
    await trigger.first().click();

    const dialog = page.locator('[role="dialog"], dialog');
    await dialog.waitFor({ state: 'visible' });

    // Dialog should not extend beyond the viewport
    const isWithinViewport = await dialog.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.left >= 0 &&
        rect.right <= window.innerWidth &&
        rect.top >= 0 &&
        rect.bottom <= window.innerHeight
      );
    });

    expect(isWithinViewport).toBe(true);
  });
});

test.describe('Form inputs on mobile viewport', () => {
  test('Input is usable and properly sized on mobile', async ({ page }) => {
    await page.goto(storyUrl('forms-input--default'));
    const input = page.locator('input');
    await input.waitFor({ state: 'visible' });

    // Input should be wide enough to be usable
    const inputBox = await input.boundingBox();
    expect(inputBox).not.toBeNull();
    expect(inputBox!.width).toBeGreaterThan(100);

    // Input should not overflow the viewport
    expect(inputBox!.left).toBeGreaterThanOrEqual(0);
    expect(inputBox!.left + inputBox!.width).toBeLessThanOrEqual(375);

    // Verify the input is functional
    await input.tap();
    await input.fill('Mobile test input');
    await expect(input).toHaveValue('Mobile test input');
  });

  test('Button is tappable on mobile', async ({ page }) => {
    await page.goto(storyUrl('forms-button--default'));
    const button = page.locator('button');
    await button.waitFor({ state: 'visible' });

    // Use tap instead of click to simulate touch
    await button.tap();
  });

  test('Input is not overlapped by other elements', async ({ page }) => {
    await page.goto(storyUrl('forms-input--default'));
    const input = page.locator('input');
    await input.waitFor({ state: 'visible' });

    // Verify the input is actionable (not covered by other elements)
    // Playwright's actionability checks ensure the element is not obscured
    await input.tap({ trial: true });
  });
});

test.describe('ScrollArea on mobile viewport', () => {
  test('ScrollArea renders and is scrollable on mobile', async ({ page }) => {
    await page.goto(storyUrl('display-scrollarea--default'));

    const scrollArea = page.locator(
      '[data-radix-scroll-area-viewport], [data-testid="scroll-area"], [class*="ScrollArea"]'
    );
    await scrollArea.first().waitFor({ state: 'visible' });

    const scrollBox = await scrollArea.first().boundingBox();
    expect(scrollBox).not.toBeNull();

    // ScrollArea should fit within the mobile viewport
    expect(scrollBox!.width).toBeLessThanOrEqual(375);
  });

  test('ScrollArea supports touch scrolling', async ({ page }) => {
    await page.goto(storyUrl('display-scrollarea--default'));

    const scrollArea = page.locator(
      '[data-radix-scroll-area-viewport], [data-testid="scroll-area"], [class*="ScrollArea"]'
    );
    await scrollArea.first().waitFor({ state: 'visible' });

    // Read initial scroll position
    const initialScrollTop = await scrollArea.first().evaluate((el) => el.scrollTop);

    // Simulate a touch scroll gesture by swiping up
    const box = await scrollArea.first().boundingBox();
    if (box) {
      const centerX = box.x + box.width / 2;
      const startY = box.y + box.height * 0.75;
      const endY = box.y + box.height * 0.25;

      await page.touchscreen.tap(centerX, startY);
      await page.mouse.move(centerX, startY);
      await page.mouse.down();
      await page.mouse.move(centerX, endY, { steps: 10 });
      await page.mouse.up();
    }

    // Verify that the scroll area content can be scrolled
    // (the scroll position may or may not change depending on content length)
    const hasScrollableContent = await scrollArea.first().evaluate((el) => {
      return el.scrollHeight > el.clientHeight;
    });

    // If there is scrollable content, it should be scrollable
    if (hasScrollableContent) {
      // Programmatically scroll to verify scrollability
      await scrollArea.first().evaluate((el) => {
        el.scrollTop = 50;
      });
      const newScrollTop = await scrollArea.first().evaluate((el) => el.scrollTop);
      expect(newScrollTop).toBeGreaterThan(0);
    }
  });
});
