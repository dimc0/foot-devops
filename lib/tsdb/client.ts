import type { Match, MatchesResponse } from "./types"

const footballFetch = async <T>(endpoint: string, revalidate = 3600): Promise<T> => {
  const response = await fetch(`https://api.football-data.org/v4${endpoint}`, {
    headers: {
      "X-Auth-Token": process.env.TSDB_API_KEY!,
      "Content-Type": "application/json",
    },
    next: { revalidate },
  })

  if (!response.ok) {
    throw new Error(`Football-Data error: ${response.status} on ${endpoint}`)
  }

  return response.json() as Promise<T>
}

/**
 * Récupère la liste des matches du jour.
 * Les résultats sont mis en cache pendant 1 minute.
 */
export const getTodayMatches = async (): Promise<Match[]> => {
  const data = await footballFetch<MatchesResponse>("/matches", 60)
  return data.matches
}

/**
 * Récupère les détails d'un match par son identifiant.
 * Mis en cache pendant 1 heure.
 *
 * @param id - Identifiant du match
 */
export const getMatchById = async (id: number): Promise<Match> => {
  return footballFetch<Match>(`/matches/${id}`)
}
