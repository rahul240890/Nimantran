-- Signature designs (docs/PRICING.md): the moving scenes, painted in layers that move like a
-- short film, cost more than Royal. Invites and orders can now keep 'signature' as the
-- design tier they paid for.

alter table public.event_plans drop constraint if exists event_plans_design_tier_check;
alter table public.event_plans
  add constraint event_plans_design_tier_check
    check (design_tier in ('free', 'premium', 'royal', 'signature'));

alter table public.orders drop constraint if exists orders_design_tier_check;
alter table public.orders
  add constraint orders_design_tier_check
    check (design_tier in ('free', 'premium', 'royal', 'signature'));

alter table public.orders drop constraint if exists orders_from_design_tier_check;
alter table public.orders
  add constraint orders_from_design_tier_check
    check (from_design_tier in ('free', 'premium', 'royal', 'signature'));
