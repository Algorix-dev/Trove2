-- ============================================
-- TROVE DATABASE RESET SCRIPT
-- ⚠️ WARNING: This will DELETE ALL DATA! ⚠️
-- ============================================
-- Only run this if you want to start completely fresh
-- All tables, data, and policies will be removed

-- Step 1: Drop all policies first
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
DROP POLICY IF EXISTS "Users can view their own books" ON books;
DROP POLICY IF EXISTS "Users can insert their own books" ON books;
DROP POLICY IF EXISTS "Users can update their own books" ON books;
DROP POLICY IF EXISTS "Users can delete their own books" ON books;
DROP POLICY IF EXISTS "Users can view their own progress" ON reading_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON reading_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON reading_progress;
DROP POLICY IF EXISTS "Users can manage their own reading sessions" ON reading_sessions;
DROP POLICY IF EXISTS "Users can view their own notes" ON notes;
DROP POLICY IF EXISTS "Users can insert their own notes" ON notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON notes;
DROP POLICY IF EXISTS "Levels are viewable by everyone" ON levels;
DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON achievements;
DROP POLICY IF EXISTS "Users can view their own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can view their own XP history" ON xp_history;

-- Step 2: Drop tables (in correct order to respect foreign keys)
DROP TABLE IF EXISTS xp_history CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS levels CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS highlights CASCADE;
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS reading_sessions CASCADE;
DROP TABLE IF EXISTS reading_progress CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Step 3: Drop trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ============================================
-- DATABASE RESET COMPLETE! ✅
-- ============================================
-- All Trove tables have been removed.
-- Now run complete_schema.sql to create fresh tables.
