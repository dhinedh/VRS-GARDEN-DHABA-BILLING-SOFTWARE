import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, Search, Plus, Minus, Trash2, Banknote, QrCode, Printer, Receipt, ChevronRight, ShoppingCart, Sparkles } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import PaymentModal from './PaymentModal';
import { KOTPrint } from '../components/KOTPrint';

interface MenuItem {
  id: number;
  category_id: number;
  code: string;
  name_en: string;
  name_ta: string;
  price: number;
  is_special: boolean;
  available: boolean;
}

interface CartItem extends MenuItem {
  qty: number;
}

export default function BillingScreen() {
  const { t, i18n } = useTranslation();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'menu' | 'cart'>('menu');
  const kotRef = useRef<HTMLDivElement>(null);

  const handleKOTPrint = useReactToPrint({
    contentRef: kotRef,
  });

  const [isRecording, setIsRecording] = useState(false);

  const startVoiceInput = useCallback(() => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const parotta = menuItems.find(m => m.name_en === 'Parotta');
      if (parotta) {
         setCart(prev => {
            const existing = prev.find(p => p.id === parotta.id);
            if(existing) return prev.map(p => p.id === parotta.id ? { ...p, qty: p.qty + 2 } : p);
            return [...prev, { ...parotta, qty: 2 }];
         });
      }
    }, 2000);
  }, [menuItems]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/categories`).then(res => res.json()).then(setCategories);
    fetch(`${import.meta.env.VITE_API_URL}/menu`).then(res => res.json()).then(setMenuItems);
  }, []);

  const addToCart = useCallback((item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const updateQty = useCallback((id: number, delta: number) => {
    setCart(prev => prev.map(p => {
      if (p.id === id) {
        const newQty = p.qty + delta;
        return newQty > 0 ? { ...p, qty: newQty } : p;
      }
      return p;
    }));
  }, []);

  const removeItem = useCallback((id: number) => {
    setCart(prev => prev.filter(p => p.id !== id));
  }, []);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCat = activeCategory === 'all' || item.category_id === activeCategory;
      const matchesSearch = item.name_en.toLowerCase().includes(search.toLowerCase()) || 
                            item.name_ta.includes(search) ||
                            (item.code && item.code.toLowerCase().includes(search.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [menuItems, activeCategory, search]);

  const { subTotal, gst, grandTotal } = useMemo(() => {
    const sub = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const tax = sub * 0.05;
    return {
      subTotal: sub,
      gst: tax,
      grandTotal: sub + tax
    };
  }, [cart]);

  return (
    <div className="flex h-full relative bg-gray-50 dark:bg-darkBg">
      {/* Menu Section */}
      <div className={`flex-1 flex flex-col md:w-2/3 border-r dark:border-darkBorder overflow-x-hidden ${mobileView === 'cart' ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Search & Voice Bar - FIXED */}
        <div className="p-3 bg-white dark:bg-darkSurface border-b dark:border-darkBorder shrink-0 flex gap-2 md:gap-3 shadow-md z-30 w-full">
          <div className="flex-1 relative flex items-center min-w-0">
            <Search className="absolute left-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder={t('Search Menu...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 h-12 md:h-14 bg-gray-100 dark:bg-gray-800 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-brandGreen/30 text-base md:text-lg font-medium border-0 placeholder:text-gray-400 dark:text-white"
            />
          </div>
          <button 
            onClick={startVoiceInput}
            className={`flex items-center justify-center h-12 w-12 md:h-14 md:w-auto md:px-6 rounded-xl md:rounded-2xl font-bold transition-all shadow-md active:scale-95 shrink-0 ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse shadow-red-500/20' 
                : 'bg-brandSaffron text-white hover:bg-brandLightSaffron shadow-brandSaffron/20'
            }`}
          >
            <Mic size={22} className="md:size-26" />
            <span className="hidden md:inline-block ml-3 uppercase tracking-wider">{isRecording ? 'Listening' : 'Voice'}</span>
          </button>
        </div>

        {/* Categories Scroller - FIXED */}
        <div className="p-3 flex gap-2 overflow-x-auto hide-scrollbar shrink-0 bg-gray-50 dark:bg-darkBg z-20 w-full">
          <button 
            onClick={() => setActiveCategory('all')}
            className={`flex-shrink-0 px-5 h-12 md:h-14 rounded-xl md:rounded-2xl font-bold text-xs md:text-md uppercase tracking-wide transition-all shadow-sm flex items-center justify-center ${
              activeCategory === 'all' 
                ? 'bg-brandGreen text-white scale-105 shadow-brandGreen/30' 
                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700'
            }`}
          >
            {t('All')}
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-5 h-12 md:h-14 rounded-xl md:rounded-2xl font-bold text-xs md:text-md uppercase tracking-wide transition-all shadow-sm flex items-center justify-center ${
                activeCategory === cat.id 
                  ? 'bg-gradient-to-tr from-brandGreen to-brandLightGreen text-white scale-105 shadow-brandGreen/30' 
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700'
              }`}
            >
              <div className="flex flex-col items-center leading-none">
                <span className="text-[10px] opacity-70 mb-1">{cat.name_en}</span>
                <span className="font-tamil">{cat.name_ta}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Items Grid - One by One on Mobile - CLEANED UI */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-3 w-full">
          {filteredItems.map(item => {
            const cartItem = cart.find(p => p.id === item.id);
            return (
              <div 
                key={item.id}
                className="group bg-white dark:bg-darkSurface p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-transparent hover:border-brandGreen/20 transition-all flex items-center justify-between active:scale-[0.99] min-h-[100px] w-full relative overflow-hidden"
              >
                <div className="flex-1 flex flex-col text-left min-w-0 pr-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-500 font-mono font-bold shrink-0">{item.code}</span>
                    <div className="text-gray-900 dark:text-white text-lg md:text-xl font-black leading-tight font-tamil uppercase truncate">
                      {i18n.language === 'en' ? item.name_en : item.name_ta}
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs mt-0.5 font-tamil opacity-70 truncate uppercase">
                    {i18n.language === 'en' ? item.name_ta : item.name_en}
                  </div>
                  <div className="text-brandGreen font-black text-2xl mt-1">
                    <span className="text-sm mr-0.5 font-normal">₹</span>{item.price}
                  </div>
                </div>
                
                {/* Horizontal Tactical Controls */}
                <div className="shrink-0 relative z-10">
                   {!cartItem ? (
                     <button 
                       onClick={() => addToCart(item)}
                       className="w-14 h-14 bg-brandGreen text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brandGreen/20 active:bg-brandLightGreen"
                     >
                        <Plus size={32} />
                     </button>
                   ) : (
                     <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-2xl border dark:border-gray-700 shadow-inner">
                        <button onClick={() => updateQty(item.id, -1)} className="w-11 h-11 flex items-center justify-center bg-white dark:bg-gray-700 text-red-500 rounded-xl shadow-sm border dark:border-gray-600"><Minus size={22} /></button>
                        <span className="font-black text-2xl w-6 text-center text-gray-800 dark:text-gray-100">{cartItem.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-11 h-11 flex items-center justify-center bg-brandGreen text-white rounded-xl shadow-sm"><Plus size={22} /></button>
                     </div>
                   )}
                </div>

                {item.is_special && (
                  <div className="absolute top-2 right-2 text-brandSaffron opacity-10 pointer-events-none">
                    <Sparkles size={16} className="animate-spin-slow" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Mobile Cart Bar */}
        <div className="md:hidden p-4 bg-white dark:bg-darkSurface border-t dark:border-darkBorder shadow-2xl z-30">
            <button 
               onClick={() => setMobileView('cart')}
               className="w-full h-16 bg-brandGreen text-white rounded-[1.5rem] font-bold flex justify-between items-center px-6 shadow-lg shadow-brandGreen/30 active:scale-95 transition-transform"
            >
               <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-2 rounded-xl">
                     <ShoppingCart size={24} />
                  </div>
                  <div className="flex flex-col items-start leading-none">
                     <span className="text-xs opacity-80 uppercase tracking-widest">{t('Basket')}</span>
                     <span className="text-lg">{cart.reduce((a,b)=>a+b.qty, 0)} {t('Items')}</span>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-2xl font-black">₹{grandTotal.toFixed(2)}</span>
                  <ChevronRight size={20} className="animate-pulse" />
               </div>
            </button>
        </div>
      </div>

      {/* Cart/Checkout Sidebar */}
      <div className={`fixed inset-0 z-50 bg-white dark:bg-darkSurface md:relative md:flex md:w-1/3 flex-col shadow-2xl ${mobileView === 'menu' ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b dark:border-darkBorder flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
             <button onClick={() => setMobileView('menu')} className="md:hidden p-2 -ml-3 bg-gray-100 dark:bg-gray-800 rounded-full"><ChevronRight size={24} className="rotate-180" /></button>
             <h2 className="text-2xl font-black text-brandGreen uppercase tracking-tighter">
                {t('Check')} <span className="text-gray-400">Out</span>
             </h2>
          </div>
          <div className="bg-brandSaffron/10 text-brandSaffron px-4 py-1.5 rounded-full text-sm font-black border border-brandSaffron/20 uppercase tracking-widest">
            {t('T-1')}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length > 0 ? cart.map(item => (
            <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-[1.5rem] border dark:border-gray-800">
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                  <div className="font-bold text-lg font-tamil uppercase leading-tight text-gray-800 dark:text-gray-100">{i18n.language === 'en' ? item.name_en : item.name_ta}</div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">₹{item.price} each</div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-red-300 hover:text-red-500 p-2"><Trash2 size={20} /></button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-5 bg-white dark:bg-gray-900 rounded-2xl p-1 shadow-sm px-2">
                  <button onClick={() => updateQty(item.id, -1)} className="w-12 h-12 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-xl transition"><Minus size={20} /></button>
                  <span className="font-black text-xl w-6 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-12 h-12 flex items-center justify-center text-brandGreen hover:bg-brandGreen/5 rounded-xl transition"><Plus size={20} /></button>
                </div>
                <div className="font-black text-2xl text-brandGreen">₹{item.price * item.qty}</div>
              </div>
            </div>
          )) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-300 opacity-40 py-20">
                <ShoppingCart size={80} className="mb-4" />
                <p className="text-lg font-bold uppercase tracking-[0.2em]">{t('Basket Empty')}</p>
             </div>
          )}
        </div>

        <div className="p-6 border-t dark:border-darkBorder bg-white dark:bg-darkSurface flex flex-col gap-4 shrink-0 shadow-2xl relative z-10">
          <div className="space-y-2 px-1">
             <div className="flex justify-between text-gray-500 font-bold uppercase text-xs tracking-widest">
               <span>{t('Total')}</span><span className="font-mono text-gray-800 dark:text-gray-200">₹{subTotal.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-gray-500 font-bold uppercase text-xs tracking-widest">
               <span>{t('Tax')} (5%)</span><span className="font-mono text-gray-800 dark:text-gray-200">₹{gst.toFixed(2)}</span>
             </div>
          </div>
          
          <div className="flex justify-between text-3xl font-black pt-2 text-brandGreen items-end border-t dark:border-gray-800">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mb-2">{t('Payable')}</span>
            <span className="font-mono">₹{grandTotal.toFixed(2)}</span>
          </div>

          <div className="flex gap-3 mt-4">
            <button 
               onClick={handleKOTPrint}
               className="w-16 h-16 bg-gray-100 dark:bg-gray-800 text-gray-600 rounded-2xl flex items-center justify-center shadow-inner active:scale-90 transition"
               title="Kitchen Order Print"
            >
               <Printer size={28} />
            </button>
            <button 
              onClick={() => setIsPaymentOpen(true)}
              disabled={cart.length === 0}
              className="flex-1 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.1em] text-xl bg-brandGreen text-white shadow-xl shadow-brandGreen/30 active:scale-95 transition-all disabled:grayscale disabled:opacity-30 flex items-center justify-center gap-3"
            >
              <Banknote size={24} />
              {t('Finish Bill')}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden"><KOTPrint ref={kotRef} tableNo="T-1" items={cart} /></div>
      
      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)}
        cart={cart}
        subTotal={subTotal}
        gst={gst}
        grandTotal={grandTotal}
        onComplete={() => {
          setIsPaymentOpen(false);
          setCart([]);
          setMobileView('menu');
        }}
      />
    </div>
  );
}
