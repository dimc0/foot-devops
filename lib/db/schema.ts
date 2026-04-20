import { db } from "./client"

export const initSchema = async (): Promise<void> => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id         TEXT PRIMARY KEY,
      username   TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS favorites (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      match_id INTEGER NOT NULL,
      added_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, match_id)
    )
  `)

  // Insertion de l'utilisateur de démonstration s'il n'existe pas encore
  await db.execute(`
    INSERT OR IGNORE INTO users (id, username)
    VALUES ('user-demo', 'Étudiant Demo')
  `)
}