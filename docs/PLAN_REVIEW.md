# Nimantran plan review

Reviewed 2026-09-26. Covers [PLAN.md](PLAN.md) (the build plan), [Nimantran_Premium_Plan.pdf](Nimantran_Premium_Plan.pdf) (the business plan) and the two landing page screenshots in [images/](images/).

## Verdict

The idea is strong and the positioning is clear: a WhatsApp link that opens a 3D card, with real RSVP and guest tools, priced per event in rupees. Nobody in the competitor table offers that combination. The pricing structure (per event for families, subscription for businesses) is right, and the build plan's quality bar is unusually thorough.

The main problems are timing and scope. The two documents disagree about what ships at launch, the launch scope is too big for the date the business plan targets, and a few pricing and free-tier rules will hurt conversion or trust. All of these are fixable by cutting and reordering, not by changing the idea.

## Must fix before building further

### 1. The November season is not reachable with the current scope

The business plan says to launch in September or October to catch the November to February wedding season, and that a 2 to 3 person team needs about 3 months. Today is 26 September 2026 and only Step 1 of 33 (project setup and holding page) is done.

Three months from now is late December, the middle of the season, when most invites for December and January weddings have already gone out.

**Recommendation:** pick one of these and write it into both documents.

- **Pilot for this season (recommended):** by mid November ship a narrow version: 1 card format (gate-fold), 3 to 5 templates, English plus Hindi, publish and share link, guest RSVP without login, a simple host guest list, and a Razorpay "remove watermark" payment. Sell it by hand to 20 to 50 families through planners you know. This tests willingness to pay, which is the business plan's own first next step.
- **Full launch for the April to June season:** keep the rest of Phase 1 for a proper launch in March.

### 2. The two documents disagree on launch scope

| Topic                | Business plan (PDF)                                                      | Build plan (PLAN.md)                                               |
| -------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Templates at launch  | 30 across 6 styles                                                       | 6 in Step 5                                                        |
| Payments             | In the Launch phase ("UPI and card payments"), Gate 1 = 100 paid invites | Phase 2, after launch (Steps 15 to 18)                             |
| Card formats         | 8 listed, gate-fold is "current prototype"                               | Gate-fold first, others unscheduled                                |
| Urdu / right-to-left | Phase 2 languages                                                        | Required in the UI quality bar from Step 1; Urdu itself in Step 31 |
| Mobile apps          | Capacitor or React Native                                                | Capacitor, Step 33                                                 |

The payments gap is the serious one. Gate 1 is "100 paid invites", but the build plan has no way to take money until after launch, so the launch can never pass its own gate.

**Recommendation:** move Razorpay checkout and the watermark (Steps 16 and 17) into Phase 1, before Step 14. Treat 6 templates as the real launch number and change the PDF to match; 30 is a goal for the end of the Grow phase.

### 3. Ten languages at launch is too much for a first release

Ten languages means ten font sets, ten translation passes on every screen, native-quality AI wording in each, and layout testing with long Tamil and Malayalam text. It also multiplies every template by ten for proofreading.

**Recommendation:** launch with English plus Hindi, add one or two more (for example Marathi and Gujarati, or whichever region the pilot families come from), and add the rest one at a time. Build with next-intl from day one so adding a language is data, not code. Keep right-to-left testing out of the quality bar until Urdu is actually scheduled.

### 4. The free link expires before the wedding

The Free edition has "link validity 30 days". Indian wedding invites usually go out 4 to 8 weeks before the event, and save-the-dates earlier. A guest who opens a dead link on the wedding morning to find the venue is the worst possible brand moment, and it lands on exactly the people the free watermark is supposed to impress.

**Recommendation:** make every link, free or paid, valid until the last function date plus 7 days. Limit free on features (watermark, 50 RSVPs, 1 function), not on time.

## Should fix

### 5. The revenue example assumes very high conversion

"5,000 invites a month with 20% paying ₹499 is about ₹5 lakh." Freemium products usually convert low single digits. At 5% the same month is about ₹1.25 lakh against ₹60,000 of running costs. That is still positive, which is good news, but the plan should show both numbers.

