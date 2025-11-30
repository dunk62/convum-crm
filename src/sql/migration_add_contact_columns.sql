-- Add new columns to contacts table
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS grade TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS sales_rep TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS source TEXT;
