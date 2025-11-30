
import os

source_file = 'accounts_data.sql'
target_file = 'src/sql/accounts_import_fixed.sql'

schema_sql = """-- Create the accounts table if it doesn't exist
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT,
  type TEXT,
  owner TEXT,
  phone TEXT,
  email TEXT,
  status TEXT,
  registration_date TEXT,
  main_phone TEXT,
  website TEXT,
  address TEXT,
  department TEXT,
  position TEXT,
  contact_name TEXT,
  grade TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security (RLS)
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (for development)
-- Drop existing policy first to avoid errors
DROP POLICY IF EXISTS "Allow all operations for accounts" ON accounts;
CREATE POLICY "Allow all operations for accounts" ON accounts
  FOR ALL USING (true) WITH CHECK (true);

-- Insert existing data
"""

with open(source_file, 'r', encoding='utf-8') as f:
    data_sql = f.read()

# Replace the final semicolon with ON CONFLICT clause
# We look for the last semicolon in the file
last_semicolon_index = data_sql.rfind(';')
if last_semicolon_index != -1:
    data_sql = data_sql[:last_semicolon_index] + " ON CONFLICT (id) DO NOTHING;"
else:
    # If no semicolon found, just append it (though this would be weird for valid SQL)
    data_sql += " ON CONFLICT (id) DO NOTHING;"

full_sql = schema_sql + data_sql

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(full_sql)

print(f"Successfully created {target_file}")
