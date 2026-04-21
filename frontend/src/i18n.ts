import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "VRS Garden Dhaba": "VRS Garden Dhaba",
      "Billing": "Billing",
      "Tables": "Tables",
      "Parcel": "Parcel",
      "KOT": "KOT",
      "Reports": "Reports",
      "Settings": "Settings",
      "Logout": "Logout",
      "Search Items...": "Search Items...",
      "Categories": "Categories",
      "Current Bill": "Current Bill",
      "Table No": "Table No",
      "Bill No": "Bill No",
      "Add Item": "Add Item",
      "Qty": "Qty",
      "Price": "Price",
      "Total": "Total",
      "Discount": "Discount",
      "GST (5%)": "GST (5%)",
      "Grand Total": "Grand Total",
      "Hold Bill": "Hold Bill",
      "Print KOT": "Print KOT",
      "Pay Bill": "Pay Bill",
      "Cash": "Cash",
      "UPI": "UPI",
      "Split": "Split",
      "Payment Options": "Payment Options",
      "Cancel": "Cancel",
      "Confirm": "Confirm",
      "Pin Login": "Enter PIN to Login",
      "Invalid PIN": "Invalid PIN",
      "Free": "Free",
      "Occupied": "Occupied",
      "Waiting Payment": "Waiting Payment",
      "All Items": "All Items"
    }
  },
  ta: {
    translation: {
      "VRS Garden Dhaba": "VRS கார்டன் தாபா",
      "Billing": "பில்லிங்",
      "Tables": "மேசைகள்",
      "Parcel": "பார்சல்",
      "KOT": "சமையலறை சீட்டு (KOT)",
      "Reports": "அறிக்கைகள்",
      "Settings": "அமைப்புகள்",
      "Logout": "வெளியேறு",
      "Search Items...": "பொருட்களை தேடு...",
      "Categories": "வகைகள்",
      "Current Bill": "தற்போதைய பில்",
      "Table No": "மேசை எண்",
      "Bill No": "பில் எண்",
      "Add Item": "பொருளை சேர்",
      "Qty": "அளவு",
      "Price": "விலை",
      "Total": "மொத்தம்",
      "Discount": "தள்ளுபடி",
      "GST (5%)": "GST வரி (5%)",
      "Grand Total": "பெரு மொத்தம்",
      "Hold Bill": "பில்லை நிறுத்து",
      "Print KOT": "KOT அச்சிடு",
      "Pay Bill": "பில் செலுத்து",
      "Cash": "பணம்",
      "UPI": "UPI (கியூ.ஆர்)",
      "Split": "பிரித்து செலுத்து",
      "Payment Options": "பணம் செலுத்தும் முறைகள்",
      "Cancel": "ரத்து செய்",
      "Confirm": "உறுதி செய்",
      "Pin Login": "உள்நுழைய PIN ஐ உள்ளிடவும்",
      "Invalid PIN": "தவறான PIN",
      "Free": "காலி",
      "Occupied": "பயன்பாட்டில்",
      "Waiting Payment": "பணம் செலுத்த காத்திருப்பு",
      "All Items": "அனைத்து பொருட்கள்"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ta',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
