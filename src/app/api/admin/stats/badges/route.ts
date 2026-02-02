import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { db } from "@/db"
import { quotes } from "@/db/schema"
import { eq, or, isNull, and, inArray } from "drizzle-orm"
import { count } from "drizzle-orm"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Count pending/new quotes (not deleted, status is pending or reviewed)
    const [pendingResult] = await db
      .select({ count: count() })
      .from(quotes)
      .where(
        and(
          or(eq(quotes.isDeleted, false), isNull(quotes.isDeleted)),
          inArray(quotes.status, ["pending", "reviewed"])
        )
      )

    return NextResponse.json({
      quotes: pendingResult.count,
    })
  } catch (error) {
    console.error("Badge stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
