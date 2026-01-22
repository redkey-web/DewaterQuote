/**
 * Recover Datasheets from Wayback Machine
 *
 * This script:
 * 1. Queries Wayback Machine CDX API for archived PDFs
 * 2. Downloads each PDF from the latest snapshot
 * 3. Uploads to Vercel Blob storage
 * 4. Updates the database with new URLs
 *
 * Run with: npx tsx scripts/recover-datasheets-wayback.ts
 *
 * Options:
 *   --dry-run     Show what would be done without downloading/uploading
 *   --download    Only download to local folder (no upload)
 *   --limit=N     Process only N files (for testing)
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { put } from '@vercel/blob';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { productDownloads } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

// Check required env vars
if (!process.env.DATABASE_URL) {
  console.error('Missing DATABASE_URL in .env.local');
  process.exit(1);
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('Missing BLOB_READ_WRITE_TOKEN in .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// Parse args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const downloadOnly = args.includes('--download');
const limitArg = args.find(a => a.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : undefined;

const WAYBACK_CDX_API = 'https://web.archive.org/cdx/search/cdx';
const WAYBACK_BASE = 'https://web.archive.org/web';
const LOCAL_DOWNLOAD_DIR = './downloads/brochures';

interface WaybackEntry {
  urlkey: string;
  timestamp: string;
  original: string;
  mimetype: string;
  statuscode: string;
  digest: string;
  length: string;
}

interface RecoveryResult {
  originalUrl: string;
  filename: string;
  waybackUrl: string;
  blobUrl?: string;
  status: 'success' | 'failed' | 'skipped';
  error?: string;
}

async function getArchivedPdfs(): Promise<WaybackEntry[]> {
  console.log('Querying Wayback Machine CDX API...');

  const url = new URL(WAYBACK_CDX_API);
  url.searchParams.set('url', 'dewaterproducts.com.au/assets/brochures/');
  url.searchParams.set('matchType', 'prefix');
  url.searchParams.set('output', 'json');
  url.searchParams.set('filter', 'statuscode:200');
  url.searchParams.set('collapse', 'urlkey');
  url.searchParams.set('limit', '500');

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('CDX API failed: ' + response.status);
  }

  const data = await response.json() as string[][];

  // First row is headers
  const entries: WaybackEntry[] = data.slice(1).map(row => ({
    urlkey: row[0],
    timestamp: row[1],
    original: row[2],
    mimetype: row[3],
    statuscode: row[4],
    digest: row[5],
    length: row[6],
  }));

  return entries;
}

async function downloadFromWayback(waybackUrl: string, filename: string): Promise<Buffer> {
  console.log('  Downloading: ' + filename);

  const response = await fetch(waybackUrl);
  if (!response.ok) {
    throw new Error('Download failed: ' + response.status);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadToVercelBlob(buffer: Buffer, filename: string): Promise<string> {
  console.log('  Uploading to Vercel Blob: ' + filename);

  const blob = await put('downloads/brochures/' + filename, buffer, {
    access: 'public',
    contentType: 'application/pdf',
  });

  return blob.url;
}

async function updateDatabaseUrl(oldUrl: string, newUrl: string): Promise<boolean> {
  try {
    await db
      .update(productDownloads)
      .set({ url: newUrl })
      .where(eq(productDownloads.url, oldUrl));

    return true;
  } catch (error) {
    console.error('  Failed to update DB for ' + oldUrl + ':', error);
    return false;
  }
}

async function saveLocalCopy(buffer: Buffer, filename: string): Promise<void> {
  if (!fs.existsSync(LOCAL_DOWNLOAD_DIR)) {
    fs.mkdirSync(LOCAL_DOWNLOAD_DIR, { recursive: true });
  }

  const filepath = path.join(LOCAL_DOWNLOAD_DIR, filename);
  fs.writeFileSync(filepath, buffer);
  console.log('  Saved locally: ' + filepath);
}

async function main() {
  console.log('='.repeat(60));
  console.log('Datasheet Recovery from Wayback Machine');
  console.log('='.repeat(60));

  if (dryRun) console.log('*** DRY RUN MODE - No changes will be made ***\n');
  if (downloadOnly) console.log('*** DOWNLOAD ONLY - Files saved locally ***\n');
  if (limit) console.log('*** LIMITED TO ' + limit + ' FILES ***\n');

  // Step 1: Get list of archived PDFs
  const archived = await getArchivedPdfs();
  console.log('Found ' + archived.length + ' archived PDFs\n');

  // Filter to only PDFs
  const pdfEntries = archived.filter(e => e.original.endsWith('.pdf'));
  console.log('PDF files: ' + pdfEntries.length + '\n');

  // Deduplicate by filename (keep most recent)
  const uniqueByFilename = new Map<string, WaybackEntry>();
  for (const entry of pdfEntries) {
    const filename = entry.original.split('/').pop() || '';
    const existing = uniqueByFilename.get(filename);
    if (!existing || entry.timestamp > existing.timestamp) {
      uniqueByFilename.set(filename, entry);
    }
  }

  console.log('Unique PDFs after deduplication: ' + uniqueByFilename.size + '\n');

  // Step 2: Process each PDF
  const results: RecoveryResult[] = [];
  let processed = 0;
  const total = limit || uniqueByFilename.size;

  for (const [filename, entry] of uniqueByFilename) {
    if (limit && processed >= limit) break;
    processed++;

    console.log('[' + processed + '/' + total + '] Processing: ' + filename);

    const waybackUrl = WAYBACK_BASE + '/' + entry.timestamp + 'if_/' + entry.original;

    const result: RecoveryResult = {
      originalUrl: entry.original,
      filename,
      waybackUrl,
      status: 'success',
    };

    try {
      if (dryRun) {
        console.log('  Would download from: ' + waybackUrl);
        console.log('  Would upload to: downloads/brochures/' + filename);
        result.status = 'skipped';
      } else {
        // Download from Wayback
        const buffer = await downloadFromWayback(waybackUrl, filename);

        if (downloadOnly) {
          // Save locally only
          await saveLocalCopy(buffer, filename);
        } else {
          // Upload to Vercel Blob
          const blobUrl = await uploadToVercelBlob(buffer, filename);
          result.blobUrl = blobUrl;
          console.log('  Blob URL: ' + blobUrl);

          // Update database
          const oldNetoUrl = 'https://www.dewaterproducts.com.au/assets/brochures/' + filename;
          const updated = await updateDatabaseUrl(oldNetoUrl, blobUrl);
          if (updated) {
            console.log('  Database updated');
          }
        }
      }
    } catch (error) {
      result.status = 'failed';
      result.error = error instanceof Error ? error.message : String(error);
      console.error('  ERROR: ' + result.error);
    }

    results.push(result);

    // Small delay to be nice to Wayback Machine
    if (!dryRun) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Step 3: Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.status === 'success').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const skipped = results.filter(r => r.status === 'skipped').length;

  console.log('Total processed: ' + results.length);
  console.log('Successful: ' + successful);
  console.log('Failed: ' + failed);
  console.log('Skipped: ' + skipped);

  if (failed > 0) {
    console.log('\nFailed files:');
    results
      .filter(r => r.status === 'failed')
      .forEach(r => console.log('  - ' + r.filename + ': ' + r.error));
  }

  // Save results to file
  const today = new Date().toISOString().split('T')[0];
  const resultsPath = '.planning/audit/wayback-recovery-' + today + '.json';
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log('\nResults saved to: ' + resultsPath);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
