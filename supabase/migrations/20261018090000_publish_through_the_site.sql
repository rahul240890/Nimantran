-- Only the server puts an invite live (owner, 2026-10-15: every paid design is bought before
-- it's published or shared). The site publishes after checking the invite's package, with
-- its own key; a host's own connection (the authenticated role, which the browser holds)
-- could otherwise mark an unpaid invite published straight through the database, or
-- change a live invite's design after paying for another one.

-- A host's own connection (the authenticated role) can't publish, and can't change what a
-- live invite looks like as a design: its design, occasion, tradition, theme, format or
-- card languages. The server does both, with its own key, once the package covers them.
-- Taking an invite off its link, and every other edit, stay the host's.
create or replace function public.guard_event_publishing()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user not in ('authenticated', 'anon') then
    return new;
  end if;
  if tg_op = 'INSERT' then
    if new.status = 'published' then
      raise exception 'invites are published through the site' using errcode = '42501';
    end if;
    return new;
  end if;
  if new.status = 'published' and old.status is distinct from 'published' then
    raise exception 'invites are published through the site' using errcode = '42501';
  end if;
  if old.status = 'published' and new.status = 'published' and (
    new.template_id is distinct from old.template_id
    or new.category_id is distinct from old.category_id
    or new.tradition_id is distinct from old.tradition_id
    or new.religious ->> 'suite' is distinct from old.religious ->> 'suite'
    or new.religious ->> 'format' is distinct from old.religious ->> 'format'
    or new.languages is distinct from old.languages
    or new.slug is distinct from old.slug
    or new.published_at is distinct from old.published_at
  ) then
    raise exception 'a live invite changes its design through the site' using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists events_guard_publishing on public.events;
create trigger events_guard_publishing before insert or update on public.events
  for each row execute function public.guard_event_publishing();
