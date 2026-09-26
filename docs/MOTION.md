# Motion — regional animation and graphics

Every tradition opens its own way. This spec adds regional opening animations, per-function scenes, regional particles and other effects on top of the 3D engine (Step 4) and tradition packs ([TRADITIONS.md](TRADITIONS.md)).

Build order: Step 12c (engine hooks, first six packs, countdown), Step 23 (remaining packs, per-function scenes), Step 21 (the same scenes in MP4 export). See [PLAN.md](PLAN.md).

---

## 1. Principles

- **Meaning over spectacle.** Each motion comes from the tradition's own ritual objects (kolam, conch, lamp, phulkari), never generic sparkles pasted on.
- **One orchestrated opening, then calm.** The opening runs 3–6 seconds; after it, only gentle ambient motion (petals, lamp flicker) continues.
- **Sacred art moves gently.** Deities and sacred symbols never spin, bounce or zoom fast; they glow, and flowers fall before them (respect rules in TRADITIONS.md, section 5).
- **Always three versions.** Full (capable phones and desktops), Light (low-end phones: fewer particles, no shadows, lower resolution), Still (reduced motion or no WebGL: a finished frame with a soft fade). The engine's existing quality levels choose automatically.
- **Sound only after a tap,** with a visible mute; never autoplay audio.
- **Budget:** 60fps on a mid-range phone in Full, 30fps floor in Light; each pack's motion assets under 300 KB compressed.

## 2. Opening motion per tradition pack

| Pack                 | Opening sequence                                                                                | Ambient after opening         | Sound (optional)                  |
| -------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------- | --------------------------------- |
| North Indian Hindu   | Doors swing open, mangal kalash glows, marigold garlands swing down                             | Marigold petals, diya flicker | Shehnai                           |
| Rajasthani / Marwari | Palace jharokha doors open, an elephant procession crosses behind, garlands swing               | Floating lanterns, marigold   | Shehnai, folk                     |
| Marathi              | Rangoli forms at the base, haldi-kumkum sprinkle, Paithani peacock border shimmers              | Turmeric motes, marigold      | Sanai-choughada                   |
| Gujarati             | Kites fly across, bandhani dots bloom into colour, mirror-work glints                           | Kites drifting, confetti      | Garba rhythm                      |
| Bengali              | Conch sounds, alpona draws itself around the edge, a Prajapati butterfly flutters to the names  | Butterflies, red-white petals | Conch, shehnai                    |
| Tamil                | A kolam draws itself, the kuthuvilakku lamp lights, mango-leaf thoranam sways                   | Jasmine petals, lamp flicker  | Nadaswaram                        |
| Telugu               | Kalasham glows, muggulu (rangoli) forms, pandiri frame rises                                    | Jasmine and marigold          | Nadaswaram                        |
| Kerala               | Nilavilakku lights wick by wick, a pookalam flower carpet blooms                                | Jasmine, soft lamp glow       | Chenda (Hindu), bells (Christian) |
| Punjabi Sikh         | Dhol beat, a phulkari cloth unfolds, Ik Onkar glows                                             | Marigold, phulkari threads    | Dhol                              |
| Muslim               | Arabic or Urdu calligraphy writes itself stroke by stroke, lanterns glow, jaali pattern appears | Lanterns, soft stars          | Instrumental or none              |
| Christian            | Doves rise, church doors open, bells chime                                                      | White petals                  | Bells, choir                      |
| Jain                 | Swastika and Jain symbol glow softly, white flowers fall                                        | White petals                  | Soft instrumental                 |
| Modern               | Doors or monogram reveal, gold line draws                                                       | Minimal particles             | Piano                             |

Muslim, Sikh and Jain packs keep `figuresAllowed` rules: no deity or human figures in motion either.

## 3. Per-function scenes (Step 23)

Each function tab in the invite has its own short scene when the guest opens it:

