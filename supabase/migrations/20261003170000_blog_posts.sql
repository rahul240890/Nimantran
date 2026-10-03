-- The blog manager (Admin, Blog): posts written in the admin, beside the ones that ship
-- with the code (src/content/blog). Additive only: one table and one public bucket.

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  locale text not null default 'en' check (locale in ('en', 'hi')),
  -- For the browser tab and search results; the site's name is added after it
  title text not null check (char_length(title) between 1 and 70),
  description text not null default '' check (char_length(description) <= 200),
  heading text not null check (char_length(heading) between 1 and 160),
  intro text not null default '' check (char_length(intro) <= 1200),
  -- The post in the blog's light markup (docs/BLOG.md)
  body text not null default '' check (char_length(body) <= 60000),
  faq text not null default '' check (char_length(faq) <= 8000),
  occasion text not null default 'wedding',
  keywords text[] not null default '{}',
  cover_path text,
  cover_alt text not null default '' check (char_length(cover_alt) <= 200),
  status text not null default 'draft' check (status in ('draft', 'published')),
  -- When it goes live; a published post with a date ahead waits until then
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users on delete set null,
  unique (locale, slug)
);
alter table public.blog_posts enable row level security;

drop policy if exists "Anyone reads live posts" on public.blog_posts;
create policy "Anyone reads live posts" on public.blog_posts
  for select to anon, authenticated
  using (status = 'published' and published_at <= now());
drop policy if exists "Admins read posts" on public.blog_posts;
create policy "Admins read posts" on public.blog_posts
  for select to authenticated using ((select public.is_admin()));
drop policy if exists "Admins add posts" on public.blog_posts;
create policy "Admins add posts" on public.blog_posts
  for insert to authenticated with check ((select public.is_admin()));
drop policy if exists "Admins change posts" on public.blog_posts;
create policy "Admins change posts" on public.blog_posts
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "Admins delete posts" on public.blog_posts;
create policy "Admins delete posts" on public.blog_posts
  for delete to authenticated using ((select public.is_admin()));

create index if not exists blog_posts_live on public.blog_posts (locale, published_at desc)
  where status = 'published';

-- Cover images, public so search engines and link previews can load them. Only admins
-- upload, through the site's server.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog', 'blog', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "Admins add blog covers" on storage.objects;
create policy "Admins add blog covers" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'blog' and (select public.is_admin()));
drop policy if exists "Admins remove blog covers" on storage.objects;
create policy "Admins remove blog covers" on storage.objects
  for delete to authenticated
  using (bucket_id = 'blog' and (select public.is_admin()));