Also subtract taxes and fees from the headline price. If ₹499 includes 18% GST, the business keeps about ₹423 before payment gateway fees of around 2%. The "margins above 90%" line should be recomputed on that basis.

### 6. Reminders are promised before they exist

The host dashboard features list "send reminders and last-minute changes to all guests at once" for Premium, but WhatsApp Business messaging is Step 22 in Phase 3. The official WhatsApp API also needs template approval and costs money per message.

**Recommendation:** at launch, "reminder" means the host gets a ready-made message and a button that opens WhatsApp with it filled in, sent from their own number. Paid bulk sending comes later as the add-on the PDF already lists.

### 7. Privacy and security need to be designed in, not added at Step 14

- Guest names and phone numbers are personal data under India's Digital Personal Data Protection Act. Show a short consent line on the RSVP form, and delete guest data on a schedule after the event.
- Invite links like `/i/aarav-weds-meera` are guessable. That is fine for the card, but the guest list and host tools must never be reachable from the public link. Use row level security plus a separate, unguessable host URL or login.
- Public RSVP without login will attract spam. Add rate limiting and a light bot check from the first version.
- AI couple art from real photos: only allow photos the host uploads, label AI-generated images, and store consent. This is already in the risk table; it should also be a checklist item in Step 20.

### 8. 3D weight versus the "Lighthouse 90 on slow 3G" rule

Three.js plus React Three Fiber adds a few hundred kilobytes before any models, textures or music. That conflicts with a 90+ mobile Lighthouse score on slow networks unless the page is built in layers.

**Recommendation:** the invite page first renders a static 2D poster of the card with names, dates, venue and the RSVP button, then loads the 3D scene only if the device can handle it. Guests can RSVP before the 3D ever loads. This also gives the 2D fallback for free.

### 9. Video export is the costliest feature; consider doing it on the phone

Rendering the 3D scene to MP4 on a server needs GPUs or slow software rendering. Recording the animation in the host's own browser (canvas capture) costs nothing to serve. Try that first and fall back to a server only if quality is not good enough.

## Nice to have

- **Design system scope (Step 2):** 19 components plus a `/design` gallery before any product screen is a lot of up-front work. Build tokens and the 5 or 6 components the editor needs first, and add the rest when a screen needs them.
- **Validation before code:** the PDF's first next step is "show the prototype to 20 couples and ask what they would pay". That costs nothing and should gate Steps 5 onwards. The landing page is the natural place to start (see below).
- **Seasonality:** the plan relies on festivals to fill quiet months, but festival greetings are mostly free-to-send. Birthdays and first birthdays are the stronger year-round paid occasion; consider moving them up.
- **Competitors:** the table misses the big RSVP-first apps and the many Indian template apps on the Play Store. Worth one more pass before pitching to anyone.

## Landing page screenshots

Both look polished and on-brand: the serif headline, the gold mandala and the maroon gate-fold doors read as premium and Indian without being loud. Light and dark are clearly designed separately, as the quality bar asks.

Issues:

1. **No call to action.** A "coming soon" page with nothing to do wastes every visit. Add a waitlist form (phone or email, plus "wedding month") so the page collects demand for the pilot and gives you people to call.
2. **Small, widely spaced caption text.** "SAMPLE INVITE · TAP TO OPEN" and "SHUBH AARAMBH · COMING SOON" are very small, letter-spaced and low contrast, especially on the dark phone view. Check them against WCAG AA and make sure the tap target is at least 44px tall and works with the keyboard.
3. **"Six more at launch"** commits publicly to 10 languages. If you cut the launch languages (point 3), change this line to "more languages coming".
4. **Mobile card is closed with no hint of 3D.** On the phone the sample card sits below the fold and looks flat until tapped. Consider opening it automatically once when it scrolls into view, respecting reduced motion.

## Suggested next steps

1. Decide between the November pilot and the April launch, and update both documents to one agreed launch scope with payments in it.
2. Add a waitlist form to the landing page and start the 20 family interviews this week.
3. Fix the Step 1 findings in [STEP1_REVIEW.md](STEP1_REVIEW.md) (CI and Playwright first) before starting Step 2.
