-- Fix notes table to allow general notes (without book_id)
-- Run this in your Supabase SQL Editor

ALTER TABLE notes ALTER COLUMN book_id DROP NOT NULL;
