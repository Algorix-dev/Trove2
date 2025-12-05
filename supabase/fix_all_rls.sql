
-- Books Table Policies
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own books" ON books;
DROP POLICY IF EXISTS "Users can insert their own books" ON books;
DROP POLICY IF EXISTS "Users can update their own books" ON books;
DROP POLICY IF EXISTS "Users can delete their own books" ON books;

CREATE POLICY "Users can view their own books"
ON books FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own books"
ON books FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own books"
ON books FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own books"
ON books FOR DELETE
USING (auth.uid() = user_id);


-- Reading Progress Table Policies
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own progress" ON reading_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON reading_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON reading_progress;

CREATE POLICY "Users can view their own progress"
ON reading_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
ON reading_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON reading_progress FOR UPDATE
USING (auth.uid() = user_id);
