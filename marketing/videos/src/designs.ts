/*
 * The designs the "Design of the day" reels show, with the same art the site uses
 * (nimantran/public/suites and public/openings/gates) and made-up families. Gate holes are
 * copied from PAINTED_GATES in nimantran/src/lib/opening/catalog.ts.
 */

export type Lang = "en" | "hi";
export type Words = Record<Lang, string>;

export type Hole = { left: number; top: number; width: number; height: number };

export type Page = {
  /** The painted page, under public/. */
  src: string;
  title: Words;
  when: Words;
  where: Words;
};

export type Design = {
  id: string;
  name: Words;
  /** What the design is, from the site's own description. */
  about: Words;
  /** The tradition and the raga, one line. */
  tag: Words;
  gate: { id: string; hole: Hole };
  raga: string;
  couple: Record<Lang, { first: string; second: string }>;
  date: Words;
  blessing: Words;
  /** A sacred painting shown whole, with nothing over the deity, before the cover. */
  blessingPage?: { src: string; textTop: number };
  cover: {
    src: string;
    /** Where the lettering starts, % from the top, so it sits in the painting's open sky. */
    top: number;
    blessingColor: string;
    namesColor: string;
    shadow: string;
  };
  /** Where the event card sits on each page, % from the top, clear of the art. */
  cardTop: number;
  /** Zoom pages about their top edge, so a deity at the top is never cropped. */
  keepTop?: boolean;
  headingColor: string;
  pages: Page[];
};

const GANESHA: Words = {
  en: "With the blessings of\nLord Ganesha",
  hi: "॥ श्री गणेशाय नमः ॥",
};

