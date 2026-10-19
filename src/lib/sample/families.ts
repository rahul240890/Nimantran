import { CATEGORIES, type CategoryId } from "@/lib/categories/catalog";
import { noSide, type DraftFamily, type FamilyContact, type Relation } from "@/lib/editor/family";
import type { CardLanguage } from "@/lib/templates/card-languages";
import type { Faith } from "@/lib/traditions/faith";
import type { WordingId } from "@/lib/traditions/schema";

/*
 * The made-up families on a design's public sample (/sample/<design>): each side's parents
 * and home town, the grandparents' blessings, the hosts, the cousins waiting to welcome,
 * the little ones' line, a line in memory and whom to call, just as a host fills them in
 * the editor's family section. Each language has its own region's names, each faith its
 * own way of writing them, and a wedding's families change from design to design, so the
 * samples don't all read alike. Like the packs, they wait for a native proofread
 * (docs/TRADITIONS.md, section 7). Phone numbers are masked, so nobody's real one shows.
 */

type Wording = Partial<Record<WordingId, string>>;
/** A side as the editor takes it: the parents as the family writes them, and their town. */
type Side = readonly [parents: string, town: string];

type WeddingFamily = Wording & {
  sides: readonly [groom: Side, bride: Side];
  memory?: string;
  contacts?: readonly FamilyContact[];
};

/** One household, for every occasion but a wedding: a birthday, a festival, a puja. */
type HomeFamily = Required<Wording> & { side: Side; contacts: readonly FamilyContact[] };

type HomeFaith = "hindu" | "sikh" | "muslim" | "christian";

type Families = {
  /** A Hindu wedding and a modern one have a few families, so designs side by side differ. */
  weddings: Record<Faith, readonly WeddingFamily[]>;
  homes: Record<HomeFaith, HomeFamily>;
};

const call = (name: string, last: string): FamilyContact => ({
  name,
  // Kept whole on a line, as one number
  phone: `+91\u00a098XXX\u00a0XXX${last}`,
});

