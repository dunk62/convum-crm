-- Identify and merge duplicate accounts based on name
-- 1. Identify duplicate groups
-- 2. Select a master account for each group (earliest created_at)
-- 3. Move contacts to master account
-- 4. Delete duplicate accounts

BEGIN;

-- Create a temporary table to store the mapping of duplicate accounts to master accounts
CREATE TEMP TABLE account_merges AS
WITH DuplicateNames AS (
    SELECT name
    FROM accounts
    GROUP BY name
    HAVING COUNT(*) > 1
),
RankedAccounts AS (
    SELECT 
        id,
        name,
        created_at,
        ROW_NUMBER() OVER (PARTITION BY name ORDER BY created_at ASC, id ASC) as rn
    FROM accounts
    WHERE name IN (SELECT name FROM DuplicateNames)
),
MasterAccounts AS (
    SELECT id as master_id, name
    FROM RankedAccounts
    WHERE rn = 1
),
ToMerge AS (
    SELECT 
        r.id as duplicate_id,
        m.master_id
    FROM RankedAccounts r
    JOIN MasterAccounts m ON r.name = m.name
    WHERE r.rn > 1
)
SELECT * FROM ToMerge;

-- Update contacts to point to the master account
UPDATE contacts
SET account_id = am.master_id
FROM account_merges am
WHERE contacts.account_id = am.duplicate_id;

-- Delete the duplicate accounts
DELETE FROM accounts
WHERE id IN (SELECT duplicate_id FROM account_merges);

-- Drop the temporary table
DROP TABLE account_merges;

COMMIT;
