-- Sign-in by a code sent to an email address (owner, 2026-10-25). The site makes each code
-- with Supabase and sends it through Resend; every code sent is claimed in email_log first
-- (kind 'sign_in_code', ref '<hash of the address>:<half-minute>') so the site can limit how
-- often codes go out. Only widens a check, so it is safe to run on the live database.

alter table public.email_log drop constraint if exists email_log_kind_check;
alter table public.email_log add constraint email_log_kind_check
  check (kind in ('welcome', 'receipt', 'draft_reminder', 'discover', 'sign_in_code'));
