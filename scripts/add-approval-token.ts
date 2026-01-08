import 'dotenv/config'
import { db } from '../src/db'
import { sql } from 'drizzle-orm'

async function addApprovalTokenColumn() {
  console.log('Adding approval token columns to quotes table...')

  try {
    await db.execute(sql`
      ALTER TABLE quotes
      ADD COLUMN IF NOT EXISTS approval_token TEXT UNIQUE,
      ADD COLUMN IF NOT EXISTS approval_token_expires_at TIMESTAMP
    `)

    console.log('✓ Successfully added approval token columns')
  } catch (error) {
    console.error('Error adding columns:', error)
    throw error
  }
}

addApprovalTokenColumn()
  .then(() => {
    console.log('Migration complete')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
