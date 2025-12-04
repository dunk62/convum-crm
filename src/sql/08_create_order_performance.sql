-- Create order_performance table
create table if not exists public.order_performance (
  id uuid default gen_random_uuid() primary key,
  order_date date not null, -- Corresponds to 'shipment_date' in sales_performance, but for orders
  distributor_name text,
  company_name text,
  sales_rep text,
  product_name text,
  model_number text,
  quantity integer,
  unit_price integer,
  total_amount integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.order_performance enable row level security;

-- Create policies
create policy "Enable read access for all users" on public.order_performance for select using (true);
create policy "Enable insert access for all users" on public.order_performance for insert with check (true);
create policy "Enable update access for all users" on public.order_performance for update using (true);
create policy "Enable delete access for all users" on public.order_performance for delete using (true);
