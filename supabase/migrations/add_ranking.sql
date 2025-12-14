-- ============================================
-- ADD RANKING SYSTEM
-- ============================================
-- Run this in Supabase SQL Editor
-- ============================================

-- Add ranking fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS rank INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rank_title TEXT DEFAULT 'Novice Reader';

-- Create function to calculate and update ranks
CREATE OR REPLACE FUNCTION update_user_rank()
RETURNS TRIGGER AS $$
DECLARE
    user_rank INTEGER;
    user_title TEXT;
BEGIN
    -- Calculate rank based on total_xp
    SELECT 
        CASE
            WHEN NEW.total_xp >= 100000 THEN 10
            WHEN NEW.total_xp >= 75000 THEN 9
            WHEN NEW.total_xp >= 50000 THEN 8
            WHEN NEW.total_xp >= 35000 THEN 7
            WHEN NEW.total_xp >= 25000 THEN 6
            WHEN NEW.total_xp >= 15000 THEN 5
            WHEN NEW.total_xp >= 10000 THEN 4
            WHEN NEW.total_xp >= 5000 THEN 3
            WHEN NEW.total_xp >= 2000 THEN 2
            WHEN NEW.total_xp >= 500 THEN 1
            ELSE 0
        END INTO user_rank;

    -- Set rank title
    SELECT 
        CASE
            WHEN user_rank = 10 THEN 'Grandmaster'
            WHEN user_rank = 9 THEN 'Master'
            WHEN user_rank = 8 THEN 'Expert'
            WHEN user_rank = 7 THEN 'Scholar'
            WHEN user_rank = 6 THEN 'Bibliophile'
            WHEN user_rank = 5 THEN 'Bookworm'
            WHEN user_rank = 4 THEN 'Reader'
            WHEN user_rank = 3 THEN 'Learner'
            WHEN user_rank = 2 THEN 'Beginner'
            ELSE 'Novice Reader'
        END INTO user_title;

    -- Update rank
    UPDATE public.profiles
    SET rank = user_rank, rank_title = user_title
    WHERE id = NEW.id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update rank when XP changes
DROP TRIGGER IF EXISTS trigger_update_rank ON public.profiles;
CREATE TRIGGER trigger_update_rank
    AFTER UPDATE OF total_xp ON public.profiles
    FOR EACH ROW
    WHEN (OLD.total_xp IS DISTINCT FROM NEW.total_xp)
    EXECUTE FUNCTION update_user_rank();

-- Update existing profiles with ranks
DO $$
DECLARE
    profile_record RECORD;
    user_rank INTEGER;
    user_title TEXT;
BEGIN
    FOR profile_record IN SELECT id, total_xp FROM public.profiles LOOP
        SELECT 
            CASE
                WHEN profile_record.total_xp >= 100000 THEN 10
                WHEN profile_record.total_xp >= 75000 THEN 9
                WHEN profile_record.total_xp >= 50000 THEN 8
                WHEN profile_record.total_xp >= 35000 THEN 7
                WHEN profile_record.total_xp >= 25000 THEN 6
                WHEN profile_record.total_xp >= 15000 THEN 5
                WHEN profile_record.total_xp >= 10000 THEN 4
                WHEN profile_record.total_xp >= 5000 THEN 3
                WHEN profile_record.total_xp >= 2000 THEN 2
                WHEN profile_record.total_xp >= 500 THEN 1
                ELSE 0
            END INTO user_rank;

        SELECT 
            CASE
                WHEN user_rank = 10 THEN 'Grandmaster'
                WHEN user_rank = 9 THEN 'Master'
                WHEN user_rank = 8 THEN 'Expert'
                WHEN user_rank = 7 THEN 'Scholar'
                WHEN user_rank = 6 THEN 'Bibliophile'
                WHEN user_rank = 5 THEN 'Bookworm'
                WHEN user_rank = 4 THEN 'Reader'
                WHEN user_rank = 3 THEN 'Learner'
                WHEN user_rank = 2 THEN 'Beginner'
                ELSE 'Novice Reader'
            END INTO user_title;

        UPDATE public.profiles
        SET rank = user_rank, rank_title = user_title
        WHERE id = profile_record.id;
    END LOOP;
END $$;

