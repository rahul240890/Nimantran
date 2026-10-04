-- Hosts' own music clips (2026-10-04): a short AAC or WAV file the editor trims in the
-- browser, kept beside the photos at <event id>/<clip id>.m4a|.wav with a media row of
-- kind 'audio'. The bucket only took pictures until now.
update storage.buckets
set allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'audio/mp4', 'audio/wav']
where id = 'event-media';
