import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ReportsScreen() {
  const { t } = useTranslation();
  
  // Dummy Data for chart
  const data = [
    { day: 'Mon', sales: 4000 },
    { day: 'Tue', sales: 3000 },
    { day: 'Wed', sales: 2000 },
    { day: 'Thu', sales: 2780 },
    { day: 'Fri', sales: 1890 },
    { day: 'Sat', sales: 2390 },
    { day: 'Sun', sales: 3490 },
  ];

  const topItems = [
    { name: 'Meals / சாப்பாடு', qty: 154, rev: 12320 },
    { name: 'Chicken Biryani / சிக்கன் பிரியாணி', qty: 98, rev: 14700 },
    { name: 'Parotta / பரோட்டா', qty: 310, rev: 6200 },
    { name: 'Tea / தேநீர்', qty: 450, rev: 6750 },
  ];

  return (
    <div className="p-6 h-full flex flex-col overflow-auto hidden-scrollbar bg-gray-50 dark:bg-darkBg">
      <h1 className="text-2xl font-bold mb-6">{t('Reports')} & Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-darkSurface p-6 rounded-2xl shadow-sm border border-brandGreen">
          <div className="text-gray-500 font-bold mb-2">Today's Sales</div>
          <div className="text-4xl font-bold text-brandGreen">₹12,450</div>
          <div className="mt-2 text-sm">₹8,450 Cash | ₹4,000 UPI</div>
        </div>
        <div className="bg-white dark:bg-darkSurface p-6 rounded-2xl shadow-sm border dark:border-darkBorder">
          <div className="text-gray-500 font-bold mb-2">Total Bills Generated</div>
          <div className="text-4xl font-bold">142</div>
          <div className="mt-2 text-sm text-gray-400">120 Dine-in | 22 Parcel</div>
        </div>
        <div className="bg-white dark:bg-darkSurface p-6 rounded-2xl shadow-sm border dark:border-darkBorder">
          <div className="text-gray-500 font-bold mb-2">Average Order Value</div>
          <div className="text-4xl font-bold text-brandSaffron">₹185</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart */}
        <div className="bg-white dark:bg-darkSurface p-6 rounded-2xl shadow-sm border dark:border-darkBorder font-sans">
          <h2 className="text-lg font-bold mb-6">Weekly Sales Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="sales" fill="#2E7D32" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Items Table */}
        <div className="bg-white dark:bg-darkSurface p-6 rounded-2xl shadow-sm border dark:border-darkBorder">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-lg font-bold">Top Selling Items Today</h2>
             <button className="text-brandSaffron font-bold hover:underline">Export CSV</button>
           </div>
           
           <table className="w-full text-left">
              <thead>
                <tr className="border-b dark:border-darkBorder text-gray-500">
                  <th className="pb-3 px-2">Item Name</th>
                  <th className="pb-3 px-2 text-right">Qty Sold</th>
                  <th className="pb-3 px-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                 {topItems.map((item, i) => (
                    <tr key={i} className="border-b dark:border-darkBorder last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                      <td className="py-4 px-2 font-bold text-gray-800 dark:text-gray-200">{item.name}</td>
                      <td className="py-4 px-2 text-right">{item.qty}</td>
                      <td className="py-4 px-2 text-right font-mono font-bold text-brandGreen">₹{item.rev}</td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>

      </div>
    </div>
  );
}
