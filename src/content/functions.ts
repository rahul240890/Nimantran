import type { FunctionId } from "@/lib/editor/draft";

/* Each function's name, what happens at it and what to wear, apart from the rest of the
 * editor's words so the guest page, which names the functions, carries only these. */

export const functionCopy: Record<
  FunctionId,
  { name: string; description: string; dressIdeas: string[] }
> = {
  roka: {
    name: "Roka",
    description: "The families bless the match and exchange gifts",
    dressIdeas: ["Festive ethnic", "Reds and golds", "Pastel suits and sarees"],
  },
  engagement: {
    name: "Engagement",
    description: "The ring ceremony, sagai or nischayathartham",
    dressIdeas: ["Indo-western", "Pastels and ivory", "Festive ethnic"],
  },
  tilak: {
    name: "Tilak",
    description: "The bride's family blesses the groom with a tilak and gifts",
    dressIdeas: ["Festive ethnic", "Kurta and bandhgala", "Reds and golds"],
  },
  "ganesh-puja": {
    name: "Ganesh puja",
    description: "Ganesh sthapana or pujan, so the celebrations begin without obstacles",
    dressIdeas: ["Traditional Indian", "Yellows and reds", "Simple and elegant"],
  },
  "grah-shanti": {
    name: "Griha shanti",
    description: "A havan at home to bless the family before the wedding",
    dressIdeas: ["Traditional Indian", "Cotton and silk", "Soft pastels"],
  },
  mandap: {
    name: "Mandap muhurat",
    description: "The mandap is raised and blessed; panthakal in the south",
    dressIdeas: ["Traditional Indian", "Bright and colourful", "Comfortable ethnic"],
  },
  mameru: {
    name: "Mameru",
    description: "The maternal uncle's family brings gifts; mayra or bhaat in the north",
    dressIdeas: ["Bandhani and leheriya", "Festive ethnic", "Reds and pinks"],
  },
  haldi: {
    name: "Haldi",
    description: "Turmeric blessings, usually the morning before",
    dressIdeas: ["Shades of yellow", "Whites and pastels", "Clothes you don't mind staining"],
  },
  mehendi: {
    name: "Mehendi",
    description: "Henna, music and an easy afternoon",
    dressIdeas: ["Greens and florals", "Bright and colourful", "Comfortable ethnic"],
  },
  sangeet: {
    name: "Sangeet",
    description: "An evening of songs, dance and performances",
    dressIdeas: ["Indo-western", "Sequins and sparkle", "Jewel tones"],
  },
  garba: {
    name: "Garba night",
    description: "Raas, garba and dandiya till late",
    dressIdeas: ["Chaniya choli and kediyu", "Mirror work", "Bright and colourful"],
  },
  bhoj: {
    name: "Family feast",
    description: "A meal for family and friends: kelvan, aiburobhat or bhojan samarambh",
    dressIdeas: ["Festive ethnic", "Comfortable ethnic", "Smart casual"],
  },
  baraat: {
    name: "Baraat",
    description: "The groom's procession sets out with music and dancing",
    dressIdeas: ["Safas and turbans", "Sherwani and kurta", "Festive ethnic"],
  },
  "baraat-welcome": {
    name: "Baraat welcome",
    description: "The bride's family welcomes the groom's party: milni or jaan aagman",
    dressIdeas: ["Traditional Indian", "Silk and zari", "Festive ethnic"],
  },
  wedding: {
    name: "Wedding",
    description: "The pheras, vows and ceremony",
    dressIdeas: ["Traditional Indian", "Pastels, no black or white", "Silk and zari"],
  },
  vidaai: {
    name: "Vidaai",
    description: "The bride's farewell as she leaves with blessings",
    dressIdeas: ["Traditional Indian", "Soft pastels", "Silk and zari"],
  },
  reception: {
    name: "Reception",
    description: "Dinner and celebration with everyone",
    dressIdeas: ["Formal", "Black tie", "Festive evening wear"],
  },
  birthday: {
    name: "Birthday party",
    description: "Cake, games and blessings for the birthday",
    dressIdeas: ["Pastels", "Smart casual", "Come as you are"],
  },
  anniversary: {
    name: "Anniversary dinner",
    description: "An evening to celebrate the years together",
    dressIdeas: ["Formal", "Festive ethnic", "Reds and golds"],
  },
  party: {
    name: "Party",
    description: "Music, food and friends",
    dressIdeas: ["Smart casual", "Cocktail", "Something that sparkles"],
  },
  "baby-shower": {
    name: "Baby shower",
    description: "Blessings, songs and gifts for the mother-to-be",
    dressIdeas: ["Pastels", "Festive ethnic", "Greens and yellows"],
  },
  diwali: {
    name: "Diwali party",
    description: "Lakshmi puja, diyas, sweets and dinner",
    dressIdeas: ["Festive ethnic", "Reds and golds", "Something that sparkles"],
  },
  housewarming: {
    name: "Griha pravesh",
    description: "Puja, havan and a meal in the new home",
    dressIdeas: ["Festive ethnic", "Pastels", "Comfortable traditional"],
  },
  puja: {
    name: "Puja",
    description: "Katha, aarti and prasad",
    dressIdeas: ["Festive ethnic", "Whites and yellows", "Traditional"],
  },
  "thread-ceremony": {
    name: "Thread ceremony",
    description: "Upanayan, havan and a family meal",
    dressIdeas: ["Traditional", "Whites and golds", "Festive ethnic"],
  },
  annaprashan: {
    name: "First rice ceremony",
    description: "The baby's first taste of rice, with blessings",
    dressIdeas: ["Pastels", "Festive ethnic", "Yellows and whites"],
  },
  christening: {
    name: "Christening",
    description: "Church service and lunch with family",
    dressIdeas: ["Whites and pastels", "Sunday best", "Smart casual"],
  },
  "prayer-meet": {
    name: "Prayer meeting",
    description: "Prayers, bhajans and a moment of remembrance",
    dressIdeas: ["Whites", "Light colours", "Simple and quiet"],
  },
  retirement: {
    name: "Retirement party",
    description: "Dinner and toasts for a career well lived",
    dressIdeas: ["Smart casual", "Formal", "Festive ethnic"],
  },
  "farewell-party": {
    name: "Farewell party",
    description: "Music, memories and a warm goodbye",
    dressIdeas: ["Formal", "Smart casual", "Something that sparkles"],
  },
  "shop-opening": {
    name: "Opening",
    description: "Ribbon cutting, puja and refreshments",
    dressIdeas: ["Festive ethnic", "Smart casual", "Formal"],
  },
  launch: {
    name: "Launch",
    description: "A first look, a few words and dinner",
    dressIdeas: ["Business formal", "Smart casual", "Black tie"],
  },
  "ganesh-chaturthi": {
    name: "Ganpati darshan",
    description: "Aarti, darshan and prasad",
    dressIdeas: ["Festive ethnic", "Yellows and reds", "Traditional"],
  },
  navratri: {
    name: "Navratri night",
    description: "Garba, aarti and bhog",
    dressIdeas: ["Chaniya choli", "Festive ethnic", "Bright colours"],
  },
  janmashtami: {
    name: "Janmashtami",
    description: "Bhajans, jhanki and midnight aarti",
    dressIdeas: ["Festive ethnic", "Yellows and blues", "Little Krishna outfits"],
  },
  onam: {
    name: "Onam sadhya",
    description: "Pookalam, sadhya and songs",
    dressIdeas: ["Kasavu", "Whites and golds", "Festive ethnic"],
  },
  sankranti: {
    name: "Sankranti",
    description: "Kites, til laddoos and pongal",
    dressIdeas: ["Bright colours", "Festive ethnic", "Comfortable for the terrace"],
  },
  lohri: {
    name: "Lohri bonfire",
    description: "Bonfire, rewari, bhangra and dinner",
    dressIdeas: ["Phulkari", "Bright colours", "Something warm"],
  },
  eid: {
    name: "Iftar dawat",
    description: "Breaking the fast, dinner and Eid wishes",
    dressIdeas: ["Festive ethnic", "Whites and greens", "Something elegant"],
  },
  "naming-ceremony": {
    name: "Naming ceremony",
    description: "Naming, blessings and lunch",
    dressIdeas: ["Pastels", "Festive ethnic", "Something comfortable"],
  },
  holi: {
    name: "Holi",
    description: "Colours, music, thandai and lunch",
    dressIdeas: ["Whites", "Old clothes you can colour", "Comfortable shoes"],
  },
  christmas: {
    name: "Christmas party",
    description: "Carols, plum cake and dinner",
    dressIdeas: ["Reds and greens", "Something festive", "Something warm"],
  },
  reunion: {
    name: "Reunion",
    description: "Old friends, stories and dinner",
    dressIdeas: ["Smart casual", "Your old school colours", "Something comfortable"],
  },
  graduation: {
    name: "Graduation party",
    description: "Cake, family and a proud toast",
    dressIdeas: ["Smart casual", "Something festive", "Your college colours"],
  },
  "gudi-padwa": {
    name: "Gudi Padwa",
    description: "The gudi, prayers and a festive lunch",
    dressIdeas: ["Nauvari and kurtas", "Festive ethnic", "Saffron and green"],
  },
  baisakhi: {
    name: "Baisakhi",
    description: "The harvest, bhangra, giddha and dinner",
    dressIdeas: ["Phulkari", "Bright turbans and duppattas", "Festive ethnic"],
  },
  bihu: {
    name: "Bihu",
    description: "Bihu songs, dance and pitha",
    dressIdeas: ["Mekhela chador", "Gamosa", "Festive ethnic"],
  },
  "raksha-bandhan": {
    name: "Raksha Bandhan",
    description: "Rakhi, aarti, sweets and lunch",
    dressIdeas: ["Festive ethnic", "Bright colours", "Something comfortable"],
  },
  "karva-chauth": {
    name: "Karva Chauth",
    description: "The katha, the moonrise and dinner",
    dressIdeas: ["Reds and golds", "Bridal lehenga or saree", "Something festive"],
  },
};
