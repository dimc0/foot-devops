// lib/db/client.ts

/**
 * Client Turso (libSQL).
 *
 * En environnement de test (NODE_ENV === "test") :
 * utilise une base SQLite en mémoire — créée à chaque démarrage, toujours vide.
 *
 * En développement local (TURSO_DATABASE_URL absent) :
 * utilise un fichier SQLite local "file:local.db" à la racine du projet.
 *
 * En production (TURSO_DATABASE_URL défini) :
 * se connecte à la base Turso distante avec authentification par token.
 *
 * Ce module s'exécute exclusivement côté serveur.
 * Ne jamais l'importer dans un composant client ("use client").
 */

import { createClient } from "@libsql/client"

export const db = createClient(
  process.env.NODE_ENV === "test"
    ? {
        url: "file::memory:",
      }
    : process.env.TURSO_DATABASE_URL
    ? {
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }
    : {
        url: "file:local.db",
      }
)