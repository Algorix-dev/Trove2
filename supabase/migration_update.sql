-- ============================================
-- TROVE DATABASE MIGRATION SCRIPT
-- Safe Updates for Existing Database
-- ============================================
-- Run this in your Supabase SQL Editor
-- This script safely adds missing fields and updates constraints

-- ============================================
-- 1. UPDATE PROFILES TABLE
-- ============================================
-- Add username column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='username') THEN
        ALTER TABLE profiles ADD COLUMN username TEXT UNIQUE;
    END IF;
END $$;

-- Add daily_goal_minutes if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='daily_goal_minutes') THEN
        ALTER TABLE profiles ADD COLUMN daily_goal_minutes INTEGER DEFAULT 30;
    END IF;
END $$;

-- Add streak tracking columns
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='current_streak') THEN
        ALTER TABLE profiles ADD COLUMN current_streak INTEGER DEFAULT 0;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='highest_streak') THEN
        ALTER TABLE profiles ADD COLUMN highest_streak INTEGER DEFAULT 0;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='last_read_date') THEN
        ALTER TABLE profiles ADD COLUMN last_read_date DATE;
    END IF;
END $$;

-- Add gamification columns
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='total_xp') THEN
        ALTER TABLE profiles ADD COLUMN total_xp INTEGER DEFAULT 0;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='current_level') THEN
        ALTER TABLE profiles ADD COLUMN current_level INTEGER DEFAULT 1;
    END IF;
END $$;

-- ============================================
-- 2. UPDATE BOOKS TABLE - FIX FORMAT CONSTRAINT
-- ============================================
-- Drop old constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.constraint_column_usage 
               WHERE table_name='books' AND constraint_name='books_format_check') THEN
        ALTER TABLE books DROP CONSTRAINT books_format_check;
    END IF;
END $$;

-- Add new constraint with TXT support
ALTER TABLE books ADD CONSTRAINT books_format_check 
CHECK (format IN ('pdf', 'epub', 'txt'));

-- ============================================
-- 3. UPDATE READING_PROGRESS TABLE
-- ============================================
-- Add total_pages column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='reading_progress' AND column_name='total_pages') THEN
        ALTER TABLE reading_progress ADD COLUMN total_pages INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add epub_cfi column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='reading_progress' AND column_name='epub_cfi') THEN
        ALTER TABLE reading_progress ADD COLUMN epub_cfi TEXT;
    END IF;
END $$;

-- Add updated_at column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='reading_progress' AND column_name='updated_at') THEN
        ALTER TABLE reading_progress ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- ============================================
-- 4. CREATE READING_SESSIONS TABLE (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS reading_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    duration_minutes INTEGER NOT NULL,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on reading_sessions
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage their own reading sessions" ON reading_sessions;

-- Create policy for reading_sessions
CREATE POLICY "Users can manage their own reading sessions"
ON reading_sessions FOR ALL
USING (auth.uid() = user_id);

-- ============================================
-- 5. CREATE GAMIFICATION TABLES (if not exists)
-- ============================================

-- Levels table
CREATE TABLE IF NOT EXISTS levels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    level INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    min_xp INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    xp_reward INTEGER DEFAULT 0,
    condition_type TEXT,
    condition_value INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notified BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, achievement_id)
);

-- XP history table
CREATE TABLE IF NOT EXISTS xp_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL,
    reason TEXT,
    book_id UUID REFERENCES books(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. ENABLE RLS ON NEW TABLES
-- ============================================
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_history ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. CREATE POLICIES FOR GAMIFICATION
-- ============================================

-- Levels policies
DROP POLICY IF EXISTS "Levels are viewable by everyone" ON levels;
CREATE POLICY "Levels are viewable by everyone"
ON levels FOR SELECT
USING (true);

-- Achievements policies
DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON achievements;
CREATE POLICY "Achievements are viewable by everyone"
ON achievements FOR SELECT
USING (true);

-- User achievements policies
DROP POLICY IF EXISTS "Users can view their own achievements" ON user_achievements;
CREATE POLICY "Users can view their own achievements"
ON user_achievements FOR SELECT
USING (auth.uid() = user_id);

-- XP history policies
DROP POLICY IF EXISTS "Users can view their own XP history" ON xp_history;
CREATE POLICY "Users can view their own XP history"
ON xp_history FOR SELECT
USING (auth.uid() = user_id);

-- ============================================
-- 8. CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_reading_progress_updated_at 
ON reading_progress(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_date 
ON reading_sessions(user_id, session_date DESC);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id 
ON user_achievements(user_id);

CREATE INDEX IF NOT EXISTS idx_xp_history_user_id 
ON xp_history(user_id);

-- ============================================
-- 9. SEED INITIAL DATA
-- ============================================

-- Insert levels (only if table is empty)
INSERT INTO levels (level, title, min_xp)
SELECT * FROM (VALUES
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
) AS v(level, title, min_xp)
WHERE NOT EXISTS (SELECT 1 FROM levels)
ON CONFLICT (level) DO NOTHING;

-- Insert achievements (only if table is empty)
INSERT INTO achievements (name, description, icon, xp_reward, condition_type, condition_value)
SELECT * FROM (VALUES
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
) AS v(name, description, icon, xp_reward, condition_type, condition_value)
WHERE NOT EXISTS (SELECT 1 FROM achievements)
ON CONFLICT DO NOTHING;

-- ============================================
-- MIGRATION COMPLETE! ✅
-- ============================================
-- Your database has been updated with:
-- ✅ TXT format support in books table
-- ✅ All missing columns in profiles
-- ✅ Missing fields in reading_progress
-- ✅ Reading sessions table
-- ✅ Gamification system
-- ✅ Performance indexes
-- ✅ Seed data for levels and achievements
