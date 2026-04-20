// app/api/favorites/route.ts
/**
 * Route API — Liste des favoris.
 *
 * Retourne les favoris de l'utilisateur réhydratés avec les données Football-Data.
 * Les appels sont effectués en parallèle pour minimiser la latence.
 *
 * GET /api/favorites
 * → 200 HydratedFavorite[]
 * → 500 { error }
 */
import { NextResponse } from "next/server"
import { getFavoritesByUser } from "@/lib/db/favorites"
import { getMatchById } from "@/lib/tsdb/client"
import type { HydratedFavorite } from "@/lib/db/types"

const DEMO_USER_ID = "user-demo"

export async function GET() {
  try {
    const favorites = await getFavoritesByUser(DEMO_USER_ID)
    const hydrated: HydratedFavorite[] = await Promise.all(
      favorites.map(async (fav) => {
        const match = await getMatchById(fav.match_id)
        return {
          ...fav,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          utcDate: match.utcDate,
          status: match.status,
          score: match.score,
        }
      })
    )
    return NextResponse.json(hydrated, { status: 200 })
  } catch (error) {
    console.error("[GET /api/favorites] Error:", error)
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 })
  }
}