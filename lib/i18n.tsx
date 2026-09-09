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
  payWithUPI: string;
  shareWhatsApp: string;
  activeDemo: string;
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
    payWithUPI: 'Pay via UPI Escrow',
    shareWhatsApp: 'Share on WhatsApp',
    activeDemo: 'DEMO MODE',
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
    browseProduce: 'ताजा शेतमाल पहा',
    sellHarvest: 'शेतकरी म्हणून शेतमाल विका',
    farmerProfit: '+४२% नफ्यात वाढ',
    buyerSavings: '-२६% खरेदी बचत',
    escrowPayout: '२ तासात बँक जमा',
    verifiedProducer: 'प्रमाणित महाराष्ट्र शेतकरी',
    liveWeather: 'हवामान अंदाज व सल्ला',
    weatherTitle: 'जिल्हानिहाय कृषी हवामान सल्ला',
    mandiComparison: 'थेट शेतभाव विरूद्ध कृषी उत्पन्न बाजार समिती भाव',
    payWithUPI: 'युपीआय द्वारे सुरक्षित पैसे',
    shareWhatsApp: 'व्हॉट्सॲपवर शेअर करा',
    activeDemo: 'डेमो खाते',
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
    payWithUPI: 'यूपीआई से सुरक्षित भुगतान',
    shareWhatsApp: 'व्हाट्सएप पर शेयर करें',
    activeDemo: 'डेमो मोड',
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

  const t = DICTIONARY[language];

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
