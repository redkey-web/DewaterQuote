import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/db';
import { redirects } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  // Check auth
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all redirects
    const allRedirects = await db
      .select({
        fromPath: redirects.fromPath,
        toPath: redirects.toPath,
        statusCode: redirects.statusCode,
        isActive: redirects.isActive,
        expiresAt: redirects.expiresAt,
      })
      .from(redirects)
      .orderBy(desc(redirects.createdAt));

    // Generate CSV
    const csvHeader = 'fromPath,toPath,statusCode,isActive,expiresAt';
    const csvRows = allRedirects.map((r) => {
      const expiresAtStr = r.expiresAt ? r.expiresAt.toISOString().split('T')[0] : '';
      const fromPath = escapeCSV(r.fromPath);
      const toPath = escapeCSV(r.toPath);
      const statusCode = r.statusCode ?? 301;
      const isActive = r.isActive ?? true;
      return [fromPath, toPath, statusCode, isActive, expiresAtStr].join(',');
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');

    // Return as downloadable CSV
    const today = new Date().toISOString().split('T')[0];
    const filename = 'redirects-' + today + '.csv';
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="' + filename + '"',
      },
    });
  } catch (error) {
    console.error('Failed to export redirects:', error);
    return NextResponse.json(
      { error: 'Failed to export redirects' },
      { status: 500 }
    );
  }
}

function escapeCSV(value: string): string {
  // Escape quotes and wrap in quotes if contains comma, quote, or newline
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}
