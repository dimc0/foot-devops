// app/api/favorites/__tests__/route.test.ts
/**
 * @jest-environment node
 */
import { GET } from "../route"

jest.mock("@/lib/db/favorites", () => ({
  getFavoritesByUser: jest.fn(),
}))

jest.mock("@/lib/tsdb/client", () => ({
  getMatchById: jest.fn(),
}))

import { getFavoritesByUser } from "@/lib/db/favorites"
import { getMatchById } from "@/lib/tsdb/client"

const mockGetFavoritesByUser = getFavoritesByUser as jest.Mock
const mockGetMatchById = getMatchById as jest.Mock

afterEach(() => jest.resetAllMocks())

describe("GET /api/favorites", () => {
  it("retourne 200 avec les favoris réhydratés", async () => {
    mockGetFavoritesByUser.mockResolvedValueOnce([
      {
        id: 1,
        user_id: "user-demo",
        match_id: 1,
        added_at: "2024-01-01T00:00:00Z",
      },
    ])

    mockGetMatchById.mockResolvedValueOnce({
      match_id: 1,
      utcDate: "2024-01-15T20:00:00Z",
      status: "FINISHED",
      homeTeam: { name: "FC Barcelona", crest: "/barca.png" },
      awayTeam: { name: "Real Madrid", crest: "/real.png" },
      score: { fullTime: { home: 2, away: 1 } },
    })

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body[0].homeTeam.name).toBe("FC Barcelona")
    expect(body[0].match_id).toBe(1)
    expect(body[0].score.fullTime.home).toBe(2)
  })

  it("retourne 500 si la couche DB lève une erreur", async () => {
    mockGetFavoritesByUser.mockRejectedValueOnce(new Error("DB error"))
    jest.spyOn(console, "error").mockImplementation(() => {})

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBe("Failed to fetch favorites")
  })
})