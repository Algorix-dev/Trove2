-- Fix Storage Bucket Policies for Books

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for books bucket if any
DROP POLICY IF EXISTS "Users can upload books" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their books" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their books" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their books" ON storage.objects;
DROP POLICY IF EXISTS "Public can view books" ON storage.objects;

-- Create storage policies for books bucket
-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload books"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'books' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to view their own books
CREATE POLICY "Users can view their books"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'books' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own books
CREATE POLICY "Users can update their books"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'books' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own books
CREATE POLICY "Users can delete their books"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'books' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Optional: Allow public read access to book files (for sharing)
-- Uncomment if you want books to be publicly accessible
-- CREATE POLICY "Public can view books"
-- ON storage.objects FOR SELECT
-- TO public
-- USING (bucket_id = 'books');

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'objects' AND policyname LIKE '%books%';
