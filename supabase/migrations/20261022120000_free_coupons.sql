-- An offer can take a package's whole price off (100% off, or an amount at least the
-- price). Such an order costs ₹0: it's marked paid at once, with no Razorpay payment.
alter table public.coupons drop constraint if exists coupons_percent_off_check;
alter table public.coupons
  add constraint coupons_percent_off_check check (percent_off between 1 and 100);

alter table public.orders drop constraint if exists orders_amount_paise_check;
alter table public.orders add constraint orders_amount_paise_check check (amount_paise >= 0);
