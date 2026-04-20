export interface Match {
  id: number
  utcDate: string
  status: "SCHEDULED" | "LIVE" | "IN_PLAY" | "PAUSED" | "FINISHED" | "CANCELLED"
  homeTeam: {
    id: number
    name: string
    crest: string
  }
  awayTeam: {
    id: number
    name: string
    crest: string
  }
  score: {
    fullTime: {
      home: number | null
      away: number | null
    }
  }
}

export interface MatchesResponse {
  matches: Match[]
  resultSet: {
    count: number
    first: string
    last: string
    played: number
  }
}