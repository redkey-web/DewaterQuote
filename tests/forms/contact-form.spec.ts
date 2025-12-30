import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test.describe('Form Elements', () => {
    test('form is visible', async ({ page }) => {
      await expect(page.locator('form')).toBeVisible();
    });

    test('name field exists and is required', async ({ page }) => {
      const nameInput = page.locator('input[name="name"]');
      await expect(nameInput).toBeVisible();
      await expect(nameInput).toHaveAttribute('required', '');
    });

    test('email field exists and is required', async ({ page }) => {
      const emailInput = page.locator('input[name="email"]');
      await expect(emailInput).toBeVisible();
      await expect(emailInput).toHaveAttribute('required', '');
    });

    test('phone field exists', async ({ page }) => {
      const phoneInput = page.locator('input[name="phone"]');
      await expect(phoneInput).toBeVisible();
    });

    test('company field exists', async ({ page }) => {
      const companyInput = page.locator('input[name="company"]');
      await expect(companyInput).toBeVisible();
    });

    test('message field exists and is required', async ({ page }) => {
      const messageInput = page.locator('textarea[name="message"]');
      await expect(messageInput).toBeVisible();
      await expect(messageInput).toHaveAttribute('required', '');
    });

    test('submit button exists', async ({ page }) => {
      const submitBtn = page.locator('button[type="submit"]');
      await expect(submitBtn).toBeVisible();
    });

    // Turnstile may not render on localhost without proper config
    test.skip('turnstile widget is present', async ({ page }) => {
      const turnstile = page.locator('[data-turnstile-widget]').or(page.locator('.cf-turnstile'));
      await expect(turnstile).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Form Validation', () => {
    test('submit button is disabled when form is empty', async ({ page }) => {
      const submitBtn = page.locator('button[type="submit"]');
      // Button should be disabled until form is valid + Turnstile complete
      await expect(submitBtn).toBeDisabled();
    });

    test('submit button has correct text', async ({ page }) => {
      const submitBtn = page.locator('button[type="submit"]');
      await expect(submitBtn).toContainText(/send|submit/i);
    });
  });

  test.describe('Page Content', () => {
    // Skip on mobile - first() picks header element which is hidden on mobile
    test.skip(({ viewport }) => viewport !== null && viewport.width < 768, 'Desktop only');

    test('phone number is displayed', async ({ page }) => {
      // Phone appears in header (first match) - visible on desktop
      await expect(page.getByText('(08) 9271 2577').first()).toBeVisible();
    });

    test('email address is displayed', async ({ page }) => {
      // Email appears in header (first match) - visible on desktop
      await expect(page.getByText('sales@dewaterproducts.com.au').first()).toBeVisible();
    });
  });
});
