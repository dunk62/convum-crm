-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id TEXT REFERENCES accounts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    position TEXT,
    email TEXT,
    phone TEXT,
    department TEXT,
    memo TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migrate existing data
INSERT INTO contacts (account_id, name, position, email, phone, department, memo)
SELECT 
    id as account_id,
    contact_name as name,
    position,
    email,
    phone,
    department,
    note as memo
FROM accounts
WHERE contact_name IS NOT NULL;
