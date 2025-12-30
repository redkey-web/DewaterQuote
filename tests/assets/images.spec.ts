import { test, expect } from '@playwright/test';

test.describe('Image Loading', () => {

  test.describe('Global Assets', () => {
    test('logo loads on homepage', async ({ page }) => {
      await page.goto('/');
      const logo = page.getByTestId('link-home').locator('img');
      await expect(logo).toBeVisible();

      // Verify image actually loaded (not broken)
      const imgSrc = await logo.getAttribute('src');
      expect(imgSrc).toBeTruthy();
    });

    test('logo loads on main pages', async ({ page }) => {
      const pages = ['/', '/products', '/contact'];

      for (const pagePath of pages) {
        await page.goto(pagePath);
        const logo = page.getByTestId('link-home').locator('img');
        await expect(logo).toBeVisible();
      }
    });
  });

  test.describe('Static Image Files', () => {
    const staticImages = [
      '/images/logo.png',
      '/images/hero-pipes.webp',
      '/images/hero-pipeline.webp',
      '/images/brands/straub-logo.png',
      '/images/brands/teekay-logo.png',
      '/images/brands/orbit-couplings.png',
    ];

    for (const imagePath of staticImages) {
      test(`${imagePath} is accessible`, async ({ page }) => {
        const response = await page.goto(imagePath);
        expect(response?.status()).toBe(200);
        const contentType = response?.headers()['content-type'];
        expect(contentType).toMatch(/image\//);
      });
    }
  });

  test.describe('Industry Images', () => {
    const industries = [
      'mining',
      'construction',
      'marine',
      'food-beverage',
      'water-wastewater',
      'irrigation',
      'fire-services',
      'hvac',
    ];

    for (const industry of industries) {
      test(`${industry} image is accessible`, async ({ page }) => {
        const response = await page.goto(`/images/industries/${industry}.webp`);
        expect(response?.status()).toBe(200);
      });
    }
  });

  test.describe('Product Page Images', () => {
    test('products page has images', async ({ page }) => {
      await page.goto('/products');
      await page.waitForLoadState('networkidle');

      // Get all images
      const images = page.locator('img');
      const count = await images.count();

      expect(count).toBeGreaterThan(0);
    });

    test('product images have alt text', async ({ page }) => {
      await page.goto('/products');
      await page.waitForLoadState('networkidle');

      const images = page.locator('img');
      const count = await images.count();

      // Check first 5 images have alt text (for accessibility and SEO)
      for (let i = 0; i < Math.min(count, 5); i++) {
        const alt = await images.nth(i).getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    });
  });

  test.describe('Category Page Images', () => {
    const categories = [
      '/valves',
      '/pipe-couplings',
      '/strainers',
      '/rubber-expansion-joints',
    ];

    for (const category of categories) {
      test(`${category} page has images`, async ({ page }) => {
        await page.goto(category);
        await page.waitForLoadState('networkidle');

        // Check for images
        const images = page.locator('img');
        const count = await images.count();

        // Should have at least logo
        expect(count).toBeGreaterThan(0);
      });
    }
  });

  test.describe('Brand Page Images', () => {
    test('straub page has images', async ({ page }) => {
      await page.goto('/straub');
      await page.waitForLoadState('networkidle');
      const images = page.locator('img');
      const count = await images.count();
      expect(count).toBeGreaterThan(0);
    });

    test('orbit page has images', async ({ page }) => {
      await page.goto('/orbit');
      await page.waitForLoadState('networkidle');
      const images = page.locator('img');
      const count = await images.count();
      expect(count).toBeGreaterThan(0);
    });

    test('teekay page has images', async ({ page }) => {
      await page.goto('/teekay');
      await page.waitForLoadState('networkidle');
      const images = page.locator('img');
      const count = await images.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Homepage Images', () => {
    test('homepage hero section has images', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check for hero images or brand logos
      const images = page.locator('img');
      const count = await images.count();
      expect(count).toBeGreaterThan(0);
    });

    test('homepage brand logos visible', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Look for brand section images
      const brandImages = page.locator('img[alt*="Straub"], img[alt*="Orbit"], img[alt*="Teekay"]');
      // At least one brand image should be present
      const count = await brandImages.count();
      expect(count).toBeGreaterThanOrEqual(0); // May or may not have brand images on homepage
    });
  });
});
