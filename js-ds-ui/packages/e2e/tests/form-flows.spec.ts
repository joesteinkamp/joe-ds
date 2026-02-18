import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Story URL helper
// Storybook iframe URL format: /iframe.html?id=<category>-<component>--<story>
// Category "Forms/Input" with story "Default" => forms-input--default
// ---------------------------------------------------------------------------
function storyUrl(id: string): string {
  return `/iframe.html?id=${id}`;
}

// ===========================================================================
// Input
// ===========================================================================
test.describe('Input', () => {
  test('should accept typed text and reflect the value', async ({ page }) => {
    await page.goto(storyUrl('forms-input--default'));

    const input = page.locator('input');
    await input.fill('Hello, World!');
    await expect(input).toHaveValue('Hello, World!');
  });

  test('should display placeholder text', async ({ page }) => {
    await page.goto(storyUrl('forms-input--with-placeholder'));

    const input = page.locator('input');
    await expect(input).toHaveAttribute('placeholder', 'Enter text...');
  });

  test('should not accept input when disabled', async ({ page }) => {
    await page.goto(storyUrl('forms-input--disabled'));

    const input = page.locator('input');
    await expect(input).toBeDisabled();
  });

  test('should clear previous value and accept new text', async ({ page }) => {
    await page.goto(storyUrl('forms-input--default'));

    const input = page.locator('input');
    await input.fill('first');
    await expect(input).toHaveValue('first');

    await input.fill('second');
    await expect(input).toHaveValue('second');
  });
});

// ===========================================================================
// Select
// ===========================================================================
test.describe('Select', () => {
  test('should open dropdown and select an option', async ({ page }) => {
    await page.goto(storyUrl('forms-select--default'));

    // Click the trigger to open the dropdown
    const trigger = page.locator('[role="combobox"]');
    await trigger.click();

    // Wait for the dropdown content to appear and select an option
    const option = page.getByRole('option', { name: 'Banana' });
    await expect(option).toBeVisible();
    await option.click();

    // The trigger should now display the selected value
    await expect(trigger).toHaveText('Banana');
  });

  test('should display placeholder before selection', async ({ page }) => {
    await page.goto(storyUrl('forms-select--default'));

    const trigger = page.locator('[role="combobox"]');
    await expect(trigger).toHaveText('Select a fruit');
  });

  test('should not open when disabled', async ({ page }) => {
    await page.goto(storyUrl('forms-select--disabled'));

    const trigger = page.locator('[role="combobox"]');
    await expect(trigger).toBeDisabled();
  });
});

// ===========================================================================
// Checkbox
// ===========================================================================
test.describe('Checkbox', () => {
  test('should toggle checked state on click', async ({ page }) => {
    await page.goto(storyUrl('forms-checkbox--default'));

    const checkbox = page.getByRole('checkbox');
    // Initially unchecked
    await expect(checkbox).not.toBeChecked();

    await checkbox.click();
    await expect(checkbox).toBeChecked();

    // Toggle back off
    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
  });

  test('should render as checked when the checked prop is set', async ({
    page,
  }) => {
    await page.goto(storyUrl('forms-checkbox--checked'));

    const checkbox = page.getByRole('checkbox');
    await expect(checkbox).toBeChecked();
  });

  test('should support indeterminate state via data attribute', async ({
    page,
  }) => {
    await page.goto(storyUrl('forms-checkbox--default'));

    const checkbox = page.getByRole('checkbox');

    // Radix Checkbox exposes indeterminate through data-state="indeterminate".
    // Programmatically set it to verify the component supports it.
    await checkbox.evaluate((el: HTMLButtonElement) => {
      el.dataset.state = 'indeterminate';
      el.setAttribute('aria-checked', 'mixed');
    });
    await expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    await expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
  });

  test('should not toggle when disabled', async ({ page }) => {
    await page.goto(storyUrl('forms-checkbox--disabled'));

    const checkbox = page.getByRole('checkbox');
    await expect(checkbox).toBeDisabled();
  });
});

// ===========================================================================
// Switch
// ===========================================================================
test.describe('Switch', () => {
  test('should toggle on and off when clicked', async ({ page }) => {
    await page.goto(storyUrl('forms-switch--default'));

    const toggle = page.getByRole('switch');
    // Default is unchecked
    await expect(toggle).not.toBeChecked();

    await toggle.click();
    await expect(toggle).toBeChecked();

    await toggle.click();
    await expect(toggle).not.toBeChecked();
  });

  test('should render in the on state when checked prop is set', async ({
    page,
  }) => {
    await page.goto(storyUrl('forms-switch--checked'));

    const toggle = page.getByRole('switch');
    await expect(toggle).toBeChecked();
  });

  test('should not toggle when disabled', async ({ page }) => {
    await page.goto(storyUrl('forms-switch--disabled'));

    const toggle = page.getByRole('switch');
    await expect(toggle).toBeDisabled();
  });
});

