# Site redesign

**Decision (owner, 24 November 2026):** redesign the public site and the app's own pages so they feel calm and clear. Direction A: one family, Anek, for every script. Visual proposal: [Shubh redesign direction](https://claude.ai/artifact/3z9Cbbkv1c4ouvjGHM5wKP).

## Why

- Search Console (28 days to 24 November 2026): 88% of impressions are on phones, 9 of the top 10 pages by clicks are blog posts, and the Bengali wedding card wording post brings 36% of all clicks. Most visitors first meet a blog post in an Indian script on a phone, so those pages lead the redesign.
- Each language fell through to a different font (Fraunces and Karla for English, Baloo Da 2 for Bengali, Hind Vadodara for Gujarati, Noto for Hindi).
- 48 text sizes in components, 37 of them one-off values; 169 spaced-out capital labels.
- The home page is about 24,000px tall on a phone; a design card has nine parts, each with its own orange button.

## The idea

Let the paintings be the only colour. The site is quiet paper and ink around them.

## Rules

- **Type:** Anek in every script (`--site-face`), the page's own script first. Headings semi-bold (600), text regular (400), labels medium (500) in sentence case. Five sizes: page title 32/48, section 24/30, card title 18, body 17, small 14.
- **Colour:** paper `#fffcf7`, ink `#221a1f`, maroon `#7d1d3a` for links, labels and focus (`accent-text`, `ring`), marigold only on the main button, hairline `#ece4d8`. Dark: paper `#16121a`, ink `#f3ece4`, rose `#eaa0b4` for links.
- **One main button per screen.** Everything else is an outline or a link.
- **Paintings first.** A design card is the painting, its name and its price, with at most one tag; the whole card opens it.
- **No boxes inside boxes.** Hairlines and space separate things, not shadows.
- **One offer, one place.** A thin line under the header; no pop-up on a first visit.
- **Phone first**, 320px to 1440px, light and dark, 44px targets, visible focus, reduced motion.
- **Invitations keep their own lettering and art** (`data-invitation`).

## SEO guardrails

Every public address, page title, description, hreflang and structured-data block stays as it is (or is redirected). The blog keeps its answer-first layout, table of contents, FAQ and Copy buttons. Fonts load only for the script on the page.

## Phases

Each phase is one pull request with phone and desktop screenshots in light and dark, approved before the next starts.

1. **Foundations.** Anek in every script, new paper, ink and maroon tokens, sentence-case labels. _In review._
2. **Blog and wording pages.** Answer first, samples as a list with Copy, a sticky "make this card" button, related posts.
3. **Header, footer and home.** Simpler menu, paintings on the first screen, six sections instead of nine, offer bar only.
4. **Designs gallery and design pages.** The three-part card, filters in one row, one Use this design button per design page.
5. **Pricing, help, legal, account and editor chrome.** The same rules carried into the app pages. Split `globals.css` so site pages stop downloading invitation motion.
