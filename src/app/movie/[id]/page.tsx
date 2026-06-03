import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Star, Clock, Calendar, Sparkles } from 'lucide-react'
import { getMovieDetail, getMovieRecommendations, getBackdropUrl, getPosterUrl } from '@/lib/tmdb'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { AddToSackButton } from '@/components/movie/AddToSackButton'
import { MovieGridInteractive } from '@/components/movie/MovieGridInteractive'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const movieId = Number(id)
  if (isNaN(movieId)) return {}

  try {
    const movie = await getMovieDetail(movieId)
    const poster = getPosterUrl(movie.poster_path, 'w500')
    const year = movie.release_date?.slice(0, 4)
    return {
      title: year ? `${movie.title} (${year})` : movie.title,
      description: movie.overview || `Discover ${movie.title} on Moviesack.`,
      openGraph: {
        title: movie.title,
        description: movie.overview || '',
        images: poster ? [{ url: poster, width: 500, height: 750 }] : [],
      },
      twitter: {
        card: 'summary',
        title: movie.title,
        description: movie.overview || '',
        images: poster ? [poster] : [],
      },
    }
  } catch {
    return {}
  }
}

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const movieId = Number(id)
  if (isNaN(movieId)) notFound()

  let movie
  try {
    movie = await getMovieDetail(movieId)
  } catch {
    notFound()
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [watchlistEntry, recommendationsData] = await Promise.all([
    user
      ? supabase.from('watchlist').select('id').eq('user_id', user.id).eq('movie_id', movieId).maybeSingle()
      : Promise.resolve({ data: null }),
    getMovieRecommendations(movieId).catch(() => ({ results: [] })),
  ])

  let watchlistIds: number[] = []
  if (user && recommendationsData.results.length > 0) {
    const { data } = await supabase
      .from('watchlist')
      .select('movie_id')
      .eq('user_id', user.id)
      .in('movie_id', recommendationsData.results.map((m) => m.id))
    watchlistIds = (data ?? []).map((r) => r.movie_id as number)
  }

  const inSack = !!watchlistEntry.data
  const recommendations = recommendationsData.results.slice(0, 12)
  const backdrop = getBackdropUrl(movie.backdrop_path, 'w1280')
  const poster = getPosterUrl(movie.poster_path, 'w500')
  const year = movie.release_date?.slice(0, 4)

  return (
    <div className="space-y-12">
      <div className="space-y-8">
        {backdrop && (
          <div className="relative h-64 md:h-96 -mx-4 overflow-hidden rounded-xl">
            <Image src={backdrop} alt={movie.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 -mt-24 relative">
          <div className="shrink-0 w-40 md:w-56 mx-auto md:mx-0">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-border shadow-xl">
              {poster ? (
                <Image src={poster} alt={movie.title} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-muted text-4xl">🎬</div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 flex-1 pt-4 md:pt-24">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-muted-foreground italic mt-1">{movie.tagline}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {movie.vote_average > 0 && (
                <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  {movie.vote_average.toFixed(1)}
                </span>
              )}
              {year && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {year}
                </span>
              )}
              {movie.runtime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <Badge key={g.id} variant="secondary">{g.name}</Badge>
              ))}
            </div>

            {movie.overview && (
              <p className="text-muted-foreground leading-relaxed max-w-2xl">{movie.overview}</p>
            )}

            <AddToSackButton
              movie={{
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
              }}
              initialInSack={inSack}
              isLoggedIn={!!user}
            />
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">More like this</h2>
          </div>
          <MovieGridInteractive
            movies={recommendations}
            watchlistIds={watchlistIds}
            isLoggedIn={!!user}
          />
        </section>
      )}
    </div>
  )
}
