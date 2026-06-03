export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  popularity: number
}

export interface MovieDetail extends Movie {
  genres: { id: number; name: string }[]
  runtime: number | null
  tagline: string
  status: string
  budget: number
  revenue: number
}

export interface Genre {
  id: number
  name: string
}

export interface TMDBResponse<T> {
  results: T[]
  page: number
  total_pages: number
  total_results: number
}

export type WatchStatus = 'want' | 'watching' | 'watched'

export interface WatchlistEntry {
  id: string
  user_id: string
  movie_id: number
  movie_title: string
  movie_poster: string | null
  movie_year: string
  status: WatchStatus
  rating: number | null
  notes: string | null
  added_at: string
  watched_at: string | null
}
