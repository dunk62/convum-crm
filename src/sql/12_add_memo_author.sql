-- Add author column to opportunity_memos table
ALTER TABLE opportunity_memos 
ADD COLUMN IF NOT EXISTS author TEXT;

-- Add ai_summary column for storing AI-generated summaries
ALTER TABLE opportunity_memos 
ADD COLUMN IF NOT EXISTS ai_summary TEXT;

-- Comment on columns
COMMENT ON COLUMN opportunity_memos.author IS 'Author of the memo (e.g., user name or AI Assistant)';
COMMENT ON COLUMN opportunity_memos.ai_summary IS 'AI-generated summary of the memo content';
