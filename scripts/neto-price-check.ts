/**
 * Neto Price Check Script
 * Compares product prices in our database against the live Neto store
 *
 * Run with: npx tsx scripts/neto-price-check.ts
 *
 * Options:
 *   --fix     Update database with correct Neto prices
 *   --sku=X   Check only specific SKU (e.g., --sku=BFLYW316)
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';

// Check required env vars
if (!process.env.NETO_API_KEY) {
  console.error('Missing NETO_API_KEY in .env.local');
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error('Missing DATABASE_URL in .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

// Parse args
const args = process.argv.slice(2);
const shouldFix = args.includes('--fix');
const skuArg = args.find(a => a.startsWith('--sku='));
const filterSku = skuArg ? skuArg.split('=')[1] : null;

interface NetoItem {
  SKU: string;
  Name: string;
  DefaultPrice: string;
  ParentSKU?: string;
  IsActive: string;
}

interface NetoResponse {
  Item: NetoItem[];
  Ack: string;
  Messages?: Array<{ Error?: { Message: string; SeverityCode?: string } }>;
}

async function fetchNetoProducts(page = 0, limit = 100): Promise<NetoItem[]> {
  const url = 'https://www.dewaterproducts.com.au/do/WS/NetoAPI';

  const body = {
    Filter: {
      IsActive: [true],
      Page: page,
      Limit: limit,
      OutputSelector: [
        'SKU',
        'Name',
        'DefaultPrice',
        'ParentSKU',
        'IsActive'
      ]
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'NETOAPI_ACTION': 'GetItem',
      'NETOAPI_KEY': process.env.NETO_API_KEY!
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Neto API error: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  let data: NetoResponse;

  try {
    data = JSON.parse(text);
  } catch {
    console.error('Raw response:', text.substring(0, 500));
    throw new Error('Invalid JSON response from Neto API');
  }

  if (data.Ack !== 'Success') {
    console.error('Neto API response:', JSON.stringify(data, null, 2));
    const errorMsg = data.Messages?.[0]?.Error?.Message || 'Unknown error';
    throw new Error(`Neto API error: ${errorMsg}`);
  }

  return data.Item || [];
}

async function getAllNetoProducts(): Promise<Map<string, NetoItem>> {
  const allItems = new Map<string, NetoItem>();
  let page = 0;
  const limit = 100;

  console.log('Fetching products from Neto API...');

  while (true) {
    const items = await fetchNetoProducts(page, limit);

    if (items.length === 0) break;

    for (const item of items) {
      allItems.set(item.SKU, item);
    }

    console.log(`  Fetched page ${page + 1}: ${items.length} items (total: ${allItems.size})`);

    if (items.length < limit) break;
    page++;
  }

  return allItems;
}

async function getOurProducts(skuFilter?: string | null): Promise<Array<{ sku: string; price: string | null; productSku: string }>> {
  let query = `
    SELECT pv.sku, pv.price, p.sku as product_sku
    FROM product_variations pv
    JOIN products p ON pv.product_id = p.id
  `;

  if (skuFilter) {
    query += ` WHERE pv.sku LIKE '${skuFilter}%' OR p.sku = '${skuFilter}'`;
  }

  query += ' ORDER BY pv.sku';

  return sql(query) as Promise<Array<{ sku: string; price: string | null; productSku: string }>>;
}

async function updatePrice(sku: string, newPrice: number): Promise<void> {
  await sql`UPDATE product_variations SET price = ${String(newPrice)} WHERE sku = ${sku}`;
}

async function main() {
  console.log('='.repeat(60));
  console.log('Neto Price Check');
  console.log('='.repeat(60));

  if (filterSku) {
    console.log(`Filtering: ${filterSku}*`);
  }
  if (shouldFix) {
    console.log('Mode: FIX (will update database)');
  } else {
    console.log('Mode: CHECK ONLY (use --fix to update)');
  }
  console.log('');

  // Fetch Neto products
  const netoProducts = await getAllNetoProducts();
  console.log(`\nTotal Neto products: ${netoProducts.size}`);

  // Get our products
  const ourProducts = await getOurProducts(filterSku);
  console.log(`Our products to check: ${ourProducts.length}\n`);

  // Compare
  const discrepancies: Array<{ sku: string; ourPrice: number | null; netoPrice: number; diff: string }> = [];
  const notInNeto: string[] = [];
  const matches: string[] = [];

  for (const our of ourProducts) {
    const netoItem = netoProducts.get(our.sku);

    if (!netoItem) {
      notInNeto.push(our.sku);
      continue;
    }

    const ourPrice = our.price ? parseFloat(our.price) : null;
    const netoPrice = parseFloat(netoItem.DefaultPrice);

    if (ourPrice === null || Math.abs(ourPrice - netoPrice) > 0.01) {
      const diff = ourPrice
        ? `${ourPrice < netoPrice ? '+' : ''}${(((netoPrice - ourPrice) / ourPrice) * 100).toFixed(1)}%`
        : 'N/A';
      discrepancies.push({ sku: our.sku, ourPrice, netoPrice, diff });
    } else {
      matches.push(our.sku);
    }
  }

  // Report
  console.log('='.repeat(60));
  console.log('RESULTS');
  console.log('='.repeat(60));

  console.log(`\n✅ Matching prices: ${matches.length}`);

  if (discrepancies.length > 0) {
    console.log(`\n❌ Price discrepancies: ${discrepancies.length}`);
    console.log('-'.repeat(60));
    console.log('SKU'.padEnd(25) + 'Ours'.padStart(12) + 'Neto'.padStart(12) + 'Diff'.padStart(10));
    console.log('-'.repeat(60));

    for (const d of discrepancies) {
      const ourStr = d.ourPrice !== null ? `$${d.ourPrice.toFixed(2)}` : 'N/A';
      const netoStr = `$${d.netoPrice.toFixed(2)}`;
      console.log(d.sku.padEnd(25) + ourStr.padStart(12) + netoStr.padStart(12) + d.diff.padStart(10));
    }
  }

  if (notInNeto.length > 0) {
    console.log(`\n⚠️  Not found in Neto: ${notInNeto.length}`);
    if (notInNeto.length <= 20) {
      for (const sku of notInNeto) {
        console.log(`  - ${sku}`);
      }
    } else {
      console.log(`  (showing first 20)`);
      for (const sku of notInNeto.slice(0, 20)) {
        console.log(`  - ${sku}`);
      }
    }
  }

  // Fix if requested
  if (shouldFix && discrepancies.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('UPDATING DATABASE');
    console.log('='.repeat(60));

    for (const d of discrepancies) {
      await updatePrice(d.sku, d.netoPrice);
      console.log(`  ✓ Updated ${d.sku}: $${d.ourPrice?.toFixed(2) || 'N/A'} → $${d.netoPrice.toFixed(2)}`);
    }

    console.log(`\n✅ Updated ${discrepancies.length} prices`);
  } else if (discrepancies.length > 0 && !shouldFix) {
    console.log('\n💡 Run with --fix to update database prices');
  }

  console.log('\nDone!');
}

main().catch(console.error);
