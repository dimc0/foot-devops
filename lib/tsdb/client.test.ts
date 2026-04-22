import { getMatchById, getTodayMatches } from "./client"

describe("tsdb client", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("getTodayMatches retourne la liste des matches", async () => {
    const matches = [
      {
        id: 1,
        utcDate: "2024-01-01T20:00:00Z",
        status: "FINISHED",
        homeTeam: {
          id: 10,
          name: "Paris",
          crest: "/paris.png",
        },
        awayTeam: {
          id: 20,
          name: "Lyon",
          crest: "/lyon.png",
        },
        score: {
          fullTime: {
            home: 2,
            away: 1,
          },
        },
      },
    ]

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ matches }),
      })
    ) as unknown as typeof fetch

    const result = await getTodayMatches()

    expect(result).toEqual(matches)
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.football-data.org/v4/matches",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
        next: { revalidate: 60 },
      })
    )
  })

  it("getMatchById retourne un match", async () => {
    const match = {
      id: 1,
      utcDate: "2024-01-01T20:00:00Z",
      status: "FINISHED" as const,
      homeTeam: {
        id: 10,
        name: "Paris",
        crest: "/paris.png",
      },
      awayTeam: {
        id: 20,
        name: "Lyon",
        crest: "/lyon.png",
      },
      score: {
        fullTime: {
          home: 2,
          away: 1,
        },
      },
    }

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(match),
      })
    ) as unknown as typeof fetch

    const result = await getMatchById(1)

    expect(result).toEqual(match)
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.football-data.org/v4/matches/1",
      expect.objectContaining({
        next: { revalidate: 3600 },
      })
    )
  })

  it("lance une erreur si l'API répond avec une erreur", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    ) as unknown as typeof fetch

    await expect(getTodayMatches()).rejects.toThrow(
      "Football-Data error: 500 on /matches"
    )
  })
})
