# Shubhdwar Memories — 3D gifts

Build order: Phase 2b (M1–M8) in [PLAN.md](PLAN.md), starting once payments work. Launch target: Star Map before Valentine's Day. If the invitation MVP slips past December, target Mother's Day instead.

## Why

Invitations bring a customer once. Memories brings them back every year for birthdays and anniversaries, reusing about 70% of the invitation platform (engine, templates, editor, uploads, accounts, share links, payments, languages).

## Products

| Product            | Receiver sees                                                                                   | Giver enters                            | Best for                                          |
| ------------------ | ----------------------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------- |
| Star Map           | The real night sky over a place and date, rotating in 3D; tapping a star shows a message        | Date, time, city, names, message, photo | Anniversaries, proposals, births, Valentine's Day |
| Travel Globe       | Spinning Earth with pins per place; tapping a pin floats that trip's photos; a path joins trips | Places, dates, photos, captions         | Couples, friends, family trips                    |
| Floating Gallery   | Photos drifting like lanterns, petals or stars with music                                       | 10–100 photos, captions, theme, music   | Birthdays, farewells, Mother's and Father's Day   |
| Our Story (bundle) | Star map of the day they met → globe of trips → gallery → message                               | All of the above                        | Premium gift                                      |

Styles: Star Map (Midnight Blue, Rose Gold, Minimal Line, Kids' Night, Temple Sky with nakshatra names); Globe (Satellite, Vintage Atlas, Night Lights, Watercolour); Gallery (Lantern Night, Rose Garden, Ocean, Diwali Diyas, Starfield).

## Customer loop

1. A couple sends their wedding invite with Shubhdwar.
2. After the wedding, the invite, RSVPs, wishes and photos become a free memory gallery.
3. On the first anniversary: a reminder to send the sky from their wedding night.
4. Every birthday and anniversary brings another gift; receivers become customers.

## Editions and pricing

| Feature                     | Free preview | Gift      | Keepsake   | Our Story  |
| --------------------------- | ------------ | --------- | ---------- | ---------- |
| Price (India / intl)        | ₹0 / $0      | ₹199 / $7 | ₹499 / $15 | ₹699 / $24 |
| Products                    | Any one      | Any one   | Any one    | All three  |
| Watermark                   | Yes          | No        | No         | No         |
| Photos                      | 5            | 20        | 100        | 150        |
| Globe pins                  | 3            | 10        | Unlimited  | Unlimited  |
| Voice or video message      | —            | —         | Yes        | Yes        |
| Reveal box and timed unlock | —            | Yes       | Yes        | Yes        |
| Link lasts                  | 7 days       | 1 year    | Forever    | Forever    |
| HD image download           | —            | —         | Yes        | Yes        |

Add-ons: A3 poster with QR ₹799; framed print ₹1,499–₹2,499; acrylic block or keychain ₹999; 30-second video ₹199; AI caption or poem ₹99; yearly "Our Story" plan ₹999/year.

## Gift experience

- Receiver: opens link → wrapped 3D gift box with their name → unties ribbon → memory unfolds with music → giver's message → can reply (text, voice, reaction) and save to their account.
- Giver: timed unlock (countdown to midnight), scheduled send, group gifts, surprise mode, opened notification.
- Privacy: unguessable links, optional 4-digit PIN, delete any time.

## Sales calendar

| When             | Occasion                         | Lead product                                |
| ---------------- | -------------------------------- | ------------------------------------------- |
| February         | Valentine's Day                  | Star Map, Rose Gold                         |
| March–April      | Holi, Easter, farewells          | Gallery                                     |
| May              | Mother's Day                     | Gallery, Rose Garden                        |
| June             | Father's Day                     | Globe, Vintage Atlas                        |
| August           | Raksha Bandhan, Friendship Day   | Gallery and Globe                           |
| October–November | Karva Chauth, Diwali             | Star Map, Temple Sky; Gallery, Diwali Diyas |
| December         | Christmas, New Year              | Our Story                                   |
| All year         | Birthdays, anniversaries, births | Saved-date reminders                        |

## Technical notes

| Product          | How                                                                        | Data and libraries                                                                                                  |
| ---------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Star Map         | Convert star positions to what an observer at that city, date and time saw | Public-domain bright-star catalogue (~9,000 naked-eye stars), constellation lines, astronomy-engine, city geocoding |
| Travel Globe     | Textured Earth, pins from lat/long, arcs between trips                     | Earth textures, geocoding, optionally three-globe                                                                   |
| Floating Gallery | Photo cards on paths through a themed scene                                | Image resizing, existing particles                                                                                  |

Tables: `memories`, `memory_items`, `gift_deliveries`, `gift_replies`, `saved_dates`.

Performance: photos resized to 1600px plus thumbnails; star catalogue as a compact binary loaded only on the star map; same quality levels and 2D fallback as invitations. Extra cost about ₹1–₹3 per gift.

Validate star positions against a planetarium app for several dates and cities before launch.

## Steps

| Step | Scope                                                                 | Weeks |
| ---- | --------------------------------------------------------------------- | ----- |
| M1   | Tables, "My creations", Invite and Memories entry points              | 1     |
| M2   | Star Map scene, 5 styles, 2D fallback                                 | 1.5   |
| M3   | Memory editor, live preview, free watermarked preview                 | 1     |
| M4   | Gift delivery: reveal box, timed unlock, scheduled send, PIN, replies | 1.5   |
| M5   | Gift pricing and checkout                                             | 0.5   |
| M6   | Travel Globe                                                          | 1.5   |
| M7   | Floating Gallery, group gifts                                         | 1.5   |
| M8   | Our Story bundle, print orders, video export, saved-date reminders    | 2     |
