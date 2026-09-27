# Shubh Invitation — Product Specification

What we are building, in full. The build order lives in [PLAN.md](PLAN.md); this file is the feature catalogue every step builds from.

Related: [TRADITIONS.md](TRADITIONS.md) (tradition packs), [MEMORIES.md](MEMORIES.md) (3D gifts), [COMPETITORS.md](COMPETITORS.md) (Paperless Post and the Indian market), [PLAN_REVIEW.md](PLAN_REVIEW.md) (open recommendations).

## Built so far

This file describes the full product. Only part of it exists today, so check this list before claiming a feature on the website or in marketing:

- **Built:** the 3D engine with a 2D fallback, the gate-fold format, 12 templates (six classic and six regional Rang designs: Rajasthani, Maharashtrian, Gujarati, Bengali, Tamil and Punjabi), music composed live from 12 ragas (no track library or uploads yet), the invite editor with autosaved drafts in the browser, and the category system with the wedding journey (roka, engagement, save-the-date, haldi, mehendi, sangeet, wedding, reception) ordered by season and region, accounts (mobile number or Google sign-in, profile, My invites), and the database with row level security, where invites save to the account and follow the host across devices, photos included. Publishing (Step 9): a link like /i/aarav-weds-meera, a share page with WhatsApp, copy, the phone's share sheet and a printable QR code, a link preview drawn in the design's colours, and a guest page with the 3D card, every function with directions and add-to-calendar, and the photos. Guest RSVP (Step 10): guests reply to each function in one tap without signing in, with adults and children, the host's questions and a note, and can change their reply later; the share page shows the replies. Host dashboard (Step 11): a guest list per invite with opened, replied and waiting counts, head counts per function, search and filters, pasting a whole list at once, a personal WhatsApp link per guest, one-tap WhatsApp reminders from the host's own number, CSV download, and co-hosts who join from a private link. The home page plays each design's raga from a strip under the header. Languages (Step 12): the whole site in English and Hindi, with a language menu; the home page at / and /hi. Traditions (Step 12a): a Tradition step with six regional Hindu packs and a Modern one, setting the sacred symbol, invocation, local ceremony names and family wording (drafts until community review), exact muhurat windows and end times, and two-language cards (the tradition's language and English, or English and Hindi) that guests switch between. Search (Step 12b): indexable pages for every occasion, tradition and design in English and Hindi, with a sitemap, language links and structured data.
- **Not built yet:** scheduled sending, automatic SMS and email reminders, site languages other than English and Hindi, cards in more than the first six languages, deity artwork, packs beyond the first seven, payments, and every other card format.

---

## 1. Positioning

**Name:** Shubh Invitation, called Shubh for short and in the app (decided 27 September 2026; tagline "Invitations That Come Alive."). It replaced Shubhdwar (Step 8a), which replaced Nimantran; the rename (Step 8b) is done. Shubh is an AI-powered interactive invitation platform for digital, animated and 3D invitations for every occasion, worldwide; Indian weddings stay the first market. Only the repository, the original business plan and a few hidden keys keep the older names. Brand and SEO plan: [BRAND_SEO.md](BRAND_SEO.md).

A WhatsApp link that opens a 3D invitation, with real RSVP and guest tools, in the family's own language, for one clear price per event.

- **Families** pay once per event (most host a wedding once).
- **Businesses** (planners, printers, studios, venues) pay a subscription.
- **Start:** Indian weddings → all Indian occasions → the diaspora → global cultures.

## 2. Product lines

All lines share one 3D engine, one account ("My creations"), one category system and one checkout.

| Line           | What it is                                                                      |
| -------------- | ------------------------------------------------------------------------------- |
| 3D Invitations | Core product: interactive 3D card, functions, RSVP, host dashboard              |
| Event Pages    | Free, fast, text-first event page with RSVP; upsell to 3D                       |
| Memories       | 3D gifts: Star Map, Travel Globe, Floating Gallery ([MEMORIES.md](MEMORIES.md)) |
| Greeting Cards | Thank-you, festival greetings, shagun cards, condolence                         |

## 3. Categories and occasions

Categories are data, not code: name in every language, icon, season, region, templates, default functions and default RSVP questions. One template can sit in several categories. The home screen reorders categories by season and region.

| Group                   | Occasions                                                                                                       | Phase |
| ----------------------- | --------------------------------------------------------------------------------------------------------------- | ----- |
| Wedding journey         | Roka, engagement, haldi, mehendi, sangeet, wedding, reception, save-the-date, Nikah, Anand Karaj                | MVP   |
| Birthdays               | Kids', adult, first birthday, milestone (50th, 60th)                                                            | 3     |
| Baby                    | Baby shower, godh bharai, naamkaran, mundan, annaprashan, announcements                                         | 3     |
| Home and religious      | Griha pravesh, puja, satyanarayan katha, bhoomi pujan, gurdwara and church events                               | 3     |
| Festivals               | Diwali, Eid, Holi, Navratri, Onam, Pongal, Lohri, Christmas, New Year                                           | 3     |
| Parties and dining      | Get-togethers, kitty party, bachelor and bachelorette, farewell, dinner, retirement, iftar, cricket watch party | 3     |
| Business                | Shop openings (udghatan), launches, VIP events, meetings, dealer meets, office Diwali party, conferences        | 4     |
| Education and nonprofit | College fests, school annual day, convocation, reunions, awards, fundraisers                                    | 4     |
| Global                  | Western weddings, quinceañera, bar and bat mitzvah, Chinese weddings, graduation                                | 5     |

