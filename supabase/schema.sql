-- Enable RLS
create table public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  movie_id integer not null,
  movie_title text not null,
  movie_poster text,
  movie_year text,
  status text not null check (status in ('want', 'watching', 'watched')) default 'want',
  rating smallint check (rating >= 1 and rating <= 10),
  notes text,
  added_at timestamptz not null default now(),
  watched_at timestamptz,
  unique (user_id, movie_id)
);

alter table public.watchlist enable row level security;

create policy "Users can view their own watchlist"
  on public.watchlist for select
  using (auth.uid() = user_id);

create policy "Users can insert into their own watchlist"
  on public.watchlist for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own watchlist entries"
  on public.watchlist for update
  using (auth.uid() = user_id);

create policy "Users can delete their own watchlist entries"
  on public.watchlist for delete
  using (auth.uid() = user_id);
