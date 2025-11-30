-- Add parent_id to opportunity_memos for threaded replies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'opportunity_memos' AND column_name = 'parent_id') THEN
        ALTER TABLE opportunity_memos ADD COLUMN parent_id UUID REFERENCES opportunity_memos(id) ON DELETE CASCADE;
    END IF;
END $$;
