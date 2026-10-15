-- Emails the site sends (welcome, payment receipt, unfinished-draft reminder). One row per
-- email, so each is sent once however many times the trigger fires. Written and read only
-- by the server (service role): no policies, so signed-in connections see nothing.
create table if not exists public.email_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  kind text not null check (kind in ('welcome', 'receipt', 'draft_reminder')),
  -- What the email was about: the account for a welcome, the order for a receipt, the
  -- invite for a reminder
  ref text not null check (char_length(ref) <= 80),
  -- The sending service's id for the message, for tracing a bounce
  provider_id text,
  created_at timestamptz not null default now(),
  unique (kind, ref)
);
create index if not exists email_log_user_idx on public.email_log (user_id, created_at desc);
alter table public.email_log enable row level security;

-- People who used "Stop these emails" on a reminder. Receipts still go to them.
create table if not exists public.email_opt_outs (
  user_id uuid primary key references auth.users on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.email_opt_outs enable row level security;
