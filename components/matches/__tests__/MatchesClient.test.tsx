import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import MatchesClient from "../MatchesClient"

// Mock MatchCard (on s’en fiche du rendu interne)
jest.mock("../MatchCard", () => (props: any) => (
  <div>
    <p>{props.match.id}</p>
    <button onClick={props.onButtonClick}>
      {props.buttonText}
    </button>
  </div>
))

describe("MatchesClient", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("affiche le loading initialement", () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as any

    render(<MatchesClient />)

    expect(screen.getByText("Chargement...")).toBeInTheDocument()
  })

  it("affiche les matchs et favoris", async () => {
    global.fetch = jest.fn()
      // matches
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 1,
              utcDate: "2024-01-01",
              status: "FINISHED",
              homeTeam: { name: "A", crest: "" },
              awayTeam: { name: "B", crest: "" },
              score: { fullTime: { home: 1, away: 0 } },
            },
          ]),
      })
      // favorites
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ match_id: 1 }]),
      })

    render(<MatchesClient />)

    await waitFor(() => {
      expect(screen.getByText("Supprimer des favoris")).toBeInTheDocument()
    })
  })

  it("ajoute un favori", async () => {
    const user = userEvent.setup()

    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 1,
              utcDate: "2024-01-01",
              status: "FINISHED",
              homeTeam: { name: "A", crest: "" },
              awayTeam: { name: "B", crest: "" },
              score: { fullTime: { home: 1, away: 0 } },
            },
          ]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })
      .mockResolvedValueOnce({
        ok: true,
      })

    render(<MatchesClient />)

    await waitFor(() =>
      screen.getByText("Ajouter aux favoris")
    )

    await user.click(
      screen.getByText("Ajouter aux favoris")
    )

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/favorites/1",
        expect.objectContaining({ method: "POST" })
      )
    )
  })

  it("supprime un favori", async () => {
    const user = userEvent.setup()

    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 1,
              utcDate: "2024-01-01",
              status: "FINISHED",
              homeTeam: { name: "A", crest: "" },
              awayTeam: { name: "B", crest: "" },
              score: { fullTime: { home: 1, away: 0 } },
            },
          ]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ match_id: 1 }]),
      })
      .mockResolvedValueOnce({
        ok: true,
      })

    render(<MatchesClient />)

    await waitFor(() =>
      screen.getByText("Supprimer des favoris")
    )

    await user.click(
      screen.getByText("Supprimer des favoris")
    )

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/favorites/1",
        expect.objectContaining({ method: "DELETE" })
      )
    )
  })

  it("affiche une erreur si API fail", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false })
    ) as any

    render(<MatchesClient />)

    await waitFor(() =>
      expect(
        screen.getByText("Erreur lors de la récupération des matches")
      ).toBeInTheDocument()
    )
  })
})