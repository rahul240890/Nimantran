@AGENTS.md

# Shubhdwar project notes

- The product is named **Shubhdwar** (decided 2026-09-26). Step 8a renamed everything users see; the repository name, database and browser storage keys keep "nimantran". Brand and SEO rules: `docs/BRAND_SEO.md`.

- Roadmap and current step: `docs/PLAN.md`. Work one step at a time.
- What to build: `docs/PRODUCT.md` (features, categories, editions, pricing), `docs/TRADITIONS.md` (regional and religious packs, sacred art rules), `docs/MEMORIES.md`, `docs/COMPETITORS.md`.
- Use only design tokens from `src/app/globals.css` (Tailwind names such as `bg-paper`, `text-ink`, `border-line`, `bg-marigold`). No raw hex values in components; invitation card stock uses the `card-*` tokens.
- Fonts: `font-display` (Rozha One) for headings and names, `font-sans` (Karla) for body, `font-label` (Tenor Sans) for small uppercase labels.
- Every UI change must work at 320px and 1440px, in light and dark themes, with keyboard focus visible and `prefers-reduced-motion` respected.
- Touch targets are at least 44px.
- Run `npm run check` and `npm run build` before committing.
