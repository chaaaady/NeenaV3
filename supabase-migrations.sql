-- ============================================
-- NEENA SUPABASE DATABASE SCHEMA
-- Instructions: Exécuter ce script dans Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CREATION DES TABLES
-- ============================================

-- Table: mosques
create table if not exists public.mosques (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  email text unique not null,
  created_at timestamptz default now(),
  is_active boolean default true
);

-- Table: donations
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  mosque_id uuid references public.mosques(id) on delete cascade,
  stripe_payment_intent_id text unique not null,
  amount_base numeric(10,2) not null,
  amount_fees numeric(10,2) default 0,
  amount_total numeric(10,2) not null,
  currency text default 'eur',
  status text not null,
  frequency text,
  donation_type text,
  donor_email text,
  donor_first_name text,
  donor_last_name text,
  donor_address text,
  wants_receipt boolean default false,
  cover_fees boolean default false,
  metadata jsonb,
  stripe_created_at timestamptz,
  created_at timestamptz default now()
);

-- Table: qr_codes
create table if not exists public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  mosque_id uuid references public.mosques(id) on delete cascade,
  code text unique not null,
  location text,
  scan_count integer default 0,
  created_at timestamptz default now()
);

-- Table: qr_scans
create table if not exists public.qr_scans (
  id uuid primary key default gen_random_uuid(),
  qr_code_id uuid references public.qr_codes(id) on delete cascade,
  scanned_at timestamptz default now(),
  converted boolean default false,
  donation_id uuid references public.donations(id) on delete set null
);

-- ============================================
-- 2. CREATION DES INDEX
-- ============================================

create index if not exists idx_donations_mosque on public.donations(mosque_id);
create index if not exists idx_donations_status on public.donations(status);
create index if not exists idx_donations_stripe_intent on public.donations(stripe_payment_intent_id);
create index if not exists idx_donations_created_at on public.donations(created_at desc);
create index if not exists idx_qr_codes_mosque on public.qr_codes(mosque_id);

-- ============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
alter table public.mosques enable row level security;
alter table public.donations enable row level security;
alter table public.qr_codes enable row level security;
alter table public.qr_scans enable row level security;

-- Drop existing policies if they exist (pour réexécution)
drop policy if exists "Admins see all mosques" on public.mosques;
drop policy if exists "Mosques see own data" on public.mosques;
drop policy if exists "Admins see all donations" on public.donations;
drop policy if exists "Mosques see own donations" on public.donations;
drop policy if exists "Admins see all qr_codes" on public.qr_codes;
drop policy if exists "Mosques see own qr_codes" on public.qr_codes;

-- Policy: Admin Neena voit tout
create policy "Admins see all mosques"
  on public.mosques for select
  using (
    (auth.jwt() ->> 'role')::text = 'admin'
    or
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );

-- Policy: Mosquée voit seulement ses données
create policy "Mosques see own data"
  on public.mosques for select
  using (auth.uid() = id);

-- Policy: Admin voit toutes les donations
create policy "Admins see all donations"
  on public.donations for select
  using (
    (auth.jwt() ->> 'role')::text = 'admin'
    or
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );

-- Policy: Mosquée voit ses donations
create policy "Mosques see own donations"
  on public.donations for select
  using (
    mosque_id in (
      select id from public.mosques where auth.uid() = id
    )
  );

-- Policy: Admin voit tous les QR codes
create policy "Admins see all qr_codes"
  on public.qr_codes for select
  using (
    (auth.jwt() ->> 'role')::text = 'admin'
    or
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );

-- Policy: Mosquée voit ses QR codes
create policy "Mosques see own qr_codes"
  on public.qr_codes for select
  using (
    mosque_id in (
      select id from public.mosques where auth.uid() = id
    )
  );

-- ============================================
-- 4. FONCTION D'AUTHENTIFICATION
-- ============================================

-- Drop existing function if exists
drop function if exists public.handle_new_user() cascade;

-- Fonction pour associer les utilisateurs aux mosquées
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Associer l'email du nouvel utilisateur à une mosquée existante
  update public.mosques
  set id = new.id
  where email = new.email
  and id != new.id;
  
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if exists
drop trigger if exists on_auth_user_created on auth.users;

-- Trigger sur création d'utilisateur
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 5. DONNÉES DE TEST (OPTIONNEL)
-- ============================================

-- Insérer une mosquée de test (Créteil)
insert into public.mosques (slug, name, email, is_active)
values ('mosquee-sahaba-creteil', 'Mosquée Sahaba Créteil', 'creteil@neena.fr', true)
on conflict (slug) do nothing;

-- ============================================
-- FIN DU SCRIPT
-- ============================================

-- Pour vérifier que tout est bien créé:
-- select * from public.mosques;
-- select tablename from pg_tables where schemaname = 'public';







