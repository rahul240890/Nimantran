-- Three packages per invite (docs/PRICING.md): Basic, Celebration and Grand replace the
-- Premium, Royal and Wedding bundle editions. A package is priced on the invite's design,
-- so each invite also keeps the dearest design tier it has paid for.
--
-- Invites that already paid keep what they bought: Premium becomes Celebration (for
-- Premium designs), Royal and the Wedding bundle become Grand (for every design).

-- Each invite's design tier, and each order's, before the package ids change
alter table public.event_plans
  add column if not exists design_tier text not null default 'royal'
    check (design_tier in ('free', 'premium', 'royal'));
update public.event_plans set design_tier = 'premium' where plan_id = 'premium';

alter table public.orders
  add column if not exists design_tier text not null default 'royal'
    check (design_tier in ('free', 'premium', 'royal'));
alter table public.orders
  add column if not exists from_design_tier text not null default 'free'
    check (from_design_tier in ('free', 'premium', 'royal'));
update public.orders set design_tier = 'premium' where plan_id = 'premium';
update public.orders set from_design_tier = case from_plan_id
  when 'free' then 'free'
  when 'premium' then 'premium'
  else 'royal'
end;

-- The package ids
alter table public.event_plans drop constraint if exists event_plans_plan_id_check;
alter table public.orders drop constraint if exists orders_plan_id_check;
alter table public.orders drop constraint if exists orders_from_plan_id_check;
alter table public.coupons drop constraint if exists coupons_plan_ids_check;

update public.event_plans set plan_id = case plan_id
  when 'premium' then 'celebration'
  when 'royal' then 'grand'
  when 'bundle' then 'grand'
  else plan_id
end;
update public.orders set plan_id = case plan_id
  when 'premium' then 'celebration'
  when 'royal' then 'grand'
  when 'bundle' then 'grand'
  else plan_id
end;
update public.orders set from_plan_id = case from_plan_id
  when 'premium' then 'celebration'
  when 'royal' then 'grand'
  when 'bundle' then 'grand'
  else from_plan_id
end;
update public.coupons set plan_ids = coalesce((
  select array_agg(distinct case p
    when 'premium' then 'celebration'
    when 'royal' then 'grand'
    when 'bundle' then 'grand'
    else p
  end)
  from unnest(plan_ids) as p
), '{}');

alter table public.event_plans add constraint event_plans_plan_id_check
  check (plan_id in ('basic', 'celebration', 'grand'));
alter table public.orders add constraint orders_plan_id_check
  check (plan_id in ('basic', 'celebration', 'grand'));
alter table public.orders add constraint orders_from_plan_id_check
  check (from_plan_id in ('free', 'basic', 'celebration', 'grand'));
alter table public.coupons add constraint coupons_plan_ids_check
  check (plan_ids <@ array['basic', 'celebration', 'grand']::text[]);

-- Co-hosts each package includes, or null for no limit (Free and Basic 1, Celebration 3)
create or replace function public.cohost_limit(p_event uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when not public.checkout_enabled() then null
    else case coalesce((select plan_id from public.event_plans where event_id = p_event), 'free')
      when 'free' then 1
      when 'basic' then 1
      when 'celebration' then 3
      else null
    end
  end;
$$;
