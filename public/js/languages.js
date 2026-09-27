/**
 * Karigar AI — 80+ Language Configuration & Capability Database
 * Provides structured language metadata, speech recognition codes,
 * search indexing, regional categorizations, and capability indicators.
 */

const KARIGAR_LANGUAGES = [
  // --- Indian Official (22 Scheduled Languages + Indian English) ---
  {
    code: 'hi',
    speechCode: 'hi-IN',
    englishName: 'Hindi',
    nativeName: 'हिन्दी',
    category: 'Indian Official',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['hindi', 'hindustani', 'devanagari', 'भारत', 'उत्तर भारत', 'delhi', 'up', 'mp', 'bihar']
  },
  {
    code: 'ta',
    speechCode: 'ta-IN',
    englishName: 'Tamil',
    nativeName: 'தமிழ்',
    category: 'Indian Official',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['tamil', 'tamil nadu', 'chennai', 'madurai', 'dravidian', 'தமிழ்நாடு']
  },
  {
    code: 'bn',
    speechCode: 'bn-IN',
    englishName: 'Bengali',
    nativeName: 'বাংলা',
    category: 'Indian Official',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['bengali', 'bangla', 'west bengal', 'kolkata', 'dhaka', 'বাঙালি']
  },
  {
    code: 'te',
    speechCode: 'te-IN',
    englishName: 'Telugu',
    nativeName: 'తెలుగు',
    category: 'Indian Official',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['telugu', 'andhra pradesh', 'telangana', 'hyderabad', 'ఆంధ్ర']
  },
  {
    code: 'mr',
    speechCode: 'mr-IN',
    englishName: 'Marathi',
    nativeName: 'मराठी',
    category: 'Indian Official',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['marathi', 'maharashtra', 'mumbai', 'pune', 'महाराष्ट्र']
  },
  {
    code: 'kn',
    speechCode: 'kn-IN',
    englishName: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    category: 'Indian Official',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['kannada', 'karnataka', 'bengaluru', 'mysuru', 'ಕರ್ನಾಟಕ']
  },
  {
    code: 'gu',
    speechCode: 'gu-IN',
    englishName: 'Gujarati',
    nativeName: 'ગુજરાતી',
    category: 'Indian Official',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['gujarati', 'gujarat', 'ahmedabad', 'surat', 'કચ્છ']
  },
  {
    code: 'ml',
    speechCode: 'ml-IN',
    englishName: 'Malayalam',
    nativeName: 'മലയാളം',
    category: 'Indian Official',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['malayalam', 'kerala', 'kochi', 'thiruvananthapuram', 'കേരളം']
  },
  {
    code: 'pa',
    speechCode: 'pa-IN',
    englishName: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    category: 'Indian Official',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['punjabi', 'punjab', 'amritsar', 'gurmukhi', 'ਪੰਜਾਬ']
  },
  {
    code: 'or',
    speechCode: 'or-IN',
    englishName: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    category: 'Indian Official',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['odia', 'oriya', 'odisha', 'bhubaneswar', 'puri', 'ଉତ୍କଳ']
  },
  {
    code: 'as',
    speechCode: 'as-IN',
    englishName: 'Assamese',
    nativeName: 'অসমীয়া',
    category: 'Indian Official',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['assamese', 'assam', 'guwahati', 'brahmaputra', 'অসম']
  },
  {
    code: 'ur',
    speechCode: 'ur-IN',
    englishName: 'Urdu',
    nativeName: 'اردو',
    category: 'Indian Official',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['urdu', 'lucknow', 'hyderabad', 'nastaliq', 'ہندوستان']
  },
  {
    code: 'sa',
    speechCode: null,
    englishName: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    category: 'Indian Official',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['sanskrit', 'vedic', 'classical india', 'संस्कृत']
  },
  {
    code: 'ne',
    speechCode: 'ne-NP',
    englishName: 'Nepali',
    nativeName: 'नेपाली',
    category: 'Indian Official',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['nepali', 'nepal', 'sikkim', 'darjeeling', 'नेपाल']
  },
  {
    code: 'kok',
    speechCode: null,
    englishName: 'Konkani',
    nativeName: 'कोंकणी',
    category: 'Indian Official',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['konkani', 'goa', 'coastal karnataka', 'mangalore', 'गोवा']
  },
  {
    code: 'mni',
    speechCode: null,
    englishName: 'Manipuri (Meitei)',
    nativeName: 'মৈতৈলোন্ / ꯃꯤꯇꯩꯂꯣꯟ',
    category: 'Indian Official',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['manipuri', 'meitei', 'manipur', 'imphal', 'northeast']
  },
  {
    code: 'mai',
    speechCode: null,
    englishName: 'Maithili',
    nativeName: 'मैथिली',
    category: 'Indian Official',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['maithili', 'mithila', 'bihar', 'madhubani', 'जनकपुर']
  },
  {
    code: 'brx',
    speechCode: null,
    englishName: 'Bodo',
    nativeName: 'बड़ो',
    category: 'Indian Official',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['bodo', 'bodoland', 'assam', 'tribal craft']
  },
  {
    code: 'doi',
    speechCode: null,
    englishName: 'Dogri',
    nativeName: 'डोगरी',
    category: 'Indian Official',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['dogri', 'jammu', 'duggar', 'himachal']
  },
  {
    code: 'ks',
    speechCode: null,
    englishName: 'Kashmiri',
    nativeName: 'कॉशुर / کٲشُر',
    category: 'Indian Official',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['kashmiri', 'kashmir', 'srinagar', 'pashmina', 'carpet']
  },
  {
    code: 'sat',
    speechCode: null,
    englishName: 'Santali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    category: 'Indian Official',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['santali', 'ol chiki', 'jharkhand', 'tribal', 'odisha']
  },
  {
    code: 'sd',
    speechCode: null,
    englishName: 'Sindhi',
    nativeName: 'سنڌي / सिन्धी',
    category: 'Indian Official',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['sindhi', 'ajrak', 'kutch', 'sindh']
  },
  {
    code: 'en-IN',
    speechCode: 'en-IN',
    englishName: 'English (India)',
    nativeName: 'Indian English',
    category: 'Indian Official',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['english', 'indian english', 'trade', 'export', 'marketplace']
  },

  // --- Indian Regional & Craft Clusters ---
  {
    code: 'bho',
    speechCode: null,
    englishName: 'Bhojpuri',
    nativeName: 'भोजपुरी',
    category: 'Indian Regional',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['bhojpuri', 'purvanchal', 'bihar', 'varanasi', 'eastern up']
  },
  {
    code: 'raj',
    speechCode: null,
    englishName: 'Rajasthani / Marwari',
    nativeName: 'राजस्थानी / मारवाड़ी',
    category: 'Indian Regional',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['rajasthani', 'marwari', 'jaipur', 'jodhpur', 'blue pottery', 'bandhani']
  },
  {
    code: 'hne',
    speechCode: null,
    englishName: 'Chhattisgarhi',
    nativeName: 'छत्तीसगढ़ी',
    category: 'Indian Regional',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['chhattisgarhi', 'dhokra', 'bastar', 'tribal craft', 'raipur']
  },
  {
    code: 'tcy',
    speechCode: null,
    englishName: 'Tulu',
    nativeName: 'ತುಳು',
    category: 'Indian Regional',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['tulu', 'coastal karnataka', 'udupi', 'dakshina kannada']
  },
  {
    code: 'bgc',
    speechCode: null,
    englishName: 'Haryanvi',
    nativeName: 'हरियाणवी',
    category: 'Indian Regional',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['haryanvi', 'haryana', 'rohtak', 'panipat', 'handloom']
  },

  // --- Global Marketplace Languages: Europe ---
  {
    code: 'en',
    speechCode: 'en-US',
    englishName: 'English (Global)',
    nativeName: 'English (US/UK)',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['english', 'us', 'uk', 'global', 'etsy', 'amazon']
  },
  {
    code: 'es',
    speechCode: 'es-ES',
    englishName: 'Spanish',
    nativeName: 'Español',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['spanish', 'spain', 'latin america', 'mexico', 'españa']
  },
  {
    code: 'fr',
    speechCode: 'fr-FR',
    englishName: 'French',
    nativeName: 'Français',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['french', 'france', 'paris', 'luxury', 'artisanat']
  },
  {
    code: 'de',
    speechCode: 'de-DE',
    englishName: 'German',
    nativeName: 'Deutsch',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['german', 'germany', 'berlin', 'austria', 'handwerk']
  },
  {
    code: 'pt',
    speechCode: 'pt-PT',
    englishName: 'Portuguese',
    nativeName: 'Português',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['portuguese', 'portugal', 'brazil', 'lisbon']
  },
  {
    code: 'it',
    speechCode: 'it-IT',
    englishName: 'Italian',
    nativeName: 'Italiano',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['italian', 'italy', 'rome', 'milan', 'artigianato']
  },
  {
    code: 'nl',
    speechCode: 'nl-NL',
    englishName: 'Dutch',
    nativeName: 'Nederlands',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['dutch', 'netherlands', 'amsterdam', 'holland']
  },
  {
    code: 'ru',
    speechCode: 'ru-RU',
    englishName: 'Russian',
    nativeName: 'Русский',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['russian', 'russia', 'moscow', 'cyrillic']
  },
  {
    code: 'uk',
    speechCode: 'uk-UA',
    englishName: 'Ukrainian',
    nativeName: 'Українська',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['ukrainian', 'ukraine', 'kyiv']
  },
  {
    code: 'pl',
    speechCode: 'pl-PL',
    englishName: 'Polish',
    nativeName: 'Polski',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['polish', 'poland', 'warsaw']
  },
  {
    code: 'cs',
    speechCode: 'cs-CZ',
    englishName: 'Czech',
    nativeName: 'Čeština',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['czech', 'czechia', 'prague', 'bohemia']
  },
  {
    code: 'sk',
    speechCode: 'sk-SK',
    englishName: 'Slovak',
    nativeName: 'Slovenčina',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['slovak', 'slovakia', 'bratislava']
  },
  {
    code: 'ro',
    speechCode: 'ro-RO',
    englishName: 'Romanian',
    nativeName: 'Română',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['romanian', 'romania', 'bucharest']
  },
  {
    code: 'hu',
    speechCode: 'hu-HU',
    englishName: 'Hungarian',
    nativeName: 'Magyar',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['hungarian', 'hungary', 'budapest']
  },
  {
    code: 'el',
    speechCode: 'el-GR',
    englishName: 'Greek',
    nativeName: 'Ελληνικά',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['greek', 'greece', 'athens', 'hellenic']
  },
  {
    code: 'sv',
    speechCode: 'sv-SE',
    englishName: 'Swedish',
    nativeName: 'Svenska',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['swedish', 'sweden', 'stockholm', 'scandinavia']
  },
  {
    code: 'da',
    speechCode: 'da-DK',
    englishName: 'Danish',
    nativeName: 'Dansk',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['danish', 'denmark', 'copenhagen']
  },
  {
    code: 'no',
    speechCode: 'nb-NO',
    englishName: 'Norwegian',
    nativeName: 'Norsk',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['norwegian', 'norway', 'oslo']
  },
  {
    code: 'fi',
    speechCode: 'fi-FI',
    englishName: 'Finnish',
    nativeName: 'Suomi',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['finnish', 'finland', 'helsinki']
  },
  {
    code: 'is',
    speechCode: 'is-IS',
    englishName: 'Icelandic',
    nativeName: 'Íslenska',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['icelandic', 'iceland', 'reykjavik']
  },
  {
    code: 'ga',
    speechCode: null,
    englishName: 'Irish (Gaeilge)',
    nativeName: 'Gaeilge',
    category: 'European',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['irish', 'ireland', 'celtic']
  },
  {
    code: 'cy',
    speechCode: null,
    englishName: 'Welsh',
    nativeName: 'Cymraeg',
    category: 'European',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['welsh', 'wales', 'celtic']
  },
  {
    code: 'sr',
    speechCode: 'sr-RS',
    englishName: 'Serbian',
    nativeName: 'Српски',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['serbian', 'serbia', 'belgrade']
  },
  {
    code: 'hr',
    speechCode: 'hr-HR',
    englishName: 'Croatian',
    nativeName: 'Hrvatski',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['croatian', 'croatia', 'zagreb']
  },
  {
    code: 'bg',
    speechCode: 'bg-BG',
    englishName: 'Bulgarian',
    nativeName: 'Български',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['bulgarian', 'bulgaria', 'sofia']
  },
  {
    code: 'ca',
    speechCode: 'ca-ES',
    englishName: 'Catalan',
    nativeName: 'Català',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['catalan', 'barcelona', 'catalonia']
  },
  {
    code: 'eu',
    speechCode: 'eu-ES',
    englishName: 'Basque',
    nativeName: 'Euskara',
    category: 'European',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['basque', 'euskadi', 'bilbao']
  },

  // --- Global: Middle East & Central Asia ---
  {
    code: 'ar',
    speechCode: 'ar-SA',
    englishName: 'Arabic',
    nativeName: 'العربية',
    category: 'Middle East & Central Asia',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['arabic', 'dubai', 'saudi arabia', 'uae', 'middle east']
  },
  {
    code: 'tr',
    speechCode: 'tr-TR',
    englishName: 'Turkish',
    nativeName: 'Türkçe',
    category: 'Middle East & Central Asia',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['turkish', 'turkey', 'istanbul', 'anatolia']
  },
  {
    code: 'fa',
    speechCode: 'fa-IR',
    englishName: 'Persian (Farsi)',
    nativeName: 'فارسی',
    category: 'Middle East & Central Asia',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['persian', 'farsi', 'iran', 'tehran', 'carpet']
  },
  {
    code: 'he',
    speechCode: 'he-IL',
    englishName: 'Hebrew',
    nativeName: 'עברית',
    category: 'Middle East & Central Asia',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['hebrew', 'israel', 'jerusalem', 'tel aviv']
  },
  {
    code: 'kk',
    speechCode: 'kk-KZ',
    englishName: 'Kazakh',
    nativeName: 'Қазақ тілі',
    category: 'Middle East & Central Asia',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['kazakh', 'kazakhstan', 'astana', 'central asia']
  },
  {
    code: 'uz',
    speechCode: 'uz-UZ',
    englishName: 'Uzbek',
    nativeName: 'Oʻzbek tili',
    category: 'Middle East & Central Asia',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['uzbek', 'uzbekistan', 'tashkent', 'samarkand', 'silk road']
  },
  {
    code: 'az',
    speechCode: 'az-AZ',
    englishName: 'Azerbaijani',
    nativeName: 'Azərbaycan dili',
    category: 'Middle East & Central Asia',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['azerbaijani', 'azerbaijan', 'baku']
  },
  {
    code: 'hy',
    speechCode: 'hy-AM',
    englishName: 'Armenian',
    nativeName: 'Հայերեն',
    category: 'Middle East & Central Asia',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['armenian', 'armenia', 'yerevan']
  },
  {
    code: 'ka',
    speechCode: 'ka-GE',
    englishName: 'Georgian',
    nativeName: 'ქართული',
    category: 'Middle East & Central Asia',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['georgian', 'georgia', 'tbilisi', 'caucasus']
  },
  {
    code: 'ps',
    speechCode: null,
    englishName: 'Pashto',
    nativeName: 'پښتو',
    category: 'Middle East & Central Asia',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['pashto', 'afghanistan', 'kabul']
  },
  {
    code: 'ku',
    speechCode: null,
    englishName: 'Kurdish',
    nativeName: 'Kurdî / کوردی',
    category: 'Middle East & Central Asia',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['kurdish', 'kurdistan']
  },

  // --- Global: East & Southeast Asia ---
  {
    code: 'zh-CN',
    speechCode: 'zh-CN',
    englishName: 'Chinese (Simplified)',
    nativeName: '简体中文',
    category: 'East & Southeast Asia',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['chinese', 'mandarin', 'china', 'beijing', 'shanghai']
  },
  {
    code: 'zh-TW',
    speechCode: 'zh-TW',
    englishName: 'Chinese (Traditional)',
    nativeName: '繁體中文',
    category: 'East & Southeast Asia',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['chinese', 'traditional', 'taiwan', 'hong kong']
  },
  {
    code: 'ja',
    speechCode: 'ja-JP',
    englishName: 'Japanese',
    nativeName: '日本語',
    category: 'East & Southeast Asia',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['japanese', 'japan', 'tokyo', 'craft', 'mingei', 'shokunin']
  },
  {
    code: 'ko',
    speechCode: 'ko-KR',
    englishName: 'Korean',
    nativeName: '한국어',
    category: 'East & Southeast Asia',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['korean', 'korea', 'seoul', 'hangul']
  },
  {
    code: 'th',
    speechCode: 'th-TH',
    englishName: 'Thai',
    nativeName: 'ไทย',
    category: 'East & Southeast Asia',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['thai', 'thailand', 'bangkok', 'chiang mai']
  },
  {
    code: 'vi',
    speechCode: 'vi-VN',
    englishName: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    category: 'East & Southeast Asia',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['vietnamese', 'vietnam', 'hanoi', 'lacquer']
  },
  {
    code: 'id',
    speechCode: 'id-ID',
    englishName: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    category: 'East & Southeast Asia',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['indonesian', 'indonesia', 'jakarta', 'batik', 'bali']
  },
  {
    code: 'ms',
    speechCode: 'ms-MY',
    englishName: 'Malay',
    nativeName: 'Bahasa Melayu',
    category: 'East & Southeast Asia',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['malay', 'malaysia', 'kuala lumpur', 'singapore']
  },
  {
    code: 'fil',
    speechCode: 'fil-PH',
    englishName: 'Filipino (Tagalog)',
    nativeName: 'Filipino / Tagalog',
    category: 'East & Southeast Asia',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['filipino', 'tagalog', 'philippines', 'manila']
  },
  {
    code: 'my',
    speechCode: null,
    englishName: 'Burmese (Myanmar)',
    nativeName: 'မြန်မာဘာသာ',
    category: 'East & Southeast Asia',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['burmese', 'myanmar', 'yangon', 'burma', 'lacquerware']
  },
  {
    code: 'km',
    speechCode: 'km-KH',
    englishName: 'Khmer',
    nativeName: 'ភាសាខ្មែរ',
    category: 'East & Southeast Asia',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['khmer', 'cambodia', 'phnom penh', 'angkor']
  },
  {
    code: 'lo',
    speechCode: 'lo-LA',
    englishName: 'Lao',
    nativeName: 'ພາສາລາວ',
    category: 'East & Southeast Asia',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['lao', 'laos', 'vientiane']
  },
  {
    code: 'mn',
    speechCode: 'mn-MN',
    englishName: 'Mongolian',
    nativeName: 'Монгол хэл',
    category: 'East & Southeast Asia',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['mongolian', 'mongolia', 'ulaanbaatar']
  },
  {
    code: 'bo',
    speechCode: null,
    englishName: 'Tibetan',
    nativeName: 'བོད་སྐད',
    category: 'East & Southeast Asia',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['tibetan', 'tibet', 'lhasa', 'thangka', 'himalayan']
  },
  {
    code: 'si',
    speechCode: 'si-LK',
    englishName: 'Sinhala',
    nativeName: 'සිංහල',
    category: 'East & Southeast Asia',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['sinhala', 'sri lanka', 'colombo']
  },

  // --- Global: Africa ---
  {
    code: 'sw',
    speechCode: 'sw-KE',
    englishName: 'Swahili',
    nativeName: 'Kiswahili',
    category: 'African',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['swahili', 'kenya', 'tanzania', 'east africa']
  },
  {
    code: 'am',
    speechCode: 'am-ET',
    englishName: 'Amharic',
    nativeName: 'አማርኛ',
    category: 'African',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['amharic', 'ethiopia', 'addis ababa']
  },
  {
    code: 'ha',
    speechCode: null,
    englishName: 'Hausa',
    nativeName: 'Harshen Hausa',
    category: 'African',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['hausa', 'nigeria', 'west africa']
  },
  {
    code: 'yo',
    speechCode: null,
    englishName: 'Yoruba',
    nativeName: 'Èdè Yorùbá',
    category: 'African',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['yoruba', 'nigeria', 'lagos']
  },
  {
    code: 'zu',
    speechCode: 'zu-ZA',
    englishName: 'Zulu',
    nativeName: 'isiZulu',
    category: 'African',
    voiceSupported: true,
    textSupported: true,
    translationSupported: true,
    keywords: ['zulu', 'south africa', 'durban']
  },
  {
    code: 'so',
    speechCode: null,
    englishName: 'Somali',
    nativeName: 'Af-Soomaali',
    category: 'African',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['somali', 'somalia', 'horn of africa']
  },

  // --- Classical ---
  {
    code: 'la',
    speechCode: null,
    englishName: 'Latin',
    nativeName: 'Latina',
    category: 'Classical',
    voiceSupported: false,
    textSupported: true,
    translationSupported: true,
    keywords: ['latin', 'roman', 'classical', 'scholarly']
  }
];

