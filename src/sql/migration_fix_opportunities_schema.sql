-- Fix Opportunities Table Schema
-- This script ensures all required columns exist and have the correct types.

-- 1. Add contact_name if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'opportunities' AND column_name = 'contact_name') THEN
        ALTER TABLE opportunities ADD COLUMN contact_name TEXT;
    END IF;
END $$;

-- 2. Add success_probability if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'opportunities' AND column_name = 'success_probability') THEN
        ALTER TABLE opportunities ADD COLUMN success_probability INTEGER;
    END IF;
END $$;

-- 3. Add meeting_date if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'opportunities' AND column_name = 'meeting_date') THEN
        ALTER TABLE opportunities ADD COLUMN meeting_date TIMESTAMPTZ;
    ELSE
        -- If it exists, ensure it is TIMESTAMPTZ (converting from DATE if necessary)
        ALTER TABLE opportunities ALTER COLUMN meeting_date TYPE TIMESTAMPTZ USING meeting_date::TIMESTAMPTZ;
    END IF;
END $$;
