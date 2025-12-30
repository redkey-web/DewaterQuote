import { test, expect } from '@playwright/test';

test.describe('Public Pages Render', () => {

  test.describe('Main Pages', () => {
    test('home page loads', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveTitle(/Dewater/i);
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    });

    test('products page loads', async ({ page }) => {
      await page.goto('/products');
      await expect(page).toHaveTitle(/Products/i);
      await expect(page.locator('h1')).toBeVisible();
    });

    test('contact page loads', async ({ page }) => {
      await page.goto('/contact');
      // Page uses generic site title - check for form instead
      await expect(page).toHaveTitle(/Dewater/i);
      await expect(page.locator('form')).toBeVisible();
    });

    test('request-quote page loads', async ({ page }) => {
      await page.goto('/request-quote');
      // Page uses generic site title - check for h1 (form only shows when cart has items)
      await expect(page).toHaveTitle(/Dewater/i);
      await expect(page.locator('h1')).toBeVisible();
    });

    test('brands page loads', async ({ page }) => {
      await page.goto('/brands');
      await expect(page.locator('h1')).toBeVisible();
    });
  });

  test.describe('Category Pages', () => {
    test('pipe-couplings page loads', async ({ page }) => {
      await page.goto('/pipe-couplings');
      await expect(page.locator('h1')).toBeVisible();
    });

    test('pipe-repair page loads', async ({ page }) => {
      await page.goto('/pipe-repair');
      await expect(page.locator('h1')).toBeVisible();
    });

    test('pipe-repair-clamps page loads', async ({ page }) => {
      await page.goto('/pipe-repair-clamps');
      await expect(page.locator('h1')).toBeVisible();
    });

    test('flange-adaptors page loads', async ({ page }) => {
      await page.goto('/flange-adaptors');
      await expect(page.locator('h1')).toBeVisible();
    });

    test('valves page loads', async ({ page }) => {
      await page.goto('/valves');
      await expect(page.locator('h1')).toBeVisible();
    });

    test('rubber-expansion-joints page loads', async ({ page }) => {
      await page.goto('/rubber-expansion-joints');
      await expect(page.locator('h1')).toBeVisible();
    });

    test('strainers page loads', async ({ page }) => {
      await page.goto('/strainers');
      await expect(page.locator('h1')).toBeVisible();
    });
  });

  test.describe('Brand Pages', () => {
    test('straub landing page loads', async ({ page }) => {
      await page.goto('/straub');
      await expect(page.locator('h1')).toBeVisible();
    });

    test('orbit landing page loads', async ({ page }) => {
      await page.goto('/orbit');
      await expect(page.locator('h1')).toBeVisible();
    });

    test('teekay landing page loads', async ({ page }) => {
      await page.goto('/teekay');
      await expect(page.locator('h1')).toBeVisible();
    });

    test('brands/straub page loads', async ({ page }) => {
      await page.goto('/brands/straub');
      await expect(page.locator('h1')).toBeVisible();
    });

    test('brands/orbit page loads', async ({ page }) => {
      await page.goto('/brands/orbit');
      await expect(page.locator('h1')).toBeVisible();
    });

    test('brands/teekay page loads', async ({ page }) => {
      await page.goto('/brands/teekay');
      await expect(page.locator('h1')).toBeVisible();
    });
  });

  test.describe('Industry Pages', () => {
    const industries = [
      'mining',
      'construction',
      'marine',
      'food-beverage',
      'water-wastewater',
      'irrigation',
      'fire-services',
      'hvac'
    ];

    for (const industry of industries) {
      test(`${industry} industry page loads`, async ({ page }) => {
        await page.goto(`/industries/${industry}`);
        await expect(page.locator('h1')).toBeVisible();
      });
    }
  });

  test.describe('Subcategory Pages', () => {
    const subcategories = [
      { path: '/valves/butterfly-valve', name: 'butterfly valve' },
      { path: '/valves/duckbill-check-valve', name: 'duckbill check valve' },
      { path: '/valves/swing-check-valve', name: 'swing check valve' },
      { path: '/valves/gate-valve', name: 'gate valve' },
      { path: '/valves/ball-valve', name: 'ball valve' },
      { path: '/valves/knife-gate-valve', name: 'knife gate valve' },
      { path: '/rubber-expansion-joints/single-sphere', name: 'single sphere' },
      { path: '/rubber-expansion-joints/twin-sphere', name: 'twin sphere' },
      { path: '/strainers/y-strainer', name: 'y strainer' },
      { path: '/strainers/basket-strainer', name: 'basket strainer' },
    ];

    for (const sub of subcategories) {
      test(`${sub.name} subcategory page loads`, async ({ page }) => {
        await page.goto(sub.path);
        await expect(page.locator('h1')).toBeVisible();
      });
    }
  });

  test.describe('Missing Pages (should 404)', () => {
    // These tests verify that certain pages DON'T exist
    // Remove these tests when the pages are created

    test('about page returns 404', async ({ page }) => {
      const response = await page.goto('/about');
      // Should be 404 or show Next.js not found page
      expect(response?.status()).toBe(404);
    });

    test('resources page returns 404', async ({ page }) => {
      const response = await page.goto('/resources');
      expect(response?.status()).toBe(404);
    });

    test('faq page returns 404', async ({ page }) => {
      const response = await page.goto('/faq');
      expect(response?.status()).toBe(404);
    });

    test('shipping-delivery page returns 404', async ({ page }) => {
      const response = await page.goto('/shipping-delivery');
      expect(response?.status()).toBe(404);
    });

    test('returns-refunds page returns 404', async ({ page }) => {
      const response = await page.goto('/returns-refunds');
      expect(response?.status()).toBe(404);
    });

    test('payment-methods page returns 404', async ({ page }) => {
      const response = await page.goto('/payment-methods');
      expect(response?.status()).toBe(404);
    });

    test('warranty page returns 404', async ({ page }) => {
      const response = await page.goto('/warranty');
      expect(response?.status()).toBe(404);
    });

    test('terms-conditions page returns 404', async ({ page }) => {
      const response = await page.goto('/terms-conditions');
      expect(response?.status()).toBe(404);
    });

    test('privacy-policy page returns 404', async ({ page }) => {
      const response = await page.goto('/privacy-policy');
      expect(response?.status()).toBe(404);
    });
  });
});
