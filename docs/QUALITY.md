# Quality

Where the app stands on speed, accessibility and testing, and what the owner checks on
real phones before launch (docs/PLAN.md, Step 13).

## Lighthouse (mobile, simulated slow 4G)

Measured on a production build on 2026-09-27. Accessibility, Best Practices and SEO score
100 on every public page. The app pages (sign-in, editor, guest invitations) score 63 on
SEO on purpose, because they ask search engines not to index them.

| Page                   | Before       | After | What the rest is                                     |
| ---------------------- | ------------ | ----- | ---------------------------------------------------- |
| `/`                    | 66           | 94    | Scripts for the live hero card and music demo        |
| `/hi`                  | 90           | 73–84 | The Devanagari fonts (about 190 KB), see below       |
| `/invitations/wedding` | 77           | 90    | React itself (about 70 KB)                           |
| `/designs`             | 73           | 90    |                                                      |
| `/designs/paithani`    | 76           | 90    |                                                      |
| `/sign-in`             | 89           | 92    |                                                      |
| `/create`              | 86           | 85–87 | The editor, which loads everything it needs up front |
| `/i/<link>` (guest)    | not measured | 86    | The 3D card; accessibility 100                       |

What changed:

- English pages no longer download the Devanagari fonts (about 190 KB) for the few Hindi
  words in the footer; those words use the phone's own font there (`font-system`).
- Pages that only show designs, occasions or invitations no longer send the form
  validator (zod, about 85 KB compressed). Its schemas live in their own modules
  (`templates/ids.ts`, `categories/ids.ts`, `editor/draft-checks.ts`,
  `templates/content-schema.ts`), and the home page's waitlist loads it after the page
  has painted.
- Each page gets only the words it shows: copy is split per area (`src/i18n/copy/*.ts`)
  instead of one module holding every screen's text in both languages.

Hindi pages are the one weak spot. They need Noto Sans Devanagari (118 KB) and Rozha One's
Devanagari (71 KB) before their words look right, and Lighthouse counts those fonts
whenever they arrive before the first paint, which is why the score swings between runs
(the earlier 90 was one of the lucky ones; the fonts and the page did not get heavier).
The next step is cutting those fonts down to the letters Hindi pages use, or letting
Android phones use their own copy of Noto Sans Devanagari.

To measure again: `npm run build`, `npx next start -p 3200`, then run Lighthouse against a
page with `--form-factor=mobile` (its default), or use PageSpeed Insights on the live site.
Scores move a few points between runs; look at several before deciding anything.

## Automated checks

- `npm run check`: lint, types, formatting and 641 unit tests.
- `npx playwright test`: 331 browser tests at 320px and 1440px, including:
  - create, publish, RSVP and the host's dashboard (`publish`, `rsvp`, `dashboard` specs),
    in light and dark;
  - a strict accessibility sweep of all 61 public and app pages: WCAG 2.2 AA plus axe's
    best practices, and nothing wider than a 320px screen (`quality.spec.ts`);
  - a guest opening an invitation and replying with the keyboard alone, with focus visible
    at every stop (`quality.spec.ts`).

## Real phones (owner task before launch)

Automated tests run in desktop Chrome. Before launch, try the live site on real phones. A
low-end Android (2 to 3 GB of memory, such as a Redmi or Samsung Galaxy A0x) and an
iPhone matter most, because most guests will open invitations on them from WhatsApp.

For each phone:

1. Send yourself a published invitation on WhatsApp. Check that the preview shows the card
   and the names, then tap it.
2. The card opens smoothly, the gates swing and the music starts after a tap. Nothing
   stutters for more than a moment.
3. Turn on Reduce Motion (iPhone: Settings, Accessibility, Motion; Android: Settings,
   Accessibility, Remove animations). The card should appear without the 3D opening.
4. Reply to the invitation. Check that the keyboard doesn't cover the field you're typing
   in, and that the thank-you shows.
5. Add a function to the calendar and open the map for the venue.
6. Switch the phone to dark mode and look at the invitation and the home page.
7. Turn the phone sideways once.
8. As the host, open the dashboard and check that the reply arrived.

Note anything that looks wrong with the phone's model, and send a screenshot in the
project chat.