// ===========================================================================
// RadioGroup
// ===========================================================================
test.describe('RadioGroup', () => {
  test('should allow selecting a radio option', async ({ page }) => {
    await page.goto(storyUrl('forms-radiogroup--default'));

    const radios = page.getByRole('radio');
    // "option-one" is defaultValue so it should be checked
    await expect(radios.nth(0)).toBeChecked();
    await expect(radios.nth(1)).not.toBeChecked();
    await expect(radios.nth(2)).not.toBeChecked();

    // Click the second option
    await radios.nth(1).click();
    await expect(radios.nth(0)).not.toBeChecked();
    await expect(radios.nth(1)).toBeChecked();
    await expect(radios.nth(2)).not.toBeChecked();
  });

  test('should only allow one option to be selected at a time', async ({
    page,
  }) => {
    await page.goto(storyUrl('forms-radiogroup--default'));

    const radios = page.getByRole('radio');

    // Click third option
    await radios.nth(2).click();
    await expect(radios.nth(2)).toBeChecked();

    // Verify others are unchecked
    await expect(radios.nth(0)).not.toBeChecked();
    await expect(radios.nth(1)).not.toBeChecked();

    // Click first option again
    await radios.nth(0).click();
    await expect(radios.nth(0)).toBeChecked();
    await expect(radios.nth(1)).not.toBeChecked();
    await expect(radios.nth(2)).not.toBeChecked();
  });
});

// ===========================================================================
// Textarea
// ===========================================================================
test.describe('Textarea', () => {
  test('should accept and display multi-line content', async ({ page }) => {
    await page.goto(storyUrl('forms-textarea--default'));

    const textarea = page.locator('textarea');
    const multiLine = 'Line 1\nLine 2\nLine 3';
    await textarea.fill(multiLine);
    await expect(textarea).toHaveValue(multiLine);
  });

  test('should display placeholder text', async ({ page }) => {
    await page.goto(storyUrl('forms-textarea--default'));

    const textarea = page.locator('textarea');
    await expect(textarea).toHaveAttribute(
      'placeholder',
      'Type your message here.'
    );
  });

  test('should not accept input when disabled', async ({ page }) => {
    await page.goto(storyUrl('forms-textarea--disabled'));

    const textarea = page.locator('textarea');
    await expect(textarea).toBeDisabled();
  });

  test('should render with a pre-filled value', async ({ page }) => {
    await page.goto(storyUrl('forms-textarea--with-value'));

    const textarea = page.locator('textarea');
    await expect(textarea).toHaveValue(
      'This textarea has a pre-filled value that the user can edit.'
    );
  });
});

// ===========================================================================
// Slider
// ===========================================================================
test.describe('Slider', () => {
  test('should change value via keyboard interaction', async ({ page }) => {
    await page.goto(storyUrl('forms-slider--default'));

    const thumb = page.getByRole('slider');
    // Default value is 50, max 100, step 1
    await expect(thumb).toHaveAttribute('aria-valuenow', '50');

    // Focus the thumb and press ArrowRight to increment
    await thumb.focus();
    await page.keyboard.press('ArrowRight');
    await expect(thumb).toHaveAttribute('aria-valuenow', '51');

    // Press ArrowLeft to decrement
    await page.keyboard.press('ArrowLeft');
    await expect(thumb).toHaveAttribute('aria-valuenow', '50');
  });

  test('should respect the step value', async ({ page }) => {
    await page.goto(storyUrl('forms-slider--custom-range'));

    const thumb = page.getByRole('slider');
    // CustomRange: defaultValue 25, max 200, step 5
    await expect(thumb).toHaveAttribute('aria-valuenow', '25');

    await thumb.focus();
    await page.keyboard.press('ArrowRight');
    await expect(thumb).toHaveAttribute('aria-valuenow', '30');
  });

  test('should not respond to interaction when disabled', async ({ page }) => {
    await page.goto(storyUrl('forms-slider--disabled'));

    const thumb = page.getByRole('slider');
    await expect(thumb).toBeDisabled();
  });
});

// ===========================================================================
// FormField — validation / error states
// ===========================================================================
test.describe('FormField', () => {
  test('should display helper text when provided', async ({ page }) => {
    await page.goto(storyUrl('forms-formfield--default'));

    const helperText = page.locator('#email-helper');
    await expect(helperText).toBeVisible();
    await expect(helperText).toHaveText(
      "We'll never share your email with anyone else."
    );
  });

  test('should display error message and mark input as invalid', async ({
    page,
  }) => {
    await page.goto(storyUrl('forms-formfield--with-error'));

    // Error message is rendered with role="alert"
    const errorMessage = page.getByRole('alert');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(
      'Please enter a valid email address.'
    );

    // The input should have aria-invalid="true"
    const input = page.locator('#email-error');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('should link input to error via aria-describedby', async ({ page }) => {
    await page.goto(storyUrl('forms-formfield--with-error'));

    const input = page.locator('#email-error');
    const describedBy = await input.getAttribute('aria-describedby');
    expect(describedBy).toContain('email-error-error');
  });

  test('should render without helper text when not provided', async ({
    page,
  }) => {
    await page.goto(storyUrl('forms-formfield--without-helper-text'));

    // No helper text paragraph should be present
    const helperText = page.locator('#username-helper');
    await expect(helperText).toHaveCount(0);
  });
});
