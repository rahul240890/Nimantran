-- Nimantran core schema (Step 8).
--
-- Who can see what, in one line: hosts and co-hosts see only their own events and
-- everything under them; everyone can read the category and design catalogues; guests
-- reach invites through the published page (Step 9) and answer through submit_rsvp
-- (Step 10), never by reading tables directly.
--
-- Every table has row level security on. Supabase grants the anon and authenticated
-- roles table access by default, so the policies below are the only gate.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Catalogues: categories and designs (seeded from src/lib/categories and
-- src/lib/templates by supabase/seed.sql). Read by everyone, written only by the
-- service role.
-- ---------------------------------------------------------------------------

create table public.categories (
  id text primary key check (id ~ '^[a-z][a-z0-9-]*$'),
  "group" text not null,
  -- The name in every launch language: {"en": "Roka", "hi": "रोका", ...}
  names jsonb not null check (jsonb_typeof(names) = 'object' and names ? 'en'),
  icon text not null,
  priority smallint not null check (priority between 0 and 100),
  season smallint[] not null default '{}',
  regions text[] not null default '{}',
  -- {"planned": [...], "suggested": [...], "primary": "roka"}
  functions jsonb not null,
  schedule text not null check (schedule in ('full', 'date-only')),
  rsvp_questions text[] not null default '{}',
  wording jsonb not null default '{}',
  position smallint not null default 0,
  created_at timestamptz not null default now()
);

create table public.templates (
  id text primary key check (id ~ '^[a-z][a-z0-9-]*$'),
  name text not null check (char_length(name) between 1 and 40),
  -- The whole design in the shape of templateSchema (src/lib/templates/schema.ts)
  data jsonb not null,
  premium boolean not null default false,
  position smallint not null default 0,
  created_at timestamptz not null default now()
);

-- A design can suit many occasions, best first
create table public.category_templates (
  category_id text not null references public.categories on delete cascade,
  template_id text not null references public.templates on delete cascade,
  position smallint not null default 0,
  primary key (category_id, template_id)
);

alter table public.categories enable row level security;
alter table public.templates enable row level security;
alter table public.category_templates enable row level security;

create policy "Anyone can read categories" on public.categories
  for select to anon, authenticated using (true);
create policy "Anyone can read designs" on public.templates
  for select to anon, authenticated using (true);
create policy "Anyone can read which designs suit which occasions" on public.category_templates
  for select to anon, authenticated using (true);

-- ---------------------------------------------------------------------------
-- Profiles: one per sign-in, created automatically
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null default '' check (char_length(name) <= 60),
  language text not null default 'en'
    check (language in ('en', 'hi', 'mr', 'gu', 'bn', 'ta', 'te', 'kn', 'ml', 'pa')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- A new sign-in gets a profile, named from Google when it offers a name
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, language)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name', ''), 60),
    case
      when new.raw_user_meta_data ->> 'language'
        in ('en', 'hi', 'mr', 'gu', 'bn', 'ta', 'te', 'kn', 'ml', 'pa')
      then new.raw_user_meta_data ->> 'language'
      else 'en'
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Events (one invite) and the people who run them
-- ---------------------------------------------------------------------------

create table public.events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles on delete cascade default auth.uid(),
  category_id text not null references public.categories,
  template_id text not null references public.templates,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  -- The public link, /i/<slug>, set when publishing (Step 9)
  slug text unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 60),
  -- The card's wording, by slot id: {"first": "Aarav", "line": "..."}
  content jsonb not null default '{}' check (jsonb_typeof(content) = 'object'),
  -- {"raga": "yaman" | null, "playOnOpen": true}
  music jsonb not null default '{"raga": null, "playOnOpen": true}',
  -- Where the host was in the editor
  editor_step text not null default 'occasion',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index events_owner_idx on public.events (owner_id);

create trigger events_touch before update on public.events
  for each row execute function public.touch_updated_at();

