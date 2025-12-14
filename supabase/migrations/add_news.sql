-- ============================================
-- NEWS API TABLES
-- ============================================
-- Run this in Supabase SQL Editor
-- ============================================

-- Book news table
CREATE TABLE IF NOT EXISTS public.book_news (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  source TEXT,
  category TEXT CHECK (category IN ('book', 'manga', 'anime', 'author', 'general')) DEFAULT 'general',
  published_at TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User news preferences (for filtering)
-- This extends the user_preferences table
-- We'll add a news_preferences JSONB column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'news_preferences'
  ) THEN
    ALTER TABLE public.user_preferences
    ADD COLUMN news_preferences JSONB DEFAULT '{}';
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.book_news ENABLE ROW LEVEL SECURITY;

-- RLS Policies for book_news
CREATE POLICY "Anyone can view news"
  ON public.book_news FOR SELECT
  USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_book_news_category ON public.book_news(category);
CREATE INDEX IF NOT EXISTS idx_book_news_published_at ON public.book_news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_book_news_tags ON public.book_news USING GIN(tags);

