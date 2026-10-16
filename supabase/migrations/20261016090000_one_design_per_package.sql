-- One payment, one design (owner, 2026-10-16): a package covers the one design it was
-- bought for. Another design needs its own package; a bigger package on the same design
-- still pays only the difference (docs/PRICING.md, section 2).
--
-- design_id is the gallery design's id ("kayal-scene", "card-marigold"). Null on an
-- admin's gift, which covers any design, and on packages bought before this change: the
-- app gives those the design their invite has the first time it reads them.

alter table public.event_plans add column if not exists design_id text;

-- Each order's design, and the design the invite's package was for before it
alter table public.orders add column if not exists design_id text;
alter table public.orders add column if not exists from_design_id text;
