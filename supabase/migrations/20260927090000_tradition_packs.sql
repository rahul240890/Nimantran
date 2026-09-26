-- Tradition packs (Step 12a): the guest page shows the family's sacred symbol,
-- invocation, local ceremony names and wording, so published_invite() returns the
-- tradition and religious elements as well. Nothing else changes; safe to run again.
-- The columns come from 20260926170000_traditions_ready.sql.

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
    'tradition_id', e.tradition_id,
    'religious', e.religious,
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

revoke execute on function public.published_invite(text) from public;
grant execute on function public.published_invite(text) to anon, authenticated;
