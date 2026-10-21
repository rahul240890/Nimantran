-- Offer pictures: each offer on the site can carry one of the painted occasion tiles
-- (public/occasions), such as the diya for a Diwali offer or the mandap for a wedding
-- season offer. Empty picks the festival painting. Additive only, safe on the live database.

alter table public.coupons
  add column if not exists art text
    check (art in (
      'wedding', 'engagement', 'haldi', 'mehendi', 'sangeet', 'anniversary', 'birthday',
      'baby', 'housewarming', 'party', 'festival', 'business'
    ));
