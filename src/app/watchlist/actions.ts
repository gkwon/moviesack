'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { WatchStatus } from '@/types/movie'

export async function addToWatchlist(movie: {
  id: number
  title: string
  poster_path: string | null
  release_date: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not signed in' }

  const { error } = await supabase.from('watchlist').upsert({
    user_id: user.id,
    movie_id: movie.id,
    movie_title: movie.title,
    movie_poster: movie.poster_path,
    movie_year: movie.release_date?.slice(0, 4) ?? '',
    status: 'want',
  }, { onConflict: 'user_id,movie_id' })

  if (error) return { error: error.message }

  revalidatePath('/watchlist')
  revalidatePath(`/movie/${movie.id}`)
  return { error: null }
}

export async function removeFromWatchlist(movieId: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not signed in' }

  const { error } = await supabase
    .from('watchlist')
    .delete()
    .eq('user_id', user.id)
    .eq('movie_id', movieId)

  if (error) return { error: error.message }

  revalidatePath('/watchlist')
  revalidatePath(`/movie/${movieId}`)
  return { error: null }
}

export async function updateRating(entryId: string, rating: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not signed in' }

  const { error } = await supabase
    .from('watchlist')
    .update({ rating })
    .eq('id', entryId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/watchlist')
  return { error: null }
}

export async function updateStatus(entryId: string, status: WatchStatus) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not signed in' }

  const { error } = await supabase
    .from('watchlist')
    .update({
      status,
      watched_at: status === 'watched' ? new Date().toISOString() : null,
    })
    .eq('id', entryId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/watchlist')
  return { error: null }
}
