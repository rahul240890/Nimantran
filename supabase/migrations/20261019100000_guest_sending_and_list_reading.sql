-- Sending from the guest list, and reading guest lists with AI (owner, 2026-10-19).
-- Additive only, so it is safe to run on the live database. Until it runs, the guest list
-- reads without sent_at (nobody shows as sent) and reading lists with AI is refused.

-- When a host last sent this guest their invitation from WhatsApp, so the list can show
-- who is still to be sent and "Send to many" can pick up where the host left off
alter table public.guests add column if not exists sent_at timestamptz;

-- How many pages (photos or files) each invite has had read by AI: one free page on every
-- package, 30 on Grand. Counted before the model is asked, like wording drafts.
create table if not exists public.list_readings (
  event_id uuid primary key references public.events on delete cascade,
  used integer not null default 0 check (used >= 0),
  updated_at timestamptz not null default now()
);
-- Only the server (the service role) reads or writes it
alter table public.list_readings enable row level security;
revoke all on public.list_readings from anon, authenticated;

-- Takes `pages` pages for an invite if that keeps it within `allowed`. Returns how many the
-- invite has used after them, or null when there isn't room.
create or replace function public.use_list_pages(target uuid, pages integer, allowed integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  count integer;
begin
  if pages < 1 then
    return null;
  end if;
  insert into public.list_readings (event_id, used) values (target, 0)
    on conflict (event_id) do nothing;
  update public.list_readings
    set used = used + pages, updated_at = now()
    where event_id = target and used + pages <= allowed
    returning used into count;
  return count;
end;
$$;
revoke all on function public.use_list_pages(uuid, integer, integer) from public, anon, authenticated;
