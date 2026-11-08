import type { UiLocale } from "@/i18n/locales";
import type { CategoryId } from "@/lib/categories/catalog";

/*
 * Questions and answers on an occasion's designs page, written in each language for that
 * language's searchers, not translated word for word. They show under the designs and go
 * to search and answer engines as FAQPage structured data, so each answer stands alone.
 * An occasion without questions in a language shows none there.
 */

export type OccasionQuestion = { q: string; a: string };

type LocaleQuestions = {
  heading: string;
  byOccasion: Partial<Record<CategoryId, readonly OccasionQuestion[]>>;
};

export const occasionQuestions: Record<UiLocale, LocaleQuestions> = {
  en: {
    heading: "Questions families ask",
    byOccasion: {
      wedding: [
        {
          q: "When should we send wedding invitations in India?",
          a: "Send them four to six weeks before the first function, and six to eight weeks ahead to elders and guests who travel. A save the date can go three to six months ahead for a destination or wedding-season date.",
        },
        {
          q: "Whom do we give the first wedding card to?",
          a: "Most Hindu families offer the first card to Lord Ganesh or the family deity, then give the next cards in person to the eldest relatives and the maternal family, before inviting anyone else.",
        },
        {
          q: "What should a wedding invitation say?",
          a: "A blessing at the top, who is inviting, the bride's and groom's names with their parents' names, and the date, time and venue of each function, from haldi and mehendi to the pheras and reception.",
        },
        {
          q: "Can one digital invitation hold every wedding function?",
          a: "Yes. A Shubh invitation gives each function its own page with time and map, and guests reply for each one. If a venue or time changes, the same link shows the update.",
        },
        {
          q: "Do guests need an app to open a digital wedding invitation?",
          a: "No. Guests tap the link in WhatsApp and the invitation opens in their phone's browser, with a lighter version for older phones.",
        },
        {
          q: "Can the wedding invitation be in Hindi or another Indian language?",
          a: "Yes. The card can be written in Hindi, Marathi, Gujarati, Bengali, Tamil or English, or in two languages side by side so every elder can read it.",
        },
      ],
      "save-the-date": [
        {
          q: "When should we send a save the date?",
          a: "Three to six months before the wedding, or earlier for a destination wedding or a date in the busy wedding season, so guests can book travel and leave.",
        },
        {
          q: "What should a save the date say?",
          a: "Your names, the wedding date, the city, and a line that the formal invitation will follow. Times and venues can wait for the invitation.",
        },
        {
          q: "Is a save the date the same as a wedding invitation?",
          a: "No. A save the date only asks guests to keep the date free. The invitation comes later with every function, time and venue, and asks guests to reply.",
        },
        {
          q: "Can we send a save the date on WhatsApp?",
          a: "Yes. Send a digital save the date link with a short personal message. Guests open it without an app, and you can send the full invitation to the same people later.",
        },
      ],
    },
  },
  hi: {
    heading: "परिवारों के सवाल",
    byOccasion: {
      wedding: [
        {
          q: "शादी का कार्ड कितने दिन पहले भेजना चाहिए?",
          a: "पहले फ़ंक्शन से चार से छह हफ़्ते पहले कार्ड भेजें। बुज़ुर्गों और बाहर से आने वाले मेहमानों को छह से आठ हफ़्ते पहले न्योता दें।",
        },
        {
          q: "शादी का पहला कार्ड किसे देते हैं?",
          a: "ज़्यादातर परिवार पहला कार्ड गणेश जी या कुलदेवता को चढ़ाते हैं। उसके बाद घर के बुज़ुर्गों और ननिहाल को ख़ुद जाकर कार्ड देते हैं, फिर बाक़ी मेहमानों को।",
        },
        {
          q: "शादी के कार्ड में क्या लिखें?",
          a: "सबसे ऊपर श्री गणेशाय नमः, फिर निमंत्रण देने वाले का नाम, दूल्हा-दुल्हन और उनके माता-पिता के नाम, और हल्दी, मेहंदी, फेरे और रिसेप्शन हर फ़ंक्शन की तारीख़, समय और जगह।",
        },
        {
          q: "क्या एक डिजिटल कार्ड में शादी के सारे फ़ंक्शन आ सकते हैं?",
          a: "हाँ। Shubh के निमंत्रण में हर फ़ंक्शन का अलग पन्ना होता है, समय और नक्शे के साथ, और मेहमान हर फ़ंक्शन के लिए अलग जवाब देते हैं। कुछ बदले तो वही लिंक नई जानकारी दिखाता है।",
        },
        {
          q: "क्या मेहमानों को ऐप डाउनलोड करना पड़ता है?",
          a: "नहीं। मेहमान WhatsApp में लिंक दबाते हैं और निमंत्रण उनके फ़ोन के ब्राउज़र में खुल जाता है, पुराने फ़ोन पर भी।",
        },
      ],
      "save-the-date": [
        {
          q: "सेव द डेट कब भेजें?",
          a: "शादी से तीन से छह महीने पहले। डेस्टिनेशन वेडिंग या शादियों के सीज़न की तारीख़ हो तो और पहले भेजें, ताकि मेहमान टिकट और छुट्टी तय कर सकें।",
        },
        {
          q: "सेव द डेट में क्या लिखें?",
          a: "आप दोनों के नाम, शादी की तारीख़, शहर, और एक लाइन कि निमंत्रण पत्र बाद में आएगा। समय और जगह निमंत्रण में दें।",
        },
        {
          q: "सेव द डेट और शादी के कार्ड में क्या फ़र्क़ है?",
          a: "सेव द डेट सिर्फ़ तारीख़ खाली रखने को कहता है। शादी का कार्ड बाद में आता है, जिसमें हर फ़ंक्शन, समय और जगह होती है और मेहमानों से जवाब माँगा जाता है।",
        },
      ],
    },
  },
  mr: {
    heading: "कुटुंबांचे प्रश्न",
    byOccasion: {
      wedding: [
        {
          q: "लग्नपत्रिका किती दिवस आधी पाठवावी?",
          a: "पहिल्या कार्यक्रमाच्या चार ते सहा आठवडे आधी पत्रिका पाठवा. वडीलधारी मंडळी आणि बाहेरगावच्या पाहुण्यांना सहा ते आठ आठवडे आधी आमंत्रण द्या.",
        },
        {
          q: "पहिली लग्नपत्रिका कोणाला द्यावी?",
          a: "बहुतेक कुटुंबे पहिली पत्रिका गणपतीला आणि कुलदैवताला अर्पण करतात. त्यानंतर घरातील वडीलधाऱ्यांना आणि मामाच्या घरी स्वतः जाऊन पत्रिका देतात.",
        },
        {
          q: "लग्नपत्रिकेत काय लिहावे?",
          a: "वर श्री गणेशाय नमः, नंतर निमंत्रक, वधू-वरांची आणि त्यांच्या आई-वडिलांची नावे, आणि हळद, साखरपुडा, लग्न व स्वागत समारंभ अशा प्रत्येक कार्यक्रमाची तारीख, वेळ आणि ठिकाण.",
        },
        {
          q: "पाहुण्यांना ॲप डाउनलोड करावे लागते का?",
          a: "नाही. पाहुणे WhatsApp मधील लिंकवर टॅप करतात आणि पत्रिका त्यांच्या फोनच्या ब्राउझरमध्ये उघडते.",
        },
      ],
      "save-the-date": [
        {
          q: "सेव्ह द डेट कधी पाठवावे?",
          a: "लग्नाच्या तीन ते सहा महिने आधी. बाहेरगावी लग्न असेल किंवा लग्नसराईतील तारीख असेल तर आणखी आधी पाठवा.",
        },
        {
          q: "सेव्ह द डेटमध्ये काय लिहावे?",
          a: "दोघांची नावे, लग्नाची तारीख, शहर आणि लग्नपत्रिका नंतर येईल अशी एक ओळ. वेळ आणि ठिकाण पत्रिकेत द्या.",
        },
      ],
    },
  },
  gu: {
    heading: "પરિવારોના પ્રશ્નો",
    byOccasion: {
      wedding: [
        {
          q: "લગ્નની કંકોતરી કેટલા દિવસ પહેલાં મોકલવી?",
          a: "પહેલા પ્રસંગના ચારથી છ અઠવાડિયાં પહેલાં કંકોતરી મોકલો. વડીલો અને બહારગામથી આવતા મહેમાનોને છથી આઠ અઠવાડિયાં પહેલાં આમંત્રણ આપો.",
        },
        {
          q: "પહેલી કંકોતરી કોને આપવી?",
          a: "મોટાભાગના પરિવારો પહેલી કંકોતરી ગણેશજી અને કુળદેવીને અર્પણ કરે છે. પછી વડીલોને અને મોસાળમાં રૂબરૂ જઈને કંકોતરી આપે છે.",
        },
        {
          q: "કંકોતરીમાં શું લખવું?",
          a: "ઉપર શ્રી ગણેશાય નમઃ, પછી નિમંત્રક, વર-કન્યા અને તેમનાં માતા-પિતાનાં નામ, અને ગણેશ સ્થાપના, મંડપ મુહૂર્ત, હસ્તમેળાપ અને રિસેપ્શન જેવા દરેક પ્રસંગની તારીખ, સમય અને સ્થળ.",
        },
        {
          q: "મહેમાનોને એપ ડાઉનલોડ કરવી પડે?",
          a: "ના. મહેમાનો WhatsAppમાં લિંક પર ટેપ કરે છે અને કંકોતરી તેમના ફોનના બ્રાઉઝરમાં ખૂલે છે.",
        },
      ],
      "save-the-date": [
        {
          q: "સેવ ધ ડેટ ક્યારે મોકલવું?",
          a: "લગ્નના ત્રણથી છ મહિના પહેલાં. ડેસ્ટિનેશન વેડિંગ કે લગ્નગાળાની તારીખ હોય તો વધુ વહેલું મોકલો.",
        },
        {
          q: "સેવ ધ ડેટમાં શું લખવું?",
          a: "બંનેનાં નામ, લગ્નની તારીખ, શહેર અને કંકોતરી પછી આવશે એવી એક લાઇન. સમય અને સ્થળ કંકોતરીમાં આપો.",
        },
      ],
    },
  },
  bn: {
    heading: "পরিবারের প্রশ্ন",
    byOccasion: {
      wedding: [
        {
          q: "বিয়ের কার্ড কতদিন আগে পাঠাব?",
          a: "প্রথম অনুষ্ঠানের চার থেকে ছয় সপ্তাহ আগে কার্ড পাঠান। গুরুজন আর দূর থেকে আসা অতিথিদের ছয় থেকে আট সপ্তাহ আগে নিমন্ত্রণ করুন।",
        },
        {
          q: "বিয়ের প্রথম কার্ড কাকে দেওয়া হয়?",
          a: "বেশিরভাগ পরিবার প্রথম কার্ড গৃহদেবতা বা ইষ্টদেবতার কাছে নিবেদন করে। তারপর বাড়ির গুরুজন আর মামাবাড়িতে নিজে গিয়ে কার্ড দেয়।",
        },
        {
          q: "বিয়ের কার্ডে কী লিখব?",
          a: "ওপরে শ্রী শ্রী প্রজাপতয়ে নমঃ, তারপর নিমন্ত্রণকর্তা, পাত্র-পাত্রী ও তাঁদের বাবা-মায়ের নাম, আর আশীর্বাদ, গায়ে হলুদ, বিয়ে ও বৌভাতের দিন, সময় ও স্থান।",
        },
        {
          q: "অতিথিদের কি অ্যাপ ডাউনলোড করতে হয়?",
          a: "না। অতিথিরা WhatsApp-এ লিঙ্কে ট্যাপ করেন আর কার্ড তাঁদের ফোনের ব্রাউজারে খুলে যায়।",
        },
      ],
      "save-the-date": [
        {
          q: "সেভ দ্য ডেট কবে পাঠাব?",
          a: "বিয়ের তিন থেকে ছয় মাস আগে। দূরে বিয়ে হলে বা বিয়ের মরসুমের তারিখ হলে আরও আগে পাঠান।",
        },
        {
          q: "সেভ দ্য ডেটে কী লিখব?",
          a: "দুজনের নাম, বিয়ের তারিখ, শহর, আর নিমন্ত্রণ পত্র পরে আসবে এমন একটা লাইন। সময় আর জায়গা কার্ডে দিন।",
        },
      ],
    },
  },
  ta: {
    heading: "குடும்பங்களின் கேள்விகள்",
    byOccasion: {
      wedding: [
        {
          q: "திருமண அழைப்பிதழை எத்தனை நாள் முன் அனுப்ப வேண்டும்?",
          a: "முதல் நிகழ்ச்சிக்கு நான்கு முதல் ஆறு வாரங்களுக்கு முன் அனுப்புங்கள். பெரியவர்களுக்கும் வெளியூர் விருந்தினர்களுக்கும் ஆறு முதல் எட்டு வாரங்களுக்கு முன் அழையுங்கள்.",
        },
        {
          q: "முதல் திருமண அழைப்பிதழை யாருக்குக் கொடுக்க வேண்டும்?",
          a: "பெரும்பாலான குடும்பங்கள் முதல் அழைப்பிதழைப் பிள்ளையாருக்கும் குலதெய்வத்துக்கும் வைத்து வணங்குகின்றன. பிறகு பெரியவர்களுக்கும் தாய்மாமன் குடும்பத்துக்கும் நேரில் கொடுக்கின்றன.",
        },
        {
          q: "திருமண அழைப்பிதழில் என்ன எழுத வேண்டும்?",
          a: "மேலே பிள்ளையார் சுழி, பிறகு அழைப்பவர்கள், மணமக்கள் மற்றும் பெற்றோர் பெயர்கள், நிச்சயதார்த்தம், நலங்கு, முகூர்த்தம், வரவேற்பு ஒவ்வொன்றின் நாள், நேரம், இடம்.",
        },
        {
          q: "விருந்தினர்கள் ஆப் பதிவிறக்க வேண்டுமா?",
          a: "இல்லை. விருந்தினர்கள் WhatsApp-இல் லிங்கைத் தொட்டால் அழைப்பிதழ் அவர்கள் போனின் பிரவுசரில் திறக்கும்.",
        },
      ],
      "save-the-date": [
        {
          q: "சேவ் தி டேட் எப்போது அனுப்ப வேண்டும்?",
          a: "திருமணத்துக்கு மூன்று முதல் ஆறு மாதங்களுக்கு முன். வெளியூர்த் திருமணம் அல்லது முகூர்த்த சீசன் தேதி என்றால் இன்னும் முன்னதாக அனுப்புங்கள்.",
        },
        {
          q: "சேவ் தி டேட்டில் என்ன எழுத வேண்டும்?",
          a: "இருவரின் பெயர்கள், திருமணத் தேதி, ஊர், அழைப்பிதழ் பின்னர் வரும் என்ற ஒரு வரி. நேரமும் இடமும் அழைப்பிதழில் தரலாம்.",
        },
      ],
    },
  },
};
