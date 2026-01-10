import { db } from '@/db';
import { quotes } from '@/db/schema';
import { desc, eq, or, isNull } from 'drizzle-orm';
import { QuotesTable } from '@/components/admin/QuotesTable';

async function getQuotes() {
  try {
    return await db.query.quotes.findMany({
      where: or(eq(quotes.isDeleted, false), isNull(quotes.isDeleted)),
      with: {
        items: true,
      },
      orderBy: [desc(quotes.createdAt)],
    });
  } catch (error) {
    console.error('Failed to get quotes:', error);
    return [];
  }
}

async function getDeletedQuotes() {
  try {
    return await db.query.quotes.findMany({
      where: eq(quotes.isDeleted, true),
      with: {
        items: true,
      },
      orderBy: [desc(quotes.deletedAt)],
    });
  } catch (error) {
    console.error('Failed to get deleted quotes:', error);
    return [];
  }
}

export default async function QuotesListPage() {
  const [quoteList, deletedList] = await Promise.all([
    getQuotes(),
    getDeletedQuotes(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quote Requests</h1>
          <p className="text-gray-500">View and manage customer quote requests</p>
        </div>
      </div>

      <QuotesTable quotes={quoteList} deletedQuotes={deletedList} />
    </div>
  );
}
