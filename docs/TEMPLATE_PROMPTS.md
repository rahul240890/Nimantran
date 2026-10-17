# Phase 3 templates: image prompts

For the owner, 17 October 2026. Fifteen new templates, each a complete set: **its own gate opening, nine pages and two couple-photo pages, 15 pictures per template (225 in all)**. The ideas come from the invitations you shared (palaces, brocade, Pichwai, moonlit lakes, celestial white and gold) but none repeats one of our 77 page themes, 284 Scenes or 49 gates.

## What's new this time

- **A new idea in every template.** A palace journey where each page is a different palace (Mahal Yatra), pages woven in gold zari (Kinkhab), henna drawn over everything (Hina), a Pichwai at night (Nathdwara Raat), a palace in the clouds (Aakash Mahal), royal interiors room by room (Darbar), Kanjeevaram silk for South Indian weddings (Pattu), and more.
- **Each template has its own gate**, painted in the same style: doors, brocade or silk curtains, palm-leaf or peacock-feather screens. Four pictures per gate.
- **Couple photos without boxes.** Until now the photo showed through a carved frame or window. In these, the photo sits in a soft patch of green that has no frame at all: flowers, mist, lanterns or silk drift over its edges, so the couple's photo melts into the painting. When I cut the green I feather its edge, so there is no hard line anywhere. Two-photo pages put the bride on the left and the groom on the right with flowers falling between them.
- **Every prompt is complete.** The style lock is inside each one, so you can copy one block, paste it and generate. Pictures from different chats still match.

## How to generate

1. Work on one template at a time, ideally in one chat in your image tool, so its 15 pictures match.
2. Ask for **portrait 9:16 (1080 × 1920)**. If the tool can't, generate larger and tell me; I crop.
3. Generate again if a picture has people, faces, hands, gods, religious symbols or any text or letters; if a photo page's green has a frame or border round it (say: _"remove the frame around the green; only let the flowers overlap it"_); or if the green isn't flat.
4. Check the tool's terms allow commercial use.
5. Name each file as shown under its prompt, for example `mahal-yatra/cover.png`, and send me one folder per template. PNG or WebP are both fine; I convert to WebP, crop to 9:16 and cut the green.

## Where the files go

- Pages and photo pages: `public/suites/<template>/` as `cover`, `family`, `haldi`, `mehendi`, `sangeet`, `baraat`, `wedding`, `reception`, `reply`, `couple` and `couple-two` (`.webp`).
- Gate: `public/openings/gates/<gate>/` as `beyond`, `arch`, `door-left` and `door-right` (`.webp`). I make the fifth file, `hole.webp`, from the arch's green.

## What I do when the pictures arrive

- Cut each photo page's green with a feathered edge, and record where the photos and the names go (`src/lib/suites/photo-frames.ts`). The same paintings make the template's One Scene too.
- Mark every page's calm area for the words (`src/lib/suites/areas.ts`), and set the template's lettering voice, colours, guest page look and music.
- Add the gate with its movement and opening (`src/lib/opening/catalog.ts`), and list the template in the gallery under its traditions and a collection.
- Check every page, the video and the cards at 320px and 1440px, in light and dark, then put it live.

## The fifteen

