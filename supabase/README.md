# Trove Database Setup

This directory contains SQL scripts for setting up your Trove database.

## Files

### For Existing Database (USE THIS!)

- **`migration_update.sql`** - **✨ USE THIS if you already have a Trove database!** Safely adds missing fields and tables without errors.

### For Fresh Database Setup

- **`complete_schema.sql`** - Complete database schema with all tables, policies, and seed data. Only use for brand new projects.

### Reference Files

- **`schema.sql`** - Base schema (updated with latest fields)
- **`schema_updates.sql`** - Incremental updates for existing databases
- **`gamification_schema.sql`** - Gamification tables and structures
- **`gamification_triggers.sql`** - Triggers for gamification features

## Setup Instructions

### For Existing Database (Most Common)

If you already have Trove running with a database:

1. Go to your Supabase Dashboard → SQL Editor
2. Copy and paste the contents of **`migration_update.sql`**
3. Run the query
4. Your database is updated! ✅

This script safely adds:
- Missing columns (like `username`, `total_xp`, `epub_cfi`)
- New tables (like `reading_sessions`, gamification tables)
- Updated constraints (TXT format support)
- Indexes for performance

### For Fresh Database Setup

If you're setting up Trove for the first time on a brand new Supabase project:

1. Go to your Supabase Dashboard → SQL Editor
2. Copy and paste the contents of **`complete_schema.sql`**
3. Run the query
4. Your database is ready!

### Existing Database Migration

If you already have a database and need to add missing features:

1. Run `schema_updates.sql` to add missing columns
2. Run `gamification_schema.sql` if you need gamification features
3. Run `gamification_triggers.sql` for gamification automation

## Storage Buckets

Don't forget to create these storage buckets in your Supabase Dashboard:

1. **`books`** (private) - For storing PDF, EPUB, and TXT files
   - Enable RLS
   - Policy: Users can upload to their own folder (`{user_id}/*`)
   - Policy: Users can read from their own folder

## Notes

- All tables use Row Level Security (RLS) for data protection
- Indexes are created for optimal query performance
- The schema supports PDF, EPUB, and TXT formats
- Gamification features include levels, achievements, and XP tracking
