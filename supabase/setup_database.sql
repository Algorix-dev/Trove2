-- ============================================
-- TROVE - COMPLETE DATABASE SETUP
-- ============================================
-- Run this entire file in Supabase SQL Editor
-- This creates all tables, policies, indexes, and seed data
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  daily_goal_minutes INTEGER DEFAULT 30,
  current_streak INTEGER DEFAULT 0,
  highest_streak INTEGER DEFAULT 0,
  last_read_date DATE,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Books table
CREATE TABLE IF NOT EXISTS public.books (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  file_url TEXT NOT NULL,
  cover_url TEXT,
  format TEXT CHECK (format IN ('pdf', 'epub', 'txt')),
  total_pages INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Reading progress table
CREATE TABLE IF NOT EXISTS public.reading_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES public.books ON DELETE CASCADE NOT NULL,
  current_page INTEGER DEFAULT 0,
  total_pages INTEGER DEFAULT 0,
  progress_percentage FLOAT DEFAULT 0,
  epub_cfi TEXT,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, book_id)
);

-- Reading sessions table
CREATE TABLE IF NOT EXISTS public.reading_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES public.books ON DELETE CASCADE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  session_date DATE NOT NULL DEFAULT current_date,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Notes table (book_id can be null for general notes)
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES public.books ON DELETE CASCADE,
  content TEXT NOT NULL,
  highlight_text TEXT,
  page_number INTEGER,
  color TEXT DEFAULT 'yellow',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES public.books ON DELETE CASCADE NOT NULL,
  page_number INTEGER,
  epub_cfi TEXT,
  progress_percentage FLOAT,
  note TEXT,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Reading goals table
CREATE TABLE IF NOT EXISTS public.reading_goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL,
  target_books INTEGER NOT NULL DEFAULT 12,
  books_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, year)
);

-- Book quotes table
CREATE TABLE IF NOT EXISTS public.book_quotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES public.books ON DELETE CASCADE NOT NULL,
  quote_text TEXT NOT NULL,
  page_number INTEGER,
  chapter TEXT,
  note TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- GAMIFICATION TABLES
-- ============================================

-- Levels table
CREATE TABLE IF NOT EXISTS public.levels (
  level INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  min_xp INTEGER NOT NULL,
  badge_color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  xp_reward INTEGER DEFAULT 0,
  requirement_type TEXT,
  requirement_value INTEGER,
  tier TEXT CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  notified BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, achievement_id)
);

-- XP history table
CREATE TABLE IF NOT EXISTS public.xp_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  reason TEXT,
  book_id UUID REFERENCES public.books ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_history ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Books policies
DROP POLICY IF EXISTS "Users can view their own books" ON public.books;
CREATE POLICY "Users can view their own books"
  ON public.books FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own books" ON public.books;
CREATE POLICY "Users can insert their own books"
  ON public.books FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own books" ON public.books;
CREATE POLICY "Users can update their own books"
  ON public.books FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own books" ON public.books;
CREATE POLICY "Users can delete their own books"
  ON public.books FOR DELETE
  USING (auth.uid() = user_id);

-- Reading progress policies
DROP POLICY IF EXISTS "Users can view their own progress" ON public.reading_progress;
CREATE POLICY "Users can view their own progress"
  ON public.reading_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own progress" ON public.reading_progress;
CREATE POLICY "Users can insert their own progress"
  ON public.reading_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress" ON public.reading_progress;
CREATE POLICY "Users can update their own progress"
  ON public.reading_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Reading sessions policies
DROP POLICY IF EXISTS "Users can manage their own reading sessions" ON public.reading_sessions;
CREATE POLICY "Users can manage their own reading sessions"
  ON public.reading_sessions FOR ALL
  USING (auth.uid() = user_id);

-- Notes policies
DROP POLICY IF EXISTS "Users can view their own notes" ON public.notes;
CREATE POLICY "Users can view their own notes"
  ON public.notes FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own notes" ON public.notes;
CREATE POLICY "Users can insert their own notes"
  ON public.notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes;
