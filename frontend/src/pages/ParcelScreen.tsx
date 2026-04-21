import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Minus, Trash2, Banknote, QrCode, Bike, ShoppingCart, ChevronRight } from 'lucide-react';
import PaymentModal from './PaymentModal';

export default function ParcelScreen() {
  const { t, i18n } = useTranslation();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');
  
  const [cart, setCart] = useState<any[]>([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'menu' | 'cart'>('menu');
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryPartner, setDeliveryPartner] = useState<'direct' | 'swiggy' | 'zomato'>('direct');
  const [packingCharge, setPackingCharge] = useState<number>(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/categories').then(res => res.json()).then(setCategories);
    fetch('http://localhost:5000/api/menu').then(res => res.json()).then(setMenuItems);
  }, []);

  const addToCart = useCallback((item: any) => {
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
                            item.name_ta.includes(search);
      return matchesCat && matchesSearch;
    });
  }, [menuItems, activeCategory, search]);

  const { subTotal, gst, grandTotal } = useMemo(() => {
    const sub = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const tax = sub * 0.05;
    return {
      subTotal: sub,
      gst: tax,
      grandTotal: sub + tax + packingCharge
    };
  }, [cart, packingCharge]);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Menu Area */}
      <div className={`flex-1 flex flex-col md:w-2/3 border-r dark:border-darkBorder overflow-x-hidden ${mobileView === 'cart' ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-3 bg-white dark:bg-darkSurface border-b dark:border-darkBorder shrink-0 flex gap-4 w-full">
          <div className="flex-1 relative min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={t('Search Items...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 md:py-3 rounded-xl bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brandGreen text-base md:text-lg border-0"
            />
          </div>
        </div>

        <div className="overflow-x-auto p-3 flex gap-2 hide-scrollbar shrink-0 w-full bg-gray-50 dark:bg-darkBg">
          <button 
            onClick={() => setActiveCategory('all')}
            className={`flex-shrink-0 px-5 py-2 rounded-xl font-bold text-xs md:text-lg transition ${
              activeCategory === 'all' ? 'bg-brandGreen text-white' : 'bg-white dark:bg-gray-800 border'
            }`}
          >
            {t('All')}
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-5 py-2 rounded-xl font-bold text-xs md:text-lg transition ${
                activeCategory === cat.id ? 'bg-brandGreen text-white' : 'bg-white dark:bg-gray-800 border'
              }`}
            >
              {i18n.language === 'en' ? cat.name_en : cat.name_ta}
            </button>
          ))}
        </div>

        {/* Items Grid - One by One on Mobile */}
        <div className="flex-1 overflow-y-auto p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 content-start gap-3 w-full">
          {filteredItems.map(item => {
            const cartItem = cart.find(p => p.id === item.id);
            return (
              <div 
                key={item.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-[1.5rem] shadow-sm border dark:border-darkBorder flex items-center justify-between hover:shadow-md transition active:scale-[0.98] min-h-[80px] md:h-32 w-full"
              >
                <div className="flex-1 text-left min-w-0">
                  <div className="font-bold text-gray-800 dark:text-gray-100 text-base md:text-xl leading-tight uppercase font-tamil truncate">
                    {i18n.language === 'en' ? item.name_en : item.name_ta}
                  </div>
                  <div className="text-brandGreen font-bold text-xl mt-1">₹{item.price}</div>
                </div>
                
                <div className="flex items-center gap-3">
                   {!cartItem ? (
                     <button 
                       onClick={() => addToCart(item)}
                       className="w-12 h-12 bg-brandGreen/10 text-brandGreen rounded-xl flex items-center justify-center hover:bg-brandGreen hover:text-white transition-all shadow-sm"
                     >
                        <Plus size={24} />
                     </button>
                   ) : (
                     <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl border dark:border-gray-600">
                        <button onClick={() => updateQty(item.id, -1)} className="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-white rounded-lg transition"><Minus size={16} /></button>
                        <span className="font-bold text-lg w-4 text-center">{cartItem.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-9 h-9 flex items-center justify-center text-brandGreen hover:bg-white rounded-lg transition"><Plus size={16} /></button>
                     </div>
                   )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="md:hidden p-3 bg-white dark:bg-darkSurface border-t dark:border-darkBorder shrink-0">
            <button onClick={() => setMobileView('cart')} className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold flex justify-between items-center px-6">
                <div className="flex items-center gap-2"><Bike size={24} /><span>{t('Parcel Cart')}</span></div>
                <div className="flex items-center gap-2"><span className="text-xl">₹{grandTotal.toFixed(2)}</span><ChevronRight size={20} /></div>
            </button>
        </div>
      </div>

      {/* Checkout Area */}
      <div className={`fixed inset-0 z-40 bg-white dark:bg-darkSurface md:relative md:flex md:w-1/3 flex-col ${mobileView === 'menu' ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b dark:border-darkBorder flex justify-between items-center bg-orange-50 dark:bg-orange-900/10 shrink-0">
          <button onClick={() => setMobileView('menu')} className="md:hidden"><ChevronRight size={24} className="rotate-180" /></button>
          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-orange-600">
            <Bike /> {t('Parcel')} Order
          </h2>
          <div className="w-10"></div>
        </div>

        <div className="p-4 border-b dark:border-darkBorder flex flex-col gap-3 shrink-0">
           <div className="flex gap-1">
             {['direct', 'swiggy', 'zomato'].map(p => (
               <button key={p} onClick={() => setDeliveryPartner(p as any)} className={`flex-1 py-2 rounded-lg font-bold text-xs uppercase ${deliveryPartner === p ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800'}`}>{p}</button>
             ))}
           </div>
           {deliveryPartner === 'direct' && (
             <div className="grid grid-cols-2 gap-2">
               <input type="text" placeholder="Name" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 text-sm" />
               <input type="tel" placeholder="Phone" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 text-sm" />
             </div>
           )}
           <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className="text-xs font-bold text-gray-500 uppercase">Packing Charge ₹</span>
              <input type="number" value={packingCharge} onChange={e => setPackingCharge(parseFloat(e.target.value) || 0)} className="w-16 px-2 py-1 border rounded bg-white dark:bg-gray-900 font-bold text-right" />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.map(item => (
            <div key={item.id} className="p-3 border dark:border-gray-700 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <div className="font-bold text-base font-tamil">{i18n.language === 'en' ? item.name_en : item.name_ta}</div>
                <button onClick={() => removeItem(item.id)} className="text-red-400"><Trash2 size={18} /></button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button onClick={() => updateQty(item.id, -1)} className="w-10 h-10 flex justify-center items-center rounded-lg bg-gray-200 dark:bg-gray-600"><Minus size={18}/></button>
                  <span className="font-bold text-lg">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-10 h-10 flex justify-center items-center rounded-lg bg-brandGreen text-white"><Plus size={18}/></button>
                </div>
                <div className="font-bold text-lg">₹{item.price * item.qty}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t dark:border-darkBorder bg-gray-50 dark:bg-gray-900 flex flex-col gap-2 shrink-0">
          <div className="flex justify-between text-sm text-gray-500"><span>{t('Total')}</span><span>₹{subTotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-xl font-bold py-1 text-orange-600"><span>{t('Grand Total')}</span><span>₹{grandTotal.toFixed(2)}</span></div>
          <button onClick={() => setIsPaymentOpen(true)} disabled={cart.length === 0} className="w-full py-4 rounded-xl font-bold bg-orange-500 text-white text-xl flex items-center justify-center gap-2 shadow-lg disabled:bg-gray-400"><Banknote size={24} /> {t('Pay Bill')}</button>
        </div>
      </div>
      
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
