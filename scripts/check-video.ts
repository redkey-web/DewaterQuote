import { db } from '../src/lib/db';
import { products } from '../src/lib/db/schema';
import { ilike, or } from 'drizzle-orm';

async function main() {
  const results = await db.select({
    id: products.id,
    name: products.name,
    slug: products.slug,
    video: products.video
  }).from(products).where(
    or(
      ilike(products.slug, '%ball-check%'),
      ilike(products.name, '%ball check%')
    )
  );
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}
main();
