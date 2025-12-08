-- Create bookmarks table with all necessary columns
-- Run this in your Supabase SQL Editor

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

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_book ON public.bookmarks(user_id, book_id);

-- Enable Row Level Security
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own bookmarks" 
    ON public.bookmarks 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" 
    ON public.bookmarks 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks" 
    ON public.bookmarks 
    FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
    ON public.bookmarks 
    FOR DELETE 
    USING (auth.uid() = user_id);
