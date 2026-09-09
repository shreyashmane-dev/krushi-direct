'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'mr' | 'hi';

export interface Translations {
  appName: string;
  tagline: string;
  home: string;
  marketplace: string;
  sellProduce: string;
  orders: string;
  priceTrends: string;
  howItWorks: string;
  dashboard: string;
  signIn: string;
  register: string;
  signOut: string;
  theme: string;
  roleFarmer: string;
  roleConsumer: string;
  roleRestaurant: string;
  roleRetailer: string;
  roleProcessor: string;
  roleLogistics: string;
  heroBadge: string;
  heroHeadline: string;
  heroSubheadline: string;
  browseProduce: string;
  sellHarvest: string;
  farmerProfit: string;
  buyerSavings: string;
  escrowPayout: string;
  verifiedProducer: string;
  liveWeather: string;
  weatherTitle: string;
  mandiComparison: string;
  mandiSubtitle: string;
  colCrop: string;
  colMandi: string;
  colTraderPrice: string;
  colFarmgatePrice: string;
  colRetailPrice: string;
  colFarmerBenefit: string;
  verifiedLots: string;
  verifiedLotsSubtitle: string;
  viewAllLots: string;
  howItWorksHeadline: string;
  directPipeline: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  anosBadge: string;
  anosTitle: string;
  anosDesc: string;
  readDocs: string;
  payWithUPI: string;
  shareWhatsApp: string;
  activeDemo: string;
  viewDetails: string;
  available: string;
}

