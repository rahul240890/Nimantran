-- Spam protection for guest replies (owner, 2026-10-17). Anyone with the open link can
-- reply, and each new reply adds a guest, so a script or one person in many browsers could
-- fill a package's invites and turn real guests away. The server now sends submit_rsvp() a
-- keyed hash of the network a new reply came from (never the address itself), and a
-- network can add at most 10 new guests to one invitation an hour and 30 a day. Hashes are
-- kept two days, only to count. Replies from a personal link, and changes to a reply, are
-- never limited. Run once in Supabase's SQL Editor; until then the site calls the old
-- submit_rsvp() and replies keep working without the limit.

create table if not exists public.reply_senders (
  event_id uuid not null references public.events (id) on delete cascade,
  sender text not null check (char_length(sender) between 16 and 128),
  created_at timestamptz not null default now()
);
create index if not exists reply_senders_count
  on public.reply_senders (event_id, sender, created_at);
create index if not exists reply_senders_age on public.reply_senders (created_at);
-- No policies: only submit_rsvp(), running as its owner, reads or writes it
alter table public.reply_senders enable row level security;
revoke all on public.reply_senders from anon, authenticated;

-- The new parameter replaces the old six-argument function; calls without it still match
drop function if exists public.submit_rsvp(text, text, text, jsonb, text, jsonb);

-- Saves a guest's reply to one or more functions and returns their token.
-- p_sender: the server's keyed hash of the network the reply came from (see above). It
-- only counts when the reply adds a new guest; null skips the limit.
-- p_replies: [{"function_id": uuid, "status": "attending" | "declined" | "maybe",
--              "adults": 0-20, "children": 0-20}]
create or replace function public.submit_rsvp(
  p_slug text,
  p_token text,
  p_name text,
  p_replies jsonb,
  p_message text default '',
  p_answers jsonb default '{}'::jsonb,
  p_sender text default null
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
    if p_sender is not null then
      if (select count(*) from public.reply_senders s
          where s.event_id = v_event and s.sender = p_sender
            and s.created_at > now() - interval '1 hour') >= 10
        or (select count(*) from public.reply_senders s
          where s.event_id = v_event and s.sender = p_sender
            and s.created_at > now() - interval '1 day') >= 30 then
        raise exception 'too many new replies from one network' using errcode = 'P0429';
      end if;
      delete from public.reply_senders where created_at < now() - interval '2 days';
      insert into public.reply_senders (event_id, sender) values (v_event, p_sender);
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

revoke execute on function public.submit_rsvp(text, text, text, jsonb, text, jsonb, text)
  from public;
grant execute on function public.submit_rsvp(text, text, text, jsonb, text, jsonb, text)
  to anon, authenticated;
