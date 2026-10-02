-- Co-hosts, part 2: what each co-host may do, a WhatsApp number on their link, and how many
-- co-hosts each edition includes. Additive only (two new columns, new functions, policies
-- replaced by ones that still let every existing co-host do what they did), so it is safe
-- to run on the live database.
--
-- Two kinds of co-host:
--   edit   — edits the invite (wording, design, functions, photos, publishing) and runs
--            the guest list. Everyone who joined before this migration keeps this.
--   guests — runs the guest list and replies only; the card stays as the owner made it.
-- Neither can delete the invite, pay for it, add or remove co-hosts, or remove the owner.

alter table public.event_hosts
  add column if not exists access text not null default 'edit'
  check (access in ('edit', 'guests'));
alter table public.event_host_invites
  add column if not exists access text not null default 'edit'
  check (access in ('edit', 'guests'));
-- The phone column (from the first migration) holds the WhatsApp number the link was sent to

-- Whether the signed-in person may change the invite itself: the owner, or a co-host
-- with edit access. Security definer so policies can ask without recursing.
create or replace function public.can_edit_event(target uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.event_hosts
    where event_id = target and user_id = (select auth.uid())
      and (role = 'owner' or access = 'edit')
  );
$$;

-- The invite itself: every host reads it, only editors change it
drop policy if exists "Hosts edit their events" on public.events;
create policy "Hosts edit their events" on public.events
  for update to authenticated
  using (public.can_edit_event(id)) with check (public.can_edit_event(id));

-- Functions, the RSVP's questions and photos are part of the card: hosts read them,
-- editors change them. Guests, replies and scheduled sends stay with every host.
drop policy if exists "Hosts manage functions" on public.functions;
drop policy if exists "Hosts read functions" on public.functions;
drop policy if exists "Editors add functions" on public.functions;
drop policy if exists "Editors change functions" on public.functions;
drop policy if exists "Editors remove functions" on public.functions;
create policy "Hosts read functions" on public.functions
  for select to authenticated using (public.is_event_host(event_id));
create policy "Editors add functions" on public.functions
  for insert to authenticated with check (public.can_edit_event(event_id));
create policy "Editors change functions" on public.functions
  for update to authenticated
  using (public.can_edit_event(event_id)) with check (public.can_edit_event(event_id));
create policy "Editors remove functions" on public.functions
  for delete to authenticated using (public.can_edit_event(event_id));

drop policy if exists "Hosts manage RSVP questions" on public.rsvp_questions;
drop policy if exists "Hosts read RSVP questions" on public.rsvp_questions;
drop policy if exists "Editors add RSVP questions" on public.rsvp_questions;
drop policy if exists "Editors change RSVP questions" on public.rsvp_questions;
drop policy if exists "Editors remove RSVP questions" on public.rsvp_questions;
create policy "Hosts read RSVP questions" on public.rsvp_questions
  for select to authenticated using (public.is_event_host(event_id));
create policy "Editors add RSVP questions" on public.rsvp_questions
  for insert to authenticated with check (public.can_edit_event(event_id));
create policy "Editors change RSVP questions" on public.rsvp_questions
  for update to authenticated
  using (public.can_edit_event(event_id)) with check (public.can_edit_event(event_id));
create policy "Editors remove RSVP questions" on public.rsvp_questions
  for delete to authenticated using (public.can_edit_event(event_id));

drop policy if exists "Hosts manage media" on public.media;
drop policy if exists "Hosts read media" on public.media;
drop policy if exists "Editors add media" on public.media;
drop policy if exists "Editors change media" on public.media;
drop policy if exists "Editors remove media" on public.media;
create policy "Hosts read media" on public.media
  for select to authenticated using (public.is_event_host(event_id));
create policy "Editors add media" on public.media
  for insert to authenticated with check (public.can_edit_event(event_id));
create policy "Editors change media" on public.media
  for update to authenticated
  using (public.can_edit_event(event_id)) with check (public.can_edit_event(event_id));
create policy "Editors remove media" on public.media
  for delete to authenticated using (public.can_edit_event(event_id));