const FAMILIES: Record<CardLanguage, Families> = {
  en: {
    weddings: {
      hindu: [
        {
          blessingsFrom: "Smt. Kamla Devi & Shri Mohan Lal Sharma",
          sides: [
            ["Smt. Sunita & Shri Ramesh Sharma", "Jaipur"],
            ["Smt. Kavita & Shri Anil Mehta", "Udaipur"],
          ],
          memory: "Late Shri Hari Narayan Sharma",
          requesters: "Shri Vinod & Smt. Rekha Sharma",
          children: "Do come to our chachu's wedding! Ishaan and Myra",
        },
        {
          blessingsFrom: "Smt. Shanti Devi Agarwal",
          sides: [
            ["Smt. Neelam & Shri Suresh Agarwal", "Lucknow"],
            ["Smt. Anjali & Shri Rajeev Gupta", "Kanpur"],
          ],
          welcome: "Ankit, Shruti, Varun and all the cousins",
          contacts: [call("Ankit Agarwal", "21"), call("Varun Gupta", "34")],
        },
        {
          sides: [
            ["Smt. Madhuri & Shri Prakash Joshi", "Indore"],
            ["Smt. Hema & Shri Kiran Vyas", "Bhopal"],
          ],
          memory: "Late Smt. Sarla & Late Shri Gopal Joshi",
          requesters: "The Joshi and Vyas families",
          welcome: "Aditya, Sneha and Rohan",
          children: "We are waiting for you at our mama's wedding! Kiara and Vihaan",
        },
      ],
      none: [
        {
          sides: [
            ["Mrs. Ritu & Mr. Sameer Kapoor", "Delhi"],
            ["Mrs. Leena & Mr. Arvind Rao", "Bengaluru"],
          ],
          requesters: "The Kapoor and Rao families",
          contacts: [call("Kabir Kapoor", "56")],
        },
        {
          sides: [
            ["Nisha & Rajat Malhotra", "Mumbai"],
            ["Deepa & Manoj Nair", "Kochi"],
          ],
          welcome: "Tanya, Dev and all our friends",
        },
      ],
      sikh: [
        {
          blessingsFrom: "Sardarni Gurmeet Kaur & Sardar Harbans Singh",
          sides: [
            ["Sardarni Jaspreet Kaur & Sardar Manjit Singh Gill", "Amritsar"],
            ["Sardarni Harpreet Kaur & Sardar Kulwant Singh Sandhu", "Ludhiana"],
          ],
          requesters: "The Gill and Sandhu families",
          children: "Come soon, it's our chacha ji's wedding! Gurleen and Jasraj",
        },
      ],
      muslim: [
        {
          sides: [
            ["Begum Nasreen & Janab Iqbal Ahmed Khan", "Lucknow"],
            ["Begum Shabana & Janab Salim Qureshi", "Hyderabad"],
          ],
          memory: "Marhoom Janab Abdul Rashid Khan",
          requesters: "The Khan and Qureshi families",
          welcome: "Faiz, Sana, Arham and Inaya",
        },
      ],
      christian: [
        {
          blessingsFrom: "Mrs. Rosy & Mr. Anthony D'Souza",
          sides: [
            ["Mrs. Mary & Mr. Thomas D'Souza", "Goa"],
            ["Mrs. Grace & Mr. Joseph Fernandes", "Mangaluru"],
          ],
          requesters: "The D'Souza and Fernandes families",
          contacts: [call("Neil D'Souza", "67")],
        },
      ],
      jain: [
        {
          blessingsFrom: "Smt. Pushpa Devi Jain",
          sides: [
            ["Smt. Sangeeta & Shri Mahendra Kumar Jain", "Indore"],
            ["Smt. Rekha & Shri Ashok Shah", "Ahmedabad"],
          ],
          memory: "Late Shri Shantilal Jain",
          requesters: "The Jain and Shah families",
          children: "Do come to our bhaiya's wedding! Arihant and Kavya",
        },
      ],
    },
    homes: {
      hindu: {
        side: ["Smt. Neha & Shri Vikram Malhotra", "Jaipur"],
        blessingsFrom: "Smt. Kamla Devi & Shri Mohan Lal Malhotra",
        requesters: "The Malhotra family",
        welcome: "Rohan, Priya, Kunal and Simran",
        children: "Do come, we have saved a sweet for you! Ishaan and Myra",
        contacts: [call("Vikram Malhotra", "45")],
      },
      sikh: {
        side: ["Sardarni Simran Kaur & Sardar Gurpreet Singh Bedi", "Amritsar"],
        blessingsFrom: "Sardarni Gurmeet Kaur & Sardar Harbans Singh Bedi",
        requesters: "The Bedi family",
        welcome: "Jasleen, Harman and Navjot",
        children: "Do come, there will be lots of bhangra! Gurleen and Jasraj",
        contacts: [call("Gurpreet Singh Bedi", "78")],
      },
      muslim: {
        side: ["Begum Sana & Janab Imran Siddiqui", "Lucknow"],
        blessingsFrom: "Begum Zubeida & Janab Rafiq Siddiqui",
        requesters: "The Siddiqui family",
        welcome: "Faiz, Alina and Arham",
        children: "Do come, we have saved sevaiyan for you! Inaya and Zayan",
        contacts: [call("Imran Siddiqui", "89")],
      },
      christian: {
        side: ["Mrs. Rita & Mr. Francis Pereira", "Goa"],
        blessingsFrom: "Mrs. Lily & Mr. Peter Pereira",
        requesters: "The Pereira family",
        welcome: "Neil, Tanya and Ryan",
        children: "Do come, there will be cake! Ava and Noah",
        contacts: [call("Francis Pereira", "90")],
      },
    },
  },
  hi: {
    weddings: {
      hindu: [
        {
          blessingsFrom: "श्रीमती कमला देवी एवं श्री मोहन लाल शर्मा",
          sides: [
            ["श्रीमती सुनीता एवं श्री रमेश शर्मा", "जयपुर"],
            ["श्रीमती कविता एवं श्री अनिल मेहता", "उदयपुर"],
          ],
          memory: "स्व. श्री हरि नारायण शर्मा",
          requesters: "श्री विनोद एवं श्रीमती रेखा शर्मा",
          children: "मेरे चाचू की शादी में ज़रूर आना! ईशान, मायरा",
        },
        {
          blessingsFrom: "श्रीमती शांति देवी अग्रवाल",
          sides: [
            ["श्रीमती नीलम एवं श्री सुरेश अग्रवाल", "लखनऊ"],
            ["श्रीमती अंजलि एवं श्री राजीव गुप्ता", "कानपुर"],
          ],
          welcome: "अंकित, श्रुति, वरुण एवं समस्त भाई-बहन",
          contacts: [call("अंकित अग्रवाल", "21"), call("वरुण गुप्ता", "34")],
        },
        {
          sides: [
            ["श्रीमती माधुरी एवं श्री प्रकाश जोशी", "इंदौर"],
            ["श्रीमती हेमा एवं श्री किरण व्यास", "भोपाल"],
          ],
          memory: "स्व. श्रीमती सरला एवं स्व. श्री गोपाल जोशी",
          requesters: "जोशी एवं व्यास परिवार",
          welcome: "आदित्य, स्नेहा, रोहन",
          children: "मेरे मामा की शादी में ज़रूर आना! कियारा, विहान",
        },
      ],
      none: [
        {
          sides: [
            ["श्रीमती रितु एवं श्री समीर कपूर", "दिल्ली"],
            ["श्रीमती लीना एवं श्री अरविंद राव", "बेंगलुरु"],
          ],
          requesters: "कपूर एवं राव परिवार",
          contacts: [call("कबीर कपूर", "56")],
        },
        {
          sides: [
            ["निशा और रजत मल्होत्रा", "मुंबई"],
            ["दीपा और मनोज नायर", "कोच्चि"],
          ],
          welcome: "तान्या, देव और हमारे सभी दोस्त",
        },
      ],
      sikh: [
        {
          blessingsFrom: "सरदारनी गुरमीत कौर एवं सरदार हरबंस सिंह",
          sides: [
            ["सरदारनी जसप्रीत कौर एवं सरदार मनजीत सिंह गिल", "अमृतसर"],
            ["सरदारनी हरप्रीत कौर एवं सरदार कुलवंत सिंह संधू", "लुधियाना"],
          ],
          requesters: "गिल एवं संधू परिवार",
          children: "जल्दी आना, साडे चाचा जी दा विआह है! गुरलीन, जसराज",
        },
      ],
      muslim: [
        {
          sides: [
            ["बेगम नसरीन और जनाब इक़बाल अहमद ख़ान", "लखनऊ"],
            ["बेगम शबाना और जनाब सलीम क़ुरैशी", "हैदराबाद"],
          ],
          memory: "मरहूम जनाब अब्दुल रशीद ख़ान",
          requesters: "ख़ान और क़ुरैशी परिवार",
          welcome: "फ़ैज़, सना, अरहम, इनाया",
        },
      ],
      christian: [
        {
          blessingsFrom: "श्रीमती रोज़ी एवं श्री एंथनी डिसूज़ा",
          sides: [
            ["श्रीमती मैरी एवं श्री थॉमस डिसूज़ा", "गोवा"],
            ["श्रीमती ग्रेस एवं श्री जोसेफ़ फ़र्नांडिस", "मंगलुरु"],
          ],
          requesters: "डिसूज़ा एवं फ़र्नांडिस परिवार",
          contacts: [call("नील डिसूज़ा", "67")],
        },
      ],
      jain: [
        {
          blessingsFrom: "श्रीमती पुष्पा देवी जैन",
          sides: [
            ["श्रीमती संगीता एवं श्री महेंद्र कुमार जैन", "इंदौर"],
            ["श्रीमती रेखा एवं श्री अशोक शाह", "अहमदाबाद"],
          ],
          memory: "स्व. श्री शांतिलाल जैन",
          requesters: "जैन एवं शाह परिवार",
          children: "मेरे भैया की शादी में ज़रूर आना! अरिहंत, काव्या",
        },
      ],
    },
    homes: {
      hindu: {
        side: ["श्रीमती नेहा एवं श्री विक्रम मल्होत्रा", "जयपुर"],
        blessingsFrom: "श्रीमती कमला देवी एवं श्री मोहन लाल मल्होत्रा",
        requesters: "मल्होत्रा परिवार",
        welcome: "रोहन, प्रिया, कुणाल, सिमरन",
        children: "ज़रूर आना, आपके लिए मिठाई रखी है! ईशान, मायरा",
        contacts: [call("विक्रम मल्होत्रा", "45")],
      },
      sikh: {
        side: ["सरदारनी सिमरन कौर एवं सरदार गुरप्रीत सिंह बेदी", "अमृतसर"],
        blessingsFrom: "सरदारनी गुरमीत कौर एवं सरदार हरबंस सिंह बेदी",
        requesters: "बेदी परिवार",
        welcome: "जसलीन, हरमन, नवजोत",
        children: "ज़रूर आना, ख़ूब भंगड़ा होगा! गुरलीन, जसराज",
        contacts: [call("गुरप्रीत सिंह बेदी", "78")],
      },
      muslim: {
        side: ["बेगम सना और जनाब इमरान सिद्दीक़ी", "लखनऊ"],
        blessingsFrom: "बेगम ज़ुबैदा और जनाब रफ़ीक़ सिद्दीक़ी",
        requesters: "सिद्दीक़ी परिवार",
        welcome: "फ़ैज़, अलीना, अरहम",
        children: "ज़रूर आना, आपके लिए सेवइयाँ रखी हैं! इनाया, ज़ायन",
        contacts: [call("इमरान सिद्दीक़ी", "89")],
      },
      christian: {
        side: ["श्रीमती रीटा एवं श्री फ़्रांसिस परेरा", "गोवा"],
        blessingsFrom: "श्रीमती लिली एवं श्री पीटर परेरा",
        requesters: "परेरा परिवार",
        welcome: "नील, तान्या, रायन",
        children: "ज़रूर आना, केक भी है! एवा, नोआ",
        contacts: [call("फ़्रांसिस परेरा", "90")],
      },
    },
  },
  mr: {
    weddings: {
      hindu: [
        {
          blessingsFrom: "सौ. कमला व श्री. मोहन देशपांडे",
          sides: [
            ["सौ. सुनीता व श्री. रमेश देशपांडे", "पुणे"],
            ["सौ. कविता व श्री. अनिल कुलकर्णी", "नाशिक"],
          ],
          memory: "कै. श्री. हरी नारायण देशपांडे",
          requesters: "श्री. विनोद व सौ. रेखा देशपांडे",
          children: "माझ्या काकाच्या लग्नाला नक्की या! ईशान, मायरा",
        },
        {
          blessingsFrom: "सौ. शांताबाई पाटील",
          sides: [
            ["सौ. नीलम व श्री. सुरेश पाटील", "कोल्हापूर"],
            ["सौ. अंजली व श्री. राजीव जोशी", "सातारा"],
          ],
          welcome: "अंकित, श्रुती, वरुण आणि सर्व भावंडे",
          contacts: [call("अंकित पाटील", "21"), call("वरुण जोशी", "34")],
        },
        {
          sides: [
            ["सौ. माधुरी व श्री. प्रकाश गोखले", "मुंबई"],
            ["सौ. हेमा व श्री. किरण भिडे", "ठाणे"],
          ],
          memory: "कै. सौ. सरला व कै. श्री. गोपाळ गोखले",
          requesters: "गोखले व भिडे परिवार",
          welcome: "आदित्य, स्नेहा, रोहन",
          children: "माझ्या मामाच्या लग्नाला नक्की या! कियारा, विहान",
        },
      ],
      none: [
        {
          sides: [
            ["सौ. ऋतू व श्री. समीर कपूर", "दिल्ली"],
            ["सौ. लीना व श्री. अरविंद राव", "बेंगळुरू"],
          ],
          requesters: "कपूर व राव परिवार",
          contacts: [call("कबीर कपूर", "56")],
        },
        {
          sides: [
            ["निशा व रजत मल्होत्रा", "मुंबई"],
            ["दीपा व मनोज नायर", "कोची"],
          ],
          welcome: "तान्या, देव आणि आमचे सर्व मित्र",
        },
      ],
      sikh: [
        {
          blessingsFrom: "सरदारनी गुरमीत कौर व सरदार हरबंस सिंग",
          sides: [
            ["सरदारनी जसप्रीत कौर व सरदार मनजीत सिंग गिल", "अमृतसर"],
            ["सरदारनी हरप्रीत कौर व सरदार कुलवंत सिंग संधू", "लुधियाना"],
          ],
          requesters: "गिल व संधू परिवार",
          children: "लवकर या, आमच्या चाचाजींचं लग्न आहे! गुरलीन, जसराज",
        },
      ],
      muslim: [
        {
          sides: [
            ["बेगम नसरीन व जनाब इक्बाल अहमद खान", "औरंगाबाद"],
            ["बेगम शबाना व जनाब सलीम कुरेशी", "हैदराबाद"],
          ],
          memory: "मरहूम जनाब अब्दुल रशीद खान",
          requesters: "खान व कुरेशी परिवार",
          welcome: "फैज, सना, अरहम, इनाया",
        },
      ],
      christian: [
        {
          blessingsFrom: "सौ. रोझी व श्री. अँथनी डिसोझा",
          sides: [
            ["सौ. मेरी व श्री. थॉमस डिसोझा", "वसई"],
            ["सौ. ग्रेस व श्री. जोसेफ फर्नांडिस", "गोवा"],
          ],
          requesters: "डिसोझा व फर्नांडिस परिवार",
          contacts: [call("नील डिसोझा", "67")],
        },
      ],
      jain: [
        {
          blessingsFrom: "सौ. पुष्पा जैन",
          sides: [
            ["सौ. संगीता व श्री. महेंद्रकुमार जैन", "पुणे"],
            ["सौ. रेखा व श्री. अशोक शहा", "सांगली"],
          ],
          memory: "कै. श्री. शांतीलाल जैन",
          requesters: "जैन व शहा परिवार",
          children: "माझ्या दादाच्या लग्नाला नक्की या! अरिहंत, काव्या",
        },
      ],
    },
    homes: {
      hindu: {
        side: ["सौ. नेहा व श्री. विक्रम जोशी", "पुणे"],
        blessingsFrom: "सौ. कमला व श्री. मोहन जोशी",
        requesters: "जोशी परिवार",
        welcome: "रोहन, प्रिया, कुणाल, सायली",
        children: "नक्की या, तुमच्यासाठी मिठाई ठेवली आहे! ईशान, मायरा",
        contacts: [call("विक्रम जोशी", "45")],
      },
      sikh: {
        side: ["सरदारनी सिमरन कौर व सरदार गुरप्रीत सिंग बेदी", "नांदेड"],
        blessingsFrom: "सरदारनी गुरमीत कौर व सरदार हरबंस सिंग बेदी",
        requesters: "बेदी परिवार",
        welcome: "जसलीन, हरमन, नवजोत",
        children: "नक्की या, खूप भांगडा होणार! गुरलीन, जसराज",
        contacts: [call("गुरप्रीत सिंग बेदी", "78")],
      },
      muslim: {
        side: ["बेगम सना व जनाब इम्रान सिद्दीकी", "औरंगाबाद"],
        blessingsFrom: "बेगम झुबैदा व जनाब रफीक सिद्दीकी",
        requesters: "सिद्दीकी परिवार",
        welcome: "फैज, अलीना, अरहम",
        children: "नक्की या, तुमच्यासाठी शीरखुर्मा ठेवला आहे! इनाया, झायन",
        contacts: [call("इम्रान सिद्दीकी", "89")],
      },
      christian: {
        side: ["सौ. रीटा व श्री. फ्रान्सिस परेरा", "वसई"],
        blessingsFrom: "सौ. लिली व श्री. पीटर परेरा",
        requesters: "परेरा परिवार",
        welcome: "नील, तान्या, रायन",
        children: "नक्की या, केकसुद्धा आहे! एव्हा, नोआ",
        contacts: [call("फ्रान्सिस परेरा", "90")],
      },
    },
  },
  gu: {
    weddings: {
      hindu: [
        {
          blessingsFrom: "શ્રીમતી કમળાબેન તથા શ્રી મોહનભાઈ પટેલ",
          sides: [
            ["શ્રીમતી સુનીતાબેન તથા શ્રી રમેશભાઈ પટેલ", "અમદાવાદ"],
            ["શ્રીમતી કવિતાબેન તથા શ્રી અનિલભાઈ શાહ", "વડોદરા"],
          ],
          memory: "સ્વ. શ્રી હરિભાઈ પટેલ",
          requesters: "શ્રી વિનોદભાઈ તથા શ્રીમતી રેખાબેન પટેલ",
          children: "મારા કાકાના લગ્નમાં જરૂર આવજો! ઈશાન, માયરા",
        },
        {
          blessingsFrom: "શ્રીમતી શાંતાબેન દેસાઈ",
          sides: [
            ["શ્રીમતી નીલમબેન તથા શ્રી સુરેશભાઈ દેસાઈ", "સુરત"],
            ["શ્રીમતી અંજલિબેન તથા શ્રી રાજીવભાઈ મહેતા", "રાજકોટ"],
          ],
          welcome: "અંકિત, શ્રુતિ, વરુણ અને સૌ ભાઈ-બહેનો",
          contacts: [call("અંકિત દેસાઈ", "21"), call("વરુણ મહેતા", "34")],
        },
        {
          sides: [
            ["શ્રીમતી માધુરીબેન તથા શ્રી પ્રકાશભાઈ જોષી", "ભાવનગર"],
            ["શ્રીમતી હેમાબેન તથા શ્રી કિરણભાઈ વ્યાસ", "જામનગર"],
          ],
          memory: "સ્વ. શ્રીમતી સરલાબેન તથા સ્વ. શ્રી ગોપાલભાઈ જોષી",
          requesters: "જોષી પરિવાર અને વ્યાસ પરિવાર",
          welcome: "આદિત્ય, સ્નેહા, રોહન",
          children: "મારા મામાના લગ્નમાં જરૂર આવજો! કિયારા, વિહાન",
        },
      ],
      none: [
        {
          sides: [
            ["શ્રીમતી રિતુ તથા શ્રી સમીર કપૂર", "દિલ્હી"],
            ["શ્રીમતી લીના તથા શ્રી અરવિંદ રાવ", "બેંગલુરુ"],
          ],
          requesters: "કપૂર પરિવાર અને રાવ પરિવાર",
          contacts: [call("કબીર કપૂર", "56")],
        },
        {
          sides: [
            ["નિશા અને રજત મલ્હોત્રા", "મુંબઈ"],
            ["દીપા અને મનોજ નાયર", "કોચી"],
          ],
          welcome: "તાન્યા, દેવ અને અમારા સૌ મિત્રો",
        },
      ],
      sikh: [
        {
          blessingsFrom: "સરદારની ગુરમીત કૌર તથા સરદાર હરબંસ સિંહ",
          sides: [
            ["સરદારની જસપ્રીત કૌર તથા સરદાર મનજીત સિંહ ગિલ", "અમૃતસર"],
            ["સરદારની હરપ્રીત કૌર તથા સરદાર કુલવંત સિંહ સંધુ", "લુધિયાણા"],
          ],
          requesters: "ગિલ પરિવાર અને સંધુ પરિવાર",
          children: "જલદી આવજો, અમારા ચાચાજીના લગ્ન છે! ગુરલીન, જસરાજ",
        },
      ],
      muslim: [
        {
          sides: [
            ["બેગમ નસરીન અને જનાબ ઇકબાલ અહમદ ખાન", "અમદાવાદ"],
            ["બેગમ શબાના અને જનાબ સલીમ કુરેશી", "ભરૂચ"],
          ],
          memory: "મરહૂમ જનાબ અબ્દુલ રશીદ ખાન",
          requesters: "ખાન પરિવાર અને કુરેશી પરિવાર",
          welcome: "ફૈઝ, સના, અરહમ, ઇનાયા",
        },
      ],
      christian: [
        {
          blessingsFrom: "શ્રીમતી રોઝી તથા શ્રી એન્થની ડિસોઝા",
          sides: [
            ["શ્રીમતી મેરી તથા શ્રી થોમસ ડિસોઝા", "વડોદરા"],
            ["શ્રીમતી ગ્રેસ તથા શ્રી જોસેફ ફર્નાન્ડિસ", "ગોવા"],
          ],
          requesters: "ડિસોઝા પરિવાર અને ફર્નાન્ડિસ પરિવાર",
          contacts: [call("નીલ ડિસોઝા", "67")],
        },
      ],
      jain: [
        {
          blessingsFrom: "શ્રીમતી પુષ્પાબેન શાહ",
          sides: [
            ["શ્રીમતી સંગીતાબેન તથા શ્રી મહેન્દ્રભાઈ શાહ", "પાલનપુર"],
            ["શ્રીમતી રેખાબેન તથા શ્રી અશોકભાઈ મહેતા", "મુંબઈ"],
          ],
          memory: "સ્વ. શ્રી શાંતિલાલ શાહ",
          requesters: "શાહ પરિવાર અને મહેતા પરિવાર",
          children: "મારા ભાઈના લગ્નમાં જરૂર આવજો! અરિહંત, કાવ્યા",
        },
      ],
    },
    homes: {
      hindu: {
        side: ["શ્રીમતી નેહાબેન તથા શ્રી વિક્રમભાઈ પટેલ", "અમદાવાદ"],
        blessingsFrom: "શ્રીમતી કમળાબેન તથા શ્રી મોહનભાઈ પટેલ",
        requesters: "પટેલ પરિવાર",
        welcome: "રોહન, પ્રિયા, કુણાલ, ધ્વનિ",
        children: "જરૂર આવજો, તમારા માટે મીઠાઈ રાખી છે! ઈશાન, માયરા",
        contacts: [call("વિક્રમ પટેલ", "45")],
      },
      sikh: {
        side: ["સરદારની સિમરન કૌર તથા સરદાર ગુરપ્રીત સિંહ બેદી", "અમૃતસર"],
        blessingsFrom: "સરદારની ગુરમીત કૌર તથા સરદાર હરબંસ સિંહ બેદી",
        requesters: "બેદી પરિવાર",
        welcome: "જસલીન, હરમન, નવજોત",
        children: "જરૂર આવજો, ખૂબ ભાંગડા થશે! ગુરલીન, જસરાજ",
        contacts: [call("ગુરપ્રીત સિંહ બેદી", "78")],
      },
      muslim: {
        side: ["બેગમ સના અને જનાબ ઇમરાન સિદ્દીકી", "અમદાવાદ"],
        blessingsFrom: "બેગમ ઝુબૈદા અને જનાબ રફીક સિદ્દીકી",
        requesters: "સિદ્દીકી પરિવાર",
        welcome: "ફૈઝ, અલીના, અરહમ",
        children: "જરૂર આવજો, તમારા માટે સેવૈયાં રાખી છે! ઇનાયા, ઝાયન",
        contacts: [call("ઇમરાન સિદ્દીકી", "89")],
      },
      christian: {
        side: ["શ્રીમતી રીટા તથા શ્રી ફ્રાન્સિસ પરેરા", "વડોદરા"],
        blessingsFrom: "શ્રીમતી લિલી તથા શ્રી પીટર પરેરા",
        requesters: "પરેરા પરિવાર",
        welcome: "નીલ, તાન્યા, રાયન",
        children: "જરૂર આવજો, કેક પણ છે! એવા, નોઆ",
        contacts: [call("ફ્રાન્સિસ પરેરા", "90")],
      },
    },
  },
  bn: {
    weddings: {
      hindu: [
        {
          blessingsFrom: "শ্রীমতী কমলা ও শ্রী মোহন বসু",
          sides: [
            ["শ্রীমতী সুনীতা ও শ্রী রমেশ বসু", "কলকাতা"],
            ["শ্রীমতী কবিতা ও শ্রী অনিল সেন", "শান্তিনিকেতন"],
          ],
          memory: "স্বর্গীয় শ্রী হরিনারায়ণ বসু",
          requesters: "শ্রী বিনোদ ও শ্রীমতী রেখা বসু",
          children: "আমার কাকুর বিয়েতে অবশ্যই এসো! ঈশান, মায়রা",
        },
        {
          blessingsFrom: "শ্রীমতী শান্তি চট্টোপাধ্যায়",
          sides: [
            ["শ্রীমতী নীলিমা ও শ্রী সুরেশ চট্টোপাধ্যায়", "হাওড়া"],
            ["শ্রীমতী অঞ্জলি ও শ্রী রাজীব মুখোপাধ্যায়", "বর্ধমান"],
          ],
          welcome: "অঙ্কিত, শ্রুতি, বরুণ ও সব ভাইবোন",
          contacts: [call("অঙ্কিত চট্টোপাধ্যায়", "21"), call("বরুণ মুখোপাধ্যায়", "34")],
        },
        {
          sides: [
            ["শ্রীমতী মাধুরী ও শ্রী প্রকাশ দত্ত", "শিলিগুড়ি"],
            ["শ্রীমতী হেমা ও শ্রী কিরণ ঘোষ", "দুর্গাপুর"],
          ],
          memory: "স্বর্গীয়া শ্রীমতী সরলা ও স্বর্গীয় শ্রী গোপাল দত্ত",
          requesters: "দত্ত ও ঘোষ পরিবার",
          welcome: "আদিত্য, স্নেহা, রোহন",
          children: "আমার মামার বিয়েতে অবশ্যই এসো! কিয়ারা, বিহান",
        },
      ],
      none: [
        {
          sides: [
            ["শ্রীমতী ঋতু ও শ্রী সমীর কাপুর", "দিল্লি"],
            ["শ্রীমতী লীনা ও শ্রী অরবিন্দ রাও", "বেঙ্গালুরু"],
          ],
          requesters: "কাপুর ও রাও পরিবার",
          contacts: [call("কবীর কাপুর", "56")],
        },
        {
          sides: [
            ["নিশা ও রজত মলহোত্রা", "মুম্বই"],
            ["দীপা ও মনোজ নায়ার", "কোচি"],
          ],
          welcome: "তানিয়া, দেব ও আমাদের সব বন্ধু",
        },
      ],
      sikh: [
        {
          blessingsFrom: "সরদারনি গুরমিত কৌর ও সরদার হরবংশ সিং",
          sides: [
            ["সরদারনি জসপ্রীত কৌর ও সরদার মনজিৎ সিং গিল", "অমৃতসর"],
            ["সরদারনি হরপ্রীত কৌর ও সরদার কুলবন্ত সিং সান্ধু", "লুধিয়ানা"],
          ],
          requesters: "গিল ও সান্ধু পরিবার",
          children: "তাড়াতাড়ি এসো, আমাদের চাচাজির বিয়ে! গুরলিন, জসরাজ",
        },
      ],
      muslim: [
        {
          sides: [
            ["বেগম নাসরিন ও জনাব ইকবাল আহমেদ খান", "কলকাতা"],
            ["বেগম শাবানা ও জনাব সেলিম কুরেশি", "মুর্শিদাবাদ"],
          ],
          memory: "মরহুম জনাব আব্দুর রশিদ খান",
          requesters: "খান ও কুরেশি পরিবার",
          welcome: "ফয়েজ, সানা, আরহাম, ইনায়া",
        },
      ],
      christian: [
        {
          blessingsFrom: "শ্রীমতী রোজি ও শ্রী অ্যান্টনি ডি'সুজা",
          sides: [
            ["শ্রীমতী মেরি ও শ্রী টমাস ডি'সুজা", "কলকাতা"],
            ["শ্রীমতী গ্রেস ও শ্রী জোসেফ ফার্নান্ডেজ", "ব্যান্ডেল"],
          ],
          requesters: "ডি'সুজা ও ফার্নান্ডেজ পরিবার",
          contacts: [call("নীল ডি'সুজা", "67")],
        },
      ],
      jain: [
        {
          blessingsFrom: "শ্রীমতী পুষ্পা জৈন",
          sides: [
            ["শ্রীমতী সঙ্গীতা ও শ্রী মহেন্দ্র কুমার জৈন", "কলকাতা"],
            ["শ্রীমতী রেখা ও শ্রী অশোক শাহ", "আজিমগঞ্জ"],
          ],
          memory: "স্বর্গীয় শ্রী শান্তিলাল জৈন",
          requesters: "জৈন ও শাহ পরিবার",
          children: "আমার দাদার বিয়েতে অবশ্যই এসো! অরিহন্ত, কাব্য",
        },
      ],
    },
    homes: {
      hindu: {
        side: ["শ্রীমতী নেহা ও শ্রী বিক্রম বসু", "কলকাতা"],
        blessingsFrom: "শ্রীমতী কমলা ও শ্রী মোহন বসু",
        requesters: "বসু পরিবার",
        welcome: "রোহন, প্রিয়া, কুণাল, তিন্নি",
        children: "অবশ্যই এসো, তোমার জন্য মিষ্টি রাখা আছে! ঈশান, মায়রা",
        contacts: [call("বিক্রম বসু", "45")],
      },
      sikh: {
        side: ["সরদারনি সিমরন কৌর ও সরদার গুরপ্রীত সিং বেদী", "কলকাতা"],
        blessingsFrom: "সরদারনি গুরমিত কৌর ও সরদার হরবংশ সিং বেদী",
        requesters: "বেদী পরিবার",
        welcome: "জসলিন, হরমন, নবজোত",
        children: "অবশ্যই এসো, অনেক ভাংড়া হবে! গুরলিন, জসরাজ",
        contacts: [call("গুরপ্রীত সিং বেদী", "78")],
      },
      muslim: {
        side: ["বেগম সানা ও জনাব ইমরান সিদ্দিকি", "কলকাতা"],
        blessingsFrom: "বেগম জুবেদা ও জনাব রফিক সিদ্দিকি",
        requesters: "সিদ্দিকি পরিবার",
        welcome: "ফয়েজ, আলিনা, আরহাম",
        children: "অবশ্যই এসো, তোমার জন্য সেমাই রাখা আছে! ইনায়া, জায়ান",
        contacts: [call("ইমরান সিদ্দিকি", "89")],
      },
      christian: {
        side: ["শ্রীমতী রিটা ও শ্রী ফ্রান্সিস পেরেরা", "কলকাতা"],
        blessingsFrom: "শ্রীমতী লিলি ও শ্রী পিটার পেরেরা",
        requesters: "পেরেরা পরিবার",
        welcome: "নীল, তানিয়া, রায়ান",
        children: "অবশ্যই এসো, কেকও আছে! আভা, নোয়া",
        contacts: [call("ফ্রান্সিস পেরেরা", "90")],
      },
    },
  },
  ta: {
    weddings: {
      hindu: [
        {
          blessingsFrom: "திருமதி கமலா & திரு மோகன் ஐயர்",
          sides: [
            ["திருமதி சுனிதா & திரு ரமேஷ் ஐயர்", "சென்னை"],
            ["திருமதி கவிதா & திரு அனில் ராமன்", "மதுரை"],
          ],
          memory: "அமரர் திரு ஹரிநாராயணன் ஐயர்",
          requesters: "திரு வினோத் & திருமதி ரேகா ஐயர்",
          children: "எங்கள் சித்தப்பாவின் கல்யாணத்துக்கு கட்டாயம் வாங்க! ஈஷான், மைரா",
        },
        {
          blessingsFrom: "திருமதி சாந்தா சுப்பிரமணியன்",
          sides: [
            ["திருமதி நீலா & திரு சுரேஷ் சுப்பிரமணியன்", "கோயம்புத்தூர்"],
            ["திருமதி அஞ்சலி & திரு ராஜீவ் கிருஷ்ணன்", "திருச்சி"],
          ],
          welcome: "அங்கித், ஸ்ருதி, வருண் மற்றும் அனைத்து உறவினர்கள்",
          contacts: [call("அங்கித் சுப்பிரமணியன்", "21"), call("வருண் கிருஷ்ணன்", "34")],
        },
        {
          sides: [
            ["திருமதி மாதுரி & திரு பிரகாஷ் வெங்கடேசன்", "தஞ்சாவூர்"],
            ["திருமதி ஹேமா & திரு கிரண் நடராஜன்", "சேலம்"],
          ],
          memory: "அமரர் திருமதி சரளா & அமரர் திரு கோபால் வெங்கடேசன்",
          requesters: "வெங்கடேசன் மற்றும் நடராஜன் குடும்பத்தினர்",
          welcome: "ஆதித்யா, சினேகா, ரோஹன்",
          children: "எங்கள் மாமாவின் கல்யாணத்துக்கு கட்டாயம் வாங்க! கியாரா, விஹான்",
        },
      ],
      none: [
        {
          sides: [
            ["திருமதி ரிது & திரு சமீர் கபூர்", "டெல்லி"],
            ["திருமதி லீனா & திரு அரவிந்த் ராவ்", "பெங்களூரு"],
          ],
          requesters: "கபூர் மற்றும் ராவ் குடும்பத்தினர்",
          contacts: [call("கபீர் கபூர்", "56")],
        },
        {
          sides: [
            ["நிஷா & ரஜத் மல்ஹோத்ரா", "மும்பை"],
            ["தீபா & மனோஜ் நாயர்", "கொச்சி"],
          ],
          welcome: "தான்யா, தேவ் மற்றும் எங்கள் நண்பர்கள் அனைவரும்",
        },
      ],
      sikh: [
        {
          blessingsFrom: "சர்தார்னி குர்மீத் கௌர் & சர்தார் ஹர்பன்ஸ் சிங்",
          sides: [
            ["சர்தார்னி ஜஸ்ப்ரீத் கௌர் & சர்தார் மன்ஜீத் சிங் கில்", "அமிர்தசரஸ்"],
            ["சர்தார்னி ஹர்ப்ரீத் கௌர் & சர்தார் குல்வந்த் சிங் சந்து", "லூதியானா"],
          ],
          requesters: "கில் மற்றும் சந்து குடும்பத்தினர்",
          children: "சீக்கிரம் வாங்க, எங்கள் சாச்சாஜியின் கல்யாணம்! குர்லீன், ஜஸ்ராஜ்",
        },
      ],
      muslim: [
        {
          sides: [
            ["பேகம் நஸ்ரீன் & ஜனாப் இக்பால் அஹமது கான்", "சென்னை"],
            ["பேகம் ஷபானா & ஜனாப் சலீம் குரேஷி", "வேலூர்"],
          ],
          memory: "மர்ஹூம் ஜனாப் அப்துல் ரஷீத் கான்",
          requesters: "கான் மற்றும் குரேஷி குடும்பத்தினர்",
          welcome: "ஃபைஸ், சனா, அர்ஹம், இனாயா",
        },
      ],
      christian: [
        {
          blessingsFrom: "திருமதி ரோஸி & திரு அந்தோணி டிசோசா",
          sides: [
            ["திருமதி மேரி & திரு தாமஸ் டிசோசா", "தூத்துக்குடி"],
            ["திருமதி கிரேஸ் & திரு ஜோசப் பெர்னாண்டோ", "நாகர்கோவில்"],
          ],
          requesters: "டிசோசா மற்றும் பெர்னாண்டோ குடும்பத்தினர்",
          contacts: [call("நீல் டிசோசா", "67")],
        },
      ],
      jain: [
        {
          blessingsFrom: "திருமதி புஷ்பா ஜெயின்",
          sides: [
            ["திருமதி சங்கீதா & திரு மகேந்திர குமார் ஜெயின்", "சென்னை"],
            ["திருமதி ரேகா & திரு அசோக் ஷா", "மதுரை"],
          ],
          memory: "அமரர் திரு சாந்திலால் ஜெயின்",
          requesters: "ஜெயின் மற்றும் ஷா குடும்பத்தினர்",
          children: "எங்கள் அண்ணனின் கல்யாணத்துக்கு கட்டாயம் வாங்க! அரிஹந்த், காவ்யா",
        },
      ],
    },
    homes: {
      hindu: {
        side: ["திருமதி நேஹா & திரு விக்ரம் ஐயர்", "சென்னை"],
        blessingsFrom: "திருமதி கமலா & திரு மோகன் ஐயர்",
        requesters: "ஐயர் குடும்பத்தினர்",
        welcome: "ரோஹன், பிரியா, குணால், மீரா",
        children: "கட்டாயம் வாங்க, உங்களுக்காக இனிப்பு வைத்திருக்கிறோம்! ஈஷான், மைரா",
        contacts: [call("விக்ரம் ஐயர்", "45")],
      },
      sikh: {
        side: ["சர்தார்னி சிம்ரன் கௌர் & சர்தார் குர்ப்ரீத் சிங் பேடி", "சென்னை"],
        blessingsFrom: "சர்தார்னி குர்மீத் கௌர் & சர்தார் ஹர்பன்ஸ் சிங் பேடி",
        requesters: "பேடி குடும்பத்தினர்",
        welcome: "ஜஸ்லீன், ஹர்மன், நவ்ஜோத்",
        children: "கட்டாயம் வாங்க, நிறைய பாங்க்ரா இருக்கு! குர்லீன், ஜஸ்ராஜ்",
        contacts: [call("குர்ப்ரீத் சிங் பேடி", "78")],
      },
      muslim: {
        side: ["பேகம் சனா & ஜனாப் இம்ரான் சித்திக்கி", "சென்னை"],
        blessingsFrom: "பேகம் ஜுபைதா & ஜனாப் ரஃபீக் சித்திக்கி",
        requesters: "சித்திக்கி குடும்பத்தினர்",
        welcome: "ஃபைஸ், அலினா, அர்ஹம்",
        children: "கட்டாயம் வாங்க, உங்களுக்காக சேமியா வைத்திருக்கிறோம்! இனாயா, ஜாயன்",
        contacts: [call("இம்ரான் சித்திக்கி", "89")],
      },
      christian: {
        side: ["திருமதி ரீட்டா & திரு பிரான்சிஸ் பெரேரா", "சென்னை"],
        blessingsFrom: "திருமதி லில்லி & திரு பீட்டர் பெரேரா",
        requesters: "பெரேரா குடும்பத்தினர்",
        welcome: "நீல், தான்யா, ரயான்",
        children: "கட்டாயம் வாங்க, கேக்கும் இருக்கு! ஏவா, நோவா",
        contacts: [call("பிரான்சிஸ் பெரேரா", "90")],
      },
    },
  },
};

