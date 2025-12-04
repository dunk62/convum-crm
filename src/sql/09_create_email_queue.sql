-- Create email_queue table
CREATE TABLE IF NOT EXISTS email_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- pending, sent, failed
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON email_queue FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON email_queue FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON email_queue FOR UPDATE USING (true);
