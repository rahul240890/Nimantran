-- Steps 15 to 17: the master admin, payment settings, orders and each invite's edition.
-- Additive only (new tables and functions), so it is safe to run on the live database.
--
-- Payment keys never live here: the Razorpay key secret and webhook secret stay in the
-- server's environment variables (Vercel). This database keeps only what is safe to show
-- an admin: whether checkout is on, and the orders themselves.

-- Who may open /admin. Nobody can add themselves: rows are written by the owner in the
-- Supabase SQL Editor (or the server), never through the app's signed-in connection.
create table if not exists public.admins (
  user_id uuid primary key references auth.users on delete cascade,
  role text not null default 'admin' check (role in ('owner', 'admin')),
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

drop policy if exists "Admins see their own admin row" on public.admins;
create policy "Admins see their own admin row" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

-- Security definer so other tables' policies can ask without reading admins directly
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

-- Site-wide settings an admin changes from /admin, one JSON value per key
create table if not exists public.app_settings (
  key text primary key check (key ~ '^[a-z][a-z0-9_]{0,39}$'),
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null
);
alter table public.app_settings enable row level security;

drop policy if exists "Admins read settings" on public.app_settings;
create policy "Admins read settings" on public.app_settings
  for select to authenticated using ((select public.is_admin()));
drop policy if exists "Admins add settings" on public.app_settings;
create policy "Admins add settings" on public.app_settings
  for insert to authenticated with check ((select public.is_admin()));
drop policy if exists "Admins change settings" on public.app_settings;
create policy "Admins change settings" on public.app_settings
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- Whether hosts can pay, and so whether editions apply. Anyone may ask (guest pages
-- decide on the watermark with it); off until an admin turns checkout on.
create or replace function public.checkout_enabled()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select (value ->> 'checkoutEnabled')::boolean from public.app_settings where key = 'payments'),
    false
  );
$$;

-- One payment for an edition of one invite. Written only by the server (service role)
-- after it has checked the payment with Razorpay; hosts and admins only read. Kept when
-- the invite or account goes, for receipts and tax records.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events on delete set null,
  user_id uuid references auth.users on delete set null,
  plan_id text not null check (plan_id in ('premium', 'royal', 'bundle')),
  -- The edition the invite had before, when this pays the difference
  from_plan_id text not null default 'free' check (from_plan_id in ('free', 'premium', 'royal', 'bundle')),
  amount_paise integer not null check (amount_paise > 0),
  currency text not null default 'INR' check (currency = 'INR'),
  status text not null default 'created' check (status in ('created', 'paid', 'failed', 'refunded')),
  provider_order_id text not null unique,
  provider_payment_id text unique,
  mode text not null check (mode in ('test', 'live')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create index if not exists orders_event_id_idx on public.orders (event_id);
create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
alter table public.orders enable row level security;

drop policy if exists "People read their own orders, admins read all" on public.orders;
create policy "People read their own orders, admins read all" on public.orders
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

-- Each invite's edition. No row means Free. Written only by the server.
create table if not exists public.event_plans (
  event_id uuid primary key references public.events on delete cascade,
  plan_id text not null check (plan_id in ('premium', 'royal', 'bundle')),
  source text not null check (source in ('purchase', 'admin')),
  order_id uuid references public.orders on delete set null,
  updated_at timestamptz not null default now()
);
alter table public.event_plans enable row level security;

drop policy if exists "Hosts and admins read an invite's edition" on public.event_plans;
create policy "Hosts and admins read an invite's edition" on public.event_plans
  for select to authenticated
  using ((select public.is_event_host(event_id)) or (select public.is_admin()));

-- The edition of a published invite, for its guest page (the watermark): 'free' when
-- none was bought, null when there is no such published invite.
create or replace function public.published_invite_plan(p_slug text)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(p.plan_id, 'free')
  from public.events e
  left join public.event_plans p on p.event_id = e.id
  where e.slug = p_slug and e.status = 'published';
$$;

revoke all on function public.published_invite_plan(text) from public;
grant execute on function public.published_invite_plan(text) to anon, authenticated;
grant execute on function public.checkout_enabled() to anon, authenticated;
grant execute on function public.is_admin() to authenticated;

-- The app's signed-in connection never writes these three; the server does, as itself
revoke insert, update, delete on public.admins from anon, authenticated;
revoke insert, update, delete on public.orders from anon, authenticated;
revoke insert, update, delete on public.event_plans from anon, authenticated;
revoke all on public.app_settings from anon;
