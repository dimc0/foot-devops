import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import MatchCard from "../MatchCard"

type MockMatch = {
  id: number
  utcDate: string
  status: string
  homeTeam: { name: string; crest: string }
  awayTeam: { name: string; crest: string }
  score: {
    fullTime: {
      home: number
      away: number
    }
  }
}

const mockMatch: MockMatch = {
  id: 1,
  utcDate: "2024-01-15T20:00:00Z",
  status: "TIMED",
  homeTeam: {
    name: "FC Barcelona",
    crest: "/barca.png",
  },
  awayTeam: {
    name: "Real Madrid",
    crest: "/real.png",
  },
  score: {
    fullTime: { home: 0, away: 0 },
  },
}

describe("MatchCard", () => {
  it("affiche les noms des deux équipes", () => {
    render(
      <MatchCard
        match={mockMatch}
        buttonText="Ajouter aux favoris"
        onButtonClick={jest.fn()}
      />
    )
    expect(screen.getByText("FC Barcelona")).toBeInTheDocument()
    expect(screen.getByText("Real Madrid")).toBeInTheDocument()
  })

  it("affiche l'heure et le statut si le match n'a pas commencé", () => {
    render(
      <MatchCard
        match={mockMatch}
        buttonText="Ajouter aux favoris"
        onButtonClick={jest.fn()}
      />
    )
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument()
    expect(screen.getByText("TIMED")).toBeInTheDocument()
  })

  it("affiche le score si le statut est FINISHED", () => {
    const matchFinished: MockMatch = {
      ...mockMatch,
      status: "FINISHED",
      score: { fullTime: { home: 2, away: 1 } },
    }

    render(
      <MatchCard
        match={matchFinished}
        buttonText="Ajouter aux favoris"
        onButtonClick={jest.fn()}
      />
    )

    expect(screen.getByText("2 - 1")).toBeInTheDocument()
  })

  it("affiche le score si le statut est IN_PLAY", () => {
    const matchInPlay: MockMatch = {
      ...mockMatch,
      status: "IN_PLAY",
      score: { fullTime: { home: 0, away: 0 } },
    }

    render(
      <MatchCard
        match={matchInPlay}
        buttonText="Ajouter aux favoris"
        onButtonClick={jest.fn()}
      />
    )

    expect(screen.getByText("0 - 0")).toBeInTheDocument()
  })

  it("affiche le texte du bouton", () => {
    render(
      <MatchCard
        match={mockMatch}
        buttonText="Supprimer des favoris"
        onButtonClick={jest.fn()}
      />
    )

    expect(
      screen.getByRole("button", { name: /supprimer des favoris/i })
    ).toBeInTheDocument()
  })

  it("appelle onButtonClick au clic", async () => {
    const onButtonClick = jest.fn()
    const user = userEvent.setup()

    render(
      <MatchCard
        match={mockMatch}
        buttonText="Ajouter aux favoris"
        onButtonClick={onButtonClick}
      />
    )

    await user.click(
      screen.getByRole("button", { name: /ajouter aux favoris/i })
    )

    expect(onButtonClick).toHaveBeenCalledTimes(1)
  })
})
