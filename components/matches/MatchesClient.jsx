// components/matches/MatchesClient.jsx
"use client"
import { useEffect, useState } from "react"
import MatchCard from "./MatchCard"

export default function MatchesClient() {
  const [matches, setMatches] = useState([])
  const [favoriteIds, setFavoriteIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        const matchesResponse = await fetch("/api/matches", {
          cache: "no-store",
        })
        const favoritesResponse = await fetch("/api/favorites", {
          cache: "no-store",
        })

        if (!matchesResponse.ok) {
          throw new Error("Erreur lors de la récupération des matches")
        }

        if (!favoritesResponse.ok) {
          throw new Error("Erreur lors de la récupération des favoris")
        }

        const matchesData = await matchesResponse.json()
        const favoritesData = await favoritesResponse.json()

        setMatches(matchesData)
        setFavoriteIds(favoritesData.map((favorite) => favorite.match_id))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  async function handleAddFavorite(matchId) {
    setError(null)

    try {
      const response = await fetch(`/api/favorites/${matchId}`, {
        method: "POST",
      })

      if (!response.ok && response.status !== 409) {
        throw new Error("Impossible d'ajouter ce match aux favoris")
      }

      setFavoriteIds((current) =>
        current.includes(matchId) ? current : [...current, matchId]
      )
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleRemoveFavorite(matchId) {
    setError(null)

    try {
      const response = await fetch(`/api/favorites/${matchId}`, {
        method: "DELETE",
      })

      if (!response.ok && response.status !== 404) {
        throw new Error("Impossible de supprimer ce match des favoris")
      }

      setFavoriteIds((current) => current.filter((id) => id !== matchId))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <p className="text-gray-500">Chargement...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          buttonText={
            favoriteIds.includes(match.id)
              ? "Supprimer des favoris"
              : "Ajouter aux favoris"
          }
          onButtonClick={() => {
            if (favoriteIds.includes(match.id)) {
              handleRemoveFavorite(match.id)
            } else {
              handleAddFavorite(match.id)
            }
          }}
        />
      ))}
    </div>
  )
}
