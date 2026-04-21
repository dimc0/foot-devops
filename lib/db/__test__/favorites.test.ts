import {
  getFavoritesByUser,
  addFavorite,
  removeFavorite,
} from "../favorites"

import { db } from "../client"

// Mock du DB
jest.mock("../client", () => ({
  db: {
    execute: jest.fn(),
  },
}))

describe("favorites DB layer", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("getFavoritesByUser retourne les favoris", async () => {
    ;(db.execute as jest.Mock).mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          user_id: "u1",
          match_id: 10,
          added_at: "2024-01-01",
        },
      ],
    })

    const result = await getFavoritesByUser("u1")

    expect(result).toEqual([
      {
        id: 1,
        user_id: "u1",
        match_id: 10,
        added_at: "2024-01-01",
      },
    ])

    expect(db.execute).toHaveBeenCalled()
  })

  it("addFavorite retourne un favori créé", async () => {
    ;(db.execute as jest.Mock).mockResolvedValueOnce({
      rows: [
        {
          id: 2,
          user_id: "u1",
          match_id: 20,
          added_at: "2024-01-02",
        },
      ],
    })

    const result = await addFavorite("u1", 20)

    expect(result).toEqual({
      id: 2,
      user_id: "u1",
      match_id: 20,
      added_at: "2024-01-02",
    })
  })

  it("addFavorite retourne null si déjà existant", async () => {
    ;(db.execute as jest.Mock).mockResolvedValueOnce({
      rows: [],
    })

    const result = await addFavorite("u1", 20)

    expect(result).toBeNull()
  })

  it("removeFavorite retourne true si supprimé", async () => {
    ;(db.execute as jest.Mock).mockResolvedValueOnce({
      rowsAffected: 1,
    })

    const result = await removeFavorite("u1", 20)

    expect(result).toBe(true)
  })

  it("removeFavorite retourne false si rien supprimé", async () => {
    ;(db.execute as jest.Mock).mockResolvedValueOnce({
      rowsAffected: 0,
    })

    const result = await removeFavorite("u1", 20)

    expect(result).toBe(false)
  })
})