const DICTIONARY: Record<Language, Translations> = {
  en: {
    appName: 'KisanDirect',
    tagline: 'Direct Agricultural Marketplace',
    home: 'Home',
    marketplace: 'Marketplace',
    sellProduce: 'Sell Produce',
    orders: 'Orders',
    priceTrends: 'Price Trends',
    howItWorks: 'How It Works',
    dashboard: 'Dashboard',
    signIn: 'Sign In',
    register: 'Register',
    signOut: 'Sign Out',
    theme: 'Theme',
    roleFarmer: 'FARMER',
    roleConsumer: 'CONSUMER',
    roleRestaurant: 'RESTAURANT',
    roleRetailer: 'RETAILER',
    roleProcessor: 'PROCESSOR',
    roleLogistics: 'LOGISTICS',
    heroBadge: 'Direct Agricultural Marketplace • Maharashtra',
    heroHeadline: 'Fresh from the Farmgate. Fair Pay for Farmers. Zero Middlemen.',
    heroSubheadline: 'KisanDirect directly connects Maharashtra cultivators with households, restaurants, and retail marts. Real APMC mandi benchmark pricing, verified harvest quality, and protected escrow payouts.',
    browseProduce: 'Browse Fresh Produce',
    sellHarvest: 'Sell Harvest as Cultivator',
    farmerProfit: '+42% Farmer Profit',
    buyerSavings: '-26% Buyer Cost',
    escrowPayout: '2h Bank Escrow',
    verifiedProducer: 'Verified Maharashtra Producer',
    liveWeather: 'Agro Weather Forecast',
    weatherTitle: 'District Crop & Weather Advisory',
    mandiComparison: 'Direct Farmgate vs Middleman APMC Price Comparison',
    mandiSubtitle: 'Real data indexed from Maharashtra Mandis. Farmers earn more, while buyers pay significantly less.',
    colCrop: 'Commodity / Crop',
    colMandi: 'Benchmark Mandi',
    colTraderPrice: 'APMC Trader Price',
    colFarmgatePrice: 'KisanDirect Farmgate',
    colRetailPrice: 'Retail Supermarket',
    colFarmerBenefit: 'Farmer Benefit',
    verifiedLots: 'Verified Maharashtra Fresh Produce Lots',
    verifiedLotsSubtitle: 'Direct From The Soil',
    viewAllLots: 'View all produce listings',
    howItWorksHeadline: 'How KisanDirect Eliminates Middleman Exploitation',
    directPipeline: 'Direct Pipeline',
    step1Title: 'Farmer Lists Produce',
    step1Desc: 'Farmer uploads crop photos, estimated quantity, and harvest date. AI suggests fair benchmark pricing based on APMC mandi feeds.',
    step2Title: 'Transparent Buyer Bidding',
    step2Desc: 'Households, restaurants, and supermarkets review lots and place binding digital bids with zero commission cuts.',
    step3Title: 'Escrow Lock & Pickup',
    step3Desc: 'Buyer funds are locked in digital escrow. Temperature-controlled transit picks up from the farmgate or regional hub.',
    step4Title: 'Instant Escrow Release',
    step4Desc: 'Quality is verified via digital QA checklist on delivery. Funds are transferred to the cultivator’s bank account in under 2 hours.',
    anosBadge: 'ENGINEERED BY COMPANY ANOS',
    anosTitle: 'Crafted by Kuber Narute and his team',
    anosDesc: 'KisanDirect is developed by AnoS to transform agricultural supply chains across Maharashtra. Review full architectural specifications, API integrations, and developer documentation.',
    readDocs: 'Read Technical Documentation',
    payWithUPI: 'Pay via UPI Escrow',
    shareWhatsApp: 'Share on WhatsApp',
    activeDemo: 'DEMO MODE',
    viewDetails: 'View Details',
    available: 'available',
  },
  mr: {
    appName: 'किसानडायरेक्ट',
    tagline: 'थेट शेतकरी ते ग्राहक कृषी बाजारपेठ',
    home: 'मुख्यपृष्ठ',
    marketplace: 'बाजारपेठ',
    sellProduce: 'शेतमाल विका',
    orders: 'ऑर्डर्स',
    priceTrends: 'बाजारभाव कल',
    howItWorks: 'कसे चालते',
    dashboard: 'डॅशबोर्ड',
    signIn: 'साइन इन',
    register: 'नोंदणी',
    signOut: 'बाहेर पडा',
    theme: 'थीम',
    roleFarmer: 'शेतकरी',
    roleConsumer: 'ग्राहक',
    roleRestaurant: 'हॉटेल / रेस्टॉरंट',
    roleRetailer: 'व्यापारी / मार्ट',
    roleProcessor: 'प्रक्रियादार',
    roleLogistics: 'वाहतूकदार',
    heroBadge: 'थेट शेतमाल बाजारपेठ • महाराष्ट्र राज्य',
    heroHeadline: 'थेट शेतातून ताजा शेतमाल. शेतकऱ्यांना योग्य भाव. दलालमुक्त व्यापार.',
    heroSubheadline: 'किसानडायरेक्ट महाराष्ट्रातील शेतकऱ्यांना थेट कुटुंबे, हॉटेल्स आणि व्यापाऱ्यांशी जोडते. थेट बँक खात्यात सुरक्षित डिजिटल एस्क्रो पैसे, हमीभाव आणि दर्जेदार शेतमाल.',
    browseProduce: 'ताजा शेतमाल खरेदी करा',
    sellHarvest: 'शेतकरी म्हणून शेतमाल विका',
    farmerProfit: '+४२% नफ्यात वाढ',
    buyerSavings: '-२६% खरेदी बचत',
    escrowPayout: '२ तासात बँक जमा',
    verifiedProducer: 'प्रमाणित महाराष्ट्र शेतकरी',
    liveWeather: 'हवामान अंदाज व सल्ला',
    weatherTitle: 'जिल्हानिहाय कृषी हवामान सल्ला',
    mandiComparison: 'थेट शेतभाव विरूद्ध बाजार समिती (APMC) भाव',
    mandiSubtitle: 'महाराष्ट्रातील प्रमुख बाजार समित्यांमधील थेट दर. शेतकरी नफा वाढवतो आणि ग्राहक बचत करतो.',
    colCrop: 'शेतमाल / पीक',
    colMandi: 'बाजार समिती',
    colTraderPrice: 'दलाल / व्यापारी दर',
    colFarmgatePrice: 'किसानडायरेक्ट थेट शेतभाव',
    colRetailPrice: 'किरकोळ सुपरमार्केट',
    colFarmerBenefit: 'शेतकरी फायदा',
    verifiedLots: 'प्रमाणित महाराष्ट्र ताजा शेतमाल लॉट्स',
    verifiedLotsSubtitle: 'थेट शेतामधून ताज्या आवडीनुसार',
    viewAllLots: 'सर्व शेतमाल यादी पहा',
    howItWorksHeadline: 'किसानडायरेक्ट दलाली आणि फसवणूक कशी संपवते?',
    directPipeline: 'थेट पारदर्शक प्रक्रिया',
    step1Title: 'शेतकरी शेतमाल नोंदवतो',
    step1Desc: 'शेतकरी मोबाईलने फोटो, अंदाजे वजन आणि काढणी तारीख नोंदवतो. AI योग्य बाजारभाव सुचवते.',
    step2Title: 'थेट ग्राहक व व्यापारी बोली',
    step2Desc: 'कुटुंबे, हॉटेल्स आणि सुपरमार्ट्स थेट बोली लावतात. कोणतीही आडत किंवा कमिशन नाही.',
    step3Title: 'एस्क्रो सुरक्षित रक्कम व उचल',
    step3Desc: 'ग्राहकांचे पैसे डिजिटल एस्क्रो खात्यात सुरक्षित लॉक होतात. थेट शेतातून वाहतूक केली जाते.',
    step4Title: '२ तासांत बँक खात्यात पैसे',
    step4Desc: 'माल पोहोचल्यावर गुणवत्ता तपासणी होते आणि २ तासांच्या आत थेट शेतकऱ्याच्या बँक खात्यात पैसे जमा होतात.',
    anosBadge: 'ANOS कंपनी द्वारे विकसित',
    anosTitle: 'कुबेर नरुटे आणि त्यांच्या टीमने तयार केले',
    anosDesc: 'महाराष्ट्रातील कृषी पुरवठा साखळीतील दलाली संपवण्यासाठी एनओएस (AnoS) कंपनीने किसानडायरेक्ट प्लॅटफॉर्म विकसित केला आहे.',
    readDocs: 'तांत्रिक दस्तऐवजीकरण वाचा',
    payWithUPI: 'युपीआय द्वारे सुरक्षित पैसे',
    shareWhatsApp: 'व्हॉट्सॲपवर शेअर करा',
    activeDemo: 'डेमो खाते',
    viewDetails: 'तपशील पहा',
    available: 'उपलब्ध',
  },
  hi: {
    appName: 'किसानडायरेक्ट',
    tagline: 'सीधा किसान से उपभोक्ता कृषि बाज़ार',
    home: 'होम',
    marketplace: 'मंडी बाज़ार',
    sellProduce: 'फसल बेचें',
    orders: 'ऑर्डर्स',
    priceTrends: 'भाव रुझान',
    howItWorks: 'प्रक्रिया',
    dashboard: 'डैशबोर्ड',
    signIn: 'लॉग इन',
    register: 'पंजीकरण',
    signOut: 'लॉग आउट',
    theme: 'थीम',
    roleFarmer: 'किसान',
    roleConsumer: 'उपभोक्ता',
    roleRestaurant: 'रेस्तरां',
    roleRetailer: 'खुदरा व्यापारी',
    roleProcessor: 'प्रसंस्करण',
    roleLogistics: 'लॉजिस्टिक्स',
    heroBadge: 'प्रत्यक्ष कृषि बाज़ार • महाराष्ट्र',
    heroHeadline: 'खेत से सीधे ताज़ा उत्पाद। किसानों को सही दाम। बिना बिचौलिए।',
    heroSubheadline: 'किसानडायरेक्ट महाराष्ट्र के किसानों को सीधे परिवारों, रेस्तराओं और सुपरमार्केट्स से जोड़ता है। वास्तविक एपीएमसी मंडी भाव, गुणवत्ता सत्यापन और 2 घंटे में सुरक्षित एस्क्रो भुगतान।',
    browseProduce: 'ताज़ा उपज देखें',
    sellHarvest: 'किसान के रूप में फसल बेचें',
    farmerProfit: '+42% किसान मुनाफा',
    buyerSavings: '-26% खरीदार बचत',
    escrowPayout: '2 घंटे में बैंक ट्रांसफर',
    verifiedProducer: 'सत्यापित महाराष्ट्र किसान',
    liveWeather: 'मौसम पूर्वानुमान',
    weatherTitle: 'जिला कृषि मौसम सलाह',
    mandiComparison: 'मंडी भाव बनाम किसानडायरेक्ट सीधा मूल्य',
    mandiSubtitle: 'महाराष्ट्र मंडियों का वास्तविक डेटा। किसान अधिक कमाते हैं, खरीदार कम चुकाते हैं।',
    colCrop: 'फसल / उत्पाद',
    colMandi: 'मंडी केंद्र',
    colTraderPrice: 'मंडी व्यापारी भाव',
    colFarmgatePrice: 'किसानडायरेक्ट सीधा भाव',
    colRetailPrice: 'सुपरमार्केट खुदरा',
    colFarmerBenefit: 'किसान लाभ',
    verifiedLots: 'सत्यापित महाराष्ट्र ताज़ा फसल लॉट्स',
    verifiedLotsSubtitle: 'खेत से सीधे आपके लिए',
    viewAllLots: 'सभी फसल सूचियां देखें',
    howItWorksHeadline: 'किसानडायरेक्ट बिचौलियों का शोषण कैसे समाप्त करता है',
    directPipeline: 'पारदर्शी प्रत्यक्ष प्रक्रिया',
    step1Title: 'किसान फसल पंजीकृत करता है',
    step1Desc: 'किसान मोबाइल से फोटो और मात्रा अपलोड करता है। एआई निष्पक्ष मंडी भाव सुझाता है।',
    step2Title: 'पारदर्शी खरीदार बोली',
    step2Desc: 'परिवार, रेस्तरां और मार्ट्स 0% कमीशन पर डिजिटल बोली लगाते हैं।',
    step3Title: 'एस्क्रो लॉक और खेत से उठाव',
    step3Desc: 'खरीदार का भुगतान डिजिटल एस्क्रो में सुरक्षित होता है और खेत से सीधी उठाई होती है।',
    step4Title: '2 घंटे में बैंक ट्रांसफर',
    step4Desc: 'डिलीवरी सत्यापन के तुरंत बाद राशि किसान के बैंक खाते में ट्रांसफर हो जाती है।',
    anosBadge: 'ANOS कंपनी द्वारा निर्मित',
    anosTitle: 'कुबेर नरुटे और उनकी टीम द्वारा निर्मित',
    anosDesc: 'महाराष्ट्र की कृषि आपूर्ति श्रृंखला को बदलने के लिए एनओएस (AnoS) कंपनी ने किसानडायरेक्ट विकसित किया है।',
    readDocs: 'तकनीकी दस्तावेज़ पढ़ें',
    payWithUPI: 'यूपीआई से सुरक्षित भुगतान',
    shareWhatsApp: 'व्हाट्सएप पर शेयर करें',
    activeDemo: 'डेमो मोड',
    viewDetails: 'विवरण देखें',
    available: 'उपलब्ध',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kisandirect_lang') as Language;
      if (saved && (saved === 'en' || saved === 'mr' || saved === 'hi')) {
        setLanguageState(saved);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kisandirect_lang', lang);
    }
  };

  const t = DICTIONARY[language] || DICTIONARY.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