export const DESIGNS: Record<string, Design> = {
  "rajwada-bagh": {
    id: "rajwada-bagh",
    name: { en: "Rajwada Bagh", hi: "रजवाड़ा बाग़" },
    about: {
      en: "A palace garden seen through a Mughal arch",
      hi: "मुग़ल मेहराब से दिखता महल का बाग़",
    },
    tag: { en: "Rajasthani wedding · Raga Bihag", hi: "राजस्थानी शादी · राग बिहाग" },
    gate: { id: "rajwada-pol", hole: { left: 19.7, top: 12.1, width: 60.6, height: 87.9 } },
    raga: "bihag",
    couple: { en: { first: "Arjun", second: "Sia" }, hi: { first: "अर्जुन", second: "सिया" } },
    date: { en: "Saturday, 13 February 2027", hi: "शनिवार, 13 फ़रवरी 2027" },
    blessing: GANESHA,
    cover: {
      src: "suites/rajwada-bagh/cover.webp",
      top: 17,
      blessingColor: "#a8334f",
      namesColor: "#1f4234",
      shadow: "0 0 24px rgba(255, 244, 214, 0.9)",
    },
    cardTop: 19,
    headingColor: "#1f4234",
    pages: [
      {
        src: "suites/rajwada-bagh/haldi.webp",
        title: { en: "Haldi", hi: "हल्दी" },
        when: { en: "Friday, 12 February · 10:00 AM", hi: "शुक्रवार, 12 फ़रवरी · सुबह 10 बजे" },
        where: { en: "Family home, Jaipur", hi: "हमारा घर, जयपुर" },
      },
      {
        src: "suites/rajwada-bagh/mehendi.webp",
        title: { en: "Mehendi", hi: "मेहंदी" },
        when: { en: "Friday, 12 February · 4:00 PM", hi: "शुक्रवार, 12 फ़रवरी · शाम 4 बजे" },
        where: { en: "The courtyard, Jaipur", hi: "आँगन, जयपुर" },
      },
      {
        src: "suites/rajwada-bagh/sangeet.webp",
        title: { en: "Sangeet", hi: "संगीत" },
        when: { en: "Friday, 12 February · 8:00 PM", hi: "शुक्रवार, 12 फ़रवरी · रात 8 बजे" },
        where: { en: "Rooftop lawns, Jaipur", hi: "छत का लॉन, जयपुर" },
      },
      {
        src: "suites/rajwada-bagh/wedding.webp",
        title: { en: "Wedding", hi: "विवाह" },
        when: { en: "Saturday, 13 February · 7:30 PM", hi: "शनिवार, 13 फ़रवरी · शाम 7:30 बजे" },
        where: { en: "Rambagh Palace, Jaipur", hi: "रामबाग़ पैलेस, जयपुर" },
      },
    ],
  },
  "kutch-toran": {
    id: "kutch-toran",
    name: { en: "Kutch Toran", hi: "कच्छ तोरण" },
    about: {
      en: "A Kutch courtyard in mirror work and bandhani",
      hi: "शीशे के काम और बांधनी से सजा कच्छ का आँगन",
    },
    tag: { en: "Gujarati wedding · Raga Pilu", hi: "गुजराती शादी · राग पीलू" },
    gate: { id: "haveli-kiwad", hole: { left: 21.1, top: 19.3, width: 57.5, height: 80.7 } },
    raga: "pilu",
    couple: { en: { first: "Dhruv", second: "Kavya" }, hi: { first: "ध्रुव", second: "काव्या" } },
    date: { en: "Saturday, 23 January 2027", hi: "शनिवार, 23 जनवरी 2027" },
    blessing: GANESHA,
    cover: {
      src: "suites/kutch-toran/cover.webp",
      top: 27,
      blessingColor: "#a3174f",
      namesColor: "#3b2230",
      shadow: "0 0 26px rgba(255, 236, 220, 0.95)",
    },
    cardTop: 21,
    headingColor: "#7a1440",
    pages: [
      {
        src: "suites/kutch-toran/haldi.webp",
        title: { en: "Pithi", hi: "पीठी" },
        when: { en: "Friday, 22 January · 9:00 AM", hi: "शुक्रवार, 22 जनवरी · सुबह 9 बजे" },
        where: { en: "Family home, Bhuj", hi: "हमारा घर, भुज" },
      },
      {
        src: "suites/kutch-toran/mehendi.webp",
        title: { en: "Mehendi", hi: "मेहंदी" },
        when: { en: "Friday, 22 January · 3:00 PM", hi: "शुक्रवार, 22 जनवरी · दोपहर 3 बजे" },
        where: { en: "The courtyard, Bhuj", hi: "आँगन, भुज" },
      },
      {
        src: "suites/kutch-toran/sangeet.webp",
        title: { en: "Garba night", hi: "गरबा रात" },
        when: { en: "Friday, 22 January · 8:30 PM", hi: "शुक्रवार, 22 जनवरी · रात 8:30 बजे" },
        where: { en: "Lakeside lawns, Bhuj", hi: "झील किनारे लॉन, भुज" },
      },
      {
        src: "suites/kutch-toran/wedding.webp",
        title: { en: "Wedding", hi: "विवाह" },
        when: { en: "Saturday, 23 January · 7:00 PM", hi: "शनिवार, 23 जनवरी · शाम 7 बजे" },
        where: { en: "Toran Bagh, Bhuj", hi: "तोरण बाग़, भुज" },
      },
    ],
  },
  tanjore: {
    id: "tanjore",
    name: { en: "Tanjore", hi: "तंजौर" },
    about: {
      en: "A Thanjavur painting in gold leaf and gems",
      hi: "सोने के पत्तर और रत्नों वाली तंजौर चित्रकला",
    },
    tag: { en: "Tamil wedding · Raga Hamsadhwani", hi: "तमिल शादी · राग हंसध्वनि" },
    gate: { id: "gopuram-kadhavu", hole: { left: 15.4, top: 4.9, width: 69, height: 95.1 } },
    raga: "hamsadhwani",
    couple: {
      en: { first: "Karthik", second: "Meenakshi" },
      hi: { first: "कार्तिक", second: "मीनाक्षी" },
    },
    date: { en: "Friday, 5 February 2027", hi: "शुक्रवार, 5 फ़रवरी 2027" },
    blessing: GANESHA,
    blessingPage: { src: "suites/tanjore/blessing.webp", textTop: 70 },
    cover: {
      src: "suites/tanjore/cover.webp",
      top: 27,
      blessingColor: "#f0c56a",
      namesColor: "#fbecd0",
      shadow: "0 2px 18px rgba(60, 8, 8, 0.6)",
    },
    cardTop: 31,
    keepTop: true,
    headingColor: "#5a0f1f",
    pages: [
      {
        src: "suites/tanjore/haldi.webp",
        title: { en: "Nalangu", hi: "नलंगु" },
        when: { en: "Thursday, 4 February · 10:00 AM", hi: "गुरुवार, 4 फ़रवरी · सुबह 10 बजे" },
        where: { en: "Family home, Thanjavur", hi: "हमारा घर, तंजावुर" },
      },
      {
        src: "suites/tanjore/mehendi.webp",
        title: { en: "Mehendi", hi: "मेहंदी" },
        when: { en: "Thursday, 4 February · 4:00 PM", hi: "गुरुवार, 4 फ़रवरी · शाम 4 बजे" },
        where: { en: "The courtyard, Thanjavur", hi: "आँगन, तंजावुर" },
      },
      {
        src: "suites/tanjore/sangeet.webp",
        title: { en: "Sangeet", hi: "संगीत" },
        when: { en: "Thursday, 4 February · 7:30 PM", hi: "गुरुवार, 4 फ़रवरी · शाम 7:30 बजे" },
        where: { en: "Temple town hall, Thanjavur", hi: "मंदिर नगर सभागार, तंजावुर" },
      },
      {
        src: "suites/tanjore/wedding.webp",
        title: { en: "Muhurtham", hi: "मुहूर्तम" },
        when: { en: "Friday, 5 February · 6:30 AM", hi: "शुक्रवार, 5 फ़रवरी · सुबह 6:30 बजे" },
        where: { en: "Kalyana Mandapam, Thanjavur", hi: "कल्याण मंडपम, तंजावुर" },
      },
    ],
  },
};

export const DESIGN_IDS = Object.keys(DESIGNS);
