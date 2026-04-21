import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';

export default function TablesScreen() {
  const { t } = useTranslation();
  const [tables, setTables] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/tables').then(res => res.json()).then(setTables);
  }, []);

  return (
    <div className="p-4 md:p-6 h-full flex flex-col overflow-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold">{t('Tables')}</h1>
        <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-base">
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-3 md:w-4 h-3 md:h-4 rounded-full bg-green-500"></div>
            <span>{t('Free')}</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-3 md:w-4 h-3 md:h-4 rounded-full bg-red-500"></div>
            <span>{t('Occupied')}</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-3 md:w-4 h-3 md:h-4 rounded-full bg-yellow-500"></div>
            <span>{t('Waiting')}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-darkSurface p-4 md:p-6 rounded-2xl shadow-sm border dark:border-darkBorder">
        {/* Floor Map Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {tables.map(table => {
            let bgColor = 'bg-green-100 border-green-400 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            let statusColor = 'bg-green-500';
            
            if (table.status === 'occupied') {
              bgColor = 'bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:text-red-400';
              statusColor = 'bg-red-500';
            } else if (table.status === 'waiting_payment') {
              bgColor = 'bg-yellow-100 border-yellow-400 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
              statusColor = 'bg-yellow-500';
            }

            return (
              <button 
                key={table.id}
                className={`relative h-40 rounded-3xl border-2 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform shadow-sm ${bgColor}`}
              >
                <div className={`absolute top-3 right-3 w-3 h-3 rounded-full shadow-sm ${statusColor}`}></div>
                <h3 className="text-3xl font-bold">{table.table_number}</h3>
                
                {table.status !== 'free' && (
                  <div className="flex items-center gap-1 text-sm font-medium opacity-80 mt-2">
                     <Clock size={16} /> 45m
                  </div>
                )}
                
                {table.status === 'free' && (
                  <div className="text-sm font-medium opacity-60 mt-2">{t('Free')}</div>
                )}
                
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
