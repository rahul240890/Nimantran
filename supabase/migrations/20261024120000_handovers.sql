-- Hand-over links (update 5; owner, 2026-10-24: "we'll make it for you"). Shubh makes an
-- invitation for a family in its own account, then sends them a link; whoever opens it and
-- signs in becomes the invite's owner, so they pay for it, send it and keep the guest list
-- and replies. Additive and safe on the live database: a new table, two new functions, and
-- the rule that keeps an invite's owner now lets the database's own functions move it.

create table if not exists public.event_handovers (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events on delete cascade,
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  created_by uuid not null references public.profiles on delete cascade,
  created_at timestamptz not null default now(),
  -- A link left unused stops working after a month
  expires_at timestamptz not null default now() + interval '30 days',
  claimed_by uuid references public.profiles on delete set null,
  claimed_at timestamptz
);

create index if not exists event_handovers_event_idx on public.event_handovers (event_id);

-- Only the admin pages (the service role) and the two functions below use it
alter table public.event_handovers enable row level security;

-- An invite still keeps its owner when someone edits it; only the database's own functions
-- (claim_handover below, running as their owner) or the service role may move it.
create or replace function public.keep_event_owner()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.owner_id <> old.owner_id and current_user in ('anon', 'authenticated') then
    raise exception 'an event keeps its owner' using errcode = '42501';
  end if;
  return new;
end;
$$;

-- What a hand-over link shows before it is taken: the invite's occasion, design and names.
-- Anyone with the link may see it, signed in or not; a used or expired link shows nothing.
create or replace function public.handover_preview(p_token text)
returns table (
  event_id uuid, category_id text, template_id text, tradition_id text, suite text,
  content jsonb, status text
)
language sql
stable
security definer
set search_path = ''
as $$
  select e.id, e.category_id, e.template_id, e.tradition_id, e.religious ->> 'suite',
    e.content, e.status
  from public.event_handovers h
  join public.events e on e.id = h.event_id
  where h.token = p_token and h.claimed_at is null and h.expires_at > now();
$$;

-- Taking a hand-over link: the signed-in person becomes the owner, whoever made the invite
-- leaves it, and the link (with any other open link for the same invite) stops working.
create or replace function public.claim_handover(p_token text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := (select auth.uid());
  handover public.event_handovers;
  previous uuid;
begin
  if me is null then
    raise exception 'sign in to take the invite' using errcode = '42501';
  end if;

  select * into handover from public.event_handovers
  where token = p_token and claimed_at is null and expires_at > now()
  for update;
  if not found then
    raise exception 'this link has been used or has expired' using errcode = 'P0002';
  end if;

  select owner_id into previous from public.events where id = handover.event_id for update;
  if previous = me then
    raise exception 'this invite is already yours' using errcode = 'SH001';
  end if;

  update public.events set owner_id = me where id = handover.event_id;
  -- The maker leaves; a co-host taking it over becomes its owner instead
  delete from public.event_hosts
  where event_id = handover.event_id and user_id in (previous, me);
  insert into public.event_hosts (event_id, user_id, role, added_by)
  values (handover.event_id, me, 'owner', previous);

  update public.event_handovers set claimed_by = me, claimed_at = now() where id = handover.id;
  delete from public.event_handovers
  where event_id = handover.event_id and claimed_at is null;
  return handover.event_id;
end;
$$;

revoke execute on function public.handover_preview(text) from public;
revoke execute on function public.claim_handover(text) from public;
grant execute on function public.handover_preview(text) to anon, authenticated;
grant execute on function public.claim_handover(text) to authenticated;
