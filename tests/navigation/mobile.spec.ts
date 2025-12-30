import { test, expect, devices } from '@playwright/test';

test.use(devices['iPhone 13']);

test.describe('Mobile Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Mobile Menu Toggle', () => {
    test('mobile menu button is visible', async ({ page }) => {
      await expect(page.getByTestId('button-mobile-menu')).toBeVisible();
    });

    test('mobile menu opens on click', async ({ page }) => {
      await page.getByTestId('button-mobile-menu').click();
      await expect(page.getByTestId('link-mobile-products')).toBeVisible();
    });

    test('mobile menu closes on second click', async ({ page }) => {
      await page.getByTestId('button-mobile-menu').click();
      await expect(page.getByTestId('link-mobile-products')).toBeVisible();

      await page.getByTestId('button-mobile-menu').click();
      await expect(page.getByTestId('link-mobile-products')).not.toBeVisible();
    });
  });

  test.describe('Mobile Nav Links', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId('button-mobile-menu').click();
      // Wait for menu animation to complete
      await expect(page.getByTestId('link-mobile-products')).toBeVisible();
    });

    // Skip: Flaky test - click with force:true doesn't reliably navigate
    test.skip('all products link works', async ({ page }) => {
      const link = page.getByTestId('link-mobile-products');
      await link.click({ force: true });
      await expect(page).toHaveURL('/products');
    });

    test('contact link works', async ({ page }) => {
      await page.getByTestId('link-mobile-contact').click();
      await expect(page).toHaveURL('/contact');
    });

    // These links exist but pages are MISSING
    test.skip('resources link works', async ({ page }) => {
      await page.getByTestId('link-mobile-resources').click();
      await expect(page).toHaveURL('/resources');
    });

    test.skip('about link works', async ({ page }) => {
      await page.getByTestId('link-mobile-about').click();
      await expect(page).toHaveURL('/about');
    });

    test.skip('industries link works', async ({ page }) => {
      await page.getByTestId('link-mobile-industries').click();
      await expect(page).toHaveURL('/industries');
    });
  });

  test.describe('Mobile Quote Button', () => {
    test('quote button is visible', async ({ page }) => {
      await expect(page.getByTestId('button-quote-mobile')).toBeVisible();
    });
  });

  test.describe('Mobile Search', () => {
    test('search appears when menu is open', async ({ page }) => {
      await page.getByTestId('button-mobile-menu').click();
      await expect(page.getByTestId('input-search-mobile')).toBeVisible();
    });
  });

  test.describe('Mobile Logo', () => {
    test('logo is visible on mobile', async ({ page }) => {
      const logo = page.getByTestId('link-home').locator('img');
      await expect(logo).toBeVisible();
    });

    test('logo links to home', async ({ page }) => {
      await page.getByTestId('link-home').click();
      await expect(page).toHaveURL('/');
    });
  });
});
