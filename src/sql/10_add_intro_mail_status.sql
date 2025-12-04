-- Add intro_mail_status column to contacts table
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS intro_mail_status TEXT DEFAULT '미발송';

-- Comment on column
COMMENT ON COLUMN contacts.intro_mail_status IS 'Status of the company introduction email (e.g., 미발송, 발송완료)';
