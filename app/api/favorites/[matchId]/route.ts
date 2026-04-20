import { NextResponse } from "next/server"
import { addFavorite, removeFavorite } from "@/lib/db/favorites"

const DEMO_USER_ID = "user-demo"

type RouteParams = { params: Promise<{ matchId: string }> }

export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const { matchId: matchIdParam } = await params
    const matchId = parseInt(matchIdParam, 10)

    if (isNaN(matchId)) {
      return NextResponse.json({ error: "Invalid matchId" }, { status: 400 })
    }

    const created = await addFavorite(DEMO_USER_ID, matchId)

    if (!created) {
      return NextResponse.json({ error: "Already in favorites" }, { status: 409 })
    }

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("[POST /api/favorites] Error:", error)
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { matchId: matchIdParam } = await params
    const matchId = parseInt(matchIdParam, 10)

    if (isNaN(matchId)) {
      return NextResponse.json({ error: "Invalid matchId" }, { status: 400 })
    }

    const deleted = await removeFavorite(DEMO_USER_ID, matchId)

    if (!deleted) {
      return NextResponse.json({ error: "Favorite not found" }, { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[DELETE /api/favorites] Error:", error)
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 })
  }
}