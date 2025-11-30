-- Add success_probability column to opportunities table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'opportunities' AND column_name = 'success_probability') THEN
        ALTER TABLE opportunities ADD COLUMN success_probability INTEGER;
    END IF;
END $$;

-- Add comment to column
COMMENT ON COLUMN opportunities.success_probability IS 'Success probability percentage (10, 30, 50, 80, 100)';
