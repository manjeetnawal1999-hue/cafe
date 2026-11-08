-- CABIN CAFE: run this file in Supabase SQL Editor.
-- Public visitors may submit requests but cannot read, update, or delete customer records.
create table if not exists public.cafe_bookings (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique default ('CAB-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  full_name text not null check (char_length(full_name) between 2 and 100),
  phone text not null check (phone ~ '^\\+?[0-9]{10,15}$'),
  email text check (email is null or char_length(email) <= 254),
  booking_date date not null check (booking_date >= current_date),
  booking_time text not null,
  guests integer not null check (guests between 1 and 20),
  special_requests text check (special_requests is null or char_length(special_requests) <= 1000),
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at timestamptz not null default now()
);
create table if not exists public.cafe_inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 100),
  phone text check (phone is null or phone ~ '^\\+?[0-9]{10,15}$'),
  email text check (email is null or char_length(email) <= 254),
  subject text not null check (char_length(subject) between 2 and 120),
  message text not null check (char_length(message) between 5 and 2000),
  created_at timestamptz not null default now()
);
alter table public.cafe_bookings enable row level security;
alter table public.cafe_inquiries enable row level security;
revoke all on public.cafe_bookings from anon, authenticated;
revoke all on public.cafe_inquiries from anon, authenticated;
grant insert on public.cafe_bookings to anon;
grant insert on public.cafe_inquiries to anon;
drop policy if exists "Public can submit booking requests" on public.cafe_bookings;
create policy "Public can submit booking requests" on public.cafe_bookings for insert to anon with check (true);
drop policy if exists "Public can submit cafe inquiries" on public.cafe_inquiries;
create policy "Public can submit cafe inquiries" on public.cafe_inquiries for insert to anon with check (true);
