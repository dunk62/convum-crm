-- Remove unused columns from accounts table
-- Keeping: id, created_at, name, industry, registrationDate, mainPhone, website, address

ALTER TABLE accounts
DROP COLUMN IF EXISTS type,
DROP COLUMN IF EXISTS owner,
DROP COLUMN IF EXISTS phone,
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS status,
DROP COLUMN IF EXISTS department,
DROP COLUMN IF EXISTS position,
DROP COLUMN IF EXISTS contact_name, -- Note: snake_case in DB usually, checking previous grep results it was contactName in TS interface but likely contact_name in DB or just contactName if created via Supabase UI without snake_case enforcement. Let's assume standard naming or check.
-- Wait, I should verify the column names in the DB. The TS interface had `contactName`. 
-- Let's look at `migration_separate_contacts.sql` again, it selected `contact_name` from accounts. So the column is `contact_name`.
-- It also selected `note` as memo. So column is `note`.
DROP COLUMN IF EXISTS grade,
DROP COLUMN IF EXISTS note;
