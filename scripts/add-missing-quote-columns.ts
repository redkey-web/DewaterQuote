import { sql } from 'drizzle-orm';
import { db } from '../src/db';

async function addMissingColumns() {
  console.log('Adding missing columns to quotes table...\n');

  const columnsToAdd = [
    { name: 'shipping_cost', type: 'DECIMAL(10,2)' },
    { name: 'shipping_notes', type: 'TEXT' },
    { name: 'reviewed_at', type: 'TIMESTAMP' },
    { name: 'forwarded_at', type: 'TIMESTAMP' },
    { name: 'responded_at', type: 'TIMESTAMP' },
    { name: 'client_ip', type: 'TEXT' },
  ];

  try {
    for (const col of columnsToAdd) {
      await db.execute(sql.raw(`
        ALTER TABLE quotes
        ADD COLUMN IF NOT EXISTS ${col.name} ${col.type};
      `));
      console.log(`✓ Added/verified column: ${col.name}`);
    }

    // Verify columns exist
    const result = await db.execute(sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'quotes'
      ORDER BY column_name;
    `);

    console.log('\nAll columns in quotes table:');
    result.rows.forEach((row: any) => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });

    console.log('\n✅ Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

addMissingColumns();
