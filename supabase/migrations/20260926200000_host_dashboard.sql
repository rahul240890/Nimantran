-- Step 11: the host dashboard and co-hosts. Additive only (two new columns, one check
-- replaced by a looser one, three new functions), so it is safe to run on the live
-- database.
--
-- Co-hosts join through a private link the owner sends them (on WhatsApp, usually), not
-- by phone number: the other family often signs in with a different number or with
-- Google. The link is single-use and the owner can withdraw it.

-- An invitation link needs no phone or email; the owner names who it is for instead
alter table public.event_host_invites drop constraint if exists event_host_invites_check;
alter table public.event_host_invites
  add column if not exists label text not null default '' check (char_length(label) <= 40);

-- When a host last sent this guest a reminder, so the list can say so
alter table public.guests add column if not exists reminded_at timestamptz;

-- What the join page shows before someone accepts: whose invite, and who asked.
-- Null once the link has been used or withdrawn.
create or replace function public.host_invite_preview(p_token text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'event_id', e.id,
    'category_id', e.category_id,
    'template_id', e.template_id,
    'content', e.content,
    'label', i.label,
    'invited_by', coalesce(nullif(p.name, ''), '')
  )
  from public.event_host_invites i
  join public.events e on e.id = i.event_id
  left join public.profiles p on p.id = i.invited_by
  where i.token = p_token and i.accepted_at is null;
$$;

-- The signed-in person becomes a co-host of the invite the link is for. Returns the
-- event id, or raises when the link is unknown or already used.
create or replace function public.accept_host_invite(p_token text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := (select auth.uid());
  invite public.event_host_invites;
begin
  if me is null then
    raise exception 'sign in to accept' using errcode = '42501';
  end if;

  select * into invite from public.event_host_invites
  where token = p_token and accepted_at is null
  for update;
  if not found then
    raise exception 'this link has been used or withdrawn' using errcode = 'P0002';
  end if;

  -- Someone who already hosts the invite (the owner opening their own link) stays as they are
  insert into public.event_hosts (event_id, user_id, role, side, added_by)
  values (invite.event_id, me, 'cohost', nullif(invite.label, ''), invite.invited_by)
  on conflict (event_id, user_id) do nothing;

  update public.event_host_invites set accepted_at = now() where id = invite.id;
  return invite.event_id;
end;
$$;

-- The hosts of an invite with their names, for its hosts only. Profiles are readable by
-- co-hosts already; this saves the app a join and returns nothing to anyone else.
create or replace function public.event_host_list(p_event uuid)
returns table (user_id uuid, name text, role text, side text, created_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select h.user_id, coalesce(p.name, ''), h.role, coalesce(h.side, ''), h.created_at
  from public.event_hosts h
  left join public.profiles p on p.id = h.user_id
  where h.event_id = p_event and public.is_event_host(p_event)
  order by h.role = 'owner' desc, h.created_at;
$$;

revoke execute on function public.host_invite_preview(text) from public;
revoke execute on function public.accept_host_invite(text) from public;
revoke execute on function public.event_host_list(uuid) from public;
grant execute on function public.host_invite_preview(text) to anon, authenticated;
grant execute on function public.accept_host_invite(text) to authenticated;
grant execute on function public.event_host_list(uuid) to authenticated;
