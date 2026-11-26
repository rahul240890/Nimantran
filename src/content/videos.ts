import type { UiLocale } from "@/i18n/locales";

/*
 * Words on the sample video pages (src/lib/videos), written for each language's searchers:
 * "invitation video" is how families look for these, in their own script.
 */

/** Bengali's possessive: বিয়ে → বিয়ের, গৃহপ্রবেশ → গৃহপ্রবেশের. */
const bnOf = (word: string) =>
  /[\u0985-\u0994\u09BE-\u09CC]$/.test(word) ? `${word}র` : `${word}ের`;

type VideoWords = {
  videos: string;
  title: (occasion: string, design: string) => string;
  description: (occasion: string, design: string, seconds: number) => string;
  intro: (occasion: string, design: string) => string;
  showsHeading: string;
  shows: readonly string[];
  priceNote: string;
  make: string;
  seeDesigns: (occasion: string) => string;
  wordingHeading: string;
  moreHeading: string;
  indexTitle: string;
  indexDescription: string;
  indexHeading: string;
  indexIntro: string;
  watch: string;
};

export const videoWords: Record<UiLocale, VideoWords> = {
  en: {
    videos: "Invitation videos",
    title: (occasion, design) => `${occasion} invitation video: ${design}`,
    description: (occasion, design, seconds) =>
      `Watch a ${seconds}-second ${occasion.toLowerCase()} invitation video in the ${design} design, then make yours with your names, dates and music for WhatsApp.`,
    intro: (occasion, design) =>
      `This is the video Shubh makes from a ${occasion.toLowerCase()} invitation in the ${design} design, with made-up names. Yours shows your own names, dates, places and photos, ready to send on WhatsApp or post as a status or reel.`,
    showsHeading: "What the video shows",
    shows: [
      "The opening, as guests see it when they tap the link",
      "The names and the blessing on the design's own painting",
      "Every function with its date, time and place",
      "The design's own music, or a song you choose",
      "The invitation's link at the end, so guests can reply",
    ],
    priceNote:
      "Every invitation can watch its video before paying, with a mark across it. The clean video to download comes with the paid packages.",
    make: "Make this video",
    seeDesigns: (occasion) => `More ${occasion.toLowerCase()} designs`,
    wordingHeading: "Wording to go with it",
    moreHeading: "More invitation videos",
    indexTitle: "Invitation video samples for WhatsApp",
    indexDescription:
      "Watch sample wedding, griha pravesh, birthday and festival invitation videos made on Shubh, in English and Indian languages, then make your own.",
    indexHeading: "Invitation video samples",
    indexIntro:
      "Every Shubh invitation can become a short vertical video for WhatsApp, a status or a reel. These samples use made-up names; yours shows your own.",
    watch: "Watch",
  },
  hi: {
    videos: "निमंत्रण वीडियो",
    title: (occasion, design) => `${occasion} निमंत्रण वीडियो: ${design}`,
    description: (occasion, design, seconds) =>
      `${design} डिज़ाइन में ${seconds} सेकंड का ${occasion} निमंत्रण वीडियो देखें, फिर अपने नाम, तारीख़ और संगीत के साथ WhatsApp के लिए अपना वीडियो बनाएँ।`,
    intro: (occasion, design) =>
      `यह वह वीडियो है जो शुभ इन्विटेशन ${design} डिज़ाइन के ${occasion} निमंत्रण से बनाता है, नमूने के नामों के साथ। आपके वीडियो में आपके अपने नाम, तारीख़ें, जगहें और फ़ोटो होंगी, WhatsApp पर भेजने या स्टेटस में लगाने के लिए तैयार।`,
    showsHeading: "वीडियो में क्या दिखता है",
    shows: [
      "द्वार का खुलना, जैसा मेहमान लिंक खोलने पर देखते हैं",
      "डिज़ाइन की अपनी चित्रकारी पर नाम और आशीर्वाद",
      "हर कार्यक्रम की तारीख़, समय और जगह",
      "डिज़ाइन का अपना संगीत, या आपका चुना हुआ गाना",
      "आख़िर में निमंत्रण का लिंक, ताकि मेहमान जवाब दे सकें",
    ],
    priceNote:
      "हर निमंत्रण का वीडियो भुगतान से पहले निशान के साथ देखा जा सकता है। बिना निशान का वीडियो डाउनलोड करने के लिए सशुल्क पैकेज लें।",
    make: "यह वीडियो बनाएँ",
    seeDesigns: (occasion) => `${occasion} के और डिज़ाइन`,
    wordingHeading: "साथ भेजने के लिए संदेश",
    moreHeading: "और निमंत्रण वीडियो",
    indexTitle: "WhatsApp के लिए निमंत्रण वीडियो के नमूने",
    indexDescription:
      "शुभ इन्विटेशन पर बने शादी, गृह प्रवेश, जन्मदिन और त्योहार के निमंत्रण वीडियो के नमूने देखें, फिर अपना वीडियो बनाएँ।",
    indexHeading: "निमंत्रण वीडियो के नमूने",
    indexIntro:
      "शुभ इन्विटेशन का हर निमंत्रण WhatsApp, स्टेटस या रील के लिए छोटा खड़ा वीडियो बन सकता है। इन नमूनों में बनावटी नाम हैं; आपके वीडियो में आपके अपने नाम होंगे।",
    watch: "देखें",
  },
  mr: {
    videos: "निमंत्रण व्हिडिओ",
    title: (occasion, design) => `${occasion} निमंत्रण व्हिडिओ: ${design}`,
    description: (occasion, design, seconds) =>
      `${design} डिझाइनमधील ${seconds} सेकंदांचा ${occasion} निमंत्रण व्हिडिओ पाहा, मग आपली नावे, तारखा आणि संगीत घालून WhatsApp साठी आपला व्हिडिओ बनवा.`,
    intro: (occasion, design) =>
      `शुभ इन्व्हिटेशन ${design} डिझाइनच्या ${occasion} निमंत्रणापासून हा व्हिडिओ बनवते, नमुन्याच्या नावांसह. तुमच्या व्हिडिओत तुमची स्वतःची नावे, तारखा, ठिकाणे आणि फोटो असतील, WhatsApp वर पाठवायला किंवा स्टेटसला ठेवायला तयार.`,
    showsHeading: "व्हिडिओत काय दिसते",
    shows: [
      "पाहुणे लिंक उघडतात तेव्हा दिसणारे दार उघडणे",
      "डिझाइनच्या चित्रावर नावे आणि आशीर्वाद",
      "प्रत्येक कार्यक्रमाची तारीख, वेळ आणि ठिकाण",
      "डिझाइनचे स्वतःचे संगीत किंवा तुम्ही निवडलेले गाणे",
      "शेवटी निमंत्रणाची लिंक, म्हणजे पाहुणे उत्तर देऊ शकतात",
    ],
    priceNote:
      "प्रत्येक निमंत्रणाचा व्हिडिओ पैसे देण्याआधी खुणेसह पाहता येतो. खुणेशिवायचा व्हिडिओ डाउनलोड करण्यासाठी सशुल्क पॅकेज घ्या.",
    make: "हा व्हिडिओ बनवा",
    seeDesigns: (occasion) => `${occasion} चे आणखी डिझाइन`,
    wordingHeading: "सोबत पाठवण्यासाठी मजकूर",
    moreHeading: "आणखी निमंत्रण व्हिडिओ",
    indexTitle: "WhatsApp साठी निमंत्रण व्हिडिओचे नमुने",
    indexDescription:
      "शुभ इन्व्हिटेशनवर बनलेले लग्न, गृहप्रवेश, वाढदिवस आणि सणांचे निमंत्रण व्हिडिओ पाहा, मग आपला बनवा.",
    indexHeading: "निमंत्रण व्हिडिओचे नमुने",
    indexIntro:
      "शुभ इन्व्हिटेशनचे प्रत्येक निमंत्रण WhatsApp, स्टेटस किंवा रीलसाठी छोटा उभा व्हिडिओ बनू शकते. या नमुन्यांत काल्पनिक नावे आहेत.",
    watch: "पाहा",
  },
  gu: {
    videos: "આમંત્રણ વીડિયો",
    title: (occasion, design) => `${occasion} આમંત્રણ વીડિયો: ${design}`,
    description: (occasion, design, seconds) =>
      `${design} ડિઝાઇનમાં ${seconds} સેકન્ડનો ${occasion} આમંત્રણ વીડિયો જુઓ, પછી તમારાં નામ, તારીખ અને સંગીત સાથે WhatsApp માટે તમારો વીડિયો બનાવો.`,
    intro: (occasion, design) =>
      `શુભ ઇન્વિટેશન ${design} ડિઝાઇનના ${occasion} આમંત્રણમાંથી આ વીડિયો બનાવે છે, નમૂનાનાં નામ સાથે. તમારા વીડિયોમાં તમારાં પોતાનાં નામ, તારીખો, સ્થળ અને ફોટા હશે, WhatsApp પર મોકલવા કે સ્ટેટસમાં મૂકવા તૈયાર.`,
    showsHeading: "વીડિયોમાં શું દેખાય છે",
    shows: [
      "મહેમાનો લિંક ખોલે ત્યારે દેખાતું દ્વાર ખૂલવું",
      "ડિઝાઇનના ચિત્ર પર નામ અને આશીર્વાદ",
      "દરેક પ્રસંગની તારીખ, સમય અને સ્થળ",
      "ડિઝાઇનનું પોતાનું સંગીત કે તમે પસંદ કરેલું ગીત",
      "અંતે આમંત્રણની લિંક, જેથી મહેમાનો જવાબ આપી શકે",
    ],
    priceNote:
      "દરેક આમંત્રણનો વીડિયો ચુકવણી પહેલાં નિશાની સાથે જોઈ શકાય છે. નિશાની વગરનો વીડિયો ડાઉનલોડ કરવા માટે પેઇડ પૅકેજ લો.",
    make: "આ વીડિયો બનાવો",
    seeDesigns: (occasion) => `${occasion}ની વધુ ડિઝાઇન`,
    wordingHeading: "સાથે મોકલવા માટે લખાણ",
    moreHeading: "વધુ આમંત્રણ વીડિયો",
    indexTitle: "WhatsApp માટે આમંત્રણ વીડિયોના નમૂના",
    indexDescription:
      "શુભ ઇન્વિટેશન પર બનેલા લગ્ન, ગૃહપ્રવેશ, જન્મદિવસ અને તહેવારના આમંત્રણ વીડિયો જુઓ, પછી તમારો બનાવો.",
    indexHeading: "આમંત્રણ વીડિયોના નમૂના",
    indexIntro:
      "શુભ ઇન્વિટેશનનું દરેક આમંત્રણ WhatsApp, સ્ટેટસ કે રીલ માટે નાનો ઊભો વીડિયો બની શકે છે. આ નમૂનામાં કાલ્પનિક નામ છે.",
    watch: "જુઓ",
  },
  bn: {
    videos: "নিমন্ত্রণ ভিডিও",
    title: (occasion, design) => `${bnOf(occasion)} নিমন্ত্রণ ভিডিও: ${design}`,
    description: (occasion, design, seconds) =>
      `${design} ডিজাইনে ${seconds} সেকেন্ডের ${bnOf(occasion)} নিমন্ত্রণ ভিডিও দেখুন, তারপর নিজের নাম, তারিখ আর গান দিয়ে WhatsApp-এর জন্য আপনার ভিডিও বানান।`,
    intro: (occasion, design) =>
      `শুভ ইনভিটেশন ${design} ডিজাইনের ${bnOf(occasion)} নিমন্ত্রণ থেকে এই ভিডিওটি বানায়, নমুনার নাম দিয়ে। আপনার ভিডিওতে থাকবে আপনার নিজের নাম, তারিখ, জায়গা আর ছবি, WhatsApp-এ পাঠানো বা স্ট্যাটাসে দেওয়ার জন্য তৈরি।`,
    showsHeading: "ভিডিওতে কী দেখা যায়",
    shows: [
      "অতিথিরা লিংক খুললে যেমন দেখেন, তোরণ খোলা",
      "ডিজাইনের নিজের ছবির ওপর নাম আর আশীর্বাদ",
      "প্রতিটি অনুষ্ঠানের তারিখ, সময় আর স্থান",
      "ডিজাইনের নিজের সুর, বা আপনার বাছা গান",
      "শেষে নিমন্ত্রণের লিংক, যাতে অতিথিরা উত্তর দিতে পারেন",
    ],
    priceNote:
      "প্রতিটি নিমন্ত্রণের ভিডিও টাকা দেওয়ার আগে চিহ্নসহ দেখা যায়। চিহ্ন ছাড়া ভিডিও ডাউনলোড করতে পেইড প্যাকেজ নিন।",
    make: "এই ভিডিও বানান",
    seeDesigns: (occasion) => `${bnOf(occasion)} আরও ডিজাইন`,
    wordingHeading: "সঙ্গে পাঠানোর লেখা",
    moreHeading: "আরও নিমন্ত্রণ ভিডিও",
    indexTitle: "WhatsApp-এর জন্য নিমন্ত্রণ ভিডিওর নমুনা",
    indexDescription:
      "শুভ ইনভিটেশনে তৈরি বিয়ে, গৃহপ্রবেশ, জন্মদিন আর উৎসবের নিমন্ত্রণ ভিডিও দেখুন, তারপর নিজেরটা বানান।",
    indexHeading: "নিমন্ত্রণ ভিডিওর নমুনা",
    indexIntro:
      "শুভ ইনভিটেশনের প্রতিটি নিমন্ত্রণ WhatsApp, স্ট্যাটাস বা রিলের জন্য ছোট খাড়া ভিডিও হতে পারে। এই নমুনাগুলোতে কাল্পনিক নাম আছে।",
    watch: "দেখুন",
  },
  ta: {
    videos: "அழைப்பிதழ் வீடியோ",
    title: (occasion, design) => `${occasion} அழைப்பிதழ் வீடியோ: ${design}`,
    description: (occasion, design, seconds) =>
      `${design} வடிவமைப்பில் ${seconds} விநாடி ${occasion} அழைப்பிதழ் வீடியோவைப் பாருங்கள், பிறகு உங்கள் பெயர், தேதி, இசையுடன் WhatsApp-க்கு உங்கள் வீடியோவை உருவாக்குங்கள்.`,
    intro: (occasion, design) =>
      `ஷுப் இன்விடேஷன் ${design} வடிவமைப்பின் ${occasion} அழைப்பிதழிலிருந்து இந்த வீடியோவை உருவாக்குகிறது, மாதிரிப் பெயர்களுடன். உங்கள் வீடியோவில் உங்கள் சொந்தப் பெயர்கள், தேதிகள், இடங்கள், புகைப்படங்கள் இருக்கும்.`,
    showsHeading: "வீடியோவில் என்ன தெரியும்",
    shows: [
      "விருந்தினர்கள் இணைப்பைத் திறக்கும்போது பார்க்கும் வாசல் திறப்பு",
      "வடிவமைப்பின் ஓவியத்தில் பெயர்களும் ஆசீர்வாதமும்",
      "ஒவ்வொரு நிகழ்வின் தேதி, நேரம், இடம்",
      "வடிவமைப்பின் சொந்த இசை, அல்லது நீங்கள் தேர்ந்த பாடல்",
      "இறுதியில் அழைப்பிதழ் இணைப்பு, விருந்தினர்கள் பதில் சொல்ல",
    ],
    priceNote:
      "ஒவ்வொரு அழைப்பிதழின் வீடியோவையும் பணம் செலுத்தும் முன் அடையாளக் குறியுடன் பார்க்கலாம். குறி இல்லாத வீடியோவைப் பதிவிறக்க கட்டணத் தொகுப்பு தேவை.",
    make: "இந்த வீடியோவை உருவாக்குங்கள்",
    seeDesigns: (occasion) => `மேலும் ${occasion} வடிவமைப்புகள்`,
    wordingHeading: "உடன் அனுப்ப வாசகம்",
    moreHeading: "மேலும் அழைப்பிதழ் வீடியோக்கள்",
    indexTitle: "WhatsApp-க்கு அழைப்பிதழ் வீடியோ மாதிரிகள்",
    indexDescription:
      "ஷுப் இன்விடேஷனில் உருவான திருமணம், கிரகப்பிரவேசம், பிறந்தநாள், பண்டிகை அழைப்பிதழ் வீடியோக்களைப் பார்த்து, உங்களுடையதை உருவாக்குங்கள்.",
    indexHeading: "அழைப்பிதழ் வீடியோ மாதிரிகள்",
    indexIntro:
      "ஷுப் இன்விடேஷனின் ஒவ்வொரு அழைப்பிதழும் WhatsApp, ஸ்டேட்டஸ் அல்லது ரீலுக்கான சிறிய செங்குத்து வீடியோவாக மாறலாம். இந்த மாதிரிகளில் கற்பனைப் பெயர்கள் உள்ளன.",
    watch: "பார்க்க",
  },
};
