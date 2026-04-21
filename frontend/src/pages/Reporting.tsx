import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, TrendingUp, TrendingDown, Users, 
  ShoppingBag, Calendar, ArrowUpRight, 
  Wallet, Landmark, Receipt, PieChart, 
  Download, Filter, RefreshCcw 
} from 'lucide-react';

export default function Reporting() {
  const { t } = useTranslation();
  const [range, setRange] = useState<'today' | 'week' | 'month'>('today');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/reports?range=${range}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  if (loading || !data) {
    return (
      <div className="flex h-full items-center justify-center">
        <RefreshCcw className="animate-spin text-brandGreen" size={48} />
      </div>
    );
  }

  const { summary, topItems, hourlySales } = data;

  const StatCard = ({ title, value, icon: Icon, color, subValue }: any) => (
    <div className="bg-white dark:bg-darkSurface p-6 rounded-[2rem] shadow-sm border border-transparent hover:shadow-xl transition-all relative overflow-hidden group">
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700 ${color}`}></div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-1">{t(title)}</p>
          <h3 className="text-3xl font-black text-gray-800 dark:text-white">
            {title.includes('Sales') ? '₹' : ''}{Number(value || 0).toLocaleString()}
          </h3>
          {subValue && <p className="text-sm text-gray-500 mt-1 font-medium">{subValue}</p>}
        </div>
        <div className={`p-3 rounded-2xl ${color.replace('bg-', 'bg-opacity-10 text-')}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-800 dark:text-white tracking-tighter uppercase">
            {t('Business')} <span className="text-brandGreen">Stats</span>
          </h1>
          <p className="text-gray-400 font-medium">{t('Real-time analytics for your Dhaba')}</p>
        </div>
        
        <div className="flex bg-white dark:bg-darkSurface p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-darkBorder">
          {(['today', 'week', 'month'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                range === r 
                  ? 'bg-brandGreen text-white shadow-lg' 
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {t(r.charAt(0).toUpperCase() + r.slice(1))}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Sales" 
          value={summary.total_sales} 
          icon={TrendingUp} 
          color="bg-brandGreen"
          subValue={t('After taxes')}
        />
        <StatCard 
          title="Order Count" 
          value={summary.total_orders} 
          icon={ShoppingBag} 
          color="bg-blue-500"
          subValue={t('Successful bills')}
        />
        <StatCard 
          title="Cash Intake" 
          value={summary.cash_total} 
          icon={Wallet} 
          color="bg-amber-500"
          subValue={`${((summary.cash_total / (summary.total_sales || 1)) * 100).toFixed(0)}% of total`}
        />
        <StatCard 
          title="UPI Payments" 
          value={summary.upi_total} 
          icon={Landmark} 
          color="bg-indigo-500" 
          subValue={`${((summary.upi_total / (summary.total_sales || 1)) * 100).toFixed(0)}% of total`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Popular Items - Progress Bars */}
        <div className="lg:col-span-1 bg-white dark:bg-darkSurface p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-darkBorder">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <PieChart className="text-brandGreen" />
              {t('Hot Items')}
            </h3>
          </div>
          
          <div className="space-y-6">
            {topItems.map((item: any, idx: number) => {
              const max = topItems[0].total_qty;
              const percentage = (item.total_qty / max) * 100;
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                       <span className="text-md font-black uppercase tracking-tight text-gray-800 dark:text-gray-100">{item.name_en}</span>
                       <span className="text-xs font-tamil text-gray-400">{item.name_ta}</span>
                    </div>
                    <span className="text-brandGreen font-black">{item.total_qty} {t('Sold')}</span>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-brandGreen to-brandLightGreen transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {topItems.length === 0 && <p className="text-center text-gray-400 py-10">No items sold yet</p>}
          </div>
        </div>

        {/* Hourly Sales Trend - Visual Stylized Bars */}
        <div className="lg:col-span-2 bg-brandGreen p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
             <BarChart3 size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black uppercase tracking-tighter">
                {t('Sales Trend')}
              </h3>
              <div className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/20">
                {range === 'today' ? t('Hour by Hour') : t('Performance')}
              </div>
            </div>

            <div className="flex items-end justify-between h-48 gap-3">
              {hourlySales.map((h: any, idx: number) => {
                const max = Math.max(...hourlySales.map((s: any) => s.sales), 1);
                const height = (h.sales / max) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-3">
                    <div className="w-full relative group">
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-brandGreen px-2 py-1 rounded text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                         ₹{h.sales}
                      </div>
                      <div 
                        className="w-full bg-white/20 hover:bg-white/40 rounded-t-lg transition-all duration-700"
                        style={{ height: `${Math.max(height, 5)}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-black opacity-60 rotate-45 md:rotate-0">{h.hour}</span>
                  </div>
                );
              })}
              {hourlySales.length === 0 && <p className="w-full text-center opacity-50 py-10 font-bold uppercase tracking-widest">{t('Waiting for data...')}</p>}
            </div>
          </div>
        </div>

      </div>

      {/* Tax Summary Footer */}
      <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
           <div className="bg-white dark:bg-darkSurface p-3 rounded-2xl shadow-sm"><Receipt className="text-brandGreen" /></div>
           <div className="flex flex-col">
              <span className="text-xs uppercase tracking-widest font-black text-gray-400 font-sans">Collected Tax</span>
              <span className="text-2xl font-black text-brandGreen">₹{Number(summary.total_tax || 0).toLocaleString()}</span>
           </div>
        </div>
        <button 
           onClick={() => window.print()}
           className="px-8 py-3 bg-white dark:bg-darkSurface text-gray-700 dark:text-gray-200 rounded-2xl font-black uppercase tracking-widest text-sm shadow-sm hover:shadow-lg transition-all flex items-center gap-3 border dark:border-darkBorder"
        >
           <Download size={18} />
           {t('Export PDF')}
        </button>
      </div>

    </div>
  );
}
