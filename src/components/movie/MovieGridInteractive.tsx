'use client'

import { useState, useTransition } from 'react'
import { MovieGrid } from './MovieGrid'
import { addToWatchlist, removeFromWatchlist } from '@/app/watchlist/actions'
import type { Movie } from '@/types/movie'

interface Props {
  movies: Movie[]
  watchlistIds: number[]
  isLoggedIn: boolean
}

export function MovieGridInteractive({ movies, watchlistIds: initialIds, isLoggedIn }: Props) {
  const [watchlistIds, setWatchlistIds] = useState(() => new Set(initialIds))
  const [, startTransition] = useTransition()

  function handleToggle(movie: Movie) {
    if (!isLoggedIn) {
      window.location.href = '/auth/login'
      return
    }

    const inSack = watchlistIds.has(movie.id)
    setWatchlistIds((prev) => {
      const next = new Set(prev)
      inSack ? next.delete(movie.id) : next.add(movie.id)
      return next
    })

    startTransition(async () => {
      const result = inSack
        ? await removeFromWatchlist(movie.id)
        : await addToWatchlist(movie)

      if (result.error) {
        setWatchlistIds((prev) => {
          const next = new Set(prev)
          inSack ? next.add(movie.id) : next.delete(movie.id)
          return next
        })
      }
    })
  }

  return (
    <MovieGrid
      movies={movies}
      watchlistIds={watchlistIds}
      onWatchlistToggle={handleToggle}
    />
  )
}