// Helper methods for querying and searching languages
const LanguageService = {
  getAll: () => KARIGAR_LANGUAGES,

  getCategories: () => [
    'All',
    'Indian Official',
    'Indian Regional',
    'European',
    'Middle East & Central Asia',
    'East & Southeast Asia',
    'African',
    'Classical'
  ],

  findByCode: (code) => {
    if (!code) return null;
    const clean = code.toLowerCase().trim();
    return KARIGAR_LANGUAGES.find(l =>
      l.code.toLowerCase() === clean ||
      (l.speechCode && l.speechCode.toLowerCase() === clean)
    ) || KARIGAR_LANGUAGES[0];
  },

  search: (query, category = 'All') => {
    let list = KARIGAR_LANGUAGES;
    if (category && category !== 'All') {
      list = list.filter(l => l.category === category);
    }
    if (!query || !query.trim()) return list;

    const q = query.toLowerCase().trim();
    return list.filter(l => {
      return (
        l.englishName.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q) ||
        (l.speechCode && l.speechCode.toLowerCase().includes(q)) ||
        l.keywords.some(k => k.toLowerCase().includes(q))
      );
    });
  },

  getRecent: () => {
    try {
      const recents = JSON.parse(localStorage.getItem('karigar_recent_langs')) || ['hi', 'ta', 'en-IN'];
      return recents.map(c => LanguageService.findByCode(c)).filter(Boolean);
    } catch (e) {
      return [LanguageService.findByCode('hi'), LanguageService.findByCode('ta'), LanguageService.findByCode('en-IN')];
    }
  },

  addRecent: (code) => {
    try {
      let recents = JSON.parse(localStorage.getItem('karigar_recent_langs')) || [];
      recents = [code, ...recents.filter(c => c !== code)].slice(0, 6);
      localStorage.setItem('karigar_recent_langs', JSON.stringify(recents));
    } catch (e) {}
  },

  getFavorites: () => {
    try {
      const favs = JSON.parse(localStorage.getItem('karigar_fav_langs')) || ['hi', 'ta', 'en-IN', 'te', 'bn', 'mr'];
      return favs.map(c => LanguageService.findByCode(c)).filter(Boolean);
    } catch (e) {
      return [];
    }
  },

  toggleFavorite: (code) => {
    try {
      let favs = JSON.parse(localStorage.getItem('karigar_fav_langs')) || [];
      if (favs.includes(code)) {
        favs = favs.filter(c => c !== code);
      } else {
        favs.push(code);
      }
      localStorage.setItem('karigar_fav_langs', JSON.stringify(favs));
      return favs.includes(code);
    } catch (e) {
      return false;
    }
  },

  isFavorite: (code) => {
    try {
      const favs = JSON.parse(localStorage.getItem('karigar_fav_langs')) || [];
      return favs.includes(code);
    } catch (e) {
      return false;
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { KARIGAR_LANGUAGES, LanguageService };
}
