'use client'

import { useTransition, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Loader2, Star } from 'lucide-react'
import { getPosterUrl } from '@/lib/tmdb'
import { removeFromWatchlist, updateStatus, updateRating } from '@/app/watchlist/actions'
import type { WatchlistEntry, WatchStatus } from '@/types/movie'
import { cn } from '@/lib/utils'

const STATUS_CYCLE: WatchStatus[] = ['want', 'watching', 'watched']
const STATUS_LABEL: Record<WatchStatus, string> = {
  want: 'Want to watch',
  watching: 'Watching',
  watched: 'Watched',
}
const STATUS_STYLE: Record<WatchStatus, string> = {
  want: 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary',
  watching: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20',
  watched: 'bg-green-500/10 text-green-400 hover:bg-green-500/20',
}

function StarRating({ entryId, rating }: { entryId: string; rating: number | null }) {
  const [hovered, setHovered] = useState(0)
  const [, startTransition] = useTransition()
  const filled = hovered || Math.round((rating ?? 0) / 2)

  function handleRate(stars: number) {
    startTransition(async () => { await updateRating(entryId, stars * 2) })
  }

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRate(star)}
          onMouseEnter={() => setHovered(star)}
          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={cn(
              'w-3.5 h-3.5 transition-colors',
              star <= filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
            )}
          />
        </button>
      ))}
    </div>
  )
}

interface WatchlistItemProps {
  entry: WatchlistEntry
}

export function WatchlistItem({ entry }: WatchlistItemProps) {
  const [isPending, startTransition] = useTransition()
  const poster = entry.movie_poster ? getPosterUrl(entry.movie_poster, 'w185') : null

  function cycleStatus() {
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(entry.status) + 1) % STATUS_CYCLE.length]
    startTransition(async () => { await updateStatus(entry.id, next) })
  }

  function handleRemove() {
    startTransition(async () => { await removeFromWatchlist(entry.movie_id) })
  }

  return (
    <div className={cn('flex items-center gap-4 p-3 rounded-xl border border-border bg-card hover:bg-card/80 transition-opacity', isPending && 'opacity-50')}>
      <Link href={`/movie/${entry.movie_id}`} className="shrink-0">
        <div className="relative w-12 aspect-[2/3] rounded-lg overflow-hidden bg-muted">
          {poster ? (
            <Image src={poster} alt={entry.movie_title} fill className="object-cover" sizes="48px" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-lg">🎬</div>
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0 space-y-1">
        <Link href={`/movie/${entry.movie_id}`} className="hover:text-primary transition-colors">
          <p className="font-medium text-sm truncate">{entry.movie_title}</p>
        </Link>
        <div className="flex items-center gap-2">
          {entry.movie_year && (
            <p className="text-xs text-muted-foreground">{entry.movie_year}</p>
          )}
          {entry.status === 'watched' && (
            <StarRating entryId={entry.id} rating={entry.rating} />
          )}
        </div>
      </div>

      <button
        onClick={cycleStatus}
        disabled={isPending}
        className={cn('shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors', STATUS_STYLE[entry.status])}
      >
        {STATUS_LABEL[entry.status]}
      </button>

      <button
        onClick={handleRemove}
        disabled={isPending}
        className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        aria-label="Remove from sack"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>
    </div>
  )
}
