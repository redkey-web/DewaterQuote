import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { db } from "@/db"
import { quotes, products, brands } from "@/db/schema"
import { or, ilike, desc, eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const searchTerm = "%" + query + "%"

  try {
    // Search quotes
    const quotesResults = await db
      .select({
        id: quotes.id,
        quoteNumber: quotes.quoteNumber,
        companyName: quotes.companyName,
        contactName: quotes.contactName,
        email: quotes.email,
        status: quotes.status,
        createdAt: quotes.createdAt,
      })
      .from(quotes)
      .where(
        or(
          ilike(quotes.quoteNumber, searchTerm),
          ilike(quotes.companyName, searchTerm),
          ilike(quotes.contactName, searchTerm),
          ilike(quotes.email, searchTerm)
        )
      )
      .orderBy(desc(quotes.createdAt))
      .limit(5)

    // Search products
    const productsResults = await db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        slug: products.slug,
        brand: brands.name,
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(
        or(
          ilike(products.name, searchTerm),
          ilike(products.sku, searchTerm),
          ilike(products.slug, searchTerm)
        )
      )
      .orderBy(desc(products.updatedAt))
      .limit(5)

    const results = [
      ...quotesResults.map((q) => ({
        type: "quote" as const,
        id: q.id,
        title: q.quoteNumber,
        subtitle: q.companyName + " · " + q.contactName,
        url: "/admin/quotes/" + q.id,
      })),
      ...productsResults.map((p) => ({
        type: "product" as const,
        id: p.id,
        title: p.name,
        subtitle: (p.brand || "Unknown") + " · " + p.sku,
        url: "/admin/products/" + p.id,
      })),
    ]

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
