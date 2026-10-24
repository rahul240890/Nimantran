@AGENTS.md

# Shubh Invitation project notes

- The product is named **Shubh Invitation**, **Shubh** for short (decided 2026-09-27; `site.name` and `site.shortName`). Step 8b renamed everything users see from Shubhdwar; the repository name, database and browser storage keys keep the older names. Brand and SEO rules: `docs/BRAND_SEO.md`.

- Roadmap and current step: `docs/PLAN.md`. Work one step at a time.
- What to build: `docs/PRODUCT.md` (features, categories), `docs/PRICING.md` (personal and business plans, entitlements), `docs/TRADITIONS.md` (regional and religious packs, sacred art rules), `docs/MOTION.md` (regional animation), `docs/PAYMENTS.md` (shagun and commission; never hold customer money), `docs/MEMORIES.md`, `docs/COMPETITORS.md`.
- Use only design tokens from `src/app/globals.css` (Tailwind names such as `bg-paper`, `text-ink`, `border-line`, `bg-marigold`). No raw hex values in components; invitation card stock uses the `card-*` tokens.
- Fonts (owner, 2026-10-24): `font-display` (Fraunces, medium; Noto Serif Devanagari for Hindi and Marathi) for headings and names, `font-sans` (Karla) for body, `font-label` (Karla, semi-bold) for small uppercase labels, on the smaller type scale in `globals.css` (`text-ui` for buttons and menu rows). Invitations keep the lettering they were designed in: anything marked `data-invitation` (the guest page, openings, card covers) sets headings in Rozha One and labels in Tenor Sans at Tailwind's own sizes; `font-card-display` gives Rozha One anywhere else.
- Public pages (header, footer, home, gallery, public pages) are `max-w-site` wide (90rem, `--container-site`), so a laptop shows more designs; app pages keep their own widths.
- Every UI change must work at 320px and 1440px, in light and dark themes, with keyboard focus visible and `prefers-reduced-motion` respected.
- Touch targets are at least 44px.
- Run `npm run check` and `npm run build` before committing.
