-- Guest list import and opens: when each guest last opened their personal link, and how
-- many times. Additive only (two new columns and guest_reply() replaced with the same
-- arguments and result), so it is safe to run on the live database.

alter table public.guests add column if not exists last_opened_at timestamptz;
alter table public.guests
  add column if not exists open_count integer not null default 0 check (open_count >= 0);

-- Guests who opened before this change have opened at least once
update public.guests
set open_count = 1, last_opened_at = opened_at
where opened_at is not null and open_count = 0;

create index if not exists guests_event_opened_idx
  on public.guests (event_id, last_opened_at desc)
  where last_opened_at is not null;

-- A guest's own reply, found by their link's token, for filling the form again. Marks the
-- invitation opened. A visit counts once per half hour, so reloading or opening the
-- link twice in a row is one visit. Null when the token isn't a guest of this published
-- invite.
create or replace function public.guest_reply(p_slug text, p_token text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  guest public.guests;
begin
  select g.* into guest
  from public.guests g
  join public.events e on e.id = g.event_id
  where e.slug = p_slug and e.status = 'published' and g.token = p_token;
  if not found then
    return null;
  end if;

  update public.guests
  set opened_at = coalesce(opened_at, now()),
      open_count = open_count + case
        when last_opened_at is null or last_opened_at < now() - interval '30 minutes' then 1
        else 0
      end,
      last_opened_at = now()
  where id = guest.id;

  return jsonb_build_object(
    'name', guest.name,
    'party_size', guest.party_size,
    'function_ids', to_jsonb(guest.function_ids),
    'replies', coalesce((
      select jsonb_agg(jsonb_build_object(
        'function_id', r.function_id,
        'status', r.status,
        'adults', r.adults,
        'children', r.children,
        'message', r.message,
        'answers', r.answers
      ))
      from public.rsvps r
      where r.guest_id = guest.id
    ), '[]'::jsonb)
  );
end;
$$;

revoke execute on function public.guest_reply(text, text) from public;
grant execute on function public.guest_reply(text, text) to anon, authenticated;
