
-- Allow notes to be created without a specific book (General Notes)
ALTER TABLE notes ALTER COLUMN book_id DROP NOT NULL;
