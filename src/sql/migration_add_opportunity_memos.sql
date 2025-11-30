-- Drop table if exists to ensure clean state after failed attempt
DROP TABLE IF EXISTS opportunity_memos;

-- Create opportunity_memos table
CREATE TABLE IF NOT EXISTS opportunity_memos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id BIGINT REFERENCES opportunities(id) ON DELETE CASCADE, -- Changed from UUID to BIGINT
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Add comment to table
COMMENT ON TABLE opportunity_memos IS 'Stores memos/notes for opportunities';
