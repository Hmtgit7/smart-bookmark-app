-- DATABASE MIGRATION FOR PRIVATE BOOKMARKS FEATURE
-- Run this SQL in your Supabase SQL Editor to add support for private bookmarks

-- Add new columns to the bookmarks table
ALTER TABLE bookmarks 
ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS private_password_hash TEXT;

-- Add index for better performance when filtering private bookmarks
CREATE INDEX IF NOT EXISTS idx_bookmarks_is_private ON bookmarks(user_id, is_private);

-- Add comment for documentation
COMMENT ON COLUMN bookmarks.is_private IS 'Indicates if the bookmark is private and requires password authentication';
COMMENT ON COLUMN bookmarks.private_password_hash IS 'SHA-256 hash of the password for private bookmarks';

-- Optional: Update existing bookmarks to be public by default (if they don't already have is_private set)
UPDATE bookmarks 
SET is_private = FALSE 
WHERE is_private IS NULL;
