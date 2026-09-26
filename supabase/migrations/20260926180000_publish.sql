-- Step 9: publishing and sharing. Additive only (new functions, one new check and one
-- new storage policy), so it is safe to run on the live database.
--
-- A published invite is read by anyone holding its link, through published_invite()
-- below. The tables stay closed to guests; the function returns only what the card and
-- the guest page show.

-- Whether an event is live at /i/<slug>. Security definer so storage policies can ask.
create or replace function public.is_published_event(target uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.events where id = target and status = 'published'
  );
$$;

-- A published invite always has its link
alter table public.events
  add constraint events_published_slug check (status <> 'published' or slug is not null);

-- Whether a link is free. Hosts can't see other families' events, so the editor asks here
-- before suggesting a link.
create or replace function public.slug_available(p_slug text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select not exists (select 1 from public.events where slug = p_slug);
$$;

-- Everything the guest page needs for one published invite, or null
create or replace function public.published_invite(p_slug text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'id', e.id,
    'slug', e.slug,
    'category_id', e.category_id,
    'template_id', e.template_id,
    'content', e.content,
    'music', e.music,
    'published_at', e.published_at,
    'updated_at', e.updated_at,
    'functions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', f.id,
        'kind', f.kind,
        'name', f.name,
        'position', f.position,
        'date', f.date,
        'start_time', f.start_time,
        'end_time', f.end_time,
        'venue', f.venue,
        'address', f.address,
        'dress_code', f.dress_code
      ) order by f.position, f.date, f.start_time)
      from public.functions f
      where f.event_id = e.id
    ), '[]'::jsonb),
    'photos', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id,
        'path', m.storage_path,
        'width', m.width,
        'height', m.height
      ) order by m.position, m.created_at)
      from public.media m
      where m.event_id = e.id and m.kind = 'photo'
    ), '[]'::jsonb)
  )
  from public.events e
  where e.slug = p_slug and e.status = 'published';
$$;

revoke execute on function public.published_invite(text) from public;
grant execute on function public.published_invite(text) to anon, authenticated;

-- Guests see the photos of published invites (the page signs short-lived links to them)
create policy "Anyone reads photos of published invites" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'event-media' and public.is_published_event(public.media_event_id(name)));