CREATE POLICY "Users can update their own notes"
  ON public.notes FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes;
CREATE POLICY "Users can delete their own notes"
  ON public.notes FOR DELETE
  USING (auth.uid() = user_id);

-- Bookmarks policies
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can view their own bookmarks"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can insert their own bookmarks"
  ON public.bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can update their own bookmarks"
  ON public.bookmarks FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can delete their own bookmarks"
  ON public.bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Reading goals policies
DROP POLICY IF EXISTS "Users can view their own goals" ON public.reading_goals;
CREATE POLICY "Users can view their own goals"
  ON public.reading_goals FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own goals" ON public.reading_goals;
CREATE POLICY "Users can create their own goals"
  ON public.reading_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own goals" ON public.reading_goals;
CREATE POLICY "Users can update their own goals"
  ON public.reading_goals FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own goals" ON public.reading_goals;
CREATE POLICY "Users can delete their own goals"
  ON public.reading_goals FOR DELETE
  USING (auth.uid() = user_id);

-- Book quotes policies
DROP POLICY IF EXISTS "Users can view their own quotes" ON public.book_quotes;
CREATE POLICY "Users can view their own quotes"
  ON public.book_quotes FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own quotes" ON public.book_quotes;
CREATE POLICY "Users can create their own quotes"
  ON public.book_quotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own quotes" ON public.book_quotes;
CREATE POLICY "Users can update their own quotes"
  ON public.book_quotes FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own quotes" ON public.book_quotes;
CREATE POLICY "Users can delete their own quotes"
  ON public.book_quotes FOR DELETE
  USING (auth.uid() = user_id);

-- Gamification policies
DROP POLICY IF EXISTS "Levels are viewable by everyone" ON public.levels;
CREATE POLICY "Levels are viewable by everyone"
  ON public.levels FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON public.achievements;
CREATE POLICY "Achievements are viewable by everyone"
  ON public.achievements FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can view their own achievements" ON public.user_achievements;
CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own achievements" ON public.user_achievements;
CREATE POLICY "Users can insert own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own XP history" ON public.xp_history;
CREATE POLICY "Users can view their own XP history"
  ON public.xp_history FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to handle XP gain and level up
CREATE OR REPLACE FUNCTION public.handle_xp_gain()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  new_level INTEGER;
BEGIN
  -- Check new level based on total_xp
  SELECT level INTO new_level
  FROM public.levels
  WHERE min_xp <= NEW.total_xp
  ORDER BY level DESC
  LIMIT 1;

  IF new_level > NEW.current_level THEN
    NEW.current_level := new_level;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger for XP changes
DROP TRIGGER IF EXISTS on_xp_change ON public.profiles;
CREATE TRIGGER on_xp_change
  BEFORE UPDATE OF total_xp ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_xp_gain();

-- Function to auto-increment reading goal progress
CREATE OR REPLACE FUNCTION public.update_reading_goal_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.progress_percentage = 100 AND (OLD.progress_percentage IS NULL OR OLD.progress_percentage < 100) THEN
    UPDATE public.reading_goals
    SET books_completed = books_completed + 1,
        updated_at = now()
    WHERE user_id = NEW.user_id 
    AND year = EXTRACT(YEAR FROM now())::INTEGER;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger for reading goal updates
DROP TRIGGER IF EXISTS trigger_update_reading_goal ON public.reading_progress;
CREATE TRIGGER trigger_update_reading_goal
  AFTER INSERT OR UPDATE ON public.reading_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reading_goal_progress();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Books indexes
