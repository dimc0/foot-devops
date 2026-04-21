import Image from "next/image"

type MatchCardProps = {
  match: any
  buttonText: string
  onButtonClick: () => void
}

export default function MatchCard({
  match,
  buttonText,
  onButtonClick,
}: MatchCardProps) {
  const time = new Date(match.utcDate).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const showScore =
    match.status === "FINISHED" || match.status === "IN_PLAY"

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col items-center gap-2 w-24">
          <Image
            src={match.homeTeam.crest}
            alt={match.homeTeam.name}
            width={48}
            height={48}
            className="object-contain"
          />
          <p className="text-xs font-semibold text-gray-900 text-center leading-tight">
            {match.homeTeam.name}
          </p>
        </div>

        <div className="flex flex-col items-center gap-1 flex-1">
          {showScore ? (
            <p className="text-xl font-bold text-gray-900">
              {match.score.fullTime.home} - {match.score.fullTime.away}
            </p>
          ) : (
            <p className="text-sm font-medium text-gray-500">{time}</p>
          )}
          <span className="text-xs text-gray-400">{match.status}</span>
        </div>

        <div className="flex flex-col items-center gap-2 w-24">
          <Image
            src={match.awayTeam.crest}
            alt={match.awayTeam.name}
            width={48}
            height={48}
            className="object-contain"
          />
          <p className="text-xs font-semibold text-gray-900 text-center leading-tight">
            {match.awayTeam.name}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onButtonClick}
        className="mt-4 w-full rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
      >
        {buttonText}
      </button>
    </div>
  )
}