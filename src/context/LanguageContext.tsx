import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type LanguageType = "en" | "hi" | "kn" | "es" | "ar";
export type CurrencyType = "INR" | "USD" | "EUR" | "GBP";

interface TranslationDictionary {
  [key: string]: {
    en: string;
    hi: string;
    kn: string;
    es: string;
    ar: string;
  };
}

const translations: TranslationDictionary = {
  // Navigation
  "nav.home": { en: "Home", hi: "होम", kn: "ಮನೆ", es: "Inicio", ar: "الرئيسية" },
  "nav.search": { en: "Search", hi: "खोजें", kn: "ಹುಡುಕಿ", es: "Buscar", ar: "البحث" },
  "nav.cart": { en: "Cart", hi: "कार्ट", kn: "ಕಾರ್ಟ್", es: "Carrito", ar: "السلة" },
  "nav.orders": { en: "Orders", hi: "आदेश", kn: "ಆರ್ಡರ್‌ಗಳು", es: "Pedidos", ar: "الطلبات" },
  "nav.profile": { en: "Profile", hi: "प्रोफ़ाइल", kn: "ಪ್ರೊಫೈಲ್", es: "Perfil", ar: "الملف الشخصي" },
  "nav.settings": { en: "Settings", hi: "सेटिंग्स", kn: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು", es: "Ajustes", ar: "الإعدادات" },

  // Home Page
  "home.welcome": { en: "Welcome to TIP PAY!", hi: "TIP PAY में आपका स्वागत है!", kn: "TIP PAY ಗೆ ಸ್ವಾಗತ!", es: "¡Bienvenido a TIP PAY!", ar: "مرحبًا بكم في TIP PAY!" },
  "home.whatToEat": { en: "What would you like to eat?", hi: "आप क्या खाना चाहेंगे?", kn: "ನೀವು ಏನು ತಿನ್ನಲು ಬಯಸುತ್ತೀರಿ?", es: "¿Qué te gustaría comer?", ar: "ماذا تحب أن تأكل؟" },
  "home.deliveringTo": { en: "Delivering to", hi: "यहाँ पहुँचा रहे हैं", kn: "ಇಲ್ಲಿಗೆ ತಲುಪಿಸಲಾಗುತ್ತಿದೆ", es: "Entregando en", ar: "التوصيل إلى" },
  "home.searchPlaceholder": { en: "Search restaurants, cuisines...", hi: "रेस्तरां, व्यंजन खोजें...", kn: "ರೆಸ್ಟೋರೆಂಟ್‌ಗಳು, ತಿನಿಸುಗಳನ್ನು ಹುಡುಕಿ...", es: "Buscar restaurantes, cocinas...", ar: "ابحث عن المطاعم والمطابخ..." },
  "home.categories": { en: "Categories", hi: "श्रेणियाँ", kn: "ವರ್ಗಗಳು", es: "Categorías", ar: "الفئات" },
  "home.nearbyRestaurants": { en: "Nearby Restaurants", hi: "आसपास के रेस्तरां", kn: "ಹತ್ತಿರದ ರೆಸ್ಟೋರೆಂಟ್‌ಗಳು", es: "Restaurantes cercanos", ar: "المطاعم القريبة" },
  "home.seeAll": { en: "See All", hi: "सभी देखें", kn: "ಎಲ್ಲವನ್ನೂ ನೋಡಿ", es: "Ver todo", ar: "عرض الكل" },
  "home.gps": { en: "GPS", hi: "जीपीएस", kn: "ಜಿಪಿಎಸ್", es: "GPS", ar: "تحديد الموقع" },
  "home.detected": { en: "Detected", hi: "पता चला", kn: "ಪತ್ತೆಯಾಗಿದೆ", es: "Detectado", ar: "تم التحديد" },
  "home.detecting": { en: "Detecting...", hi: "खोज रहे हैं...", kn: "ಪತ್ತೆ ಮಾಡಲಾಗುತ್ತಿದೆ...", es: "Detectando...", ar: "جاري التحديد..." },

  // Search Page
  "search.header": { en: "Search", hi: "खोज", kn: "ಹುಡುಕಾಟ", es: "Buscar", ar: "البحث" },
  "search.placeholder": { en: "Search food, restaurants...", hi: "भोजन, रेस्तरां खोजें...", kn: "ಆಹಾರ, ರೆಸ್ಟೋರೆಂಟ್‌ಗಳನ್ನು ಹುಡುಕಿ...", es: "Buscar comida, restaurantes...", ar: "ابحث عن طعام، مطاعم..." },
  "search.aiSmartSearch": { en: "AI Smart Search", hi: "एआई स्मार्ट खोज", kn: "AI ಸ್ಮಾರ್ಟ್ ಹುಡುಕಾಟ", es: "Búsqueda inteligente IA", ar: "البحث الذكي بالذكاء الاصطناعي" },
  "search.standard": { en: "Standard Search", hi: "मानक खोज", kn: "ಸಾಮಾನ್ಯ ಹುಡುಕಾಟ", es: "Búsqueda estándar", ar: "البحث القياسي" },
  "search.noResults": { en: "No results found for", hi: "इसके लिए कोई परिणाम नहीं मिला", kn: "ಯಾವುದೇ ಫಲಿತಾಂಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ", es: "No se encontraron resultados para", ar: "لم يتم العثور على نتائج لـ" },

  // Cart
  "cart.header": { en: "My Cart", hi: "मेरी कार्ट", kn: "ನನ್ನ ಕಾರ್ಟ್", es: "Mi Carrito", ar: "سلتي" },
  "cart.empty": { en: "Your cart is empty", hi: "आपकी कार्ट खाली है", kn: "ನಿಮ್ಮ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ", es: "Tu carrito está vacío", ar: "سلتك فارغة" },
  "cart.checkout": { en: "Checkout", hi: "चेकआउट", kn: "ಚೆಕ್‌ಔಟ್", es: "Pagar", ar: "الدفع" },
  "cart.items": { en: "Items", hi: "सामग्री", kn: "ಐಟಂಗಳು", es: "Artículos", ar: "العناصر" },
  "cart.total": { en: "Total Amount", hi: "कुल राशि", kn: "ಒಟ್ಟು ಮೊತ್ತ", es: "Monto total", ar: "المبلغ الإجمالي" },

  // Settings
  "settings.header": { en: "Settings", hi: "सेटिंग्स", kn: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು", es: "Ajustes", ar: "الإعدادات" },
  "settings.lang": { en: "App Language", hi: "ऐप की भाषा", kn: "ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆ", es: "Idioma de la aplicación", ar: "لغة التطبيق" },
  "settings.currency": { en: "Preferred Currency", hi: "पसंदीदा मुद्रा", kn: "ಆದ್ಯತೆಯ ಕರೆನ್ಸಿ", es: "Moneda de preferencia", ar: "العملة المفضلة" },
  "settings.editProfile": { en: "Edit Profile", hi: "प्रोफ़ाइल संपादित करें", kn: "ಪ್ರೊಫೈಲ್ ತಿದ್ದಿ", es: "Editar perfil", ar: "تعديل الملف الشخصي" },
  "settings.notifications": { en: "Notification Settings", hi: "अधिसूचना सेटिंग्स", kn: "ಅಧಿಸೂಚನೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳು", es: "Configuración de notificaciones", ar: "إعدادات الإشعارات" },
  "settings.permissions": { en: "App Permissions", hi: "ऐप अनुमतियां", kn: "ಅಪ್ಲಿಕೇಶನ್ ಅನುಮತಿಗಳು", es: "Permisos de la aplicación", ar: "أذونات التطبيق" },
  "settings.help": { en: "Help and Support", hi: "सहायता और समर्थन", kn: "ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ", es: "Ayuda y soporte", ar: "المساعدة والدعم" },
  "settings.preferences": { en: "Preferences", hi: "प्राथमिकताएं", kn: "ಆದ್ಯತೆಗಳು", es: "Preferencias", ar: "التفضيلات" },

  // Cravings
  "craving.bannerTitle": { en: "Craving something unique?", hi: "कुछ खास खाने की लालसा है?", kn: "ವಿಶೇಷವಾಗಿ ಏನನ್ನಾದರೂ ತಿನ್ನಬೇಕೆನಿಸುತ್ತಿದೆಯೇ?", es: "¿Antojo de algo especial?", ar: "هل تشتهي شيئًا مميزًا؟" },
  "craving.bannerDesc": { en: "Request a custom dish from local chefs now!", hi: "स्थानीय शेफ से कस्टम डिश का अनुरोध करें!", kn: "ಸ್ಥಳೀಯ ಬಾಣಸಿಗರಿಂದ ಕಸ್ಟಮ್ ಆಹಾರಕ್ಕಾಗಿ ವಿನಂತಿಸಿ!", es: "¡Solicita un plato personalizado a chefs locales!", ar: "اطلب طبقًا مخصصًا من الطهاة المحليين الآن!" },
  "craving.button": { en: "Request a Dish", hi: "डिश का अनुरोध करें", kn: "ಆಹಾರಕ್ಕಾಗಿ ವಿನಂತಿಸಿ", es: "Solicitar plato", ar: "اطلب طبقًا" },
  "craving.myRequests": { en: "My Dish Requests", hi: "मेरे डिश अनुरोध", kn: "ನನ್ನ ಆಹಾರ ವಿನಂತಿಗಳು", es: "Mis solicitudes de platos", ar: "طلبات الأطباق الخاصة بي" },
};

const currencySymbols: Record<CurrencyType, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const currencyRates: Record<CurrencyType, number> = {
  INR: 1.0,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0094,
};

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  currency: CurrencyType;
  setCurrency: (curr: CurrencyType) => void;
  t: (key: string) => string;
  formatPrice: (priceInINR: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageType>(() => {
    return (localStorage.getItem("tippay_lang") as LanguageType) || "en";
  });

  const [currency, setCurrencyState] = useState<CurrencyType>(() => {
    return (localStorage.getItem("tippay_currency") as CurrencyType) || "INR";
  });

  const setLanguage = (lang: LanguageType) => {
    setLanguageState(lang);
    localStorage.setItem("tippay_lang", lang);
    // Adjust HTML dir attribute for RTL support (Arabic)
    if (lang === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = lang;
    }
  };

  const setCurrency = (curr: CurrencyType) => {
    setCurrencyState(curr);
    localStorage.setItem("tippay_currency", curr);
  };

  useEffect(() => {
    // Set initially
    if (language === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key: string): string => {
    const trans = translations[key];
    if (!trans) return key;
    return trans[language] || trans["en"] || key;
  };

  const formatPrice = (priceInINR: number): string => {
    const converted = priceInINR * currencyRates[currency];
    const symbol = currencySymbols[currency];
    if (currency === "INR") {
      return `${symbol}${Math.round(converted)}`;
    }
    return `${symbol}${converted.toFixed(2)}`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, currency, setCurrency, t, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};
