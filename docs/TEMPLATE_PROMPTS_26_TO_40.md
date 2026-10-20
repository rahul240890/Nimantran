# 15 new templates: image prompts, with fresh openings and a centre picture

For the owner, 19 October 2026. Fifteen new wedding templates after the 25 we have (`docs/TEMPLATE_PROMPTS.md` and `docs/TEMPLATE_PROMPTS_16_TO_25.md` in the repository). **15 pictures per template (225 in all): a new opening in three layers, a new centre picture, nine pages and two couple-photo pages.** Every look, opening and centre is new: none repeats our 386 page themes and Scenes, 74 gates, 25 fresh openings, 20 themed openings or the 25 templates.

## What's new this time

- **New art in every template.** A Mughal illuminated album, Parsi gara embroidery, Deccani marbled paper, a cyanotype sun-print, paper quilling, Mysuru sandalwood carving, Bundi palace murals, Banjara embroidery, leheriya, Nirmal lacquer, Bengal sholapith, dabu block print, a painted sky ceiling, hand-tinted antique postcards and Sankheda lacquer.
- **Openings that are not gates.** No doors, curtains or arches this time. A water veil stops falling, embroidered birds fly off the silk, marbled paper drains into a whirlpool, a skeleton leaf falls, paper coils spring loose, veena strings part, a reflection lifts out of a lake, a silver coin spins, two dupattas tie a knot, a sparkler draws a ring of light, silk-cotton floss blows away, a printing block stamps windows, a painted dome opens like an iris, a pocket watch strikes the hour and a swing sweeps you up.
- **A centre picture for every template.** Today a drawn welcome (a toran, a lotus, a mandala) sits between the opening and the pages. These templates get their own painted centre instead: a frame in the template's own art (an album margin, a sari pallu, a carved panel, a lacquer frame) round a large empty field for the names, the invitation line and the date. The opening reveals it, so it also stands behind the opening, and the drawn welcome isn't used for these templates.
- **Much more room for words.** Pages keep at least half the picture calm (a band from 25% to 75%, or the top 55%, or the lower 50%), against about 40% before. The centre picture keeps two thirds of the width and nearly half the height empty.
- **Couple photos without boxes**, as before: a soft patch of green with no frame, with flowers or ornaments drifting over its edges, which I feather when I cut it.
- **Every prompt is complete.** The style lock is inside each one: copy one block, paste it and generate.

## How to generate

1. Work on one template at a time, ideally in one chat in your image tool, so its 15 pictures match. Start with the centre picture, then the opening, then the pages.
2. Ask for **portrait 9:16 (1080 × 1920)**. If the tool can't, generate larger and tell me; I crop.
3. Generate again if a picture has people, faces, hands, gods, religious symbols or any text, letters or numbers; if the centre picture's middle field isn't empty (say: _"leave the middle field completely empty and plain"_); if an opening's front picture has art in the middle (say: _"everything except the pieces at the edges must be one flat area of the key colour"_); if a photo page's green has a frame round it (say: _"remove the frame around the green; only let the flowers overlap it"_); or if any key colour isn't flat.
4. The pieces picture must show six separate small things, each alone in its own cell, solid, with no mist or glow trails.
5. Check the tool's terms allow commercial use.
6. Name each file as shown under its prompt, for example `hashiya/centre.png` or `chadar/veil.png`, and send me one folder per template. PNG or WebP are both fine.

## Where the files go

- Pages, photo pages and the centre: `public/suites/<template>/` as `centre`, `cover`, `family`, `haldi`, `mehendi`, `sangeet`, `baraat`, `wedding`, `reception`, `reply`, `couple` and `couple-two` (`.webp`).
- Opening: `public/openings/fresh/<opening>/` as the cover layer (its own name, such as `veil` or `coin`), `front`, and `piece-0` to `piece-5` cut from the pieces sheet. The opening's `beyond` is a copy of the template's centre picture.

## What I do when the pictures arrive

- Cut the key colour and the photo greens (feathered), cut each pieces sheet into six, and compress everything to small WebP.
- Build each opening's movement in the same engine as the fresh openings, with the name plate, countdown and buttons where they are now; reduce motion fades the closed screen into the centre.
- Add the centre picture as a new step: after the opening, the template's centre shows the names, the invitation line and the date in its empty field, then the pages follow. Templates without a centre keep today's drawn welcome.
- Mark every page's calm area for the words, set each template's lettering voice, colours, guest page look and music, and list it in the gallery under its traditions.
- Check every page, the opening, the centre, the video and the cards at 320px and 1440px, in light and dark, then put it live.

## The fifteen