-- Both families can run one event: the owner, and co-hosts the owner adds
create table public.event_hosts (
  event_id uuid not null references public.events on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  role text not null default 'cohost' check (role in ('owner', 'cohost')),
  -- Which side of the family, shown to the other hosts
  side text check (char_length(side) <= 40),
  added_by uuid references public.profiles on delete set null,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create index event_hosts_user_idx on public.event_hosts (user_id);
create unique index event_hosts_one_owner on public.event_hosts (event_id) where role = 'owner';

-- A co-host asked by phone or email who hasn't signed in yet; accepted in Step 11
create table public.event_host_invites (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events on delete cascade,
  phone text check (phone ~ '^\+[1-9][0-9]{7,14}$'),
  email text check (position('@' in email) > 1),
  token text not null unique default encode(gen_random_bytes(18), 'hex'),
  invited_by uuid not null references public.profiles on delete cascade default auth.uid(),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  check (phone is not null or email is not null)
);

-- Who hosts what. Security definer so policies can ask without recursing into
-- event_hosts' own policies.
create or replace function public.is_event_host(target uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.event_hosts
    where event_id = target and user_id = (select auth.uid())
  );
$$;

create or replace function public.is_event_owner(target uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.event_hosts
    where event_id = target and user_id = (select auth.uid()) and role = 'owner'
  );
$$;

-- Hosts may see each other's names on the events they share
create or replace function public.shares_event_with(person uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.event_hosts mine
    join public.event_hosts theirs on theirs.event_id = mine.event_id
    where mine.user_id = (select auth.uid()) and theirs.user_id = person
  );
$$;

-- The creator becomes the owner the moment an event exists
create or replace function public.add_event_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.event_hosts (event_id, user_id, role, added_by)
  values (new.id, new.owner_id, 'owner', new.owner_id);
  return new;
end;
$$;

create trigger events_add_owner after insert on public.events
  for each row execute function public.add_event_owner();

-- Nobody hands an event to someone else by editing it
create or replace function public.keep_event_owner()
returns trigger
language plpgsql
as $$
begin
  if new.owner_id <> old.owner_id then
    raise exception 'an event keeps its owner' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger events_keep_owner before update on public.events
  for each row execute function public.keep_event_owner();

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.event_hosts enable row level security;
alter table public.event_host_invites enable row level security;

create policy "People read their own profile and their co-hosts'" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or public.shares_event_with(id));
create policy "People edit their own profile" on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- The owner check also covers the moment of creation, before the owner's host row exists
create policy "Hosts read their events" on public.events
  for select to authenticated
  using (owner_id = (select auth.uid()) or public.is_event_host(id));
create policy "Anyone signed in creates events they own" on public.events
  for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "Hosts edit their events" on public.events
  for update to authenticated
  using (public.is_event_host(id)) with check (public.is_event_host(id));
create policy "Owners delete their events" on public.events
  for delete to authenticated using (owner_id = (select auth.uid()));

create policy "Hosts see who else hosts" on public.event_hosts
  for select to authenticated using (public.is_event_host(event_id));
create policy "Owners add co-hosts" on public.event_hosts
  for insert to authenticated
  with check (public.is_event_owner(event_id) and role = 'cohost');
create policy "Owners update co-hosts" on public.event_hosts
  for update to authenticated
  using (public.is_event_owner(event_id) and role = 'cohost')
  with check (role = 'cohost');
create policy "Owners remove co-hosts, and co-hosts can leave" on public.event_hosts
  for delete to authenticated
  using (role = 'cohost' and (public.is_event_owner(event_id) or user_id = (select auth.uid())));

create policy "Hosts see pending co-host invitations" on public.event_host_invites
  for select to authenticated using (public.is_event_host(event_id));
create policy "Owners invite co-hosts" on public.event_host_invites
  for insert to authenticated
  with check (public.is_event_owner(event_id) and invited_by = (select auth.uid()));
create policy "Owners withdraw co-host invitations" on public.event_host_invites
  for delete to authenticated using (public.is_event_owner(event_id));

-- ---------------------------------------------------------------------------
-- What an event contains. Every table below belongs to one event, and its hosts
-- have full access to it; nobody else has any.
-- ---------------------------------------------------------------------------

create table public.functions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events on delete cascade,
  kind text not null check (kind in ('roka', 'engagement', 'haldi', 'mehendi', 'sangeet', 'wedding', 'reception')),
  position smallint not null default 0,
  date date,
  start_time time,
  venue text not null default '' check (char_length(venue) <= 70),
  address text not null default '' check (char_length(address) <= 120),
  dress_code text not null default '' check (char_length(dress_code) <= 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, kind)
);

create index functions_event_idx on public.functions (event_id);
create trigger functions_touch before update on public.functions
  for each row execute function public.touch_updated_at();

create table public.guests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  phone text check (phone ~ '^\+[1-9][0-9]{7,14}$'),
  email text check (position('@' in email) > 1),
  -- "Bride's family", "Office friends"
  group_name text not null default '' check (char_length(group_name) <= 40),
  -- How many people the invitation is for
  party_size smallint not null default 1 check (party_size between 1 and 20),
  -- The guest's own link, /i/<slug>?g=<token>, so replies are theirs (Step 10)
  token text not null unique default encode(gen_random_bytes(12), 'hex'),
  -- Functions this guest is invited to; empty means all
  function_ids uuid[] not null default '{}',
  notes text not null default '' check (char_length(notes) <= 280),
  opened_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index guests_event_idx on public.guests (event_id);
create trigger guests_touch before update on public.guests
  for each row execute function public.touch_updated_at();

