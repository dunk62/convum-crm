-- Change meeting_date column type to TIMESTAMPTZ to support time
ALTER TABLE opportunities
ALTER COLUMN meeting_date TYPE TIMESTAMPTZ USING meeting_date::TIMESTAMPTZ;
