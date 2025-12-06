-- Trove Complete Database Schema
-- This combines all necessary tables and updates
-- Run this on a fresh database, or use the individual migration files

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  username text unique,
  avatar_url text,
  daily_goal_minutes integer default 30,
  current_streak integer default 0,
  highest_streak integer default 0,
  last_read_date date,
  total_xp integer default 0,
  current_level integer default 1,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- BOOKS TABLE
-- ============================================
create table public.books (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  author text,
  file_url text not null,
  cover_url text,
  format text check (format in ('pdf', 'epub', 'txt')),
  total_pages integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- READING PROGRESS TABLE
-- ============================================
create table public.reading_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  book_id uuid references public.books on delete cascade not null,
  current_page integer default 0,
  total_pages integer default 0,
  progress_percentage float default 0,
  epub_cfi text,
  last_read_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, book_id)
);

-- ============================================
-- READING SESSIONS TABLE
-- ============================================
create table public.reading_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  book_id uuid references public.books on delete cascade not null,
  duration_minutes integer not null,
  session_date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- NOTES TABLE
-- ============================================
create table public.notes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  book_id uuid references public.books on delete cascade not null,
  content text not null,
  highlight_text text,
  page_number integer,
  color text default 'yellow',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- GAMIFICATION TABLES
-- ============================================

-- Levels table
create table public.levels (
  id uuid default uuid_generate_v4() primary key,
  level integer unique not null,
  title text not null,
  min_xp integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Achievements table
create table public.achievements (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  icon text,
  xp_reward integer default 0,
  condition_type text,
  condition_value integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User achievements table
create table public.user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  achievement_id uuid references public.achievements on delete cascade not null,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  notified boolean default false,
  unique(user_id, achievement_id)
);

-- XP history table
create table public.xp_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount integer not null,
  reason text,
  book_id uuid references public.books on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.reading_progress enable row level security;
alter table public.reading_sessions enable row level security;
alter table public.notes enable row level security;
alter table public.levels enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.xp_history enable row level security;

-- ============================================
-- PROFILES POLICIES
-- ============================================
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- ============================================
-- BOOKS POLICIES
-- ============================================
create policy "Users can view their own books"
  on books for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own books"
  on books for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own books"
  on books for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own books"
  on books for delete
  using ( auth.uid() = user_id );

-- ============================================
-- READING PROGRESS POLICIES
-- ============================================
create policy "Users can view their own progress"
  on reading_progress for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own progress"
  on reading_progress for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own progress"
  on reading_progress for update
  using ( auth.uid() = user_id );

-- ============================================
-- READING SESSIONS POLICIES
-- ============================================
create policy "Users can manage their own reading sessions"
  on reading_sessions for all
  using ( auth.uid() = user_id );

-- ============================================
-- NOTES POLICIES
-- ============================================
create policy "Users can view their own notes"
  on notes for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own notes"
  on notes for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own notes"
  on notes for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own notes"
  on notes for delete
  using ( auth.uid() = user_id );

-- ============================================
-- GAMIFICATION POLICIES
-- ============================================
create policy "Levels are viewable by everyone"
  on levels for select
  using ( true );

create policy "Achievements are viewable by everyone"
  on achievements for select
  using ( true );

create policy "Users can view their own achievements"
  on user_achievements for select
  using ( auth.uid() = user_id );

create policy "Users can view their own XP history"
  on xp_history for select
  using ( auth.uid() = user_id );

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
create index if not exists idx_books_user_id on books(user_id);
create index if not exists idx_reading_progress_user_id on reading_progress(user_id);
create index if not exists idx_reading_progress_updated_at on reading_progress(updated_at desc);
create index if not exists idx_reading_sessions_user_date on reading_sessions(user_id, session_date desc);
create index if not exists idx_notes_user_book on notes(user_id, book_id);
create index if not exists idx_user_achievements_user_id on user_achievements(user_id);
create index if not exists idx_xp_history_user_id on xp_history(user_id);

-- ============================================
-- SEED DATA (Optional - for development)
-- ============================================

-- Insert initial levels
insert into levels (level, title, min_xp) values
  (1, 'Novice Reader', 0),
  (2, 'Book Enthusiast', 100),
  (3, 'Avid Reader', 250),
  (4, 'Literary Explorer', 500),
  (5, 'Bookworm', 1000),
  (6, 'Page Turner', 2000),
  (7, 'Reading Addict', 4000),
  (8, 'Master Reader', 8000),
  (9, 'Grand Bibliophile', 16000),
  (10, 'Legendary Scholar', 32000)
on conflict (level) do nothing;

-- Insert initial achievements
insert into achievements (name, description, icon, xp_reward, condition_type, condition_value) values
  ('First Steps', 'Read your first book', '📖', 50, 'books_read', 1),
  ('Early Bird', 'Read for 3 days in a row', '🌅', 100, 'streak', 3),
  ('Week Warrior', 'Maintain a 7-day reading streak', '🔥', 200, 'streak', 7),
  ('Bookworm', 'Read 10 books', '🐛', 300, 'books_read', 10),
  ('Speed Reader', 'Read 100 pages in one day', '⚡', 150, 'pages_per_day', 100),
  ('Night Owl', 'Read after midnight', '🦉', 75, 'reading_time', 0),
  ('Marathon Reader', 'Read for 30 days in a row', '🏃', 500, 'streak', 30),
  ('Century Club', 'Read for 100 hours total', '💯', 400, 'total_hours', 100),
  ('Library Builder', 'Upload 25 books', '📚', 250, 'books_uploaded', 25),
  ('Milestone Master', 'Reach level 5', '🏆', 1000, 'level', 5)
on conflict do nothing;