-- The host's own questions on the RSVP (meal, arrival date, room, pickup, or custom)
create table public.rsvp_questions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events on delete cascade,
  -- A library question id (src/lib/categories/questions.ts), or null for a custom one
  preset text check (preset in ('meal', 'arrival', 'stay', 'pickup', 'song', 'message')),
  kind text not null check (kind in ('choice', 'date', 'yes-no', 'text')),
  label text not null check (char_length(label) between 1 and 120),
  options jsonb not null default '[]' check (jsonb_typeof(options) = 'array'),
  required boolean not null default false,
  -- Asked for one function only, or for the whole invite when null
  function_id uuid references public.functions on delete cascade,
  position smallint not null default 0,
  created_at timestamptz not null default now(),
  check (kind <> 'choice' or jsonb_array_length(options) >= 2)
);

create index rsvp_questions_event_idx on public.rsvp_questions (event_id);

create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events on delete cascade,
  function_id uuid not null references public.functions on delete cascade,
  -- Null for someone replying from the open link without a guest entry
  guest_id uuid references public.guests on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  status text not null check (status in ('attending', 'declined', 'maybe')),
  adults smallint not null default 1 check (adults between 0 and 20),
  children smallint not null default 0 check (children between 0 and 20),
  message text not null default '' check (char_length(message) <= 280),
  -- Answers to rsvp_questions, by question id
  answers jsonb not null default '{}' check (jsonb_typeof(answers) = 'object'),
  responded_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index rsvps_one_per_guest on public.rsvps (function_id, guest_id)
  where guest_id is not null;
create index rsvps_event_idx on public.rsvps (event_id);
create trigger rsvps_touch before update on public.rsvps
  for each row execute function public.touch_updated_at();

-- Invitations and reminders sent later, per function (Steps 9 and 11)
create table public.scheduled_sends (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events on delete cascade,
  function_id uuid references public.functions on delete cascade,
  channel text not null check (channel in ('email', 'sms', 'whatsapp')),
  purpose text not null default 'invite' check (purpose in ('invite', 'reminder', 'update')),
  audience text not null default 'all' check (audience in ('all', 'pending', 'attending')),
  send_at timestamptz not null,
  status text not null default 'scheduled'
    check (status in ('scheduled', 'sending', 'sent', 'cancelled', 'failed')),
  created_by uuid references public.profiles on delete set null default auth.uid(),
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index scheduled_sends_due_idx on public.scheduled_sends (send_at) where status = 'scheduled';

-- Photos and other files, stored in the event-media bucket under <event id>/
create table public.media (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events on delete cascade,
  kind text not null default 'photo' check (kind in ('photo', 'audio', 'video')),
  storage_path text not null unique,
  width integer check (width > 0),
  height integer check (height > 0),
  position smallint not null default 0,
  created_by uuid references public.profiles on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

create index media_event_idx on public.media (event_id);

alter table public.functions enable row level security;
alter table public.guests enable row level security;
alter table public.rsvp_questions enable row level security;
alter table public.rsvps enable row level security;
alter table public.scheduled_sends enable row level security;
alter table public.media enable row level security;

create policy "Hosts manage functions" on public.functions
  for all to authenticated
  using (public.is_event_host(event_id)) with check (public.is_event_host(event_id));
create policy "Hosts manage guests" on public.guests
  for all to authenticated
  using (public.is_event_host(event_id)) with check (public.is_event_host(event_id));
create policy "Hosts manage RSVP questions" on public.rsvp_questions
  for all to authenticated
  using (public.is_event_host(event_id)) with check (public.is_event_host(event_id));
create policy "Hosts read and tidy RSVPs" on public.rsvps
  for all to authenticated
  using (public.is_event_host(event_id)) with check (public.is_event_host(event_id));
create policy "Hosts manage scheduled sends" on public.scheduled_sends
  for all to authenticated
  using (public.is_event_host(event_id)) with check (public.is_event_host(event_id));
create policy "Hosts manage media" on public.media
  for all to authenticated
  using (public.is_event_host(event_id)) with check (public.is_event_host(event_id));

-- A row's function must belong to the same event, so no one can attach their
-- questions or replies to another family's function
create or replace function public.check_same_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.function_id is not null and not exists (
    select 1 from public.functions f where f.id = new.function_id and f.event_id = new.event_id
  ) then
    raise exception 'function % is not part of event %', new.function_id, new.event_id
      using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger rsvp_questions_same_event before insert or update on public.rsvp_questions
  for each row execute function public.check_same_event();
create trigger rsvps_same_event before insert or update on public.rsvps
  for each row execute function public.check_same_event();

create or replace function public.check_same_event_guest()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.guest_id is not null and not exists (
    select 1 from public.guests g where g.id = new.guest_id and g.event_id = new.event_id
  ) then
    raise exception 'guest % is not part of event %', new.guest_id, new.event_id
      using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger rsvps_same_event_guest before insert or update on public.rsvps
  for each row execute function public.check_same_event_guest();
create trigger scheduled_sends_same_event before insert or update on public.scheduled_sends
  for each row execute function public.check_same_event();
