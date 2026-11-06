-- A photo belongs to each invite that carries it (2026-11-06).
--
-- A new invite written from another keeps its photos' ids, so the editor's references to
-- them (the couple's frames, crops, memories) still hold. With the id alone as the key,
-- saving the new invite's copy of a photo took the row over from the invite it came from,
-- and a live invitation lost its photos on the guest page and in its link preview. Each
-- invite now has its own row for the photo, keyed by the invite and the photo's id.

alter table public.media drop constraint media_pkey;
alter table public.media add primary key (event_id, id);

-- Give back the rows taken over: each file still under an invite's folder whose row now
-- names another invite gets a row of its own again, as it was before.
insert into public.media (id, event_id, kind, storage_path, width, height, position, created_by, created_at)
select distinct on (o.name)
  m.id, e.id, m.kind, o.name, m.width, m.height, m.position, m.created_by, m.created_at
from storage.objects o
join public.events e on e.id::text = split_part(o.name, '/', 1)
join public.media m on m.id::text = split_part(split_part(o.name, '/', 2), '.', 1)
where o.bucket_id = 'event-media'
  and m.storage_path <> o.name
  and not exists (select 1 from public.media taken where taken.storage_path = o.name)
order by o.name, m.created_at desc
on conflict do nothing;