drop policy if exists "Hosts upload their event media" on storage.objects;
create policy "Hosts upload their event media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'event-media' and public.can_edit_event(public.media_event_id(name)));
drop policy if exists "Hosts replace their event media" on storage.objects;
create policy "Hosts replace their event media" on storage.objects
  for update to authenticated
  using (bucket_id = 'event-media' and public.can_edit_event(public.media_event_id(name)));
drop policy if exists "Hosts delete their event media" on storage.objects;
create policy "Hosts delete their event media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'event-media' and public.can_edit_event(public.media_event_id(name)));

-- The owner may change what a co-host can do, but never make them an owner (unchanged
-- from the first migration; repeated here so the rule sits beside the new column)
drop policy if exists "Owners update co-hosts" on public.event_hosts;
create policy "Owners update co-hosts" on public.event_hosts
  for update to authenticated
  using (public.is_event_owner(event_id) and role = 'cohost')
  with check (public.is_event_owner(event_id) and role = 'cohost');

-- How many co-hosts an invite's edition includes, or null for no limit. Editions only
-- apply once an admin has turned checkout on (docs/PRICING.md: Free 1, Premium 3).
create or replace function public.cohost_limit(p_event uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when not public.checkout_enabled() then null
    else case coalesce((select plan_id from public.event_plans where event_id = p_event), 'free')
      when 'free' then 1
      when 'premium' then 3
      else null
    end
  end;
$$;

-- What the join page shows before someone accepts, now with what they'll be able to do
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
    'access', i.access,
    'invited_by', coalesce(nullif(p.name, ''), '')
  )
  from public.event_host_invites i
  join public.events e on e.id = i.event_id
  left join public.profiles p on p.id = i.invited_by
  where i.token = p_token and i.accepted_at is null;
$$;

-- Accepting a link: the co-host gets the access the owner chose, while the edition has
-- room. A full invite keeps the link, so it works once the owner upgrades or removes
-- someone.
create or replace function public.accept_host_invite(p_token text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := (select auth.uid());
  invite public.event_host_invites;
  room integer;
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

  if not exists (
    select 1 from public.event_hosts where event_id = invite.event_id and user_id = me
  ) then
    room := public.cohost_limit(invite.event_id);
    if room is not null and (
      select count(*) from public.event_hosts
      where event_id = invite.event_id and role = 'cohost'
    ) >= room then
      raise exception 'this invite has all the co-hosts its edition includes'
        using errcode = '53400';
    end if;
  end if;

  -- Someone who already hosts the invite (the owner opening their own link) stays as they are
  insert into public.event_hosts (event_id, user_id, role, side, added_by, access)
  values (invite.event_id, me, 'cohost', nullif(invite.label, ''), invite.invited_by, invite.access)
  on conflict (event_id, user_id) do nothing;

  update public.event_host_invites set accepted_at = now() where id = invite.id;
  return invite.event_id;
end;
$$;

-- The hosts of an invite with their names and access, for its hosts only
drop function if exists public.event_host_list(uuid);
create function public.event_host_list(p_event uuid)
returns table (
  user_id uuid, name text, role text, side text, access text, created_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select h.user_id, coalesce(p.name, ''), h.role, coalesce(h.side, ''), h.access, h.created_at
  from public.event_hosts h
  left join public.profiles p on p.id = h.user_id
  where h.event_id = p_event and public.is_event_host(p_event)
  order by h.role = 'owner' desc, h.created_at;
$$;

revoke execute on function public.can_edit_event(uuid) from public;
revoke execute on function public.cohost_limit(uuid) from public;
revoke execute on function public.host_invite_preview(text) from public;
revoke execute on function public.accept_host_invite(text) from public;
revoke execute on function public.event_host_list(uuid) from public;
grant execute on function public.can_edit_event(uuid) to authenticated;
grant execute on function public.cohost_limit(uuid) to authenticated;
grant execute on function public.host_invite_preview(text) to anon, authenticated;
grant execute on function public.accept_host_invite(text) to authenticated;
grant execute on function public.event_host_list(uuid) to authenticated;
