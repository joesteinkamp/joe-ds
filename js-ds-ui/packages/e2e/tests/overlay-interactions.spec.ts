import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Story URL helper
// Storybook iframe URL format: /iframe.html?id=<category>-<component>--<story>
// Category "Overlay/Dialog" with story "Default" => overlay-dialog--default
// ---------------------------------------------------------------------------
function storyUrl(id: string): string {
  return `/iframe.html?id=${id}`;
}

// ===========================================================================
// Dialog
// ===========================================================================
test.describe('Dialog', () => {
  test('should open when the trigger button is clicked', async ({ page }) => {
    await page.goto(storyUrl('overlay-dialog--default'));

    const trigger = page.getByRole('button', { name: 'Open Dialog' });
    await trigger.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(
      page.getByText('Are you absolutely sure?')
    ).toBeVisible();
  });

  test('should close when the close (X) button is clicked', async ({
    page,
  }) => {
    await page.goto(storyUrl('overlay-dialog--default'));

    await page.getByRole('button', { name: 'Open Dialog' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Radix Dialog renders a close X button (with sr-only "Close" text or an SVG icon)
    const closeButton = dialog.locator('button:has(> svg)').last();
    await closeButton.click();

    await expect(dialog).toBeHidden();
  });

  test('should close when the Escape key is pressed', async ({ page }) => {
    await page.goto(storyUrl('overlay-dialog--default'));

    await page.getByRole('button', { name: 'Open Dialog' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('should trap focus within the dialog when tabbing', async ({
    page,
  }) => {
    await page.goto(storyUrl('overlay-dialog--with-form'));

    await page.getByRole('button', { name: 'Edit Profile' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Collect all focusable elements inside the dialog
    const focusable = dialog.locator(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const count = await focusable.count();
    expect(count).toBeGreaterThan(1);

    // Tab through all focusable elements plus one extra to verify wrap-around
    for (let i = 0; i < count + 1; i++) {
      await page.keyboard.press('Tab');
      // The focused element should always be inside the dialog
      await expect(dialog.locator(':focus')).toHaveCount(1);
    }
  });

  test('should restore focus to the trigger after closing', async ({
    page,
  }) => {
    await page.goto(storyUrl('overlay-dialog--default'));

    const trigger = page.getByRole('button', { name: 'Open Dialog' });
    await trigger.click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();

    // Focus should return to the trigger button
    await expect(trigger).toBeFocused();
  });

  test('should close via the Cancel button in the footer', async ({
    page,
  }) => {
    await page.goto(storyUrl('overlay-dialog--default'));

    await page.getByRole('button', { name: 'Open Dialog' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
  });
});

// ===========================================================================
// Sheet
// ===========================================================================
test.describe('Sheet', () => {
  test('should open from the right side', async ({ page }) => {
    await page.goto(storyUrl('overlay-sheet--right'));

    await page.getByRole('button', { name: 'Open Right Sheet' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(page.getByText('Edit Profile')).toBeVisible();
  });

  test('should open from the left side', async ({ page }) => {
    await page.goto(storyUrl('overlay-sheet--left'));

    await page.getByRole('button', { name: 'Open Left Sheet' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(page.getByText('Navigation')).toBeVisible();
  });

  test('should open from the top', async ({ page }) => {
    await page.goto(storyUrl('overlay-sheet--top'));

    await page.getByRole('button', { name: 'Open Top Sheet' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(page.getByText('Notifications')).toBeVisible();
  });

  test('should open from the bottom', async ({ page }) => {
    await page.goto(storyUrl('overlay-sheet--bottom'));

    await page.getByRole('button', { name: 'Open Bottom Sheet' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(page.getByText('Share Document')).toBeVisible();
  });

  test('should close when the overlay backdrop is clicked', async ({
    page,
  }) => {
    await page.goto(storyUrl('overlay-sheet--right'));

    await page.getByRole('button', { name: 'Open Right Sheet' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Click the semi-transparent overlay backdrop outside the sheet panel.
    // Radix Sheet renders the overlay as a sibling element before the content.
    const overlay = page.locator('[data-state="open"]').first();
    await overlay.click({ position: { x: 10, y: 10 }, force: true });

    await expect(dialog).toBeHidden();
  });

  test('should close when the Escape key is pressed', async ({ page }) => {
    await page.goto(storyUrl('overlay-sheet--right'));

    await page.getByRole('button', { name: 'Open Right Sheet' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
});

// ===========================================================================
// Tooltip
// ===========================================================================
test.describe('Tooltip', () => {
  test('should show on hover and display content', async ({ page }) => {
    await page.goto(storyUrl('overlay-tooltip--default'));

    const trigger = page.getByRole('button', { name: 'Hover Me' });
    await trigger.hover();

    const tooltip = page.getByRole('tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveText('This is a tooltip');
  });

  test('should hide when the mouse moves away', async ({ page }) => {
    await page.goto(storyUrl('overlay-tooltip--default'));

    const trigger = page.getByRole('button', { name: 'Hover Me' });
    await trigger.hover();
    await expect(page.getByRole('tooltip')).toBeVisible();

    // Move the mouse to the top-left corner, away from the trigger
    await page.mouse.move(0, 0);

    await expect(page.getByRole('tooltip')).toBeHidden();
  });

  test('should appear on different sides', async ({ page }) => {
    await page.goto(storyUrl('overlay-tooltip--sides'));

    // Hover the "Top" button and verify the tooltip appears
    const topButton = page.getByRole('button', { name: 'Top' });
    await topButton.hover();

    const tooltip = page.getByRole('tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveText('Tooltip on top');

    // Move away to dismiss
    await page.mouse.move(0, 0);
    await expect(tooltip).toBeHidden();
  });
});

// ===========================================================================
// Popover
// ===========================================================================
test.describe('Popover', () => {
  test('should open when the trigger is clicked', async ({ page }) => {
    await page.goto(storyUrl('overlay-popover--default'));

    const trigger = page.getByRole('button', { name: 'Open Popover' });
    await trigger.click();

    // Popover content should be visible
    await expect(page.getByText('Dimensions')).toBeVisible();
    await expect(
      page.getByText('Set the dimensions for the layer.')
    ).toBeVisible();
  });

  test('should contain interactive elements inside the popover', async ({
    page,
  }) => {
    await page.goto(storyUrl('overlay-popover--default'));

    await page.getByRole('button', { name: 'Open Popover' }).click();

    // Verify inputs are accessible inside the popover
    const widthInput = page.locator('#width');
    await expect(widthInput).toBeVisible();
    await expect(widthInput).toHaveValue('100%');
  });

  test('should close when clicking outside the popover', async ({ page }) => {
    await page.goto(storyUrl('overlay-popover--default'));

    await page.getByRole('button', { name: 'Open Popover' }).click();
    await expect(page.getByText('Dimensions')).toBeVisible();

    // Click outside the popover on the page body
    await page.locator('body').click({ position: { x: 5, y: 5 } });

    await expect(page.getByText('Dimensions')).toBeHidden();
  });

  test('should close when the Escape key is pressed', async ({ page }) => {
    await page.goto(storyUrl('overlay-popover--default'));

    await page.getByRole('button', { name: 'Open Popover' }).click();
    await expect(page.getByText('Dimensions')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByText('Dimensions')).toBeHidden();
  });
});

// ===========================================================================
// DropdownMenu
// ===========================================================================
test.describe('DropdownMenu', () => {
  test('should open when the trigger is clicked', async ({ page }) => {
    await page.goto(storyUrl('overlay-dropdownmenu--default'));

    await page.getByRole('button', { name: 'Open Menu' }).click();

    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    await expect(
      page.getByRole('menuitem', { name: 'Profile' })
    ).toBeVisible();
    await expect(
      page.getByRole('menuitem', { name: 'Billing' })
    ).toBeVisible();
    await expect(
      page.getByRole('menuitem', { name: 'Settings' })
    ).toBeVisible();
    await expect(
      page.getByRole('menuitem', { name: 'Log out' })
    ).toBeVisible();
  });

  test('should navigate items with arrow keys', async ({ page }) => {
    await page.goto(storyUrl('overlay-dropdownmenu--default'));

    await page.getByRole('button', { name: 'Open Menu' }).click();
    await expect(page.getByRole('menu')).toBeVisible();

    // Arrow down to move through menu items
    await page.keyboard.press('ArrowDown');
    await expect(
      page.getByRole('menuitem', { name: 'Profile' })
    ).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(
      page.getByRole('menuitem', { name: 'Billing' })
    ).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(
      page.getByRole('menuitem', { name: 'Settings' })
    ).toBeFocused();
  });

  test('should select an item with Enter and close the menu', async ({
    page,
  }) => {
    await page.goto(storyUrl('overlay-dropdownmenu--default'));

    await page.getByRole('button', { name: 'Open Menu' }).click();
    await expect(page.getByRole('menu')).toBeVisible();

    // Navigate to "Profile" and press Enter to select it
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // The menu should close after item selection
    await expect(page.getByRole('menu')).toBeHidden();
  });

  test('should close when Escape is pressed', async ({ page }) => {
    await page.goto(storyUrl('overlay-dropdownmenu--default'));

    await page.getByRole('button', { name: 'Open Menu' }).click();
    await expect(page.getByRole('menu')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toBeHidden();
  });

  test('should toggle checkbox items in the menu', async ({ page }) => {
    await page.goto(storyUrl('overlay-dropdownmenu--with-checkbox'));

    await page.getByRole('button', { name: 'View Options' }).click();
    await expect(page.getByRole('menu')).toBeVisible();

    // "Status Bar" is checked by default; "Activity Bar" is unchecked
    const statusBar = page.getByRole('menuitemcheckbox', {
      name: 'Status Bar',
    });
    const activityBar = page.getByRole('menuitemcheckbox', {
      name: 'Activity Bar',
    });

    await expect(statusBar).toHaveAttribute('aria-checked', 'true');
    await expect(activityBar).toHaveAttribute('aria-checked', 'false');

    // Toggle Activity Bar on
    await activityBar.click();

    // Re-open the menu to verify the persisted state change
    await page.getByRole('button', { name: 'View Options' }).click();
    await expect(
      page.getByRole('menuitemcheckbox', { name: 'Activity Bar' })
    ).toHaveAttribute('aria-checked', 'true');
  });
});

// ===========================================================================
// Toast
// ===========================================================================
test.describe('Toast', () => {
  test('should display a default toast notification', async ({ page }) => {
    await page.goto(storyUrl('overlay-toast--default'));

    // The Default story renders the toast in an already-open state
    await expect(page.getByText('Notification')).toBeVisible();
    await expect(
      page.getByText('This is a default toast message.')
    ).toBeVisible();
  });

  test('should display a success toast variant', async ({ page }) => {
    await page.goto(storyUrl('overlay-toast--success'));

    await expect(page.getByText('Success')).toBeVisible();
    await expect(
      page.getByText('Your changes have been saved.')
    ).toBeVisible();
  });

  test('should display an error toast variant', async ({ page }) => {
    await page.goto(storyUrl('overlay-toast--error'));

    await expect(page.getByText('Error')).toBeVisible();
    await expect(
      page.getByText('Something went wrong. Please try again.')
    ).toBeVisible();
  });

  test('should display a toast with an action button', async ({ page }) => {
    await page.goto(storyUrl('overlay-toast--with-action'));

    await expect(page.getByText('Event Created')).toBeVisible();
    await expect(
      page.getByText('Your event has been scheduled for Friday.')
    ).toBeVisible();

    // The action button should be present and clickable
    const actionButton = page.getByRole('button', { name: 'Undo' });
    await expect(actionButton).toBeVisible();
  });

  test('should be dismissible via the close button', async ({ page }) => {
    await page.goto(storyUrl('overlay-toast--default'));

    await expect(page.getByText('Notification')).toBeVisible();

    // Click the close button on the toast (Radix ToastClose)
    const closeButton = page
      .locator('[data-radix-toast-announce-exclude]')
      .first();
    await closeButton.click();

    // Toast should be dismissed after animation
    await expect(
      page.getByText('This is a default toast message.')
    ).toBeHidden();
  });

  test('should auto-dismiss after the default duration', async ({ page }) => {
    await page.goto(storyUrl('overlay-toast--default'));

    await expect(page.getByText('Notification')).toBeVisible();

    // Radix Toast auto-dismisses after the configured duration (default ~5s).
    // Wait for the toast to disappear.
    await expect(page.getByText('This is a default toast message.')).toBeHidden(
      { timeout: 10_000 }
    );
  });
});