| #   | Template                                       | The idea                                                                                                                                | Best for                                                                                                      | Opening                                                                                                                                                | From the ads                                                                                                    |
| --- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| 26  | [Hashiya](#hashiya) (हाशिया)                   | A Mughal illuminated album: every page a leaf from a royal muraqqa, a gold-flowered margin round a wide field of burnished ivory paper. | Nikah and Muslim weddings, Lucknowi and Delhi families, North Indian weddings; poetry lovers                  | Chadar (चादर): A sheet of falling water over a carved marble wall of lamp niches; the flow stops and the water veil thins away from the top down.      | The framed card in the middle of Moonlit Lotus and Shoreline Reveal, grown into a whole page                    |
| 27  | [Gara](#gara) (ગારા)                           | Parsi gara embroidery: every page stitched in silk thread on lustrous silk, with cranes, peonies, willows and little bridges.           | Parsi weddings (Lagan), Christian and modern couples, anyone who loves heirloom saris                         | Parwaaz (परवाज़): A panel of embroidered silk full of resting birds; the birds lift off and fly away, and the silk floats up after them.               | The soft pastel florals and peacock-blue calm of Shoreline Reveal, made in thread                               |
| 28  | [Abri](#abri) (अबरी)                           | Deccani marbled paper and Golconda miniatures: swirling lilac, ultramarine and rose skies round calm pale fields.                       | Hyderabadi and Deccani weddings, Nikah, modern couples who love colour                                        | Bhanwar (भँवर): A sheet of marbled paper starts to swirl like a whirlpool and drains away into the centre.                                             | The lilac-and-gold glow of Sacred Temple Edition, without the temple                                            |
| 29  | [Neel Chhaap](#neel-chhaap) (नील छाप)          | A cyanotype sun-print: white ferns, lace and flowers on deep Prussian blue, with soft white prints of palaces and gardens.              | Modern and destination weddings, minimal couples, garden lovers, Christian weddings                           | Jaali Patta (जाली पत्ता): A huge lace-like skeleton leaf; light runs up its veins, then it turns and flutters down like an autumn leaf.                | The blue-and-white calm of Moonlit Lotus, turned into a modern botanical print                                  |
| 30  | [Lapet](#lapet) (लपेट)                         | Paper quilling: flowers, birds, palaces and lanterns rolled from pastel paper strips, standing in low relief on ivory card.             | Modern and playful weddings, engagements and roka, anyone who loves handmade craft                            | Lapet Khule (लपेट खुले): A great rosette of quilled paper coils; the rings spin and spring loose, and curls of paper bounce away.                      | The blush florals of Blossom Touch, made by hand from paper                                                     |
| 31  | [Chandan](#chandan) (ಚಂದನ)                     | Mysuru sandalwood carving: honey-gold relief of jasmine, parrots and elephants, with fresh jasmine and lamplight.                       | Kannada and Tamil weddings, Mysuru and Karnataka families, South Indian heritage lovers                       | Taar (तार): A carved sandalwood panel strung like a veena; the strings shimmer as if plucked, then the panel parts strip by strip.                     | The warm golden layers of Sacred Temple Edition, carved in wood                                                 |
| 32  | [Bundi Chitra](#bundi-chitra) (बूंदी चित्र)    | Bundi palace murals: turquoise walls, lotus lakes, monsoon gardens, peacocks and hill palaces in flat bright colour.                    | Rajasthani, Hadoti and Marwari families; monsoon and garden weddings                                          | Pratibimb (प्रतिबिंब): The invitation opens on a reflection in a lotus lake; a ripple runs out, then the view lifts out of the water onto the palace.  | The blue domes and fountains of Royal Azure and the peacock lake of Shoreline Reveal, painted as a Rajput mural |
| 33  | [Banjara](#banjara) (బంజారా)                   | Banjara embroidery: bold stitches, mirrors, cowries, silver coins and wool pompoms on deep indigo cloth.                                | Boho and modern weddings, Telangana and Rajasthani families, sangeet and mehendi-led invites, desert weddings | Mohur (मोहर): A great embroidered silver coin spins on its edge, flips, and the guest passes through it.                                               | A new colourful, boho look none of the ads have                                                                 |
| 34  | [Leheriya](#leheriya) (लहरिया)                 | Rajasthani leheriya: waves of rani pink, saffron and turquoise flowing across silk, round sunny havelis, swings and kites.              | Rajasthani and Marwari families, Teej and monsoon weddings, haldi and mehendi-led invites, young couples      | Gathbandhan (गठबंधन): Two leheriya dupattas sweep in from the sides, tie a knot in the middle and rise away together like a banner.                    | The pink and blush joy of Blossom Touch, made breezy and young                                                  |
| 35  | [Nirmal](#nirmal) (నిర్మల్)                    | Nirmal lacquer painting from Telangana: gold leaf and soft colours shimmering on glossy black.                                          | Telugu weddings, Hyderabad and Telangana families, evening weddings and receptions                            | Phuljhadi (फुलझड़ी): A sparkler draws a ring of golden light round the names; the ring flares and opens the black lacquer like an iris.                | The diyas and gold-on-dark drama of Sacred Temple Edition and Golden Lake                                       |
| 36  | [Shola](#shola) (শোলা)                         | Bengal sholapith: snow-white carved pith flowers, frills and birds glowing on deep alta red and dusk blue.                              | Bengali, Odia and Assamese weddings                                                                           | Semal (सेमल): The pods of a silk-cotton tree split and white floss bursts out, swirling away on the breeze and clearing the screen.                    | The white lotus and moonlit calm of Moonlit Lotus, in Bengal's own craft                                        |
| 37  | [Dabu](#dabu) (दाबू)                           | Dabu mud-resist block print: white and sky-blue motifs printed by hand on deep indigo cotton, with fine crackle lines.                  | Modern and minimal couples, Rajasthani and Madhya Pradesh families, day weddings, artisan lovers              | Thappa (ठप्पा): A carved wooden block stamps prints across a plain cotton sheet; each print opens a window onto the scene, until the sheet lifts away. | The indigo-and-white calm of Moonlit Lotus, turned into hand-printed cloth                                      |
| 38  | [Aasmaani](#aasmaani) (आसमानी)                 | A palace ballroom's painted sky ceiling: soft clouds framed by gilded stucco, crystal chandeliers and blush roses.                      | Christian weddings, receptions, modern and luxe couples, anniversaries                                        | Gumbad (गुंबद): The guest looks up into a painted dome; its round sky-opening widens like an iris and light and petals pour down.                      | The celestial white and gold of Heavens Alight, seen looking up                                                 |
| 39  | [Tasveer Khana](#tasveer-khana) (तस्वीर ख़ाना) | Hand-tinted antique photographs and postcards of old India: sepia softly coloured by hand, deckled cream card, gold foil.               | Vintage-loving couples, Parsi and Bombay families, anniversaries and vow renewals, modern weddings            | Ghadi (घड़ी): An antique pocket watch: its hands sweep round to the hour of the wedding, a soft chime, and the guest passes into its face.             | A nostalgic look none of the ads have                                                                           |
| 40  | [Sankheda](#sankheda) (સંખેડા)                 | Gujarat's Sankheda lacquer: glossy terracotta and maroon wood painted with gold and silver flowers, in a sunny courtyard.               | Gujarati weddings, Kathiawadi and Kutchi families, garba and sangeet-led invites                              | Hindolo (હિંડોળો): A painted Sankheda swing sways, then sweeps high toward the guest and up out of sight, carrying the screen away.                    | The warm maroon and gold of Pichwai Noor, in a Gujarati home                                                    |

Numbers carry on from the 25 we have, so these are templates 26 to 40.

---

<a id="hashiya"></a>

## 26. Hashiya (हाशिया)

**A Mughal illuminated album: every page a leaf from a royal muraqqa, a gold-flowered margin round a wide field of burnished ivory paper.**

- Folder: `public/suites/hashiya/` · Opening: `public/openings/fresh/chadar/` (Chadar, key #FF00FF magenta)
- Best for: Nikah and Muslim weddings, Lucknowi and Delhi families, North Indian weddings; poetry lovers · Lettering voice: classic
- The opening: A sheet of falling water over a carved marble wall of lamp niches; the flow stops and the water veil thins away from the top down.
- Style lock (already inside every prompt below): A leaf from a Mughal royal album (muraqqa): a wide illuminated margin (hashiya) of fine gold-painted flowering plants, irises, tulips, roses and narcissus on dyed paper in pale saffron, celadon or rose, fine lapis-blue and gold rules round a calm inner field of burnished ivory paper; inside, delicate Mughal miniature painting of gardens, marble pavilions, cypress and plane trees, fountains and birds, with fine brushwork and gold highlights; jewel colours of lapis, malachite, rose and vermilion against much cream; only flowers, birds, trees, pavilions and water; precious, refined and calm, with large areas of plain burnished paper.

### 26.1 Opening · the water veil · `chadar/veil.webp`

```text
A leaf from a Mughal royal album (muraqqa): a wide illuminated margin (hashiya) of fine gold-painted flowering plants, irises, tulips, roses and narcissus on dyed paper in pale saffron, celadon or rose, fine lapis-blue and gold rules round a calm inner field of burnished ivory paper; inside, delicate Mughal miniature painting of gardens, marble pavilions, cypress and plane trees, fountains and birds, with fine brushwork and gold highlights; jewel colours of lapis, malachite, rose and vermilion against much cream; only flowers, birds, trees, pavilions and water; precious, refined and calm, with large areas of plain burnished paper. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #FF00FF magenta, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 1 of 3 of an animated opening: A Mughal water cascade (chadar) filling the whole picture to every edge: a wall of white marble carved with rows of small arched niches (chini-khana), each niche holding a tiny lit oil lamp, seen behind a sheet of falling water that covers the whole wall in fine silver-white vertical streaks, the lamplight glinting gold through it. Paint the water as a solid painted surface, not see-through. The top centre is calmer, with fewer lamps; the lower 38% is darker, where the water falls into a deep green channel. Show only the cascade, with no album margin round it. Fully painted to every edge. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: waiting, the app runs a slow shimmer down the water and the lamps flicker; opening, the flow stops and the veil wipes away from the top down with a soft wavy edge, drops (pieces) splashing as it goes._

### 26.2 Opening · front · `chadar/front.webp`

```text
A leaf from a Mughal royal album (muraqqa): a wide illuminated margin (hashiya) of fine gold-painted flowering plants, irises, tulips, roses and narcissus on dyed paper in pale saffron, celadon or rose, fine lapis-blue and gold rules round a calm inner field of burnished ivory paper; inside, delicate Mughal miniature painting of gardens, marble pavilions, cypress and plane trees, fountains and birds, with fine brushwork and gold highlights; jewel colours of lapis, malachite, rose and vermilion against much cream; only flowers, birds, trees, pavilions and water; precious, refined and calm, with large areas of plain burnished paper. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #FF00FF magenta, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 2 of 3 of an animated opening, the front: Only framing pieces, each separate with magenta between them: a slender cypress tree with a climbing pink rose down the far left edge and another down the far right edge, each within the outer 12% of the width and the full height; at the bottom left and bottom right corners, from 84% of the height to the bottom, a small carved marble fountain basin within the outer 20% of the width. Everything else, including the whole middle, is flat pure #FF00FF magenta. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: the cypresses sway a little; on opening they slide out past the edges._

### 26.3 Opening · pieces · `chadar/pieces.png` (I cut `piece-0` to `piece-5`)

```text
A leaf from a Mughal royal album (muraqqa): a wide illuminated margin (hashiya) of fine gold-painted flowering plants, irises, tulips, roses and narcissus on dyed paper in pale saffron, celadon or rose, fine lapis-blue and gold rules round a calm inner field of burnished ivory paper; inside, delicate Mughal miniature painting of gardens, marble pavilions, cypress and plane trees, fountains and birds, with fine brushwork and gold highlights; jewel colours of lapis, malachite, rose and vermilion against much cream; only flowers, birds, trees, pavilions and water; precious, refined and calm, with large areas of plain burnished paper. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #FF00FF magenta, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 3 of 3 of an animated opening, the pieces: six separate small things on flat pure #FF00FF magenta, arranged in a grid of 2 columns and 3 rows, each centred alone in its own cell with wide gaps, none touching another or the edge: a silver-blue water drop (solid, not see-through), a pink rose petal, a white jasmine flower, a small gold leaf, a red tulip petal, a small lit brass oil lamp. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: water drops and petals splash out as the veil falls away._

### 26.4 Centre picture (after the opening) · `hashiya/centre.webp`

```text
A leaf from a Mughal royal album (muraqqa): a wide illuminated margin (hashiya) of fine gold-painted flowering plants, irises, tulips, roses and narcissus on dyed paper in pale saffron, celadon or rose, fine lapis-blue and gold rules round a calm inner field of burnished ivory paper; inside, delicate Mughal miniature painting of gardens, marble pavilions, cypress and plane trees, fountains and birds, with fine brushwork and gold highlights; jewel colours of lapis, malachite, rose and vermilion against much cream; only flowers, birds, trees, pavilions and water; precious, refined and calm, with large areas of plain burnished paper. The centre picture of the invitation, shown right after the opening with the couple's names, the invitation line and the date written on it. An illuminated Mughal album page seen flat: a wide outer margin of pale saffron paper painted in gold with flowering irises, tulips, roses and narcissus on fine stems and a few small birds among them; inside it a band of lapis-blue and gold rules and a slim border of tiny flowers; at the top centre, a small illuminated rosette of interlaced gold and lapis flowers with no lettering; at the bottom centre, a small marble fountain with two cypresses. Inside the frame, one large empty calm field of smooth burnished ivory paper, about 66% of the picture's width and from about 26% to 74% of the height: nothing drawn inside it, only the faintest texture. Keep the ornament thin beside that field and put the richest detail at the top and the bottom. Seen perfectly straight-on, centred and symmetrical, with no perspective. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 26.5 Cover (dusk) · `hashiya/cover.webp`

```text
A leaf from a Mughal royal album (muraqqa): a wide illuminated margin (hashiya) of fine gold-painted flowering plants, irises, tulips, roses and narcissus on dyed paper in pale saffron, celadon or rose, fine lapis-blue and gold rules round a calm inner field of burnished ivory paper; inside, delicate Mughal miniature painting of gardens, marble pavilions, cypress and plane trees, fountains and birds, with fine brushwork and gold highlights; jewel colours of lapis, malachite, rose and vermilion against much cream; only flowers, birds, trees, pavilions and water; precious, refined and calm, with large areas of plain burnished paper. The album's opening leaf: two tall cypress trees twined with flowering almond up the sides of the inner field, a small domed marble pavilion at the top centre, a water channel with little fountains along the bottom, the gold-flowered saffron margin round everything; a soft rose dusk. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 26.6 Family (day) · `hashiya/family.webp`

```text
A leaf from a Mughal royal album (muraqqa): a wide illuminated margin (hashiya) of fine gold-painted flowering plants, irises, tulips, roses and narcissus on dyed paper in pale saffron, celadon or rose, fine lapis-blue and gold rules round a calm inner field of burnished ivory paper; inside, delicate Mughal miniature painting of gardens, marble pavilions, cypress and plane trees, fountains and birds, with fine brushwork and gold highlights; jewel colours of lapis, malachite, rose and vermilion against much cream; only flowers, birds, trees, pavilions and water; precious, refined and calm, with large areas of plain burnished paper. A Mughal garden along the bottom: four flower beds of irises and tulips, a marble platform with a canopy, a plane tree with a pair of birds; the margin of gold flowers on celadon paper; plain ivory sky above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 26.7 Haldi (morning) · `hashiya/haldi.webp`

```text
A leaf from a Mughal royal album (muraqqa): a wide illuminated margin (hashiya) of fine gold-painted flowering plants, irises, tulips, roses and narcissus on dyed paper in pale saffron, celadon or rose, fine lapis-blue and gold rules round a calm inner field of burnished ivory paper; inside, delicate Mughal miniature painting of gardens, marble pavilions, cypress and plane trees, fountains and birds, with fine brushwork and gold highlights; jewel colours of lapis, malachite, rose and vermilion against much cream; only flowers, birds, trees, pavilions and water; precious, refined and calm, with large areas of plain burnished paper. Morning: a mango tree's branches heavy with yellow blossom across the top of the inner field, beds of marigolds and saffron crocus along the bottom, brass bowls on a marble ledge; the margin on pale saffron paper with gold marigolds. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 26.8 Mehendi (day) · `hashiya/mehendi.webp`

```text
A leaf from a Mughal royal album (muraqqa): a wide illuminated margin (hashiya) of fine gold-painted flowering plants, irises, tulips, roses and narcissus on dyed paper in pale saffron, celadon or rose, fine lapis-blue and gold rules round a calm inner field of burnished ivory paper; inside, delicate Mughal miniature painting of gardens, marble pavilions, cypress and plane trees, fountains and birds, with fine brushwork and gold highlights; jewel colours of lapis, malachite, rose and vermilion against much cream; only flowers, birds, trees, pavilions and water; precious, refined and calm, with large areas of plain burnished paper. A trellis of jasmine and climbing roses up both sides of the inner field, a pair of parakeets in the top branches, a carpet of small green leaves and tulips along the bottom; the margin on celadon paper with gold vines. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 26.9 Sangeet (night) · `hashiya/sangeet.webp`

```text
A leaf from a Mughal royal album (muraqqa): a wide illuminated margin (hashiya) of fine gold-painted flowering plants, irises, tulips, roses and narcissus on dyed paper in pale saffron, celadon or rose, fine lapis-blue and gold rules round a calm inner field of burnished ivory paper; inside, delicate Mughal miniature painting of gardens, marble pavilions, cypress and plane trees, fountains and birds, with fine brushwork and gold highlights; jewel colours of lapis, malachite, rose and vermilion against much cream; only flowers, birds, trees, pavilions and water; precious, refined and calm, with large areas of plain burnished paper. Night: a marble terrace along the bottom with a sitar and a pair of tablas resting on silk cushions, lamps glowing in carved niches; a deep lapis night sky above, plain and calm; the margin on rose paper. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 26.10 Baraat (dusk) · `hashiya/baraat.webp`

```text
A leaf from a Mughal royal album (muraqqa): a wide illuminated margin (hashiya) of fine gold-painted flowering plants, irises, tulips, roses and narcissus on dyed paper in pale saffron, celadon or rose, fine lapis-blue and gold rules round a calm inner field of burnished ivory paper; inside, delicate Mughal miniature painting of gardens, marble pavilions, cypress and plane trees, fountains and birds, with fine brushwork and gold highlights; jewel colours of lapis, malachite, rose and vermilion against much cream; only flowers, birds, trees, pavilions and water; precious, refined and calm, with large areas of plain burnished paper. Caparisoned elephants and horses with no riders, under fringed parasols, walking along the bottom of the inner field; an arcade of marble arches hung with garlands across the top; the margin on rose paper with gold flowers. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 26.11 Wedding (dusk) · `hashiya/wedding.webp`

```text
A leaf from a Mughal royal album (muraqqa): a wide illuminated margin (hashiya) of fine gold-painted flowering plants, irises, tulips, roses and narcissus on dyed paper in pale saffron, celadon or rose, fine lapis-blue and gold rules round a calm inner field of burnished ivory paper; inside, delicate Mughal miniature painting of gardens, marble pavilions, cypress and plane trees, fountains and birds, with fine brushwork and gold highlights; jewel colours of lapis, malachite, rose and vermilion against much cream; only flowers, birds, trees, pavilions and water; precious, refined and calm, with large areas of plain burnished paper. A marble baradari pavilion with slender pillars hung with jasmine strings, a floor of rose petals and gold lamps, in the upper half of the inner field; a still reflecting pool below it. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 26.12 Reception (night) · `hashiya/reception.webp`

```text
A leaf from a Mughal royal album (muraqqa): a wide illuminated margin (hashiya) of fine gold-painted flowering plants, irises, tulips, roses and narcissus on dyed paper in pale saffron, celadon or rose, fine lapis-blue and gold rules round a calm inner field of burnished ivory paper; inside, delicate Mughal miniature painting of gardens, marble pavilions, cypress and plane trees, fountains and birds, with fine brushwork and gold highlights; jewel colours of lapis, malachite, rose and vermilion against much cream; only flowers, birds, trees, pavilions and water; precious, refined and calm, with large areas of plain burnished paper. A white marble palace facade of arches lit by hundreds of small lamps in the upper half of the inner field, under a deep lapis sky; its reflection fading into a calm dark pool below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 26.13 Closing page (reply) (night) · `hashiya/reply.webp`

```text
A leaf from a Mughal royal album (muraqqa): a wide illuminated margin (hashiya) of fine gold-painted flowering plants, irises, tulips, roses and narcissus on dyed paper in pale saffron, celadon or rose, fine lapis-blue and gold rules round a calm inner field of burnished ivory paper; inside, delicate Mughal miniature painting of gardens, marble pavilions, cypress and plane trees, fountains and birds, with fine brushwork and gold highlights; jewel colours of lapis, malachite, rose and vermilion against much cream; only flowers, birds, trees, pavilions and water; precious, refined and calm, with large areas of plain burnished paper. A single tall iris and a narcissus in a slender gold vase at the bottom centre of the inner field, a pair of small birds beside it; plain ivory paper above; the margin on lapis-tinted paper with gold flowers. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 26.14 Photo page · one photo · `hashiya/couple.webp`

```text
A leaf from a Mughal royal album (muraqqa): a wide illuminated margin (hashiya) of fine gold-painted flowering plants, irises, tulips, roses and narcissus on dyed paper in pale saffron, celadon or rose, fine lapis-blue and gold rules round a calm inner field of burnished ivory paper; inside, delicate Mughal miniature painting of gardens, marble pavilions, cypress and plane trees, fountains and birds, with fine brushwork and gold highlights; jewel colours of lapis, malachite, rose and vermilion against much cream; only flowers, birds, trees, pavilions and water; precious, refined and calm, with large areas of plain burnished paper. A painting with a soft place for one photo of the couple, on plain burnished ivory paper inside a slim gold-flowered saffron margin. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: gold-painted irises, tulip sprays and small birds drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 50% of the height down, keep the picture calm and empty for the names: plain burnished ivory paper inside a slim gold-flowered saffron margin. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 26.15 Photo page · two photos · `hashiya/couple-two.webp`

```text
A leaf from a Mughal royal album (muraqqa): a wide illuminated margin (hashiya) of fine gold-painted flowering plants, irises, tulips, roses and narcissus on dyed paper in pale saffron, celadon or rose, fine lapis-blue and gold rules round a calm inner field of burnished ivory paper; inside, delicate Mughal miniature painting of gardens, marble pavilions, cypress and plane trees, fountains and birds, with fine brushwork and gold highlights; jewel colours of lapis, malachite, rose and vermilion against much cream; only flowers, birds, trees, pavilions and water; precious, refined and calm, with large areas of plain burnished paper. A painting with soft places for two photos, on plain burnished ivory paper inside a slim gold-flowered saffron margin. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a single slender iris with a tiny pair of birds falls in the gap. Neither has a frame, border, arch, outline or box: gold-painted irises, tulip sprays and small birds drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 46% of the height down, keep the picture calm and empty for both names: plain burnished ivory paper inside a slim gold-flowered saffron margin. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="gara"></a>

## 27. Gara (ગારા)

**Parsi gara embroidery: every page stitched in silk thread on lustrous silk, with cranes, peonies, willows and little bridges.**

- Folder: `public/suites/gara/` · Opening: `public/openings/fresh/parwaaz/` (Parwaaz, key #00FF00 green)
- Best for: Parsi weddings (Lagan), Christian and modern couples, anyone who loves heirloom saris · Lettering voice: classic
- The opening: A panel of embroidered silk full of resting birds; the birds lift off and fly away, and the silk floats up after them.
- Style lock (already inside every prompt below): Parsi gara embroidery: fine satin stitch and tiny knot stitches in silk thread on a lustrous silk ground (deep aubergine, black, ivory or sea-green), with motifs of cranes, pheasants, sparrows, peonies, chrysanthemums, willows, garden pavilions, little arched bridges and boats; threads in ivory, blush pink, pale jade, lavender and soft gold, with a silky sheen and visible stitch direction; never bright green thread; delicate, airy and heirloom, with large areas of plain silk.

### 27.1 Opening · the embroidered silk · `parwaaz/silk.webp`

```text
Parsi gara embroidery: fine satin stitch and tiny knot stitches in silk thread on a lustrous silk ground (deep aubergine, black, ivory or sea-green), with motifs of cranes, pheasants, sparrows, peonies, chrysanthemums, willows, garden pavilions, little arched bridges and boats; threads in ivory, blush pink, pale jade, lavender and soft gold, with a silky sheen and visible stitch direction; never bright green thread; delicate, airy and heirloom, with large areas of plain silk. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 1 of 3 of an animated opening: A panel of deep aubergine silk filling the whole picture to every edge, embroidered in gara with a flowering peony branch and a willow reaching across it, and about twenty birds at rest on the branches and on low rocks (cranes, sparrows and a pair of pheasants), all seen from the side; plain silk in the top centre; the lower 38% darker, with low rocks and a few stitched water lines. Fully painted to every edge. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: waiting, the silk breathes in a slow wave and a thread glints; opening, six birds (pieces) take flight from the branches and the silk billows up and out of the top._

### 27.2 Opening · front · `parwaaz/front.webp`

```text
Parsi gara embroidery: fine satin stitch and tiny knot stitches in silk thread on a lustrous silk ground (deep aubergine, black, ivory or sea-green), with motifs of cranes, pheasants, sparrows, peonies, chrysanthemums, willows, garden pavilions, little arched bridges and boats; threads in ivory, blush pink, pale jade, lavender and soft gold, with a silky sheen and visible stitch direction; never bright green thread; delicate, airy and heirloom, with large areas of plain silk. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 2 of 3 of an animated opening, the front: Only framing pieces, each separate with green between them: a branch of pink and ivory peonies with leaves reaching in from the top left corner and another from the top right corner, each within the outer 30% of the width and the top 18%; a few willow fronds hanging down the far left and far right edges to 40% of the height, within the outer 8%. Everything else, including the whole middle, is flat pure #00FF00 green. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: the peonies nod and the willow fronds sway; on opening they lift away._

### 27.3 Opening · pieces · `parwaaz/pieces.png` (I cut `piece-0` to `piece-5`)

```text
Parsi gara embroidery: fine satin stitch and tiny knot stitches in silk thread on a lustrous silk ground (deep aubergine, black, ivory or sea-green), with motifs of cranes, pheasants, sparrows, peonies, chrysanthemums, willows, garden pavilions, little arched bridges and boats; threads in ivory, blush pink, pale jade, lavender and soft gold, with a silky sheen and visible stitch direction; never bright green thread; delicate, airy and heirloom, with large areas of plain silk. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 3 of 3 of an animated opening, the pieces: six separate small things on flat pure #00FF00 green, arranged in a grid of 2 columns and 3 rows, each centred alone in its own cell with wide gaps, none touching another or the edge: a crane in flight with wings raised, a crane in flight with wings lowered, a small sparrow in flight, a pheasant in flight with its long tail, a pink peony flower, a single willow leaf, all as gara embroidery in silk thread. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: the birds fly up and out across the screen as the silk lifts._

### 27.4 Centre picture (after the opening) · `gara/centre.webp`

```text
Parsi gara embroidery: fine satin stitch and tiny knot stitches in silk thread on a lustrous silk ground (deep aubergine, black, ivory or sea-green), with motifs of cranes, pheasants, sparrows, peonies, chrysanthemums, willows, garden pavilions, little arched bridges and boats; threads in ivory, blush pink, pale jade, lavender and soft gold, with a silky sheen and visible stitch direction; never bright green thread; delicate, airy and heirloom, with large areas of plain silk. The centre picture of the invitation, shown right after the opening with the couple's names, the invitation line and the date written on it. A gara sari's pallu laid flat: a wide embroidered border of peonies, chrysanthemums, cranes and willow running along the top and bottom on deep aubergine silk, slimmer trailing vines up both sides, and a pair of cranes facing each other at the top centre. Inside the frame, one large empty calm field of plain lustrous ivory silk with a soft sheen, about 66% of the picture's width and from about 26% to 74% of the height: nothing drawn inside it, only the faintest texture. Keep the ornament thin beside that field and put the richest detail at the top and the bottom. Seen perfectly straight-on, centred and symmetrical, with no perspective. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 27.5 Cover (dusk) · `gara/cover.webp`

```text
Parsi gara embroidery: fine satin stitch and tiny knot stitches in silk thread on a lustrous silk ground (deep aubergine, black, ivory or sea-green), with motifs of cranes, pheasants, sparrows, peonies, chrysanthemums, willows, garden pavilions, little arched bridges and boats; threads in ivory, blush pink, pale jade, lavender and soft gold, with a silky sheen and visible stitch direction; never bright green thread; delicate, airy and heirloom, with large areas of plain silk. Two flowering peony trees up the sides of plain aubergine silk, their branches meeting at the top where a pair of cranes rest; a lotus pond with a little arched bridge along the bottom. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 27.6 Family (day) · `gara/family.webp`

```text
Parsi gara embroidery: fine satin stitch and tiny knot stitches in silk thread on a lustrous silk ground (deep aubergine, black, ivory or sea-green), with motifs of cranes, pheasants, sparrows, peonies, chrysanthemums, willows, garden pavilions, little arched bridges and boats; threads in ivory, blush pink, pale jade, lavender and soft gold, with a silky sheen and visible stitch direction; never bright green thread; delicate, airy and heirloom, with large areas of plain silk. A garden house with a curved roof and a round moon gate beside a pond along the bottom, chrysanthemums and a pair of pheasants; plain ivory silk above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 27.7 Haldi (morning) · `gara/haldi.webp`

```text
Parsi gara embroidery: fine satin stitch and tiny knot stitches in silk thread on a lustrous silk ground (deep aubergine, black, ivory or sea-green), with motifs of cranes, pheasants, sparrows, peonies, chrysanthemums, willows, garden pavilions, little arched bridges and boats; threads in ivory, blush pink, pale jade, lavender and soft gold, with a silky sheen and visible stitch direction; never bright green thread; delicate, airy and heirloom, with large areas of plain silk. Morning, on butter-yellow silk: sprays of marigold-coloured peonies and chrysanthemums in the top corners, little sparrows, a low stitched table with brass bowls of flowers along the bottom. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 27.8 Mehendi (day) · `gara/mehendi.webp`

```text
Parsi gara embroidery: fine satin stitch and tiny knot stitches in silk thread on a lustrous silk ground (deep aubergine, black, ivory or sea-green), with motifs of cranes, pheasants, sparrows, peonies, chrysanthemums, willows, garden pavilions, little arched bridges and boats; threads in ivory, blush pink, pale jade, lavender and soft gold, with a silky sheen and visible stitch direction; never bright green thread; delicate, airy and heirloom, with large areas of plain silk. Sea-green silk: trailing flowering vines down both sides with butterflies, a pair of parakeets at the top, leafy bamboo along the bottom. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 27.9 Sangeet (night) · `gara/sangeet.webp`

```text
Parsi gara embroidery: fine satin stitch and tiny knot stitches in silk thread on a lustrous silk ground (deep aubergine, black, ivory or sea-green), with motifs of cranes, pheasants, sparrows, peonies, chrysanthemums, willows, garden pavilions, little arched bridges and boats; threads in ivory, blush pink, pale jade, lavender and soft gold, with a silky sheen and visible stitch direction; never bright green thread; delicate, airy and heirloom, with large areas of plain silk. Night, on black silk: a moonlit pond along the bottom with a little boat hung with lanterns and cranes standing on one leg; plain black silk above with a few tiny stitched stars. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 27.10 Baraat (dusk) · `gara/baraat.webp`

```text
Parsi gara embroidery: fine satin stitch and tiny knot stitches in silk thread on a lustrous silk ground (deep aubergine, black, ivory or sea-green), with motifs of cranes, pheasants, sparrows, peonies, chrysanthemums, willows, garden pavilions, little arched bridges and boats; threads in ivory, blush pink, pale jade, lavender and soft gold, with a silky sheen and visible stitch direction; never bright green thread; delicate, airy and heirloom, with large areas of plain silk. A row of little boats with lantern canopies sailing along a river at the bottom, an arched bridge and willow fronds across the top; ivory silk. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 27.11 Wedding (dusk) · `gara/wedding.webp`

```text
Parsi gara embroidery: fine satin stitch and tiny knot stitches in silk thread on a lustrous silk ground (deep aubergine, black, ivory or sea-green), with motifs of cranes, pheasants, sparrows, peonies, chrysanthemums, willows, garden pavilions, little arched bridges and boats; threads in ivory, blush pink, pale jade, lavender and soft gold, with a silky sheen and visible stitch direction; never bright green thread; delicate, airy and heirloom, with large areas of plain silk. A garden pavilion hung with jasmine and rose garlands, with a pair of cranes beside it, in the upper half; calm stitched water below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 27.12 Reception (night) · `gara/reception.webp`

```text
Parsi gara embroidery: fine satin stitch and tiny knot stitches in silk thread on a lustrous silk ground (deep aubergine, black, ivory or sea-green), with motifs of cranes, pheasants, sparrows, peonies, chrysanthemums, willows, garden pavilions, little arched bridges and boats; threads in ivory, blush pink, pale jade, lavender and soft gold, with a silky sheen and visible stitch direction; never bright green thread; delicate, airy and heirloom, with large areas of plain silk. A grand garden lit with silk lanterns, an arched bridge and willows in the upper half, their reflections in the water; calm dark silk below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 27.13 Closing page (reply) (night) · `gara/reply.webp`

```text
Parsi gara embroidery: fine satin stitch and tiny knot stitches in silk thread on a lustrous silk ground (deep aubergine, black, ivory or sea-green), with motifs of cranes, pheasants, sparrows, peonies, chrysanthemums, willows, garden pavilions, little arched bridges and boats; threads in ivory, blush pink, pale jade, lavender and soft gold, with a silky sheen and visible stitch direction; never bright green thread; delicate, airy and heirloom, with large areas of plain silk. A pair of cranes standing together under a willow beside a peony bush at the bottom centre; plain black silk above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 27.14 Photo page · one photo · `gara/couple.webp`

```text
Parsi gara embroidery: fine satin stitch and tiny knot stitches in silk thread on a lustrous silk ground (deep aubergine, black, ivory or sea-green), with motifs of cranes, pheasants, sparrows, peonies, chrysanthemums, willows, garden pavilions, little arched bridges and boats; threads in ivory, blush pink, pale jade, lavender and soft gold, with a silky sheen and visible stitch direction; never bright green thread; delicate, airy and heirloom, with large areas of plain silk. A painting with a soft place for one photo of the couple, on plain lustrous aubergine silk. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: stitched peonies, little cranes and willow fronds drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 50% of the height down, keep the picture calm and empty for the names: plain lustrous aubergine silk. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 27.15 Photo page · two photos · `gara/couple-two.webp`

```text
Parsi gara embroidery: fine satin stitch and tiny knot stitches in silk thread on a lustrous silk ground (deep aubergine, black, ivory or sea-green), with motifs of cranes, pheasants, sparrows, peonies, chrysanthemums, willows, garden pavilions, little arched bridges and boats; threads in ivory, blush pink, pale jade, lavender and soft gold, with a silky sheen and visible stitch direction; never bright green thread; delicate, airy and heirloom, with large areas of plain silk. A painting with soft places for two photos, on plain lustrous aubergine silk. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a single willow frond with a tiny pair of sparrows falls in the gap. Neither has a frame, border, arch, outline or box: stitched peonies, little cranes and willow fronds drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 46% of the height down, keep the picture calm and empty for both names: plain lustrous aubergine silk. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="abri"></a>

## 28. Abri (अबरी)

**Deccani marbled paper and Golconda miniatures: swirling lilac, ultramarine and rose skies round calm pale fields.**

- Folder: `public/suites/abri/` · Opening: `public/openings/fresh/bhanwar/` (Bhanwar, key #00FF00 green)
- Best for: Hyderabadi and Deccani weddings, Nikah, modern couples who love colour · Lettering voice: classic
- The opening: A sheet of marbled paper starts to swirl like a whirlpool and drains away into the centre.
- Style lock (already inside every prompt below): Deccani abri marbled paper with Golconda-style miniature painting: borders and skies of hand-marbled paper in swirling veins and combed feather patterns of lilac, ultramarine, rose, saffron and sea-green with gold flecks; inside them fine Deccani miniature scenes of domed palaces, gardens, cypress, palms and flowering trees in soft lilac, gold and pale green, in a dreamy twilight light; large calm fields of plain pale paper; refined, poetic and a little mysterious.

### 28.1 Opening · the marbled sheet · `bhanwar/marble.webp`

```text
Deccani abri marbled paper with Golconda-style miniature painting: borders and skies of hand-marbled paper in swirling veins and combed feather patterns of lilac, ultramarine, rose, saffron and sea-green with gold flecks; inside them fine Deccani miniature scenes of domed palaces, gardens, cypress, palms and flowering trees in soft lilac, gold and pale green, in a dreamy twilight light; large calm fields of plain pale paper; refined, poetic and a little mysterious. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 1 of 3 of an animated opening: A sheet of hand-marbled abri paper filling the whole picture to every edge: large swirling veins and combed feather patterns of lilac, ultramarine, rose and sea-green, flecked with gold, with a softer, calmer area in the top centre; the lower 38% darker, in deep ultramarine and lilac. No objects, only the marbling. Fully painted to every edge. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: waiting, the app drifts the veins slowly as if floating on water; opening, the sheet twists into a whirlpool round the centre and drains to a point, the centre picture opening outward behind it._

### 28.2 Opening · front · `bhanwar/front.webp`

```text
Deccani abri marbled paper with Golconda-style miniature painting: borders and skies of hand-marbled paper in swirling veins and combed feather patterns of lilac, ultramarine, rose, saffron and sea-green with gold flecks; inside them fine Deccani miniature scenes of domed palaces, gardens, cypress, palms and flowering trees in soft lilac, gold and pale green, in a dreamy twilight light; large calm fields of plain pale paper; refined, poetic and a little mysterious. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 2 of 3 of an animated opening, the front: Only framing pieces, each separate with green between them: a tall Deccani cypress tree twined with a flowering vine down the far left edge and another down the far right edge, each within the outer 12% of the width and the full height; a scalloped band of lilac and gold arch tracery across the top 10%. Everything else, including the whole middle, is flat pure #00FF00 green. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: the cypresses sway; on opening they slide out past the edges._

### 28.3 Opening · pieces · `bhanwar/pieces.png` (I cut `piece-0` to `piece-5`)

```text
Deccani abri marbled paper with Golconda-style miniature painting: borders and skies of hand-marbled paper in swirling veins and combed feather patterns of lilac, ultramarine, rose, saffron and sea-green with gold flecks; inside them fine Deccani miniature scenes of domed palaces, gardens, cypress, palms and flowering trees in soft lilac, gold and pale green, in a dreamy twilight light; large calm fields of plain pale paper; refined, poetic and a little mysterious. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 3 of 3 of an animated opening, the pieces: six separate small things on flat pure #00FF00 green, arranged in a grid of 2 columns and 3 rows, each centred alone in its own cell with wide gaps, none touching another or the edge: a tiny solid gold fleck shaped like a star, a round drop of ultramarine ink, a round drop of rose ink, a lilac iris flower, a small golden fish seen from the side, a sea-green leaf. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: ink drops and gold flecks spin round the whirlpool and fly out._

### 28.4 Centre picture (after the opening) · `abri/centre.webp`

```text
Deccani abri marbled paper with Golconda-style miniature painting: borders and skies of hand-marbled paper in swirling veins and combed feather patterns of lilac, ultramarine, rose, saffron and sea-green with gold flecks; inside them fine Deccani miniature scenes of domed palaces, gardens, cypress, palms and flowering trees in soft lilac, gold and pale green, in a dreamy twilight light; large calm fields of plain pale paper; refined, poetic and a little mysterious. The centre picture of the invitation, shown right after the opening with the couple's names, the invitation line and the date written on it. A Deccani album page seen flat: a wide margin of swirling lilac, rose and gold marbled abri paper all round, a fine gold rule and a slim band of tiny painted flowers inside it, and a small gold-and-lilac domed pavilion between two cypresses at the top centre. Inside the frame, one large empty calm field of plain pale lilac paper, about 66% of the picture's width and from about 26% to 74% of the height: nothing drawn inside it, only the faintest texture. Keep the ornament thin beside that field and put the richest detail at the top and the bottom. Seen perfectly straight-on, centred and symmetrical, with no perspective. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 28.5 Cover (dusk) · `abri/cover.webp`

```text
Deccani abri marbled paper with Golconda-style miniature painting: borders and skies of hand-marbled paper in swirling veins and combed feather patterns of lilac, ultramarine, rose, saffron and sea-green with gold flecks; inside them fine Deccani miniature scenes of domed palaces, gardens, cypress, palms and flowering trees in soft lilac, gold and pale green, in a dreamy twilight light; large calm fields of plain pale paper; refined, poetic and a little mysterious. Marbled lilac and rose sky swirling across the top, a Golconda-style palace with onion domes and arcades small along the bottom among palms and cypresses, twilight. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 28.6 Family (day) · `abri/family.webp`

```text
Deccani abri marbled paper with Golconda-style miniature painting: borders and skies of hand-marbled paper in swirling veins and combed feather patterns of lilac, ultramarine, rose, saffron and sea-green with gold flecks; inside them fine Deccani miniature scenes of domed palaces, gardens, cypress, palms and flowering trees in soft lilac, gold and pale green, in a dreamy twilight light; large calm fields of plain pale paper; refined, poetic and a little mysterious. A garden along the bottom with a long water channel, flowering pomegranate trees and a stone pavilion; a soft marbled band only at the very top edge; plain pale paper between. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 28.7 Haldi (morning) · `abri/haldi.webp`

```text
Deccani abri marbled paper with Golconda-style miniature painting: borders and skies of hand-marbled paper in swirling veins and combed feather patterns of lilac, ultramarine, rose, saffron and sea-green with gold flecks; inside them fine Deccani miniature scenes of domed palaces, gardens, cypress, palms and flowering trees in soft lilac, gold and pale green, in a dreamy twilight light; large calm fields of plain pale paper; refined, poetic and a little mysterious. Saffron and rose marbling in bands along the top and bottom edges, marigold trees and turmeric-yellow pavilions small along the bottom; morning light. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 28.8 Mehendi (day) · `abri/mehendi.webp`

```text
Deccani abri marbled paper with Golconda-style miniature painting: borders and skies of hand-marbled paper in swirling veins and combed feather patterns of lilac, ultramarine, rose, saffron and sea-green with gold flecks; inside them fine Deccani miniature scenes of domed palaces, gardens, cypress, palms and flowering trees in soft lilac, gold and pale green, in a dreamy twilight light; large calm fields of plain pale paper; refined, poetic and a little mysterious. Sea-green marbled borders, henna bushes and pomegranate trees up both sides with parrots. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 28.9 Sangeet (night) · `abri/sangeet.webp`

```text
Deccani abri marbled paper with Golconda-style miniature painting: borders and skies of hand-marbled paper in swirling veins and combed feather patterns of lilac, ultramarine, rose, saffron and sea-green with gold flecks; inside them fine Deccani miniature scenes of domed palaces, gardens, cypress, palms and flowering trees in soft lilac, gold and pale green, in a dreamy twilight light; large calm fields of plain pale paper; refined, poetic and a little mysterious. A lit pavilion terrace along the bottom with lamps and instruments resting on carpets; plain pale lilac night above, with ultramarine marbling only at the very top edge. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 28.10 Baraat (dusk) · `abri/baraat.webp`

```text
Deccani abri marbled paper with Golconda-style miniature painting: borders and skies of hand-marbled paper in swirling veins and combed feather patterns of lilac, ultramarine, rose, saffron and sea-green with gold flecks; inside them fine Deccani miniature scenes of domed palaces, gardens, cypress, palms and flowering trees in soft lilac, gold and pale green, in a dreamy twilight light; large calm fields of plain pale paper; refined, poetic and a little mysterious. Elephants with empty canopied howdahs and horses with plumes walking along the bottom against a marbled rose sky; a palace gateway small at the top. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 28.11 Wedding (dusk) · `abri/wedding.webp`

```text
Deccani abri marbled paper with Golconda-style miniature painting: borders and skies of hand-marbled paper in swirling veins and combed feather patterns of lilac, ultramarine, rose, saffron and sea-green with gold flecks; inside them fine Deccani miniature scenes of domed palaces, gardens, cypress, palms and flowering trees in soft lilac, gold and pale green, in a dreamy twilight light; large calm fields of plain pale paper; refined, poetic and a little mysterious. A pavilion of slender arches hung with jasmine and rose strings on a marble platform spread with carpets, in the upper half; a still pool below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 28.12 Reception (night) · `abri/reception.webp`

```text
Deccani abri marbled paper with Golconda-style miniature painting: borders and skies of hand-marbled paper in swirling veins and combed feather patterns of lilac, ultramarine, rose, saffron and sea-green with gold flecks; inside them fine Deccani miniature scenes of domed palaces, gardens, cypress, palms and flowering trees in soft lilac, gold and pale green, in a dreamy twilight light; large calm fields of plain pale paper; refined, poetic and a little mysterious. A domed palace of arches lit by lamps under a marbled ultramarine night sky with gold flecks, in the upper half; calm water below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 28.13 Closing page (reply) (night) · `abri/reply.webp`

```text
Deccani abri marbled paper with Golconda-style miniature painting: borders and skies of hand-marbled paper in swirling veins and combed feather patterns of lilac, ultramarine, rose, saffron and sea-green with gold flecks; inside them fine Deccani miniature scenes of domed palaces, gardens, cypress, palms and flowering trees in soft lilac, gold and pale green, in a dreamy twilight light; large calm fields of plain pale paper; refined, poetic and a little mysterious. A cypress and a flowering almond tree with a pair of birds on a small terrace with lamps, at the bottom; plain pale lilac paper above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 28.14 Photo page · one photo · `abri/couple.webp`

```text
Deccani abri marbled paper with Golconda-style miniature painting: borders and skies of hand-marbled paper in swirling veins and combed feather patterns of lilac, ultramarine, rose, saffron and sea-green with gold flecks; inside them fine Deccani miniature scenes of domed palaces, gardens, cypress, palms and flowering trees in soft lilac, gold and pale green, in a dreamy twilight light; large calm fields of plain pale paper; refined, poetic and a little mysterious. A painting with a soft place for one photo of the couple, on plain pale lilac paper. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: swirls of lilac and rose marbling, small irises and gold flecks drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 50% of the height down, keep the picture calm and empty for the names: plain pale lilac paper. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 28.15 Photo page · two photos · `abri/couple-two.webp`

```text
Deccani abri marbled paper with Golconda-style miniature painting: borders and skies of hand-marbled paper in swirling veins and combed feather patterns of lilac, ultramarine, rose, saffron and sea-green with gold flecks; inside them fine Deccani miniature scenes of domed palaces, gardens, cypress, palms and flowering trees in soft lilac, gold and pale green, in a dreamy twilight light; large calm fields of plain pale paper; refined, poetic and a little mysterious. A painting with soft places for two photos, on plain pale lilac paper. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a slim cypress with a pair of tiny birds falls in the gap. Neither has a frame, border, arch, outline or box: swirls of lilac and rose marbling, small irises and gold flecks drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 46% of the height down, keep the picture calm and empty for both names: plain pale lilac paper. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="neel-chhaap"></a>

## 29. Neel Chhaap (नील छाप)

**A cyanotype sun-print: white ferns, lace and flowers on deep Prussian blue, with soft white prints of palaces and gardens.**

- Folder: `public/suites/neel-chhaap/` · Opening: `public/openings/fresh/jaali-patta/` (Jaali Patta, key #FF00FF magenta)
- Best for: Modern and destination weddings, minimal couples, garden lovers, Christian weddings · Lettering voice: modern
- The opening: A huge lace-like skeleton leaf; light runs up its veins, then it turns and flutters down like an autumn leaf.
- Style lock (already inside every prompt below): A cyanotype sun-print: deep Prussian-blue and cobalt paper with crisp white silhouettes of real ferns, leaves, flowers, feathers and lace laid on it, and soft white-on-blue photographic prints of Indian pavilions and gardens; delicately toned edges, a hand-brushed coating border and fine paper grain; only cobalt, Prussian blue, white and a touch of pale gold; calm, modern, botanical and dreamy, with large areas of plain deep blue.

### 29.1 Opening · the skeleton leaf · `jaali-patta/leaf.webp`

```text
A cyanotype sun-print: deep Prussian-blue and cobalt paper with crisp white silhouettes of real ferns, leaves, flowers, feathers and lace laid on it, and soft white-on-blue photographic prints of Indian pavilions and gardens; delicately toned edges, a hand-brushed coating border and fine paper grain; only cobalt, Prussian blue, white and a touch of pale gold; calm, modern, botanical and dreamy, with large areas of plain deep blue. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #FF00FF magenta, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 1 of 3 of an animated opening: One huge skeleton leaf, all fine lace-like veins in white and pale silver-gold, seen straight on with its tip pointing up and its stem at the bottom centre at 92% of the height; the leaf fills almost the whole picture, reaching 3% from the top and 3% from each side; the spaces between the veins are filled with deep cobalt cyanotype blue, so the leaf is one solid shape; its lower part a little darker. Everything outside the leaf's outline is flat pure #FF00FF magenta. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: waiting, a slow glint of light climbs the veins from the stem; opening, the leaf turns edge-on and flutters down off the bottom, spinning, revealing the centre picture._

### 29.2 Opening · front · `jaali-patta/front.webp`

```text
A cyanotype sun-print: deep Prussian-blue and cobalt paper with crisp white silhouettes of real ferns, leaves, flowers, feathers and lace laid on it, and soft white-on-blue photographic prints of Indian pavilions and gardens; delicately toned edges, a hand-brushed coating border and fine paper grain; only cobalt, Prussian blue, white and a touch of pale gold; calm, modern, botanical and dreamy, with large areas of plain deep blue. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #FF00FF magenta, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 2 of 3 of an animated opening, the front: Only framing pieces, each separate with magenta between them: white fern fronds and lace-flower stems rising from the bottom left and bottom right corners, from 70% of the height to the bottom, each within the outer 25% of the width; a single white fern frond hanging from the top left corner within the outer 20% and the top 15%. Everything else, including the whole middle, is flat pure #FF00FF magenta. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: the ferns sway; on opening they bend aside and slide out._

### 29.3 Opening · pieces · `jaali-patta/pieces.png` (I cut `piece-0` to `piece-5`)

```text
A cyanotype sun-print: deep Prussian-blue and cobalt paper with crisp white silhouettes of real ferns, leaves, flowers, feathers and lace laid on it, and soft white-on-blue photographic prints of Indian pavilions and gardens; delicately toned edges, a hand-brushed coating border and fine paper grain; only cobalt, Prussian blue, white and a touch of pale gold; calm, modern, botanical and dreamy, with large areas of plain deep blue. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #FF00FF magenta, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 3 of 3 of an animated opening, the pieces: six separate small things on flat pure #FF00FF magenta, arranged in a grid of 2 columns and 3 rows, each centred alone in its own cell with wide gaps, none touching another or the edge: a small white skeleton leaf, the tip of a white fern frond, a white feather, a white cosmos flower, a small round piece of white lace, a tiny pale gold star. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: they drift down after the falling leaf._

### 29.4 Centre picture (after the opening) · `neel-chhaap/centre.webp`

```text
A cyanotype sun-print: deep Prussian-blue and cobalt paper with crisp white silhouettes of real ferns, leaves, flowers, feathers and lace laid on it, and soft white-on-blue photographic prints of Indian pavilions and gardens; delicately toned edges, a hand-brushed coating border and fine paper grain; only cobalt, Prussian blue, white and a touch of pale gold; calm, modern, botanical and dreamy, with large areas of plain deep blue. The centre picture of the invitation, shown right after the opening with the couple's names, the invitation line and the date written on it. A cyanotype print seen flat: round the edges, white silhouettes of ferns, lace, jasmine sprays and a pair of feathers on deep Prussian-blue paper with a hand-brushed edge, thickest at the top and bottom; a small white print of a domed pavilion at the top centre. Inside the frame, one large empty calm field of plain deep cobalt blue, softly mottled, about 66% of the picture's width and from about 26% to 74% of the height: nothing drawn inside it, only the faintest texture. Keep the ornament thin beside that field and put the richest detail at the top and the bottom. Seen perfectly straight-on, centred and symmetrical, with no perspective. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 29.5 Cover (dusk) · `neel-chhaap/cover.webp`

```text
A cyanotype sun-print: deep Prussian-blue and cobalt paper with crisp white silhouettes of real ferns, leaves, flowers, feathers and lace laid on it, and soft white-on-blue photographic prints of Indian pavilions and gardens; delicately toned edges, a hand-brushed coating border and fine paper grain; only cobalt, Prussian blue, white and a touch of pale gold; calm, modern, botanical and dreamy, with large areas of plain deep blue. White silhouettes of ferns and long-stemmed lotuses rising from the bottom and hanging from the top, the middle plain deep blue. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 29.6 Family (day) · `neel-chhaap/family.webp`

```text
A cyanotype sun-print: deep Prussian-blue and cobalt paper with crisp white silhouettes of real ferns, leaves, flowers, feathers and lace laid on it, and soft white-on-blue photographic prints of Indian pavilions and gardens; delicately toned edges, a hand-brushed coating border and fine paper grain; only cobalt, Prussian blue, white and a touch of pale gold; calm, modern, botanical and dreamy, with large areas of plain deep blue. A white sun-print of a spreading banyan tree with hanging roots and a garden bench along the bottom; plain blue above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 29.7 Haldi (morning) · `neel-chhaap/haldi.webp`

```text
A cyanotype sun-print: deep Prussian-blue and cobalt paper with crisp white silhouettes of real ferns, leaves, flowers, feathers and lace laid on it, and soft white-on-blue photographic prints of Indian pavilions and gardens; delicately toned edges, a hand-brushed coating border and fine paper grain; only cobalt, Prussian blue, white and a touch of pale gold; calm, modern, botanical and dreamy, with large areas of plain deep blue. Swags of marigold flowers and mango leaves as white silhouettes along the top, white prints of brass urns along the bottom, a pale gold morning wash. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 29.8 Mehendi (day) · `neel-chhaap/mehendi.webp`

```text
A cyanotype sun-print: deep Prussian-blue and cobalt paper with crisp white silhouettes of real ferns, leaves, flowers, feathers and lace laid on it, and soft white-on-blue photographic prints of Indian pavilions and gardens; delicately toned edges, a hand-brushed coating border and fine paper grain; only cobalt, Prussian blue, white and a touch of pale gold; calm, modern, botanical and dreamy, with large areas of plain deep blue. Henna leaves and trailing vines in white silhouette up both sides, a pair of parrots in silhouette at the top. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 29.9 Sangeet (night) · `neel-chhaap/sangeet.webp`

```text
A cyanotype sun-print: deep Prussian-blue and cobalt paper with crisp white silhouettes of real ferns, leaves, flowers, feathers and lace laid on it, and soft white-on-blue photographic prints of Indian pavilions and gardens; delicately toned edges, a hand-brushed coating border and fine paper grain; only cobalt, Prussian blue, white and a touch of pale gold; calm, modern, botanical and dreamy, with large areas of plain deep blue. White prints of a sitar, a dholak and a harmonium with a string of paper lanterns along the bottom; plain blue night above with a few white dots like stars. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 29.10 Baraat (dusk) · `neel-chhaap/baraat.webp`

```text
A cyanotype sun-print: deep Prussian-blue and cobalt paper with crisp white silhouettes of real ferns, leaves, flowers, feathers and lace laid on it, and soft white-on-blue photographic prints of Indian pavilions and gardens; delicately toned edges, a hand-brushed coating border and fine paper grain; only cobalt, Prussian blue, white and a touch of pale gold; calm, modern, botanical and dreamy, with large areas of plain deep blue. A procession of elephant and horse silhouettes under parasols, with no riders, printed in white along the bottom; a toran of mango leaves across the top. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 29.11 Wedding (dusk) · `neel-chhaap/wedding.webp`

```text
A cyanotype sun-print: deep Prussian-blue and cobalt paper with crisp white silhouettes of real ferns, leaves, flowers, feathers and lace laid on it, and soft white-on-blue photographic prints of Indian pavilions and gardens; delicately toned edges, a hand-brushed coating border and fine paper grain; only cobalt, Prussian blue, white and a touch of pale gold; calm, modern, botanical and dreamy, with large areas of plain deep blue. A white print of a mandap with four slender pillars hung with jasmine strings, framed by ferns, in the upper half; plain blue below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 29.12 Reception (night) · `neel-chhaap/reception.webp`

```text
A cyanotype sun-print: deep Prussian-blue and cobalt paper with crisp white silhouettes of real ferns, leaves, flowers, feathers and lace laid on it, and soft white-on-blue photographic prints of Indian pavilions and gardens; delicately toned edges, a hand-brushed coating border and fine paper grain; only cobalt, Prussian blue, white and a touch of pale gold; calm, modern, botanical and dreamy, with large areas of plain deep blue. A white print of a palace facade of arches with strings of bulbs, in the upper half; plain blue below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 29.13 Closing page (reply) (night) · `neel-chhaap/reply.webp`

```text
A cyanotype sun-print: deep Prussian-blue and cobalt paper with crisp white silhouettes of real ferns, leaves, flowers, feathers and lace laid on it, and soft white-on-blue photographic prints of Indian pavilions and gardens; delicately toned edges, a hand-brushed coating border and fine paper grain; only cobalt, Prussian blue, white and a touch of pale gold; calm, modern, botanical and dreamy, with large areas of plain deep blue. A white print of a single long-stemmed lotus, a lily pad and two dragonflies at the bottom centre; plain blue above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 29.14 Photo page · one photo · `neel-chhaap/couple.webp`

```text
A cyanotype sun-print: deep Prussian-blue and cobalt paper with crisp white silhouettes of real ferns, leaves, flowers, feathers and lace laid on it, and soft white-on-blue photographic prints of Indian pavilions and gardens; delicately toned edges, a hand-brushed coating border and fine paper grain; only cobalt, Prussian blue, white and a touch of pale gold; calm, modern, botanical and dreamy, with large areas of plain deep blue. A painting with a soft place for one photo of the couple, on plain deep cobalt blue. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: white fern fronds, lace and jasmine sprays drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 50% of the height down, keep the picture calm and empty for the names: plain deep cobalt blue. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 29.15 Photo page · two photos · `neel-chhaap/couple-two.webp`

```text
A cyanotype sun-print: deep Prussian-blue and cobalt paper with crisp white silhouettes of real ferns, leaves, flowers, feathers and lace laid on it, and soft white-on-blue photographic prints of Indian pavilions and gardens; delicately toned edges, a hand-brushed coating border and fine paper grain; only cobalt, Prussian blue, white and a touch of pale gold; calm, modern, botanical and dreamy, with large areas of plain deep blue. A painting with soft places for two photos, on plain deep cobalt blue. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a single white fern frond falls in the gap. Neither has a frame, border, arch, outline or box: white fern fronds, lace and jasmine sprays drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 46% of the height down, keep the picture calm and empty for both names: plain deep cobalt blue. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="lapet"></a>

## 30. Lapet (लपेट)

**Paper quilling: flowers, birds, palaces and lanterns rolled from pastel paper strips, standing in low relief on ivory card.**

- Folder: `public/suites/lapet/` · Opening: `public/openings/fresh/lapet-khule/` (Lapet Khule, key #00FF00 green)
- Best for: Modern and playful weddings, engagements and roka, anyone who loves handmade craft · Lettering voice: playful
- The opening: A great rosette of quilled paper coils; the rings spin and spring loose, and curls of paper bounce away.
- Style lock (already inside every prompt below): Paper quilling art: hundreds of narrow paper strips rolled, pinched and glued on edge into coils, teardrops, scrolls and petals, forming flowers, vines, birds, palaces and lanterns in low relief on smooth ivory card; pastel papers in blush, peach, butter yellow, sage and dusty blue with gilded edges; soft studio light from the top left casting tiny shadows that show the depth of every coil; playful, delicate and handmade, with wide plain areas of ivory card.

### 30.1 Opening · the quilled rosette · `lapet-khule/rosette.webp`

```text
Paper quilling art: hundreds of narrow paper strips rolled, pinched and glued on edge into coils, teardrops, scrolls and petals, forming flowers, vines, birds, palaces and lanterns in low relief on smooth ivory card; pastel papers in blush, peach, butter yellow, sage and dusty blue with gilded edges; soft studio light from the top left casting tiny shadows that show the depth of every coil; playful, delicate and handmade, with wide plain areas of ivory card. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 1 of 3 of an animated opening: A board filling the whole picture to every edge, densely covered in quilled paper: a giant round rosette of concentric rings of coils, teardrops and scrolls in blush, peach, butter yellow and sage, centred across the width at 42% of the height and about 90% of the width across, its centre a plainer ring of ivory coils; small closed coils in ivory and pale gold fill the corners; the lower 38% in deeper dusty-blue coils. Fully painted to every edge. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: waiting, the rings breathe in and out and a few coils sway; opening, the app cuts the rosette into rings that spin opposite ways and spring outward past the edges, and the loose curls (pieces) bounce away._

### 30.2 Opening · front · `lapet-khule/front.webp`

```text
Paper quilling art: hundreds of narrow paper strips rolled, pinched and glued on edge into coils, teardrops, scrolls and petals, forming flowers, vines, birds, palaces and lanterns in low relief on smooth ivory card; pastel papers in blush, peach, butter yellow, sage and dusty blue with gilded edges; soft studio light from the top left casting tiny shadows that show the depth of every coil; playful, delicate and handmade, with wide plain areas of ivory card. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 2 of 3 of an animated opening, the front: Only framing pieces, each separate with green between them: a cluster of quilled blush roses with sage leaves in the top left corner and another in the top right corner, each within the outer 28% of the width and the top 16%; a low row of small quilled tulips along the bottom edge, from 90% of the height to the bottom. Everything else, including the whole middle, is flat pure #00FF00 green. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: the roses bob; on opening they pop out past the corners._

### 30.3 Opening · pieces · `lapet-khule/pieces.png` (I cut `piece-0` to `piece-5`)

```text
Paper quilling art: hundreds of narrow paper strips rolled, pinched and glued on edge into coils, teardrops, scrolls and petals, forming flowers, vines, birds, palaces and lanterns in low relief on smooth ivory card; pastel papers in blush, peach, butter yellow, sage and dusty blue with gilded edges; soft studio light from the top left casting tiny shadows that show the depth of every coil; playful, delicate and handmade, with wide plain areas of ivory card. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 3 of 3 of an animated opening, the pieces: six separate small things on flat pure #00FF00 green, arranged in a grid of 2 columns and 3 rows, each centred alone in its own cell with wide gaps, none touching another or the edge: a loose blush paper strip uncurling into a spiral, a peach teardrop coil, a sage quilled leaf, a tight butter-yellow coil, a dusty-blue S-shaped scroll, a small quilled pale gold star. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: they bounce and tumble away like springs as the rings let go._

### 30.4 Centre picture (after the opening) · `lapet/centre.webp`

```text
Paper quilling art: hundreds of narrow paper strips rolled, pinched and glued on edge into coils, teardrops, scrolls and petals, forming flowers, vines, birds, palaces and lanterns in low relief on smooth ivory card; pastel papers in blush, peach, butter yellow, sage and dusty blue with gilded edges; soft studio light from the top left casting tiny shadows that show the depth of every coil; playful, delicate and handmade, with wide plain areas of ivory card. The centre picture of the invitation, shown right after the opening with the couple's names, the invitation line and the date written on it. A quilled paper frame on ivory card: a wide border of quilled roses, marigolds and jasmine, curling vines, leaves and little birds all the way round, thickest at the top and bottom, with a quilled pair of parrots facing each other at the top centre. Inside the frame, one large empty calm field of plain smooth ivory card, about 66% of the picture's width and from about 26% to 74% of the height: nothing drawn inside it, only the faintest texture. Keep the ornament thin beside that field and put the richest detail at the top and the bottom. Seen perfectly straight-on, centred and symmetrical, with no perspective. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 30.5 Cover (dusk) · `lapet/cover.webp`

```text
Paper quilling art: hundreds of narrow paper strips rolled, pinched and glued on edge into coils, teardrops, scrolls and petals, forming flowers, vines, birds, palaces and lanterns in low relief on smooth ivory card; pastel papers in blush, peach, butter yellow, sage and dusty blue with gilded edges; soft studio light from the top left casting tiny shadows that show the depth of every coil; playful, delicate and handmade, with wide plain areas of ivory card. A quilled palace skyline of domes and chhatris in peach and blush along the bottom, quilled hanging lanterns and flower strings from the top edge. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 30.6 Family (day) · `lapet/family.webp`

```text
Paper quilling art: hundreds of narrow paper strips rolled, pinched and glued on edge into coils, teardrops, scrolls and petals, forming flowers, vines, birds, palaces and lanterns in low relief on smooth ivory card; pastel papers in blush, peach, butter yellow, sage and dusty blue with gilded edges; soft studio light from the top left casting tiny shadows that show the depth of every coil; playful, delicate and handmade, with wide plain areas of ivory card. A quilled courtyard house with a swing, a tree of coiled leaves and pots of flowers along the bottom; plain ivory card above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 30.7 Haldi (morning) · `lapet/haldi.webp`

```text
Paper quilling art: hundreds of narrow paper strips rolled, pinched and glued on edge into coils, teardrops, scrolls and petals, forming flowers, vines, birds, palaces and lanterns in low relief on smooth ivory card; pastel papers in blush, peach, butter yellow, sage and dusty blue with gilded edges; soft studio light from the top left casting tiny shadows that show the depth of every coil; playful, delicate and handmade, with wide plain areas of ivory card. Quilled marigold garlands in butter yellow and orange swagged across the top, quilled brass urns and bowls along the bottom edge. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 30.8 Mehendi (day) · `lapet/mehendi.webp`

```text
Paper quilling art: hundreds of narrow paper strips rolled, pinched and glued on edge into coils, teardrops, scrolls and petals, forming flowers, vines, birds, palaces and lanterns in low relief on smooth ivory card; pastel papers in blush, peach, butter yellow, sage and dusty blue with gilded edges; soft studio light from the top left casting tiny shadows that show the depth of every coil; playful, delicate and handmade, with wide plain areas of ivory card. Quilled green vines with henna-leaf teardrops climbing both sides, a pair of quilled peacocks at the bottom. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 30.9 Sangeet (night) · `lapet/sangeet.webp`

```text
Paper quilling art: hundreds of narrow paper strips rolled, pinched and glued on edge into coils, teardrops, scrolls and petals, forming flowers, vines, birds, palaces and lanterns in low relief on smooth ivory card; pastel papers in blush, peach, butter yellow, sage and dusty blue with gilded edges; soft studio light from the top left casting tiny shadows that show the depth of every coil; playful, delicate and handmade, with wide plain areas of ivory card. On dusty-blue card: a quilled dhol and shehnai with strings of quilled fairy lights along the bottom; plain card above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 30.10 Baraat (dusk) · `lapet/baraat.webp`

```text
Paper quilling art: hundreds of narrow paper strips rolled, pinched and glued on edge into coils, teardrops, scrolls and petals, forming flowers, vines, birds, palaces and lanterns in low relief on smooth ivory card; pastel papers in blush, peach, butter yellow, sage and dusty blue with gilded edges; soft studio light from the top left casting tiny shadows that show the depth of every coil; playful, delicate and handmade, with wide plain areas of ivory card. A quilled procession of an elephant and horses with parasols and no riders along the bottom, a quilled toran across the top. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 30.11 Wedding (dusk) · `lapet/wedding.webp`

```text
Paper quilling art: hundreds of narrow paper strips rolled, pinched and glued on edge into coils, teardrops, scrolls and petals, forming flowers, vines, birds, palaces and lanterns in low relief on smooth ivory card; pastel papers in blush, peach, butter yellow, sage and dusty blue with gilded edges; soft studio light from the top left casting tiny shadows that show the depth of every coil; playful, delicate and handmade, with wide plain areas of ivory card. A quilled mandap with four flower-wrapped pillars and a domed canopy hung with jasmine strings, in the upper half; plain ivory card below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 30.12 Reception (night) · `lapet/reception.webp`

```text
Paper quilling art: hundreds of narrow paper strips rolled, pinched and glued on edge into coils, teardrops, scrolls and petals, forming flowers, vines, birds, palaces and lanterns in low relief on smooth ivory card; pastel papers in blush, peach, butter yellow, sage and dusty blue with gilded edges; soft studio light from the top left casting tiny shadows that show the depth of every coil; playful, delicate and handmade, with wide plain areas of ivory card. On dusty-blue card: a quilled chandelier and strings of quilled lights over a palace balcony, in the upper half; plain card below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 30.13 Closing page (reply) (night) · `lapet/reply.webp`

```text
Paper quilling art: hundreds of narrow paper strips rolled, pinched and glued on edge into coils, teardrops, scrolls and petals, forming flowers, vines, birds, palaces and lanterns in low relief on smooth ivory card; pastel papers in blush, peach, butter yellow, sage and dusty blue with gilded edges; soft studio light from the top left casting tiny shadows that show the depth of every coil; playful, delicate and handmade, with wide plain areas of ivory card. A quilled rose bush in a pot with a pair of little quilled birds at the bottom centre; plain ivory card above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 30.14 Photo page · one photo · `lapet/couple.webp`

```text
Paper quilling art: hundreds of narrow paper strips rolled, pinched and glued on edge into coils, teardrops, scrolls and petals, forming flowers, vines, birds, palaces and lanterns in low relief on smooth ivory card; pastel papers in blush, peach, butter yellow, sage and dusty blue with gilded edges; soft studio light from the top left casting tiny shadows that show the depth of every coil; playful, delicate and handmade, with wide plain areas of ivory card. A painting with a soft place for one photo of the couple, on plain smooth ivory card. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: quilled roses, coiled leaves and little paper birds drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 50% of the height down, keep the picture calm and empty for the names: plain smooth ivory card. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 30.15 Photo page · two photos · `lapet/couple-two.webp`

```text
Paper quilling art: hundreds of narrow paper strips rolled, pinched and glued on edge into coils, teardrops, scrolls and petals, forming flowers, vines, birds, palaces and lanterns in low relief on smooth ivory card; pastel papers in blush, peach, butter yellow, sage and dusty blue with gilded edges; soft studio light from the top left casting tiny shadows that show the depth of every coil; playful, delicate and handmade, with wide plain areas of ivory card. A painting with soft places for two photos, on plain smooth ivory card. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a slim quilled vine with a tiny pair of birds falls in the gap. Neither has a frame, border, arch, outline or box: quilled roses, coiled leaves and little paper birds drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 46% of the height down, keep the picture calm and empty for both names: plain smooth ivory card. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="chandan"></a>

## 31. Chandan (ಚಂದನ)

**Mysuru sandalwood carving: honey-gold relief of jasmine, parrots and elephants, with fresh jasmine and lamplight.**

- Folder: `public/suites/chandan/` · Opening: `public/openings/fresh/taar/` (Taar, key #00FF00 green)
- Best for: Kannada and Tamil weddings, Mysuru and Karnataka families, South Indian heritage lovers · Lettering voice: classic
- The opening: A carved sandalwood panel strung like a veena; the strings shimmer as if plucked, then the panel parts strip by strip.
- Style lock (already inside every prompt below): Mysuru sandalwood carving: scenes carved in deep, intricate relief in honey-gold sandalwood with a soft satin polish, finely undercut leaves, flowers, birds and animals, the carved wood glowing warm against calm areas of smooth plain polished sandalwood and soft cream silk; warm low lamplight from the top left with gentle shadows in the carving; fresh white jasmine and a few red roses as the only other colour; only animals, birds, plants and buildings; serene, fragrant-looking, precious and South Indian.

### 31.1 Opening · the carved panel · `taar/panel.webp`

```text
Mysuru sandalwood carving: scenes carved in deep, intricate relief in honey-gold sandalwood with a soft satin polish, finely undercut leaves, flowers, birds and animals, the carved wood glowing warm against calm areas of smooth plain polished sandalwood and soft cream silk; warm low lamplight from the top left with gentle shadows in the carving; fresh white jasmine and a few red roses as the only other colour; only animals, birds, plants and buildings; serene, fragrant-looking, precious and South Indian. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 1 of 3 of an animated opening: A wide panel of carved sandalwood filling the whole picture to every edge, carved in relief with a tree of life full of parrots, jasmine creepers and a pair of elephants at its foot; the carving is even across the panel, with no single centre motif, so it can be cut into tall strips anywhere; the top centre is smoother plain polished wood; the lower 38% in deeper shadow. Fully painted to every edge. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: waiting, the app draws nine fine gold strings down the panel at the strip seams and they shimmer as if plucked; opening, the strings sound one after another from the centre out and the strips slide apart sideways, each a beat after the last._

### 31.2 Opening · front · `taar/front.webp`

```text
Mysuru sandalwood carving: scenes carved in deep, intricate relief in honey-gold sandalwood with a soft satin polish, finely undercut leaves, flowers, birds and animals, the carved wood glowing warm against calm areas of smooth plain polished sandalwood and soft cream silk; warm low lamplight from the top left with gentle shadows in the carving; fresh white jasmine and a few red roses as the only other colour; only animals, birds, plants and buildings; serene, fragrant-looking, precious and South Indian. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 2 of 3 of an animated opening, the front: Only framing pieces, each separate with green between them: a carved sandalwood bridge, like the top of a veena's frame, across the top 9% with a carved lotus finial at each end; a matching carved bridge across the bottom 8%. Everything else, including the whole middle, is flat pure #00FF00 green. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: the bridges hold still while the strings shimmer; on opening they slide up and down out of the frame._

### 31.3 Opening · pieces · `taar/pieces.png` (I cut `piece-0` to `piece-5`)

```text
Mysuru sandalwood carving: scenes carved in deep, intricate relief in honey-gold sandalwood with a soft satin polish, finely undercut leaves, flowers, birds and animals, the carved wood glowing warm against calm areas of smooth plain polished sandalwood and soft cream silk; warm low lamplight from the top left with gentle shadows in the carving; fresh white jasmine and a few red roses as the only other colour; only animals, birds, plants and buildings; serene, fragrant-looking, precious and South Indian. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 3 of 3 of an animated opening, the pieces: six separate small things on flat pure #00FF00 green, arranged in a grid of 2 columns and 3 rows, each centred alone in its own cell with wide gaps, none touching another or the edge: a white jasmine flower, a short string of jasmine buds, a red rose petal, a curl of sandalwood shaving, a small carved sandalwood parrot, a small carved sandalwood elephant seen from the side. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: jasmine and wood curls fall through the parting strips._

### 31.4 Centre picture (after the opening) · `chandan/centre.webp`

```text
Mysuru sandalwood carving: scenes carved in deep, intricate relief in honey-gold sandalwood with a soft satin polish, finely undercut leaves, flowers, birds and animals, the carved wood glowing warm against calm areas of smooth plain polished sandalwood and soft cream silk; warm low lamplight from the top left with gentle shadows in the carving; fresh white jasmine and a few red roses as the only other colour; only animals, birds, plants and buildings; serene, fragrant-looking, precious and South Indian. The centre picture of the invitation, shown right after the opening with the couple's names, the invitation line and the date written on it. A carved sandalwood frame seen straight on: a broad frame carved in deep relief with jasmine creepers and parrots, a pair of elephants with raised trunks facing each other at the bottom, a carved arch of leaves with a pair of birds at the top centre, and a garland of fresh jasmine draped across its top corners. Inside the frame, one large empty calm field of smooth plain cream silk, about 66% of the picture's width and from about 26% to 74% of the height: nothing drawn inside it, only the faintest texture. Keep the ornament thin beside that field and put the richest detail at the top and the bottom. Seen perfectly straight-on, centred and symmetrical, with no perspective. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 31.5 Cover (dusk) · `chandan/cover.webp`

```text
Mysuru sandalwood carving: scenes carved in deep, intricate relief in honey-gold sandalwood with a soft satin polish, finely undercut leaves, flowers, birds and animals, the carved wood glowing warm against calm areas of smooth plain polished sandalwood and soft cream silk; warm low lamplight from the top left with gentle shadows in the carving; fresh white jasmine and a few red roses as the only other colour; only animals, birds, plants and buildings; serene, fragrant-looking, precious and South Indian. Two carved sandalwood pillars with fresh jasmine climbing them up the sides, a carved arch of leaves meeting at the top with a pair of parrots, a row of lit brass lamps along the bottom. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 31.6 Family (day) · `chandan/family.webp`

```text
Mysuru sandalwood carving: scenes carved in deep, intricate relief in honey-gold sandalwood with a soft satin polish, finely undercut leaves, flowers, birds and animals, the carved wood glowing warm against calm areas of smooth plain polished sandalwood and soft cream silk; warm low lamplight from the top left with gentle shadows in the carving; fresh white jasmine and a few red roses as the only other colour; only animals, birds, plants and buildings; serene, fragrant-looking, precious and South Indian. A carved courtyard house with a sloping tiled roof, pillars, a swing and cows along the bottom, in honey sandalwood relief; plain polished wood above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 31.7 Haldi (morning) · `chandan/haldi.webp`

```text
Mysuru sandalwood carving: scenes carved in deep, intricate relief in honey-gold sandalwood with a soft satin polish, finely undercut leaves, flowers, birds and animals, the carved wood glowing warm against calm areas of smooth plain polished sandalwood and soft cream silk; warm low lamplight from the top left with gentle shadows in the carving; fresh white jasmine and a few red roses as the only other colour; only animals, birds, plants and buildings; serene, fragrant-looking, precious and South Indian. Carved banana leaves and a mango-leaf toran across the top, brass bowls of turmeric and marigolds on a carved base along the bottom; morning light. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 31.8 Mehendi (day) · `chandan/mehendi.webp`

```text
Mysuru sandalwood carving: scenes carved in deep, intricate relief in honey-gold sandalwood with a soft satin polish, finely undercut leaves, flowers, birds and animals, the carved wood glowing warm against calm areas of smooth plain polished sandalwood and soft cream silk; warm low lamplight from the top left with gentle shadows in the carving; fresh white jasmine and a few red roses as the only other colour; only animals, birds, plants and buildings; serene, fragrant-looking, precious and South Indian. Carved creepers with parrots down both sides, a pair of carved peacocks at the bottom. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 31.9 Sangeet (night) · `chandan/sangeet.webp`

```text
Mysuru sandalwood carving: scenes carved in deep, intricate relief in honey-gold sandalwood with a soft satin polish, finely undercut leaves, flowers, birds and animals, the carved wood glowing warm against calm areas of smooth plain polished sandalwood and soft cream silk; warm low lamplight from the top left with gentle shadows in the carving; fresh white jasmine and a few red roses as the only other colour; only animals, birds, plants and buildings; serene, fragrant-looking, precious and South Indian. A veena, a mridangam and a ghatam resting on a carved platform hung with jasmine strings along the bottom, lamps glowing; plain smooth wood above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 31.10 Baraat (dusk) · `chandan/baraat.webp`

```text
Mysuru sandalwood carving: scenes carved in deep, intricate relief in honey-gold sandalwood with a soft satin polish, finely undercut leaves, flowers, birds and animals, the carved wood glowing warm against calm areas of smooth plain polished sandalwood and soft cream silk; warm low lamplight from the top left with gentle shadows in the carving; fresh white jasmine and a few red roses as the only other colour; only animals, birds, plants and buildings; serene, fragrant-looking, precious and South Indian. A carved procession of elephants with empty canopied howdahs and horses along the bottom, a carved toran across the top. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 31.11 Wedding (dusk) · `chandan/wedding.webp`

```text
Mysuru sandalwood carving: scenes carved in deep, intricate relief in honey-gold sandalwood with a soft satin polish, finely undercut leaves, flowers, birds and animals, the carved wood glowing warm against calm areas of smooth plain polished sandalwood and soft cream silk; warm low lamplight from the top left with gentle shadows in the carving; fresh white jasmine and a few red roses as the only other colour; only animals, birds, plants and buildings; serene, fragrant-looking, precious and South Indian. A carved mandap with banana-stem pillars and a canopy of carved leaves hung with fresh jasmine strings, in the upper half; plain polished wood below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 31.12 Reception (night) · `chandan/reception.webp`

```text
Mysuru sandalwood carving: scenes carved in deep, intricate relief in honey-gold sandalwood with a soft satin polish, finely undercut leaves, flowers, birds and animals, the carved wood glowing warm against calm areas of smooth plain polished sandalwood and soft cream silk; warm low lamplight from the top left with gentle shadows in the carving; fresh white jasmine and a few red roses as the only other colour; only animals, birds, plants and buildings; serene, fragrant-looking, precious and South Indian. A carved palace facade with domes, outlined in tiny warm lights like a palace at night, in the upper half; calm dark wood below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 31.13 Closing page (reply) (night) · `chandan/reply.webp`

```text
Mysuru sandalwood carving: scenes carved in deep, intricate relief in honey-gold sandalwood with a soft satin polish, finely undercut leaves, flowers, birds and animals, the carved wood glowing warm against calm areas of smooth plain polished sandalwood and soft cream silk; warm low lamplight from the top left with gentle shadows in the carving; fresh white jasmine and a few red roses as the only other colour; only animals, birds, plants and buildings; serene, fragrant-looking, precious and South Indian. A tall brass lamp with five flames beside a carved pot of jasmine at the bottom centre; plain polished wood above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 31.14 Photo page · one photo · `chandan/couple.webp`

```text
Mysuru sandalwood carving: scenes carved in deep, intricate relief in honey-gold sandalwood with a soft satin polish, finely undercut leaves, flowers, birds and animals, the carved wood glowing warm against calm areas of smooth plain polished sandalwood and soft cream silk; warm low lamplight from the top left with gentle shadows in the carving; fresh white jasmine and a few red roses as the only other colour; only animals, birds, plants and buildings; serene, fragrant-looking, precious and South Indian. A painting with a soft place for one photo of the couple, on smooth plain cream silk with a warm glow. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: carved jasmine creepers, fresh jasmine strings and small carved parrots drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 50% of the height down, keep the picture calm and empty for the names: smooth plain cream silk with a warm glow. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 31.15 Photo page · two photos · `chandan/couple-two.webp`

```text
Mysuru sandalwood carving: scenes carved in deep, intricate relief in honey-gold sandalwood with a soft satin polish, finely undercut leaves, flowers, birds and animals, the carved wood glowing warm against calm areas of smooth plain polished sandalwood and soft cream silk; warm low lamplight from the top left with gentle shadows in the carving; fresh white jasmine and a few red roses as the only other colour; only animals, birds, plants and buildings; serene, fragrant-looking, precious and South Indian. A painting with soft places for two photos, on smooth plain cream silk with a warm glow. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a slender string of fresh jasmine falls in the gap. Neither has a frame, border, arch, outline or box: carved jasmine creepers, fresh jasmine strings and small carved parrots drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 46% of the height down, keep the picture calm and empty for both names: smooth plain cream silk with a warm glow. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="bundi-chitra"></a>

## 32. Bundi Chitra (बूंदी चित्र)

**Bundi palace murals: turquoise walls, lotus lakes, monsoon gardens, peacocks and hill palaces in flat bright colour.**

- Folder: `public/suites/bundi-chitra/` · Opening: `public/openings/fresh/pratibimb/` (Pratibimb, key #FF00FF magenta)
- Best for: Rajasthani, Hadoti and Marwari families; monsoon and garden weddings · Lettering voice: classic
- The opening: The invitation opens on a reflection in a lotus lake; a ripple runs out, then the view lifts out of the water onto the palace.
- Style lock (already inside every prompt below): Bundi miniature mural painting from the palace Chitrashala of Hadoti: lush monsoon gardens, turquoise and sea-green walls, lakes full of lotuses, banana and mango trees, peacocks, cranes and elephants, palaces with curved roofs climbing the hills, painted in flat, bright opaque colours (turquoise, malachite green, Indian red, saffron and white) with fine dark outlines, gold details and dark monsoon skies streaked with silver rain; joyful, lush and romantic, with large calm areas of flat turquoise or cream wall.

### 32.1 Opening · the reflection · `pratibimb/reflection.webp`

```text
Bundi miniature mural painting from the palace Chitrashala of Hadoti: lush monsoon gardens, turquoise and sea-green walls, lakes full of lotuses, banana and mango trees, peacocks, cranes and elephants, palaces with curved roofs climbing the hills, painted in flat, bright opaque colours (turquoise, malachite green, Indian red, saffron and white) with fine dark outlines, gold details and dark monsoon skies streaked with silver rain; joyful, lush and romantic, with large calm areas of flat turquoise or cream wall. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #FF00FF magenta, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 1 of 3 of an animated opening: A still lotus lake seen from above, filling the whole picture to every edge; in the water, the upside-down reflection of a hill palace with curved roofs, a monsoon sky and flying cranes, painted in slightly softer colours; green lotus pads and pink lotuses floating across it, fewest in the top centre; the lower 38% darker green water. Fully painted to every edge. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: waiting, slow ripples cross the water and the lotus pads bob; opening, a ripple spreads from the centre, then the reflection slides down off the bottom while the centre picture tilts up into view from the top, like lifting your eyes from the water to the palace._

### 32.2 Opening · front · `pratibimb/front.webp`

```text
Bundi miniature mural painting from the palace Chitrashala of Hadoti: lush monsoon gardens, turquoise and sea-green walls, lakes full of lotuses, banana and mango trees, peacocks, cranes and elephants, palaces with curved roofs climbing the hills, painted in flat, bright opaque colours (turquoise, malachite green, Indian red, saffron and white) with fine dark outlines, gold details and dark monsoon skies streaked with silver rain; joyful, lush and romantic, with large calm areas of flat turquoise or cream wall. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #FF00FF magenta, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 2 of 3 of an animated opening, the front: Only framing pieces, each separate with magenta between them: green lotus leaves and pink lotus flowers on tall stems rising from the bottom left and bottom right corners, from 75% of the height to the bottom, each within the outer 25% of the width; a mango branch with leaves reaching in from the top left corner within the outer 25% and the top 15%. Everything else, including the whole middle, is flat pure #FF00FF magenta. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: the lotuses bob; on opening they sink away at the bottom._

### 32.3 Opening · pieces · `pratibimb/pieces.png` (I cut `piece-0` to `piece-5`)

```text
Bundi miniature mural painting from the palace Chitrashala of Hadoti: lush monsoon gardens, turquoise and sea-green walls, lakes full of lotuses, banana and mango trees, peacocks, cranes and elephants, palaces with curved roofs climbing the hills, painted in flat, bright opaque colours (turquoise, malachite green, Indian red, saffron and white) with fine dark outlines, gold details and dark monsoon skies streaked with silver rain; joyful, lush and romantic, with large calm areas of flat turquoise or cream wall. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #FF00FF magenta, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 3 of 3 of an animated opening, the pieces: six separate small things on flat pure #FF00FF magenta, arranged in a grid of 2 columns and 3 rows, each centred alone in its own cell with wide gaps, none touching another or the edge: a pink lotus petal, a small round green lotus pad, a white crane in flight seen from the side, a small silver fish seen from the side, a mango leaf, a solid silver raindrop. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: cranes rise and drops fall as the view lifts._

### 32.4 Centre picture (after the opening) · `bundi-chitra/centre.webp`

```text
Bundi miniature mural painting from the palace Chitrashala of Hadoti: lush monsoon gardens, turquoise and sea-green walls, lakes full of lotuses, banana and mango trees, peacocks, cranes and elephants, palaces with curved roofs climbing the hills, painted in flat, bright opaque colours (turquoise, malachite green, Indian red, saffron and white) with fine dark outlines, gold details and dark monsoon skies streaked with silver rain; joyful, lush and romantic, with large calm areas of flat turquoise or cream wall. The centre picture of the invitation, shown right after the opening with the couple's names, the invitation line and the date written on it. A Bundi palace wall painting seen straight on: a broad painted border of turquoise and Indian red with lotus scrolls, a pair of peacocks on the top corners, banana trees up both sides, and a little curved-roof pavilion under a painted arch at the top centre. Inside the frame, one large empty calm field of flat pale turquoise lime plaster, about 66% of the picture's width and from about 26% to 74% of the height: nothing drawn inside it, only the faintest texture. Keep the ornament thin beside that field and put the richest detail at the top and the bottom. Seen perfectly straight-on, centred and symmetrical, with no perspective. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 32.5 Cover (dusk) · `bundi-chitra/cover.webp`

```text
Bundi miniature mural painting from the palace Chitrashala of Hadoti: lush monsoon gardens, turquoise and sea-green walls, lakes full of lotuses, banana and mango trees, peacocks, cranes and elephants, palaces with curved roofs climbing the hills, painted in flat, bright opaque colours (turquoise, malachite green, Indian red, saffron and white) with fine dark outlines, gold details and dark monsoon skies streaked with silver rain; joyful, lush and romantic, with large calm areas of flat turquoise or cream wall. A hill palace with curved roofs at the top, terraces stepping down to a lotus lake along the bottom, peacocks on the walls; dusk. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 32.6 Family (day) · `bundi-chitra/family.webp`

```text
Bundi miniature mural painting from the palace Chitrashala of Hadoti: lush monsoon gardens, turquoise and sea-green walls, lakes full of lotuses, banana and mango trees, peacocks, cranes and elephants, palaces with curved roofs climbing the hills, painted in flat, bright opaque colours (turquoise, malachite green, Indian red, saffron and white) with fine dark outlines, gold details and dark monsoon skies streaked with silver rain; joyful, lush and romantic, with large calm areas of flat turquoise or cream wall. A garden pavilion by the lake with mango and banana trees, cows by the water and a swing, along the bottom; flat cream wall above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 32.7 Haldi (morning) · `bundi-chitra/haldi.webp`

```text
Bundi miniature mural painting from the palace Chitrashala of Hadoti: lush monsoon gardens, turquoise and sea-green walls, lakes full of lotuses, banana and mango trees, peacocks, cranes and elephants, palaces with curved roofs climbing the hills, painted in flat, bright opaque colours (turquoise, malachite green, Indian red, saffron and white) with fine dark outlines, gold details and dark monsoon skies streaked with silver rain; joyful, lush and romantic, with large calm areas of flat turquoise or cream wall. Morning: a toran of mango leaves and marigolds across the top, golden pots and baskets of turmeric along the bottom, parrots. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 32.8 Mehendi (day) · `bundi-chitra/mehendi.webp`

```text
Bundi miniature mural painting from the palace Chitrashala of Hadoti: lush monsoon gardens, turquoise and sea-green walls, lakes full of lotuses, banana and mango trees, peacocks, cranes and elephants, palaces with curved roofs climbing the hills, painted in flat, bright opaque colours (turquoise, malachite green, Indian red, saffron and white) with fine dark outlines, gold details and dark monsoon skies streaked with silver rain; joyful, lush and romantic, with large calm areas of flat turquoise or cream wall. A monsoon garden: banana trees and creepers up the sides, a swing hung from a mango branch at the top, peacocks dancing along the bottom. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 32.9 Sangeet (night) · `bundi-chitra/sangeet.webp`

```text
Bundi miniature mural painting from the palace Chitrashala of Hadoti: lush monsoon gardens, turquoise and sea-green walls, lakes full of lotuses, banana and mango trees, peacocks, cranes and elephants, palaces with curved roofs climbing the hills, painted in flat, bright opaque colours (turquoise, malachite green, Indian red, saffron and white) with fine dark outlines, gold details and dark monsoon skies streaked with silver rain; joyful, lush and romantic, with large calm areas of flat turquoise or cream wall. Night: a lit terrace along the bottom with instruments on carpets and lamps; flat dark indigo night above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 32.10 Baraat (dusk) · `bundi-chitra/baraat.webp`

```text
Bundi miniature mural painting from the palace Chitrashala of Hadoti: lush monsoon gardens, turquoise and sea-green walls, lakes full of lotuses, banana and mango trees, peacocks, cranes and elephants, palaces with curved roofs climbing the hills, painted in flat, bright opaque colours (turquoise, malachite green, Indian red, saffron and white) with fine dark outlines, gold details and dark monsoon skies streaked with silver rain; joyful, lush and romantic, with large calm areas of flat turquoise or cream wall. A procession of painted elephants with canopies and horses with plumes, with no riders, along the bottom; palace gate and walls small at the top. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 32.11 Wedding (dusk) · `bundi-chitra/wedding.webp`

```text
Bundi miniature mural painting from the palace Chitrashala of Hadoti: lush monsoon gardens, turquoise and sea-green walls, lakes full of lotuses, banana and mango trees, peacocks, cranes and elephants, palaces with curved roofs climbing the hills, painted in flat, bright opaque colours (turquoise, malachite green, Indian red, saffron and white) with fine dark outlines, gold details and dark monsoon skies streaked with silver rain; joyful, lush and romantic, with large calm areas of flat turquoise or cream wall. A lakeside pavilion with a canopy hung with garlands and lamps, in the upper half; flat calm lake water below, with a few lotus pads only at the very bottom edge. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 32.12 Reception (night) · `bundi-chitra/reception.webp`

```text
Bundi miniature mural painting from the palace Chitrashala of Hadoti: lush monsoon gardens, turquoise and sea-green walls, lakes full of lotuses, banana and mango trees, peacocks, cranes and elephants, palaces with curved roofs climbing the hills, painted in flat, bright opaque colours (turquoise, malachite green, Indian red, saffron and white) with fine dark outlines, gold details and dark monsoon skies streaked with silver rain; joyful, lush and romantic, with large calm areas of flat turquoise or cream wall. A hill fort and palace lit with lamps under a starry indigo sky, in the upper half; calm dark lake below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 32.13 Closing page (reply) (night) · `bundi-chitra/reply.webp`

```text
Bundi miniature mural painting from the palace Chitrashala of Hadoti: lush monsoon gardens, turquoise and sea-green walls, lakes full of lotuses, banana and mango trees, peacocks, cranes and elephants, palaces with curved roofs climbing the hills, painted in flat, bright opaque colours (turquoise, malachite green, Indian red, saffron and white) with fine dark outlines, gold details and dark monsoon skies streaked with silver rain; joyful, lush and romantic, with large calm areas of flat turquoise or cream wall. A pair of sarus cranes beside a lotus pond under a small low moon, at the bottom; flat cream wall above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 32.14 Photo page · one photo · `bundi-chitra/couple.webp`

```text
Bundi miniature mural painting from the palace Chitrashala of Hadoti: lush monsoon gardens, turquoise and sea-green walls, lakes full of lotuses, banana and mango trees, peacocks, cranes and elephants, palaces with curved roofs climbing the hills, painted in flat, bright opaque colours (turquoise, malachite green, Indian red, saffron and white) with fine dark outlines, gold details and dark monsoon skies streaked with silver rain; joyful, lush and romantic, with large calm areas of flat turquoise or cream wall. A painting with a soft place for one photo of the couple, on flat pale turquoise lime plaster. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: banana leaves, pink lotuses and mango sprigs drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 50% of the height down, keep the picture calm and empty for the names: flat pale turquoise lime plaster. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 32.15 Photo page · two photos · `bundi-chitra/couple-two.webp`

```text
Bundi miniature mural painting from the palace Chitrashala of Hadoti: lush monsoon gardens, turquoise and sea-green walls, lakes full of lotuses, banana and mango trees, peacocks, cranes and elephants, palaces with curved roofs climbing the hills, painted in flat, bright opaque colours (turquoise, malachite green, Indian red, saffron and white) with fine dark outlines, gold details and dark monsoon skies streaked with silver rain; joyful, lush and romantic, with large calm areas of flat turquoise or cream wall. A painting with soft places for two photos, on flat pale turquoise lime plaster. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a single tall pink lotus on its stem falls in the gap. Neither has a frame, border, arch, outline or box: banana leaves, pink lotuses and mango sprigs drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 46% of the height down, keep the picture calm and empty for both names: flat pale turquoise lime plaster. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="banjara"></a>

## 33. Banjara (బంజారా)

**Banjara embroidery: bold stitches, mirrors, cowries, silver coins and wool pompoms on deep indigo cloth.**

- Folder: `public/suites/banjara/` · Opening: `public/openings/fresh/mohur/` (Mohur, key #00FF00 green)
- Best for: Boho and modern weddings, Telangana and Rajasthani families, sangeet and mehendi-led invites, desert weddings · Lettering voice: playful
- The opening: A great embroidered silver coin spins on its edge, flips, and the guest passes through it.
- Style lock (already inside every prompt below): Banjara (Lambadi) embroidery: thick hand-stitched textile art on dark indigo and black cotton, bold geometric and floral patterns in red, orange, saffron, yellow, white and indigo thread, with small round mirrors, cowrie shells, old silver coins, bright wool pompoms and tassels sewn on; patchwork panels and chain stitch, a rich tactile cloth texture; never bright green thread; bold, joyful, earthy and boho, with large calm areas of plain indigo cloth.

### 33.1 Opening · the coin · `mohur/coin.webp`

```text
Banjara (Lambadi) embroidery: thick hand-stitched textile art on dark indigo and black cotton, bold geometric and floral patterns in red, orange, saffron, yellow, white and indigo thread, with small round mirrors, cowrie shells, old silver coins, bright wool pompoms and tassels sewn on; patchwork panels and chain stitch, a rich tactile cloth texture; never bright green thread; bold, joyful, earthy and boho, with large calm areas of plain indigo cloth. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 1 of 3 of an animated opening: One huge round coin-medallion of hammered old silver, with no lettering, numbers or portrait, its face embossed with a flower in a ring of tiny leaves; its rim edged with a ring of red and yellow chain stitch, small round mirrors and cowrie shells; a red wool tassel hanging below it; the coin is centred across the width at 42% of the height and 84% of the width across. Everything outside the coin and tassel is flat pure #00FF00 green. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: waiting, the coin rocks and its mirrors glint; opening, it spins on its edge faster and faster, flips, then rushes toward the viewer and the guest passes through its centre into the centre picture._

### 33.2 Opening · front · `mohur/front.webp`

```text
Banjara (Lambadi) embroidery: thick hand-stitched textile art on dark indigo and black cotton, bold geometric and floral patterns in red, orange, saffron, yellow, white and indigo thread, with small round mirrors, cowrie shells, old silver coins, bright wool pompoms and tassels sewn on; patchwork panels and chain stitch, a rich tactile cloth texture; never bright green thread; bold, joyful, earthy and boho, with large calm areas of plain indigo cloth. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 2 of 3 of an animated opening, the front: Only framing pieces, each separate with green between them: an embroidered toran with mirrors, tassels and pompoms across the top 14%; at the bottom left and bottom right corners, from 84% of the height to the bottom, a small embroidered potli bag and a stack of silver bangles, within the outer 20% of the width. Everything else, including the whole middle, is flat pure #00FF00 green. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: the tassels swing; on opening the toran lifts away._

### 33.3 Opening · pieces · `mohur/pieces.png` (I cut `piece-0` to `piece-5`)

```text
Banjara (Lambadi) embroidery: thick hand-stitched textile art on dark indigo and black cotton, bold geometric and floral patterns in red, orange, saffron, yellow, white and indigo thread, with small round mirrors, cowrie shells, old silver coins, bright wool pompoms and tassels sewn on; patchwork panels and chain stitch, a rich tactile cloth texture; never bright green thread; bold, joyful, earthy and boho, with large calm areas of plain indigo cloth. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 3 of 3 of an animated opening, the pieces: six separate small things on flat pure #00FF00 green, arranged in a grid of 2 columns and 3 rows, each centred alone in its own cell with wide gaps, none touching another or the edge: a small old silver coin with a flower and no lettering, a cowrie shell, a small round mirror with a stitched edge, a red wool pompom, a yellow tassel, an orange pompom. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: coins and pompoms scatter as the coin spins._

### 33.4 Centre picture (after the opening) · `banjara/centre.webp`

```text
Banjara (Lambadi) embroidery: thick hand-stitched textile art on dark indigo and black cotton, bold geometric and floral patterns in red, orange, saffron, yellow, white and indigo thread, with small round mirrors, cowrie shells, old silver coins, bright wool pompoms and tassels sewn on; patchwork panels and chain stitch, a rich tactile cloth texture; never bright green thread; bold, joyful, earthy and boho, with large calm areas of plain indigo cloth. The centre picture of the invitation, shown right after the opening with the couple's names, the invitation line and the date written on it. A Banjara embroidered wall hanging seen flat: a wide border of patchwork panels in red and saffron chain stitch with mirrors, cowries and silver coins all round, a fringe of wool tassels and pompoms along the bottom edge, and a pair of stitched elephants facing each other at the top centre. Inside the frame, one large empty calm field of plain soft indigo cotton, about 66% of the picture's width and from about 26% to 74% of the height: nothing drawn inside it, only the faintest texture. Keep the ornament thin beside that field and put the richest detail at the top and the bottom. Seen perfectly straight-on, centred and symmetrical, with no perspective. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 33.5 Cover (dusk) · `banjara/cover.webp`

```text
Banjara (Lambadi) embroidery: thick hand-stitched textile art on dark indigo and black cotton, bold geometric and floral patterns in red, orange, saffron, yellow, white and indigo thread, with small round mirrors, cowrie shells, old silver coins, bright wool pompoms and tassels sewn on; patchwork panels and chain stitch, a rich tactile cloth texture; never bright green thread; bold, joyful, earthy and boho, with large calm areas of plain indigo cloth. Embroidered torans with mirrors and pompoms across the top, a desert camp of patchwork tents and camels along the bottom. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 33.6 Family (day) · `banjara/family.webp`

```text
Banjara (Lambadi) embroidery: thick hand-stitched textile art on dark indigo and black cotton, bold geometric and floral patterns in red, orange, saffron, yellow, white and indigo thread, with small round mirrors, cowrie shells, old silver coins, bright wool pompoms and tassels sewn on; patchwork panels and chain stitch, a rich tactile cloth texture; never bright green thread; bold, joyful, earthy and boho, with large calm areas of plain indigo cloth. A Banjara village of round huts with painted walls, a cart and cattle along the bottom, in embroidery; plain indigo above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 33.7 Haldi (morning) · `banjara/haldi.webp`

```text
Banjara (Lambadi) embroidery: thick hand-stitched textile art on dark indigo and black cotton, bold geometric and floral patterns in red, orange, saffron, yellow, white and indigo thread, with small round mirrors, cowrie shells, old silver coins, bright wool pompoms and tassels sewn on; patchwork panels and chain stitch, a rich tactile cloth texture; never bright green thread; bold, joyful, earthy and boho, with large calm areas of plain indigo cloth. Saffron-yellow embroidered marigold garlands across the top and brass pots along the bottom; morning. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 33.8 Mehendi (day) · `banjara/mehendi.webp`

```text
Banjara (Lambadi) embroidery: thick hand-stitched textile art on dark indigo and black cotton, bold geometric and floral patterns in red, orange, saffron, yellow, white and indigo thread, with small round mirrors, cowrie shells, old silver coins, bright wool pompoms and tassels sewn on; patchwork panels and chain stitch, a rich tactile cloth texture; never bright green thread; bold, joyful, earthy and boho, with large calm areas of plain indigo cloth. Mirror-work vines and parrots down both sides. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 33.9 Sangeet (night) · `banjara/sangeet.webp`

```text
Banjara (Lambadi) embroidery: thick hand-stitched textile art on dark indigo and black cotton, bold geometric and floral patterns in red, orange, saffron, yellow, white and indigo thread, with small round mirrors, cowrie shells, old silver coins, bright wool pompoms and tassels sewn on; patchwork panels and chain stitch, a rich tactile cloth texture; never bright green thread; bold, joyful, earthy and boho, with large calm areas of plain indigo cloth. A ring of embroidered lanterns and drums round a small campfire along the bottom; plain night-indigo above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 33.10 Baraat (dusk) · `banjara/baraat.webp`

```text
Banjara (Lambadi) embroidery: thick hand-stitched textile art on dark indigo and black cotton, bold geometric and floral patterns in red, orange, saffron, yellow, white and indigo thread, with small round mirrors, cowrie shells, old silver coins, bright wool pompoms and tassels sewn on; patchwork panels and chain stitch, a rich tactile cloth texture; never bright green thread; bold, joyful, earthy and boho, with large calm areas of plain indigo cloth. Camels and horses with embroidered saddle cloths, tassels and bells, no riders, along the bottom; torans at the top. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 33.11 Wedding (dusk) · `banjara/wedding.webp`

```text
Banjara (Lambadi) embroidery: thick hand-stitched textile art on dark indigo and black cotton, bold geometric and floral patterns in red, orange, saffron, yellow, white and indigo thread, with small round mirrors, cowrie shells, old silver coins, bright wool pompoms and tassels sewn on; patchwork panels and chain stitch, a rich tactile cloth texture; never bright green thread; bold, joyful, earthy and boho, with large calm areas of plain indigo cloth. A canopy of patchwork embroidered cloth on four bamboo poles hung with tassels, mirrors and marigolds, in the upper half; plain indigo below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 33.12 Reception (night) · `banjara/reception.webp`

```text
Banjara (Lambadi) embroidery: thick hand-stitched textile art on dark indigo and black cotton, bold geometric and floral patterns in red, orange, saffron, yellow, white and indigo thread, with small round mirrors, cowrie shells, old silver coins, bright wool pompoms and tassels sewn on; patchwork panels and chain stitch, a rich tactile cloth texture; never bright green thread; bold, joyful, earthy and boho, with large calm areas of plain indigo cloth. A grand embroidered tent glowing from inside, with strings of lanterns, in the upper half; plain indigo below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 33.13 Closing page (reply) (night) · `banjara/reply.webp`

```text
Banjara (Lambadi) embroidery: thick hand-stitched textile art on dark indigo and black cotton, bold geometric and floral patterns in red, orange, saffron, yellow, white and indigo thread, with small round mirrors, cowrie shells, old silver coins, bright wool pompoms and tassels sewn on; patchwork panels and chain stitch, a rich tactile cloth texture; never bright green thread; bold, joyful, earthy and boho, with large calm areas of plain indigo cloth. A pair of embroidered birds on a flowering branch hung with pompoms at the bottom centre; plain indigo above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 33.14 Photo page · one photo · `banjara/couple.webp`

```text
Banjara (Lambadi) embroidery: thick hand-stitched textile art on dark indigo and black cotton, bold geometric and floral patterns in red, orange, saffron, yellow, white and indigo thread, with small round mirrors, cowrie shells, old silver coins, bright wool pompoms and tassels sewn on; patchwork panels and chain stitch, a rich tactile cloth texture; never bright green thread; bold, joyful, earthy and boho, with large calm areas of plain indigo cloth. A painting with a soft place for one photo of the couple, on plain soft indigo cotton. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: mirror-work flowers, cowries, coins and little pompoms drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 50% of the height down, keep the picture calm and empty for the names: plain soft indigo cotton. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 33.15 Photo page · two photos · `banjara/couple-two.webp`

```text
Banjara (Lambadi) embroidery: thick hand-stitched textile art on dark indigo and black cotton, bold geometric and floral patterns in red, orange, saffron, yellow, white and indigo thread, with small round mirrors, cowrie shells, old silver coins, bright wool pompoms and tassels sewn on; patchwork panels and chain stitch, a rich tactile cloth texture; never bright green thread; bold, joyful, earthy and boho, with large calm areas of plain indigo cloth. A painting with soft places for two photos, on plain soft indigo cotton. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a short string of mirrors and a pompom falls in the gap. Neither has a frame, border, arch, outline or box: mirror-work flowers, cowries, coins and little pompoms drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 46% of the height down, keep the picture calm and empty for both names: plain soft indigo cotton. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="leheriya"></a>

## 34. Leheriya (लहरिया)

**Rajasthani leheriya: waves of rani pink, saffron and turquoise flowing across silk, round sunny havelis, swings and kites.**

- Folder: `public/suites/leheriya/` · Opening: `public/openings/fresh/gathbandhan/` (Gathbandhan, key #00FF00 green)
- Best for: Rajasthani and Marwari families, Teej and monsoon weddings, haldi and mehendi-led invites, young couples · Lettering voice: playful
- The opening: Two leheriya dupattas sweep in from the sides, tie a knot in the middle and rise away together like a banner.
- Style lock (already inside every prompt below): Rajasthani leheriya tie-dye: soft diagonal waves of colour in fine stripes (rani pink, saffron, sunshine yellow, coral and turquoise) flowing across silk and chiffon, with gold gota ribbon borders and small mirror sequins; the scenes painted like soft watercolour of Rajasthan (havelis, jharokhas, swings, kites and peacocks) seen through and round the flowing cloth; leaves in olive, never bright green; breezy, sunny, festive and young, with large calm areas of plain pastel cloth.

### 34.1 Opening · the two dupattas · `gathbandhan/dupatta.webp`

```text
Rajasthani leheriya tie-dye: soft diagonal waves of colour in fine stripes (rani pink, saffron, sunshine yellow, coral and turquoise) flowing across silk and chiffon, with gold gota ribbon borders and small mirror sequins; the scenes painted like soft watercolour of Rajasthan (havelis, jharokhas, swings, kites and peacocks) seen through and round the flowing cloth; leaves in olive, never bright green; breezy, sunny, festive and young, with large calm areas of plain pastel cloth. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 1 of 3 of an animated opening: A length of silk chiffon filling the whole picture to every edge, dyed in leheriya: the left half in fine diagonal waves of rani pink and coral, the right half in fine diagonal waves of saffron and sunshine yellow, the two halves meeting softly in a vertical line at the centre; gold gota borders down the outer left and right edges; soft folds; the lower 38% in a deeper shade. Fully painted to every edge. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: waiting, the two halves ripple in a breeze; opening, the halves sweep to the centre and twist into the knot (a piece), then the knotted cloth flies up off the top like a banner._

### 34.2 Opening · front · `gathbandhan/front.webp`

```text
Rajasthani leheriya tie-dye: soft diagonal waves of colour in fine stripes (rani pink, saffron, sunshine yellow, coral and turquoise) flowing across silk and chiffon, with gold gota ribbon borders and small mirror sequins; the scenes painted like soft watercolour of Rajasthan (havelis, jharokhas, swings, kites and peacocks) seen through and round the flowing cloth; leaves in olive, never bright green; breezy, sunny, festive and young, with large calm areas of plain pastel cloth. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 2 of 3 of an animated opening, the front: Only framing pieces, each separate with green between them: strings of tiny brass bells and gold gota tassels hanging from the top edge across the top 12%; at the bottom left and bottom right corners, from 84% of the height to the bottom, a brass pot of marigolds within the outer 20% of the width. Everything else, including the whole middle, is flat pure #00FF00 green. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: the bells and tassels swing; on opening they lift away._

### 34.3 Opening · pieces · `gathbandhan/pieces.png` (I cut `piece-0` to `piece-5`)

```text
Rajasthani leheriya tie-dye: soft diagonal waves of colour in fine stripes (rani pink, saffron, sunshine yellow, coral and turquoise) flowing across silk and chiffon, with gold gota ribbon borders and small mirror sequins; the scenes painted like soft watercolour of Rajasthan (havelis, jharokhas, swings, kites and peacocks) seen through and round the flowing cloth; leaves in olive, never bright green; breezy, sunny, festive and young, with large calm areas of plain pastel cloth. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 3 of 3 of an animated opening, the pieces: six separate small things on flat pure #00FF00 green, arranged in a grid of 2 columns and 3 rows, each centred alone in its own cell with wide gaps, none touching another or the edge: a large knot of pink and saffron silk dupattas tied together with two short tails, a gold gota ribbon flower, an orange marigold, a pink rose petal, a small mirror sequin, a tiny brass bell. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: petals and sequins fly as the knot is tied._

### 34.4 Centre picture (after the opening) · `leheriya/centre.webp`

```text
Rajasthani leheriya tie-dye: soft diagonal waves of colour in fine stripes (rani pink, saffron, sunshine yellow, coral and turquoise) flowing across silk and chiffon, with gold gota ribbon borders and small mirror sequins; the scenes painted like soft watercolour of Rajasthan (havelis, jharokhas, swings, kites and peacocks) seen through and round the flowing cloth; leaves in olive, never bright green; breezy, sunny, festive and young, with large calm areas of plain pastel cloth. The centre picture of the invitation, shown right after the opening with the couple's names, the invitation line and the date written on it. A leheriya dupatta spread flat: a wide border band of leheriya waves in rani pink and saffron edged with gold gota ribbon flowers and tiny mirrors all round, and a pair of parrots on a little swing hanging from the top border at the centre. Inside the frame, one large empty calm field of plain soft blush chiffon with a very faint wave texture, about 66% of the picture's width and from about 26% to 74% of the height: nothing drawn inside it, only the faintest texture. Keep the ornament thin beside that field and put the richest detail at the top and the bottom. Seen perfectly straight-on, centred and symmetrical, with no perspective. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 34.5 Cover (dusk) · `leheriya/cover.webp`

```text
Rajasthani leheriya tie-dye: soft diagonal waves of colour in fine stripes (rani pink, saffron, sunshine yellow, coral and turquoise) flowing across silk and chiffon, with gold gota ribbon borders and small mirror sequins; the scenes painted like soft watercolour of Rajasthan (havelis, jharokhas, swings, kites and peacocks) seen through and round the flowing cloth; leaves in olive, never bright green; breezy, sunny, festive and young, with large calm areas of plain pastel cloth. Two leheriya canopies in rani pink and saffron draped across the top, haveli rooftops with kites flying small along the bottom. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 34.6 Family (day) · `leheriya/family.webp`

```text
Rajasthani leheriya tie-dye: soft diagonal waves of colour in fine stripes (rani pink, saffron, sunshine yellow, coral and turquoise) flowing across silk and chiffon, with gold gota ribbon borders and small mirror sequins; the scenes painted like soft watercolour of Rajasthan (havelis, jharokhas, swings, kites and peacocks) seen through and round the flowing cloth; leaves in olive, never bright green; breezy, sunny, festive and young, with large calm areas of plain pastel cloth. A sunny haveli courtyard with a neem tree, a swing and pots of bougainvillea along the bottom; plain pastel cloth above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 34.7 Haldi (morning) · `leheriya/haldi.webp`

```text
Rajasthani leheriya tie-dye: soft diagonal waves of colour in fine stripes (rani pink, saffron, sunshine yellow, coral and turquoise) flowing across silk and chiffon, with gold gota ribbon borders and small mirror sequins; the scenes painted like soft watercolour of Rajasthan (havelis, jharokhas, swings, kites and peacocks) seen through and round the flowing cloth; leaves in olive, never bright green; breezy, sunny, festive and young, with large calm areas of plain pastel cloth. Yellow leheriya drapes across the top with marigold strings, brass urns of turmeric along the bottom. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 34.8 Mehendi (day) · `leheriya/mehendi.webp`

```text
Rajasthani leheriya tie-dye: soft diagonal waves of colour in fine stripes (rani pink, saffron, sunshine yellow, coral and turquoise) flowing across silk and chiffon, with gold gota ribbon borders and small mirror sequins; the scenes painted like soft watercolour of Rajasthan (havelis, jharokhas, swings, kites and peacocks) seen through and round the flowing cloth; leaves in olive, never bright green; breezy, sunny, festive and young, with large calm areas of plain pastel cloth. Turquoise and saffron leheriya drapes down both sides, a swing on a mango tree, parrots. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 34.9 Sangeet (night) · `leheriya/sangeet.webp`

```text
Rajasthani leheriya tie-dye: soft diagonal waves of colour in fine stripes (rani pink, saffron, sunshine yellow, coral and turquoise) flowing across silk and chiffon, with gold gota ribbon borders and small mirror sequins; the scenes painted like soft watercolour of Rajasthan (havelis, jharokhas, swings, kites and peacocks) seen through and round the flowing cloth; leaves in olive, never bright green; breezy, sunny, festive and young, with large calm areas of plain pastel cloth. A rooftop at dusk with leheriya canopies, lanterns and a dholak along the bottom; plain soft sky above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 34.10 Baraat (dusk) · `leheriya/baraat.webp`

```text
Rajasthani leheriya tie-dye: soft diagonal waves of colour in fine stripes (rani pink, saffron, sunshine yellow, coral and turquoise) flowing across silk and chiffon, with gold gota ribbon borders and small mirror sequins; the scenes painted like soft watercolour of Rajasthan (havelis, jharokhas, swings, kites and peacocks) seen through and round the flowing cloth; leaves in olive, never bright green; breezy, sunny, festive and young, with large calm areas of plain pastel cloth. Decorated camels and horses with leheriya saddle cloths and pompoms, no riders, along the bottom; leheriya bunting across the top. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 34.11 Wedding (dusk) · `leheriya/wedding.webp`

```text
Rajasthani leheriya tie-dye: soft diagonal waves of colour in fine stripes (rani pink, saffron, sunshine yellow, coral and turquoise) flowing across silk and chiffon, with gold gota ribbon borders and small mirror sequins; the scenes painted like soft watercolour of Rajasthan (havelis, jharokhas, swings, kites and peacocks) seen through and round the flowing cloth; leaves in olive, never bright green; breezy, sunny, festive and young, with large calm areas of plain pastel cloth. A mandap with leheriya canopies in rani pink and saffron, marigold strings and a small fire bowl, in the upper half; plain cloth below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 34.12 Reception (night) · `leheriya/reception.webp`

```text
Rajasthani leheriya tie-dye: soft diagonal waves of colour in fine stripes (rani pink, saffron, sunshine yellow, coral and turquoise) flowing across silk and chiffon, with gold gota ribbon borders and small mirror sequins; the scenes painted like soft watercolour of Rajasthan (havelis, jharokhas, swings, kites and peacocks) seen through and round the flowing cloth; leaves in olive, never bright green; breezy, sunny, festive and young, with large calm areas of plain pastel cloth. A haveli courtyard at night lit with lanterns and fairy lights under leheriya canopies, in the upper half; plain cloth below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 34.13 Closing page (reply) (night) · `leheriya/reply.webp`

```text
Rajasthani leheriya tie-dye: soft diagonal waves of colour in fine stripes (rani pink, saffron, sunshine yellow, coral and turquoise) flowing across silk and chiffon, with gold gota ribbon borders and small mirror sequins; the scenes painted like soft watercolour of Rajasthan (havelis, jharokhas, swings, kites and peacocks) seen through and round the flowing cloth; leaves in olive, never bright green; breezy, sunny, festive and young, with large calm areas of plain pastel cloth. A swing with a leheriya cushion and marigolds at the bottom centre; plain pastel cloth above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 34.14 Photo page · one photo · `leheriya/couple.webp`

```text
Rajasthani leheriya tie-dye: soft diagonal waves of colour in fine stripes (rani pink, saffron, sunshine yellow, coral and turquoise) flowing across silk and chiffon, with gold gota ribbon borders and small mirror sequins; the scenes painted like soft watercolour of Rajasthan (havelis, jharokhas, swings, kites and peacocks) seen through and round the flowing cloth; leaves in olive, never bright green; breezy, sunny, festive and young, with large calm areas of plain pastel cloth. A painting with a soft place for one photo of the couple, on plain soft blush chiffon. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: leheriya ribbons, gota flowers and marigolds drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 50% of the height down, keep the picture calm and empty for the names: plain soft blush chiffon. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 34.15 Photo page · two photos · `leheriya/couple-two.webp`

```text
Rajasthani leheriya tie-dye: soft diagonal waves of colour in fine stripes (rani pink, saffron, sunshine yellow, coral and turquoise) flowing across silk and chiffon, with gold gota ribbon borders and small mirror sequins; the scenes painted like soft watercolour of Rajasthan (havelis, jharokhas, swings, kites and peacocks) seen through and round the flowing cloth; leaves in olive, never bright green; breezy, sunny, festive and young, with large calm areas of plain pastel cloth. A painting with soft places for two photos, on plain soft blush chiffon. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a short twist of pink and saffron leheriya ribbon falls in the gap. Neither has a frame, border, arch, outline or box: leheriya ribbons, gota flowers and marigolds drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 46% of the height down, keep the picture calm and empty for both names: plain soft blush chiffon. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="nirmal"></a>

## 35. Nirmal (నిర్మల్)

**Nirmal lacquer painting from Telangana: gold leaf and soft colours shimmering on glossy black.**

- Folder: `public/suites/nirmal/` · Opening: `public/openings/fresh/phuljhadi/` (Phuljhadi, key #FF00FF magenta)
- Best for: Telugu weddings, Hyderabad and Telangana families, evening weddings and receptions · Lettering voice: classic
- The opening: A sparkler draws a ring of golden light round the names; the ring flares and opens the black lacquer like an iris.
- Style lock (already inside every prompt below): Nirmal painting from Telangana: glossy black lacquered wood with scenes painted in rich gold leaf and soft natural colours (ivory, deep red, sage and ochre), fine Deccani flowers, birds, deer, palaces and trees, gold highlights shimmering on the deep black ground, a smooth varnished lacquer sheen; elegant, rich and dramatic, with large calm areas of plain glossy black.

### 35.1 Opening · the lacquer panel · `phuljhadi/lacquer.webp`

```text
Nirmal painting from Telangana: glossy black lacquered wood with scenes painted in rich gold leaf and soft natural colours (ivory, deep red, sage and ochre), fine Deccani flowers, birds, deer, palaces and trees, gold highlights shimmering on the deep black ground, a smooth varnished lacquer sheen; elegant, rich and dramatic, with large calm areas of plain glossy black. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #FF00FF magenta, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 1 of 3 of an animated opening: A panel of glossy black lacquer filling the whole picture to every edge, painted in gold leaf with a wide wreath of flowers, birds and leaves in a ring round a plain black middle; the ring is centred across the width at 42% of the height, its inner edge about 60% of the width across; gold flowering vines in the four corners; the lower 38% plain black with only faint gold. Fully painted to every edge. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: waiting, the app runs a sparkler's spark round the gold ring, leaving a fading trail of light; opening, the ring of light flares and widens like an iris from the centre, opening the lacquer onto the centre picture as sparks (pieces) shoot out._

### 35.2 Opening · front · `phuljhadi/front.webp`

```text
Nirmal painting from Telangana: glossy black lacquered wood with scenes painted in rich gold leaf and soft natural colours (ivory, deep red, sage and ochre), fine Deccani flowers, birds, deer, palaces and trees, gold highlights shimmering on the deep black ground, a smooth varnished lacquer sheen; elegant, rich and dramatic, with large calm areas of plain glossy black. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #FF00FF magenta, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 2 of 3 of an animated opening, the front: Only framing pieces, each separate with magenta between them: slim gold-on-black painted vine borders down the far left and far right edges, each within the outer 8% of the width and the full height; a lit hanging brass lamp from the top at the left and the right, within the outer 20% and the top 15%. Everything else, including the whole middle, is flat pure #FF00FF magenta. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: the lamps sway and flicker; on opening the borders slide out._

### 35.3 Opening · pieces · `phuljhadi/pieces.png` (I cut `piece-0` to `piece-5`)

```text
Nirmal painting from Telangana: glossy black lacquered wood with scenes painted in rich gold leaf and soft natural colours (ivory, deep red, sage and ochre), fine Deccani flowers, birds, deer, palaces and trees, gold highlights shimmering on the deep black ground, a smooth varnished lacquer sheen; elegant, rich and dramatic, with large calm areas of plain glossy black. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #FF00FF magenta, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 3 of 3 of an animated opening, the pieces: six separate small things on flat pure #FF00FF magenta, arranged in a grid of 2 columns and 3 rows, each centred alone in its own cell with wide gaps, none touching another or the edge: a solid gold six-pointed spark with no glow, a small solid gold star spark, a flake of gold leaf, a deep red rose, an ivory jasmine flower, a small gold flower. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: sparks and flowers burst out as the ring flares._

### 35.4 Centre picture (after the opening) · `nirmal/centre.webp`

```text
Nirmal painting from Telangana: glossy black lacquered wood with scenes painted in rich gold leaf and soft natural colours (ivory, deep red, sage and ochre), fine Deccani flowers, birds, deer, palaces and trees, gold highlights shimmering on the deep black ground, a smooth varnished lacquer sheen; elegant, rich and dramatic, with large calm areas of plain glossy black. The centre picture of the invitation, shown right after the opening with the couple's names, the invitation line and the date written on it. A Nirmal lacquer panel seen straight on: glossy black, with a broad gold-leaf border of flowering creepers and birds, a pair of deer at the bottom corners, and a gold arch with a small painted palace at the top centre. Inside the frame, one large empty calm field of plain glossy black lacquer, about 66% of the picture's width and from about 26% to 74% of the height: nothing drawn inside it, only the faintest texture. Keep the ornament thin beside that field and put the richest detail at the top and the bottom. Seen perfectly straight-on, centred and symmetrical, with no perspective. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 35.5 Cover (dusk) · `nirmal/cover.webp`

```text
Nirmal painting from Telangana: glossy black lacquered wood with scenes painted in rich gold leaf and soft natural colours (ivory, deep red, sage and ochre), fine Deccani flowers, birds, deer, palaces and trees, gold highlights shimmering on the deep black ground, a smooth varnished lacquer sheen; elegant, rich and dramatic, with large calm areas of plain glossy black. Gold trees with birds rising up the sides and meeting in an arch at the top, a lake with a gold palace along the bottom, on black. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 35.6 Family (day) · `nirmal/family.webp`

```text
Nirmal painting from Telangana: glossy black lacquered wood with scenes painted in rich gold leaf and soft natural colours (ivory, deep red, sage and ochre), fine Deccani flowers, birds, deer, palaces and trees, gold highlights shimmering on the deep black ground, a smooth varnished lacquer sheen; elegant, rich and dramatic, with large calm areas of plain glossy black. A gold-painted village of tiled houses with palms and cows along the bottom; plain black above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 35.7 Haldi (morning) · `nirmal/haldi.webp`

```text
Nirmal painting from Telangana: glossy black lacquered wood with scenes painted in rich gold leaf and soft natural colours (ivory, deep red, sage and ochre), fine Deccani flowers, birds, deer, palaces and trees, gold highlights shimmering on the deep black ground, a smooth varnished lacquer sheen; elegant, rich and dramatic, with large calm areas of plain glossy black. Gold and saffron marigold garlands across the top, turmeric pots along the bottom, a morning gold glow. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 35.8 Mehendi (day) · `nirmal/mehendi.webp`

```text
Nirmal painting from Telangana: glossy black lacquered wood with scenes painted in rich gold leaf and soft natural colours (ivory, deep red, sage and ochre), fine Deccani flowers, birds, deer, palaces and trees, gold highlights shimmering on the deep black ground, a smooth varnished lacquer sheen; elegant, rich and dramatic, with large calm areas of plain glossy black. Gold creepers with sage leaves and parrots down both sides. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 35.9 Sangeet (night) · `nirmal/sangeet.webp`

```text
Nirmal painting from Telangana: glossy black lacquered wood with scenes painted in rich gold leaf and soft natural colours (ivory, deep red, sage and ochre), fine Deccani flowers, birds, deer, palaces and trees, gold highlights shimmering on the deep black ground, a smooth varnished lacquer sheen; elegant, rich and dramatic, with large calm areas of plain glossy black. A gold veena, mridangam and tabla with lamps along the bottom; plain black above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 35.10 Baraat (dusk) · `nirmal/baraat.webp`

```text
Nirmal painting from Telangana: glossy black lacquered wood with scenes painted in rich gold leaf and soft natural colours (ivory, deep red, sage and ochre), fine Deccani flowers, birds, deer, palaces and trees, gold highlights shimmering on the deep black ground, a smooth varnished lacquer sheen; elegant, rich and dramatic, with large calm areas of plain glossy black. Gold elephants and horses with canopies, no riders, along the bottom; a gold toran across the top. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 35.11 Wedding (dusk) · `nirmal/wedding.webp`

```text
Nirmal painting from Telangana: glossy black lacquered wood with scenes painted in rich gold leaf and soft natural colours (ivory, deep red, sage and ochre), fine Deccani flowers, birds, deer, palaces and trees, gold highlights shimmering on the deep black ground, a smooth varnished lacquer sheen; elegant, rich and dramatic, with large calm areas of plain glossy black. A gold mandap with banana-stem pillars and jasmine strings, in the upper half; plain black below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 35.12 Reception (night) · `nirmal/reception.webp`

```text
Nirmal painting from Telangana: glossy black lacquered wood with scenes painted in rich gold leaf and soft natural colours (ivory, deep red, sage and ochre), fine Deccani flowers, birds, deer, palaces and trees, gold highlights shimmering on the deep black ground, a smooth varnished lacquer sheen; elegant, rich and dramatic, with large calm areas of plain glossy black. A gold palace with lit windows under small gold stars, in the upper half; plain black below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 35.13 Closing page (reply) (night) · `nirmal/reply.webp`

```text
Nirmal painting from Telangana: glossy black lacquered wood with scenes painted in rich gold leaf and soft natural colours (ivory, deep red, sage and ochre), fine Deccani flowers, birds, deer, palaces and trees, gold highlights shimmering on the deep black ground, a smooth varnished lacquer sheen; elegant, rich and dramatic, with large calm areas of plain glossy black. A pair of gold deer under a flowering tree at the bottom centre; plain black above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 35.14 Photo page · one photo · `nirmal/couple.webp`

```text
Nirmal painting from Telangana: glossy black lacquered wood with scenes painted in rich gold leaf and soft natural colours (ivory, deep red, sage and ochre), fine Deccani flowers, birds, deer, palaces and trees, gold highlights shimmering on the deep black ground, a smooth varnished lacquer sheen; elegant, rich and dramatic, with large calm areas of plain glossy black. A painting with a soft place for one photo of the couple, on plain glossy black lacquer. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: gold-leaf creepers, small gold birds and red roses drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 50% of the height down, keep the picture calm and empty for the names: plain glossy black lacquer. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 35.15 Photo page · two photos · `nirmal/couple-two.webp`

```text
Nirmal painting from Telangana: glossy black lacquered wood with scenes painted in rich gold leaf and soft natural colours (ivory, deep red, sage and ochre), fine Deccani flowers, birds, deer, palaces and trees, gold highlights shimmering on the deep black ground, a smooth varnished lacquer sheen; elegant, rich and dramatic, with large calm areas of plain glossy black. A painting with soft places for two photos, on plain glossy black lacquer. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a slim gold vine with a tiny pair of birds falls in the gap. Neither has a frame, border, arch, outline or box: gold-leaf creepers, small gold birds and red roses drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 46% of the height down, keep the picture calm and empty for both names: plain glossy black lacquer. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="shola"></a>

## 36. Shola (শোলা)

**Bengal sholapith: snow-white carved pith flowers, frills and birds glowing on deep alta red and dusk blue.**

- Folder: `public/suites/shola/` · Opening: `public/openings/fresh/semal/` (Semal, key #FF00FF magenta)
- Best for: Bengali, Odia and Assamese weddings · Lettering voice: classic
- The opening: The pods of a silk-cotton tree split and white floss bursts out, swirling away on the breeze and clearing the screen.
- Style lock (already inside every prompt below): Bengal sholapith craft: delicate snow-white sculptures cut and carved from the soft pith of the shola plant, layered petals, lace-like cut work, tiny curled spirals and frills, accented with fine gold and vermilion paper, set against soft deep backgrounds of alta red, dusky rose or dusk blue; soft light from the top left giving the white pith a velvety glow; only flowers, birds, boats, trees and buildings; pure, festive and Bengali, with large calm areas of plain background.

### 36.1 Opening · the semal branches · `semal/pods.webp`

```text
Bengal sholapith craft: delicate snow-white sculptures cut and carved from the soft pith of the shola plant, layered petals, lace-like cut work, tiny curled spirals and frills, accented with fine gold and vermilion paper, set against soft deep backgrounds of alta red, dusky rose or dusk blue; soft light from the top left giving the white pith a velvety glow; only flowers, birds, boats, trees and buildings; pure, festive and Bengali, with large calm areas of plain background. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #FF00FF magenta, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 1 of 3 of an animated opening: Dense branches of a silk-cotton (semal) tree filling the whole picture to every edge, made in sholapith style: dark red-brown branches with dozens of split seed pods, each spilling soft white floss, and a few red semal flowers; the floss and pods thinner in the top centre; the lower 38% darker, mostly branches in shadow. Fully painted to every edge. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: waiting, a few floss tufts drift up; opening, the app breaks the picture into soft puffs of floss that whirl up and away on a breeze, from the centre out._

### 36.2 Opening · front · `semal/front.webp`

```text
Bengal sholapith craft: delicate snow-white sculptures cut and carved from the soft pith of the shola plant, layered petals, lace-like cut work, tiny curled spirals and frills, accented with fine gold and vermilion paper, set against soft deep backgrounds of alta red, dusky rose or dusk blue; soft light from the top left giving the white pith a velvety glow; only flowers, birds, boats, trees and buildings; pure, festive and Bengali, with large calm areas of plain background. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #FF00FF magenta, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 2 of 3 of an animated opening, the front: Only framing pieces, each separate with magenta between them: white sholapith flower garlands with red centres hanging from the top edge across the top 12%; at the bottom left and bottom right corners, from 84% of the height to the bottom, a bunch of red-and-white sholapith lotuses within the outer 20% of the width. Everything else, including the whole middle, is flat pure #FF00FF magenta. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: the garlands sway; on opening they lift away._

### 36.3 Opening · pieces · `semal/pieces.png` (I cut `piece-0` to `piece-5`)

```text
Bengal sholapith craft: delicate snow-white sculptures cut and carved from the soft pith of the shola plant, layered petals, lace-like cut work, tiny curled spirals and frills, accented with fine gold and vermilion paper, set against soft deep backgrounds of alta red, dusky rose or dusk blue; soft light from the top left giving the white pith a velvety glow; only flowers, birds, boats, trees and buildings; pure, festive and Bengali, with large calm areas of plain background. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #FF00FF magenta, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 3 of 3 of an animated opening, the pieces: six separate small things on flat pure #FF00FF magenta, arranged in a grid of 2 columns and 3 rows, each centred alone in its own cell with wide gaps, none touching another or the edge: a tuft of white floss (solid, not see-through), a seed with a floss tail, a red semal flower, a white sholapith flower, a curl of sholapith, a small gold paper leaf. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: floss and seeds float up across the whole screen._

### 36.4 Centre picture (after the opening) · `shola/centre.webp`

```text
Bengal sholapith craft: delicate snow-white sculptures cut and carved from the soft pith of the shola plant, layered petals, lace-like cut work, tiny curled spirals and frills, accented with fine gold and vermilion paper, set against soft deep backgrounds of alta red, dusky rose or dusk blue; soft light from the top left giving the white pith a velvety glow; only flowers, birds, boats, trees and buildings; pure, festive and Bengali, with large calm areas of plain background. The centre picture of the invitation, shown right after the opening with the couple's names, the invitation line and the date written on it. A sholapith frame on deep alta red: a wide border of white carved sholapith flowers, lace-like leaves and curling tendrils all round, a pair of white sholapith peacocks facing each other at the top centre, and a fringe of tiny white pith beads along the bottom. Inside the frame, one large empty calm field of plain deep alta-red paper with a velvety finish, about 66% of the picture's width and from about 26% to 74% of the height: nothing drawn inside it, only the faintest texture. Keep the ornament thin beside that field and put the richest detail at the top and the bottom. Seen perfectly straight-on, centred and symmetrical, with no perspective. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 36.5 Cover (dusk) · `shola/cover.webp`

```text
Bengal sholapith craft: delicate snow-white sculptures cut and carved from the soft pith of the shola plant, layered petals, lace-like cut work, tiny curled spirals and frills, accented with fine gold and vermilion paper, set against soft deep backgrounds of alta red, dusky rose or dusk blue; soft light from the top left giving the white pith a velvety glow; only flowers, birds, boats, trees and buildings; pure, festive and Bengali, with large calm areas of plain background. A white sholapith arch of flowers and frills across the top, a lake with white lotuses and a little boat along the bottom, on deep red. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 36.6 Family (day) · `shola/family.webp`

```text
Bengal sholapith craft: delicate snow-white sculptures cut and carved from the soft pith of the shola plant, layered petals, lace-like cut work, tiny curled spirals and frills, accented with fine gold and vermilion paper, set against soft deep backgrounds of alta red, dusky rose or dusk blue; soft light from the top left giving the white pith a velvety glow; only flowers, birds, boats, trees and buildings; pure, festive and Bengali, with large calm areas of plain background. A white sholapith village house with a curved thatched roof, banana and coconut trees and a pond along the bottom; plain dusk blue above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 36.7 Haldi (morning) · `shola/haldi.webp`

```text
Bengal sholapith craft: delicate snow-white sculptures cut and carved from the soft pith of the shola plant, layered petals, lace-like cut work, tiny curled spirals and frills, accented with fine gold and vermilion paper, set against soft deep backgrounds of alta red, dusky rose or dusk blue; soft light from the top left giving the white pith a velvety glow; only flowers, birds, boats, trees and buildings; pure, festive and Bengali, with large calm areas of plain background. Morning, on turmeric yellow: white sholapith garlands across the top, sholapith bowls and flowers along the bottom. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 36.8 Mehendi (day) · `shola/mehendi.webp`

```text
Bengal sholapith craft: delicate snow-white sculptures cut and carved from the soft pith of the shola plant, layered petals, lace-like cut work, tiny curled spirals and frills, accented with fine gold and vermilion paper, set against soft deep backgrounds of alta red, dusky rose or dusk blue; soft light from the top left giving the white pith a velvety glow; only flowers, birds, boats, trees and buildings; pure, festive and Bengali, with large calm areas of plain background. On dusky rose: white sholapith creepers with leaves and parrots down both sides. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 36.9 Sangeet (night) · `shola/sangeet.webp`

```text
Bengal sholapith craft: delicate snow-white sculptures cut and carved from the soft pith of the shola plant, layered petals, lace-like cut work, tiny curled spirals and frills, accented with fine gold and vermilion paper, set against soft deep backgrounds of alta red, dusky rose or dusk blue; soft light from the top left giving the white pith a velvety glow; only flowers, birds, boats, trees and buildings; pure, festive and Bengali, with large calm areas of plain background. White sholapith instruments (a harmonium, a dhol and an ektara) with lamps along the bottom; plain dusk blue above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 36.10 Baraat (dusk) · `shola/baraat.webp`

```text
Bengal sholapith craft: delicate snow-white sculptures cut and carved from the soft pith of the shola plant, layered petals, lace-like cut work, tiny curled spirals and frills, accented with fine gold and vermilion paper, set against soft deep backgrounds of alta red, dusky rose or dusk blue; soft light from the top left giving the white pith a velvety glow; only flowers, birds, boats, trees and buildings; pure, festive and Bengali, with large calm areas of plain background. An empty decorated palanquin and a horse with a canopy, in white sholapith, along the bottom; a sholapith garland across the top. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 36.11 Wedding (dusk) · `shola/wedding.webp`

```text
Bengal sholapith craft: delicate snow-white sculptures cut and carved from the soft pith of the shola plant, layered petals, lace-like cut work, tiny curled spirals and frills, accented with fine gold and vermilion paper, set against soft deep backgrounds of alta red, dusky rose or dusk blue; soft light from the top left giving the white pith a velvety glow; only flowers, birds, boats, trees and buildings; pure, festive and Bengali, with large calm areas of plain background. A white sholapith wedding canopy on four banana-trunk pillars with garlands and lamps, in the upper half; plain red below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 36.12 Reception (night) · `shola/reception.webp`

```text
Bengal sholapith craft: delicate snow-white sculptures cut and carved from the soft pith of the shola plant, layered petals, lace-like cut work, tiny curled spirals and frills, accented with fine gold and vermilion paper, set against soft deep backgrounds of alta red, dusky rose or dusk blue; soft light from the top left giving the white pith a velvety glow; only flowers, birds, boats, trees and buildings; pure, festive and Bengali, with large calm areas of plain background. A white sholapith mansion facade lit with lamps, in the upper half; plain dusk blue below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 36.13 Closing page (reply) (night) · `shola/reply.webp`

```text
Bengal sholapith craft: delicate snow-white sculptures cut and carved from the soft pith of the shola plant, layered petals, lace-like cut work, tiny curled spirals and frills, accented with fine gold and vermilion paper, set against soft deep backgrounds of alta red, dusky rose or dusk blue; soft light from the top left giving the white pith a velvety glow; only flowers, birds, boats, trees and buildings; pure, festive and Bengali, with large calm areas of plain background. A white sholapith tree with a pair of birds at the bottom centre; plain red above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 36.14 Photo page · one photo · `shola/couple.webp`

```text
Bengal sholapith craft: delicate snow-white sculptures cut and carved from the soft pith of the shola plant, layered petals, lace-like cut work, tiny curled spirals and frills, accented with fine gold and vermilion paper, set against soft deep backgrounds of alta red, dusky rose or dusk blue; soft light from the top left giving the white pith a velvety glow; only flowers, birds, boats, trees and buildings; pure, festive and Bengali, with large calm areas of plain background. A painting with a soft place for one photo of the couple, on plain deep alta-red paper. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: white sholapith flowers, frills and tendrils drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 50% of the height down, keep the picture calm and empty for the names: plain deep alta-red paper. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 36.15 Photo page · two photos · `shola/couple-two.webp`

```text
Bengal sholapith craft: delicate snow-white sculptures cut and carved from the soft pith of the shola plant, layered petals, lace-like cut work, tiny curled spirals and frills, accented with fine gold and vermilion paper, set against soft deep backgrounds of alta red, dusky rose or dusk blue; soft light from the top left giving the white pith a velvety glow; only flowers, birds, boats, trees and buildings; pure, festive and Bengali, with large calm areas of plain background. A painting with soft places for two photos, on plain deep alta-red paper. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a slender white sholapith tendril with a tiny bird falls in the gap. Neither has a frame, border, arch, outline or box: white sholapith flowers, frills and tendrils drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 46% of the height down, keep the picture calm and empty for both names: plain deep alta-red paper. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="dabu"></a>

## 37. Dabu (दाबू)

**Dabu mud-resist block print: white and sky-blue motifs printed by hand on deep indigo cotton, with fine crackle lines.**

- Folder: `public/suites/dabu/` · Opening: `public/openings/fresh/thappa/` (Thappa, key #FF00FF magenta)
- Best for: Modern and minimal couples, Rajasthani and Madhya Pradesh families, day weddings, artisan lovers · Lettering voice: modern
- The opening: A carved wooden block stamps prints across a plain cotton sheet; each print opens a window onto the scene, until the sheet lifts away.
- Style lock (already inside every prompt below): Dabu mud-resist block printing from Bagru and Akola: deep indigo-dyed cotton with crisp white and pale sky-blue hand-block-printed motifs (small flowers, paisleys, vines, birds and elephants), slightly irregular like a real block print, fine crackle lines where the mud resist cracked, touches of rust red and soft olive; soft cotton texture and folds, natural daylight; calm, earthy, modern and handmade, with large calm areas of plain deep indigo.

### 37.1 Opening · the plain cloth · `thappa/cloth.webp`

```text
Dabu mud-resist block printing from Bagru and Akola: deep indigo-dyed cotton with crisp white and pale sky-blue hand-block-printed motifs (small flowers, paisleys, vines, birds and elephants), slightly irregular like a real block print, fine crackle lines where the mud resist cracked, touches of rust red and soft olive; soft cotton texture and folds, natural daylight; calm, earthy, modern and handmade, with large calm areas of plain deep indigo. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #FF00FF magenta, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 1 of 3 of an animated opening: A sheet of plain unbleached off-white cotton filling the whole picture to every edge, softly creased, with only a narrow hand-printed indigo border of small vines along all four edges; nothing else on it; the lower 38% slightly shaded. Fully painted to every edge. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: waiting, the cloth breathes in a breeze; opening, a carved block (a piece) drops in and stamps nine times from the centre out; each stamp leaves a print-shaped window onto the centre picture, then the whole cloth lifts and blows away._

### 37.2 Opening · front · `thappa/front.webp`

```text
Dabu mud-resist block printing from Bagru and Akola: deep indigo-dyed cotton with crisp white and pale sky-blue hand-block-printed motifs (small flowers, paisleys, vines, birds and elephants), slightly irregular like a real block print, fine crackle lines where the mud resist cracked, touches of rust red and soft olive; soft cotton texture and folds, natural daylight; calm, earthy, modern and handmade, with large calm areas of plain deep indigo. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #FF00FF magenta, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 2 of 3 of an animated opening, the front: Only framing pieces, each separate with magenta between them: a bamboo pole across the top 12% with lengths of indigo cloth hanging from it to dry; at the bottom left and bottom right corners, from 84% of the height to the bottom, a carved wooden printing block with its handle up, within the outer 20% of the width. Everything else, including the whole middle, is flat pure #FF00FF magenta. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: the hanging cloths flap softly; on opening they lift away._

### 37.3 Opening · pieces · `thappa/pieces.png` (I cut `piece-0` to `piece-5`)

```text
Dabu mud-resist block printing from Bagru and Akola: deep indigo-dyed cotton with crisp white and pale sky-blue hand-block-printed motifs (small flowers, paisleys, vines, birds and elephants), slightly irregular like a real block print, fine crackle lines where the mud resist cracked, touches of rust red and soft olive; soft cotton texture and folds, natural daylight; calm, earthy, modern and handmade, with large calm areas of plain deep indigo. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #FF00FF magenta, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 3 of 3 of an animated opening, the pieces: six separate small things on flat pure #FF00FF magenta, arranged in a grid of 2 columns and 3 rows, each centred alone in its own cell with wide gaps, none touching another or the edge: a carved wooden printing block seen from the side with its handle up, a carved block seen from below showing a flower pattern, a small clay bowl of grey mud paste, a solid dab of indigo dye, a small white printed flower motif, a twist of indigo thread. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: the block stamps and lifts; the small things drift away with the cloth._

### 37.4 Centre picture (after the opening) · `dabu/centre.webp`

```text
Dabu mud-resist block printing from Bagru and Akola: deep indigo-dyed cotton with crisp white and pale sky-blue hand-block-printed motifs (small flowers, paisleys, vines, birds and elephants), slightly irregular like a real block print, fine crackle lines where the mud resist cracked, touches of rust red and soft olive; soft cotton texture and folds, natural daylight; calm, earthy, modern and handmade, with large calm areas of plain deep indigo. The centre picture of the invitation, shown right after the opening with the couple's names, the invitation line and the date written on it. A length of dabu-printed indigo cloth hung flat: a wide border of block-printed white vines, paisleys, elephants and birds with rust-red touches all round, and a printed tree of life at the top centre. Inside the frame, one large empty calm field of plain deep indigo with very faint crackle lines, about 66% of the picture's width and from about 26% to 74% of the height: nothing drawn inside it, only the faintest texture. Keep the ornament thin beside that field and put the richest detail at the top and the bottom. Seen perfectly straight-on, centred and symmetrical, with no perspective. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 37.5 Cover (dusk) · `dabu/cover.webp`

```text
Dabu mud-resist block printing from Bagru and Akola: deep indigo-dyed cotton with crisp white and pale sky-blue hand-block-printed motifs (small flowers, paisleys, vines, birds and elephants), slightly irregular like a real block print, fine crackle lines where the mud resist cracked, touches of rust red and soft olive; soft cotton texture and folds, natural daylight; calm, earthy, modern and handmade, with large calm areas of plain deep indigo. Block-printed white vines and a tree of life up both sides, a row of printed elephants along the bottom. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 37.6 Family (day) · `dabu/family.webp`

```text
Dabu mud-resist block printing from Bagru and Akola: deep indigo-dyed cotton with crisp white and pale sky-blue hand-block-printed motifs (small flowers, paisleys, vines, birds and elephants), slightly irregular like a real block print, fine crackle lines where the mud resist cracked, touches of rust red and soft olive; soft cotton texture and folds, natural daylight; calm, earthy, modern and handmade, with large calm areas of plain deep indigo. A printed village of huts, a neem tree and cattle along the bottom on indigo; plain indigo above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 37.7 Haldi (morning) · `dabu/haldi.webp`

```text
Dabu mud-resist block printing from Bagru and Akola: deep indigo-dyed cotton with crisp white and pale sky-blue hand-block-printed motifs (small flowers, paisleys, vines, birds and elephants), slightly irregular like a real block print, fine crackle lines where the mud resist cracked, touches of rust red and soft olive; soft cotton texture and folds, natural daylight; calm, earthy, modern and handmade, with large calm areas of plain deep indigo. Ochre and white printed marigold motifs in garland swags across the top, printed pots along the bottom, on lighter sky indigo. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 37.8 Mehendi (day) · `dabu/mehendi.webp`

```text
Dabu mud-resist block printing from Bagru and Akola: deep indigo-dyed cotton with crisp white and pale sky-blue hand-block-printed motifs (small flowers, paisleys, vines, birds and elephants), slightly irregular like a real block print, fine crackle lines where the mud resist cracked, touches of rust red and soft olive; soft cotton texture and folds, natural daylight; calm, earthy, modern and handmade, with large calm areas of plain deep indigo. Printed leafy vines and parrots in white and olive up both sides. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 37.9 Sangeet (night) · `dabu/sangeet.webp`

```text
Dabu mud-resist block printing from Bagru and Akola: deep indigo-dyed cotton with crisp white and pale sky-blue hand-block-printed motifs (small flowers, paisleys, vines, birds and elephants), slightly irregular like a real block print, fine crackle lines where the mud resist cracked, touches of rust red and soft olive; soft cotton texture and folds, natural daylight; calm, earthy, modern and handmade, with large calm areas of plain deep indigo. Printed instruments and lanterns along the bottom; plain dark indigo above with tiny white dots. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 37.10 Baraat (dusk) · `dabu/baraat.webp`

```text
Dabu mud-resist block printing from Bagru and Akola: deep indigo-dyed cotton with crisp white and pale sky-blue hand-block-printed motifs (small flowers, paisleys, vines, birds and elephants), slightly irregular like a real block print, fine crackle lines where the mud resist cracked, touches of rust red and soft olive; soft cotton texture and folds, natural daylight; calm, earthy, modern and handmade, with large calm areas of plain deep indigo. A printed procession of elephants, horses and camels with canopies, no riders, along the bottom. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 37.11 Wedding (dusk) · `dabu/wedding.webp`

```text
Dabu mud-resist block printing from Bagru and Akola: deep indigo-dyed cotton with crisp white and pale sky-blue hand-block-printed motifs (small flowers, paisleys, vines, birds and elephants), slightly irregular like a real block print, fine crackle lines where the mud resist cracked, touches of rust red and soft olive; soft cotton texture and folds, natural daylight; calm, earthy, modern and handmade, with large calm areas of plain deep indigo. A printed mandap with four pillars, a canopy of printed cloth and marigold strings, in the upper half; plain indigo below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 37.12 Reception (night) · `dabu/reception.webp`

```text
Dabu mud-resist block printing from Bagru and Akola: deep indigo-dyed cotton with crisp white and pale sky-blue hand-block-printed motifs (small flowers, paisleys, vines, birds and elephants), slightly irregular like a real block print, fine crackle lines where the mud resist cracked, touches of rust red and soft olive; soft cotton texture and folds, natural daylight; calm, earthy, modern and handmade, with large calm areas of plain deep indigo. A printed palace facade with arches and lamps, in the upper half; plain indigo below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 37.13 Closing page (reply) (night) · `dabu/reply.webp`

```text
Dabu mud-resist block printing from Bagru and Akola: deep indigo-dyed cotton with crisp white and pale sky-blue hand-block-printed motifs (small flowers, paisleys, vines, birds and elephants), slightly irregular like a real block print, fine crackle lines where the mud resist cracked, touches of rust red and soft olive; soft cotton texture and folds, natural daylight; calm, earthy, modern and handmade, with large calm areas of plain deep indigo. A printed tree with a pair of birds at the bottom centre; plain indigo above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 37.14 Photo page · one photo · `dabu/couple.webp`

```text
Dabu mud-resist block printing from Bagru and Akola: deep indigo-dyed cotton with crisp white and pale sky-blue hand-block-printed motifs (small flowers, paisleys, vines, birds and elephants), slightly irregular like a real block print, fine crackle lines where the mud resist cracked, touches of rust red and soft olive; soft cotton texture and folds, natural daylight; calm, earthy, modern and handmade, with large calm areas of plain deep indigo. A painting with a soft place for one photo of the couple, on plain deep indigo cotton. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: block-printed white vines, small flowers and paisleys drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 50% of the height down, keep the picture calm and empty for the names: plain deep indigo cotton. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 37.15 Photo page · two photos · `dabu/couple-two.webp`

```text
Dabu mud-resist block printing from Bagru and Akola: deep indigo-dyed cotton with crisp white and pale sky-blue hand-block-printed motifs (small flowers, paisleys, vines, birds and elephants), slightly irregular like a real block print, fine crackle lines where the mud resist cracked, touches of rust red and soft olive; soft cotton texture and folds, natural daylight; calm, earthy, modern and handmade, with large calm areas of plain deep indigo. A painting with soft places for two photos, on plain deep indigo cotton. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a printed vine with a tiny pair of birds falls in the gap. Neither has a frame, border, arch, outline or box: block-printed white vines, small flowers and paisleys drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 46% of the height down, keep the picture calm and empty for both names: plain deep indigo cotton. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="aasmaani"></a>

## 38. Aasmaani (आसमानी)

**A palace ballroom's painted sky ceiling: soft clouds framed by gilded stucco, crystal chandeliers and blush roses.**

- Folder: `public/suites/aasmaani/` · Opening: `public/openings/fresh/gumbad/` (Gumbad, key #00FF00 green)
- Best for: Christian weddings, receptions, modern and luxe couples, anniversaries · Lettering voice: modern
- The opening: The guest looks up into a painted dome; its round sky-opening widens like an iris and light and petals pour down.
- Style lock (already inside every prompt below): A painted sky ceiling in a grand old palace ballroom: trompe-l'oeil skies of soft clouds in blush, peach and pale blue painted on plaster domes and vaults, framed by gilded stucco garlands, ribbons, rosettes and flowers, with crystal chandeliers and swags of blush roses and white hydrangeas; no angels or figures; warm glowing light, mother-of-pearl and champagne gold; heavenly, romantic and grand, with large calm areas of soft painted sky.

### 38.1 Opening · the dome · `gumbad/dome.webp`

```text
A painted sky ceiling in a grand old palace ballroom: trompe-l'oeil skies of soft clouds in blush, peach and pale blue painted on plaster domes and vaults, framed by gilded stucco garlands, ribbons, rosettes and flowers, with crystal chandeliers and swags of blush roses and white hydrangeas; no angels or figures; warm glowing light, mother-of-pearl and champagne gold; heavenly, romantic and grand, with large calm areas of soft painted sky. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 1 of 3 of an animated opening: Looking straight up into the inside of a grand painted dome, filling the whole picture to every edge: rings of gilded coffered panels with rosettes, painted garlands of blush roses and soft painted skies between them, all converging on a round opening (oculus) centred across the width at 42% of the height, about 30% of the width across, which shows plain soft blue sky; seen exactly from below, symmetrical; the lower 38% darker, in warm shadow. Fully painted to every edge. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: waiting, the dome turns very slowly and light shimmers in the oculus; opening, the oculus widens like an iris until the dome is gone and the centre picture fills the screen, petals and light falling through._

### 38.2 Opening · front · `gumbad/front.webp`

```text
A painted sky ceiling in a grand old palace ballroom: trompe-l'oeil skies of soft clouds in blush, peach and pale blue painted on plaster domes and vaults, framed by gilded stucco garlands, ribbons, rosettes and flowers, with crystal chandeliers and swags of blush roses and white hydrangeas; no angels or figures; warm glowing light, mother-of-pearl and champagne gold; heavenly, romantic and grand, with large calm areas of soft painted sky. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 2 of 3 of an animated opening, the front: Only framing pieces, each separate with green between them: a crystal chandelier hanging from the top edge at the left and another at the right, each within the outer 30% of the width and down to 22% of the height; swags of blush roses and white hydrangeas in the bottom left and bottom right corners, from 82% of the height to the bottom, within the outer 25%. Everything else, including the whole middle, is flat pure #00FF00 green. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: the chandeliers sway and glitter; on opening they rise out of the top._

### 38.3 Opening · pieces · `gumbad/pieces.png` (I cut `piece-0` to `piece-5`)

```text
A painted sky ceiling in a grand old palace ballroom: trompe-l'oeil skies of soft clouds in blush, peach and pale blue painted on plaster domes and vaults, framed by gilded stucco garlands, ribbons, rosettes and flowers, with crystal chandeliers and swags of blush roses and white hydrangeas; no angels or figures; warm glowing light, mother-of-pearl and champagne gold; heavenly, romantic and grand, with large calm areas of soft painted sky. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 3 of 3 of an animated opening, the pieces: six separate small things on flat pure #00FF00 green, arranged in a grid of 2 columns and 3 rows, each centred alone in its own cell with wide gaps, none touching another or the edge: a blush rose petal, a white hydrangea floret, a solid crystal chandelier drop, a small gilded rosette, a white feather, a pearl. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: petals and feathers fall through the opening oculus._

### 38.4 Centre picture (after the opening) · `aasmaani/centre.webp`

```text
A painted sky ceiling in a grand old palace ballroom: trompe-l'oeil skies of soft clouds in blush, peach and pale blue painted on plaster domes and vaults, framed by gilded stucco garlands, ribbons, rosettes and flowers, with crystal chandeliers and swags of blush roses and white hydrangeas; no angels or figures; warm glowing light, mother-of-pearl and champagne gold; heavenly, romantic and grand, with large calm areas of soft painted sky. The centre picture of the invitation, shown right after the opening with the couple's names, the invitation line and the date written on it. A gilded stucco frame on a painted sky ceiling: a tall round-topped cartouche of gilded stucco with ribbons, rosettes and garlands of blush roses and white hydrangeas, a small crystal chandelier hanging above it at the top centre, soft painted clouds all round. Inside the frame, one large empty calm field of soft pale blush-and-cream painted sky, about 66% of the picture's width and from about 26% to 74% of the height: nothing drawn inside it, only the faintest texture. Keep the ornament thin beside that field and put the richest detail at the top and the bottom. Seen perfectly straight-on, centred and symmetrical, with no perspective. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 38.5 Cover (dusk) · `aasmaani/cover.webp`

```text
A painted sky ceiling in a grand old palace ballroom: trompe-l'oeil skies of soft clouds in blush, peach and pale blue painted on plaster domes and vaults, framed by gilded stucco garlands, ribbons, rosettes and flowers, with crystal chandeliers and swags of blush roses and white hydrangeas; no angels or figures; warm glowing light, mother-of-pearl and champagne gold; heavenly, romantic and grand, with large calm areas of soft painted sky. A vaulted ceiling with garlands of roses along the top, a gilded balustrade with urns of roses along the bottom, soft painted sky between. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 38.6 Family (day) · `aasmaani/family.webp`

```text
A painted sky ceiling in a grand old palace ballroom: trompe-l'oeil skies of soft clouds in blush, peach and pale blue painted on plaster domes and vaults, framed by gilded stucco garlands, ribbons, rosettes and flowers, with crystal chandeliers and swags of blush roses and white hydrangeas; no angels or figures; warm glowing light, mother-of-pearl and champagne gold; heavenly, romantic and grand, with large calm areas of soft painted sky. A palace garden terrace with a fountain, rose bushes and clipped hedges along the bottom; soft painted sky above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 38.7 Haldi (morning) · `aasmaani/haldi.webp`

```text
A painted sky ceiling in a grand old palace ballroom: trompe-l'oeil skies of soft clouds in blush, peach and pale blue painted on plaster domes and vaults, framed by gilded stucco garlands, ribbons, rosettes and flowers, with crystal chandeliers and swags of blush roses and white hydrangeas; no angels or figures; warm glowing light, mother-of-pearl and champagne gold; heavenly, romantic and grand, with large calm areas of soft painted sky. Morning: a golden sky ceiling with sunlit clouds, gilded swags of yellow roses across the top, urns of sunflowers along the bottom. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 38.8 Mehendi (day) · `aasmaani/mehendi.webp`

```text
A painted sky ceiling in a grand old palace ballroom: trompe-l'oeil skies of soft clouds in blush, peach and pale blue painted on plaster domes and vaults, framed by gilded stucco garlands, ribbons, rosettes and flowers, with crystal chandeliers and swags of blush roses and white hydrangeas; no angels or figures; warm glowing light, mother-of-pearl and champagne gold; heavenly, romantic and grand, with large calm areas of soft painted sky. A soft green-blue sky with gilded trellis and trailing jasmine and ivy down both sides. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 38.9 Sangeet (night) · `aasmaani/sangeet.webp`

```text
A painted sky ceiling in a grand old palace ballroom: trompe-l'oeil skies of soft clouds in blush, peach and pale blue painted on plaster domes and vaults, framed by gilded stucco garlands, ribbons, rosettes and flowers, with crystal chandeliers and swags of blush roses and white hydrangeas; no angels or figures; warm glowing light, mother-of-pearl and champagne gold; heavenly, romantic and grand, with large calm areas of soft painted sky. A ballroom floor with a grand piano, a harp and gilded candelabra beside a balustrade along the bottom; soft dusk sky above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 38.10 Baraat (dusk) · `aasmaani/baraat.webp`

```text
A painted sky ceiling in a grand old palace ballroom: trompe-l'oeil skies of soft clouds in blush, peach and pale blue painted on plaster domes and vaults, framed by gilded stucco garlands, ribbons, rosettes and flowers, with crystal chandeliers and swags of blush roses and white hydrangeas; no angels or figures; warm glowing light, mother-of-pearl and champagne gold; heavenly, romantic and grand, with large calm areas of soft painted sky. A garden avenue of gilded lamp posts and rose arches with white horses with plumes and an open carriage, no riders, along the bottom. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 38.11 Wedding (dusk) · `aasmaani/wedding.webp`

```text
A painted sky ceiling in a grand old palace ballroom: trompe-l'oeil skies of soft clouds in blush, peach and pale blue painted on plaster domes and vaults, framed by gilded stucco garlands, ribbons, rosettes and flowers, with crystal chandeliers and swags of blush roses and white hydrangeas; no angels or figures; warm glowing light, mother-of-pearl and champagne gold; heavenly, romantic and grand, with large calm areas of soft painted sky. A gilded pavilion with a domed canopy hung with roses and crystal strings, in the upper half; calm soft cloud below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 38.12 Reception (night) · `aasmaani/reception.webp`

```text
A painted sky ceiling in a grand old palace ballroom: trompe-l'oeil skies of soft clouds in blush, peach and pale blue painted on plaster domes and vaults, framed by gilded stucco garlands, ribbons, rosettes and flowers, with crystal chandeliers and swags of blush roses and white hydrangeas; no angels or figures; warm glowing light, mother-of-pearl and champagne gold; heavenly, romantic and grand, with large calm areas of soft painted sky. A ballroom with chandeliers under its painted dome, lit at night, in the upper half; calm soft cloud below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 38.13 Closing page (reply) (night) · `aasmaani/reply.webp`

```text
A painted sky ceiling in a grand old palace ballroom: trompe-l'oeil skies of soft clouds in blush, peach and pale blue painted on plaster domes and vaults, framed by gilded stucco garlands, ribbons, rosettes and flowers, with crystal chandeliers and swags of blush roses and white hydrangeas; no angels or figures; warm glowing light, mother-of-pearl and champagne gold; heavenly, romantic and grand, with large calm areas of soft painted sky. A pair of white doves on a gilded balustrade with roses at the bottom centre; soft painted sky above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 38.14 Photo page · one photo · `aasmaani/couple.webp`

```text
A painted sky ceiling in a grand old palace ballroom: trompe-l'oeil skies of soft clouds in blush, peach and pale blue painted on plaster domes and vaults, framed by gilded stucco garlands, ribbons, rosettes and flowers, with crystal chandeliers and swags of blush roses and white hydrangeas; no angels or figures; warm glowing light, mother-of-pearl and champagne gold; heavenly, romantic and grand, with large calm areas of soft painted sky. A painting with a soft place for one photo of the couple, on soft pale blush-and-cream painted sky. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: gilded stucco ribbons, blush roses and white hydrangeas drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 50% of the height down, keep the picture calm and empty for the names: soft pale blush-and-cream painted sky. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 38.15 Photo page · two photos · `aasmaani/couple-two.webp`

```text
A painted sky ceiling in a grand old palace ballroom: trompe-l'oeil skies of soft clouds in blush, peach and pale blue painted on plaster domes and vaults, framed by gilded stucco garlands, ribbons, rosettes and flowers, with crystal chandeliers and swags of blush roses and white hydrangeas; no angels or figures; warm glowing light, mother-of-pearl and champagne gold; heavenly, romantic and grand, with large calm areas of soft painted sky. A painting with soft places for two photos, on soft pale blush-and-cream painted sky. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a slim gilded ribbon with a single rose falls in the gap. Neither has a frame, border, arch, outline or box: gilded stucco ribbons, blush roses and white hydrangeas drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 46% of the height down, keep the picture calm and empty for both names: soft pale blush-and-cream painted sky. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="tasveer-khana"></a>

## 39. Tasveer Khana (तस्वीर ख़ाना)

**Hand-tinted antique photographs and postcards of old India: sepia softly coloured by hand, deckled cream card, gold foil.**

- Folder: `public/suites/tasveer-khana/` · Opening: `public/openings/fresh/ghadi/` (Ghadi, key #FF00FF magenta)
- Best for: Vintage-loving couples, Parsi and Bombay families, anniversaries and vow renewals, modern weddings · Lettering voice: modern
- The opening: An antique pocket watch: its hands sweep round to the hour of the wedding, a soft chime, and the guest passes into its face.
- Style lock (already inside every prompt below): Hand-tinted antique photographs and postcards of India from a century ago: soft sepia and silver-grey photographic tones gently coloured by hand with transparent watercolour tints (faded rose, sage, sky blue and butter yellow), fine film grain, softly vignetted corners, deckled cream card edges and a few gold-foil flourishes; palaces, gardens, lakes, harbours and old streets with nobody in them; never any captions or printing; nostalgic, romantic and calm, with large plain areas of cream card or pale sky.

### 39.1 Opening · the pocket watch · `ghadi/watch.webp`

```text
Hand-tinted antique photographs and postcards of India from a century ago: soft sepia and silver-grey photographic tones gently coloured by hand with transparent watercolour tints (faded rose, sage, sky blue and butter yellow), fine film grain, softly vignetted corners, deckled cream card edges and a few gold-foil flourishes; palaces, gardens, lakes, harbours and old streets with nobody in them; never any captions or printing; nostalgic, romantic and calm, with large plain areas of cream card or pale sky. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #FF00FF magenta, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 1 of 3 of an animated opening: One large antique gold pocket watch seen straight on, its round case centred across the width at 42% of the height and 86% of the width across, with its crown and bow at the top; the dial is cream enamel with fine engraved floral rings and twelve small plain gold dots instead of numbers, and NO hands; the case is engraved with flowers; a short gold chain hangs down toward the bottom right. Everything outside the watch and chain is flat pure #FF00FF magenta. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: waiting, the second hand (a piece) ticks round; opening, the hour and minute hands (pieces) sweep round to the top, a soft chime, then the watch rushes toward the viewer and the guest passes through its dial into the centre picture._

### 39.2 Opening · front · `ghadi/front.webp`

```text
Hand-tinted antique photographs and postcards of India from a century ago: soft sepia and silver-grey photographic tones gently coloured by hand with transparent watercolour tints (faded rose, sage, sky blue and butter yellow), fine film grain, softly vignetted corners, deckled cream card edges and a few gold-foil flourishes; palaces, gardens, lakes, harbours and old streets with nobody in them; never any captions or printing; nostalgic, romantic and calm, with large plain areas of cream card or pale sky. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #FF00FF magenta, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 2 of 3 of an animated opening, the front: Only framing pieces, each separate with magenta between them: a gilded picture-rail moulding across the top 6%; sprays of dried roses with a scrap of old lace in the bottom left and bottom right corners, from 82% of the height to the bottom, within the outer 25% of the width. Everything else, including the whole middle, is flat pure #FF00FF magenta. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: the rose sprays stir; on opening they slide out._

### 39.3 Opening · pieces · `ghadi/pieces.png` (I cut `piece-0` to `piece-5`)

```text
Hand-tinted antique photographs and postcards of India from a century ago: soft sepia and silver-grey photographic tones gently coloured by hand with transparent watercolour tints (faded rose, sage, sky blue and butter yellow), fine film grain, softly vignetted corners, deckled cream card edges and a few gold-foil flourishes; palaces, gardens, lakes, harbours and old streets with nobody in them; never any captions or printing; nostalgic, romantic and calm, with large plain areas of cream card or pale sky. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #FF00FF magenta, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 3 of 3 of an animated opening, the pieces: six separate small things on flat pure #FF00FF magenta, arranged in a grid of 2 columns and 3 rows, each centred alone in its own cell with wide gaps, none touching another or the edge: an ornate gold hour hand pointing straight up, a longer ornate gold minute hand pointing straight up, a thin gold second hand pointing straight up, a small gold winding key, a dried rose, a small brass gear. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: the hands turn on the dial; the key and gear tumble away as it rushes forward._

### 39.4 Centre picture (after the opening) · `tasveer-khana/centre.webp`

```text
Hand-tinted antique photographs and postcards of India from a century ago: soft sepia and silver-grey photographic tones gently coloured by hand with transparent watercolour tints (faded rose, sage, sky blue and butter yellow), fine film grain, softly vignetted corners, deckled cream card edges and a few gold-foil flourishes; palaces, gardens, lakes, harbours and old streets with nobody in them; never any captions or printing; nostalgic, romantic and calm, with large plain areas of cream card or pale sky. The centre picture of the invitation, shown right after the opening with the couple's names, the invitation line and the date written on it. An old cream card mount seen flat: deckled edges, gilded embossed flower corners, a soft vignetted hand-tinted view of a palace garden and lake along the top and bottom edges only, and a small gold-foil flourish at the top centre. Inside the frame, one large empty calm field of plain cream card with a faint sepia tone, about 66% of the picture's width and from about 26% to 74% of the height: nothing drawn inside it, only the faintest texture. Keep the ornament thin beside that field and put the richest detail at the top and the bottom. Seen perfectly straight-on, centred and symmetrical, with no perspective. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 39.5 Cover (dusk) · `tasveer-khana/cover.webp`

```text
Hand-tinted antique photographs and postcards of India from a century ago: soft sepia and silver-grey photographic tones gently coloured by hand with transparent watercolour tints (faded rose, sage, sky blue and butter yellow), fine film grain, softly vignetted corners, deckled cream card edges and a few gold-foil flourishes; palaces, gardens, lakes, harbours and old streets with nobody in them; never any captions or printing; nostalgic, romantic and calm, with large plain areas of cream card or pale sky. A hand-tinted view of a lake palace with a balustrade of urns along the bottom, a tinted sky band and hanging bougainvillea across the top. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 39.6 Family (day) · `tasveer-khana/family.webp`

```text
Hand-tinted antique photographs and postcards of India from a century ago: soft sepia and silver-grey photographic tones gently coloured by hand with transparent watercolour tints (faded rose, sage, sky blue and butter yellow), fine film grain, softly vignetted corners, deckled cream card edges and a few gold-foil flourishes; palaces, gardens, lakes, harbours and old streets with nobody in them; never any captions or printing; nostalgic, romantic and calm, with large plain areas of cream card or pale sky. A tinted photograph of an old family bungalow with a deep verandah, palms and a garden along the bottom; plain cream sky above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 39.7 Haldi (morning) · `tasveer-khana/haldi.webp`

```text
Hand-tinted antique photographs and postcards of India from a century ago: soft sepia and silver-grey photographic tones gently coloured by hand with transparent watercolour tints (faded rose, sage, sky blue and butter yellow), fine film grain, softly vignetted corners, deckled cream card edges and a few gold-foil flourishes; palaces, gardens, lakes, harbours and old streets with nobody in them; never any captions or printing; nostalgic, romantic and calm, with large plain areas of cream card or pale sky. Tinted marigold garlands across the top and a courtyard with brass urns along the bottom; soft morning tint. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 39.8 Mehendi (day) · `tasveer-khana/mehendi.webp`

```text
Hand-tinted antique photographs and postcards of India from a century ago: soft sepia and silver-grey photographic tones gently coloured by hand with transparent watercolour tints (faded rose, sage, sky blue and butter yellow), fine film grain, softly vignetted corners, deckled cream card edges and a few gold-foil flourishes; palaces, gardens, lakes, harbours and old streets with nobody in them; never any captions or printing; nostalgic, romantic and calm, with large plain areas of cream card or pale sky. A tinted garden with a swing hung from a mango tree and potted ferns up both sides. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 39.9 Sangeet (night) · `tasveer-khana/sangeet.webp`

```text
Hand-tinted antique photographs and postcards of India from a century ago: soft sepia and silver-grey photographic tones gently coloured by hand with transparent watercolour tints (faded rose, sage, sky blue and butter yellow), fine film grain, softly vignetted corners, deckled cream card edges and a few gold-foil flourishes; palaces, gardens, lakes, harbours and old streets with nobody in them; never any captions or printing; nostalgic, romantic and calm, with large plain areas of cream card or pale sky. A gramophone with a horn, a harmonium and a sitar on a carpet in a tinted parlour along the bottom; plain cream above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 39.10 Baraat (dusk) · `tasveer-khana/baraat.webp`

```text
Hand-tinted antique photographs and postcards of India from a century ago: soft sepia and silver-grey photographic tones gently coloured by hand with transparent watercolour tints (faded rose, sage, sky blue and butter yellow), fine film grain, softly vignetted corners, deckled cream card edges and a few gold-foil flourishes; palaces, gardens, lakes, harbours and old streets with nobody in them; never any captions or printing; nostalgic, romantic and calm, with large plain areas of cream card or pale sky. A tinted old street with a vintage open car decked in flowers and a white horse with a plume, nobody in it, along the bottom. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 39.11 Wedding (dusk) · `tasveer-khana/wedding.webp`

```text
Hand-tinted antique photographs and postcards of India from a century ago: soft sepia and silver-grey photographic tones gently coloured by hand with transparent watercolour tints (faded rose, sage, sky blue and butter yellow), fine film grain, softly vignetted corners, deckled cream card edges and a few gold-foil flourishes; palaces, gardens, lakes, harbours and old streets with nobody in them; never any captions or printing; nostalgic, romantic and calm, with large plain areas of cream card or pale sky. A tinted photograph of a flower-decked canopy in a garden, in the upper half; plain cream below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 39.12 Reception (night) · `tasveer-khana/reception.webp`

```text
Hand-tinted antique photographs and postcards of India from a century ago: soft sepia and silver-grey photographic tones gently coloured by hand with transparent watercolour tints (faded rose, sage, sky blue and butter yellow), fine film grain, softly vignetted corners, deckled cream card edges and a few gold-foil flourishes; palaces, gardens, lakes, harbours and old streets with nobody in them; never any captions or printing; nostalgic, romantic and calm, with large plain areas of cream card or pale sky. A tinted photograph of an old seafront lined with lit lamps and a grand hotel at night, in the upper half; plain cream below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 39.13 Closing page (reply) (night) · `tasveer-khana/reply.webp`

```text
Hand-tinted antique photographs and postcards of India from a century ago: soft sepia and silver-grey photographic tones gently coloured by hand with transparent watercolour tints (faded rose, sage, sky blue and butter yellow), fine film grain, softly vignetted corners, deckled cream card edges and a few gold-foil flourishes; palaces, gardens, lakes, harbours and old streets with nobody in them; never any captions or printing; nostalgic, romantic and calm, with large plain areas of cream card or pale sky. Two cane chairs on a balcony overlooking the sea at dusk, in a tinted photograph at the bottom; plain cream above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 39.14 Photo page · one photo · `tasveer-khana/couple.webp`

```text
Hand-tinted antique photographs and postcards of India from a century ago: soft sepia and silver-grey photographic tones gently coloured by hand with transparent watercolour tints (faded rose, sage, sky blue and butter yellow), fine film grain, softly vignetted corners, deckled cream card edges and a few gold-foil flourishes; palaces, gardens, lakes, harbours and old streets with nobody in them; never any captions or printing; nostalgic, romantic and calm, with large plain areas of cream card or pale sky. A painting with a soft place for one photo of the couple, on plain cream card with a faint sepia tone. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: hand-tinted rose sprays, old lace and small gilded corners drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 50% of the height down, keep the picture calm and empty for the names: plain cream card with a faint sepia tone. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 39.15 Photo page · two photos · `tasveer-khana/couple-two.webp`

```text
Hand-tinted antique photographs and postcards of India from a century ago: soft sepia and silver-grey photographic tones gently coloured by hand with transparent watercolour tints (faded rose, sage, sky blue and butter yellow), fine film grain, softly vignetted corners, deckled cream card edges and a few gold-foil flourishes; palaces, gardens, lakes, harbours and old streets with nobody in them; never any captions or printing; nostalgic, romantic and calm, with large plain areas of cream card or pale sky. A painting with soft places for two photos, on plain cream card with a faint sepia tone. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a slim spray of dried roses falls in the gap. Neither has a frame, border, arch, outline or box: hand-tinted rose sprays, old lace and small gilded corners drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 46% of the height down, keep the picture calm and empty for both names: plain cream card with a faint sepia tone. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

---

<a id="sankheda"></a>

## 40. Sankheda (સંખેડા)

**Gujarat's Sankheda lacquer: glossy terracotta and maroon wood painted with gold and silver flowers, in a sunny courtyard.**

- Folder: `public/suites/sankheda/` · Opening: `public/openings/fresh/hindolo/` (Hindolo, key #00FF00 green)
- Best for: Gujarati weddings, Kathiawadi and Kutchi families, garba and sangeet-led invites · Lettering voice: playful
- The opening: A painted Sankheda swing sways, then sweeps high toward the guest and up out of sight, carrying the screen away.
- Style lock (already inside every prompt below): Sankheda lacquered furniture art from Gujarat: turned teak wood lacquered in glossy terracotta, deep maroon, ochre and peacock blue, hand-painted with gold and silver foil flowers, creepers and birds, then varnished to a warm glow; scenes built from Sankheda swings, chairs, pillars and screens in a sunny Gujarati courtyard with marigolds and mirror-work cushions; never bright green; warm, rich, festive and homely, with large calm areas of plain glossy lacquer or warm lime-washed wall.

### 40.1 Opening · the swing · `hindolo/swing.webp`

```text
Sankheda lacquered furniture art from Gujarat: turned teak wood lacquered in glossy terracotta, deep maroon, ochre and peacock blue, hand-painted with gold and silver foil flowers, creepers and birds, then varnished to a warm glow; scenes built from Sankheda swings, chairs, pillars and screens in a sunny Gujarati courtyard with marigolds and mirror-work cushions; never bright green; warm, rich, festive and homely, with large calm areas of plain glossy lacquer or warm lime-washed wall. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 1 of 3 of an animated opening: A large Sankheda swing (hindolo) seen straight on from the front, filling nearly the whole width: its tall backrest panel faces us, lacquered in glossy terracotta and painted with gold flowers and a pair of peacocks, with turned lacquered posts at both sides and a mirror-work cushion on the seat; it fills from 6% to 92% of the height and hangs from four brass chains that rise to the top edge. Everything outside the swing and chains is flat pure #00FF00 green. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: waiting, the swing sways gently forward and back; opening, it swings high toward the viewer and up out of the top, its gold catching the light, and the centre picture is behind it._

### 40.2 Opening · front · `hindolo/front.webp`

```text
Sankheda lacquered furniture art from Gujarat: turned teak wood lacquered in glossy terracotta, deep maroon, ochre and peacock blue, hand-painted with gold and silver foil flowers, creepers and birds, then varnished to a warm glow; scenes built from Sankheda swings, chairs, pillars and screens in a sunny Gujarati courtyard with marigolds and mirror-work cushions; never bright green; warm, rich, festive and homely, with large calm areas of plain glossy lacquer or warm lime-washed wall. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 2 of 3 of an animated opening, the front: Only framing pieces, each separate with green between them: a marigold and mango-leaf toran across the top 12%; at the bottom left and bottom right corners, from 84% of the height to the bottom, a brass pot of marigolds within the outer 20% of the width. Everything else, including the whole middle, is flat pure #00FF00 green. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: the toran sways with the swing; on opening it lifts away._

### 40.3 Opening · pieces · `hindolo/pieces.png` (I cut `piece-0` to `piece-5`)

```text
Sankheda lacquered furniture art from Gujarat: turned teak wood lacquered in glossy terracotta, deep maroon, ochre and peacock blue, hand-painted with gold and silver foil flowers, creepers and birds, then varnished to a warm glow; scenes built from Sankheda swings, chairs, pillars and screens in a sunny Gujarati courtyard with marigolds and mirror-work cushions; never bright green; warm, rich, festive and homely, with large calm areas of plain glossy lacquer or warm lime-washed wall. Layout: the app puts a sacred symbol at the top centre, a name plate across the middle and buttons along the bottom, so keep the top centre (the top 22%, middle third of the width) soft and simple, and keep the lower 38% calm, darker and low in contrast. Key colour: where I say #00FF00 green, paint one perfectly flat area of that exact colour with no shading, texture, glow or shadow, never use that colour or anything close to it inside the art, and give every painted element a crisp solid edge against it, with no mist, glow or see-through parts touching it. Seen straight on, centred and symmetrical, lit from the top left. Image 3 of 3 of an animated opening, the pieces: six separate small things on flat pure #00FF00 green, arranged in a grid of 2 columns and 3 rows, each centred alone in its own cell with wide gaps, none touching another or the edge: a small brass bell, an orange marigold, a mirror-work cushion tassel, a gold foil flower, a peacock feather, a rose petal. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no gods or religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

_Moves: they shake loose and fly as the swing sweeps up._

### 40.4 Centre picture (after the opening) · `sankheda/centre.webp`

```text
Sankheda lacquered furniture art from Gujarat: turned teak wood lacquered in glossy terracotta, deep maroon, ochre and peacock blue, hand-painted with gold and silver foil flowers, creepers and birds, then varnished to a warm glow; scenes built from Sankheda swings, chairs, pillars and screens in a sunny Gujarati courtyard with marigolds and mirror-work cushions; never bright green; warm, rich, festive and homely, with large calm areas of plain glossy lacquer or warm lime-washed wall. The centre picture of the invitation, shown right after the opening with the couple's names, the invitation line and the date written on it. A Sankheda lacquered frame seen straight on: a broad frame of turned lacquered teak in terracotta and maroon, painted with gold and silver flowers, a pair of painted peacocks at the top centre, and small brass bells hanging along the bottom. Inside the frame, one large empty calm field of plain warm cream lime-washed wall, about 66% of the picture's width and from about 26% to 74% of the height: nothing drawn inside it, only the faintest texture. Keep the ornament thin beside that field and put the richest detail at the top and the bottom. Seen perfectly straight-on, centred and symmetrical, with no perspective. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 40.5 Cover (dusk) · `sankheda/cover.webp`

```text
Sankheda lacquered furniture art from Gujarat: turned teak wood lacquered in glossy terracotta, deep maroon, ochre and peacock blue, hand-painted with gold and silver foil flowers, creepers and birds, then varnished to a warm glow; scenes built from Sankheda swings, chairs, pillars and screens in a sunny Gujarati courtyard with marigolds and mirror-work cushions; never bright green; warm, rich, festive and homely, with large calm areas of plain glossy lacquer or warm lime-washed wall. Two turned Sankheda pillars up the sides with a marigold toran across the top, a swing and mirror-work cushions along the bottom. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 40.6 Family (day) · `sankheda/family.webp`

```text
Sankheda lacquered furniture art from Gujarat: turned teak wood lacquered in glossy terracotta, deep maroon, ochre and peacock blue, hand-painted with gold and silver foil flowers, creepers and birds, then varnished to a warm glow; scenes built from Sankheda swings, chairs, pillars and screens in a sunny Gujarati courtyard with marigolds and mirror-work cushions; never bright green; warm, rich, festive and homely, with large calm areas of plain glossy lacquer or warm lime-washed wall. A Gujarati haveli courtyard with carved wooden balconies, a Sankheda swing and potted plants along the bottom; plain wall above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 40.7 Haldi (morning) · `sankheda/haldi.webp`

```text
Sankheda lacquered furniture art from Gujarat: turned teak wood lacquered in glossy terracotta, deep maroon, ochre and peacock blue, hand-painted with gold and silver foil flowers, creepers and birds, then varnished to a warm glow; scenes built from Sankheda swings, chairs, pillars and screens in a sunny Gujarati courtyard with marigolds and mirror-work cushions; never bright green; warm, rich, festive and homely, with large calm areas of plain glossy lacquer or warm lime-washed wall. Marigold strings across the top, lacquered stools and brass bowls of turmeric along the bottom; morning sun. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 40.8 Mehendi (day) · `sankheda/mehendi.webp`

```text
Sankheda lacquered furniture art from Gujarat: turned teak wood lacquered in glossy terracotta, deep maroon, ochre and peacock blue, hand-painted with gold and silver foil flowers, creepers and birds, then varnished to a warm glow; scenes built from Sankheda swings, chairs, pillars and screens in a sunny Gujarati courtyard with marigolds and mirror-work cushions; never bright green; warm, rich, festive and homely, with large calm areas of plain glossy lacquer or warm lime-washed wall. Lacquered screens painted with creepers and parrots up both sides. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 40.9 Sangeet (night) · `sankheda/sangeet.webp`

```text
Sankheda lacquered furniture art from Gujarat: turned teak wood lacquered in glossy terracotta, deep maroon, ochre and peacock blue, hand-painted with gold and silver foil flowers, creepers and birds, then varnished to a warm glow; scenes built from Sankheda swings, chairs, pillars and screens in a sunny Gujarati courtyard with marigolds and mirror-work cushions; never bright green; warm, rich, festive and homely, with large calm areas of plain glossy lacquer or warm lime-washed wall. A ring of lanterns, a dhol and painted dandiya sticks on mirror-work cushions along the bottom; plain night wall above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 40.10 Baraat (dusk) · `sankheda/baraat.webp`

```text
Sankheda lacquered furniture art from Gujarat: turned teak wood lacquered in glossy terracotta, deep maroon, ochre and peacock blue, hand-painted with gold and silver foil flowers, creepers and birds, then varnished to a warm glow; scenes built from Sankheda swings, chairs, pillars and screens in a sunny Gujarati courtyard with marigolds and mirror-work cushions; never bright green; warm, rich, festive and homely, with large calm areas of plain glossy lacquer or warm lime-washed wall. Caparisoned horses and an elephant with a Sankheda-painted howdah, no riders, along the bottom; a toran across the top. Composition: keep a wide calm band from about 25% to 75% of the height soft, plain and uncluttered for words, at least half the picture; put the rich detail only along the top edge, the bottom edge and the outer sides. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 40.11 Wedding (dusk) · `sankheda/wedding.webp`

```text
Sankheda lacquered furniture art from Gujarat: turned teak wood lacquered in glossy terracotta, deep maroon, ochre and peacock blue, hand-painted with gold and silver foil flowers, creepers and birds, then varnished to a warm glow; scenes built from Sankheda swings, chairs, pillars and screens in a sunny Gujarati courtyard with marigolds and mirror-work cushions; never bright green; warm, rich, festive and homely, with large calm areas of plain glossy lacquer or warm lime-washed wall. A mandap of four Sankheda lacquered pillars with a canopy of red and gold cloth and marigold strings, in the upper half; plain wall below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 40.12 Reception (night) · `sankheda/reception.webp`

```text
Sankheda lacquered furniture art from Gujarat: turned teak wood lacquered in glossy terracotta, deep maroon, ochre and peacock blue, hand-painted with gold and silver foil flowers, creepers and birds, then varnished to a warm glow; scenes built from Sankheda swings, chairs, pillars and screens in a sunny Gujarati courtyard with marigolds and mirror-work cushions; never bright green; warm, rich, festive and homely, with large calm areas of plain glossy lacquer or warm lime-washed wall. A courtyard at night with lanterns and lacquered furniture, in the upper half; plain floor below. Composition: keep the lower 50% calm and plain (still water, a plain floor or smooth cloth) for words; put the main scene in the upper half. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 40.13 Closing page (reply) (night) · `sankheda/reply.webp`

```text
Sankheda lacquered furniture art from Gujarat: turned teak wood lacquered in glossy terracotta, deep maroon, ochre and peacock blue, hand-painted with gold and silver foil flowers, creepers and birds, then varnished to a warm glow; scenes built from Sankheda swings, chairs, pillars and screens in a sunny Gujarati courtyard with marigolds and mirror-work cushions; never bright green; warm, rich, festive and homely, with large calm areas of plain glossy lacquer or warm lime-washed wall. A pair of lacquered Sankheda chairs with a brass lamp at the bottom centre; plain wall above. Composition: keep the top 55% open and calm (plain sky, a plain wall or a soft wash) for words; put the main scene in the lower 45%. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 40.14 Photo page · one photo · `sankheda/couple.webp`

```text
Sankheda lacquered furniture art from Gujarat: turned teak wood lacquered in glossy terracotta, deep maroon, ochre and peacock blue, hand-painted with gold and silver foil flowers, creepers and birds, then varnished to a warm glow; scenes built from Sankheda swings, chairs, pillars and screens in a sunny Gujarati courtyard with marigolds and mirror-work cushions; never bright green; warm, rich, festive and homely, with large calm areas of plain glossy lacquer or warm lime-washed wall. A painting with a soft place for one photo of the couple, on plain warm cream lime-washed wall. In the upper middle, one rounded, cloud-soft patch of one flat pure green colour #00FF00, about 62% of the picture's width and 36% of its height, centred, its top about 9% from the top. The green has no frame, border, arch, outline or box around it: gold-painted lacquer creepers, marigolds and small brass bells drift in over its edges and overlap the green irregularly, so it melts into the painting. Keep the middle of the green clear (the faces go there). Below it, from about 50% of the height down, keep the picture calm and empty for the names: plain warm cream lime-washed wall. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```

### 40.15 Photo page · two photos · `sankheda/couple-two.webp`

```text
Sankheda lacquered furniture art from Gujarat: turned teak wood lacquered in glossy terracotta, deep maroon, ochre and peacock blue, hand-painted with gold and silver foil flowers, creepers and birds, then varnished to a warm glow; scenes built from Sankheda swings, chairs, pillars and screens in a sunny Gujarati courtyard with marigolds and mirror-work cushions; never bright green; warm, rich, festive and homely, with large calm areas of plain glossy lacquer or warm lime-washed wall. A painting with soft places for two photos, on plain warm cream lime-washed wall. In the upper half, two rounded, cloud-soft patches of one flat pure green colour #00FF00 side by side, each about 40% of the picture's width and 32% of its height, their tops about 10% from the top, with a small gap between them (the left one for the bride, the right one for the groom); a short marigold string with a tiny brass bell falls in the gap. Neither has a frame, border, arch, outline or box: gold-painted lacquer creepers, marigolds and small brass bells drift in over their outer edges and overlap the green irregularly, so they melt into the painting. Keep the middle of each green clear (the faces go there). Below them, from about 46% of the height down, keep the picture calm and empty for both names: plain warm cream lime-washed wall. The green must be exactly #00FF00 and perfectly flat: no texture, shading, gradient, glow or reflection inside it. Portrait 9:16, 1080 × 1920 pixels. No people, faces or hands, no human or divine figures, no religious symbols, no text, letters, numbers, signatures, logos or watermarks.
```
