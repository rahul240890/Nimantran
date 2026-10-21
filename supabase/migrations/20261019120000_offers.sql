-- Offers: coupons the site shows. Each coupon gets a short description and its terms for
-- the offers page, who may use it (everyone, a first booking only, or people who have
-- booked before), which designs it covers (by tier, by named design, or every design),
-- how many times one account may use it, and whether it shows on the offers page and on
-- the home page. Checkout checks all of it on the server.
-- Additive only (new columns with defaults that keep every coupon working as before), so
-- it is safe to run on the live database.

alter table public.coupons
  add column if not exists description text not null default ''
    check (char_length(description) <= 200),
  add column if not exists terms text not null default ''
    check (char_length(terms) <= 2000),
  add column if not exists audience text not null default 'everyone'
    check (audience in ('everyone', 'first-order', 'returning')),
  -- Design tiers and named designs it covers; both empty means every design
  add column if not exists design_tiers text[] not null default '{}'
    check (design_tiers <@ array['free', 'premium', 'royal', 'signature']::text[]),
  add column if not exists design_ids text[] not null default '{}'
    check (cardinality(design_ids) <= 300),
  add column if not exists per_user_limit integer check (per_user_limit > 0),
  add column if not exists show_on_site boolean not null default false,
  add column if not exists featured boolean not null default false,
  add column if not exists updated_at timestamptz;

-- Only an offer on the offers page can be on the home page
alter table public.coupons drop constraint if exists coupons_featured_shown;
alter table public.coupons add constraint coupons_featured_shown
  check (not featured or show_on_site);

-- The longer title the offers page shows
alter table public.coupons drop constraint if exists coupons_label_check;
alter table public.coupons add constraint coupons_label_check
  check (char_length(label) <= 80);

-- How many times each person has used a coupon, read by checkout
create index if not exists orders_user_coupon_idx on public.orders (user_id, coupon_id)
  where coupon_id is not null;
