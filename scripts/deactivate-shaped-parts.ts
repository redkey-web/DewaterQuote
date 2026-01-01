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

const slugsToDeactivate = [
  'straub-reducer',
  'straub-reducer-concentric',
  'straub-elbow-45',
  'straub-elbow-90',
  'straub-equal-tee',
  'straub-flange-adapter',
  'straub-end-cap',
  'straub-pipe-end-cap',
  'straub-reducing-tee',
  'straub-threaded',
  'straub-threaded-connection'
];

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  console.log('Deactivating Straub shaped parts (no good images)...\n');

  for (const slug of slugsToDeactivate) {
    const result = await sql`
      UPDATE products
      SET is_active = false
      WHERE slug = ${slug}
      RETURNING id, name, slug
    `;
    if (result.length > 0) {
      console.log(`✓ Deactivated: ${result[0].name} (${result[0].slug})`);
    } else {
      console.log(`⚠ Not found: ${slug}`);
    }
  }

  console.log('\n✓ Done! Products hidden from site.');
}

main().catch(console.error);