CREATE INDEX IF NOT EXISTS idx_books_user_id ON public.books(user_id);
CREATE INDEX IF NOT EXISTS idx_books_format ON public.books(format);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON public.books(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_books_title ON public.books USING GIN (to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_books_author ON public.books USING GIN (to_tsvector('english', author));

-- Reading progress indexes
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_book ON public.reading_progress(user_id, book_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_percentage ON public.reading_progress(progress_percentage);
CREATE INDEX IF NOT EXISTS idx_reading_progress_updated ON public.reading_progress(updated_at DESC);

-- Reading sessions indexes
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_id ON public.reading_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_book_id ON public.reading_sessions(book_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_date ON public.reading_sessions(session_date DESC);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_date ON public.reading_sessions(user_id, session_date DESC);

-- Notes indexes
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_book_id ON public.notes(book_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON public.notes(created_at DESC);

-- Bookmarks indexes
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_book ON public.bookmarks(user_id, book_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON public.bookmarks(created_at DESC);

-- Reading goals indexes
CREATE INDEX IF NOT EXISTS idx_reading_goals_user_year ON public.reading_goals(user_id, year DESC);

-- Book quotes indexes
CREATE INDEX IF NOT EXISTS idx_book_quotes_user_id ON public.book_quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_book_quotes_book_id ON public.book_quotes(book_id);
CREATE INDEX IF NOT EXISTS idx_book_quotes_favorite ON public.book_quotes(is_favorite) WHERE is_favorite = true;

-- User achievements indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_notified ON public.user_achievements(notified) WHERE notified = false;

-- XP history indexes
CREATE INDEX IF NOT EXISTS idx_xp_history_user_id ON public.xp_history(user_id);

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username) WHERE username IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_level ON public.profiles(current_level DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON public.profiles(total_xp DESC);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert initial levels
INSERT INTO public.levels (level, title, min_xp, badge_color) VALUES
  (1, 'Novice Reader', 0, '#6366f1'),
  (2, 'Book Enthusiast', 100, '#8b5cf6'),
  (3, 'Avid Reader', 250, '#a855f7'),
  (4, 'Literary Explorer', 500, '#d946ef'),
  (5, 'Bookworm', 1000, '#ec4899'),
  (6, 'Page Turner', 2000, '#f43f5e'),
  (7, 'Reading Addict', 4000, '#ef4444'),
  (8, 'Master Reader', 8000, '#f97316'),
  (9, 'Grand Bibliophile', 16000, '#f59e0b'),
  (10, 'Legendary Scholar', 32000, '#eab308')
ON CONFLICT (level) DO NOTHING;

-- Insert initial achievements
INSERT INTO public.achievements (code, name, description, icon, xp_reward, requirement_type, requirement_value, tier) VALUES
  ('FIRST_BOOK', 'First Steps', 'Read your first book', 'BookOpen', 50, 'books_read', 1, 'bronze'),
  ('EARLY_BIRD', 'Early Bird', 'Read for 3 days in a row', 'Sunrise', 100, 'streak', 3, 'bronze'),
  ('WEEK_WARRIOR', 'Week Warrior', 'Maintain a 7-day reading streak', 'Flame', 200, 'streak', 7, 'silver'),
  ('BOOKWORM', 'Bookworm', 'Read 10 books', 'Book', 300, 'books_read', 10, 'silver'),
  ('SPEED_READER', 'Speed Reader', 'Read 100 pages in one day', 'Zap', 150, 'pages_per_day', 100, 'bronze'),
  ('NIGHT_OWL', 'Night Owl', 'Read after midnight', 'Moon', 75, 'reading_time', 0, 'bronze'),
  ('MARATHON_READER', 'Marathon Reader', 'Read for 30 days in a row', 'Trophy', 500, 'streak', 30, 'gold'),
  ('CENTURY_CLUB', 'Century Club', 'Read for 100 hours total', 'Clock', 400, 'total_hours', 100, 'gold'),
  ('LIBRARY_BUILDER', 'Library Builder', 'Upload 25 books', 'Library', 250, 'books_uploaded', 25, 'silver'),
  ('MILESTONE_MASTER', 'Milestone Master', 'Reach level 5', 'Award', 1000, 'level', 5, 'platinum')
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Next steps:
-- 1. Create storage bucket named 'books' in Supabase Dashboard → Storage
-- 2. Set up storage policies (see STORAGE_POLICIES_GUIDE.md)
-- 3. Configure environment variables in your .env.local file
-- ============================================


