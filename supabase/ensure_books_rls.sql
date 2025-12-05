
-- Ensure books table has RLS enabled
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to select their own books
CREATE POLICY "Users can view their own books"
ON books FOR SELECT
USING (auth.uid() = user_id);

-- Policy to allow users to insert their own books
CREATE POLICY "Users can insert their own books"
ON books FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own books
CREATE POLICY "Users can update their own books"
ON books FOR UPDATE
USING (auth.uid() = user_id);

-- Policy to allow users to delete their own books
CREATE POLICY "Users can delete their own books"
ON books FOR DELETE
USING (auth.uid() = user_id);
