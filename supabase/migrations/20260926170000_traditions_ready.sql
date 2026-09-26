-- Ready for tradition packs (Steps 12a and 23) and tidier functions. Additive only:
-- nothing is dropped except one check, which is replaced by a wider one, so it is safe
-- to run on the live database.

-- Ceremonies beyond the wedding journey (gaye-holud, anand-karaj, nikah, walima,
-- nalangu …) arrive as data with each pack, so the kind is any lowercase id rather
-- than a fixed list. The app still decides which kinds it offers.
alter table public.functions drop constraint if exists functions_kind_check;
alter table public.functions add constraint functions_kind_check
  check (kind ~ '^[a-z][a-z0-9-]*$' and char_length(kind) <= 40);

-- The family's own name for the ceremony ("Nichayathartham", "Gaye Holud"), shown
-- instead of the default when set, and an end time for a muhurtham window
-- ("between 9:00 and 10:30 AM"). Times are kept exactly as typed, never rounded.
alter table public.functions
  add column if not exists name text not null default '' check (char_length(name) <= 60),
  add column if not exists end_time time;

-- The tradition an invite follows, its card languages (first is the main one) and the
-- religious elements the family chose: {"art": "ganesha", "invocation": true,
-- "verse": null, "chant": false}. Empty means the design's own defaults.
alter table public.events
  add column if not exists tradition_id text
    check (tradition_id ~ '^[a-z][a-z0-9-]*$' and char_length(tradition_id) <= 40),
  add column if not exists languages text[] not null default '{en}'
    check (
      cardinality(languages) between 1 and 2
      and languages <@ array['en', 'hi', 'mr', 'gu', 'bn', 'ta', 'te', 'kn', 'ml', 'pa', 'ur']
    ),
  add column if not exists religious jsonb not null default '{}'
    check (jsonb_typeof(religious) = 'object');

-- Fixed search paths on the helpers that didn't have one (Supabase's security advisor
-- flags these), so a crafted schema can never change what they call
alter function public.touch_updated_at() set search_path = '';
alter function public.keep_event_owner() set search_path = '';
alter function public.media_event_id(text) set search_path = '';