/**
 * What an occasion's family page carries: a child's parents (a birthday, a naming), a
 * couple's children (an anniversary), a household's hosts (a festival, a puja), only the
 * mourning family (a prayer meet), a business's founders, or no more than whom to call.
 */
type Kind = "child" | "couple" | "home" | "memorial" | "hosts" | "call";

const GROUP_KIND: Record<string, Kind> = {
  birthdays: "child",
  baby: "child",
  education: "child",
  festivals: "home",
  "home-religious": "home",
  parties: "call",
  business: "hosts",
};

const OCCASION_KIND: Partial<Record<CategoryId, Kind>> = {
  anniversary: "couple",
  "baby-shower": "home",
  retirement: "home",
  "prayer-meet": "memorial",
  launch: "call",
};

/** The blocks each kind of occasion fills, from the household's family. */
const KIND_WORDING: Record<Kind, readonly WordingId[]> = {
  child: ["blessingsFrom", "welcome", "children"],
  couple: ["blessingsFrom", "requesters", "welcome", "children"],
  home: ["blessingsFrom", "requesters", "welcome", "children"],
  memorial: ["requesters"],
  hosts: ["blessingsFrom", "requesters"],
  call: [],
};

/** The same design always gets the same family; the next one along likely another. */
function pick(id: string, count: number): number {
  let sum = 0;
  for (const char of id) sum = (sum * 31 + char.charCodeAt(0)) % 9973;
  return sum % count;
}

