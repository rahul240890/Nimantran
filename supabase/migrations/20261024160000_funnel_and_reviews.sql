-- Where visitors stop, and what families say (owner, 2026-10-24: "what we can do more to
-- improve conversions"). Additive only, so it is safe to run on the live database.
--
-- 1. Funnel steps for the admin's Visitors page. Each step a visitor reaches (opened a
--    design's page, the editor, the preview, started paying, paid, published) is kept
--    under the same day's code as their page views (20261019090000_site_visits.sql), so
--    the admin sees how many go on from each step, and where they came from. No names,
--    no addresses: a step carries only the design or occasion it was about.
-- 2. Reviews from hosts, shown on the site only once an admin approves them.

create table if not exists public.site_steps (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  visitor text not null check (char_length(visitor) between 1 and 32),
  user_id uuid references auth.users (id) on delete set null,
  step text not null
    check (step in ('sample', 'details', 'editor', 'preview', 'checkout', 'paid', 'published')),
  design text check (char_length(design) <= 60),
  category text check (char_length(category) <= 40)
);

create index if not exists site_steps_at_idx on public.site_steps (at);

-- As with page views: in through record_step(), out through funnel_summary() as the server
alter table public.site_steps enable row level security;
revoke all on public.site_steps from anon, authenticated;

-- Counts one step, sent by the site's server (app/api/visit) with the same key as page
-- views, so the step and the views share the day's visitor code. Admins aren't counted.
create or replace function public.record_step(
  p_key text,
  p_step text,
  p_design text default null,
  p_category text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  today date := (now() at time zone 'Asia/Kolkata')::date;
  day_salt text;
begin
  if coalesce(p_key, '') = '' or p_step is null or p_step not in (
    'sample', 'details', 'editor', 'preview', 'checkout', 'paid', 'published'
  ) then
    return;
  end if;
  if public.is_admin() then
    return;
  end if;

  select salt into day_salt from public.visit_salts where day = today;
  if not found then
    insert into public.visit_salts (day) values (today) on conflict (day) do nothing;
    select salt into day_salt from public.visit_salts where day = today;
    delete from public.visit_salts where day < today;
  end if;
  -- Steps are kept as long as page views; now and then the oldest go
  if random() < 0.01 then
    delete from public.site_steps where at < now() - interval '13 months';
  end if;

  insert into public.site_steps (visitor, user_id, step, design, category)
  values (
    left(encode(sha256(convert_to(day_salt || p_key, 'UTF8')), 'hex'), 32),
    (select u.id from auth.users u where u.id = auth.uid()),
    p_step,
    nullif(left(lower(p_design), 60), ''),
    nullif(left(lower(p_category), 40), '')
  );
end;
$$;

revoke execute on function public.record_step(text, text, text, text) from public;
grant execute on function public.record_step(text, text, text, text) to anon, authenticated;

-- The funnel for the last p_days days in India (today included). A visitor counts once a
-- day at each step, as on the rest of the page; "came from" is their first campaign or
-- site that day. Outcomes (accounts, invites, payments, published) come from the tables
-- themselves, so they are exact even for visitors whose counting was blocked.
create or replace function public.funnel_summary(p_days integer)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with span as (
    select greatest(1, least(coalesce(p_days, 30), 400)) as days,
           (now() at time zone 'Asia/Kolkata')::date as today
  ),
  bounds as (
    select ((today - (days - 1))::timestamp at time zone 'Asia/Kolkata') as since from span
  ),
  visitor_days as (
    select
      (v.at at time zone 'Asia/Kolkata')::date as day,
      v.visitor,
      coalesce(
        (array_agg(v.source order by v.at) filter (where v.source is not null))[1],
        (array_agg(v.referrer order by v.at) filter (where v.referrer is not null))[1],
        ''
      ) as came_from,
      bool_or(v.user_id is not null) as signed_in
    from public.site_visits v, bounds
    where v.at >= bounds.since
    group by 1, 2
  ),
  step_days as (
    select distinct (s.at at time zone 'Asia/Kolkata')::date as day, s.visitor, s.step
    from public.site_steps s, bounds
    where s.at >= bounds.since
  ),
  by_source as (
    select
      d.came_from,
      count(*) as visitors,
      count(*) filter (where exists (
        select 1 from step_days s
        where s.day = d.day and s.visitor = d.visitor and s.step in ('sample', 'details')
      )) as designs,
      count(*) filter (where exists (
        select 1 from step_days s
        where s.day = d.day and s.visitor = d.visitor and s.step = 'preview'
      )) as preview,
      count(*) filter (where exists (
        select 1 from step_days s
        where s.day = d.day and s.visitor = d.visitor and s.step = 'checkout'
      )) as checkout,
      count(*) filter (where exists (
        select 1 from step_days s
        where s.day = d.day and s.visitor = d.visitor and s.step = 'paid'
      )) as paid
    from visitor_days d
    group by d.came_from
  )
  select jsonb_build_object(
    'days', (select days from span),
    'steps', jsonb_build_object(
      'visitors', (select count(*) from visitor_days),
      'sample', (select count(*) from step_days where step = 'sample'),
      'details', (select count(*) from step_days where step = 'details'),
      'editor', (select count(*) from step_days where step = 'editor'),
      'preview', (select count(*) from step_days where step = 'preview'),
      'signedIn', (select count(*) from visitor_days where signed_in),
      'checkout', (select count(*) from step_days where step = 'checkout'),
      'paid', (select count(*) from step_days where step = 'paid'),
      'published', (select count(*) from step_days where step = 'published')
    ),
    'sources', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'label', came_from, 'visitors', visitors, 'designs', designs, 'preview', preview,
        'checkout', checkout, 'paid', paid
      ) order by visitors desc, came_from), '[]'::jsonb)
      from (select * from by_source order by visitors desc, came_from limit 10) top
    ),
    'designs', (
      select coalesce(jsonb_agg(jsonb_build_object('label', design, 'visitors', n)
                                order by n desc, design), '[]'::jsonb)
      from (
        select s.design, count(distinct ((s.at at time zone 'Asia/Kolkata')::date, s.visitor)) as n
        from public.site_steps s, bounds
        where s.at >= bounds.since and s.step in ('sample', 'details') and s.design is not null
        group by s.design
        order by n desc, s.design
        limit 10
      ) d
    ),
    'outcomes', jsonb_build_object(
      'accounts', (
        select count(*) from public.profiles p, bounds where p.created_at >= bounds.since
      ),
      'invites', (
        select count(*) from public.events e, bounds where e.created_at >= bounds.since
      ),
      'payments', (
        select count(*) from public.orders o, bounds
        where o.status = 'paid' and o.mode = 'live' and o.paid_at >= bounds.since
      ),
      'revenuePaise', (
        select coalesce(sum(o.amount_paise), 0) from public.orders o, bounds
        where o.status = 'paid' and o.mode = 'live' and o.paid_at >= bounds.since
      ),
      'published', (
        select count(*) from public.events e, bounds where e.published_at >= bounds.since
      )
    )
  );
$$;

revoke execute on function public.funnel_summary(integer) from public, anon, authenticated;
grant execute on function public.funnel_summary(integer) to service_role;

-- Reviews from hosts. A host writes one from their account once an invite of theirs is
-- live; it shows on the site only after an admin approves it, with the name and place the
-- host chose to show. Only the server reads or writes them (Admin, Reviews, and the
-- review form), so a review can never appear that nobody checked.
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  event_id uuid references public.events on delete set null,
  rating smallint not null check (rating between 1 and 5),
  body text not null check (char_length(body) between 10 and 600),
  name text not null check (char_length(name) between 1 and 60),
  place text not null default '' check (char_length(place) <= 60),
  occasion text not null default '' check (char_length(occasion) <= 40),
  status text not null default 'pending' check (status in ('pending', 'approved', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One review per account; writing again replaces it and sends it back for approval
create unique index if not exists reviews_user_idx on public.reviews (user_id);
create index if not exists reviews_status_idx on public.reviews (status, updated_at desc);

alter table public.reviews enable row level security;
revoke all on public.reviews from anon, authenticated;
