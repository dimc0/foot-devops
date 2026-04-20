// lib/db/types.ts
import type { Match } from "@/lib/tsdb/types"

export interface User {
  id: string
  username: string
  created_at: string
}

export interface Favorite {
  id: number
  user_id: string
  match_id: number
  added_at: string
}


export interface HydratedFavorite extends Favorite, Match {}