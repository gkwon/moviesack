import Link from 'next/link'
import { Compass, BookMarked, Star } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { getTrending } from '@/lib/tmdb'
import { MovieGrid } from '@/components/movie/MovieGrid'

export default async function HomePage() {
  let trending: Awaited<ReturnType<typeof getTrending>>['results'] = []
  try {
    const data = await getTrending('week')
    trending = data.results.slice(0, 12)
  } catch {
    // TMDB not configured yet
  }

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Your movie{' '}
          <span className="text-primary">sack</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          Discover films, track what you want to watch, and never forget a great movie again.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/discover" className={buttonVariants({ size: 'lg' })}>
            <Compass className="w-5 h-5 mr-2" />
            Start Discovering
          </Link>
          <Link href="/watchlist" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
            <BookMarked className="w-5 h-5 mr-2" />
            My Sack
          </Link>
        </div>
      </section>

      {/* Trending */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold">Trending This Week</h2>
        </div>
        {trending.length > 0 ? (
          <MovieGrid movies={trending} />
        ) : (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
            <p className="text-lg font-medium">Add your TMDB API key to see movies</p>
            <p className="text-sm mt-1">
              Update <code className="text-xs bg-muted px-1 py-0.5 rounded">.env.local</code> with your key
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
