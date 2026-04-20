
import { getTodayMatches } from "@/lib/tsdb/client"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const matches = await getTodayMatches()
    return NextResponse.json(matches, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("[/api/matches] Failed to fetch matches from Football-Data:", error)
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    )
  }
}
