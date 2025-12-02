-- Create opportunity_todos table
create table if not exists public.opportunity_todos (
  id uuid default gen_random_uuid() primary key,
  opportunity_id bigint references public.opportunities(id) on delete cascade not null,
  task_content text not null,
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.opportunity_todos enable row level security;

-- Create policies
create policy "Enable read access for all users"
  on public.opportunity_todos for select
  using (true);

create policy "Enable insert access for all users"
  on public.opportunity_todos for insert
  with check (true);

create policy "Enable update access for all users"
  on public.opportunity_todos for update
  using (true);

create policy "Enable delete access for all users"
  on public.opportunity_todos for delete
  using (true);
