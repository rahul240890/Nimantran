-- Step 24: the shared photo wall. Guests add their photos from the event to one album
-- through the invitation's link; the hosts see every photo, hide any of them and download
-- them all. Additive only (one table and three functions), so it is safe to run on the live
-- database.
--
-- Files live in the private event-media bucket as <event id>/wall-<photo id>.<ext>, beside
-- the invite's own photos, so the existing storage rules already let hosts read and delete
-- them and let guests read them while the invite is published. Guests never write to the
-- table or the bucket themselves: the site's server checks the upload, then records it
-- through add_wall_photo(), which only the server's service role may call.

create table if not exists public.wall_photos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events on delete cascade,
  -- The guest's own row when they came by their personal link or had replied
  guest_id uuid references public.guests on delete set null,
  uploader_name text not null default '' check (char_length(uploader_name) <= 80),
  -- A random key the guest's phone keeps, so they can take back their own photos
  device_key text not null check (device_key ~ '^[0-9a-f]{32}$'),
  storage_path text not null unique,
  width integer not null check (width between 1 and 10000),
  height integer not null check (height between 1 and 10000),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists wall_photos_event_idx on public.wall_photos (event_id, created_at);
create index if not exists wall_photos_device_idx on public.wall_photos (event_id, device_key);

alter table public.wall_photos enable row level security;

-- Hosts read every photo, hide or show them, and delete them. Nobody else touches the table.
revoke all on public.wall_photos from anon, authenticated;
grant select, delete on public.wall_photos to authenticated;
grant update (hidden) on public.wall_photos to authenticated;

drop policy if exists "Hosts read their photo wall" on public.wall_photos;
create policy "Hosts read their photo wall" on public.wall_photos
  for select to authenticated using (public.is_event_host(event_id));
drop policy if exists "Hosts hide photos on their wall" on public.wall_photos;
create policy "Hosts hide photos on their wall" on public.wall_photos
  for update to authenticated
  using (public.is_event_host(event_id)) with check (public.is_event_host(event_id));
drop policy if exists "Hosts remove photos from their wall" on public.wall_photos;
create policy "Hosts remove photos from their wall" on public.wall_photos
  for delete to authenticated using (public.is_event_host(event_id));

-- The wall as guests see it: photos the hosts haven't hidden, newest first. `mine` marks
-- the ones this phone added. Empty for drafts and unknown links.
create or replace function public.wall_photos_for(p_slug text, p_device text default '')
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', w.id,
    'path', w.storage_path,
    'width', w.width,
    'height', w.height,
    'name', w.uploader_name,
    'created_at', w.created_at,
    'mine', w.device_key = coalesce(p_device, '')
  ) order by w.created_at desc, w.id), '[]'::jsonb)
  from public.wall_photos w
  join public.events e on e.id = w.event_id
  where e.slug = p_slug and e.status = 'published' and not w.hidden;
$$;

revoke execute on function public.wall_photos_for(text, text) from public;
grant execute on function public.wall_photos_for(text, text) to anon, authenticated;

-- Records one guest photo, before the server stores its file. Checks the invite is live,
-- the file sits in this invite's folder, and the limits: `per_device` photos from one
-- phone and `per_event` on the whole wall. Returns the event's id.
create or replace function public.add_wall_photo(
  p_slug text,
  p_token text,
  p_device text,
  p_name text,
  p_id uuid,
  p_path text,
  p_width integer,
  p_height integer,
  per_device integer default 40,
  per_event integer default 1500
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event uuid;
  v_guest uuid;
  clean_name text := btrim(coalesce(p_name, ''));
begin
  select e.id into v_event
  from public.events e
  where e.slug = p_slug and e.status = 'published';
  if v_event is null then
    raise exception 'invitation not found' using errcode = 'P0002';
  end if;
  if split_part(p_path, '/', 1) <> v_event::text then
    raise exception 'photo is not in this invitation''s folder' using errcode = '42501';
  end if;
  if char_length(clean_name) > 80 then
    raise exception 'name is too long' using errcode = '22023';
  end if;

  -- One wall at a time per invite, so the limits can't be raced
  perform pg_advisory_xact_lock(hashtext('wall:' || v_event::text));
  if (select count(*) from public.wall_photos w where w.event_id = v_event) >= per_event then
    raise exception 'the photo wall is full' using errcode = '54000';
  end if;
  if (select count(*) from public.wall_photos w
      where w.event_id = v_event and w.device_key = p_device) >= per_device then
    raise exception 'this phone has added its share of photos' using errcode = '54001';
  end if;

  if p_token is not null and p_token <> '' then
    select g.id into v_guest from public.guests g
    where g.event_id = v_event and g.token = p_token;
  end if;

  insert into public.wall_photos (
    id, event_id, guest_id, uploader_name, device_key, storage_path, width, height
  )
  values (p_id, v_event, v_guest, clean_name, p_device, p_path, p_width, p_height);
  return v_event;
end;
$$;

revoke execute on function public.add_wall_photo(
  text, text, text, text, uuid, text, integer, integer, integer, integer
) from public, anon, authenticated;
grant execute on function public.add_wall_photo(
  text, text, text, text, uuid, text, integer, integer, integer, integer
) to service_role;

-- A guest taking back a photo this phone added. Returns its file's path, for the server to
-- delete, or null when it isn't theirs.
create or replace function public.remove_wall_photo(p_slug text, p_device text, p_id uuid)
returns text
language sql
security definer
set search_path = ''
as $$
  delete from public.wall_photos w
  using public.events e
  where e.id = w.event_id and e.slug = p_slug and e.status = 'published'
    and w.id = p_id and w.device_key = p_device
  returning w.storage_path;
$$;

revoke execute on function public.remove_wall_photo(text, text, uuid)
  from public, anon, authenticated;
grant execute on function public.remove_wall_photo(text, text, uuid) to service_role;
