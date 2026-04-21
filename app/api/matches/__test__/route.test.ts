// app/api/matches/__tests__/route.test.ts
/**
 * @jest-environment node
 */
import { GET } from "../route"

jest.mock("@/lib/tsdb/client", () => ({
  getTodayMatches: jest.fn(),
}))

import { getTodayMatches } from "@/lib/tsdb/client"

const mockGetTodayMatches = getTodayMatches as jest.Mock

afterEach(() => {
  jest.resetAllMocks()
})

describe("GET /api/matches", () => {
  it("retourne 200 avec la liste des matchs du jour", async () => {
    const mockMatches = [
      {
        match_id: 1,
        utcDate: "2024-01-15T20:00:00Z",
        status: "TIMED",
        homeTeam: { name: "FC Barcelona", crest: "/barca.png" },
        awayTeam: { name: "Real Madrid", crest: "/real.png" },
        score: { fullTime: { home: null, away: null } },
      },
    ]

    mockGetTodayMatches.mockResolvedValueOnce(mockMatches)

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toHaveLength(1)
    expect(body[0].homeTeam.name).toBe("FC Barcelona")
  })

  it("retourne 500 si le client Football-Data lève une erreur", async () => {
    mockGetTodayMatches.mockRejectedValueOnce(new Error("Football-Data unavailable"))
    jest.spyOn(console, "error").mockImplementation(() => {})

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBe("Failed to fetch matches")
  })
})