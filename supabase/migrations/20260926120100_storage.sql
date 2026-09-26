-- Private storage for event photos (Step 8). Files live under <event id>/..., and only
-- that event's hosts can read or write them. Guests get short-lived signed links when
-- the invite is published (Step 9).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('event-media', 'event-media', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create or replace function public.media_event_id(path text)
returns uuid
language plpgsql
immutable
as $$
begin
  return split_part(path, '/', 1)::uuid;
exception when others then
  return null;
end;
$$;

create policy "Hosts read their event media" on storage.objects
  for select to authenticated
  using (bucket_id = 'event-media' and public.is_event_host(public.media_event_id(name)));
create policy "Hosts upload their event media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'event-media' and public.is_event_host(public.media_event_id(name)));
create policy "Hosts replace their event media" on storage.objects
  for update to authenticated
  using (bucket_id = 'event-media' and public.is_event_host(public.media_event_id(name)));
create policy "Hosts delete their event media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'event-media' and public.is_event_host(public.media_event_id(name)));
