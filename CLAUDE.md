@AGENTS.md

# Shubh Invitation project notes

- The product is named **Shubh Invitation**, **Shubh** for short (decided 2026-09-27; `site.name` and `site.shortName`). Step 8b renamed everything users see from Shubhdwar; the repository name, database and browser storage keys keep the older names. Brand and SEO rules: `docs/BRAND_SEO.md`.

- Roadmap and current step: `docs/PLAN.md`. Work one step at a time.
- What to build: `docs/PRODUCT.md` (features, categories), `docs/PRICING.md` (personal and business plans, entitlements), `docs/TRADITIONS.md` (regional and religious packs, sacred art rules), `docs/MOTION.md` (regional animation), `docs/PAYMENTS.md` (shagun and commission; never hold customer money), `docs/MEMORIES.md`, `docs/COMPETITORS.md`.
- Use only design tokens from `src/app/globals.css` (Tailwind names such as `bg-paper`, `text-ink`, `border-line`, `bg-marigold`). No raw hex values in components; invitation card stock uses the `card-*` tokens.
- Fonts: `font-display` (Rozha One) for headings and names, `font-sans` (Karla) for body, `font-label` (Tenor Sans) for small uppercase labels.
- Every UI change must work at 320px and 1440px, in light and dark themes, with keyboard focus visible and `prefers-reduced-motion` respected.
- Touch targets are at least 44px.
- Run `npm run check` and `npm run build` before committing.
