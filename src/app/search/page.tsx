import { searchMovies } from '@/lib/tmdb'
import { MovieGridInteractive } from '@/components/movie/MovieGridInteractive'
import { Pagination } from '@/components/ui/Pagination'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Movie } from '@/types/movie'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const params = await searchParams
  const query = params.q?.trim() || ''
  const page = Math.max(1, Number(params.page) || 1)

  let movies: Movie[] = []
  let totalPages = 1
  let totalResults = 0
  let error = false

  if (query) {
    try {
      const data = await searchMovies(query, page)
      movies = data.results
      totalPages = Math.min(data.total_pages, 500)
      totalResults = data.total_results
    } catch {
      error = true
    }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let watchlistIds: number[] = []
  if (user) {
    const { data } = await supabase
      .from('watchlist')
      .select('movie_id')
      .eq('user_id', user.id)
    watchlistIds = (data ?? []).map((r) => r.movie_id as number)
  }

  function buildHref(p: number) {
    const sp = new URLSearchParams({ q: query })
    if (p > 1) sp.set('page', String(p))
    return `/search?${sp}`
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Search</h1>

      <form method="get" action="/search">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={query}
            placeholder="Search for a movie..."
            className="pl-10 h-12 text-base"
            autoFocus
          />
        </div>
      </form>

      {query ? (
        error ? (
          <p className="text-muted-foreground">Configure your TMDB API key to search movies.</p>
        ) : movies.length === 0 ? (
          <p className="text-muted-foreground">No results for &quot;{query}&quot;</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {totalResults.toLocaleString()} results for &quot;{query}&quot;
            </p>
            <MovieGridInteractive
              movies={movies}
              watchlistIds={watchlistIds}
              isLoggedIn={!!user}
            />
            <Pagination page={page} totalPages={totalPages} buildHref={buildHref} />
          </>
        )
      ) : (
        <p className="text-muted-foreground">Start typing to search for movies.</p>
      )}
    </div>
  )
}
