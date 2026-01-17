import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/db';
import { redirects } from '@/db/schema';
import { normalizePath, validateRedirectPaths, invalidateRedirectCache } from '@/lib/redirects';

interface ParsedRedirect {
  fromPath: string;
  toPath: string;
  statusCode: number;
  isActive: boolean;
  expiresAt: Date | null;
}

export async function POST(request: NextRequest) {
  // Check auth
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read and parse CSV
    const csvText = await file.text();
    const lines = csvText.trim().split('\n');

    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'CSV file must have a header row and at least one data row' },
        { status: 400 }
      );
    }

    // Parse header (case-insensitive)
    const header = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim());
    const fromPathIdx = header.indexOf('frompath');
    const toPathIdx = header.indexOf('topath');
    const statusCodeIdx = header.indexOf('statuscode');
    const isActiveIdx = header.indexOf('isactive');
    const expiresAtIdx = header.indexOf('expiresat');

    if (fromPathIdx === -1 || toPathIdx === -1) {
      return NextResponse.json(
        { error: 'CSV must have fromPath and toPath columns' },
        { status: 400 }
      );
    }

    // Parse data rows
    const parsedRedirects: ParsedRedirect[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = parseCSVLine(line);
      const fromPath = values[fromPathIdx]?.trim();
      const toPath = values[toPathIdx]?.trim();

      if (!fromPath || !toPath) {
        errors.push('Row ${i + 1}: Missing fromPath or toPath');
        continue;
      }

      // Validate paths
      const validationError = validateRedirectPaths(fromPath, toPath);
      if (validationError) {
        errors.push('Row ${i + 1}: ${validationError}');
        continue;
      }

      // Parse optional fields
      const statusCodeStr = statusCodeIdx >= 0 ? values[statusCodeIdx]?.trim() : '';
      const statusCode = statusCodeStr === '302' ? 302 : 301;

      const isActiveStr = isActiveIdx >= 0 ? values[isActiveIdx]?.trim().toLowerCase() : '';
      const isActive = isActiveStr !== 'false' && isActiveStr !== '0';

      const expiresAtStr = expiresAtIdx >= 0 ? values[expiresAtIdx]?.trim() : '';
      let expiresAt: Date | null = null;
      if (expiresAtStr) {
        const parsed = new Date(expiresAtStr);
        if (!isNaN(parsed.getTime())) {
          expiresAt = parsed;
        }
      }

      parsedRedirects.push({
        fromPath: normalizePath(fromPath),
        toPath: toPath.startsWith('http') ? toPath : normalizePath(toPath),
        statusCode,
        isActive,
        expiresAt,
      });
    }

    if (parsedRedirects.length === 0) {
      return NextResponse.json(
        { error: 'No valid redirects found in CSV', details: errors },
        { status: 400 }
      );
    }

    // Insert redirects (skip duplicates)
    let inserted = 0;
    let skipped = 0;

    for (const redirect of parsedRedirects) {
      try {
        await db
          .insert(redirects)
          .values({
            fromPath: redirect.fromPath,
            toPath: redirect.toPath,
            statusCode: redirect.statusCode,
            isActive: redirect.isActive,
            expiresAt: redirect.expiresAt,
          })
          .onConflictDoNothing();
        inserted++;
      } catch {
        skipped++;
      }
    }

    // Invalidate cache
    invalidateRedirectCache();

    return NextResponse.json({
      success: true,
      imported: inserted,
      skipped,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Failed to import redirects:', error);
    return NextResponse.json(
      { error: 'Failed to import redirects' },
      { status: 500 }
    );
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else if (char === '"') {
        // End of quoted field
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        // Start of quoted field
        inQuotes = true;
      } else if (char === ',') {
        // End of field
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
  }

  // Push last field
  result.push(current);

  return result;
}
