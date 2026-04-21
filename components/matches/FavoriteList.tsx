"use client"

import { useEffect, useState } from "react"
import MatchCard from "./MatchCard"

export default function FavoriteList() {
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/favorites")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la récupération des favoris")
        return res.json()
      })
      .then((data) => setFavorites(data))
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleRemoveFavorite(matchId: number) {
    setError(null)

    try {
      const res = await fetch(`/api/favorites/${matchId}`, { method: "DELETE" })

      if (!res.ok && res.status !== 404) {
        throw new Error("Impossible de supprimer ce favori")
      }

      setFavorites((current) =>
        current.filter((match: any) => match.match_id !== matchId)
      )
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) return <p className="text-gray-500">Chargement de vos favoris...</p>
  if (error) return <p className="text-red-500">{error}</p>

  if (favorites.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-gray-600">
        Vous n&apos;avez pas encore de favoris.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {favorites.map((match: any) => (
        <MatchCard
          key={match.match_id}
          match={match}
          buttonText="Supprimer des favoris"
          onButtonClick={() => handleRemoveFavorite(match.match_id)}
        />
      ))}
    </div>
  )
}