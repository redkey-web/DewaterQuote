import { db } from '@/db';
import { quotes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { QuoteDetail } from './QuoteDetail';

async function getQuote(id: number) {
  try {
    const quote = await db.query.quotes.findFirst({
      where: eq(quotes.id, id),
      with: {
        items: {
          orderBy: (items, { asc }) => [asc(items.displayOrder)],
        },
      },
    });
    return quote;
  } catch (error) {
    console.error('Failed to get quote:', error);
    return null;
  }
}

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quoteId = parseInt(id);

  if (isNaN(quoteId)) {
    notFound();
  }

  const quote = await getQuote(quoteId);

  if (!quote) {
    notFound();
  }

  return <QuoteDetail quote={quote} />;
}
