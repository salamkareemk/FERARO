-- =============== FERARO ADMIN - SUPABASE SETUP ===============
-- Run this once in Supabase dashboard > SQL Editor > New query.

-- Cakes added from the admin dashboard
create table if not exists public.cakes (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('products', 'new', 'custom', 'gallery')),
  name text not null default '',
  description text not null default '',
  price numeric(10, 2),
  category text,
  occasion text,
  shape text not null default 'square' check (shape in ('square', 'wide', 'tall')),
  image_url text not null,
  image_path text not null,
  created_at timestamptz not null default now()
);

alter table public.cakes enable row level security;

-- Everyone can see the cakes; only signed-in admins can change them
drop policy if exists "Anyone can view cakes" on public.cakes;
create policy "Anyone can view cakes"
  on public.cakes for select
  using (true);

drop policy if exists "Admins can add cakes" on public.cakes;
create policy "Admins can add cakes"
  on public.cakes for insert to authenticated
  with check (true);

drop policy if exists "Admins can edit cakes" on public.cakes;
create policy "Admins can edit cakes"
  on public.cakes for update to authenticated
  using (true) with check (true);

drop policy if exists "Admins can delete cakes" on public.cakes;
create policy "Admins can delete cakes"
  on public.cakes for delete to authenticated
  using (true);

-- Public photo bucket (max 5 MB, images only)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cakes', 'cakes', true, 5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

drop policy if exists "Anyone can view cake photos" on storage.objects;
create policy "Anyone can view cake photos"
  on storage.objects for select
  using (bucket_id = 'cakes');

drop policy if exists "Admins can upload cake photos" on storage.objects;
create policy "Admins can upload cake photos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'cakes');

drop policy if exists "Admins can delete cake photos" on storage.objects;
create policy "Admins can delete cake photos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'cakes');
