import Link from 'next/link'
import { BookMarked, Compass } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { WatchlistItem } from '@/components/watchlist/WatchlistItem'
import type { WatchlistEntry, WatchStatus } from '@/types/movie'

const SECTIONS: { status: WatchStatus; label: string; empty: string }[] = [
  { status: 'watching', label: 'Watching', empty: 'Nothing in progress.' },
  { status: 'want', label: 'Want to Watch', empty: 'Your queue is empty.' },
  { status: 'watched', label: 'Watched', empty: 'No movies marked as watched yet.' },
]

export default async function WatchlistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Sack</h1>
        <div className="rounded-xl border border-dashed border-border p-16 text-center space-y-4">
          <BookMarked className="w-12 h-12 text-muted-foreground mx-auto" />
          <div>
            <p className="text-lg font-semibold">Sign in to see your sack</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create an account to save movies and track what you&apos;ve watched.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/auth/login" className={buttonVariants()}>Sign in</Link>
            <Link href="/discover" className={buttonVariants({ variant: 'outline' })}>
              <Compass className="w-4 h-4 mr-2" />
              Browse movies
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { data: entries } = await supabase
    .from('watchlist')
    .select('*')
    .eq('user_id', user.id)
    .order('added_at', { ascending: false })

  const byStatus = (status: WatchStatus) =>
    (entries ?? []).filter((e) => e.status === status) as WatchlistEntry[]

  const total = entries?.length ?? 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Sack</h1>
        {total > 0 && (
          <span className="text-sm text-muted-foreground">{total} movie{total !== 1 ? 's' : ''}</span>
        )}
      </div>

      {total === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-16 text-center space-y-4">
          <BookMarked className="w-12 h-12 text-muted-foreground mx-auto" />
          <div>
            <p className="text-lg font-semibold">Your sack is empty</p>
            <p className="text-sm text-muted-foreground mt-1">Start adding movies from the Discover page.</p>
          </div>
          <Link href="/discover" className={buttonVariants()}>
            <Compass className="w-4 h-4 mr-2" />
            Discover movies
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {SECTIONS.map(({ status, label, empty }) => {
            const items = byStatus(status)
            return (
              <section key={status} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">{label}</h2>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                </div>
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground pl-1">{empty}</p>
                ) : (
                  <div className="space-y-2">
                    {items.map((entry) => (
                      <WatchlistItem key={entry.id} entry={entry} />
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
