-- Visitor counts for the master admin (/admin/visitors), counted by the site itself and
-- kept in our own database, with no cookies. One row per page view. A visitor is a
-- scrambled code made from their network and browser with a salt that changes every day
-- in India, so the same person reads as one visitor within a day and can't be followed
-- from one day to the next, and the code can't be turned back into an address. Views by
-- signed-in people carry their account, so the admin can count hosts as well as anonymous
-- visitors. Admins' own views aren't counted. Views older than 13 months are deleted.
-- Additive only, so it is safe to run on the live database.

create table if not exists public.site_visits (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  visitor text not null check (char_length(visitor) between 1 and 32),
  user_id uuid references auth.users (id) on delete set null,
  path text not null check (char_length(path) between 1 and 300),
  referrer text check (char_length(referrer) <= 200),
  source text check (char_length(source) <= 60),
  country text check (char_length(country) <= 2),
  device text not null check (device in ('mobile', 'tablet', 'desktop')),
  browser text check (char_length(browser) <= 30),
  os text check (char_length(os) <= 30)
);

create index if not exists site_visits_at_idx on public.site_visits (at);

-- Today's salt only; yesterday's is deleted with the first view of a new day
create table if not exists public.visit_salts (
  day date primary key,
  salt text not null default gen_random_uuid()::text
);

-- Nobody reads or writes these directly: views go in through record_visit(), and the
-- admin page reads visit_summary() as the server
alter table public.site_visits enable row level security;
alter table public.visit_salts enable row level security;
revoke all on public.site_visits from anon, authenticated;
revoke all on public.visit_salts from anon, authenticated;

-- Counts one page view, sent by the site's server (app/api/visit). p_key is the visitor's
-- network address and browser, used only to make the day's code and never stored.
create or replace function public.record_visit(
  p_key text,
  p_path text,
  p_referrer text default null,
  p_source text default null,
  p_country text default null,
  p_device text default null,
  p_browser text default null,
  p_os text default null
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
  if coalesce(p_key, '') = '' or coalesce(left(p_path, 1), '') <> '/' then
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
    delete from public.site_visits where at < now() - interval '13 months';
  end if;

  insert into public.site_visits (visitor, user_id, path, referrer, source, country, device, browser, os)
  values (
    left(encode(sha256(convert_to(day_salt || p_key, 'UTF8')), 'hex'), 32),
    (select u.id from auth.users u where u.id = auth.uid()),
    left(p_path, 300),
    nullif(left(lower(p_referrer), 200), ''),
    nullif(left(lower(p_source), 60), ''),
    case when p_country ~ '^[A-Za-z]{2}$' then upper(p_country) end,
    case when p_device in ('mobile', 'tablet') then p_device else 'desktop' end,
    nullif(left(p_browser, 30), ''),
    nullif(left(p_os, 30), '')
  );
end;
$$;

revoke execute on function public.record_visit(text, text, text, text, text, text, text, text)
  from public;
grant execute on function public.record_visit(text, text, text, text, text, text, text, text)
  to anon, authenticated;

-- What the admin page shows for the last p_days days in India (today included): totals,
-- each day, and the top pages, sources, places and devices. A visitor counts once a day;
-- where they came from, their country and device are those of their first view that day.
create or replace function public.visit_summary(p_days integer)
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
  views as (
    select v.*, (v.at at time zone 'Asia/Kolkata')::date as day
    from public.site_visits v, span
    where v.at >= ((span.today - (span.days - 1))::timestamp at time zone 'Asia/Kolkata')
  ),
  visitor_days as (
    select
      day,
      visitor,
      count(*) as views,
      bool_or(user_id is not null) as signed_in,
      (array_agg(referrer order by at) filter (where referrer is not null))[1] as referrer,
      (array_agg(source order by at) filter (where source is not null))[1] as source,
      (array_agg(country order by at) filter (where country is not null))[1] as country,
      (array_agg(device order by at))[1] as device,
      (array_agg(browser order by at) filter (where browser is not null))[1] as browser,
      (array_agg(os order by at) filter (where os is not null))[1] as os
    from views
    group by day, visitor
  ),
  top as (
    select 'referrers' as list, coalesce(referrer, '') as label, count(*) as n
    from visitor_days group by 2
    union all
    select 'sources', source, count(*) from visitor_days where source is not null group by 2
    union all
    select 'countries', coalesce(country, ''), count(*) from visitor_days group by 2
    union all
    select 'devices', device, count(*) from visitor_days group by 2
    union all
    select 'browsers', coalesce(browser, ''), count(*) from visitor_days group by 2
    union all
    select 'systems', coalesce(os, ''), count(*) from visitor_days group by 2
  ),
  ranked as (
    select list, label, n, row_number() over (partition by list order by n desc, label) as rank
    from top
  )
  select jsonb_build_object(
    'days', (select days from span),
    'totals', (
      select jsonb_build_object(
        'views', coalesce(sum(views), 0),
        'visitors', count(*),
        'signedIn', count(*) filter (where signed_in),
        'accounts', (select count(distinct user_id) from views),
        'onePage', count(*) filter (where views = 1)
      )
      from visitor_days
    ),
    'now', (
      select count(distinct visitor) from public.site_visits
      where at > now() - interval '30 minutes'
    ),
    'daily', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'day', d.day,
        'views', coalesce(t.views, 0),
        'visitors', coalesce(t.visitors, 0),
        'signedIn', coalesce(t.signed_in, 0)
      ) order by d.day), '[]'::jsonb)
      from span,
        generate_series(span.today - (span.days - 1), span.today, interval '1 day') as g(at),
        lateral (select g.at::date as day) d
      left join (
        select day, sum(views) as views, count(*) as visitors,
               count(*) filter (where signed_in) as signed_in
        from visitor_days group by day
      ) t on t.day = d.day
    ),
    'pages', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'label', path, 'views', views, 'visitors', visitors
      ) order by views desc, path), '[]'::jsonb)
      from (
        select path, count(*) as views, count(distinct (day, visitor)) as visitors
        from views group by path order by views desc, path limit 20
      ) p
    ),
    'lists', (
      select coalesce(jsonb_object_agg(list, items), '{}'::jsonb)
      from (
        select list, jsonb_agg(jsonb_build_object('label', label, 'visitors', n)
                               order by n desc, label) as items
        from ranked where rank <= 10 group by list
      ) l
    )
  );
$$;

revoke execute on function public.visit_summary(integer) from public, anon, authenticated;
grant execute on function public.visit_summary(integer) to service_role;
