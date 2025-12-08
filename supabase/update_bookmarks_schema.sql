-- Upgrade bookmarks table to support page numbers, locations, and notes
-- Run this in your Supabase SQL Editor

-- 1. Add new columns for location tracking
ALTER TABLE public.bookmarks 
ADD COLUMN IF NOT EXISTS page_number INTEGER,          -- For PDF/TXT
ADD COLUMN IF NOT EXISTS epub_cfi TEXT,                -- For EPUB
ADD COLUMN IF NOT EXISTS progress_percentage FLOAT,    -- Universal fallback
ADD COLUMN IF NOT EXISTS note TEXT,                    -- User notes
ADD COLUMN IF NOT EXISTS title TEXT;                   -- Backup title/chapter name

-- 2. Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_book ON public.bookmarks(user_id, book_id);

-- 3. Update RLS policies to ensure users can manage their own bookmarks (if not already strictly defined)
-- These might already exist, but safe to ensure:
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can insert their own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can update their own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.bookmarks;

CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookmarks" ON public.bookmarks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bookmarks" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);
