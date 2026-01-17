import { db } from '@/db';
import { redirects, products } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Download, Upload, ArrowRight, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RedirectsActions } from '@/components/admin/RedirectsActions';

async function getRedirectsWithProducts() {
  try {
    const redirectsWithData = await db
      .select({
        id: redirects.id,
        fromPath: redirects.fromPath,
        toPath: redirects.toPath,
        statusCode: redirects.statusCode,
        isActive: redirects.isActive,
        productId: redirects.productId,
        createdAt: redirects.createdAt,
        expiresAt: redirects.expiresAt,
      })
      .from(redirects)
      .orderBy(desc(redirects.createdAt));

    // Get product names for linked redirects
    const productIds = redirectsWithData
      .filter((r) => r.productId)
      .map((r) => r.productId as number);

    const productMap = new Map<number, string>();
    if (productIds.length > 0) {
      const linkedProducts = await db
        .select({ id: products.id, name: products.name })
        .from(products)
        .where(eq(products.id, productIds[0])); // TODO: IN clause

      linkedProducts.forEach((p) => {
        productMap.set(p.id, p.name);
      });
    }

    return redirectsWithData.map((r) => ({
      ...r,
      productName: r.productId ? productMap.get(r.productId) || null : null,
    }));
  } catch (error) {
    console.error('Failed to get redirects:', error);
    return [];
  }
}

function formatDate(date: Date | null): string {
  if (!date) return '-';
  return date.toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function isExpired(date: Date | null): boolean {
  if (!date) return false;
  return date < new Date();
}

export default async function RedirectsListPage() {
  const redirectList = await getRedirectsWithProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Redirects</h1>
          <p className="text-gray-500">Manage 301/302 URL redirects</p>
        </div>
        <div className="flex gap-2">
          <RedirectsActions />
          <Link href="/admin/redirects/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Redirect
            </Button>
          </Link>
        </div>
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Active</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {redirectList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No redirects found. Add your first redirect to get started.
                </TableCell>
              </TableRow>
            ) : (
              redirectList.map((redirect) => (
                <TableRow key={redirect.id} className={redirect.isActive === false || isExpired(redirect.expiresAt) ? 'opacity-50' : ''}>
                  <TableCell>
                    <div className="font-mono text-sm">
                      {redirect.fromPath}
                    </div>
                    {redirect.productName && (
                      <p className="text-xs text-gray-500 mt-1">
                        Product: {redirect.productName}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <span className="font-mono text-sm">{redirect.toPath}</span>
                      {redirect.toPath.startsWith('http') && (
                        <a
                          href={redirect.toPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={redirect.statusCode === 301 ? 'default' : 'secondary'}>
                      {redirect.statusCode ?? 301}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {redirect.isActive === false ? (
                      <Badge variant="outline" className="text-gray-500">Inactive</Badge>
                    ) : isExpired(redirect.expiresAt) ? (
                      <Badge variant="outline" className="text-orange-500">Expired</Badge>
                    ) : (
                      <Badge variant="default" className="bg-green-500">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={isExpired(redirect.expiresAt) ? 'text-orange-500' : ''}>
                      {formatDate(redirect.expiresAt)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={'/admin/redirects/${redirect.id}'}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {redirectList.length > 0 && (
        <p className="text-sm text-gray-500">
          {redirectList.length} redirect{redirectList.length !== 1 ? 's' : ''} total
        </p>
      )}
    </div>
  );
}
