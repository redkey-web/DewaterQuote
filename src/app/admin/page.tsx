import { db } from '@/db';
import { products, categories, brands, quotes } from '@/db/schema';
import { count, eq } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Tags, Building2, Eye, FileText, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

async function getStats() {
  try {
    const [productCount] = await db.select({ count: count() }).from(products);
    const [activeProductCount] = await db.select({ count: count() }).from(products).where(eq(products.isActive, true));
    const [categoryCount] = await db.select({ count: count() }).from(categories);
    const [brandCount] = await db.select({ count: count() }).from(brands);
    const [quoteCount] = await db.select({ count: count() }).from(quotes);
    const [pendingQuoteCount] = await db.select({ count: count() }).from(quotes).where(eq(quotes.status, 'pending'));
    const [forwardedQuoteCount] = await db.select({ count: count() }).from(quotes).where(eq(quotes.status, 'forwarded'));

    return {
      products: productCount?.count ?? 0,
      activeProducts: activeProductCount?.count ?? 0,
      categories: categoryCount?.count ?? 0,
      brands: brandCount?.count ?? 0,
      quotes: quoteCount?.count ?? 0,
      pendingQuotes: pendingQuoteCount?.count ?? 0,
      forwardedQuotes: forwardedQuoteCount?.count ?? 0,
    };
  } catch (error) {
    console.error('Failed to get stats:', error);
    return { products: 0, activeProducts: 0, categories: 0, brands: 0, quotes: 0, pendingQuotes: 0, forwardedQuotes: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your product catalog</p>
      </div>

      {/* Quote Stats - Prominent Section */}
      {stats.pendingQuotes > 0 && (
        <Link href="/admin/quotes?status=pending">
          <Card className="border-amber-200 bg-amber-50 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900">
                      {stats.pendingQuotes} Pending Quote{stats.pendingQuotes !== 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-amber-700">Awaiting review and response</p>
                  </div>
                </div>
                <span className="text-amber-600 text-sm font-medium">View &rarr;</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Link href="/admin/quotes">
          <Card className="hover:border-sky-300 hover:shadow-md transition-all cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
              <FileText className="h-4 w-4 text-sky-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.quotes}</div>
              <p className="text-xs text-gray-500">
                {stats.forwardedQuotes} sent to clients
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products}</div>
            <p className="text-xs text-gray-500">
              {stats.activeProducts} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tags className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
            <p className="text-xs text-gray-500">Product categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brands</CardTitle>
            <Building2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.brands}</div>
            <p className="text-xs text-gray-500">Manufacturer brands</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">View Site</CardTitle>
            <Eye className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <Link
              href="/"
              target="_blank"
              className="text-blue-600 hover:underline text-sm"
            >
              Open public website
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Link href="/admin/quotes">
            <Card className="hover:border-sky-300 hover:shadow-md transition-all cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-100 rounded-lg">
                    <FileText className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="font-medium">View Quotes</p>
                    <p className="text-sm text-gray-500">Review quote requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/products/new">
            <Card className="hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Add New Product</p>
                    <p className="text-sm text-gray-500">Create a new product listing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/products">
            <Card className="hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Manage Products</p>
                    <p className="text-sm text-gray-500">Edit existing products</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/categories">
            <Card className="hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Tags className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Manage Categories</p>
                    <p className="text-sm text-gray-500">Organize product categories</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
