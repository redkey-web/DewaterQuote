import { config } from 'dotenv';
config({ path: '.env.local' });

async function getSSYSProducts() {
  const url = 'https://www.dewaterproducts.com.au/do/WS/NetoAPI';

  const body = {
    Filter: {
      SKU: ['SSYS%'],
      IsActive: [true],
      Limit: 100,
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

  if (data.Item) {
    console.log('SSYS products in Neto:\n');
    console.log('SKU'.padEnd(12) + 'Price'.padStart(12));
    console.log('-'.repeat(24));

    data.Item
      .filter((i: any) => i.SKU.startsWith('SSYS-'))
      .sort((a: any, b: any) => {
        const sizeA = parseInt(a.SKU.split('-')[1]) || 0;
        const sizeB = parseInt(b.SKU.split('-')[1]) || 0;
        return sizeA - sizeB;
      })
      .forEach((item: any) => {
        const price = parseFloat(item.DefaultPrice);
        console.log(`${item.SKU.padEnd(12)} $${price.toLocaleString()}`);
      });
  }
}

getSSYSProducts().catch(console.error);
