import Link from "next/link"
import MatchesClient from "@/components/matches/MatchesClient.jsx"

export default function MatchesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Matches du jour</h1>
        <Link
          href="/favorites"
          className="inline-flex items-center justify-center rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
        >
          Voir mes favoris
        </Link>
      </div>
      <MatchesClient />
    </main>
  )
}
