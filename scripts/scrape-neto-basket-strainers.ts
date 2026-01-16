/**
 * Scrape basket strainer product pages from Neto to collect images, videos, and datasheets
 * Usage: npx tsx scripts/scrape-neto-basket-strainers.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const NETO_BASE_URL = 'https://www.dewaterproducts.com.au';

// Basket strainer products to scrape (from search results)
const PRODUCTS_TO_SCRAPE = [
  { sku: 'DBS3W316', slug: 'duplex-basket-strainer-316ss-fitted-with-3-way-fla~940' },
  { sku: 'DBSTPB316', slug: 'duplex-basket-strainer-316ss-fitted-with-ss-butter~945' },
  { sku: 'DBSTPBCS', slug: 'duplex-basket-strainer-carbon-steel-fitted-with-di' },
  { sku: 'FCBSCS', slug: 'fabricated-simplex-basket-strainer-flanged-ansi-15' },
  { sku: 'OSSBS', slug: 'oversized-simplex-basket-strainer' },
  { sku: 'SBS316-ANSI150', slug: 'simplex-basket-strainer-316-ss-flanged-ansi-150lb' },
  { sku: 'SBS316-ASPN16', slug: 'simplex-basket-strainer-316-ss-flanged-as4087-pn16' },
  { sku: 'SBS316-TD_', slug: 'simplex-basket-strainer-316-ss-flanged-table-d' },
  { sku: 'SBS316-TE', slug: 'simplex-basket-strainer-316-ss-flanged-table-e' },
  { sku: 'SBSCS', slug: 'simplex-basket-strainer-cast-steel-flanged-ansi-15' },
];

interface ScrapedProduct {
  sku: string;
  netoUrl: string;
  images: {
    main: string | null;
    alt: string[];
  };
  videos: string[];
  hasVideoTab: boolean;
  scrapedAt: string;
}

async function scrapeProductPage(sku: string, slug: string): Promise<ScrapedProduct> {
  const url = NETO_BASE_URL + '/' + slug;
  console.log('Scraping: ' + sku + ' - ' + url);

  // Fetch the page HTML
  const response = await fetch(url);
  const html = await response.text();

  // Extract main image URL from /assets/full/{SKU}.jpg pattern
  const mainImageMatch = html.match(/\/assets\/full\/([^"'?]+)/);
  const mainImage = mainImageMatch ? NETO_BASE_URL + '/assets/full/' + mainImageMatch[1] : null;

  // Extract alt images from /assets/alt_X/{SKU}.jpg patterns
  const altImages: string[] = [];
  const altMatches = html.matchAll(/\/assets\/alt_(\d+)\/([^"'?]+)/g);
  for (const match of altMatches) {
    const altUrl = NETO_BASE_URL + '/assets/alt_' + match[1] + '/' + match[2];
    if (!altImages.includes(altUrl)) {
      altImages.push(altUrl);
    }
  }

  // Extract YouTube video IDs from embed iframes
  // Videos are embedded as: <iframe src="https://www.youtube.com/embed/{VIDEO_ID}">
  const videos: string[] = [];
  const youtubeEmbedMatches = html.matchAll(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/g);
  for (const match of youtubeEmbedMatches) {
    const videoUrl = 'https://www.youtube.com/watch?v=' + match[1];
    if (!videos.includes(videoUrl)) {
      videos.push(videoUrl);
    }
  }

  // Also check for Video tab presence (link to #youtubeVideo)
  const hasVideoTab = html.includes('#youtubeVideo');

  // No datasheets for basket strainers (confirmed by user)

  return {
    sku,
    netoUrl: url,
    images: {
      main: mainImage,
      alt: altImages,
    },
    videos,
    hasVideoTab,
    scrapedAt: new Date().toISOString(),
  };
}

async function main() {
  console.log('Scraping basket strainer products from Neto...\n');

  const results: ScrapedProduct[] = [];

  for (const product of PRODUCTS_TO_SCRAPE) {
    try {
      const scraped = await scrapeProductPage(product.sku, product.slug);
      results.push(scraped);

      console.log('  Main image: ' + (scraped.images.main ? 'YES' : 'NO'));
      console.log('  Alt images: ' + scraped.images.alt.length);
      if (scraped.images.alt.length > 0) {
        scraped.images.alt.forEach(url => console.log('    - ' + url.split('/').pop()));
      }
      console.log('  Video tab: ' + (scraped.hasVideoTab ? 'YES' : 'NO'));
      console.log('  Videos found: ' + scraped.videos.length);
      if (scraped.videos.length > 0) {
        scraped.videos.forEach(v => console.log('    - ' + v));
      }
      console.log('');

      // Small delay to be nice to the server
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error scraping ' + product.sku + ':', error);
    }
  }

  // Save results
  const output = {
    scrapedAt: new Date().toISOString(),
    totalProducts: results.length,
    summary: {
      withMainImage: results.filter(r => r.images.main).length,
      withAltImages: results.filter(r => r.images.alt.length > 0).length,
      totalAltImages: results.reduce((sum, r) => sum + r.images.alt.length, 0),
      withVideoTab: results.filter(r => r.hasVideoTab).length,
      withVideos: results.filter(r => r.videos.length > 0).length,
    },
    products: results,
  };

  const outputPath = path.join(process.cwd(), '.planning', 'audit', 'neto-basket-scrape.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log('Results saved to: ' + outputPath);

  // Print summary
  console.log('\n=== SUMMARY ===');
  console.log('Products scraped: ' + output.totalProducts);
  console.log('With main image: ' + output.summary.withMainImage);
  console.log('With alt images: ' + output.summary.withAltImages + ' (' + output.summary.totalAltImages + ' total)');
  console.log('With video tab: ' + output.summary.withVideoTab);
  console.log('With videos found: ' + output.summary.withVideos);
}

main().catch(console.error);
