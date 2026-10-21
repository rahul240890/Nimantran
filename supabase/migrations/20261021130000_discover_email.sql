-- The new-designs email: once per account, three days after joining, new painted designs
-- picked for them and the offers running. Logged in email_log like the other emails.
-- Only widens a check, so it is safe to run on the live database.

alter table public.email_log drop constraint if exists email_log_kind_check;
alter table public.email_log add constraint email_log_kind_check
  check (kind in ('welcome', 'receipt', 'draft_reminder', 'discover'));
