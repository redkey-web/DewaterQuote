import { config } from 'dotenv';
config({ path: '.env.local' });

async function findStrainers() {
  const url = 'https://www.dewaterproducts.com.au/do/WS/NetoAPI';
  let page = 0;
  const limit = 100;
  const strainers: any[] = [];

  console.log('Fetching all products to find strainers...');

  while (true) {
    const body = {
      Filter: {
        IsActive: [true],
        Page: page,
        Limit: limit,
        OutputSelector: ['SKU', 'Name', 'DefaultPrice', 'ParentSKU']
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

    const data = await response.json();
    const items = data.Item || [];

    if (items.length === 0) break;

    // Find strainer products
    for (const item of items) {
      const name = (item.Name || '').toLowerCase();
      const sku = item.SKU || '';
      if (name.includes('strainer') || name.includes('y-strainer') || sku.includes('SSYS') || sku.includes('YS')) {
        strainers.push(item);
      }
    }

    if (items.length < limit) break;
    page++;
  }

  console.log(`\nFound ${strainers.length} strainer products:\n`);
  console.log('SKU'.padEnd(20) + 'Price'.padStart(12) + '  Name');
  console.log('-'.repeat(80));

  strainers
    .sort((a, b) => {
      // Sort by SKU
      return a.SKU.localeCompare(b.SKU);
    })
    .forEach((item) => {
      const price = parseFloat(item.DefaultPrice);
      const name = item.Name?.substring(0, 45) || '';
      console.log(`${item.SKU.padEnd(20)} $${price.toFixed(0).padStart(10)}  ${name}`);
    });
}

findStrainers().catch(console.error);