| Function                                  | Scene                                                                    |
| ----------------------------------------- | ------------------------------------------------------------------------ |
| Haldi                                     | Turmeric splash in yellow, marigold confetti                             |
| Mehendi                                   | A henna pattern draws itself on a hand outline                           |
| Sangeet                                   | Stage lights sweep, music notes, dhol or disco depending on style        |
| Baraat                                    | Small procession: dhol, horse or vintage car (family chooses), fireworks |
| Wedding / pheras                          | Sacred fire glow, garlands meet (jaimala), akshat rice falls             |
| Anand Karaj                               | Gurdwara silhouette, four laavan shown as four soft glows (no figures)   |
| Nikah                                     | Calligraphy and lanterns, no figures                                     |
| Reception                                 | Chandelier sparkle, champagne-gold confetti                              |
| Gaye Holud / Nalangu / regional functions | Pack-specific objects (turmeric bowl, betel leaves, lamps)               |

## 4. Particle and element library

| Set                                   | Used by                      |
| ------------------------------------- | ---------------------------- |
| Marigold, rose, jasmine, lotus petals | Most Hindu packs, by region  |
| Akshat (rice grains)                  | Wedding moments              |
| Diyas and lamps (flicker shader)      | Hindu, Jain, Diwali          |
| Butterflies                           | Bengali (Prajapati)          |
| Kites                                 | Gujarati, Makar Sankranti    |
| Lanterns                              | Muslim, Rajasthani, Diwali   |
| Doves                                 | Christian                    |
| Confetti in pack palette              | Parties, reception           |
| Sparklers and fireworks               | Diwali, New Year, baraat     |
| Snow and stars                        | Christmas, Memories star map |

Particles are GPU-instanced and share one system (`src/lib/engine/particles.ts`); each set is data (shape, colour from pack palette, count per quality level, fall speed, sway).

## 5. Drawn-on effects

Kolam, alpona, rangoli, muggulu, mehendi and calligraphy "draw themselves". Implementation:

- Store each pattern as ordered vector strokes (the same vector ornament pipeline as templates).
- Animate stroke reveal with dash offset in 2D and a matching reveal in the 3D card texture.
- Calligraphy for Bismillah and names in Urdu comes from commissioned stroke-ordered artwork (content task C1), never from auto-traced fonts.
- Still version shows the finished pattern.

## 6. Names and text

- Couple names appear in the pack's script with a soft ink-bleed or gold-leaf reveal.
- Bilingual cards reveal the second language after the first, never both at once.
- Long names (Tamil, Malayalam) scale down smoothly; text never clips during animation.

## 7. Countdown and seasonal effects

- **Diya countdown:** on the guest page, a row of diyas; one more lights each day until the first function (Full and Light), static count in Still.
- **Seasonal overlays** (optional, host can switch off): Diwali sparklers in October–November, Holi colour dust in March, Christmas snow in December, driven by the category catalogue's seasons.

## 8. Colourful Rang family

The Rang templates (TRADITIONS.md, section 6) use the fullest motion: busier ambient particles, richer colour, brighter light. Contrast rules still apply to all text.

## 9. Graphics sourcing

- All illustrations and patterns are original or licensed (content task C1); no images from Google or other apps.
- Vector first, so the same art serves 2D, 3D, video export and print.
- Each pack's art credits its artist in the collection line.

## 10. Quality gate for motion

- [ ] Full, Light and Still versions all complete and reviewed
- [ ] 60fps Full on a mid-range Android, 30fps floor Light on a low-end Android (real devices)
- [ ] Opening finishes within 6 seconds; guest can skip with a tap
- [ ] No motion on sacred art beyond glow and falling flowers
- [ ] Sound only after a tap, mute always visible
- [ ] `prefers-reduced-motion` gives Still
- [ ] Community reviewer approves the pack's motion along with its content

## 11. Build steps

| Step      | Scope                                                                                                                                                                                                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **12c**   | Motion hooks in the engine (opening timeline, ambient loop, per-quality particle counts, sound-after-tap, skip); drawn-on stroke reveal; openings and particles for the first six packs (North Indian, Rajasthani, Marathi, Gujarati, Bengali, Tamil); diya countdown |
| **21**    | MP4 export reuses the same timelines                                                                                                                                                                                                                                  |
| **23**    | Openings for the remaining packs; per-function scenes; seasonal overlays; Rang family motion                                                                                                                                                                          |
| **M2–M7** | Memories scenes reuse the particle and drawn-on systems                                                                                                                                                                                                               |
