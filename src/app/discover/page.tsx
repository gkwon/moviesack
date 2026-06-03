import { Suspense } from 'react'
import Link from 'next/link'
import { getPopular, getNowPlaying, getTopRated, getUpcoming, getMoviesByGenre, getGenres } from '@/lib/tmdb'
import { MovieGridSkeleton } from '@/components/movie/MovieGrid'
import { MovieGridInteractive } from '@/components/movie/MovieGridInteractive'
import { Pagination } from '@/components/ui/Pagination'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import type { Movie } from '@/types/movie'

const TABS = [
  { key: 'popular', label: 'Popular' },
  { key: 'now_playing', label: 'Now Playing' },
  { key: 'top_rated', label: 'Top Rated' },
  { key: 'upcoming', label: 'Upcoming' },
] as const

type Tab = (typeof TABS)[number]['key']

const TAB_FETCHERS = {
  popular: getPopular,
  now_playing: getNowPlaying,
  top_rated: getTopRated,
  upcoming: getUpcoming,
}

async function fetchMovies(params: { tab: Tab; genre?: string; page: number }) {
  if (params.genre) {
    return getMoviesByGenre(Number(params.genre), params.page)
  }
  return TAB_FETCHERS[params.tab](params.page)
}

async function getWatchlistIds(userId: string | undefined) {
  if (!userId) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from('watchlist')
    .select('movie_id')
    .eq('user_id', userId)
  return (data ?? []).map((r) => r.movie_id as number)
}

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; genre?: string; page?: string }>
}) {
  const params = await searchParams
  const activeTab = (params.tab as Tab) || 'popular'
  const page = Math.max(1, Number(params.page) || 1)

  const [genreData, supabase] = await Promise.all([
    getGenres().catch(() => ({ genres: [] })),
    createClient(),
  ])
  const { data: { user } } = await supabase.auth.getUser()

  let movies: Movie[] = []
  let totalPages = 1
  let fetchError = false

  try {
    const data = await fetchMovies({ tab: activeTab, genre: params.genre, page })
    movies = data.results
    totalPages = Math.min(data.total_pages, 500) // TMDB caps at 500
  } catch {
    fetchError = true
  }

  const watchlistIds = await getWatchlistIds(user?.id)

  function buildHref(p: number) {
    const sp = new URLSearchParams()
    if (params.genre) sp.set('genre', params.genre)
    else sp.set('tab', activeTab)
    if (p > 1) sp.set('page', String(p))
    return `/discover?${sp}`
  }

  const activeGenreName = params.genre
    ? genreData.genres.find((g) => String(g.id) === params.genre)?.name
    : null

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Discover</h1>

      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(({ key, label }) => (
          <Link key={key} href={`/discover?tab=${key}`}>
            <Badge
              variant={!params.genre && activeTab === key ? 'default' : 'outline'}
              className="px-4 py-1.5 text-sm cursor-pointer"
            >
              {label}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Genre pills */}
      {genreData.genres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {genreData.genres.map((g) => (
            <Link key={g.id} href={`/discover?genre=${g.id}`}>
              <Badge
                variant={params.genre === String(g.id) ? 'secondary' : 'outline'}
                className="cursor-pointer text-xs"
              >
                {g.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {activeGenreName && (
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{activeGenreName}</span>
          <Link href="/discover" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ✕ clear
          </Link>
        </div>
      )}

      {fetchError ? (
        <div className="text-center py-12 text-muted-foreground">
          Configure your TMDB API key to see movies.
        </div>
      ) : (
        <>
          <MovieGridInteractive
            movies={movies}
            watchlistIds={watchlistIds}
            isLoggedIn={!!user}
          />
          <Pagination page={page} totalPages={totalPages} buildHref={buildHref} />
        </>
      )}
    </div>
  )
}