## 4. Card formats

| Format                | Description                                          |
| --------------------- | ---------------------------------------------------- |
| Gate-fold             | Two doors swing open (built)                         |
| Envelope              | Wax seal breaks, letter slides out                   |
| Scroll                | Royal scroll unrolls (Rajasthani, Mughal themes)     |
| Pop-up book           | Pages flip, a scene pops up per function             |
| Photo cube / carousel | Rotating 3D gallery of the couple                    |
| Venue walk-through    | Stylised palace, mandap or garden to explore         |
| Multi-event card      | One link, a tab per function                         |
| Save-the-date teaser  | 5–10 second reveal for WhatsApp status and Instagram |

## 5. Templates

Launch with 6 built templates (Marigold Gate, Rose Garden, Emerald Palace, Royal Scroll, Minimal Monogram, Kerala Kasavu); grow to 30+ by the end of Phase 3, adding 10–15 a month timed to seasons.

| Style family         | Look                          | Examples                                                                                          |
| -------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------- |
| Royal heritage       | Palaces, jharokhas, gold foil | Rajasthani Mahal, Mughal Garden, Mysore Durbar                                                    |
| Regional traditional | State art and customs         | Kerala Kasavu, Bengali Alpona, Tamil Kolam, Punjabi Phulkari, Marathi Paithani, Gujarati Bandhani |
| Faith-based          | Sacred symbols and colours    | Ganesh Vandana, Nikah Crescent, Anand Karaj, Christian Chapel                                     |
| Floral and pastel    | Flowers, watercolour          | Marigold Shower, Jasmine Night, Blush Peony                                                       |
| Modern minimal       | Clean type, subtle motion     | Monogram, Line Art, Glass and Gold                                                                |
| Fun and illustrated  | Caricatures, playful scenes   | Caricature Couple, Baraat on Wheels, Destination Beach                                            |

Customisation levels: **basic** (names, date, venue, message, photo) → **style** (colours, fonts, music, petals) → **advanced** (functions, animations, own artwork; premium).

Card details included in editions, never charged per guest: wax seals, tassels, foil, backgrounds, envelope and door styles.

Later: **designer and artist collections** with Indian designers, illustrators and textile brands (revenue share), and a **creator marketplace** (designers keep 50–70%).

## 5a. Traditions

One choice in the editor (region, community, card languages) sets the deity or sacred symbol, invocation, palette, motifs, ceremony names, host order and wording structure. Twelve launch packs: North Indian Hindu, Rajasthani/Marwari, Marathi, Gujarati, Bengali, Tamil, Telugu, Kerala (Hindu, Christian, Muslim), Punjabi Sikh, Muslim, Christian, Jain, plus a Modern pack without religious symbols. Original commissioned sacred art only; respect rules enforced in code; every pack reviewed by the community before launch. Full spec: [TRADITIONS.md](TRADITIONS.md).

A colourful **Rang** template family (Rang Mahal, Paithani Mor, Bandhani Utsav, Alpona Lal, Gopuram Pon, Phulkari Rang) sits beside the elegant designs.

## 5b. Motion

Each tradition pack has its own opening animation (a kolam drawing itself, a conch and alpona for Bengali, a phulkari unfolding for Punjabi, calligraphy for Muslim families), plus per-function scenes, regional petals and particles, and a diya countdown. Full, Light and Still versions for every phone. Spec: [MOTION.md](MOTION.md).

## 6. Languages

| Phase  | Languages                                                                              |
| ------ | -------------------------------------------------------------------------------------- |
| Launch | English, Hindi, Marathi, Gujarati, Bengali, Tamil, Telugu, Kannada, Malayalam, Punjabi |
| Later  | Urdu, Odia, Assamese, Sindhi, Konkani, Nepali                                          |
| Global | Arabic, Spanish, French, Portuguese, Indonesian, Chinese, Swahili                      |

- Two languages per invite; guests switch with one tap.
- Script fonts loaded only when used.
- AI writes wording natively in each language.
- Ready phrases: shlokas, "Shubh Vivah", Bismillah, Ik Onkar, Bible verses.
- Right-to-left layouts for Urdu and Arabic.
- Optional tithi and Hijri dates; local currency and payment methods.

_Open: PLAN_REVIEW.md recommends launching with English and Hindi first and adding the rest one at a time._

## 7. Guest experience (all editions)

