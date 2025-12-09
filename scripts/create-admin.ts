/**
 * Create Admin User Script
 *
 * Usage: npx tsx scripts/create-admin.ts <email> <password> [name]
 * Example: npx tsx scripts/create-admin.ts admin@dewaterproducts.com.au MySecurePass123 "Admin User"
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { adminUsers } from '../src/db/schema';
import { eq } from 'drizzle-orm';

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Usage: npx tsx scripts/create-admin.ts <email> <password> [name]');
  console.log('Example: npx tsx scripts/create-admin.ts admin@example.com MyPassword "John Smith"');
  process.exit(1);
}

const [email, password, name] = args;

async function createAdmin() {
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL not set in .env.local');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  // Check if user already exists
  const existing = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email));

  if (existing.length > 0) {
    console.log(`Admin user with email "${email}" already exists.`);
    process.exit(0);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Insert user
  const [user] = await db
    .insert(adminUsers)
    .values({
      email,
      passwordHash,
      name: name || null,
    })
    .returning();

  console.log('Admin user created successfully!');
  console.log(`  Email: ${user.email}`);
  console.log(`  Name: ${user.name || '(not set)'}`);
  console.log(`  ID: ${user.id}`);
}

createAdmin().catch((err) => {
  console.error('Failed to create admin:', err);
  process.exit(1);
});
