-- Add company_id and contact_id columns
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS company_id TEXT;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS contact_id TEXT;

-- Function to generate IDs
DO $$
DECLARE
    r RECORD;
    counter INT := 1;
    cid TEXT;
BEGIN
    -- Generate Company IDs (CP-XXXX)
    FOR r IN SELECT DISTINCT name FROM accounts ORDER BY name LOOP
        cid := 'CP-' || LPAD(counter::TEXT, 4, '0');
        UPDATE accounts SET company_id = cid WHERE name = r.name;
        counter := counter + 1;
    END LOOP;

    -- Reset counter
    counter := 1;

    -- Generate Contact IDs (CT-XXXX)
    FOR r IN SELECT DISTINCT contact_name FROM accounts WHERE contact_name IS NOT NULL ORDER BY contact_name LOOP
        cid := 'CT-' || LPAD(counter::TEXT, 4, '0');
        UPDATE accounts SET contact_id = cid WHERE contact_name = r.contact_name;
        counter := counter + 1;
    END LOOP;
END $$;
