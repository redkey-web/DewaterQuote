import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { products, brands, categories } from '@/db/schema'
import { ilike, or, eq, and } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [], message: 'Query too short' })
  }

  const searchTerm = `%${query.trim()}%`

  try {
    const results = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        shortName: products.shortName,
        description: products.description,
        category: categories.slug,
        categoryName: categories.name,
        brand: brands.name,
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(
        and(
          eq(products.isActive, true),
          or(
            ilike(products.name, searchTerm),
            ilike(products.shortName, searchTerm),
            ilike(products.description, searchTerm),
            ilike(products.sku, searchTerm),
            ilike(brands.name, searchTerm),
            ilike(categories.name, searchTerm)
          )
        )
      )
      .limit(20)

    return NextResponse.json({
      results: results.map(r => ({
        id: r.id,
        name: r.shortName || r.name,
        fullName: r.name,
        slug: r.slug,
        category: r.category,
        categoryName: r.categoryName,
        brand: r.brand,
        description: r.description?.slice(0, 100) + '...',
      })),
      query,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ results: [], error: 'Search failed' }, { status: 500 })
  }
}
