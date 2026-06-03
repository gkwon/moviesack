# Moviesack

Movie watchlist and discovery app. Discover films, track what you want to watch, and never forget a great movie again.

## Stack

- **Next.js 16** (App Router, Turbopack) — uses `proxy.ts` instead of `middleware.ts`
- **shadcn/ui** with `@base-ui/react` — no `asChild` prop; use `buttonVariants` + `<Link>` for button-links
- **Tailwind CSS v4** — dark theme default
- **TMDB API** — movie data, images, search
- **Supabase** — auth (email/password) + watchlist storage (PostgreSQL + RLS)

## Setup

1. Copy env vars:

```
TMDB_API_KEY=your_key               # themoviedb.org → Settings → API
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

2. Run `supabase/schema.sql` in the Supabase SQL editor to create the `watchlist` table.

3. In Supabase → Authentication → URL Configuration, set:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

4. Start the dev server:

```bash
npm run dev
```

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero + trending movies |
| `/discover` | Browse by Popular / Now Playing / Top Rated / Upcoming + genre filters |
| `/search` | Full-text movie search |
| `/movie/[id]` | Movie detail — backdrop, genres, runtime, Add to Sack |
| `/watchlist` | Personal sack — grouped by Watching / Want to Watch / Watched |
| `/auth/login` | Sign in |
| `/auth/signup` | Create account |
| `/auth/callback` | Email confirmation handler |

## Key files

```
src/
  app/
    auth/actions.ts              # login, signup, signout server actions
    auth/callback/route.ts       # email confirmation handler
    watchlist/actions.ts         # addToWatchlist, removeFromWatchlist, updateStatus
  components/
    movie/AddToSackButton.tsx    # optimistic add/remove on movie detail page
    movie/MovieGridInteractive.tsx  # client grid with optimistic watchlist toggling
    movie/MovieCard.tsx          # single movie card (poster, rating, In Sack button)
    movie/MovieGrid.tsx          # responsive grid layout + skeleton
    watchlist/WatchlistItem.tsx  # status cycle + remove on watchlist page
    ui/Pagination.tsx            # prev/next URL-param pagination
  lib/
    tmdb.ts                      # TMDB API helpers (trending, popular, search, genres, recommendations)
    supabase/client.ts           # browser Supabase client
    supabase/server.ts           # server Supabase client
  proxy.ts                       # session refresh (replaces middleware.ts in Next 16)
supabase/schema.sql              # watchlist table + RLS policies
PLAN.html                        # build plan and progress tracker
```

## Deploy to Vercel

1. Push the repo to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Add environment variables in the Vercel dashboard:
   - `TMDB_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. After first deploy, copy the production URL (e.g. `https://moviesack.vercel.app`).
5. In Supabase → Authentication → URL Configuration:
   - Add the production URL to **Redirect URLs**: `https://moviesack.com/auth/callback`
6. In Vercel → Project Settings → Domains, add `moviesack.com` and follow the DNS instructions.
7. Update `metadataBase` in `src/app/layout.tsx` if the domain changes.

## Build plan

Open `PLAN.html` in a browser for the full phased plan with progress tracking.
