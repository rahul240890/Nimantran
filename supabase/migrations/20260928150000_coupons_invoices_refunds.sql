-- Step 17, part 2: coupons and festival offers, GST invoice numbers and refunds.
-- Additive only (one new table, new columns on orders, one sequence and two functions),
-- so it is safe to run on the live database.

-- A coupon takes a percentage or a fixed amount off an edition. A festival offer is a
-- coupon that applies by itself (auto_apply) between its dates, with no code to type.
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z0-9]{3,20}$'),
  label text not null default '' check (char_length(label) <= 60),
  percent_off integer check (percent_off between 1 and 90),
  amount_off_paise integer check (amount_off_paise > 0),
  -- Editions it applies to; empty means every paid edition
  plan_ids text[] not null default '{}'
    check (plan_ids <@ array['premium', 'royal', 'bundle']::text[]),
  auto_apply boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  max_uses integer check (max_uses > 0),
  used_count integer not null default 0 check (used_count >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users on delete set null,
  check ((percent_off is null) <> (amount_off_paise is null)),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);
alter table public.coupons enable row level security;

drop policy if exists "Admins read coupons" on public.coupons;
create policy "Admins read coupons" on public.coupons
  for select to authenticated using ((select public.is_admin()));
drop policy if exists "Admins add coupons" on public.coupons;
create policy "Admins add coupons" on public.coupons
  for insert to authenticated with check ((select public.is_admin()));
drop policy if exists "Admins change coupons" on public.coupons;
create policy "Admins change coupons" on public.coupons
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
revoke all on public.coupons from anon;

-- What each order paid before and after its coupon, its invoice and any refund
alter table public.orders
  add column if not exists list_price_paise integer check (list_price_paise > 0),
  add column if not exists discount_paise integer not null default 0 check (discount_paise >= 0),
  add column if not exists coupon_id uuid references public.coupons on delete set null,
  add column if not exists invoice_no text unique,
  add column if not exists refund_id text,
  add column if not exists refunded_at timestamptz;

-- Invoice numbers run without gaps per financial year (April to March), as GST asks:
-- SHUBH/2026-27/00001. Given once, when an order is paid; only the server calls this.
create table if not exists public.invoice_counters (
  financial_year text primary key,
  last_no integer not null default 0
);
alter table public.invoice_counters enable row level security;
revoke all on public.invoice_counters from anon, authenticated;

create or replace function public.assign_invoice_no(p_order uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing text;
  paid timestamptz;
  ist date;
  fy text;
  n integer;
begin
  select invoice_no, coalesce(paid_at, now()) into existing, paid
  from public.orders where id = p_order for update;
  if not found then
    raise exception 'no such order' using errcode = 'P0002';
  end if;
  if existing is not null then
    return existing;
  end if;
  ist := (paid at time zone 'Asia/Kolkata')::date;
  fy := case
    when extract(month from ist) >= 4
      then extract(year from ist)::int || '-' || lpad(((extract(year from ist)::int + 1) % 100)::text, 2, '0')
    else (extract(year from ist)::int - 1) || '-' || lpad((extract(year from ist)::int % 100)::text, 2, '0')
  end;
  insert into public.invoice_counters as c (financial_year, last_no) values (fy, 1)
  on conflict (financial_year) do update set last_no = c.last_no + 1
  returning last_no into n;
  existing := 'SHUBH/' || fy || '/' || lpad(n::text, 5, '0');
  update public.orders set invoice_no = existing where id = p_order;
  return existing;
end;
$$;

-- A coupon counts as used once its order is paid
create or replace function public.use_coupon(p_coupon uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.coupons set used_count = used_count + 1 where id = p_coupon;
$$;

revoke all on function public.assign_invoice_no(uuid) from public, anon, authenticated;
revoke all on function public.use_coupon(uuid) from public, anon, authenticated;
grant execute on function public.assign_invoice_no(uuid) to service_role;
grant execute on function public.use_coupon(uuid) to service_role;
