-- ============================================
-- TROVE - STORAGE BUCKET AND POLICIES SETUP
-- ============================================
-- Run this in Supabase SQL Editor
-- This creates the storage bucket and all policies
-- ============================================

-- Create the storage bucket (if it doesn't exist)
-- Note: Bucket creation via SQL may not work in all Supabase versions
-- If this fails, create the bucket manually in Dashboard → Storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'books',
  'books',
  false, -- Private bucket
  52428800, -- 50 MB file size limit (in bytes)
  ARRAY['application/pdf', 'application/epub+zip', 'text/plain']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = false,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['application/pdf', 'application/epub+zip', 'text/plain'];

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Policy 1: Allow authenticated users to upload to their own folder
CREATE POLICY IF NOT EXISTS "Users can upload to their own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'books' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Allow authenticated users to read their own files
CREATE POLICY IF NOT EXISTS "Users can read their own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'books' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Allow authenticated users to update their own files
CREATE POLICY IF NOT EXISTS "Users can update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'books' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'books' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Allow authenticated users to delete their own files
CREATE POLICY IF NOT EXISTS "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'books' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- VERIFICATION
-- ============================================
-- After running, verify in Supabase Dashboard:
-- 1. Go to Storage → books bucket
-- 2. Check Policies tab - you should see 4 policies
-- ============================================

