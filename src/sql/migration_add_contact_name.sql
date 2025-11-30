-- Add contact_name column to accounts table if it doesn't exist
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS contact_name TEXT;
