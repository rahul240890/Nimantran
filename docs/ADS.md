# Paid ads

How Shubh advertises on Instagram, Facebook, Google Search and YouTube, and the creatives made for it. Written 19 Oct 2026 from research checked that day; prices, specs and policies change, so check the platforms before relying on a number. The videos and images are made in [marketing/videos](../marketing/videos/README.md).

## In short

- **Budget:** start at ₹30,000 a month plus 18% GST: ₹18,000 Meta (Reels, Stories, Feed), ₹9,000 Google Search, ₹3,000 Click-to-WhatsApp test. At ₹15,000, drop the WhatsApp test; at ₹50,000, add ₹5,000 retargeting.
- **Optimise for sign-ups first** (Meta needs about 50 results a week per ad set to learn), then purchases once there are about 50 a week.
- **No Performance Max or Demand Gen** below about ₹2.5–3 lakh a month: Google recommends 15–20× the target cost per sale per day, and calls $100 a day the floor for Demand Gen.
- **Season:** families send invitations 3–8 weeks before the first function. Push from now to mid-January (weddings 21 Nov – 28 Feb), cut in March, restart mid-March for April–June. Diwali week (Lakshmi Puja 8 Nov 2026) raises ad prices; hold budgets flat and do not judge results that week.

## Campaigns

| Channel             | Setup                                                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Meta, new customers | Advantage+ (Sales or Leads), India, 21–60, Advantage+ audience and placements. Ad set A English, ad set B Hindi. 5 concepts a round. |
| Meta, come back     | At ₹50k: visitors in 30 days and people who started an invitation without paying. Price and RSVP ads.                                |
| Click-to-WhatsApp   | About 10% of Meta budget, Hindi, for parents. Needs someone replying within minutes.                                                 |
| Google Search       | Maximise clicks for 2 weeks, then Maximise conversions. Phrase and exact match. Ad groups below.                                     |
| YouTube             | Post the explainer and Shorts free first; paid in-stream (skippable after 5 s) from the ₹50k budget.                                 |

Search ad groups: digital invitation (digital/online wedding invitation, e invite, invitation link), WhatsApp (wedding invitation for whatsapp, shadi card whatsapp), regional (kankotri online, lagna patrika online, Bengali and Tamil wedding card online → the tradition pages), video (wedding invitation video → /pricing), brand (₹50 a day). Negatives: psd, cdr, template download, printing, printer, press, near me, shop, job, course, pdf download.

## Creatives

| Ad          | Hook                                                                       | Kind                       | Cuts                   |
| ----------- | -------------------------------------------------------------------------- | -------------------------- | ---------------------- |
| `gate`      | "This is not a wedding card." The real invitation, full screen.            | Unique, real screen only   | Reel, square, 16:9     |
| `maa`       | "Mom wanted to invite every single relative. Personally."                  | Realistic story, AI photos | Reel, feed 4:5         |
| `sangeet`   | "When the invitation looks this good, everyone in the group opens it."     | Realistic, AI photo        | Reel, feed 4:5         |
| `price`     | "300 printed wedding cards can cost ₹25,000 or more."                      | Direct response            | Reel, feed 4:5, square |
| `pov`       | "POV: you're the bride. And all your invitations went out in one evening." | Trend format, AI photos    | Reel, feed 4:5         |
| `explainer` | "Planning a wedding? The easiest way to invite everyone."                  | How it works               | 16:9, reel             |

Every ad is in English and Hindi. Images: Instagram feed, square, Stories and a 5-slide carousel; YouTube thumbnails and banner; Google 1.91:1, 1:1, 4:5 and logos. File names (`ad-gate-reel-hi`) double as `utm_content`.

## Tracking

| Moment         | Meta event           | Google conversion       |
| -------------- | -------------------- | ----------------------- |
| Design page    | ViewContent          | observed only           |
| Sign-up        | CompleteRegistration | Sign-up (primary first) |
| First save     | InviteCreated        | Invite created          |
| Razorpay opens | InitiateCheckout     | Begin checkout          |
| Payment        | Purchase, INR value  | Purchase, value         |

Pixel and Conversions API send the same `event_id` so Meta counts each event once; Google uses the Google tag with enhanced conversions. Not built yet: it needs the Meta Pixel ID and the Google tag ID (`AW-…`), and a short consent notice (India's DPDP Rules require consent from May 2027).

## Targets

Meta link CTR ≥ 1%, CPC ≤ ₹15, hook rate (3-second views ÷ impressions) 25–30%; Search CTR ≥ 5%; cost per sign-up ₹50–100; cost per paid invitation ₹300–350. Weekly: switch off ads at twice the target cost per sign-up after ₹1,500 spent. Every 10–14 days: add 2–3 genuinely new concepts (Meta treats near-copies as one ad). These benchmarks come from agency data for India in 2025–26 and vary widely.

## Rules

- AI-generated people are models only: never named, quoted or shown as customers, and every ad or image with one carries an "AI-generated image" mark. Meta labels ads with photorealistic AI people beside "Sponsored"; Google shows a visible label on Indian ads with AI assets; India's IT Rules on synthetic content apply since 20 Feb 2026. Declare AI content when a platform asks.
- Meta's personal-attributes policy: never assert the viewer's religion, caste, age or name ("Are you a Hindu bride?"). "Planning a wedding?" and "for Gujarati weddings" are fine.
- The "₹25,000 or more for 300 cards" claim rests on the worked example in the post `digital-vs-printed-wedding-cards`; keep it live while the ad runs.
- Only what the site does today, in its own words where it has them. Prices as on /pricing.
- Replace AI models with real people (brides, mothers, creators, with written permission) as soon as possible, and test them against the AI and screen-only ads.