export type SampleFamily = { family: DraftFamily; wording: Wording };

/** The family a design's sample shows, for its occasion, faith and language. */
export function sampleFamily(
  designId: string,
  category: CategoryId,
  faith: Faith,
  language: CardLanguage,
): SampleFamily {
  const families = FAMILIES[language];
  const side = ([parents, town]: Side, relation: Relation) => ({ relation, parents, town });
  const occasion = CATEGORIES[category];

  if (occasion.group === "wedding-journey") {
    const list = families.weddings[faith];
    const { sides, memory = "", contacts = [], ...wording } = list[pick(designId, list.length)]!;
    return {
      family: {
        first: side(sides[0], "son"),
        second: side(sides[1], "daughter"),
        memory,
        contacts: [...contacts],
      },
      wording,
    };
  }

  const home =
    families.homes[
      faith === "sikh" || faith === "muslim" || faith === "christian" ? faith : "hindu"
    ];
  const kind = OCCASION_KIND[category] ?? GROUP_KIND[occasion.group] ?? "call";
  // The sample's one name is a girl's (Aanya); a thread ceremony's is simply their child
  const relation: Relation = category === "thread-ceremony" ? "child" : "daughter";
  return {
    family: {
      first: kind === "child" ? side(home.side, relation) : noSide,
      second: noSide,
      memory: "",
      contacts: kind === "couple" ? [] : [...home.contacts],
    },
    wording: Object.fromEntries(KIND_WORDING[kind].map((id) => [id, home[id]])),
  };
}
