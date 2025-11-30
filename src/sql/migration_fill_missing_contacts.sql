-- Insert missing contacts for accounts that don't have any contact records
-- Use account name as contact name, and copy phone/email/note if available

INSERT INTO contacts (account_id, name, phone, email, memo, created_at, updated_at)
SELECT 
    a.id as account_id,
    a.name as name, -- Use Company Name as Contact Name
    a.phone,
    a.email,
    a.note as memo,
    NOW() as created_at,
    NOW() as updated_at
FROM accounts a
LEFT JOIN contacts c ON a.id = c.account_id
WHERE c.id IS NULL;
