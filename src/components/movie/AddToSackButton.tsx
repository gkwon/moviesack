'use client'

import { useTransition, useState } from 'react'
import { Plus, Check, Trash2, Loader2 } from 'lucide-react'
import { addToWatchlist, removeFromWatchlist } from '@/app/watchlist/actions'
import { cn } from '@/lib/utils'
import type { Movie } from '@/types/movie'

interface AddToSackButtonProps {
  movie: Pick<Movie, 'id' | 'title' | 'poster_path' | 'release_date'>
  initialInSack: boolean
  isLoggedIn: boolean
}

export function AddToSackButton({ movie, initialInSack, isLoggedIn }: AddToSackButtonProps) {
  const [inSack, setInSack] = useState(initialInSack)
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    if (!isLoggedIn) {
      window.location.href = '/auth/login'
      return
    }

    const wasInSack = inSack
    setInSack(!wasInSack) // optimistic

    startTransition(async () => {
      const result = wasInSack
        ? await removeFromWatchlist(movie.id)
        : await addToWatchlist(movie)

      if (result.error) setInSack(wasInSack) // revert on error
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        'inline-flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-medium transition-colors disabled:opacity-70',
        inSack
          ? 'bg-secondary text-secondary-foreground hover:bg-destructive/10 hover:text-destructive'
          : 'bg-primary text-primary-foreground hover:bg-primary/80'
      )}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : inSack ? (
        <>
          <Check className="w-4 h-4" />
          <span className="group-hover:hidden">In Sack</span>
        </>
      ) : (
        <>
          <Plus className="w-4 h-4" />
          Add to Sack
        </>
      )}
      {inSack && !isPending && (
        <Trash2 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -ml-1" />
      )}
    </button>
  )
}