- Opens instantly from WhatsApp, SMS, email or QR, on any phone, no install.
- 3D card with music; 2D fallback on weak phones and slow networks.
- Tab per function: date, time, venue map, dress code and colour theme.
- One-tap RSVP per function: guest count, plus-ones, message, host's custom questions (meal, arrival date, room needed, pickup).
- Add to calendar, directions.
- Two-language toggle.

## 8. Host tools

- Step-by-step editor with live 3D preview and autosaved drafts.
- **Co-hosts:** both families manage one event and guest list.
- Live guest list: opened, replied, pending; filters, search, CSV export.
- Import contacts from phone or spreadsheet.
- **Scheduled sending** per function; **automatic reminders** to non-responders (email and SMS; WhatsApp later).
- Broadcast last-minute changes (venue or time moved).
- Edit after publishing.
- Seating, travel and stay details (Royal).
- After the event: shared guest photo album, thank-you cards, memory gallery.

## 9. Plans and pricing

Full detail, rules and entitlements: [PRICING.md](PRICING.md). Flat prices, never coins or per-guest charges; every link stays live until the last function date plus 7 days. Indian prices include GST.

**Personal, per event**

| Pass           | India  | International | For                                                                                         |
| -------------- | ------ | ------------- | ------------------------------------------------------------------------------------------- |
| Free           | ₹0     | $0            | Trying it: 1 function, basic designs, 50 RSVPs, watermark                                   |
| Premium        | ₹499   | $9            | Most events: up to 3 functions, 500 RSVPs, 2 languages, no watermark                        |
| Royal          | ₹1,999 | $29           | Big weddings: unlimited functions and guests, exclusive designs, seating and travel, AI art |
| Wedding bundle | ₹2,999 | $49           | Royal for every function, plus save-the-date and thank-you cards                            |

**Personal, yearly:** Family Plus ₹999/year ($29): unlimited Premium-level events for birthdays, anniversaries, festivals and pujas; 2 Memories gifts; greeting cards; 4 family accounts; ₹500 off a wedding pass.

**Business:** Starter ₹999/month or ₹9,999/year (10 client events a month, 2 team members); Pro ₹2,999/month or ₹29,999/year (unlimited events, 10 team members, own branding, reseller passes at 30% off); Enterprise custom (white-label, SSO, API). 14-day free trial.

## 10. Add-ons

| Add-on                           | Price (India)         |
| -------------------------------- | --------------------- |
| AI couple portrait (5 images)    | ₹199                  |
| Cinematic MP4 export             | ₹299 / video          |
| AI voice invitation              | ₹199                  |
| Wedding website                  | ₹999                  |
| Own domain                       | ₹1,499 / year         |
| Printed cards with QR            | Partner commission    |
| WhatsApp bulk send and reminders | Message cost + margin |
| Seating and travel planner       | ₹499                  |
| Shagun and gift registry         | Small fee per gift    |
| Live-stream page                 | ₹499                  |
| Memory album (forever)           | ₹299                  |
| Thank-you cards                  | ₹199                  |
| Human designer touch-up          | ₹999+                 |

## 10a. Payments and commission

Guests send shagun from the invite: free by direct UPI with a shagun ledger, or through the platform (UPI, cards) with a small visible fee. Group contributions and event ticketing earn a commission. A licensed payment provider splits every payment; we never hold customer money. Spec and legal checklist: [PAYMENTS.md](PAYMENTS.md).

## 11. Business edition

- Client workspaces, own branding, bulk edits, reseller pricing.
- Business and education categories (section 3).
- Print partner orders: printed card with a QR code to the 3D invite.
- Subscription billing.

## 12. Technical choices

Next.js 16, React 19, TypeScript strict, Tailwind v4, Radix UI, React Three Fiber, Motion, React Hook Form + Zod, Supabase (Postgres, phone OTP auth, storage, Row Level Security), next-intl, Razorpay (India), Stripe (global), Claude API for wording, an image API for couple art, Vitest, Playwright, Vercel.

**Cost to serve:** AI and hosting about ₹2–₹20 per invite.

| Stage   | Invites / month | Running cost (estimate) |
| ------- | --------------- | ----------------------- |
| Launch  | 500             | ~₹7,000                 |
| Growing | 5,000           | ~₹60,000                |
| Scale   | 50,000          | ~₹4.6 lakh              |

## 13. Risks

| Risk                     | Response                                                                               |
| ------------------------ | -------------------------------------------------------------------------------------- |
| Competitors add 3D       | Win on guest tools, languages, multi-function weddings                                 |
| Old phones               | Automatic 2D fallback                                                                  |
| Free WhatsApp images     | Generous free edition; watermark spreads the brand                                     |
| Seasonal sales           | Festivals, birthdays, business invites, Memories fill quiet months                     |
| AI misuse of real photos | Host-uploaded photos only, content checks                                              |
| Guest data privacy       | Consent, data kept only while the invite is live, follow India's data protection rules |
