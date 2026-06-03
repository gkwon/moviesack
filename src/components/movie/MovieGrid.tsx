import { MovieCard } from './MovieCard'
import { Skeleton } from '@/components/ui/skeleton'
import type { Movie } from '@/types/movie'

interface MovieGridProps {
  movies: Movie[]
  watchlistIds?: Set<number>
  onWatchlistToggle?: (movie: Movie) => void
}

export function MovieGrid({ movies, watchlistIds, onWatchlistToggle }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          inWatchlist={watchlistIds?.has(movie.id)}
          onWatchlistToggle={onWatchlistToggle}
        />
      ))}
    </div>
  )
}

export function MovieGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="aspect-[2/3] rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  )
}
