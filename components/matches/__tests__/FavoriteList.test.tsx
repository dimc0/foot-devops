import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import FavoriteList from "../FavoriteList"

type FavoriteMatch = {
  match_id: number
  utcDate: string
  status: string
  homeTeam: { name: string; crest: string }
  awayTeam: { name: string; crest: string }
  score: { fullTime: { home: number; away: number } }
}

type MockResponse = {
  ok: boolean
  status?: number
  json?: () => Promise<FavoriteMatch[]>
}

const mockFavorites: FavoriteMatch[] = [
  {
    match_id: 1,
    utcDate: "2024-01-15T20:00:00Z",
    status: "FINISHED",
    homeTeam: { name: "FC Barcelona", crest: "/barca.png" },
    awayTeam: { name: "Real Madrid", crest: "/real.png" },
    score: { fullTime: { home: 2, away: 1 } },
  },
]

describe("FavoriteList", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("affiche le message de chargement initialement", () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as typeof fetch

    render(<FavoriteList />)
    expect(screen.getByText("Chargement de vos favoris...")).toBeInTheDocument()
  })

  it("affiche le message vide quand la liste est vide", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) } as MockResponse)
    ) as unknown as typeof fetch

    render(<FavoriteList />)

    await waitFor(() =>
      expect(
        screen.getByText(/vous n'avez pas encore de favoris/i)
      ).toBeInTheDocument()
    )
  })

  it("affiche les équipes du match favori", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockFavorites),
      } as MockResponse)
    ) as unknown as typeof fetch

    render(<FavoriteList />)

    await waitFor(() =>
      expect(screen.getByText("FC Barcelona")).toBeInTheDocument()
    )
    expect(screen.getByText("Real Madrid")).toBeInTheDocument()
  })

  it("affiche un message d'erreur si le fetch échoue", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false } as MockResponse)
    ) as unknown as typeof fetch

    render(<FavoriteList />)

    await waitFor(() =>
      expect(
        screen.getByText("Erreur lors de la récupération des favoris")
      ).toBeInTheDocument()
    )
  })

  it("supprime le match de la liste au clic sur le bouton", async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockFavorites) })
      .mockResolvedValueOnce({ ok: true, status: 200 }) as unknown as typeof fetch

    const user = userEvent.setup()

    render(<FavoriteList />)

    await waitFor(() =>
      expect(screen.getByText("FC Barcelona")).toBeInTheDocument()
    )

    await user.click(
      screen.getByRole("button", { name: /supprimer des favoris/i })
    )

    await waitFor(() =>
      expect(screen.queryByText("FC Barcelona")).not.toBeInTheDocument()
    )
  })

  it("affiche une erreur si la suppression échoue", async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockFavorites) })
      .mockResolvedValueOnce({ ok: false, status: 500 }) as unknown as typeof fetch

    const user = userEvent.setup()

    render(<FavoriteList />)

    await waitFor(() =>
      expect(screen.getByText("FC Barcelona")).toBeInTheDocument()
    )

    await user.click(
      screen.getByRole("button", { name: /supprimer des favoris/i })
    )

    await waitFor(() =>
      expect(
        screen.getByText("Impossible de supprimer ce favori")
      ).toBeInTheDocument()
    )
  })
})
