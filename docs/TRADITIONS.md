# Traditions — regional and religious customisation

Indian families expect their invitation to look and read like their community's cards: the right deity or sacred symbol at the top, the right invocation, colours, motifs, ceremony names and wording order. This document specifies **tradition packs**: data that sets all of that from one choice in the editor.

Build order: Step 12a (engine and first packs), content task C1 (artwork, starts now), Step 23 (more packs), Step 27a (artist collections). See [PLAN.md](PLAN.md).

> **Every pack below is a draft.** Invocations, ceremony names and wording must be checked by at least two people from that community and a native-language proofreader before launch (quality gate in section 10).

---

## 1. Why this matters

Research on Indian invitation apps and sites, 26 September 2026:

| Product                                                                                                                         | What it does well                                                                                | Gap we fill                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Celebrare](https://play.google.com/store/apps/details?id=com.enjoy.celebrare&hl=en_US)                                         | 1M+ downloads, 4.0 from 7.64K reviews; video invites with music; praised fonts, colours, support | Flat video or image, no RSVP or guest list                                                                                                            |
| [WedMeGood](https://www.wedmegood.com/wedding-invitations)                                                                      | 111 card designs, 239 video templates, 111 save-the-dates; videos about ₹500–₹800                | Download after payment, no live link; weaker on South Indian designs ([review](https://magicalstar.in/blog/best-wedding-invitation-apps-india-2026/)) |
| [ZingInfo video maker](https://play.google.com/store/apps/details?id=com.zinginfo.weddingvideoinvitation&hl=en_IN)              | Free; covers Roka to Anand Karaj and Nikah                                                       | Mixed reviews; device data collected and not deletable                                                                                                |
| [Gold Bridge card maker](https://play.google.com/store/apps/details?id=com.weddingcardmaker.ecard.invitationcardmaker&hl=en_IN) | Free; Indian and Muslim styles                                                                   | Ads, generic designs                                                                                                                                  |
| Canva                                                                                                                           | Huge library                                                                                     | Needs heavy manual work for authentic North or South Indian results ([review](https://magicalstar.in/blog/best-wedding-invitation-apps-india-2026/))  |

**Common gaps:** flat output, no guest tools, shallow regional depth (especially South India), English-first wording, ads. **Nobody sets deity, wording, ceremonies and colours from the family's tradition automatically.** That is the feature.

Regional visual languages: [Hindu card symbols](https://medium.com/@shubhankarweddingcards/different-types-of-symbols-used-in-hindu-wedding-cards-80c938fdc94a), [Wikipedia: Indian wedding invitations](https://en.wikipedia.org/wiki/Indian_wedding_invitations), [regional styles](https://destinationweddingsindia.com/wedding-card-design/), [South Indian cards](https://www.parekhcards.com/South-Indian-Wedding-Cards.asp), [Bengali card format](https://magicalstar.in/blog/bengali-wedding-invitation-wording-format/).

---

## 2. How it works for the user

1. **First question in the editor, after the occasion:** "Whose tradition should the card follow?"
   - Region (pre-selected from the visitor's state, as categories already do)
   - Community (Hindu, Sikh, Muslim, Christian, Jain, or "Mixed / modern")
   - Card languages (up to two, for example Tamil + English)
2. The picker shows 3–4 live previews in that tradition and language.
3. The chosen pack fills in: deity or symbol, invocation line, palette, motifs, recommended templates, ceremony list with local names, host order, wording blocks, music raga, dress code suggestions.
4. **Everything stays editable.** A pack sets defaults; families change the deity, remove the invocation, add a ceremony, or switch to "Modern (no religious symbols)".
5. **Interfaith and mixed weddings:** choose a pack per family; the card can show both families' symbols side by side (for example Ganesha and Ik Onkar), or a neutral mandala.

---

## 3. What a tradition pack controls

| Part           | Description                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------- |
| Invocation     | The top line in the pack's script, with transliteration and meaning; optional audio chant on open |
| Sacred art     | Default deity or symbol, plus alternatives the family can pick                                    |
| Palette        | 3–5 colours mapped to card stock tokens                                                           |
| Motifs         | Border and ornament sets (vector data, same pipeline as templates)                                |
| Template picks | Which designs lead the list                                                                       |
| Ceremonies     | Ordered list of functions with local names in each language, default times of day                 |
| Host order     | Who hosts first (groom's family, bride's family, or both)                                         |
| Wording blocks | Blessing line, host line, invitation line, requesters, RSVP names, kids' line, closing            |
| Special fields | Gotra, exact muhurat or lagna time, Hijri or tithi date, gurdwara or church name                  |
| Music          | Default raga or instrument (shehnai, nadaswaram, dhol, church bells)                              |
| Rules          | Figures allowed or not, deity placement, which categories may use it                              |

### Data shape (draft, to follow `src/lib/categories/schema.ts`)

```ts
type TraditionPack = {
  id: string; // "tamil-hindu"
  community: "hindu" | "sikh" | "muslim" | "christian" | "jain" | "modern";
  regions: RegionCode[]; // ranking, same codes as categories
  languages: Locale[]; // first = default card language
  names: Record<Locale, string>; // "Tamil Hindu", in each script
  invocation?: {
    text: Record<Locale, string>; // script
    transliteration: string;
    meaning: string;
    audio?: string; // optional chant
  };
  sacredArt: { default: ArtId; alternatives: ArtId[]; figuresAllowed: boolean };
  palette: string[]; // card-stock token names, never hex in components
  motifs: MotifId[];
  templates: TemplateId[]; // shown first
  ceremonies: {
    functionId: FunctionId; // reuse existing functions where they match
    names: Record<Locale, string>;
    usualTime: "morning" | "afternoon" | "evening" | "night";
  }[];
  hostOrder: "groom-first" | "bride-first" | "both";
  wording: Record<Locale, WordingBlocks>;
  fields: ("gotra" | "muhurat" | "tithi" | "hijri" | "venue-religious")[];
  music: RagaId;
  reviewedBy: string[]; // community reviewers; empty = cannot ship
};
```

New function ids will be needed for community-specific ceremonies (for example `gaye-holud`, `anand-karaj`, `nikah`, `walima`, `nalangu`); add them to `FUNCTION_IDS` as packs arrive.

---

## 4. Launch packs (12)

Order of build: 1–6 in Step 12a, 7–12 in Step 23 (or earlier if the pilot families need them).

### 4.1 North Indian Hindu (Hindi)

- **Regions:** DL, UP, HR, MP, BR, UT, HP, JH, CH
- **Invocation:** ॥ श्री गणेशाय नमः ॥ (Shri Ganeshaya Namah). Optional shloka: वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥ ([Vakratunda Mahakaya](https://en.wikipedia.org/wiki/Vakratunda_Mahakaaya))
- **Sacred art:** Ganesha (default); alternatives Radha-Krishna, Shiva-Parvati, Lakshmi
- **Symbols and motifs:** mangal kalash, swastika, Om, doli, jaimala, shehnai, elephants
- **Palette:** red, maroon, gold, marigold
- **Ceremonies:** Roka, Sagai, Tilak, Haldi, Mehendi, Sangeet, Baraat and Phere, Reception
- **Wording:** blessing line with grandparents ("with the blessings of"); parents as hosts, groom's family first on the groom's card and bride's on the bride's; invitation line; **Darshanabhilashi** (दर्शनाभिलाषी) family names; **Swagatotsuk** (स्वागतोत्सुक) names for RSVP; the children's line (for example "मेरे चाचू की शादी में ज़रूर आना"); one RSVP phone number
- **Music:** shehnai, raga Yaman

### 4.2 Rajasthani and Marwari (Hindi, Marwari phrases)

- **Regions:** RJ, plus Marwari families everywhere (Kolkata, Mumbai, Assam)
- **Invocation:** as 4.1
- **Sacred art:** Ganesha; alternatives Shrinathji-style Krishna, Karni Mata (family choice)
- **Motifs:** meenakari enamel work, jharokha windows, elephants, camels, peacocks
- **Palette:** royal maroon, saffron, gold, turquoise accents
- **Ceremonies:** 4.1 plus Mayra (maternal uncle's ceremony) and Tilak
- **Wording:** 4.1 with Marwari honorifics; large extended-family lists (allow long requester lists that page gracefully)
- **Music:** shehnai, Rajasthani folk

### 4.3 Marathi

- **Regions:** MH, GA
- **Invocation:** ॥ श्री गणेशाय नमः ॥; optional Ashtavinayak or family deity line (कुलदैवत)
- **Sacred art:** Ganesha (default); alternatives Vitthal-Rukmini, Khandoba (family choice)
- **Motifs:** Paithani peacock borders, nauvari drape patterns, rangoli, mango leaves (toran)
- **Palette:** green, gold, turmeric yellow, magenta
- **Ceremonies:** Sakharpuda (engagement), Haldi, Simant Pujan, Wedding with Mangalashtak and Antarpat, Reception
- **Wording:** "सप्रेम निमंत्रण", "आग्रहाचे निमंत्रण" styles; muhurat time exact ("शुभ मुहूर्त"); family deity line
- **Music:** shehnai, sanai-choughada

### 4.4 Gujarati

- **Regions:** GJ, DH, plus diaspora
- **Invocation:** ॥ શ્રી ગણેશાય નમઃ ॥
- **Sacred art:** Ganesha; alternatives Shrinathji, Ambe Maa, Swaminarayan (family choice)
- **Motifs:** bandhani dots, patola geometry, kites, mirror-work, dandiya
- **Palette:** turquoise, pink, orange, green, gold
- **Ceremonies:** Gol Dhana (engagement), Mandap Muhurat, Pithi (haldi), Mehendi, Garba or Sangeet, Hast Milap (wedding), Reception
- **Wording:** the card is traditionally the **kankotri**; host families named with native place (village) lines
- **Music:** shehnai, garba rhythm

### 4.5 Bengali Hindu

- **Regions:** WB, TR, parts of AS, JH
- **Invocation:** প্রজাপতয়ে নমঃ (Prajapataye Namah), treated as essential by traditional families
- **Sacred art:** Prajapati (butterfly) symbol by default; alternatives Durga, Ganesha, Radha-Krishna
- **Motifs:** alpona, shankha-pola, fish, topor, conch
- **Palette:** red with white, red with gold
- **Ceremonies:** Aashirbaad, Aiburobhat, Gaye Holud, Bibaho, Bou Bhaat
- **Host order:** **bride's family as primary host**, reversing the North Indian convention
- **Wording:** exact lagna time ("9:43 PM", never a range); gotra for both families; grandparents in the blessing line even if deceased; community honorifics (Kulin, Rarhi, Kayastha)
- **Music:** shehnai, conch sound on open (optional)
- Source: [Bengali invitation format](https://magicalstar.in/blog/bengali-wedding-invitation-wording-format/)

### 4.6 Tamil Hindu

- **Regions:** TN, PY
- **Invocation:** the Pillaiyar suzhi (உ) at the top, then a deity line; "சுப முகூர்த்த பத்திரிகை" style heading
- **Sacred art:** Pillaiyar (Ganesha); alternatives Murugan, Meenakshi-Sundareswarar, Venkatachalapathy
- **Motifs:** kolam, temple gopuram, kuthuvilakku lamp, plantain trees, mango-leaf thoranam, Kanjeevaram borders
- **Palette:** deep red, temple gold, cream, green
- **Ceremonies:** Nichayathartham (engagement), Nalangu, Mehendi, Muhurtham (wedding), Reception
- **Wording:** Tamil calendar date alongside the English date; muhurtham window ("between 9:00 and 10:30 AM"); both families with native places
- **Music:** nadaswaram and thavil

### 4.7 Telugu Hindu

- **Regions:** AP, TG
- **Invocation:** శ్రీరస్తు శుభమస్తు అవిఘ్నమస్తు (Srirastu Subhamastu Avighnamastu)
- **Sacred art:** Venkateswara (Balaji) or Ganesha
- **Motifs:** pandiri (mandap), kalasham, bashikam, rangoli (muggulu)
- **Palette:** turmeric yellow, red, green, gold
- **Ceremonies:** Nischitartham, Pellikuturu and Pellikoduku, Mangala Snanam, Muhurtham (Jeelakarra-Bellam, Talambralu), Reception
- **Wording:** exact muhurtham time; family names with native places
- **Music:** nadaswaram

### 4.8 Kerala (Malayalam) — Hindu, Christian, Muslim variants

- **Regions:** KL, LD
- **Hindu:** Guruvayurappan or Ganesha; nilavilakku lamp; kasavu cream-and-gold palette; ceremonies Nischayam, Muhurtham (thali kettu), Sadya, Reception
- **Christian:** cross, church, Bible verse; ceremonies Betrothal, Holy Matrimony, Reception
- **Muslim:** calligraphy, arches; Nikah, Walima; no figures
- **Motifs:** kasavu borders, coconut palms, snake boats, Kathakali (Hindu variant only)
- **Music:** chenda and nadaswaram (Hindu); choir or bells (Christian)

### 4.9 Punjabi Sikh

- **Regions:** PB, CH, HR, DL, plus diaspora
- **Invocation:** ੴ (Ik Onkar); optional Mool Mantar opening
- **Sacred art:** Ik Onkar or Khanda; **no deity images** by default
- **Motifs:** phulkari embroidery, gurdwara silhouette, dhol
- **Palette:** orange, yellow, red, royal blue
- **Ceremonies:** Roka, Kurmai (engagement), Maiyan and Vatna, Mehendi, Jaggo, Anand Karaj, Reception
- **Wording:** Anand Karaj is usually a morning ceremony at a gurdwara; gurdwara name as a special field
- **Music:** dhol, shabad (optional)

### 4.10 Muslim (Urdu, Hindi-Urdu, English)

- **Regions:** everywhere
- **Invocation:** بسم الله الرحمن الرحيم (Bismillah), optionally shown as 786
- **Sacred art:** calligraphy, crescent and star, arches and domes; **no human figures or deities** (hard rule, `figuresAllowed: false`)
- **Motifs:** Mughal jaali, arches, geometric patterns
- **Palette:** emerald, gold, ivory, deep teal
- **Ceremonies:** Mangni, Manjha or Haldi, Mehndi, Nikah, Walima
- **Wording:** Hijri date optional alongside the English date; right-to-left layout for Urdu text
- **Music:** instrumental only by default; host can turn music off entirely

### 4.11 Christian

- **Regions:** KL, GA, TN, NL, ML, MZ, MH, plus everywhere
- **Invocation:** a Bible verse (for example 1 Corinthians 13, public-domain translations)
- **Sacred art:** cross, church, doves, rings
- **Palette:** white, ivory, gold, soft florals
- **Ceremonies:** Engagement, Holy Matrimony (church name and parish), Reception
- **Variants:** Goan (Portuguese-influenced wording), Kerala Syrian Christian, Northeast
- **Music:** church bells, choir

### 4.12 Jain

- **Regions:** GJ, RJ, MH, KA, plus diaspora
- **Invocation:** Navkar Mantra opening (णमो अरिहंताणं)
- **Sacred art:** Jain symbol (hand with wheel) or Tirthankara line art (family choice); no Hindu deity by default
- **Palette:** white, saffron, gold
- **Ceremonies:** Sagai, Mehendi, Lagna, Reception
- **Wording:** food notes if the family wants (Jain menu)

**Later packs:** Kannada Hindu, Odia, Assamese, Konkani, Kashmiri Pandit, Sindhi, Parsi, Buddhist, Northeast communities, Nepali. Each follows the same shape.

**Modern pack:** no religious symbols; neutral mandala or monogram; for couples who prefer it and for interfaith weddings.

---

## 5. Sacred art library (content task C1)

### What to commission first (18 pieces)

| Group   | Pieces                                                                                                                                                  |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Deities | Ganesha (3 styles: traditional, line art, temple), Lakshmi, Radha-Krishna, Shiva-Parvati, Venkateswara, Murugan, Guruvayurappan, Durga, Vitthal-Rukmini |
| Symbols | Om, swastika, mangal kalash, Prajapati butterfly, Ik Onkar, Khanda, Bismillah calligraphy, cross, Jain symbol                                           |

Each piece is delivered as layered vector art (for the 2D card) with separate layers for halo, lamp and flowers so the 3D engine can animate them.

### Sourcing rules

- **Never take deity images or card designs from Google Images or other apps.** Most are copyrighted artworks; using them risks takedowns and legal claims.
- Commission original art from Indian artists with full commercial rights (or a licence that covers digital cards, video export and print).
- Families can upload their own deity or kuldevta image; they confirm they have the right to use it.
- Credit artists in a "Collection" line; this seeds the designer collections in Step 27a.

### Respect rules (enforced in code)

- Deity or symbol sits **top-centre**, never at the bottom, never cropped, never behind text.
- Never on playful or caricature templates unless the family explicitly adds it.
- Not offered in party categories (kitty party, bachelor party) by default.
- `figuresAllowed: false` packs never show figures, even in suggested templates.
- 3D motion is gentle: diya flicker, petals falling before the deity, a soft halo. No spinning or bouncing deities.
- Marketing line we can use: a digital card means no card with a god's image ends up in the bin after the wedding.

---

## 6. Colourful "Rang" template family

The six built templates lean elegant. Many families want bright, full, traditional cards. Add a **Rang** family of 6 templates for Step 23 (or earlier for the pilot):

| Template       | Look                                     | Leading packs            |
| -------------- | ---------------------------------------- | ------------------------ |
| Rang Mahal     | Maroon and gold palace arches, elephants | North Indian, Rajasthani |
| Paithani Mor   | Green and magenta peacock borders        | Marathi                  |
| Bandhani Utsav | Turquoise and pink dots, mirror-work     | Gujarati                 |
| Alpona Lal     | Red and white alpona, conch, fish        | Bengali                  |
| Gopuram Pon    | Temple gold, kolam, lamps, plantain      | Tamil, Telugu            |
| Phulkari Rang  | Orange, yellow, red embroidery           | Punjabi                  |

Rang templates still follow the design tokens and contrast rules; bright does not mean unreadable.

---

## 7. Languages and scripts

- Card text in the pack's script, with English optional as the second language.
- Fonts per script, loaded only when used: Devanagari, Gujarati, Bengali, Tamil, Telugu, Kannada, Malayalam, Gurmukhi, Nastaliq (Urdu). Prefer Noto families for coverage, plus one display face per script for names.
- Invocations and shlokas stored in script with transliteration; never machine-translated.
- AI wording (Step 19) writes from the pack's wording blocks in that language, following its conventions (host order, honorifics, exact muhurat).
- Right-to-left layout for Urdu blocks, even inside a bilingual card.

---

## 8. Editor changes

- New **Tradition** step right after Occasion: region, community, card languages, live previews.
- A **"Religious elements"** panel: deity or symbol picker, invocation on or off, shloka or verse picker, chant on or off.
- **Wording panel** shows the pack's blocks as labelled fields (Blessings from, Hosts, Requesters, Swagatotsuk, Children's line) instead of one big text box.
- Ceremony list pre-filled with local names; each still editable.
- Pack change warns before replacing text the family has edited.

---

## 9. Guest side

- Guest sees the card in the chosen languages, with a toggle between them.
- Chant or music plays only after the guest taps (browser rule), with a visible mute.
- Muhurat and lagna times shown exactly as written, never rounded.

---

## 10. Quality gate for every pack

A pack cannot ship until:

- [ ] Two community reviewers approve invocation, symbols, ceremony names and wording (`reviewedBy` filled)
- [ ] A native-language proofreader signs off every string in each language
- [ ] Sacred art is original or properly licensed, with rights recorded
- [ ] Respect rules pass automated tests (placement, `figuresAllowed`, category limits)
- [ ] Card previewed at 320px and 1440px, light and dark, in each language, with long names (Tamil and Malayalam text length)
- [ ] 2D fallback shows the sacred art and invocation correctly

---

## 11. Build steps

| Step                         | Scope                                                                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **C1** (content, starts now) | Commission the 18 sacred art pieces; recruit community reviewers and proofreaders for the first 6 packs                                     |
| **12a**                      | Tradition pack schema and catalogue, Tradition step in the editor, religious-elements and wording panels, respect-rule tests, packs 4.1–4.6 |
| **23**                       | Packs 4.7–4.12 and the Modern pack; Rang template family                                                                                    |
| **27a**                      | Artist collections: sacred art and regional designs by named Indian artists                                                                 |
| Later                        | Additional packs (section 4, "Later packs")                                                                                                 |

---

## 12. Wedding functions by region (research, 27 September 2026)

Families list many more functions on a kankotri or lagna patrika than the seven the editor started with. Each is a `FunctionId` shared by every pack; a pack gives it the local name and lists the ones its cards usually carry (`functions`), which the editor shows first for a wedding. Guests see the local name beside the English one, and every function gets its own story scene.

| Function id      | English name   | North Indian    | Rajasthani       | Marathi       | Gujarati         | Bengali       | Tamil               |
| ---------------- | -------------- | --------------- | ---------------- | ------------- | ---------------- | ------------- | ------------------- |
| `tilak`          | Tilak          | Tilak           | Tilak            |               |                  |               |                     |
| `ganesh-puja`    | Ganesh puja    | Ganesh Pujan    | Vinayak Sthapana | Ganpati Pujan | Ganesh Sthapana  |               |                     |
| `grah-shanti`    | Griha shanti   | Grah Shanti     | Grah Shanti      | Grahamakh     | Grah Shanti      |               |                     |
| `mandap`         | Mandap muhurat |                 |                  | Mandav        | Mandap Muhurat   |               | Panthakal Muhurtham |
| `mameru`         | Mameru         | Bhaat           | Mayra            |               | Mameru           |               |                     |
| `haldi`          | Haldi          | Haldi           | Pithi            | Halad         | Pithi            | Gaye Holud    | Nalangu             |
| `garba`          | Garba night    |                 |                  |               | Raas Garba       |               |                     |
| `bhoj`           | Family feast   | Preetibhoj      | Bhoj             | Kelvan        | Bhojan Samarambh | Aiburobhat    |                     |
| `baraat`         | Baraat         | Baraat Prasthan | Nikasi           |               | Jaan Prasthan    | Bor Jatri     |                     |
| `baraat-welcome` | Baraat welcome | Baraat Swagat   | Toran            | Seemant Pujan | Jaan Aagman      | Bor Boron     | Mappillai Azhaippu  |
| `wedding`        | Wedding        | Shubh Vivah     | Shubh Vivah      | Shubhvivah    | Hast Melap       | Shubho Bibaho | Thirumanam          |
| `vidaai`         | Vidaai         | Vidaai          | Vidaai           | Pathavani     | Kanya Viday      | Bidaay        |                     |

Roka, engagement, mehendi, sangeet and reception keep their names from section 4. All names are drafts for community review (section 10).

**For the packs still to come (Step 23)**, the functions their cards list, mapped to the ids above where they match and new ids where they don't:

- **Punjabi and Sikh:** Roka, Chunni, Kurmai (`engagement`), Chooda, Jaggo, Maiyan (`haldi`), Mehendi, Sangeet, Sehrabandi and Ghodi (`baraat`), Milni (`baraat-welcome`), Anand Karaj (`anand-karaj`), Doli (`vidaai`), Reception.
- **Telugu:** Nischitartham (`engagement`), Pellikuturu and Pellikoduku (`haldi`), Snathakam, Kasi Yatra, Muhurtham, Talambralu, Reception.
- **Kerala Hindu:** Nischayam (`engagement`), Muhurtham (thali kettu), Sadya (`bhoj`), Reception.
- **Muslim:** Mangni (`engagement`), Manjha (`haldi`), Mehndi, Baraat, Nikah (`nikah`), Rukhsati (`vidaai`), Walima (`walima`).
- **Christian:** Engagement, Bridal shower, Holy Matrimony (`wedding`), Reception.
- **Tamil, not yet in the pack:** Sumangali Prarthanai, Pallikai Thellichal, Kasi Yatra, Oonjal (all part of the wedding day).

Sources: [Gujarati kankotri guide](https://www.weddingkart.co/blog/gujarati-wedding-invitation-card-kankotri-tahuko-guide), [Gujarati rituals](https://www.fineartproduction.com/post/gujarati-wedding-rituals-ganesh-puja-pithi-mandap-muhurat-grah-satak-mameru-vero-beach-orlando), [Gujarati mandap muhurat and Ganesh sthapana](https://www.sanskarteaching.com/post/gujarati-wedding-traditions-mandap-mahoorat-ganesh-sthaapnaa-thaambli-poojan-1), [Rajasthani card with Mayra, Tilak, Nikasi](https://pikaaso.com/product/vibrant-royal-rajasthani-wedding-celebration-invitation-with-mayra-bhaat-battisi-kacholar-shubh-tilak-sangeet-haldi-korath-nikasi-baraat-wedding-reception-and-phere-events/), [Marwari rituals](https://www.weddingbazaar.com/blog/marwari-wedding-rituals), [Maharashtrian rituals](https://www.culturalindia.net/weddings/regional-weddings/maharashtrian-wedding.html), [Marathi lagna patrika format](https://www.parekhcards.com/cardwordings/marathi-lagn-patrika-format.asp), [Bengali Hindu wedding](https://en.wikipedia.org/wiki/Bengali_Hindu_wedding), [Tamil wedding events](https://rawinvites.com/tamil-wedding-event-breakdown/), [Tamil wedding rituals](https://www.weddingwire.in/wedding-tips/tamil-marriage--c6381).
