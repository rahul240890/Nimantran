-- Step 12s part 4: AI-written wording. Counts the drafts each invite has asked for, so a
-- Free invite gets its three and a paid edition as many as it likes. Additive only (one
-- table and one function), so it is safe to run on the live database.

create table if not exists public.wording_drafts (
  event_id uuid primary key references public.events on delete cascade,
  used integer not null default 0 check (used >= 0),
  updated_at timestamptz not null default now()
);
-- Only the server (the service role) reads or writes it
alter table public.wording_drafts enable row level security;
revoke all on public.wording_drafts from anon, authenticated;

-- Takes one draft for an invite if it has any left under `free`, or always when `free` is
-- null (a paid edition). Returns how many the invite has used, or null when none are left.
create or replace function public.use_wording_draft(target uuid, free integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  count integer;
begin
  insert into public.wording_drafts (event_id, used) values (target, 0)
    on conflict (event_id) do nothing;
  update public.wording_drafts
    set used = used + 1, updated_at = now()
    where event_id = target and (free is null or used < free)
    returning used into count;
  return count;
end;
$$;
revoke all on function public.use_wording_draft(uuid, integer) from public, anon, authenticated;
