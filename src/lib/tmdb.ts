import type { Movie, MovieDetail, Genre, TMDBResponse } from '@/types/movie'

const BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'
const API_KEY = process.env.TMDB_API_KEY

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set('api_key', API_KEY || '')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`)
  return res.json()
}

export function getPosterUrl(path: string | null, size: 'w185' | 'w342' | 'w500' | 'original' = 'w342') {
  if (!path) return null
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export function getBackdropUrl(path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280') {
  if (!path) return null
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export async function getTrending(timeWindow: 'day' | 'week' = 'week') {
  return tmdbFetch<TMDBResponse<Movie>>(`/trending/movie/${timeWindow}`)
}

export async function getPopular(page = 1) {
  return tmdbFetch<TMDBResponse<Movie>>('/movie/popular', { page: String(page) })
}

export async function getNowPlaying(page = 1) {
  return tmdbFetch<TMDBResponse<Movie>>('/movie/now_playing', { page: String(page) })
}

export async function getTopRated(page = 1) {
  return tmdbFetch<TMDBResponse<Movie>>('/movie/top_rated', { page: String(page) })
}

export async function getUpcoming(page = 1) {
  return tmdbFetch<TMDBResponse<Movie>>('/movie/upcoming', { page: String(page) })
}

export async function getMovieDetail(id: number) {
  return tmdbFetch<MovieDetail>(`/movie/${id}`)
}

export async function searchMovies(query: string, page = 1) {
  return tmdbFetch<TMDBResponse<Movie>>('/search/movie', { query, page: String(page) })
}

export async function getMoviesByGenre(genreId: number, page = 1) {
  return tmdbFetch<TMDBResponse<Movie>>('/discover/movie', {
    with_genres: String(genreId),
    sort_by: 'popularity.desc',
    page: String(page),
  })
}

export async function getGenres(): Promise<{ genres: Genre[] }> {
  return tmdbFetch('/genre/movie/list')
}

export async function getMovieRecommendations(id: number, page = 1) {
  return tmdbFetch<TMDBResponse<Movie>>(`/movie/${id}/recommendations`, { page: String(page) })
}