| #   | Template                                            | The idea                                                                                                       | Best for                                                                    | Gate                                  | From the ads                                                           |
| --- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------- |
| 1   | [Mahal Yatra](#mahal-yatra) (महल यात्रा)            | A journey through India's palaces: every page is a different palace, drawn like an artist's travel sketchbook. | Any wedding; Rajasthani, North Indian, Modern                               | Naqsha Pat (inlaid palace doors)      | “Different Mahal Swipe”: blush palaces, peonies, sepia sketch lines    |
| 2   | [Kinkhab](#kinkhab) (किनख़ाब)                       | Banarasi brocade come to life: every page is a scene woven in gold zari on wine silk.                          | North Indian, Marwari, Banarasi families; big receptions                    | Kinkhab Parda (brocade curtains)      | The burgundy-and-gold card with the gold mandala and soft couple photo |
| 3   | [Saanjh Kinara](#saanjh-kinara) (साँझ किनारा)       | A destination wedding by a tropical shore, one resort from sunrise to moonrise.                                | Destination weddings (Goa, Kerala, Bali), Modern                            | Taad Patta Dwar (palm-leaf screens)   | “Tropical Sundown Edit”: palms, a lit villa on water, lotus            |
| 4   | [Nathdwara Raat](#nathdwara-raat) (नाथद्वारा रात)   | A Pichwai painting at night: Sharad Purnima moon, lotus ponds and cows in gold on indigo and maroon.           | Gujarati, Rajasthani, Marwari, Vaishnav families                            | Pichwai Pat (painted cloth curtains)  | “Pichwai Noor”: maroon Pichwai, cows, lotuses, lamps                   |
| 5   | [Chandni Mahal](#chandni-mahal) (चाँदनी महल)        | A palace by night, every terrace lit with diyas and sky lanterns rising over still water.                      | Any wedding; perfect for sangeet and reception-led invites                  | Chandi Kiwad (silver doors)           | “Midnight Royal Affair”: navy night, glowing palace, lanterns, moon    |
| 6   | [Aakash Mahal](#aakash-mahal) (आकाश महल)            | A palace in the clouds: white marble, chandeliers in the open sky and cascades of blush roses.                 | Christian and Modern weddings, any family wanting soft white and gold       | Swarg Kiwad (doors in the clouds)     | “Heavens Alight”: celestial white and gold, clouds, florals            |
| 7   | [Firoza Bagh](#firoza-bagh) (फ़िरोज़ा बाग़)         | Turquoise Persian-tile pavilions, fountains and white roses: a royal garden for a Nikah.                       | Nikah and Muslim weddings (no figures or animals), North Indian, Modern     | Firoza Darwaza (tiled iwan gate)      | “Royal Azure”: blue-and-white palace, fountains                        |
| 8   | [Gulabi Nagar](#gulabi-nagar) (गुलाबी नगर)          | The Pink City in pastel: honeycomb palaces, bougainvillea, peach blossom and kites in the sky.                 | Rajasthani, Marwari, North Indian                                           | Jharokha Pat (stained-glass shutters) | “Jaipur Palace Edit”: peach-pink palace, blossom, pale moon            |
| 9   | [Hina](#hina) (हिना)                                | Henna art everywhere: every arch, wall and sky is drawn over with fine mehndi patterns.                        | Any wedding, especially mehendi-led invites; North Indian, Gujarati, Muslim | Hina Kiwad (henna-painted doors)      | “Floral Mehendi Story”: peach florals and a mehendi arch               |
| 10  | [Mor Sarovar](#mor-sarovar) (मोर सरोवर)             | A peacock lake at dawn: marble chhatris, lotuses and peacocks in mint, teal and gold watercolour.              | Gujarati, Rajasthani, Modern                                                | Mor Pankh (peacock-feather screens)   | “The Shoreline Reveal”: peacocks, a lake pavilion, mint and teal       |
| 11  | [Kumudini](#kumudini) (কুমুদিনী)                    | White water lilies opening under the full moon, fireflies and silver lanterns: a quiet, poetic night.          | Bengali, Odia, Assamese, Modern                                             | Jugnu Parda (firefly curtain)         | “Moonlit Lotus”: blue and white, moon, lotus                           |
| 12  | [Darbar](#darbar) (दरबार)                           | Inside the palace: durbar halls, mirror rooms and chandeliers, every page a different royal room.              | Any wedding; reception-led and big-venue invites                            | Sheesh Kiwad (mirror-work doors)      | “Royal Radiance”: blush marble hall, chandeliers, candles, roses       |
| 13  | [Sunehri Sarovar](#sunehri-sarovar) (ਸੁਨਹਿਰੀ ਸਰੋਵਰ) | A golden-hour lake with a golden-domed pavilion, marble walkways and phulkari: calm and glowing.               | Punjabi and Sikh weddings (Anand Karaj); keep it respectful                 | Sunehri Phatak (gold-leaf doors)      | “Golden Lake Collection”: golden domes over still water                |
| 14  | [Pattu](#pattu) (பட்டு)                             | Kanjeevaram silk: magenta and emerald drapes with temple-gold zari borders, jasmine and brass lamps.           | Tamil, Telugu and Kannada weddings                                          | Pattu Thirai (silk sari curtains)     | The rich silk-and-gold mood of the ads, made South Indian              |
| 15  | [Sona Rekha](#sona-rekha) (सोना रेखा)               | Modern minimal: ivory cotton paper, single-line gold-foil drawings and lots of quiet white space.              | Modern weddings, any family wanting minimal and elegant                     | Kagaz Kiwad (embossed paper doors)    | “Ivory Arch Collection”: minimal ivory and gold                        |

---

<a id="mahal-yatra"></a>

## 1. Mahal Yatra (महल यात्रा)

**A journey through India's palaces: every page is a different palace, drawn like an artist's travel sketchbook.**

- Folder: `public/suites/mahal-yatra/` · Gate: `public/openings/gates/naqsha-pat/` (the two doors swing open)
- Best for: Any wedding; Rajasthani, North Indian, Modern · Lettering voice: romantic
- Style lock (already inside every prompt below): Delicate watercolour and fine sepia-ink line drawing on warm cream handmade paper, like an artist's travel sketchbook of Indian palaces; blush pink, rose, ivory and soft gold; sprays of pale peonies, jasmine and loose rose petals in the foreground corners; the architecture drawn in fine sepia ink lines with light watercolour washes and a little gold leaf; soft warm light; elegant and airy, with plenty of cream paper showing.

### 1.1 Gate · the view beyond · `naqsha-pat/beyond.webp`

```text
Delicate watercolour and fine sepia-ink line drawing on warm cream handmade paper, like an artist's travel sketchbook of Indian palaces; blush pink, rose, ivory and soft gold; sprays of pale peonies, jasmine and loose rose petals in the foreground corners; the architecture drawn in fine sepia ink lines with light watercolour washes and a little gold leaf; soft warm light; elegant and airy, with plenty of cream paper showing. The view through the gateway once it opens: Udaipur's Lake Palace floating on a still lake at golden dusk, drawn in sepia ink with pink and gold washes, rose petals drifting on the water. Fill the whole picture, with no gate, arch, door or frame in it; a bright, calm, glowing centre. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 1.2 Gate · the arch · `naqsha-pat/arch.webp`

```text
Delicate watercolour and fine sepia-ink line drawing on warm cream handmade paper, like an artist's travel sketchbook of Indian palaces; blush pink, rose, ivory and soft gold; sprays of pale peonies, jasmine and loose rose petals in the foreground corners; the architecture drawn in fine sepia ink lines with light watercolour washes and a little gold leaf; soft warm light; elegant and airy, with plenty of cream paper showing. A gateway seen from the front, filling the whole picture edge to edge: A carved ivory marble palace arch with a cusped Mughal outline, fine gold inlay lines, and pale peonies and jasmine climbing up both sides, standing in a cream sketchbook-paper wall. The doorway inside the arch is filled with one flat pure green colour #00FF00, from the threshold at the very bottom edge of the picture up to the arch's crown, about 60 to 70% of the picture's width; nothing stands in front of the green. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 1.3 Gate · left door · `naqsha-pat/door-left.webp`

```text
Delicate watercolour and fine sepia-ink line drawing on warm cream handmade paper, like an artist's travel sketchbook of Indian palaces; blush pink, rose, ivory and soft gold; sprays of pale peonies, jasmine and loose rose petals in the foreground corners; the architecture drawn in fine sepia ink lines with light watercolour washes and a little gold leaf; soft warm light; elegant and airy, with plenty of cream paper showing. The LEFT door leaf of a pair, seen perfectly straight-on and flat, filling the whole picture edge to edge with no wall, frame, floor or background around it: a tall ivory door leaf inlaid with a fine gold-line drawing of a domed palace, like an architect's plan worked in pietra dura, framed by a border of tiny inlaid flowers, with brass studs and a lotus-shaped brass handle. Its hinge side is the left edge of the picture; the edge where it meets the other door is the right edge, with the handle near it. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 1.4 Gate · right door · `naqsha-pat/door-right.webp`

```text
Delicate watercolour and fine sepia-ink line drawing on warm cream handmade paper, like an artist's travel sketchbook of Indian palaces; blush pink, rose, ivory and soft gold; sprays of pale peonies, jasmine and loose rose petals in the foreground corners; the architecture drawn in fine sepia ink lines with light watercolour washes and a little gold leaf; soft warm light; elegant and airy, with plenty of cream paper showing. The RIGHT door leaf of a pair, seen perfectly straight-on and flat, filling the whole picture edge to edge with no wall, frame, floor or background around it: a tall ivory door leaf inlaid with a fine gold-line drawing of a domed palace, like an architect's plan worked in pietra dura, framed by a border of tiny inlaid flowers, with brass studs and a lotus-shaped brass handle. Its hinge side is the right edge of the picture; the edge where it meets the other door is the left edge, with the handle near it. It mirrors the left one. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 1.5 Cover (dusk) · `mahal-yatra/cover.webp`

```text
Delicate watercolour and fine sepia-ink line drawing on warm cream handmade paper, like an artist's travel sketchbook of Indian palaces; blush pink, rose, ivory and soft gold; sprays of pale peonies, jasmine and loose rose petals in the foreground corners; the architecture drawn in fine sepia ink lines with light watercolour washes and a little gold leaf; soft warm light; elegant and airy, with plenty of cream paper showing. A white lake palace floating on a still lake at golden dusk, drawn in sepia ink with pink and gold washes; peony and jasmine sprays in the lower corners; petals floating on the water. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 1.6 Family (day) · `mahal-yatra/family.webp`

```text
Delicate watercolour and fine sepia-ink line drawing on warm cream handmade paper, like an artist's travel sketchbook of Indian palaces; blush pink, rose, ivory and soft gold; sprays of pale peonies, jasmine and loose rose petals in the foreground corners; the architecture drawn in fine sepia ink lines with light watercolour washes and a little gold leaf; soft warm light; elegant and airy, with plenty of cream paper showing. A Mughal garden palace with a long reflecting pool, fountains and cypress trees in soft daylight, blush rose bushes in front; the sky above the dome is plain cream paper. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 1.7 Haldi (morning) · `mahal-yatra/haldi.webp`

```text
Delicate watercolour and fine sepia-ink line drawing on warm cream handmade paper, like an artist's travel sketchbook of Indian palaces; blush pink, rose, ivory and soft gold; sprays of pale peonies, jasmine and loose rose petals in the foreground corners; the architecture drawn in fine sepia ink lines with light watercolour washes and a little gold leaf; soft warm light; elegant and airy, with plenty of cream paper showing. A yellow-washed haveli courtyard at sunrise: marigold garlands swagged between carved pillars, brass urns of turmeric, a jharokha balcony, beams of morning light. Composition: keep the lower 40% calm (still water, a plain floor, smooth cloth or sand) for words; put the main scene in the upper part. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 1.8 Mehendi (day) · `mahal-yatra/mehendi.webp`

```text
Delicate watercolour and fine sepia-ink line drawing on warm cream handmade paper, like an artist's travel sketchbook of Indian palaces; blush pink, rose, ivory and soft gold; sprays of pale peonies, jasmine and loose rose petals in the foreground corners; the architecture drawn in fine sepia ink lines with light watercolour washes and a little gold leaf; soft warm light; elegant and airy, with plenty of cream paper showing. The honeycomb facade of a pink palace of winds, its many small windows hung with green and pink fabric, pots of jasmine on the ledges, drawn in fine sketch lines in daylight. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 1.9 Sangeet (night) · `mahal-yatra/sangeet.webp`

```text
Delicate watercolour and fine sepia-ink line drawing on warm cream handmade paper, like an artist's travel sketchbook of Indian palaces; blush pink, rose, ivory and soft gold; sprays of pale peonies, jasmine and loose rose petals in the foreground corners; the architecture drawn in fine sepia ink lines with light watercolour washes and a little gold leaf; soft warm light; elegant and airy, with plenty of cream paper showing. A mirror palace hall at night, its walls glittering with tiny lights, painted in ink on deep-blue washed paper with gold dots; floor cushions, a dholak and a harmonium on a carpet. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 1.10 Baraat (dusk) · `mahal-yatra/baraat.webp`

```text
Delicate watercolour and fine sepia-ink line drawing on warm cream handmade paper, like an artist's travel sketchbook of Indian palaces; blush pink, rose, ivory and soft gold; sprays of pale peonies, jasmine and loose rose petals in the foreground corners; the architecture drawn in fine sepia ink lines with light watercolour washes and a little gold leaf; soft warm light; elegant and airy, with plenty of cream paper showing. A hill-fort gateway on a winding road at dusk, strings of lights over the gate, marigold toran, fireworks sketched in gold in the sky. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 1.11 Wedding (dusk) · `mahal-yatra/wedding.webp`

```text
Delicate watercolour and fine sepia-ink line drawing on warm cream handmade paper, like an artist's travel sketchbook of Indian palaces; blush pink, rose, ivory and soft gold; sprays of pale peonies, jasmine and loose rose petals in the foreground corners; the architecture drawn in fine sepia ink lines with light watercolour washes and a little gold leaf; soft warm light; elegant and airy, with plenty of cream paper showing. A marble mandap with four slender pillars draped in pink and ivory flowers in a palace courtyard at dusk, a small fire bowl in the centre, petals on the floor. Composition: leave one calm open area in the middle, about 70% of the width and 40% of the height (the plain inside of an arch, a window of soft sky or a smooth wall), for words; put the detail around it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 1.12 Reception (night) · `mahal-yatra/reception.webp`

```text
Delicate watercolour and fine sepia-ink line drawing on warm cream handmade paper, like an artist's travel sketchbook of Indian palaces; blush pink, rose, ivory and soft gold; sprays of pale peonies, jasmine and loose rose petals in the foreground corners; the architecture drawn in fine sepia ink lines with light watercolour washes and a little gold leaf; soft warm light; elegant and airy, with plenty of cream paper showing. A grand domed palace lit with thousands of bulbs at night, reflected in a long pool, sketched in ink with glowing gold dots on indigo-washed paper. Composition: keep the lower 40% calm (still water, a plain floor, smooth cloth or sand) for words; put the main scene in the upper part. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 1.13 Closing page (reply) (night) · `mahal-yatra/reply.webp`

```text
Delicate watercolour and fine sepia-ink line drawing on warm cream handmade paper, like an artist's travel sketchbook of Indian palaces; blush pink, rose, ivory and soft gold; sprays of pale peonies, jasmine and loose rose petals in the foreground corners; the architecture drawn in fine sepia ink lines with light watercolour washes and a little gold leaf; soft warm light; elegant and airy, with plenty of cream paper showing. A palace terrace at night with rows of glowing diyas and lanterns along a carved balustrade, the moon over distant domes, peonies in the foreground. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 1.14 Photo page · one photo · `mahal-yatra/couple.webp`

```text
Delicate watercolour and fine sepia-ink line drawing on warm cream handmade paper, like an artist's travel sketchbook of Indian palaces; blush pink, rose, ivory and soft gold; sprays of pale peonies, jasmine and loose rose petals in the foreground corners; the architecture drawn in fine sepia ink lines with light watercolour washes and a little gold leaf; soft warm light; elegant and airy, with plenty of cream paper showing. A painting with a soft place for one photo of the couple, in a blush watercolour wash glowing softly on the cream paper, with faint sepia-ink palace domes sketched beyond its sides. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: sprays of pale peonies, jasmine and loose rose petals drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 52% of the height down, keep the picture calm and empty for the names: plain cream paper. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 1.15 Photo page · two photos · `mahal-yatra/couple-two.webp`

```text
Delicate watercolour and fine sepia-ink line drawing on warm cream handmade paper, like an artist's travel sketchbook of Indian palaces; blush pink, rose, ivory and soft gold; sprays of pale peonies, jasmine and loose rose petals in the foreground corners; the architecture drawn in fine sepia ink lines with light watercolour washes and a little gold leaf; soft warm light; elegant and airy, with plenty of cream paper showing. A painting with soft places for two photos, in a blush watercolour wash glowing softly on the cream paper, with faint sepia-ink palace domes sketched beyond its sides. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a vertical spray of jasmine with a single peony falls in the gap. Neither has a frame, border, arch, outline or box: sprays of pale peonies, jasmine and loose rose petals drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 48% of the height down, keep the picture calm and empty for both names: plain cream paper. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="kinkhab"></a>

## 2. Kinkhab (किनख़ाब)

**Banarasi brocade come to life: every page is a scene woven in gold zari on wine silk.**

- Folder: `public/suites/kinkhab/` · Gate: `public/openings/gates/kinkhab-parda/` (the two curtain halves gather to the sides)
- Best for: North Indian, Marwari, Banarasi families; big receptions · Lettering voice: regal
- Style lock (already inside every prompt below): Luxurious Banarasi brocade art: deep wine-red and maroon silk with a soft sheen, woven gold zari motifs (mandalas, kalga paisleys, floral jaal) with raised gold-thread texture, fine scattered gold sparkles, ornate gold mandala corner pieces; rich, regal and symmetrical; warm candle-gold light.

### 2.1 Gate · the view beyond · `kinkhab-parda/beyond.webp`

```text
Luxurious Banarasi brocade art: deep wine-red and maroon silk with a soft sheen, woven gold zari motifs (mandalas, kalga paisleys, floral jaal) with raised gold-thread texture, fine scattered gold sparkles, ornate gold mandala corner pieces; rich, regal and symmetrical; warm candle-gold light. The view through the gateway once it opens: A wine and gold palace hall glowing with candlelight, a large gold mandala on the far wall, soft golden sparkle in the air. Fill the whole picture, with no gate, arch, door or frame in it; a bright, calm, glowing centre. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 2.2 Gate · the arch · `kinkhab-parda/arch.webp`

```text
Luxurious Banarasi brocade art: deep wine-red and maroon silk with a soft sheen, woven gold zari motifs (mandalas, kalga paisleys, floral jaal) with raised gold-thread texture, fine scattered gold sparkles, ornate gold mandala corner pieces; rich, regal and symmetrical; warm candle-gold light. A gateway seen from the front, filling the whole picture edge to edge: A carved and gilded wooden proscenium arch with a wine velvet pelmet, gold tassels and a gold mandala at its crown, set in a wall of wine silk with gold zari borders. The doorway inside the arch is filled with one flat pure green colour #00FF00, from the threshold at the very bottom edge of the picture up to the arch's crown, about 60 to 70% of the picture's width; nothing stands in front of the green. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 2.3 Gate · left door · `kinkhab-parda/door-left.webp`

```text
Luxurious Banarasi brocade art: deep wine-red and maroon silk with a soft sheen, woven gold zari motifs (mandalas, kalga paisleys, floral jaal) with raised gold-thread texture, fine scattered gold sparkles, ornate gold mandala corner pieces; rich, regal and symmetrical; warm candle-gold light. The LEFT half of a pair of curtains, hanging straight and seen straight-on, filling the whole picture edge to edge with no rod, wall or background showing: a heavy wine-red Banarasi brocade curtain hanging straight in soft folds, covered in woven gold zari mandalas and paisleys, with a wide gold border down its inner edge and a gold tassel tie-back hanging near that edge. Its outer edge is the left edge of the picture; its inner edge, where it meets the other half, is the right edge. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 2.4 Gate · right door · `kinkhab-parda/door-right.webp`

```text
Luxurious Banarasi brocade art: deep wine-red and maroon silk with a soft sheen, woven gold zari motifs (mandalas, kalga paisleys, floral jaal) with raised gold-thread texture, fine scattered gold sparkles, ornate gold mandala corner pieces; rich, regal and symmetrical; warm candle-gold light. The RIGHT half of a pair of curtains, hanging straight and seen straight-on, filling the whole picture edge to edge with no rod, wall or background showing: a heavy wine-red Banarasi brocade curtain hanging straight in soft folds, covered in woven gold zari mandalas and paisleys, with a wide gold border down its inner edge and a gold tassel tie-back hanging near that edge. Its outer edge is the right edge of the picture; its inner edge, where it meets the other half, is the left edge. It mirrors the left one. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 2.5 Cover (dusk) · `kinkhab/cover.webp`

```text
Luxurious Banarasi brocade art: deep wine-red and maroon silk with a soft sheen, woven gold zari motifs (mandalas, kalga paisleys, floral jaal) with raised gold-thread texture, fine scattered gold sparkles, ornate gold mandala corner pieces; rich, regal and symmetrical; warm candle-gold light. A large gold zari mandala rising from the top edge like a sunrise over wine silk, ornate gold floral vines climbing both sides, a gold lotus border along the bottom; the middle is plain deep wine silk with a faint sparkle. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 2.6 Family (day) · `kinkhab/family.webp`

```text
Luxurious Banarasi brocade art: deep wine-red and maroon silk with a soft sheen, woven gold zari motifs (mandalas, kalga paisleys, floral jaal) with raised gold-thread texture, fine scattered gold sparkles, ornate gold mandala corner pieces; rich, regal and symmetrical; warm candle-gold light. A gold-woven palace skyline of domes and chhatris along the bottom, as if woven into the silk, with paisley vines; plain wine silk above. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 2.7 Haldi (morning) · `kinkhab/haldi.webp`

```text
Luxurious Banarasi brocade art: deep wine-red and maroon silk with a soft sheen, woven gold zari motifs (mandalas, kalga paisleys, floral jaal) with raised gold-thread texture, fine scattered gold sparkles, ornate gold mandala corner pieces; rich, regal and symmetrical; warm candle-gold light. Silk shading from wine to warm saffron-yellow towards the top, woven gold marigold garlands hanging in swags from the top edge, brass urns woven in gold along the bottom. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 2.8 Mehendi (day) · `kinkhab/mehendi.webp`

```text
Luxurious Banarasi brocade art: deep wine-red and maroon silk with a soft sheen, woven gold zari motifs (mandalas, kalga paisleys, floral jaal) with raised gold-thread texture, fine scattered gold sparkles, ornate gold mandala corner pieces; rich, regal and symmetrical; warm candle-gold light. Wine silk with an emerald-green brocade border, woven gold henna paisleys and peacock-feather motifs running down the left and right edges. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 2.9 Sangeet (night) · `kinkhab/sangeet.webp`

```text
Luxurious Banarasi brocade art: deep wine-red and maroon silk with a soft sheen, woven gold zari motifs (mandalas, kalga paisleys, floral jaal) with raised gold-thread texture, fine scattered gold sparkles, ornate gold mandala corner pieces; rich, regal and symmetrical; warm candle-gold light. Deep plum silk with a band of gold-woven instruments (a sitar, a dholak, a tabla pair) along the bottom, and scattered gold sparkles like stars above. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 2.10 Baraat (dusk) · `kinkhab/baraat.webp`

```text
Luxurious Banarasi brocade art: deep wine-red and maroon silk with a soft sheen, woven gold zari motifs (mandalas, kalga paisleys, floral jaal) with raised gold-thread texture, fine scattered gold sparkles, ornate gold mandala corner pieces; rich, regal and symmetrical; warm candle-gold light. A gold-woven procession band along the bottom: caparisoned elephants and horses with no riders, parasols and lanterns, in brocade style; plain wine silk above. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 2.11 Wedding (dusk) · `kinkhab/wedding.webp`

```text
Luxurious Banarasi brocade art: deep wine-red and maroon silk with a soft sheen, woven gold zari motifs (mandalas, kalga paisleys, floral jaal) with raised gold-thread texture, fine scattered gold sparkles, ornate gold mandala corner pieces; rich, regal and symmetrical; warm candle-gold light. A gold-woven mandap with four pillars and a domed canopy at the top centre, marigold strings, kalash pots at its base, wine silk around it with sparkles. Composition: keep the lower 40% calm (still water, a plain floor, smooth cloth or sand) for words; put the main scene in the upper part. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 2.12 Reception (night) · `kinkhab/reception.webp`

```text
Luxurious Banarasi brocade art: deep wine-red and maroon silk with a soft sheen, woven gold zari motifs (mandalas, kalga paisleys, floral jaal) with raised gold-thread texture, fine scattered gold sparkles, ornate gold mandala corner pieces; rich, regal and symmetrical; warm candle-gold light. Wine and black silk with a gold-woven chandelier hanging from the top centre and arcs of woven lights to each side, tiny gold sparkles. Composition: keep the lower 40% calm (still water, a plain floor, smooth cloth or sand) for words; put the main scene in the upper part. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 2.13 Closing page (reply) (night) · `kinkhab/reply.webp`

```text
Luxurious Banarasi brocade art: deep wine-red and maroon silk with a soft sheen, woven gold zari motifs (mandalas, kalga paisleys, floral jaal) with raised gold-thread texture, fine scattered gold sparkles, ornate gold mandala corner pieces; rich, regal and symmetrical; warm candle-gold light. Plain wine silk with a narrow ornate gold border all round and a small woven gold lotus with tiny diyas at the bottom centre. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 2.14 Photo page · one photo · `kinkhab/couple.webp`

```text
Luxurious Banarasi brocade art: deep wine-red and maroon silk with a soft sheen, woven gold zari motifs (mandalas, kalga paisleys, floral jaal) with raised gold-thread texture, fine scattered gold sparkles, ornate gold mandala corner pieces; rich, regal and symmetrical; warm candle-gold light. A painting with a soft place for one photo of the couple, in a soft warm glow on the wine silk, with ornate gold mandala corner pieces at the top. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: curling gold zari floral vines, a few woven gold flowers and fine drifting gold sparkles drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 52% of the height down, keep the picture calm and empty for the names: plain wine silk. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 2.15 Photo page · two photos · `kinkhab/couple-two.webp`

```text
Luxurious Banarasi brocade art: deep wine-red and maroon silk with a soft sheen, woven gold zari motifs (mandalas, kalga paisleys, floral jaal) with raised gold-thread texture, fine scattered gold sparkles, ornate gold mandala corner pieces; rich, regal and symmetrical; warm candle-gold light. A painting with soft places for two photos, in a soft warm glow on the wine silk, with ornate gold mandala corner pieces at the top. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a woven gold paisley vine falls in the gap. Neither has a frame, border, arch, outline or box: curling gold zari floral vines, a few woven gold flowers and fine drifting gold sparkles drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 48% of the height down, keep the picture calm and empty for both names: plain wine silk. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="saanjh-kinara"></a>

## 3. Saanjh Kinara (साँझ किनारा)

**A destination wedding by a tropical shore, one resort from sunrise to moonrise.**

- Folder: `public/suites/saanjh-kinara/` · Gate: `public/openings/gates/taad-patta-dwar/` (the two screens slide apart)
- Best for: Destination weddings (Goa, Kerala, Bali), Modern · Lettering voice: romantic
- Style lock (already inside every prompt below): Luminous tropical destination painting at golden hour and dusk: coconut palms, a whitewashed villa with terracotta roofs, an infinity pool and a calm sea, frangipani and pink lotuses, woven rattan lanterns and strings of warm bulbs; teal water, palm green, sunset coral and lantern gold; glowing reflections; dreamy, cinematic and painterly.

### 3.1 Gate · the view beyond · `taad-patta-dwar/beyond.webp`

```text
Luminous tropical destination painting at golden hour and dusk: coconut palms, a whitewashed villa with terracotta roofs, an infinity pool and a calm sea, frangipani and pink lotuses, woven rattan lanterns and strings of warm bulbs; teal water, palm green, sunset coral and lantern gold; glowing reflections; dreamy, cinematic and painterly. The view through the gateway once it opens: A villa on stilts over a lotus lagoon at sunset, lanterns glowing on its steps, palms leaning in, the sea glowing coral at the horizon. Fill the whole picture, with no gate, arch, door or frame in it; a bright, calm, glowing centre. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 3.2 Gate · the arch · `taad-patta-dwar/arch.webp`

```text
Luminous tropical destination painting at golden hour and dusk: coconut palms, a whitewashed villa with terracotta roofs, an infinity pool and a calm sea, frangipani and pink lotuses, woven rattan lanterns and strings of warm bulbs; teal water, palm green, sunset coral and lantern gold; glowing reflections; dreamy, cinematic and painterly. A gateway seen from the front, filling the whole picture edge to edge: A whitewashed beach-house archway with a carved teak frame, bougainvillea spilling over the top, a toran of rope and shells, terracotta pots of frangipani at its feet. The doorway inside the arch is filled with one flat pure green colour #00FF00, from the threshold at the very bottom edge of the picture up to the arch's crown, about 60 to 70% of the picture's width; nothing stands in front of the green. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 3.3 Gate · left door · `taad-patta-dwar/door-left.webp`

```text
Luminous tropical destination painting at golden hour and dusk: coconut palms, a whitewashed villa with terracotta roofs, an infinity pool and a calm sea, frangipani and pink lotuses, woven rattan lanterns and strings of warm bulbs; teal water, palm green, sunset coral and lantern gold; glowing reflections; dreamy, cinematic and painterly. The LEFT panel of a pair of sliding screens, seen straight-on and flat, filling the whole picture edge to edge with no wall or background showing: a woven palm-leaf and cane sliding screen in natural gold and green weave, with small shell tassels along its edge and a teak rail at top and bottom. Its inner edge, where it meets the other panel, is the right edge of the picture. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 3.4 Gate · right door · `taad-patta-dwar/door-right.webp`

```text
Luminous tropical destination painting at golden hour and dusk: coconut palms, a whitewashed villa with terracotta roofs, an infinity pool and a calm sea, frangipani and pink lotuses, woven rattan lanterns and strings of warm bulbs; teal water, palm green, sunset coral and lantern gold; glowing reflections; dreamy, cinematic and painterly. The RIGHT panel of a pair of sliding screens, seen straight-on and flat, filling the whole picture edge to edge with no wall or background showing: a woven palm-leaf and cane sliding screen in natural gold and green weave, with small shell tassels along its edge and a teak rail at top and bottom. Its inner edge, where it meets the other panel, is the left edge of the picture. It mirrors the left one. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 3.5 Cover (dusk) · `saanjh-kinara/cover.webp`

```text
Luminous tropical destination painting at golden hour and dusk: coconut palms, a whitewashed villa with terracotta roofs, an infinity pool and a calm sea, frangipani and pink lotuses, woven rattan lanterns and strings of warm bulbs; teal water, palm green, sunset coral and lantern gold; glowing reflections; dreamy, cinematic and painterly. A villa on stilts over a lotus lagoon at sunset, lanterns glowing on its steps, palms leaning in from both sides, the sea glowing coral at the horizon. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 3.6 Family (day) · `saanjh-kinara/family.webp`

```text
Luminous tropical destination painting at golden hour and dusk: coconut palms, a whitewashed villa with terracotta roofs, an infinity pool and a calm sea, frangipani and pink lotuses, woven rattan lanterns and strings of warm bulbs; teal water, palm green, sunset coral and lantern gold; glowing reflections; dreamy, cinematic and painterly. A breezy veranda with white columns, rattan chairs and a frangipani tree, the turquoise sea bright between the columns in daylight. Composition: leave one calm open area in the middle, about 70% of the width and 40% of the height (the plain inside of an arch, a window of soft sky or a smooth wall), for words; put the detail around it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 3.7 Haldi (morning) · `saanjh-kinara/haldi.webp`

```text
Luminous tropical destination painting at golden hour and dusk: coconut palms, a whitewashed villa with terracotta roofs, an infinity pool and a calm sea, frangipani and pink lotuses, woven rattan lanterns and strings of warm bulbs; teal water, palm green, sunset coral and lantern gold; glowing reflections; dreamy, cinematic and painterly. A beach at sunrise with a canopy of yellow fabric and marigold strings tied between two palms, brass bowls on a low wooden table, soft waves. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 3.8 Mehendi (day) · `saanjh-kinara/mehendi.webp`

```text
Luminous tropical destination painting at golden hour and dusk: coconut palms, a whitewashed villa with terracotta roofs, an infinity pool and a calm sea, frangipani and pink lotuses, woven rattan lanterns and strings of warm bulbs; teal water, palm green, sunset coral and lantern gold; glowing reflections; dreamy, cinematic and painterly. A shaded palm garden with hammocks of green and pink fabric, floor cushions, potted frangipani and dappled light. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 3.9 Sangeet (night) · `saanjh-kinara/sangeet.webp`

```text
Luminous tropical destination painting at golden hour and dusk: coconut palms, a whitewashed villa with terracotta roofs, an infinity pool and a calm sea, frangipani and pink lotuses, woven rattan lanterns and strings of warm bulbs; teal water, palm green, sunset coral and lantern gold; glowing reflections; dreamy, cinematic and painterly. A beach bonfire stage at night: fairy lights strung between palms, drums on rugs, lanterns in the sand, stars over a dark sea. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 3.10 Baraat (dusk) · `saanjh-kinara/baraat.webp`

```text
Luminous tropical destination painting at golden hour and dusk: coconut palms, a whitewashed villa with terracotta roofs, an infinity pool and a calm sea, frangipani and pink lotuses, woven rattan lanterns and strings of warm bulbs; teal water, palm green, sunset coral and lantern gold; glowing reflections; dreamy, cinematic and painterly. An avenue of palms lined with torches and marigold arches leading to the beach at dusk, a vintage car decorated with flowers waiting at the end. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 3.11 Wedding (dusk) · `saanjh-kinara/wedding.webp`

```text
Luminous tropical destination painting at golden hour and dusk: coconut palms, a whitewashed villa with terracotta roofs, an infinity pool and a calm sea, frangipani and pink lotuses, woven rattan lanterns and strings of warm bulbs; teal water, palm green, sunset coral and lantern gold; glowing reflections; dreamy, cinematic and painterly. A floral mandap on a wooden deck over the sea at sunset, four bamboo pillars wrapped in white flowers and coral bougainvillea, petals on the deck. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 3.12 Reception (night) · `saanjh-kinara/reception.webp`

```text
Luminous tropical destination painting at golden hour and dusk: coconut palms, a whitewashed villa with terracotta roofs, an infinity pool and a calm sea, frangipani and pink lotuses, woven rattan lanterns and strings of warm bulbs; teal water, palm green, sunset coral and lantern gold; glowing reflections; dreamy, cinematic and painterly. An infinity pool at night with hundreds of floating candles and lanterns, palms in silhouette, the villa glowing behind. Composition: keep the lower 40% calm (still water, a plain floor, smooth cloth or sand) for words; put the main scene in the upper part. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 3.13 Closing page (reply) (night) · `saanjh-kinara/reply.webp`

```text
Luminous tropical destination painting at golden hour and dusk: coconut palms, a whitewashed villa with terracotta roofs, an infinity pool and a calm sea, frangipani and pink lotuses, woven rattan lanterns and strings of warm bulbs; teal water, palm green, sunset coral and lantern gold; glowing reflections; dreamy, cinematic and painterly. A quiet shoreline under a full moon, lanterns along the waterline, a small wooden boat filled with marigolds. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 3.14 Photo page · one photo · `saanjh-kinara/couple.webp`

```text
Luminous tropical destination painting at golden hour and dusk: coconut palms, a whitewashed villa with terracotta roofs, an infinity pool and a calm sea, frangipani and pink lotuses, woven rattan lanterns and strings of warm bulbs; teal water, palm green, sunset coral and lantern gold; glowing reflections; dreamy, cinematic and painterly. A painting with a soft place for one photo of the couple, in a warm sunset haze glowing over the sea. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: palm fronds leaning in from both sides and clusters of frangipani blossoms, with soft lantern bokeh drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 52% of the height down, keep the picture calm and empty for the names: calm sand and still water. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 3.15 Photo page · two photos · `saanjh-kinara/couple-two.webp`

```text
Luminous tropical destination painting at golden hour and dusk: coconut palms, a whitewashed villa with terracotta roofs, an infinity pool and a calm sea, frangipani and pink lotuses, woven rattan lanterns and strings of warm bulbs; teal water, palm green, sunset coral and lantern gold; glowing reflections; dreamy, cinematic and painterly. A painting with soft places for two photos, in a warm sunset haze glowing over the sea. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a slim palm trunk wound with bougainvillea falls in the gap. Neither has a frame, border, arch, outline or box: palm fronds leaning in from both sides and clusters of frangipani blossoms, with soft lantern bokeh drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 48% of the height down, keep the picture calm and empty for both names: calm sand and still water. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="nathdwara-raat"></a>

## 4. Nathdwara Raat (नाथद्वारा रात)

**A Pichwai painting at night: Sharad Purnima moon, lotus ponds and cows in gold on indigo and maroon.**

- Folder: `public/suites/nathdwara-raat/` · Gate: `public/openings/gates/pichwai-pat/` (the two curtain halves gather to the sides)
- Best for: Gujarati, Rajasthani, Marwari, Vaishnav families · Lettering voice: regal
- Style lock (already inside every prompt below): Traditional Nathdwara Pichwai painting style at night: a flat, decorative composition on deep indigo-black and dark maroon grounds, fine gold outlines, rows of white and pink lotuses with lotus leaves, kadamb trees with round blossoms, cows with painted horns and bells, hanging flower garlands, a silver full moon (Sharad Purnima), patterned gold borders; jewel colours with gold-leaf details; no human or divine figures.

### 4.1 Gate · the view beyond · `pichwai-pat/beyond.webp`

```text
Traditional Nathdwara Pichwai painting style at night: a flat, decorative composition on deep indigo-black and dark maroon grounds, fine gold outlines, rows of white and pink lotuses with lotus leaves, kadamb trees with round blossoms, cows with painted horns and bells, hanging flower garlands, a silver full moon (Sharad Purnima), patterned gold borders; jewel colours with gold-leaf details; no human or divine figures. The view through the gateway once it opens: A moonlit lotus pond with kadamb trees and hanging lamps, the silver full moon above, gold-lit. Fill the whole picture, with no gate, arch, door or frame in it; a bright, calm, glowing centre. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 4.2 Gate · the arch · `pichwai-pat/arch.webp`

```text
Traditional Nathdwara Pichwai painting style at night: a flat, decorative composition on deep indigo-black and dark maroon grounds, fine gold outlines, rows of white and pink lotuses with lotus leaves, kadamb trees with round blossoms, cows with painted horns and bells, hanging flower garlands, a silver full moon (Sharad Purnima), patterned gold borders; jewel colours with gold-leaf details; no human or divine figures. A gateway seen from the front, filling the whole picture edge to edge: A carved red-sandstone haveli shrine arch painted with Pichwai lotuses and gold borders, brass bells hanging from its crown, rows of tiny lamps on its sill. The doorway inside the arch is filled with one flat pure green colour #00FF00, from the threshold at the very bottom edge of the picture up to the arch's crown, about 60 to 70% of the picture's width; nothing stands in front of the green. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 4.3 Gate · left door · `pichwai-pat/door-left.webp`

```text
Traditional Nathdwara Pichwai painting style at night: a flat, decorative composition on deep indigo-black and dark maroon grounds, fine gold outlines, rows of white and pink lotuses with lotus leaves, kadamb trees with round blossoms, cows with painted horns and bells, hanging flower garlands, a silver full moon (Sharad Purnima), patterned gold borders; jewel colours with gold-leaf details; no human or divine figures. The LEFT half of a pair of curtains, hanging straight and seen straight-on, filling the whole picture edge to edge with no rod, wall or background showing: a painted Pichwai cloth curtain hanging straight: rows of lotuses and a cow under a kadamb tree, in gold and indigo, edged with a gold patterned border and a tassel at its inner edge. Its outer edge is the left edge of the picture; its inner edge, where it meets the other half, is the right edge. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 4.4 Gate · right door · `pichwai-pat/door-right.webp`

```text
Traditional Nathdwara Pichwai painting style at night: a flat, decorative composition on deep indigo-black and dark maroon grounds, fine gold outlines, rows of white and pink lotuses with lotus leaves, kadamb trees with round blossoms, cows with painted horns and bells, hanging flower garlands, a silver full moon (Sharad Purnima), patterned gold borders; jewel colours with gold-leaf details; no human or divine figures. The RIGHT half of a pair of curtains, hanging straight and seen straight-on, filling the whole picture edge to edge with no rod, wall or background showing: a painted Pichwai cloth curtain hanging straight: rows of lotuses and a cow under a kadamb tree, in gold and indigo, edged with a gold patterned border and a tassel at its inner edge. Its outer edge is the right edge of the picture; its inner edge, where it meets the other half, is the left edge. It mirrors the left one. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 4.5 Cover (dusk) · `nathdwara-raat/cover.webp`

```text
Traditional Nathdwara Pichwai painting style at night: a flat, decorative composition on deep indigo-black and dark maroon grounds, fine gold outlines, rows of white and pink lotuses with lotus leaves, kadamb trees with round blossoms, cows with painted horns and bells, hanging flower garlands, a silver full moon (Sharad Purnima), patterned gold borders; jewel colours with gold-leaf details; no human or divine figures. A lotus pond along the bottom with white lotuses and pink buds, two cows facing each other on the banks, kadamb trees on both sides, a large silver full moon at the top, a gold patterned border. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 4.6 Family (day) · `nathdwara-raat/family.webp`

```text
Traditional Nathdwara Pichwai painting style at night: a flat, decorative composition on deep indigo-black and dark maroon grounds, fine gold outlines, rows of white and pink lotuses with lotus leaves, kadamb trees with round blossoms, cows with painted horns and bells, hanging flower garlands, a silver full moon (Sharad Purnima), patterned gold borders; jewel colours with gold-leaf details; no human or divine figures. A daylight Pichwai on a cream ground: rows of cows grazing along the bottom under kadamb trees, a mango-leaf toran across the top; the middle is plain cream. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 4.7 Haldi (morning) · `nathdwara-raat/haldi.webp`

```text
Traditional Nathdwara Pichwai painting style at night: a flat, decorative composition on deep indigo-black and dark maroon grounds, fine gold outlines, rows of white and pink lotuses with lotus leaves, kadamb trees with round blossoms, cows with painted horns and bells, hanging flower garlands, a silver full moon (Sharad Purnima), patterned gold borders; jewel colours with gold-leaf details; no human or divine figures. A saffron and gold ground at dawn, banana plants and marigold garlands in a row across the top, brass vessels and turmeric on lotus leaves along the bottom. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 4.8 Mehendi (day) · `nathdwara-raat/mehendi.webp`

```text
Traditional Nathdwara Pichwai painting style at night: a flat, decorative composition on deep indigo-black and dark maroon grounds, fine gold outlines, rows of white and pink lotuses with lotus leaves, kadamb trees with round blossoms, cows with painted horns and bells, hanging flower garlands, a silver full moon (Sharad Purnima), patterned gold borders; jewel colours with gold-leaf details; no human or divine figures. A leaf-green ground with a kadamb grove, a pink lotus pond along the bottom, parrots on the branches, a border of henna-like patterns. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 4.9 Sangeet (night) · `nathdwara-raat/sangeet.webp`

```text
Traditional Nathdwara Pichwai painting style at night: a flat, decorative composition on deep indigo-black and dark maroon grounds, fine gold outlines, rows of white and pink lotuses with lotus leaves, kadamb trees with round blossoms, cows with painted horns and bells, hanging flower garlands, a silver full moon (Sharad Purnima), patterned gold borders; jewel colours with gold-leaf details; no human or divine figures. An indigo night ground with a big full moon, a ring of hanging lamps, cows resting, white flowers falling like stars. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 4.10 Baraat (dusk) · `nathdwara-raat/baraat.webp`

```text
Traditional Nathdwara Pichwai painting style at night: a flat, decorative composition on deep indigo-black and dark maroon grounds, fine gold outlines, rows of white and pink lotuses with lotus leaves, kadamb trees with round blossoms, cows with painted horns and bells, hanging flower garlands, a silver full moon (Sharad Purnima), patterned gold borders; jewel colours with gold-leaf details; no human or divine figures. A procession band along the bottom of decorated cows and an elephant with a gold howdah and no rider, parasols and lamps, a maroon dusk sky with gold stars. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 4.11 Wedding (dusk) · `nathdwara-raat/wedding.webp`

```text
Traditional Nathdwara Pichwai painting style at night: a flat, decorative composition on deep indigo-black and dark maroon grounds, fine gold outlines, rows of white and pink lotuses with lotus leaves, kadamb trees with round blossoms, cows with painted horns and bells, hanging flower garlands, a silver full moon (Sharad Purnima), patterned gold borders; jewel colours with gold-leaf details; no human or divine figures. A haveli canopy at the top with hanging garlands and a pair of lamps, a lotus pond along the bottom, the middle plain maroon. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 4.12 Reception (night) · `nathdwara-raat/reception.webp`

```text
Traditional Nathdwara Pichwai painting style at night: a flat, decorative composition on deep indigo-black and dark maroon grounds, fine gold outlines, rows of white and pink lotuses with lotus leaves, kadamb trees with round blossoms, cows with painted horns and bells, hanging flower garlands, a silver full moon (Sharad Purnima), patterned gold borders; jewel colours with gold-leaf details; no human or divine figures. A deep blue night lotus pond with floating lamps, kadamb trees full of fireflies, a gold moon. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 4.13 Closing page (reply) (night) · `nathdwara-raat/reply.webp`

```text
Traditional Nathdwara Pichwai painting style at night: a flat, decorative composition on deep indigo-black and dark maroon grounds, fine gold outlines, rows of white and pink lotuses with lotus leaves, kadamb trees with round blossoms, cows with painted horns and bells, hanging flower garlands, a silver full moon (Sharad Purnima), patterned gold borders; jewel colours with gold-leaf details; no human or divine figures. A row of lit diyas on a ledge at the bottom with white lotuses, the full moon in an indigo sky with gold stars, a patterned border. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 4.14 Photo page · one photo · `nathdwara-raat/couple.webp`

```text
Traditional Nathdwara Pichwai painting style at night: a flat, decorative composition on deep indigo-black and dark maroon grounds, fine gold outlines, rows of white and pink lotuses with lotus leaves, kadamb trees with round blossoms, cows with painted horns and bells, hanging flower garlands, a silver full moon (Sharad Purnima), patterned gold borders; jewel colours with gold-leaf details; no human or divine figures. A painting with a soft place for one photo of the couple, in a glowing silver moon halo on the indigo night ground. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: lotus stems, kadamb blossoms and small hanging lamps drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 52% of the height down, keep the picture calm and empty for the names: a calm lotus pond. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 4.15 Photo page · two photos · `nathdwara-raat/couple-two.webp`

```text
Traditional Nathdwara Pichwai painting style at night: a flat, decorative composition on deep indigo-black and dark maroon grounds, fine gold outlines, rows of white and pink lotuses with lotus leaves, kadamb trees with round blossoms, cows with painted horns and bells, hanging flower garlands, a silver full moon (Sharad Purnima), patterned gold borders; jewel colours with gold-leaf details; no human or divine figures. A painting with soft places for two photos, in a glowing silver moon halo on the indigo night ground. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a hanging garland of white flowers falls in the gap. Neither has a frame, border, arch, outline or box: lotus stems, kadamb blossoms and small hanging lamps drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 48% of the height down, keep the picture calm and empty for both names: a calm lotus pond. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="chandni-mahal"></a>

## 5. Chandni Mahal (चाँदनी महल)

**A palace by night, every terrace lit with diyas and sky lanterns rising over still water.**

- Folder: `public/suites/chandni-mahal/` · Gate: `public/openings/gates/chandi-kiwad/` (the two doors swing open)
- Best for: Any wedding; perfect for sangeet and reception-led invites · Lettering voice: regal
- Style lock (already inside every prompt below): Cinematic moonlit palace painting: a midnight-blue sky with a silver full moon, an ivory marble palace glowing from within with thousands of warm diyas and lanterns, sky lanterns rising, mirror-still water reflecting the lights; navy, silver and warm gold; magical, regal, highly detailed.

### 5.1 Gate · the view beyond · `chandi-kiwad/beyond.webp`

```text
Cinematic moonlit palace painting: a midnight-blue sky with a silver full moon, an ivory marble palace glowing from within with thousands of warm diyas and lanterns, sky lanterns rising, mirror-still water reflecting the lights; navy, silver and warm gold; magical, regal, highly detailed. The view through the gateway once it opens: A grand palace on a lake at night, every window glowing, sky lanterns rising, reflections on still water. Fill the whole picture, with no gate, arch, door or frame in it; a bright, calm, glowing centre. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 5.2 Gate · the arch · `chandi-kiwad/arch.webp`

```text
Cinematic moonlit palace painting: a midnight-blue sky with a silver full moon, an ivory marble palace glowing from within with thousands of warm diyas and lanterns, sky lanterns rising, mirror-still water reflecting the lights; navy, silver and warm gold; magical, regal, highly detailed. A gateway seen from the front, filling the whole picture edge to edge: A moonlit white marble Rajput arch with silver filigree lanterns glowing on both sides and jasmine garlands, set in a carved marble wall under a navy night sky. The doorway inside the arch is filled with one flat pure green colour #00FF00, from the threshold at the very bottom edge of the picture up to the arch's crown, about 60 to 70% of the picture's width; nothing stands in front of the green. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 5.3 Gate · left door · `chandi-kiwad/door-left.webp`

```text
Cinematic moonlit palace painting: a midnight-blue sky with a silver full moon, an ivory marble palace glowing from within with thousands of warm diyas and lanterns, sky lanterns rising, mirror-still water reflecting the lights; navy, silver and warm gold; magical, regal, highly detailed. The LEFT door leaf of a pair, seen perfectly straight-on and flat, filling the whole picture edge to edge with no wall, frame, floor or background around it: a silver repoussé door leaf with embossed lotus and full-moon motifs, a studded border and a silver ring handle, gleaming in moonlight. Its hinge side is the left edge of the picture; the edge where it meets the other door is the right edge, with the handle near it. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 5.4 Gate · right door · `chandi-kiwad/door-right.webp`

```text
Cinematic moonlit palace painting: a midnight-blue sky with a silver full moon, an ivory marble palace glowing from within with thousands of warm diyas and lanterns, sky lanterns rising, mirror-still water reflecting the lights; navy, silver and warm gold; magical, regal, highly detailed. The RIGHT door leaf of a pair, seen perfectly straight-on and flat, filling the whole picture edge to edge with no wall, frame, floor or background around it: a silver repoussé door leaf with embossed lotus and full-moon motifs, a studded border and a silver ring handle, gleaming in moonlight. Its hinge side is the right edge of the picture; the edge where it meets the other door is the left edge, with the handle near it. It mirrors the left one. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 5.5 Cover (dusk) · `chandni-mahal/cover.webp`

```text
Cinematic moonlit palace painting: a midnight-blue sky with a silver full moon, an ivory marble palace glowing from within with thousands of warm diyas and lanterns, sky lanterns rising, mirror-still water reflecting the lights; navy, silver and warm gold; magical, regal, highly detailed. A grand palace on a lake at night, every window and terrace glowing, sky lanterns rising, the full moon above, reflections on still water. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 5.6 Family (day) · `chandni-mahal/family.webp`

```text
Cinematic moonlit palace painting: a midnight-blue sky with a silver full moon, an ivory marble palace glowing from within with thousands of warm diyas and lanterns, sky lanterns rising, mirror-still water reflecting the lights; navy, silver and warm gold; magical, regal, highly detailed. The palace's garden courtyard at blue twilight before the lamps are lit: fountains, white roses, silver lanterns waiting. Composition: leave one calm open area in the middle, about 70% of the width and 40% of the height (the plain inside of an arch, a window of soft sky or a smooth wall), for words; put the detail around it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 5.7 Haldi (morning) · `chandni-mahal/haldi.webp`

```text
Cinematic moonlit palace painting: a midnight-blue sky with a silver full moon, an ivory marble palace glowing from within with thousands of warm diyas and lanterns, sky lanterns rising, mirror-still water reflecting the lights; navy, silver and warm gold; magical, regal, highly detailed. A palace terrace at dawn in pale blue and gold, marigold garlands, brass urns of turmeric, the moon fading in the sky. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 5.8 Mehendi (day) · `chandni-mahal/mehendi.webp`

```text
Cinematic moonlit palace painting: a midnight-blue sky with a silver full moon, an ivory marble palace glowing from within with thousands of warm diyas and lanterns, sky lanterns rising, mirror-still water reflecting the lights; navy, silver and warm gold; magical, regal, highly detailed. A garden pavilion with sheer white drapes and green and gold cushions, lanterns hung in the trees, blue-hour light. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 5.9 Sangeet (night) · `chandni-mahal/sangeet.webp`

```text
Cinematic moonlit palace painting: a midnight-blue sky with a silver full moon, an ivory marble palace glowing from within with thousands of warm diyas and lanterns, sky lanterns rising, mirror-still water reflecting the lights; navy, silver and warm gold; magical, regal, highly detailed. A palace courtyard at night under a canopy of hanging lanterns and fairy lights, drums on a carpet stage, sparkles in the air. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 5.10 Baraat (dusk) · `chandni-mahal/baraat.webp`

```text
Cinematic moonlit palace painting: a midnight-blue sky with a silver full moon, an ivory marble palace glowing from within with thousands of warm diyas and lanterns, sky lanterns rising, mirror-still water reflecting the lights; navy, silver and warm gold; magical, regal, highly detailed. The palace gate road at blue dusk lined with torches and diyas, fireworks bursting silver and gold above. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 5.11 Wedding (dusk) · `chandni-mahal/wedding.webp`

```text
Cinematic moonlit palace painting: a midnight-blue sky with a silver full moon, an ivory marble palace glowing from within with thousands of warm diyas and lanterns, sky lanterns rising, mirror-still water reflecting the lights; navy, silver and warm gold; magical, regal, highly detailed. A white marble mandap on the lake edge at night draped in white flowers, ringed by floating diyas, the moon above. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 5.12 Reception (night) · `chandni-mahal/reception.webp`

```text
Cinematic moonlit palace painting: a midnight-blue sky with a silver full moon, an ivory marble palace glowing from within with thousands of warm diyas and lanterns, sky lanterns rising, mirror-still water reflecting the lights; navy, silver and warm gold; magical, regal, highly detailed. A palace terrace at night with crystal chandeliers hung in the open air, rows of candles, the lit palace reflected in water. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 5.13 Closing page (reply) (night) · `chandni-mahal/reply.webp`

```text
Cinematic moonlit palace painting: a midnight-blue sky with a silver full moon, an ivory marble palace glowing from within with thousands of warm diyas and lanterns, sky lanterns rising, mirror-still water reflecting the lights; navy, silver and warm gold; magical, regal, highly detailed. A carved balcony overlooking the lit lake, a single lantern on the ledge, the full moon, a quiet glow. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 5.14 Photo page · one photo · `chandni-mahal/couple.webp`

```text
Cinematic moonlit palace painting: a midnight-blue sky with a silver full moon, an ivory marble palace glowing from within with thousands of warm diyas and lanterns, sky lanterns rising, mirror-still water reflecting the lights; navy, silver and warm gold; magical, regal, highly detailed. A painting with a soft place for one photo of the couple, in a soft silver moon-glow in the night sky. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: drifting sky lanterns and strands of glowing fairy lights drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 52% of the height down, keep the picture calm and empty for the names: the palace's lights reflected on still water. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 5.15 Photo page · two photos · `chandni-mahal/couple-two.webp`

```text
Cinematic moonlit palace painting: a midnight-blue sky with a silver full moon, an ivory marble palace glowing from within with thousands of warm diyas and lanterns, sky lanterns rising, mirror-still water reflecting the lights; navy, silver and warm gold; magical, regal, highly detailed. A painting with soft places for two photos, in a soft silver moon-glow in the night sky. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a hanging silver lantern on a jasmine string falls in the gap. Neither has a frame, border, arch, outline or box: drifting sky lanterns and strands of glowing fairy lights drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 48% of the height down, keep the picture calm and empty for both names: the palace's lights reflected on still water. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="aakash-mahal"></a>

## 6. Aakash Mahal (आकाश महल)

**A palace in the clouds: white marble, chandeliers in the open sky and cascades of blush roses.**

- Folder: `public/suites/aakash-mahal/` · Gate: `public/openings/gates/swarg-kiwad/` (the two doors swing open)
- Best for: Christian and Modern weddings, any family wanting soft white and gold · Lettering voice: romantic
- Style lock (already inside every prompt below): Ethereal celestial palace in the clouds: white marble colonnades and domes rising out of soft golden clouds, crystal chandeliers hanging in open air, cascades of blush roses, white hydrangeas and peonies, warm heavenly light rays; ivory, blush, champagne and soft gold; dreamy, luminous and romantic.

### 6.1 Gate · the view beyond · `swarg-kiwad/beyond.webp`

```text
Ethereal celestial palace in the clouds: white marble colonnades and domes rising out of soft golden clouds, crystal chandeliers hanging in open air, cascades of blush roses, white hydrangeas and peonies, warm heavenly light rays; ivory, blush, champagne and soft gold; dreamy, luminous and romantic. The view through the gateway once it opens: A white marble pavilion floating on golden clouds at sunset, rose cascades on its pillars, light rays behind. Fill the whole picture, with no gate, arch, door or frame in it; a bright, calm, glowing centre. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 6.2 Gate · the arch · `swarg-kiwad/arch.webp`

```text
Ethereal celestial palace in the clouds: white marble colonnades and domes rising out of soft golden clouds, crystal chandeliers hanging in open air, cascades of blush roses, white hydrangeas and peonies, warm heavenly light rays; ivory, blush, champagne and soft gold; dreamy, luminous and romantic. A gateway seen from the front, filling the whole picture edge to edge: A tall white marble arch rising out of soft golden clouds, carved with gilded sunbursts and wrapped in blush roses and white hydrangeas. The doorway inside the arch is filled with one flat pure green colour #00FF00, from the threshold at the very bottom edge of the picture up to the arch's crown, about 60 to 70% of the picture's width; nothing stands in front of the green. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 6.3 Gate · left door · `swarg-kiwad/door-left.webp`

```text
Ethereal celestial palace in the clouds: white marble colonnades and domes rising out of soft golden clouds, crystal chandeliers hanging in open air, cascades of blush roses, white hydrangeas and peonies, warm heavenly light rays; ivory, blush, champagne and soft gold; dreamy, luminous and romantic. The LEFT door leaf of a pair, seen perfectly straight-on and flat, filling the whole picture edge to edge with no wall, frame, floor or background around it: a white marble and gilt door leaf carved with soft clouds and golden rays, a garland of blush roses across it and a slim gold handle. Its hinge side is the left edge of the picture; the edge where it meets the other door is the right edge, with the handle near it. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 6.4 Gate · right door · `swarg-kiwad/door-right.webp`

```text
Ethereal celestial palace in the clouds: white marble colonnades and domes rising out of soft golden clouds, crystal chandeliers hanging in open air, cascades of blush roses, white hydrangeas and peonies, warm heavenly light rays; ivory, blush, champagne and soft gold; dreamy, luminous and romantic. The RIGHT door leaf of a pair, seen perfectly straight-on and flat, filling the whole picture edge to edge with no wall, frame, floor or background around it: a white marble and gilt door leaf carved with soft clouds and golden rays, a garland of blush roses across it and a slim gold handle. Its hinge side is the right edge of the picture; the edge where it meets the other door is the left edge, with the handle near it. It mirrors the left one. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 6.5 Cover (dusk) · `aakash-mahal/cover.webp`

```text
Ethereal celestial palace in the clouds: white marble colonnades and domes rising out of soft golden clouds, crystal chandeliers hanging in open air, cascades of blush roses, white hydrangeas and peonies, warm heavenly light rays; ivory, blush, champagne and soft gold; dreamy, luminous and romantic. A domed white marble pavilion floating on golden clouds at sunset in the lower half, cascades of blush roses on its pillars, light rays behind; open glowing sky above. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 6.6 Family (day) · `aakash-mahal/family.webp`

```text
Ethereal celestial palace in the clouds: white marble colonnades and domes rising out of soft golden clouds, crystal chandeliers hanging in open air, cascades of blush roses, white hydrangeas and peonies, warm heavenly light rays; ivory, blush, champagne and soft gold; dreamy, luminous and romantic. A marble colonnade walkway through the clouds in morning light, flower urns between the columns, soft mist. Composition: leave one calm open area in the middle, about 70% of the width and 40% of the height (the plain inside of an arch, a window of soft sky or a smooth wall), for words; put the detail around it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 6.7 Haldi (morning) · `aakash-mahal/haldi.webp`

```text
Ethereal celestial palace in the clouds: white marble colonnades and domes rising out of soft golden clouds, crystal chandeliers hanging in open air, cascades of blush roses, white hydrangeas and peonies, warm heavenly light rays; ivory, blush, champagne and soft gold; dreamy, luminous and romantic. A sunrise terrace above the clouds with yellow roses and marigold garlands between white pillars, brass urns. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 6.8 Mehendi (day) · `aakash-mahal/mehendi.webp`

```text
Ethereal celestial palace in the clouds: white marble colonnades and domes rising out of soft golden clouds, crystal chandeliers hanging in open air, cascades of blush roses, white hydrangeas and peonies, warm heavenly light rays; ivory, blush, champagne and soft gold; dreamy, luminous and romantic. A cloud garden of white arches covered in green vines and blush flowers, floor cushions, soft daylight. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 6.9 Sangeet (night) · `aakash-mahal/sangeet.webp`

```text
Ethereal celestial palace in the clouds: white marble colonnades and domes rising out of soft golden clouds, crystal chandeliers hanging in open air, cascades of blush roses, white hydrangeas and peonies, warm heavenly light rays; ivory, blush, champagne and soft gold; dreamy, luminous and romantic. Above the clouds at night under a sky full of stars, a marble stage with crystal chandeliers and the moon. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 6.10 Baraat (dusk) · `aakash-mahal/baraat.webp`

```text
Ethereal celestial palace in the clouds: white marble colonnades and domes rising out of soft golden clouds, crystal chandeliers hanging in open air, cascades of blush roses, white hydrangeas and peonies, warm heavenly light rays; ivory, blush, champagne and soft gold; dreamy, luminous and romantic. A grand staircase of marble and clouds rising to golden gates, lined with flower urns and lanterns, sunset light. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 6.11 Wedding (dusk) · `aakash-mahal/wedding.webp`

```text
Ethereal celestial palace in the clouds: white marble colonnades and domes rising out of soft golden clouds, crystal chandeliers hanging in open air, cascades of blush roses, white hydrangeas and peonies, warm heavenly light rays; ivory, blush, champagne and soft gold; dreamy, luminous and romantic. A circular marble mandap with a dome of white flowers standing on the clouds, rose petals floating in the air, glowing light. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 6.12 Reception (night) · `aakash-mahal/reception.webp`

```text
Ethereal celestial palace in the clouds: white marble colonnades and domes rising out of soft golden clouds, crystal chandeliers hanging in open air, cascades of blush roses, white hydrangeas and peonies, warm heavenly light rays; ivory, blush, champagne and soft gold; dreamy, luminous and romantic. A floating ballroom of crystal chandeliers among moonlit clouds, candles on marble. Composition: keep the lower 40% calm (still water, a plain floor, smooth cloth or sand) for words; put the main scene in the upper part. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 6.13 Closing page (reply) (night) · `aakash-mahal/reply.webp`

```text
Ethereal celestial palace in the clouds: white marble colonnades and domes rising out of soft golden clouds, crystal chandeliers hanging in open air, cascades of blush roses, white hydrangeas and peonies, warm heavenly light rays; ivory, blush, champagne and soft gold; dreamy, luminous and romantic. Soft clouds at twilight, a single marble arch with roses, the first stars. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 6.14 Photo page · one photo · `aakash-mahal/couple.webp`

```text
Ethereal celestial palace in the clouds: white marble colonnades and domes rising out of soft golden clouds, crystal chandeliers hanging in open air, cascades of blush roses, white hydrangeas and peonies, warm heavenly light rays; ivory, blush, champagne and soft gold; dreamy, luminous and romantic. A painting with a soft place for one photo of the couple, in a soft golden glow of clouds and light rays. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: drifting cloud and cascades of blush roses and peonies drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 52% of the height down, keep the picture calm and empty for the names: calm soft clouds. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 6.15 Photo page · two photos · `aakash-mahal/couple-two.webp`

```text
Ethereal celestial palace in the clouds: white marble colonnades and domes rising out of soft golden clouds, crystal chandeliers hanging in open air, cascades of blush roses, white hydrangeas and peonies, warm heavenly light rays; ivory, blush, champagne and soft gold; dreamy, luminous and romantic. A painting with soft places for two photos, in a soft golden glow of clouds and light rays. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a cascade of white hydrangeas falls in the gap. Neither has a frame, border, arch, outline or box: drifting cloud and cascades of blush roses and peonies drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 48% of the height down, keep the picture calm and empty for both names: calm soft clouds. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="firoza-bagh"></a>

## 7. Firoza Bagh (फ़िरोज़ा बाग़)

**Turquoise Persian-tile pavilions, fountains and white roses: a royal garden for a Nikah.**

- Folder: `public/suites/firoza-bagh/` · Gate: `public/openings/gates/firoza-darwaza/` (the two doors swing open)
- Best for: Nikah and Muslim weddings (no figures or animals), North Indian, Modern · Lettering voice: regal
- Style lock (already inside every prompt below): Persian-Mughal garden palace art: turquoise and lapis tilework domes, white marble iwan arches with muqarnas, geometric girih patterns, long reflecting pools and fountains, tall cypress trees, white roses and jasmine; turquoise, cobalt, ivory and gold; a fine, detailed miniature-painting finish with soft luminous light; no animals, no birds and no figures.

### 7.1 Gate · the view beyond · `firoza-darwaza/beyond.webp`

```text
Persian-Mughal garden palace art: turquoise and lapis tilework domes, white marble iwan arches with muqarnas, geometric girih patterns, long reflecting pools and fountains, tall cypress trees, white roses and jasmine; turquoise, cobalt, ivory and gold; a fine, detailed miniature-painting finish with soft luminous light; no animals, no birds and no figures. The view through the gateway once it opens: A long reflecting-pool garden with a turquoise-domed pavilion at dusk, cypress rows and fountains. Fill the whole picture, with no gate, arch, door or frame in it; a bright, calm, glowing centre. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 7.2 Gate · the arch · `firoza-darwaza/arch.webp`

```text
Persian-Mughal garden palace art: turquoise and lapis tilework domes, white marble iwan arches with muqarnas, geometric girih patterns, long reflecting pools and fountains, tall cypress trees, white roses and jasmine; turquoise, cobalt, ivory and gold; a fine, detailed miniature-painting finish with soft luminous light; no animals, no birds and no figures. A gateway seen from the front, filling the whole picture edge to edge: A tall iwan arch faced with turquoise and cobalt tiles, geometric gold borders, a muqarnas crown, white roses at its feet. The doorway inside the arch is filled with one flat pure green colour #00FF00, from the threshold at the very bottom edge of the picture up to the arch's crown, about 60 to 70% of the picture's width; nothing stands in front of the green. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 7.3 Gate · left door · `firoza-darwaza/door-left.webp`

```text
Persian-Mughal garden palace art: turquoise and lapis tilework domes, white marble iwan arches with muqarnas, geometric girih patterns, long reflecting pools and fountains, tall cypress trees, white roses and jasmine; turquoise, cobalt, ivory and gold; a fine, detailed miniature-painting finish with soft luminous light; no animals, no birds and no figures. The LEFT door leaf of a pair, seen perfectly straight-on and flat, filling the whole picture edge to edge with no wall, frame, floor or background around it: a carved walnut door leaf inlaid with turquoise tile stars and brass studs in a geometric girih pattern, with a brass knocker. Its hinge side is the left edge of the picture; the edge where it meets the other door is the right edge, with the handle near it. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 7.4 Gate · right door · `firoza-darwaza/door-right.webp`

```text
Persian-Mughal garden palace art: turquoise and lapis tilework domes, white marble iwan arches with muqarnas, geometric girih patterns, long reflecting pools and fountains, tall cypress trees, white roses and jasmine; turquoise, cobalt, ivory and gold; a fine, detailed miniature-painting finish with soft luminous light; no animals, no birds and no figures. The RIGHT door leaf of a pair, seen perfectly straight-on and flat, filling the whole picture edge to edge with no wall, frame, floor or background around it: a carved walnut door leaf inlaid with turquoise tile stars and brass studs in a geometric girih pattern, with a brass knocker. Its hinge side is the right edge of the picture; the edge where it meets the other door is the left edge, with the handle near it. It mirrors the left one. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 7.5 Cover (dusk) · `firoza-bagh/cover.webp`

```text
Persian-Mughal garden palace art: turquoise and lapis tilework domes, white marble iwan arches with muqarnas, geometric girih patterns, long reflecting pools and fountains, tall cypress trees, white roses and jasmine; turquoise, cobalt, ivory and gold; a fine, detailed miniature-painting finish with soft luminous light; no animals, no birds and no figures. A turquoise-domed garden pavilion at the end of a long reflecting pool at dusk, rows of cypress, fountains, a soft rose-gold sky. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 7.6 Family (day) · `firoza-bagh/family.webp`

```text
Persian-Mughal garden palace art: turquoise and lapis tilework domes, white marble iwan arches with muqarnas, geometric girih patterns, long reflecting pools and fountains, tall cypress trees, white roses and jasmine; turquoise, cobalt, ivory and gold; a fine, detailed miniature-painting finish with soft luminous light; no animals, no birds and no figures. An ivory iwan arch with blue tile panels opening onto a rose garden in daylight. Composition: leave one calm open area in the middle, about 70% of the width and 40% of the height (the plain inside of an arch, a window of soft sky or a smooth wall), for words; put the detail around it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 7.7 Haldi (morning) · `firoza-bagh/haldi.webp`

```text
Persian-Mughal garden palace art: turquoise and lapis tilework domes, white marble iwan arches with muqarnas, geometric girih patterns, long reflecting pools and fountains, tall cypress trees, white roses and jasmine; turquoise, cobalt, ivory and gold; a fine, detailed miniature-painting finish with soft luminous light; no animals, no birds and no figures. A tiled courtyard at sunrise with brass lanterns and a fountain scattered with marigold petals, golden light on turquoise tiles. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 7.8 Mehendi (day) · `firoza-bagh/mehendi.webp`

```text
Persian-Mughal garden palace art: turquoise and lapis tilework domes, white marble iwan arches with muqarnas, geometric girih patterns, long reflecting pools and fountains, tall cypress trees, white roses and jasmine; turquoise, cobalt, ivory and gold; a fine, detailed miniature-painting finish with soft luminous light; no animals, no birds and no figures. A shaded garden under a blue and green tiled arcade, emerald silk cushions, potted jasmine, dappled light. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 7.9 Sangeet (night) · `firoza-bagh/sangeet.webp`

```text
Persian-Mughal garden palace art: turquoise and lapis tilework domes, white marble iwan arches with muqarnas, geometric girih patterns, long reflecting pools and fountains, tall cypress trees, white roses and jasmine; turquoise, cobalt, ivory and gold; a fine, detailed miniature-painting finish with soft luminous light; no animals, no birds and no figures. A garden at night lit by hundreds of pierced brass lanterns casting star-shaped light patterns, carpets with cushions, a fountain. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 7.10 Baraat (dusk) · `firoza-bagh/baraat.webp`

```text
Persian-Mughal garden palace art: turquoise and lapis tilework domes, white marble iwan arches with muqarnas, geometric girih patterns, long reflecting pools and fountains, tall cypress trees, white roses and jasmine; turquoise, cobalt, ivory and gold; a fine, detailed miniature-painting finish with soft luminous light; no animals, no birds and no figures. A grand turquoise-tiled gateway at dusk with lanterns and white flower garlands, an avenue of torches leading to it. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 7.11 Wedding (dusk) · `firoza-bagh/wedding.webp`

```text
Persian-Mughal garden palace art: turquoise and lapis tilework domes, white marble iwan arches with muqarnas, geometric girih patterns, long reflecting pools and fountains, tall cypress trees, white roses and jasmine; turquoise, cobalt, ivory and gold; a fine, detailed miniature-painting finish with soft luminous light; no animals, no birds and no figures. A white marble pavilion with twelve slender arches draped in white flowers over a still pool, a turquoise dome behind, dusk glow. Composition: leave one calm open area in the middle, about 70% of the width and 40% of the height (the plain inside of an arch, a window of soft sky or a smooth wall), for words; put the detail around it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 7.12 Reception (night) · `firoza-bagh/reception.webp`

```text
Persian-Mughal garden palace art: turquoise and lapis tilework domes, white marble iwan arches with muqarnas, geometric girih patterns, long reflecting pools and fountains, tall cypress trees, white roses and jasmine; turquoise, cobalt, ivory and gold; a fine, detailed miniature-painting finish with soft luminous light; no animals, no birds and no figures. A palace garden at night with a reflecting pool full of floating candles and a lit turquoise dome. Composition: keep the lower 40% calm (still water, a plain floor, smooth cloth or sand) for words; put the main scene in the upper part. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 7.13 Closing page (reply) (night) · `firoza-bagh/reply.webp`

```text
Persian-Mughal garden palace art: turquoise and lapis tilework domes, white marble iwan arches with muqarnas, geometric girih patterns, long reflecting pools and fountains, tall cypress trees, white roses and jasmine; turquoise, cobalt, ivory and gold; a fine, detailed miniature-painting finish with soft luminous light; no animals, no birds and no figures. A carved marble jaali window with moonlight streaming through, white roses and a lantern on the sill. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 7.14 Photo page · one photo · `firoza-bagh/couple.webp`

```text
Persian-Mughal garden palace art: turquoise and lapis tilework domes, white marble iwan arches with muqarnas, geometric girih patterns, long reflecting pools and fountains, tall cypress trees, white roses and jasmine; turquoise, cobalt, ivory and gold; a fine, detailed miniature-painting finish with soft luminous light; no animals, no birds and no figures. A painting with a soft place for one photo of the couple, in a soft turquoise-and-gold glow over the garden. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: sprays of white roses and jasmine and a hanging pierced brass lantern drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 52% of the height down, keep the picture calm and empty for the names: a still reflecting pool. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 7.15 Photo page · two photos · `firoza-bagh/couple-two.webp`

```text
Persian-Mughal garden palace art: turquoise and lapis tilework domes, white marble iwan arches with muqarnas, geometric girih patterns, long reflecting pools and fountains, tall cypress trees, white roses and jasmine; turquoise, cobalt, ivory and gold; a fine, detailed miniature-painting finish with soft luminous light; no animals, no birds and no figures. A painting with soft places for two photos, in a soft turquoise-and-gold glow over the garden. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a cascade of jasmine falls in the gap. Neither has a frame, border, arch, outline or box: sprays of white roses and jasmine and a hanging pierced brass lantern drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 48% of the height down, keep the picture calm and empty for both names: a still reflecting pool. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="gulabi-nagar"></a>

## 8. Gulabi Nagar (गुलाबी नगर)

**The Pink City in pastel: honeycomb palaces, bougainvillea, peach blossom and kites in the sky.**

- Folder: `public/suites/gulabi-nagar/` · Gate: `public/openings/gates/jharokha-pat/` (the two doors swing open)
- Best for: Rajasthani, Marwari, North Indian · Lettering voice: romantic
- Style lock (already inside every prompt below): Pastel Pink City painting: blush-pink and peach sandstone palaces with honeycomb jharokhas and domed chhatris, bougainvillea and peach blossom trees, a pastel sky with a pale moon, soft golden light, paper kites drifting, marigold and rose garlands; pink, peach, coral, cream and soft gold; dreamy, soft-focus and romantic.

### 8.1 Gate · the view beyond · `jharokha-pat/beyond.webp`

```text
Pastel Pink City painting: blush-pink and peach sandstone palaces with honeycomb jharokhas and domed chhatris, bougainvillea and peach blossom trees, a pastel sky with a pale moon, soft golden light, paper kites drifting, marigold and rose garlands; pink, peach, coral, cream and soft gold; dreamy, soft-focus and romantic. The view through the gateway once it opens: A pink palace facade of small windows glowing at sunset, a pale moon, paper kites in the sky, bougainvillea in front. Fill the whole picture, with no gate, arch, door or frame in it; a bright, calm, glowing centre. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 8.2 Gate · the arch · `jharokha-pat/arch.webp`

```text
Pastel Pink City painting: blush-pink and peach sandstone palaces with honeycomb jharokhas and domed chhatris, bougainvillea and peach blossom trees, a pastel sky with a pale moon, soft golden light, paper kites drifting, marigold and rose garlands; pink, peach, coral, cream and soft gold; dreamy, soft-focus and romantic. A gateway seen from the front, filling the whole picture edge to edge: A carved pink sandstone jharokha gateway with a small dome on top, stained-glass panels in its spandrels, bougainvillea spilling down both sides. The doorway inside the arch is filled with one flat pure green colour #00FF00, from the threshold at the very bottom edge of the picture up to the arch's crown, about 60 to 70% of the picture's width; nothing stands in front of the green. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 8.3 Gate · left door · `jharokha-pat/door-left.webp`

```text
Pastel Pink City painting: blush-pink and peach sandstone palaces with honeycomb jharokhas and domed chhatris, bougainvillea and peach blossom trees, a pastel sky with a pale moon, soft golden light, paper kites drifting, marigold and rose garlands; pink, peach, coral, cream and soft gold; dreamy, soft-focus and romantic. The LEFT door leaf of a pair, seen perfectly straight-on and flat, filling the whole picture edge to edge with no wall, frame, floor or background around it: a pink-painted wooden shutter leaf with rows of stained-glass panes in peach, green and gold, carved floral panels and brass hinges. Its hinge side is the left edge of the picture; the edge where it meets the other door is the right edge, with the handle near it. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 8.4 Gate · right door · `jharokha-pat/door-right.webp`

```text
Pastel Pink City painting: blush-pink and peach sandstone palaces with honeycomb jharokhas and domed chhatris, bougainvillea and peach blossom trees, a pastel sky with a pale moon, soft golden light, paper kites drifting, marigold and rose garlands; pink, peach, coral, cream and soft gold; dreamy, soft-focus and romantic. The RIGHT door leaf of a pair, seen perfectly straight-on and flat, filling the whole picture edge to edge with no wall, frame, floor or background around it: a pink-painted wooden shutter leaf with rows of stained-glass panes in peach, green and gold, carved floral panels and brass hinges. Its hinge side is the right edge of the picture; the edge where it meets the other door is the left edge, with the handle near it. It mirrors the left one. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 8.5 Cover (dusk) · `gulabi-nagar/cover.webp`

```text
Pastel Pink City painting: blush-pink and peach sandstone palaces with honeycomb jharokhas and domed chhatris, bougainvillea and peach blossom trees, a pastel sky with a pale moon, soft golden light, paper kites drifting, marigold and rose garlands; pink, peach, coral, cream and soft gold; dreamy, soft-focus and romantic. A pink palace facade of many small windows glowing at sunset in the lower half, a pale moon and paper kites in the open pastel sky above, bougainvillea in front. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 8.6 Family (day) · `gulabi-nagar/family.webp`

```text
Pastel Pink City painting: blush-pink and peach sandstone palaces with honeycomb jharokhas and domed chhatris, bougainvillea and peach blossom trees, a pastel sky with a pale moon, soft golden light, paper kites drifting, marigold and rose garlands; pink, peach, coral, cream and soft gold; dreamy, soft-focus and romantic. A peach haveli courtyard with scalloped arches, a fountain and rose bushes in daylight. Composition: leave one calm open area in the middle, about 70% of the width and 40% of the height (the plain inside of an arch, a window of soft sky or a smooth wall), for words; put the detail around it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 8.7 Haldi (morning) · `gulabi-nagar/haldi.webp`

```text
Pastel Pink City painting: blush-pink and peach sandstone palaces with honeycomb jharokhas and domed chhatris, bougainvillea and peach blossom trees, a pastel sky with a pale moon, soft golden light, paper kites drifting, marigold and rose garlands; pink, peach, coral, cream and soft gold; dreamy, soft-focus and romantic. A pink rooftop at sunrise with yellow drapes, marigold strings, brass bowls and kites resting on the parapet. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 8.8 Mehendi (day) · `gulabi-nagar/mehendi.webp`

```text
Pastel Pink City painting: blush-pink and peach sandstone palaces with honeycomb jharokhas and domed chhatris, bougainvillea and peach blossom trees, a pastel sky with a pale moon, soft golden light, paper kites drifting, marigold and rose garlands; pink, peach, coral, cream and soft gold; dreamy, soft-focus and romantic. A blossoming peach orchard beside a pink pavilion, swings hung with flower ropes, cushions. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 8.9 Sangeet (night) · `gulabi-nagar/sangeet.webp`

```text
Pastel Pink City painting: blush-pink and peach sandstone palaces with honeycomb jharokhas and domed chhatris, bougainvillea and peach blossom trees, a pastel sky with a pale moon, soft golden light, paper kites drifting, marigold and rose garlands; pink, peach, coral, cream and soft gold; dreamy, soft-focus and romantic. A pink palace courtyard at night lit with pastel lanterns and fairy lights, drums on carpets. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 8.10 Baraat (dusk) · `gulabi-nagar/baraat.webp`

```text
Pastel Pink City painting: blush-pink and peach sandstone palaces with honeycomb jharokhas and domed chhatris, bougainvillea and peach blossom trees, a pastel sky with a pale moon, soft golden light, paper kites drifting, marigold and rose garlands; pink, peach, coral, cream and soft gold; dreamy, soft-focus and romantic. A pink old-city gate at dusk with a marigold toran, strings of lights and fireworks. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 8.11 Wedding (dusk) · `gulabi-nagar/wedding.webp`

```text
Pastel Pink City painting: blush-pink and peach sandstone palaces with honeycomb jharokhas and domed chhatris, bougainvillea and peach blossom trees, a pastel sky with a pale moon, soft golden light, paper kites drifting, marigold and rose garlands; pink, peach, coral, cream and soft gold; dreamy, soft-focus and romantic. A pink sandstone pavilion mandap draped in peach and white flowers on a rooftop at dusk, the city's domes beyond. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 8.12 Reception (night) · `gulabi-nagar/reception.webp`

```text
Pastel Pink City painting: blush-pink and peach sandstone palaces with honeycomb jharokhas and domed chhatris, bougainvillea and peach blossom trees, a pastel sky with a pale moon, soft golden light, paper kites drifting, marigold and rose garlands; pink, peach, coral, cream and soft gold; dreamy, soft-focus and romantic. The pink palace lit with lights at night and reflected in a lake. Composition: keep the lower 40% calm (still water, a plain floor, smooth cloth or sand) for words; put the main scene in the upper part. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 8.13 Closing page (reply) (night) · `gulabi-nagar/reply.webp`

```text
Pastel Pink City painting: blush-pink and peach sandstone palaces with honeycomb jharokhas and domed chhatris, bougainvillea and peach blossom trees, a pastel sky with a pale moon, soft golden light, paper kites drifting, marigold and rose garlands; pink, peach, coral, cream and soft gold; dreamy, soft-focus and romantic. A jharokha window at night with a glowing lantern and bougainvillea, the moon beyond. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 8.14 Photo page · one photo · `gulabi-nagar/couple.webp`

```text
Pastel Pink City painting: blush-pink and peach sandstone palaces with honeycomb jharokhas and domed chhatris, bougainvillea and peach blossom trees, a pastel sky with a pale moon, soft golden light, paper kites drifting, marigold and rose garlands; pink, peach, coral, cream and soft gold; dreamy, soft-focus and romantic. A painting with a soft place for one photo of the couple, in a peach sunset glow with pink domes faint beyond. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: bougainvillea and peach blossom branches and one drifting paper kite drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 52% of the height down, keep the picture calm and empty for the names: a calm pink sandstone wall. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 8.15 Photo page · two photos · `gulabi-nagar/couple-two.webp`

```text
Pastel Pink City painting: blush-pink and peach sandstone palaces with honeycomb jharokhas and domed chhatris, bougainvillea and peach blossom trees, a pastel sky with a pale moon, soft golden light, paper kites drifting, marigold and rose garlands; pink, peach, coral, cream and soft gold; dreamy, soft-focus and romantic. A painting with soft places for two photos, in a peach sunset glow with pink domes faint beyond. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a hanging marigold garland falls in the gap. Neither has a frame, border, arch, outline or box: bougainvillea and peach blossom branches and one drifting paper kite drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 48% of the height down, keep the picture calm and empty for both names: a calm pink sandstone wall. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="hina"></a>

## 9. Hina (हिना)

**Henna art everywhere: every arch, wall and sky is drawn over with fine mehndi patterns.**

- Folder: `public/suites/hina/` · Gate: `public/openings/gates/hina-kiwad/` (the two doors swing open)
- Best for: Any wedding, especially mehendi-led invites; North Indian, Gujarati, Muslim · Lettering voice: romantic
- Style lock (already inside every prompt below): Henna-art illustration: warm peach, apricot and terracotta palette, every surface decorated with fine rust-brown mehndi line patterns (paisleys, vines, mandalas and dots) as if drawn with a henna cone; arches and jharokhas, marigolds, roses and green leaves; soft warm light; delicate, handcrafted and joyful.

### 9.1 Gate · the view beyond · `hina-kiwad/beyond.webp`

```text
Henna-art illustration: warm peach, apricot and terracotta palette, every surface decorated with fine rust-brown mehndi line patterns (paisleys, vines, mandalas and dots) as if drawn with a henna cone; arches and jharokhas, marigolds, roses and green leaves; soft warm light; delicate, handcrafted and joyful. The view through the gateway once it opens: An apricot sunset courtyard with henna patterns on its walls, marigolds and lanterns. Fill the whole picture, with no gate, arch, door or frame in it; a bright, calm, glowing centre. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 9.2 Gate · the arch · `hina-kiwad/arch.webp`

```text
Henna-art illustration: warm peach, apricot and terracotta palette, every surface decorated with fine rust-brown mehndi line patterns (paisleys, vines, mandalas and dots) as if drawn with a henna cone; arches and jharokhas, marigolds, roses and green leaves; soft warm light; delicate, handcrafted and joyful. A gateway seen from the front, filling the whole picture edge to edge: A carved terracotta and peach arch covered all over in fine henna line patterns, marigold strings hanging from its crown. The doorway inside the arch is filled with one flat pure green colour #00FF00, from the threshold at the very bottom edge of the picture up to the arch's crown, about 60 to 70% of the picture's width; nothing stands in front of the green. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 9.3 Gate · left door · `hina-kiwad/door-left.webp`

```text
Henna-art illustration: warm peach, apricot and terracotta palette, every surface decorated with fine rust-brown mehndi line patterns (paisleys, vines, mandalas and dots) as if drawn with a henna cone; arches and jharokhas, marigolds, roses and green leaves; soft warm light; delicate, handcrafted and joyful. The LEFT door leaf of a pair, seen perfectly straight-on and flat, filling the whole picture edge to edge with no wall, frame, floor or background around it: a wooden door leaf painted cream with a full-height henna design in rust-brown (paisleys and a large mandala), brass studs and a ring handle. Its hinge side is the left edge of the picture; the edge where it meets the other door is the right edge, with the handle near it. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 9.4 Gate · right door · `hina-kiwad/door-right.webp`

```text
Henna-art illustration: warm peach, apricot and terracotta palette, every surface decorated with fine rust-brown mehndi line patterns (paisleys, vines, mandalas and dots) as if drawn with a henna cone; arches and jharokhas, marigolds, roses and green leaves; soft warm light; delicate, handcrafted and joyful. The RIGHT door leaf of a pair, seen perfectly straight-on and flat, filling the whole picture edge to edge with no wall, frame, floor or background around it: a wooden door leaf painted cream with a full-height henna design in rust-brown (paisleys and a large mandala), brass studs and a ring handle. Its hinge side is the right edge of the picture; the edge where it meets the other door is the left edge, with the handle near it. It mirrors the left one. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 9.5 Cover (dusk) · `hina/cover.webp`

```text
Henna-art illustration: warm peach, apricot and terracotta palette, every surface decorated with fine rust-brown mehndi line patterns (paisleys, vines, mandalas and dots) as if drawn with a henna cone; arches and jharokhas, marigolds, roses and green leaves; soft warm light; delicate, handcrafted and joyful. A tall peach arch completely covered in henna line patterns, marigold garlands hanging from it, the sky beyond apricot at sunset with henna-pattern clouds. Composition: leave one calm open area in the middle, about 70% of the width and 40% of the height (the plain inside of an arch, a window of soft sky or a smooth wall), for words; put the detail around it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 9.6 Family (day) · `hina/family.webp`

```text
Henna-art illustration: warm peach, apricot and terracotta palette, every surface decorated with fine rust-brown mehndi line patterns (paisleys, vines, mandalas and dots) as if drawn with a henna cone; arches and jharokhas, marigolds, roses and green leaves; soft warm light; delicate, handcrafted and joyful. A cream wall with one large henna mandala drawn on it, potted roses and brass lamps at its foot. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 9.7 Haldi (morning) · `hina/haldi.webp`

```text
Henna-art illustration: warm peach, apricot and terracotta palette, every surface decorated with fine rust-brown mehndi line patterns (paisleys, vines, mandalas and dots) as if drawn with a henna cone; arches and jharokhas, marigolds, roses and green leaves; soft warm light; delicate, handcrafted and joyful. A sunlit courtyard floor painted with henna patterns, brass bowls of turmeric, marigold petals, yellow drapes. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 9.8 Mehendi (day) · `hina/mehendi.webp`

```text
Henna-art illustration: warm peach, apricot and terracotta palette, every surface decorated with fine rust-brown mehndi line patterns (paisleys, vines, mandalas and dots) as if drawn with a henna cone; arches and jharokhas, marigolds, roses and green leaves; soft warm light; delicate, handcrafted and joyful. Henna cones in a brass tray among roses and jasmine along the bottom, henna vines climbing up both sides of the picture. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 9.9 Sangeet (night) · `hina/sangeet.webp`

```text
Henna-art illustration: warm peach, apricot and terracotta palette, every surface decorated with fine rust-brown mehndi line patterns (paisleys, vines, mandalas and dots) as if drawn with a henna cone; arches and jharokhas, marigolds, roses and green leaves; soft warm light; delicate, handcrafted and joyful. A night courtyard with lanterns whose glow casts lace-like henna shadows on the walls, a dholak painted with henna patterns. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 9.10 Baraat (dusk) · `hina/baraat.webp`

```text
Henna-art illustration: warm peach, apricot and terracotta palette, every surface decorated with fine rust-brown mehndi line patterns (paisleys, vines, mandalas and dots) as if drawn with a henna cone; arches and jharokhas, marigolds, roses and green leaves; soft warm light; delicate, handcrafted and joyful. A haveli gateway at dusk with henna-painted walls, torches, a marigold toran and a decorated horse with no rider. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 9.11 Wedding (dusk) · `hina/wedding.webp`

```text
Henna-art illustration: warm peach, apricot and terracotta palette, every surface decorated with fine rust-brown mehndi line patterns (paisleys, vines, mandalas and dots) as if drawn with a henna cone; arches and jharokhas, marigolds, roses and green leaves; soft warm light; delicate, handcrafted and joyful. A mandap whose four pillars are painted with henna patterns, peach drapes, marigold and rose garlands, petals. Composition: keep the lower 40% calm (still water, a plain floor, smooth cloth or sand) for words; put the main scene in the upper part. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 9.12 Reception (night) · `hina/reception.webp`

```text
Henna-art illustration: warm peach, apricot and terracotta palette, every surface decorated with fine rust-brown mehndi line patterns (paisleys, vines, mandalas and dots) as if drawn with a henna cone; arches and jharokhas, marigolds, roses and green leaves; soft warm light; delicate, handcrafted and joyful. A night garden with henna-patterned lanterns and terracotta diyas. Composition: keep the lower 40% calm (still water, a plain floor, smooth cloth or sand) for words; put the main scene in the upper part. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 9.13 Closing page (reply) (night) · `hina/reply.webp`

```text
Henna-art illustration: warm peach, apricot and terracotta palette, every surface decorated with fine rust-brown mehndi line patterns (paisleys, vines, mandalas and dots) as if drawn with a henna cone; arches and jharokhas, marigolds, roses and green leaves; soft warm light; delicate, handcrafted and joyful. Two henna-patterned terracotta diyas and roses on a ledge, a henna-lace window behind. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 9.14 Photo page · one photo · `hina/couple.webp`

```text
Henna-art illustration: warm peach, apricot and terracotta palette, every surface decorated with fine rust-brown mehndi line patterns (paisleys, vines, mandalas and dots) as if drawn with a henna cone; arches and jharokhas, marigolds, roses and green leaves; soft warm light; delicate, handcrafted and joyful. A painting with a soft place for one photo of the couple, in a warm apricot glow. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: henna-drawn vines with real marigolds and roses curling over drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 52% of the height down, keep the picture calm and empty for the names: a cream wall with henna dots. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 9.15 Photo page · two photos · `hina/couple-two.webp`

```text
Henna-art illustration: warm peach, apricot and terracotta palette, every surface decorated with fine rust-brown mehndi line patterns (paisleys, vines, mandalas and dots) as if drawn with a henna cone; arches and jharokhas, marigolds, roses and green leaves; soft warm light; delicate, handcrafted and joyful. A painting with soft places for two photos, in a warm apricot glow. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a henna-drawn paisley vine falls in the gap. Neither has a frame, border, arch, outline or box: henna-drawn vines with real marigolds and roses curling over drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 48% of the height down, keep the picture calm and empty for both names: a cream wall with henna dots. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="mor-sarovar"></a>

## 10. Mor Sarovar (मोर सरोवर)

**A peacock lake at dawn: marble chhatris, lotuses and peacocks in mint, teal and gold watercolour.**

- Folder: `public/suites/mor-sarovar/` · Gate: `public/openings/gates/mor-pankh/` (the two screens slide apart)
- Best for: Gujarati, Rajasthani, Modern · Lettering voice: romantic
- Style lock (already inside every prompt below): Fine watercolour and gold-ink painting of a peacock lake: mint, sage, teal and soft gold, marble chhatri pavilions on the water, pink and white lotuses, peacocks with flowing tails on balustrades, jasmine vines, morning mist, delicate detail; serene and elegant.

### 10.1 Gate · the view beyond · `mor-pankh/beyond.webp`

```text
Fine watercolour and gold-ink painting of a peacock lake: mint, sage, teal and soft gold, marble chhatri pavilions on the water, pink and white lotuses, peacocks with flowing tails on balustrades, jasmine vines, morning mist, delicate detail; serene and elegant. The view through the gateway once it opens: A lotus lake with a marble chhatri at golden dusk, a peacock on the balustrade, mist on the water. Fill the whole picture, with no gate, arch, door or frame in it; a bright, calm, glowing centre. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 10.2 Gate · the arch · `mor-pankh/arch.webp`

```text
Fine watercolour and gold-ink painting of a peacock lake: mint, sage, teal and soft gold, marble chhatri pavilions on the water, pink and white lotuses, peacocks with flowing tails on balustrades, jasmine vines, morning mist, delicate detail; serene and elegant. A gateway seen from the front, filling the whole picture edge to edge: A white marble chhatri arch with teal and gold painted borders, jasmine vines and two peacocks perched on its top corners. The doorway inside the arch is filled with one flat pure green colour #00FF00, from the threshold at the very bottom edge of the picture up to the arch's crown, about 60 to 70% of the picture's width; nothing stands in front of the green. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 10.3 Gate · left door · `mor-pankh/door-left.webp`

```text
Fine watercolour and gold-ink painting of a peacock lake: mint, sage, teal and soft gold, marble chhatri pavilions on the water, pink and white lotuses, peacocks with flowing tails on balustrades, jasmine vines, morning mist, delicate detail; serene and elegant. The LEFT panel of a pair of sliding screens, seen straight-on and flat, filling the whole picture edge to edge with no wall or background showing: a tall screen made of overlapping peacock feathers in teal, green and gold, edged with a carved gold rail. Its inner edge, where it meets the other panel, is the right edge of the picture. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 10.4 Gate · right door · `mor-pankh/door-right.webp`

```text
Fine watercolour and gold-ink painting of a peacock lake: mint, sage, teal and soft gold, marble chhatri pavilions on the water, pink and white lotuses, peacocks with flowing tails on balustrades, jasmine vines, morning mist, delicate detail; serene and elegant. The RIGHT panel of a pair of sliding screens, seen straight-on and flat, filling the whole picture edge to edge with no wall or background showing: a tall screen made of overlapping peacock feathers in teal, green and gold, edged with a carved gold rail. Its inner edge, where it meets the other panel, is the left edge of the picture. It mirrors the left one. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 10.5 Cover (dusk) · `mor-sarovar/cover.webp`

```text
Fine watercolour and gold-ink painting of a peacock lake: mint, sage, teal and soft gold, marble chhatri pavilions on the water, pink and white lotuses, peacocks with flowing tails on balustrades, jasmine vines, morning mist, delicate detail; serene and elegant. A marble chhatri on a lotus lake at soft golden dusk, a peacock on the balustrade, mist on the water. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 10.6 Family (day) · `mor-sarovar/family.webp`

```text
Fine watercolour and gold-ink painting of a peacock lake: mint, sage, teal and soft gold, marble chhatri pavilions on the water, pink and white lotuses, peacocks with flowing tails on balustrades, jasmine vines, morning mist, delicate detail; serene and elegant. A lakeside terrace with mint-green columns, lotus pots and a peacock walking along the railing in daylight. Composition: leave one calm open area in the middle, about 70% of the width and 40% of the height (the plain inside of an arch, a window of soft sky or a smooth wall), for words; put the detail around it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 10.7 Haldi (morning) · `mor-sarovar/haldi.webp`

```text
Fine watercolour and gold-ink painting of a peacock lake: mint, sage, teal and soft gold, marble chhatri pavilions on the water, pink and white lotuses, peacocks with flowing tails on balustrades, jasmine vines, morning mist, delicate detail; serene and elegant. Sunrise over the lake, marigold garlands on a marble ghat, brass urns, mist. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 10.8 Mehendi (day) · `mor-sarovar/mehendi.webp`

```text
Fine watercolour and gold-ink painting of a peacock lake: mint, sage, teal and soft gold, marble chhatri pavilions on the water, pink and white lotuses, peacocks with flowing tails on balustrades, jasmine vines, morning mist, delicate detail; serene and elegant. A shady pavilion with teal silk curtains, jasmine vines and a peacock-feather fan on the cushions. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 10.9 Sangeet (night) · `mor-sarovar/sangeet.webp`

```text
Fine watercolour and gold-ink painting of a peacock lake: mint, sage, teal and soft gold, marble chhatri pavilions on the water, pink and white lotuses, peacocks with flowing tails on balustrades, jasmine vines, morning mist, delicate detail; serene and elegant. The lake at night with floating lanterns, a lit pavilion, peacocks in silhouette. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 10.10 Baraat (dusk) · `mor-sarovar/baraat.webp`

```text
Fine watercolour and gold-ink painting of a peacock lake: mint, sage, teal and soft gold, marble chhatri pavilions on the water, pink and white lotuses, peacocks with flowing tails on balustrades, jasmine vines, morning mist, delicate detail; serene and elegant. A lakeside avenue of chhatris with lamps, a decorated boat with marigolds arriving, no people. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 10.11 Wedding (dusk) · `mor-sarovar/wedding.webp`

```text
Fine watercolour and gold-ink painting of a peacock lake: mint, sage, teal and soft gold, marble chhatri pavilions on the water, pink and white lotuses, peacocks with flowing tails on balustrades, jasmine vines, morning mist, delicate detail; serene and elegant. A marble mandap on a platform in the lake, lotuses all round, garlands, dusk light. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 10.12 Reception (night) · `mor-sarovar/reception.webp`

```text
Fine watercolour and gold-ink painting of a peacock lake: mint, sage, teal and soft gold, marble chhatri pavilions on the water, pink and white lotuses, peacocks with flowing tails on balustrades, jasmine vines, morning mist, delicate detail; serene and elegant. The lake palace lit at night with reflections and lanterns. Composition: keep the lower 40% calm (still water, a plain floor, smooth cloth or sand) for words; put the main scene in the upper part. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 10.13 Closing page (reply) (night) · `mor-sarovar/reply.webp`

```text
Fine watercolour and gold-ink painting of a peacock lake: mint, sage, teal and soft gold, marble chhatri pavilions on the water, pink and white lotuses, peacocks with flowing tails on balustrades, jasmine vines, morning mist, delicate detail; serene and elegant. A peacock resting on a moonlit balustrade, lotuses below. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 10.14 Photo page · one photo · `mor-sarovar/couple.webp`

```text
Fine watercolour and gold-ink painting of a peacock lake: mint, sage, teal and soft gold, marble chhatri pavilions on the water, pink and white lotuses, peacocks with flowing tails on balustrades, jasmine vines, morning mist, delicate detail; serene and elegant. A painting with a soft place for one photo of the couple, in a misty soft glow over the lake. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: a peacock's flowing tail feathers draped over one side, with lotuses and jasmine over the others drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 52% of the height down, keep the picture calm and empty for the names: calm misty water. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 10.15 Photo page · two photos · `mor-sarovar/couple-two.webp`

```text
Fine watercolour and gold-ink painting of a peacock lake: mint, sage, teal and soft gold, marble chhatri pavilions on the water, pink and white lotuses, peacocks with flowing tails on balustrades, jasmine vines, morning mist, delicate detail; serene and elegant. A painting with soft places for two photos, in a misty soft glow over the lake. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a single peacock feather and a jasmine vine falls in the gap. Neither has a frame, border, arch, outline or box: a peacock's flowing tail feathers draped over one side, with lotuses and jasmine over the others drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 48% of the height down, keep the picture calm and empty for both names: calm misty water. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="kumudini"></a>

## 11. Kumudini (কুমুদিনী)

**White water lilies opening under the full moon, fireflies and silver lanterns: a quiet, poetic night.**

- Folder: `public/suites/kumudini/` · Gate: `public/openings/gates/jugnu-parda/` (the two curtain halves gather to the sides)
- Best for: Bengali, Odia, Assamese, Modern · Lettering voice: romantic
- Style lock (already inside every prompt below): Dreamy indigo-and-silver night painting: a lake of white water lilies (kumud) opening under the full moon, silver lanterns, fireflies, banyan trees and areca palms in silhouette, a terracotta temple-style pavilion with no figures, white alpona patterns on the banks; indigo, silver-white, soft teal and a touch of red; calm and poetic.

### 11.1 Gate · the view beyond · `jugnu-parda/beyond.webp`

```text
Dreamy indigo-and-silver night painting: a lake of white water lilies (kumud) opening under the full moon, silver lanterns, fireflies, banyan trees and areca palms in silhouette, a terracotta temple-style pavilion with no figures, white alpona patterns on the banks; indigo, silver-white, soft teal and a touch of red; calm and poetic. The view through the gateway once it opens: A moonlit lake of white water lilies, banyan silhouettes, fireflies. Fill the whole picture, with no gate, arch, door or frame in it; a bright, calm, glowing centre. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 11.2 Gate · the arch · `jugnu-parda/arch.webp`

```text
Dreamy indigo-and-silver night painting: a lake of white water lilies (kumud) opening under the full moon, silver lanterns, fireflies, banyan trees and areca palms in silhouette, a terracotta temple-style pavilion with no figures, white alpona patterns on the banks; indigo, silver-white, soft teal and a touch of red; calm and poetic. A gateway seen from the front, filling the whole picture edge to edge: A terracotta temple-style arch carved with lotus and vine panels (no figures), white alpona on its steps, small oil lamps along its base. The doorway inside the arch is filled with one flat pure green colour #00FF00, from the threshold at the very bottom edge of the picture up to the arch's crown, about 60 to 70% of the picture's width; nothing stands in front of the green. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 11.3 Gate · left door · `jugnu-parda/door-left.webp`

```text
Dreamy indigo-and-silver night painting: a lake of white water lilies (kumud) opening under the full moon, silver lanterns, fireflies, banyan trees and areca palms in silhouette, a terracotta temple-style pavilion with no figures, white alpona patterns on the banks; indigo, silver-white, soft teal and a touch of red; calm and poetic. The LEFT half of a pair of curtains, hanging straight and seen straight-on, filling the whole picture edge to edge with no rod, wall or background showing: a gauzy indigo curtain embroidered with silver threads and tiny glowing fireflies, edged with small silver bells. Its outer edge is the left edge of the picture; its inner edge, where it meets the other half, is the right edge. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 11.4 Gate · right door · `jugnu-parda/door-right.webp`

```text
Dreamy indigo-and-silver night painting: a lake of white water lilies (kumud) opening under the full moon, silver lanterns, fireflies, banyan trees and areca palms in silhouette, a terracotta temple-style pavilion with no figures, white alpona patterns on the banks; indigo, silver-white, soft teal and a touch of red; calm and poetic. The RIGHT half of a pair of curtains, hanging straight and seen straight-on, filling the whole picture edge to edge with no rod, wall or background showing: a gauzy indigo curtain embroidered with silver threads and tiny glowing fireflies, edged with small silver bells. Its outer edge is the right edge of the picture; its inner edge, where it meets the other half, is the left edge. It mirrors the left one. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 11.5 Cover (dusk) · `kumudini/cover.webp`

```text
Dreamy indigo-and-silver night painting: a lake of white water lilies (kumud) opening under the full moon, silver lanterns, fireflies, banyan trees and areca palms in silhouette, a terracotta temple-style pavilion with no figures, white alpona patterns on the banks; indigo, silver-white, soft teal and a touch of red; calm and poetic. White water lilies across a moonlit lake, the full moon above, banyan silhouettes, fireflies. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 11.6 Family (day) · `kumudini/family.webp`

```text
Dreamy indigo-and-silver night painting: a lake of white water lilies (kumud) opening under the full moon, silver lanterns, fireflies, banyan trees and areca palms in silhouette, a terracotta temple-style pavilion with no figures, white alpona patterns on the banks; indigo, silver-white, soft teal and a touch of red; calm and poetic. A Bengal courtyard of white walls with red borders and alpona on the floor at blue hour, lilies in brass bowls. Composition: leave one calm open area in the middle, about 70% of the width and 40% of the height (the plain inside of an arch, a window of soft sky or a smooth wall), for words; put the detail around it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 11.7 Haldi (morning) · `kumudini/haldi.webp`

```text
Dreamy indigo-and-silver night painting: a lake of white water lilies (kumud) opening under the full moon, silver lanterns, fireflies, banyan trees and areca palms in silhouette, a terracotta temple-style pavilion with no figures, white alpona patterns on the banks; indigo, silver-white, soft teal and a touch of red; calm and poetic. Dawn over the lily lake, turmeric in brass bowls on a stone ghat, yellow cloth drying on a line, mist. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 11.8 Mehendi (day) · `kumudini/mehendi.webp`

```text
Dreamy indigo-and-silver night painting: a lake of white water lilies (kumud) opening under the full moon, silver lanterns, fireflies, banyan trees and areca palms in silhouette, a terracotta temple-style pavilion with no figures, white alpona patterns on the banks; indigo, silver-white, soft teal and a touch of red; calm and poetic. A shaded verandah with red-bordered white pillars, jasmine and lily pots, patterns of light on the floor. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 11.9 Sangeet (night) · `kumudini/sangeet.webp`

```text
Dreamy indigo-and-silver night painting: a lake of white water lilies (kumud) opening under the full moon, silver lanterns, fireflies, banyan trees and areca palms in silhouette, a terracotta temple-style pavilion with no figures, white alpona patterns on the banks; indigo, silver-white, soft teal and a touch of red; calm and poetic. A night garden full of fireflies and silver lanterns among areca palms, a harmonium and drums on a mat. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 11.10 Baraat (dusk) · `kumudini/baraat.webp`

```text
Dreamy indigo-and-silver night painting: a lake of white water lilies (kumud) opening under the full moon, silver lanterns, fireflies, banyan trees and areca palms in silhouette, a terracotta temple-style pavilion with no figures, white alpona patterns on the banks; indigo, silver-white, soft teal and a touch of red; calm and poetic. A riverside path at dusk with lanterns on bamboo poles and a boat decorated with white flowers. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 11.11 Wedding (dusk) · `kumudini/wedding.webp`

```text
Dreamy indigo-and-silver night painting: a lake of white water lilies (kumud) opening under the full moon, silver lanterns, fireflies, banyan trees and areca palms in silhouette, a terracotta temple-style pavilion with no figures, white alpona patterns on the banks; indigo, silver-white, soft teal and a touch of red; calm and poetic. A wedding canopy of white flowers and red threads with banana plants at its four corners, on an alpona floor at twilight. Composition: keep the lower 40% calm (still water, a plain floor, smooth cloth or sand) for words; put the main scene in the upper part. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 11.12 Reception (night) · `kumudini/reception.webp`

```text
Dreamy indigo-and-silver night painting: a lake of white water lilies (kumud) opening under the full moon, silver lanterns, fireflies, banyan trees and areca palms in silhouette, a terracotta temple-style pavilion with no figures, white alpona patterns on the banks; indigo, silver-white, soft teal and a touch of red; calm and poetic. The lake at night with floating diyas among the lilies and the lanterns' reflections. Composition: keep the lower 40% calm (still water, a plain floor, smooth cloth or sand) for words; put the main scene in the upper part. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 11.13 Closing page (reply) (night) · `kumudini/reply.webp`

```text
Dreamy indigo-and-silver night painting: a lake of white water lilies (kumud) opening under the full moon, silver lanterns, fireflies, banyan trees and areca palms in silhouette, a terracotta temple-style pavilion with no figures, white alpona patterns on the banks; indigo, silver-white, soft teal and a touch of red; calm and poetic. A single white lily and a silver lantern on the bank under the full moon. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 11.14 Photo page · one photo · `kumudini/couple.webp`

```text
Dreamy indigo-and-silver night painting: a lake of white water lilies (kumud) opening under the full moon, silver lanterns, fireflies, banyan trees and areca palms in silhouette, a terracotta temple-style pavilion with no figures, white alpona patterns on the banks; indigo, silver-white, soft teal and a touch of red; calm and poetic. A painting with a soft place for one photo of the couple, in a soft silver moon-glow. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: white water lilies, lily pads and fireflies over the lower and side edges drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 52% of the height down, keep the picture calm and empty for the names: a calm moonlit lake. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 11.15 Photo page · two photos · `kumudini/couple-two.webp`

```text
Dreamy indigo-and-silver night painting: a lake of white water lilies (kumud) opening under the full moon, silver lanterns, fireflies, banyan trees and areca palms in silhouette, a terracotta temple-style pavilion with no figures, white alpona patterns on the banks; indigo, silver-white, soft teal and a touch of red; calm and poetic. A painting with soft places for two photos, in a soft silver moon-glow. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a curl of fireflies and a lily stem falls in the gap. Neither has a frame, border, arch, outline or box: white water lilies, lily pads and fireflies over the lower and side edges drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 48% of the height down, keep the picture calm and empty for both names: a calm moonlit lake. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="darbar"></a>

## 12. Darbar (दरबार)

**Inside the palace: durbar halls, mirror rooms and chandeliers, every page a different royal room.**

- Folder: `public/suites/darbar/` · Gate: `public/openings/gates/sheesh-kiwad/` (the two doors swing open)
- Best for: Any wedding; reception-led and big-venue invites · Lettering voice: regal
- Style lock (already inside every prompt below): Opulent royal palace interiors: blush and champagne marble, gilded mouldings, crystal chandeliers, sheesh mirror-work walls, candle stands, tall arched windows with silk drapes, rose petals and white and blush roses; champagne, blush, ivory and gold; a warm candlelit glow, cinematic depth, symmetrical.

### 12.1 Gate · the view beyond · `sheesh-kiwad/beyond.webp`

```text
Opulent royal palace interiors: blush and champagne marble, gilded mouldings, crystal chandeliers, sheesh mirror-work walls, candle stands, tall arched windows with silk drapes, rose petals and white and blush roses; champagne, blush, ivory and gold; a warm candlelit glow, cinematic depth, symmetrical. The view through the gateway once it opens: A grand durbar hall with a rose-petal aisle leading to a gilded platform, chandeliers above, a warm glow. Fill the whole picture, with no gate, arch, door or frame in it; a bright, calm, glowing centre. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 12.2 Gate · the arch · `sheesh-kiwad/arch.webp`

```text
Opulent royal palace interiors: blush and champagne marble, gilded mouldings, crystal chandeliers, sheesh mirror-work walls, candle stands, tall arched windows with silk drapes, rose petals and white and blush roses; champagne, blush, ivory and gold; a warm candlelit glow, cinematic depth, symmetrical. A gateway seen from the front, filling the whole picture edge to edge: A gilded palace archway with sheesh mirror-work inlay, crystal sconces on both sides and rose garlands. The doorway inside the arch is filled with one flat pure green colour #00FF00, from the threshold at the very bottom edge of the picture up to the arch's crown, about 60 to 70% of the picture's width; nothing stands in front of the green. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 12.3 Gate · left door · `sheesh-kiwad/door-left.webp`

```text
Opulent royal palace interiors: blush and champagne marble, gilded mouldings, crystal chandeliers, sheesh mirror-work walls, candle stands, tall arched windows with silk drapes, rose petals and white and blush roses; champagne, blush, ivory and gold; a warm candlelit glow, cinematic depth, symmetrical. The LEFT door leaf of a pair, seen perfectly straight-on and flat, filling the whole picture edge to edge with no wall, frame, floor or background around it: a door leaf covered in sheesh mirror-work mosaic with gilded borders and a crystal handle, catching candlelight. Its hinge side is the left edge of the picture; the edge where it meets the other door is the right edge, with the handle near it. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 12.4 Gate · right door · `sheesh-kiwad/door-right.webp`

```text
Opulent royal palace interiors: blush and champagne marble, gilded mouldings, crystal chandeliers, sheesh mirror-work walls, candle stands, tall arched windows with silk drapes, rose petals and white and blush roses; champagne, blush, ivory and gold; a warm candlelit glow, cinematic depth, symmetrical. The RIGHT door leaf of a pair, seen perfectly straight-on and flat, filling the whole picture edge to edge with no wall, frame, floor or background around it: a door leaf covered in sheesh mirror-work mosaic with gilded borders and a crystal handle, catching candlelight. Its hinge side is the right edge of the picture; the edge where it meets the other door is the left edge, with the handle near it. It mirrors the left one. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 12.5 Cover (dusk) · `darbar/cover.webp`

```text
Opulent royal palace interiors: blush and champagne marble, gilded mouldings, crystal chandeliers, sheesh mirror-work walls, candle stands, tall arched windows with silk drapes, rose petals and white and blush roses; champagne, blush, ivory and gold; a warm candlelit glow, cinematic depth, symmetrical. A grand durbar hall with a long rose-petal aisle leading to a tall arched window glowing with dusk light, chandeliers above. Composition: leave one calm open area in the middle, about 70% of the width and 40% of the height (the plain inside of an arch, a window of soft sky or a smooth wall), for words; put the detail around it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 12.6 Family (day) · `darbar/family.webp`

```text
Opulent royal palace interiors: blush and champagne marble, gilded mouldings, crystal chandeliers, sheesh mirror-work walls, candle stands, tall arched windows with silk drapes, rose petals and white and blush roses; champagne, blush, ivory and gold; a warm candlelit glow, cinematic depth, symmetrical. A palace drawing room with tall arched windows letting in daylight, sofas in blush silk, roses in silver urns. Composition: leave one calm open area in the middle, about 70% of the width and 40% of the height (the plain inside of an arch, a window of soft sky or a smooth wall), for words; put the detail around it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 12.7 Haldi (morning) · `darbar/haldi.webp`

```text
Opulent royal palace interiors: blush and champagne marble, gilded mouldings, crystal chandeliers, sheesh mirror-work walls, candle stands, tall arched windows with silk drapes, rose petals and white and blush roses; champagne, blush, ivory and gold; a warm candlelit glow, cinematic depth, symmetrical. A marble courtyard inside the palace at sunrise with yellow silk drapes, brass urns and marigold petals on marble. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 12.8 Mehendi (day) · `darbar/mehendi.webp`

```text
Opulent royal palace interiors: blush and champagne marble, gilded mouldings, crystal chandeliers, sheesh mirror-work walls, candle stands, tall arched windows with silk drapes, rose petals and white and blush roses; champagne, blush, ivory and gold; a warm candlelit glow, cinematic depth, symmetrical. A sheesh mahal room glittering with daylight reflections, green and pink cushions, jasmine. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 12.9 Sangeet (night) · `darbar/sangeet.webp`

```text
Opulent royal palace interiors: blush and champagne marble, gilded mouldings, crystal chandeliers, sheesh mirror-work walls, candle stands, tall arched windows with silk drapes, rose petals and white and blush roses; champagne, blush, ivory and gold; a warm candlelit glow, cinematic depth, symmetrical. A palace ballroom at night with crystal chandeliers and a draped stage, sparkles. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 12.10 Baraat (dusk) · `darbar/baraat.webp`

```text
Opulent royal palace interiors: blush and champagne marble, gilded mouldings, crystal chandeliers, sheesh mirror-work walls, candle stands, tall arched windows with silk drapes, rose petals and white and blush roses; champagne, blush, ivory and gold; a warm candlelit glow, cinematic depth, symmetrical. A grand marble staircase with gilded railings, lanterns on every step, rose garlands, dusk light through windows. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 12.11 Wedding (dusk) · `darbar/wedding.webp`

```text
Opulent royal palace interiors: blush and champagne marble, gilded mouldings, crystal chandeliers, sheesh mirror-work walls, candle stands, tall arched windows with silk drapes, rose petals and white and blush roses; champagne, blush, ivory and gold; a warm candlelit glow, cinematic depth, symmetrical. A gilded mandap inside a marble hall, pillars wrapped in roses, candles and chandeliers. Composition: keep the lower 40% calm (still water, a plain floor, smooth cloth or sand) for words; put the main scene in the upper part. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 12.12 Reception (night) · `darbar/reception.webp`

```text
Opulent royal palace interiors: blush and champagne marble, gilded mouldings, crystal chandeliers, sheesh mirror-work walls, candle stands, tall arched windows with silk drapes, rose petals and white and blush roses; champagne, blush, ivory and gold; a warm candlelit glow, cinematic depth, symmetrical. A banquet hall glowing with chandeliers and candelabra, mirrored walls and roses. Composition: keep the lower 40% calm (still water, a plain floor, smooth cloth or sand) for words; put the main scene in the upper part. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 12.13 Closing page (reply) (night) · `darbar/reply.webp`

```text
Opulent royal palace interiors: blush and champagne marble, gilded mouldings, crystal chandeliers, sheesh mirror-work walls, candle stands, tall arched windows with silk drapes, rose petals and white and blush roses; champagne, blush, ivory and gold; a warm candlelit glow, cinematic depth, symmetrical. A tall arched window at night with silk drapes, candles on the sill and moonlight. Composition: leave one calm open area in the middle, about 70% of the width and 40% of the height (the plain inside of an arch, a window of soft sky or a smooth wall), for words; put the detail around it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 12.14 Photo page · one photo · `darbar/couple.webp`

```text
Opulent royal palace interiors: blush and champagne marble, gilded mouldings, crystal chandeliers, sheesh mirror-work walls, candle stands, tall arched windows with silk drapes, rose petals and white and blush roses; champagne, blush, ivory and gold; a warm candlelit glow, cinematic depth, symmetrical. A painting with a soft place for one photo of the couple, in a warm candlelit glow in the hall. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: cascades of blush and white roses and soft chandelier sparkle drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 52% of the height down, keep the picture calm and empty for the names: a polished marble floor. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 12.15 Photo page · two photos · `darbar/couple-two.webp`

```text
Opulent royal palace interiors: blush and champagne marble, gilded mouldings, crystal chandeliers, sheesh mirror-work walls, candle stands, tall arched windows with silk drapes, rose petals and white and blush roses; champagne, blush, ivory and gold; a warm candlelit glow, cinematic depth, symmetrical. A painting with soft places for two photos, in a warm candlelit glow in the hall. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a slim candelabra twined with roses falls in the gap. Neither has a frame, border, arch, outline or box: cascades of blush and white roses and soft chandelier sparkle drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 48% of the height down, keep the picture calm and empty for both names: a polished marble floor. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="sunehri-sarovar"></a>

## 13. Sunehri Sarovar (ਸੁਨਹਿਰੀ ਸਰੋਵਰ)

**A golden-hour lake with a golden-domed pavilion, marble walkways and phulkari: calm and glowing.**

- Folder: `public/suites/sunehri-sarovar/` · Gate: `public/openings/gates/sunehri-phatak/` (the two doors swing open)
- Best for: Punjabi and Sikh weddings (Anand Karaj); keep it respectful · Lettering voice: regal
- Style lock (already inside every prompt below): Golden-hour painting of a serene lake (sarovar) with a white marble walkway and a golden-domed pavilion reflected in still water (a generic pavilion, not a copy of any real shrine), marigold garlands, phulkari embroidery textures in the borders; warm gold, saffron, white marble and deep blue; serene, glowing and respectful; no religious symbols and no text.

### 13.1 Gate · the view beyond · `sunehri-phatak/beyond.webp`

```text
Golden-hour painting of a serene lake (sarovar) with a white marble walkway and a golden-domed pavilion reflected in still water (a generic pavilion, not a copy of any real shrine), marigold garlands, phulkari embroidery textures in the borders; warm gold, saffron, white marble and deep blue; serene, glowing and respectful; no religious symbols and no text. The view through the gateway once it opens: The golden-domed pavilion across a still lake at golden hour, a marble walkway, marigold garlands on the pillars. Fill the whole picture, with no gate, arch, door or frame in it; a bright, calm, glowing centre. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 13.2 Gate · the arch · `sunehri-phatak/arch.webp`

```text
Golden-hour painting of a serene lake (sarovar) with a white marble walkway and a golden-domed pavilion reflected in still water (a generic pavilion, not a copy of any real shrine), marigold garlands, phulkari embroidery textures in the borders; warm gold, saffron, white marble and deep blue; serene, glowing and respectful; no religious symbols and no text. A gateway seen from the front, filling the whole picture edge to edge: A scalloped white marble arch with gold-leaf trim and marigold garlands, phulkari-embroidered drapes tied to both sides. The doorway inside the arch is filled with one flat pure green colour #00FF00, from the threshold at the very bottom edge of the picture up to the arch's crown, about 60 to 70% of the picture's width; nothing stands in front of the green. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 13.3 Gate · left door · `sunehri-phatak/door-left.webp`

```text
Golden-hour painting of a serene lake (sarovar) with a white marble walkway and a golden-domed pavilion reflected in still water (a generic pavilion, not a copy of any real shrine), marigold garlands, phulkari embroidery textures in the borders; warm gold, saffron, white marble and deep blue; serene, glowing and respectful; no religious symbols and no text. The LEFT door leaf of a pair, seen perfectly straight-on and flat, filling the whole picture edge to edge with no wall, frame, floor or background around it: a gold-leaf repoussé door leaf with floral panels and silver studs. Its hinge side is the left edge of the picture; the edge where it meets the other door is the right edge, with the handle near it. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 13.4 Gate · right door · `sunehri-phatak/door-right.webp`

```text
Golden-hour painting of a serene lake (sarovar) with a white marble walkway and a golden-domed pavilion reflected in still water (a generic pavilion, not a copy of any real shrine), marigold garlands, phulkari embroidery textures in the borders; warm gold, saffron, white marble and deep blue; serene, glowing and respectful; no religious symbols and no text. The RIGHT door leaf of a pair, seen perfectly straight-on and flat, filling the whole picture edge to edge with no wall, frame, floor or background around it: a gold-leaf repoussé door leaf with floral panels and silver studs. Its hinge side is the right edge of the picture; the edge where it meets the other door is the left edge, with the handle near it. It mirrors the left one. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 13.5 Cover (dusk) · `sunehri-sarovar/cover.webp`

```text
Golden-hour painting of a serene lake (sarovar) with a white marble walkway and a golden-domed pavilion reflected in still water (a generic pavilion, not a copy of any real shrine), marigold garlands, phulkari embroidery textures in the borders; warm gold, saffron, white marble and deep blue; serene, glowing and respectful; no religious symbols and no text. The golden-domed pavilion across a still lake at golden hour in the lower half, a marble walkway, marigold garlands on pillars; open glowing sky above. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 13.6 Family (day) · `sunehri-sarovar/family.webp`

```text
Golden-hour painting of a serene lake (sarovar) with a white marble walkway and a golden-domed pavilion reflected in still water (a generic pavilion, not a copy of any real shrine), marigold garlands, phulkari embroidery textures in the borders; warm gold, saffron, white marble and deep blue; serene, glowing and respectful; no religious symbols and no text. A Punjabi haveli courtyard with phulkari-embroidered drapes and brass vessels in daylight. Composition: leave one calm open area in the middle, about 70% of the width and 40% of the height (the plain inside of an arch, a window of soft sky or a smooth wall), for words; put the detail around it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 13.7 Haldi (morning) · `sunehri-sarovar/haldi.webp`

```text
Golden-hour painting of a serene lake (sarovar) with a white marble walkway and a golden-domed pavilion reflected in still water (a generic pavilion, not a copy of any real shrine), marigold garlands, phulkari embroidery textures in the borders; warm gold, saffron, white marble and deep blue; serene, glowing and respectful; no religious symbols and no text. Sunrise over the lake, brass bowls of turmeric paste on marble steps, marigolds. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 13.8 Mehendi (day) · `sunehri-sarovar/mehendi.webp`

```text
Golden-hour painting of a serene lake (sarovar) with a white marble walkway and a golden-domed pavilion reflected in still water (a generic pavilion, not a copy of any real shrine), marigold garlands, phulkari embroidery textures in the borders; warm gold, saffron, white marble and deep blue; serene, glowing and respectful; no religious symbols and no text. A courtyard under phulkari canopies in orange and pink, cushions on a woven charpai, potted marigolds. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 13.9 Sangeet (night) · `sunehri-sarovar/sangeet.webp`

```text
Golden-hour painting of a serene lake (sarovar) with a white marble walkway and a golden-domed pavilion reflected in still water (a generic pavilion, not a copy of any real shrine), marigold garlands, phulkari embroidery textures in the borders; warm gold, saffron, white marble and deep blue; serene, glowing and respectful; no religious symbols and no text. A Punjabi village courtyard at night with lanterns, dhol drums, phulkari drapes and fairy lights. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 13.10 Baraat (dusk) · `sunehri-sarovar/baraat.webp`

```text
Golden-hour painting of a serene lake (sarovar) with a white marble walkway and a golden-domed pavilion reflected in still water (a generic pavilion, not a copy of any real shrine), marigold garlands, phulkari embroidery textures in the borders; warm gold, saffron, white marble and deep blue; serene, glowing and respectful; no religious symbols and no text. A village road at dusk with marigold arches, a decorated horse with no rider, strings of lights. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 13.11 Wedding (dusk) · `sunehri-sarovar/wedding.webp`

```text
Golden-hour painting of a serene lake (sarovar) with a white marble walkway and a golden-domed pavilion reflected in still water (a generic pavilion, not a copy of any real shrine), marigold garlands, phulkari embroidery textures in the borders; warm gold, saffron, white marble and deep blue; serene, glowing and respectful; no religious symbols and no text. A white marble pavilion with a canopy of white flowers and marigolds beside the lake, soft golden light. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 13.12 Reception (night) · `sunehri-sarovar/reception.webp`

```text
Golden-hour painting of a serene lake (sarovar) with a white marble walkway and a golden-domed pavilion reflected in still water (a generic pavilion, not a copy of any real shrine), marigold garlands, phulkari embroidery textures in the borders; warm gold, saffron, white marble and deep blue; serene, glowing and respectful; no religious symbols and no text. The lake at night with the golden-domed pavilion lit up and reflected in the water. Composition: keep the lower 40% calm (still water, a plain floor, smooth cloth or sand) for words; put the main scene in the upper part. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 13.13 Closing page (reply) (night) · `sunehri-sarovar/reply.webp`

```text
Golden-hour painting of a serene lake (sarovar) with a white marble walkway and a golden-domed pavilion reflected in still water (a generic pavilion, not a copy of any real shrine), marigold garlands, phulkari embroidery textures in the borders; warm gold, saffron, white marble and deep blue; serene, glowing and respectful; no religious symbols and no text. Marble steps down to the water with rows of diyas, the golden dome reflected. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 13.14 Photo page · one photo · `sunehri-sarovar/couple.webp`

```text
Golden-hour painting of a serene lake (sarovar) with a white marble walkway and a golden-domed pavilion reflected in still water (a generic pavilion, not a copy of any real shrine), marigold garlands, phulkari embroidery textures in the borders; warm gold, saffron, white marble and deep blue; serene, glowing and respectful; no religious symbols and no text. A painting with a soft place for one photo of the couple, in a golden haze over the lake. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: marigold garlands and folds of phulkari-patterned silk drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 52% of the height down, keep the picture calm and empty for the names: calm golden water. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 13.15 Photo page · two photos · `sunehri-sarovar/couple-two.webp`

```text
Golden-hour painting of a serene lake (sarovar) with a white marble walkway and a golden-domed pavilion reflected in still water (a generic pavilion, not a copy of any real shrine), marigold garlands, phulkari embroidery textures in the borders; warm gold, saffron, white marble and deep blue; serene, glowing and respectful; no religious symbols and no text. A painting with soft places for two photos, in a golden haze over the lake. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a marigold garland falls in the gap. Neither has a frame, border, arch, outline or box: marigold garlands and folds of phulkari-patterned silk drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 48% of the height down, keep the picture calm and empty for both names: calm golden water. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="pattu"></a>

## 14. Pattu (பட்டு)

**Kanjeevaram silk: magenta and emerald drapes with temple-gold zari borders, jasmine and brass lamps.**

- Folder: `public/suites/pattu/` · Gate: `public/openings/gates/pattu-thirai/` (the two curtain halves gather to the sides)
- Best for: Tamil, Telugu and Kannada weddings · Lettering voice: regal
- Style lock (already inside every prompt below): South Indian Kanjeevaram silk art: rich magenta, emerald and peacock-blue silk drapes with wide temple-gold zari borders (temple-spire and mango motifs), banana leaves and plants, jasmine strings, brass kuthu vilakku lamps, kolam patterns, temple towers far in the distance; warm temple-gold light; rich, auspicious and festive; no deities.

### 14.1 Gate · the view beyond · `pattu-thirai/beyond.webp`

```text
South Indian Kanjeevaram silk art: rich magenta, emerald and peacock-blue silk drapes with wide temple-gold zari borders (temple-spire and mango motifs), banana leaves and plants, jasmine strings, brass kuthu vilakku lamps, kolam patterns, temple towers far in the distance; warm temple-gold light; rich, auspicious and festive; no deities. The view through the gateway once it opens: A temple tank at dusk with temple towers far away, brass lamps lit along its steps, jasmine strings. Fill the whole picture, with no gate, arch, door or frame in it; a bright, calm, glowing centre. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 14.2 Gate · the arch · `pattu-thirai/arch.webp`

```text
South Indian Kanjeevaram silk art: rich magenta, emerald and peacock-blue silk drapes with wide temple-gold zari borders (temple-spire and mango motifs), banana leaves and plants, jasmine strings, brass kuthu vilakku lamps, kolam patterns, temple towers far in the distance; warm temple-gold light; rich, auspicious and festive; no deities. A gateway seen from the front, filling the whole picture edge to edge: A carved teak mandapam frame with brass bells, a mango-leaf toran and banana plants at both sides, a kolam on the threshold. The doorway inside the arch is filled with one flat pure green colour #00FF00, from the threshold at the very bottom edge of the picture up to the arch's crown, about 60 to 70% of the picture's width; nothing stands in front of the green. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 14.3 Gate · left door · `pattu-thirai/door-left.webp`

```text
South Indian Kanjeevaram silk art: rich magenta, emerald and peacock-blue silk drapes with wide temple-gold zari borders (temple-spire and mango motifs), banana leaves and plants, jasmine strings, brass kuthu vilakku lamps, kolam patterns, temple towers far in the distance; warm temple-gold light; rich, auspicious and festive; no deities. The LEFT half of a pair of curtains, hanging straight and seen straight-on, filling the whole picture edge to edge with no rod, wall or background showing: a magenta Kanjeevaram silk curtain hanging in soft folds, with a wide temple-gold zari border down its inner edge. Its outer edge is the left edge of the picture; its inner edge, where it meets the other half, is the right edge. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 14.4 Gate · right door · `pattu-thirai/door-right.webp`

```text
South Indian Kanjeevaram silk art: rich magenta, emerald and peacock-blue silk drapes with wide temple-gold zari borders (temple-spire and mango motifs), banana leaves and plants, jasmine strings, brass kuthu vilakku lamps, kolam patterns, temple towers far in the distance; warm temple-gold light; rich, auspicious and festive; no deities. The RIGHT half of a pair of curtains, hanging straight and seen straight-on, filling the whole picture edge to edge with no rod, wall or background showing: a magenta Kanjeevaram silk curtain hanging in soft folds, with a wide temple-gold zari border down its inner edge. Its outer edge is the right edge of the picture; its inner edge, where it meets the other half, is the left edge. It mirrors the left one. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 14.5 Cover (dusk) · `pattu/cover.webp`

```text
South Indian Kanjeevaram silk art: rich magenta, emerald and peacock-blue silk drapes with wide temple-gold zari borders (temple-spire and mango motifs), banana leaves and plants, jasmine strings, brass kuthu vilakku lamps, kolam patterns, temple towers far in the distance; warm temple-gold light; rich, auspicious and festive; no deities. Magenta and gold silk drapes framing a view of a temple tank at dusk with temple towers far away, brass lamps lit, jasmine strings. Composition: leave one calm open area in the middle, about 70% of the width and 40% of the height (the plain inside of an arch, a window of soft sky or a smooth wall), for words; put the detail around it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 14.6 Family (day) · `pattu/family.webp`

```text
South Indian Kanjeevaram silk art: rich magenta, emerald and peacock-blue silk drapes with wide temple-gold zari borders (temple-spire and mango motifs), banana leaves and plants, jasmine strings, brass kuthu vilakku lamps, kolam patterns, temple towers far in the distance; warm temple-gold light; rich, auspicious and festive; no deities. A Chettinad mansion courtyard with carved pillars, a patterned tiled floor, silk drapes and banana plants. Composition: leave one calm open area in the middle, about 70% of the width and 40% of the height (the plain inside of an arch, a window of soft sky or a smooth wall), for words; put the detail around it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 14.7 Haldi (morning) · `pattu/haldi.webp`

```text
South Indian Kanjeevaram silk art: rich magenta, emerald and peacock-blue silk drapes with wide temple-gold zari borders (temple-spire and mango motifs), banana leaves and plants, jasmine strings, brass kuthu vilakku lamps, kolam patterns, temple towers far in the distance; warm temple-gold light; rich, auspicious and festive; no deities. Turmeric and kumkum in brass plates on a kolam, banana leaves, sunrise light. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 14.8 Mehendi (day) · `pattu/mehendi.webp`

```text
South Indian Kanjeevaram silk art: rich magenta, emerald and peacock-blue silk drapes with wide temple-gold zari borders (temple-spire and mango motifs), banana leaves and plants, jasmine strings, brass kuthu vilakku lamps, kolam patterns, temple towers far in the distance; warm temple-gold light; rich, auspicious and festive; no deities. Emerald silk with gold zari borders as a backdrop, jasmine strings and cushions. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 14.9 Sangeet (night) · `pattu/sangeet.webp`

```text
South Indian Kanjeevaram silk art: rich magenta, emerald and peacock-blue silk drapes with wide temple-gold zari borders (temple-spire and mango motifs), banana leaves and plants, jasmine strings, brass kuthu vilakku lamps, kolam patterns, temple towers far in the distance; warm temple-gold light; rich, auspicious and festive; no deities. A courtyard at night with rows of lit brass lamps, a nadaswaram and thavil drum on a mat, silk drapes. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 14.10 Baraat (dusk) · `pattu/baraat.webp`

```text
South Indian Kanjeevaram silk art: rich magenta, emerald and peacock-blue silk drapes with wide temple-gold zari borders (temple-spire and mango motifs), banana leaves and plants, jasmine strings, brass kuthu vilakku lamps, kolam patterns, temple towers far in the distance; warm temple-gold light; rich, auspicious and festive; no deities. A temple street at dusk with lamp posts and arches of banana plants and mango leaves. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 14.11 Wedding (dusk) · `pattu/wedding.webp`

```text
South Indian Kanjeevaram silk art: rich magenta, emerald and peacock-blue silk drapes with wide temple-gold zari borders (temple-spire and mango motifs), banana leaves and plants, jasmine strings, brass kuthu vilakku lamps, kolam patterns, temple towers far in the distance; warm temple-gold light; rich, auspicious and festive; no deities. A mandapam with four pillars wrapped in banana plants, a magenta silk canopy, brass lamps and a kolam floor. Composition: keep the lower 40% calm (still water, a plain floor, smooth cloth or sand) for words; put the main scene in the upper part. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 14.12 Reception (night) · `pattu/reception.webp`

```text
South Indian Kanjeevaram silk art: rich magenta, emerald and peacock-blue silk drapes with wide temple-gold zari borders (temple-spire and mango motifs), banana leaves and plants, jasmine strings, brass kuthu vilakku lamps, kolam patterns, temple towers far in the distance; warm temple-gold light; rich, auspicious and festive; no deities. A garden at night with silk-draped arches and lamps. Composition: keep the lower 40% calm (still water, a plain floor, smooth cloth or sand) for words; put the main scene in the upper part. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 14.13 Closing page (reply) (night) · `pattu/reply.webp`

```text
South Indian Kanjeevaram silk art: rich magenta, emerald and peacock-blue silk drapes with wide temple-gold zari borders (temple-spire and mango motifs), banana leaves and plants, jasmine strings, brass kuthu vilakku lamps, kolam patterns, temple towers far in the distance; warm temple-gold light; rich, auspicious and festive; no deities. A brass kuthu vilakku lamp lit on a kolam, jasmine, a silk border. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 14.14 Photo page · one photo · `pattu/couple.webp`

```text
South Indian Kanjeevaram silk art: rich magenta, emerald and peacock-blue silk drapes with wide temple-gold zari borders (temple-spire and mango motifs), banana leaves and plants, jasmine strings, brass kuthu vilakku lamps, kolam patterns, temple towers far in the distance; warm temple-gold light; rich, auspicious and festive; no deities. A painting with a soft place for one photo of the couple, in a soft temple-gold glow. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: jasmine strings, banana leaves and a fold of magenta silk with its gold border drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 52% of the height down, keep the picture calm and empty for the names: a kolam floor. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 14.15 Photo page · two photos · `pattu/couple-two.webp`

```text
South Indian Kanjeevaram silk art: rich magenta, emerald and peacock-blue silk drapes with wide temple-gold zari borders (temple-spire and mango motifs), banana leaves and plants, jasmine strings, brass kuthu vilakku lamps, kolam patterns, temple towers far in the distance; warm temple-gold light; rich, auspicious and festive; no deities. A painting with soft places for two photos, in a soft temple-gold glow. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a jasmine string with a small brass bell falls in the gap. Neither has a frame, border, arch, outline or box: jasmine strings, banana leaves and a fold of magenta silk with its gold border drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 48% of the height down, keep the picture calm and empty for both names: a kolam floor. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="sona-rekha"></a>

## 15. Sona Rekha (सोना रेखा)

**Modern minimal: ivory cotton paper, single-line gold-foil drawings and lots of quiet white space.**

- Folder: `public/suites/sona-rekha/` · Gate: `public/openings/gates/kagaz-kiwad/` (the two doors swing open)
- Best for: Modern weddings, any family wanting minimal and elegant · Lettering voice: modern
- Style lock (already inside every prompt below): Modern minimal invitation art: soft ivory cotton paper with a fine letterpress texture, delicate single-line gold-foil drawings (arches, domes, botanicals), subtle blind-embossed patterns, plenty of calm white space, a few soft watercolour washes of blush or sage; ivory, champagne gold, soft blush and sage; elegant, quiet and contemporary.

### 15.1 Gate · the view beyond · `kagaz-kiwad/beyond.webp`

```text
Modern minimal invitation art: soft ivory cotton paper with a fine letterpress texture, delicate single-line gold-foil drawings (arches, domes, botanicals), subtle blind-embossed patterns, plenty of calm white space, a few soft watercolour washes of blush or sage; ivory, champagne gold, soft blush and sage; elegant, quiet and contemporary. The view through the gateway once it opens: Ivory paper with a soft blush watercolour wash and a gold-line arch drawing. Fill the whole picture, with no gate, arch, door or frame in it; a bright, calm, glowing centre. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 15.2 Gate · the arch · `kagaz-kiwad/arch.webp`

```text
Modern minimal invitation art: soft ivory cotton paper with a fine letterpress texture, delicate single-line gold-foil drawings (arches, domes, botanicals), subtle blind-embossed patterns, plenty of calm white space, a few soft watercolour washes of blush or sage; ivory, champagne gold, soft blush and sage; elegant, quiet and contemporary. A gateway seen from the front, filling the whole picture edge to edge: An ivory embossed paper arch with a single gold-foil line border and a small gold-line flower at its crown, on ivory paper. The doorway inside the arch is filled with one flat pure green colour #00FF00, from the threshold at the very bottom edge of the picture up to the arch's crown, about 60 to 70% of the picture's width; nothing stands in front of the green. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 15.3 Gate · left door · `kagaz-kiwad/door-left.webp`

```text
Modern minimal invitation art: soft ivory cotton paper with a fine letterpress texture, delicate single-line gold-foil drawings (arches, domes, botanicals), subtle blind-embossed patterns, plenty of calm white space, a few soft watercolour washes of blush or sage; ivory, champagne gold, soft blush and sage; elegant, quiet and contemporary. The LEFT door leaf of a pair, seen perfectly straight-on and flat, filling the whole picture edge to edge with no wall, frame, floor or background around it: an ivory paper door leaf with a blind-embossed lattice pattern and one gold-foil line drawing of a flowering stem, half of a gold wax seal at its inner edge. Its hinge side is the left edge of the picture; the edge where it meets the other door is the right edge, with the handle near it. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 15.4 Gate · right door · `kagaz-kiwad/door-right.webp`

```text
Modern minimal invitation art: soft ivory cotton paper with a fine letterpress texture, delicate single-line gold-foil drawings (arches, domes, botanicals), subtle blind-embossed patterns, plenty of calm white space, a few soft watercolour washes of blush or sage; ivory, champagne gold, soft blush and sage; elegant, quiet and contemporary. The RIGHT door leaf of a pair, seen perfectly straight-on and flat, filling the whole picture edge to edge with no wall, frame, floor or background around it: an ivory paper door leaf with a blind-embossed lattice pattern and one gold-foil line drawing of a flowering stem, half of a gold wax seal at its inner edge. Its hinge side is the right edge of the picture; the edge where it meets the other door is the left edge, with the handle near it. It mirrors the left one. Keep the important detail in the middle 70% of the width; the sides may be cropped. Portrait 9:16. Seen perfectly straight-on, centred and symmetrical, with no perspective. No people, no religious symbols, no text, letters, logos or watermarks.
```

### 15.5 Cover (dusk) · `sona-rekha/cover.webp`

```text
Modern minimal invitation art: soft ivory cotton paper with a fine letterpress texture, delicate single-line gold-foil drawings (arches, domes, botanicals), subtle blind-embossed patterns, plenty of calm white space, a few soft watercolour washes of blush or sage; ivory, champagne gold, soft blush and sage; elegant, quiet and contemporary. A single-line gold drawing of a tall Mughal arch running along the outer edges, a faint blush wash at its base, ivory paper inside. Composition: leave one calm open area in the middle, about 70% of the width and 40% of the height (the plain inside of an arch, a window of soft sky or a smooth wall), for words; put the detail around it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 15.6 Family (day) · `sona-rekha/family.webp`

```text
Modern minimal invitation art: soft ivory cotton paper with a fine letterpress texture, delicate single-line gold-foil drawings (arches, domes, botanicals), subtle blind-embossed patterns, plenty of calm white space, a few soft watercolour washes of blush or sage; ivory, champagne gold, soft blush and sage; elegant, quiet and contemporary. A gold-line drawing of a haveli facade along the bottom, with small botanical sprigs. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 15.7 Haldi (morning) · `sona-rekha/haldi.webp`

```text
Modern minimal invitation art: soft ivory cotton paper with a fine letterpress texture, delicate single-line gold-foil drawings (arches, domes, botanicals), subtle blind-embossed patterns, plenty of calm white space, a few soft watercolour washes of blush or sage; ivory, champagne gold, soft blush and sage; elegant, quiet and contemporary. A gold-line marigold garland across the top and a soft turmeric-yellow wash. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 15.8 Mehendi (day) · `sona-rekha/mehendi.webp`

```text
Modern minimal invitation art: soft ivory cotton paper with a fine letterpress texture, delicate single-line gold-foil drawings (arches, domes, botanicals), subtle blind-embossed patterns, plenty of calm white space, a few soft watercolour washes of blush or sage; ivory, champagne gold, soft blush and sage; elegant, quiet and contemporary. Gold-line paisley vines climbing from the bottom corners, a soft sage wash. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 15.9 Sangeet (night) · `sona-rekha/sangeet.webp`

```text
Modern minimal invitation art: soft ivory cotton paper with a fine letterpress texture, delicate single-line gold-foil drawings (arches, domes, botanicals), subtle blind-embossed patterns, plenty of calm white space, a few soft watercolour washes of blush or sage; ivory, champagne gold, soft blush and sage; elegant, quiet and contemporary. Charcoal-grey paper with gold-line stars, a round full moon and strings of fairy lights. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 15.10 Baraat (dusk) · `sona-rekha/baraat.webp`

```text
Modern minimal invitation art: soft ivory cotton paper with a fine letterpress texture, delicate single-line gold-foil drawings (arches, domes, botanicals), subtle blind-embossed patterns, plenty of calm white space, a few soft watercolour washes of blush or sage; ivory, champagne gold, soft blush and sage; elegant, quiet and contemporary. A gold-line drawing of a decorated elephant and horses (no riders) walking along the bottom. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 15.11 Wedding (dusk) · `sona-rekha/wedding.webp`

```text
Modern minimal invitation art: soft ivory cotton paper with a fine letterpress texture, delicate single-line gold-foil drawings (arches, domes, botanicals), subtle blind-embossed patterns, plenty of calm white space, a few soft watercolour washes of blush or sage; ivory, champagne gold, soft blush and sage; elegant, quiet and contemporary. A gold-line mandap with flower garlands at the top and a subtle embossed pattern. Composition: keep the middle band, from about 30% to 70% of the height, soft and uncluttered for words; put the rich detail at the top, the bottom and along the sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 15.12 Reception (night) · `sona-rekha/reception.webp`

```text
Modern minimal invitation art: soft ivory cotton paper with a fine letterpress texture, delicate single-line gold-foil drawings (arches, domes, botanicals), subtle blind-embossed patterns, plenty of calm white space, a few soft watercolour washes of blush or sage; ivory, champagne gold, soft blush and sage; elegant, quiet and contemporary. Champagne paper with a gold-line chandelier at the top and fine sparkles. Composition: keep the lower 40% calm (still water, a plain floor, smooth cloth or sand) for words; put the main scene in the upper part. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 15.13 Closing page (reply) (night) · `sona-rekha/reply.webp`

```text
Modern minimal invitation art: soft ivory cotton paper with a fine letterpress texture, delicate single-line gold-foil drawings (arches, domes, botanicals), subtle blind-embossed patterns, plenty of calm white space, a few soft watercolour washes of blush or sage; ivory, champagne gold, soft blush and sage; elegant, quiet and contemporary. Ivory paper with a small gold-line lotus and two diyas at the bottom. Composition: keep the top 45% open and calm (soft sky, a plain wall or mist) for words; put the main scene in the lower half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 15.14 Photo page · one photo · `sona-rekha/couple.webp`

```text
Modern minimal invitation art: soft ivory cotton paper with a fine letterpress texture, delicate single-line gold-foil drawings (arches, domes, botanicals), subtle blind-embossed patterns, plenty of calm white space, a few soft watercolour washes of blush or sage; ivory, champagne gold, soft blush and sage; elegant, quiet and contemporary. A painting with a soft place for one photo of the couple, in a soft blush watercolour bloom on the ivory paper. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: delicate gold-line botanicals and a few watercolour leaves drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 52% of the height down, keep the picture calm and empty for the names: calm ivory paper. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 15.15 Photo page · two photos · `sona-rekha/couple-two.webp`

```text
Modern minimal invitation art: soft ivory cotton paper with a fine letterpress texture, delicate single-line gold-foil drawings (arches, domes, botanicals), subtle blind-embossed patterns, plenty of calm white space, a few soft watercolour washes of blush or sage; ivory, champagne gold, soft blush and sage; elegant, quiet and contemporary. A painting with soft places for two photos, in a soft blush watercolour bloom on the ivory paper. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a single gold-line flowering stem falls in the gap. Neither has a frame, border, arch, outline or box: delicate gold-line botanicals and a few watercolour leaves drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 48% of the height down, keep the picture calm and empty for both names: calm ivory paper. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```
