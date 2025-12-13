-- Update accounts with industry '로봇' to customer_status 'prospect' (신규/가망)
UPDATE accounts
SET customer_status = 'prospect',
    updated_at = NOW()
WHERE industry = '로봇';

-- Verify the update
SELECT id, name, industry, customer_status
FROM accounts
WHERE industry = '로봇'
ORDER BY name;
