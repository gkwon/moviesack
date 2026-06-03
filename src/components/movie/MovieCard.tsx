'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, Plus, Check } from 'lucide-react'
import { getPosterUrl } from '@/lib/tmdb'
import type { Movie } from '@/types/movie'
import { cn } from '@/lib/utils'

interface MovieCardProps {
  movie: Movie
  inWatchlist?: boolean
  onWatchlistToggle?: (movie: Movie) => void
  className?: string
}

export function MovieCard({ movie, inWatchlist, onWatchlistToggle, className }: MovieCardProps) {
  const poster = getPosterUrl(movie.poster_path, 'w342')
  const year = movie.release_date?.slice(0, 4)
  const rating = movie.vote_average?.toFixed(1)

  return (
    <div className={cn('group relative flex flex-col rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5', className)}>
      <Link href={`/movie/${movie.id}`} className="block">
        <div className="relative aspect-[2/3] bg-muted overflow-hidden">
          {poster ? (
            <Image
              src={poster}
              alt={movie.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <span className="text-4xl">🎬</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {rating && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 text-yellow-400 text-xs font-semibold px-2 py-1 rounded-full">
              <Star className="w-3 h-3 fill-yellow-400" />
              {rating}
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-col gap-1 p-3 flex-1">
        <Link href={`/movie/${movie.id}`}>
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 hover:text-primary transition-colors">
            {movie.title}
          </h3>
        </Link>
        {year && <p className="text-xs text-muted-foreground">{year}</p>}
      </div>

      {onWatchlistToggle && (
        <div className="px-3 pb-3">
          <button
            onClick={() => onWatchlistToggle(movie)}
            className={cn(
              'w-full flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium transition-colors',
              inWatchlist
                ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                : 'bg-primary text-primary-foreground hover:bg-primary/80'
            )}
          >
            {inWatchlist ? (
              <><Check className="w-3.5 h-3.5" />In Sack</>
            ) : (
              <><Plus className="w-3.5 h-3.5" />Add to Sack</>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
