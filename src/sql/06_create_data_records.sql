-- Create data_records table
create table if not exists public.data_records (
  id uuid default gen_random_uuid() primary key,
  type text not null check (type in ('call', 'meeting', 'email')),
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.data_records enable row level security;

-- Create policies
create policy "Enable read access for all users"
  on public.data_records for select
  using (true);

create policy "Enable insert access for all users"
  on public.data_records for insert
  with check (true);

create policy "Enable update access for all users"
  on public.data_records for update
  using (true);

create policy "Enable delete access for all users"
  on public.data_records for delete
  using (true);
