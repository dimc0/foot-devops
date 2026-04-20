import Link from "next/link"
import FavoriteList from "@/components/matches/FavoriteList.jsx"

export default function FavoritesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes favoris</h1>
          <p className="text-sm text-gray-600">
            Retrouvez ici les matchs que vous avez sauvegardes.
          </p>
        </div>

        <Link
          href="/matches"
          className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
        >
          Retour aux matchs
        </Link>
      </div>

      <FavoriteList />
    </main>
  )
}
