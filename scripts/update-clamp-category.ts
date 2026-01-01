import * as fs from 'fs';
import * as path from 'path';

// Load env from .env.local before other imports
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
});

import { neon } from '@neondatabase/serverless';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  // Find all subcategories
  const subcats = await sql`SELECT id, slug, name, category_id FROM subcategories`;
  console.log('Available subcategories:');
  subcats.forEach((s: any) => console.log(`  - ${s.slug} (id: ${s.id})`));

  // Find straub-pipe-repair-clamps subcategory
  const repairClampSubcat = subcats.find((s: any) => s.slug === 'straub-pipe-repair-clamps');

  if (!repairClampSubcat) {
    console.log('\n⚠ straub-pipe-repair-clamps subcategory not found');
    return;
  }

  console.log(`\nFound subcategory: ${repairClampSubcat.name} (id: ${repairClampSubcat.id})`);

  // Find Straub clamp products
  const clampProducts = await sql`
    SELECT id, slug, name, subcategory_id, category_id
    FROM products
    WHERE slug LIKE '%straub-clamp%'
  `;

  console.log(`\nFound ${clampProducts.length} Straub clamp products:`);
  clampProducts.forEach((p: any) => {
    console.log(`  - ${p.slug} (current subcategory_id: ${p.subcategory_id})`);
  });

  // Update the products to use the pipe-repair-clamp subcategory
  for (const product of clampProducts) {
    await sql`
      UPDATE products
      SET subcategory_id = ${repairClampSubcat.id},
          category_id = ${repairClampSubcat.category_id}
      WHERE id = ${product.id}
    `;
    console.log(`✓ Updated ${product.slug} → subcategory: pipe-repair-clamp`);
  }

  console.log('\n✓ All clamp products updated!');
}

main().catch(console.error);
