@AGENTS.md

# Nimantran project notes

- Roadmap and current step: `docs/PLAN.md`. Work one step at a time.
- Use only design tokens from `src/app/globals.css` (Tailwind names such as `bg-paper`, `text-ink`, `border-line`, `bg-marigold`). No raw hex values in components; invitation card stock uses the `card-*` tokens.
- Fonts: `font-display` (Rozha One) for headings and names, `font-sans` (Karla) for body, `font-label` (Tenor Sans) for small uppercase labels.
- Every UI change must work at 320px and 1440px, in light and dark themes, with keyboard focus visible and `prefers-reduced-motion` respected.
- Touch targets are at least 44px.
- Run `npm run check` and `npm run build` before committing.
