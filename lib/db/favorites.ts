// lib/db/favorites.ts

/**
 * Couche d'accès aux données — Favoris.
 *
 * Toutes les requêtes SQL liées aux favoris sont centralisées ici.
 * La contrainte UNIQUE(user_id, movie_id) en base garantit l'unicité
 * sans vérification applicative.
 *
 * Ce module s'exécute exclusivement côté serveur.
 */

import { db } from "./client"
import type { Favorite } from "./types"

/**
 * Retourne la liste des favoris d'un utilisateur.
 * Triés par date d'ajout décroissante (le plus récent en premier).
 */
export const getFavoritesByUser = async (userId: string): Promise<Favorite[]> => {
  const result = await db.execute({
    sql: `
      SELECT id, user_id, match_id, added_at
      FROM favorites
      WHERE user_id = ?
      ORDER BY added_at DESC
    `,
    args: [userId],
  })

  return result.rows.map((row) => ({
    id: row.id as number,
    user_id: row.user_id as string,
    match_id: row.match_id as number,
    added_at: row.added_at as string,
  }))
}

/**
 * Ajoute un film aux favoris d'un utilisateur.
 *
 * La clause INSERT OR IGNORE exploite la contrainte UNIQUE(user_id, movie_id) :
 * si le film est déjà en favori, la requête ne fait rien et rows.length vaut 0.
 *
 * @returns Le favori créé, ou null si déjà existant
 */
export const addFavorite = async (
  userId: string,
  matchId: number
): Promise<Favorite | null> => {
  const result = await db.execute({
    sql: `
      INSERT OR IGNORE INTO favorites (user_id, match_id)
      VALUES (?, ?)
      RETURNING id, user_id, match_id, added_at
    `,
    args: [userId, matchId],
  })

  if (result.rows.length === 0) {
    return null
  }

  const row = result.rows[0]

  return {
    id: row.id as number,
    user_id: row.user_id as string,
    match_id: row.match_id as number,
    added_at: row.added_at as string,
  }
}

/**
 * Supprime un film des favoris d'un utilisateur.
 *
 * @returns true si supprimé, false si le favori n'existait pas
 */
export const removeFavorite = async (
  userId: string,
  matchId: number
): Promise<boolean> => {
  const result = await db.execute({
    sql: `
      DELETE FROM favorites
      WHERE user_id = ? AND match_id = ?
    `,
    args: [userId, matchId],
  })

  return result.rowsAffected > 0
}