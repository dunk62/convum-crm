-- Migration: Add account_id to opportunities table
-- This creates a foreign key relationship between opportunities and accounts

-- 1. Add account_id column with FK reference to accounts (accounts.id is TEXT type)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'opportunities' AND column_name = 'account_id') THEN
        ALTER TABLE opportunities ADD COLUMN account_id TEXT REFERENCES accounts(id);
    END IF;
END $$;

-- 2. Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_opportunities_account_id ON opportunities(account_id);

-- 3. Add comment
COMMENT ON COLUMN opportunities.account_id IS 'Foreign key reference to accounts table for proper company linkage';

-- =====================================================
-- FIX: Update query_data RPC function to avoid false positives
-- This fixes the issue where column names like 'created_at' and 'updated_at'
-- were incorrectly flagged as dangerous keywords
-- =====================================================

-- Drop existing function
DROP FUNCTION IF EXISTS query_data(TEXT);

-- Recreate with fixed keyword detection
CREATE OR REPLACE FUNCTION query_data(query TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
    query_lower TEXT;
BEGIN
    -- Normalize query: remove extra spaces and convert to lowercase
    query_lower := LOWER(TRIM(query));
    
    -- Security check: Must start with SELECT
    IF NOT (query_lower LIKE 'select%') THEN
        RAISE EXCEPTION 'Only SELECT queries are allowed';
    END IF;
    
    -- Check for dangerous SQL commands using word boundaries
    -- Using regex to match whole words only, not substrings
    IF query_lower ~ '(^|[^a-z_])(insert|delete|drop|truncate|alter|grant|revoke)([^a-z_]|$)' THEN
        RAISE EXCEPTION 'Modification queries are not allowed';
    END IF;
    
    -- Check for UPDATE command specifically (avoiding 'updated_at' columns)
    IF query_lower ~ '(^|[^a-z_])update[[:space:]]+[a-z_]+[[:space:]]+(set|where)' THEN
        RAISE EXCEPTION 'UPDATE queries are not allowed';
    END IF;
    
    -- Check for CREATE command specifically (avoiding 'created_at' columns)
    IF query_lower ~ '(^|[^a-z_])create[[:space:]]+(table|index|function|view|database|schema)' THEN
        RAISE EXCEPTION 'CREATE queries are not allowed';
    END IF;
    
    -- Execute query and return results
    EXECUTE 'SELECT COALESCE(jsonb_agg(row_to_json(t)), ''[]''::jsonb) FROM (' || query || ') t'
    INTO result;
    
    RETURN result;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION query_data(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION query_data(TEXT) TO authenticated;

COMMENT ON FUNCTION query_data(TEXT) IS 'AI 챗봇용 안전한 SELECT 쿼리 실행 함수 (fixed keyword detection)';
