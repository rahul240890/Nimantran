-- Step 10: guests reply without signing in. Additive only: one new column, the guest page's
-- read gains the host's questions, and two functions guests call with their link.
--
-- Guests never touch the tables. They send replies through submit_rsvp(), which checks
-- the invite is published and every function belongs to it. Each reply is tied to a
-- guests row: the host's own guest list (Step 11) or one made on the first reply from the
-- open link. That row's token is the guest's key to change their reply later.

alter table public.guests
  add column if not exists self_added boolean not null default false;

-- The guest page's read, now with the host's RSVP questions
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
    ), '[]'::jsonb),
    'questions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', q.id,
        'preset', q.preset,
        'kind', q.kind,
        'label', q.label,
        'options', q.options,
        'required', q.required,
        'function_id', q.function_id
      ) order by q.position, q.created_at)
      from public.rsvp_questions q
      where q.event_id = e.id
    ), '[]'::jsonb)
  )
  from public.events e
  where e.slug = p_slug and e.status = 'published';
$$;

-- A guest's own reply, found by their link's token, for filling the form again. Marks the
-- invitation opened. Null when the token isn't a guest of this published invite.
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

  update public.guests set opened_at = coalesce(opened_at, now()) where id = guest.id;

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

-- Saves a guest's reply to one or more functions and returns their token.
-- p_replies: [{"function_id": uuid, "status": "attending" | "declined" | "maybe",
--              "adults": 0-20, "children": 0-20}]
create or replace function public.submit_rsvp(
  p_slug text,
  p_token text,
  p_name text,
  p_replies jsonb,
  p_message text default '',
  p_answers jsonb default '{}'::jsonb
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event uuid;
  guest public.guests;
  reply jsonb;
  clean_name text := btrim(coalesce(p_name, ''));
  people smallint := 1;
begin
  select e.id into v_event
  from public.events e
  where e.slug = p_slug and e.status = 'published';
  if v_event is null then
    raise exception 'invitation not found' using errcode = 'P0002';
  end if;

  if char_length(clean_name) not between 1 and 80 then
    raise exception 'a name is needed' using errcode = '22023';
  end if;
  if jsonb_typeof(p_replies) <> 'array' or jsonb_array_length(p_replies) not between 1 and 20 then
    raise exception 'a reply is needed for at least one function' using errcode = '22023';
  end if;
  if jsonb_typeof(coalesce(p_answers, '{}'::jsonb)) <> 'object' then
    raise exception 'answers must be an object' using errcode = '22023';
  end if;

  select coalesce(max(
    least(20, coalesce((r ->> 'adults')::int, 0) + coalesce((r ->> 'children')::int, 0))
  ), 1)::smallint
  into people
  from jsonb_array_elements(p_replies) r;

  if p_token is not null and p_token <> '' then
    select g.* into guest from public.guests g
    where g.event_id = v_event and g.token = p_token;
  end if;

  if guest.id is null then
    -- A guest replying from the open link: add them to the list, within reason
    if (select count(*) from public.guests g
        where g.event_id = v_event and g.self_added) >= 2000 then
      raise exception 'this invitation has reached its reply limit' using errcode = '54000';
    end if;
    insert into public.guests (event_id, name, party_size, self_added, opened_at)
    values (v_event, clean_name, greatest(people, 1), true, now())
    returning * into guest;
  elsif guest.self_added then
    update public.guests
    set name = clean_name, party_size = greatest(people, 1)
    where id = guest.id;
  end if;

  for reply in select * from jsonb_array_elements(p_replies) loop
    if not exists (
      select 1 from public.functions f
      where f.id = (reply ->> 'function_id')::uuid and f.event_id = v_event
    ) then
      raise exception 'function is not part of this invitation' using errcode = '23514';
    end if;
    -- A guest invited to some functions only can't reply to the others
    if cardinality(guest.function_ids) > 0
      and not ((reply ->> 'function_id')::uuid = any (guest.function_ids)) then
      raise exception 'guest is not invited to this function' using errcode = '42501';
    end if;

    insert into public.rsvps (
      event_id, function_id, guest_id, name, status, adults, children, message, answers
    )
    values (
      v_event,
      (reply ->> 'function_id')::uuid,
      guest.id,
      clean_name,
      reply ->> 'status',
      case when reply ->> 'status' = 'declined' then 0
        else coalesce((reply ->> 'adults')::smallint, 1) end,
      case when reply ->> 'status' = 'declined' then 0
        else coalesce((reply ->> 'children')::smallint, 0) end,
      left(coalesce(p_message, ''), 280),
      coalesce(p_answers, '{}'::jsonb)
    )
    on conflict (function_id, guest_id) where guest_id is not null do update
    set name = excluded.name,
        status = excluded.status,
        adults = excluded.adults,
        children = excluded.children,
        message = excluded.message,
        answers = excluded.answers,
        responded_at = now();
  end loop;

  return guest.token;
end;
$$;

revoke execute on function public.guest_reply(text, text) from public;
revoke execute on function public.submit_rsvp(text, text, text, jsonb, text, jsonb) from public;
grant execute on function public.guest_reply(text, text) to anon, authenticated;
grant execute on function public.submit_rsvp(text, text, text, jsonb, text, jsonb)
  to anon, authenticated;
