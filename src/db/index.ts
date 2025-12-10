import { drizzle } from 'drizzle-orm/neon-http';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import * as schema from './schema';

// Allow build to succeed without DATABASE_URL
// Runtime will fail if DATABASE_URL is not set when actually making queries
let sql: NeonQueryFunction<false, false> | null = null;

if (process.env.DATABASE_URL) {
  sql = neon(process.env.DATABASE_URL);
}

// Create db instance - will throw at runtime if used without DATABASE_URL
export const db = sql
  ? drizzle(sql, { schema })
  : new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
      get() {
        throw new Error('DATABASE_URL environment variable is not set');
      }
    });

// Re-export schema for convenience
export * from './schema';
