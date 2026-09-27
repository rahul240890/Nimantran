# Event page themes (Step 12e)

After the doors open, an invitation turns into full-screen pages: the cover, the family, one page per function, then the reply. A **theme** paints those pages. It is only the look. The tradition pack still gives the ceremony names, blessing and sacred symbol, and the card language gives the words, so any theme works for any family.

| Theme        | Place                                              | Page turn   | Card design | Suggested by          |
| ------------ | -------------------------------------------------- | ----------- | ----------- | --------------------- |
| Rajwada Bagh | Palace garden through a Mughal arch, fountains     | Arch reveal | Emerald     | North Indian, Marathi |
| Shahi Savari | Elephants with howdahs before a desert fort        | Sweep       | Rang Mahal  | Rajasthani, Gujarati  |
| Kayal        | Houseboat on the Kerala backwaters, floating lamps | Ripple      | Kasavu      | Tamil, Bengali        |
| Card colours | The card's own paper and the Step 12d scenes       | Fade        | (any)       | Modern                |

Without a tradition, the design decides (Kasavu, Gopuram and Alpona suggest Kayal; Rang Mahal and Bandhani suggest Shahi Savari), and otherwise Rajwada Bagh. The host can pick any theme in the editor's design step.

## Light per page

Each page has a mood that repaints the sky, sun or moon, and silhouettes: `dawn` (haldi, pujas, vidaai), `day` (family, mehendi, tilak, mandap, mameru), `dusk` (cover, wedding, baraat, roka and engagement) and `night` (sangeet, garba, bhoj, reception, reply). The table is `pageLook()` in `src/lib/suites/catalog.ts`; colours are `--suite-*` tokens per theme and mood in `src/app/globals.css`.

## Adding painted backgrounds

The vector landscapes are the fallback and stay. A painted background replaces the vector art for one page kind of one theme.

1. Generate with the prompts in `event-pages-proposal.md` (project files). Portrait 9:16 at 1080×1920; no people, faces, deities, sacred symbols or text; keep the middle third calm, because the reading plate sits there.
2. Check the image tool's terms allow commercial use.
3. Convert to WebP at quality about 75, aiming for 150 to 250 KB each.
4. Save as `public/suites/<theme>/<page>.webp`, where page is one of `cover`, `family`, `haldi`, `mehendi`, `sangeet`, `baraat`, `wedding`, `reception`, `reply`.
5. List it in that theme's `images` in `src/lib/suites/catalog.ts`, for example `images: { cover: "/suites/kayal/cover.webp" }`.

Functions without their own painting use the closest one (garba uses sangeet, a puja uses wedding, mameru uses family). A painting carries its own light, so paint the haldi page in morning light and the sangeet page at night.

## Later

- Faith-specific themes whose art carries the faith: a Nikah garden with jaali and a crescent, a chapel with florals, Anand Karaj. These come with the Muslim, Christian and Sikh packs in Step 23.
- Guests invited to some functions see only those pages.
- Music per theme (shehnai for Rajwada Bagh, nadaswaram for Kayal).
- Pages saved as images for WhatsApp Status, and the MP4 export (Step 17c) plays the same pages.
