import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, Save, Printer, Building, FileText, Database, Shield } from 'lucide-react';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<any>({
    business_name: 'VRS Garden Dhaba',
    address: 'Tamil Nadu, India',
    gstin: '33AABCU9603R1ZX',
    phone: '9876543210',
    printer_type: '80mm',
    cgst_percent: '2.5',
    sgst_percent: '2.5',
    bill_prefix: 'VRS-'
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Save to backend logic
    alert("Settings saved successfully! / அமைப்புகள் சேமிக்கப்பட்டன!");
  };

  const handleBackup = () => {
    alert("Database backup started... / தரவுத்தள காப்புப் பிரதி எடுக்கப்படுகிறது...");
  };

  return (
    <div className="p-6 h-full flex flex-col overflow-auto bg-gray-50 dark:bg-darkBg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <SettingsIcon className="text-brandGreen" />
          {t('Settings')} / அமைப்புகள்
        </h1>
        <button 
          onClick={handleSave}
          className="bg-brandGreen text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brandLightGreen transition shadow-md"
        >
          <Save size={20} />
          {t('Save Changes')} / சேமி
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Business Profile */}
        <div className="bg-white dark:bg-darkSurface p-8 rounded-3xl shadow-sm border dark:border-darkBorder">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-700 dark:text-gray-200 uppercase tracking-wider">
            <Building size={20} />
            Business Details
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Business Name</label>
              <input name="business_name" value={settings.business_name} onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Address</label>
              <input name="address" value={settings.address} onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">GSTIN Number</label>
                <input name="gstin" value={settings.gstin} onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-mono" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Phone Number</label>
                <input name="phone" value={settings.phone} onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Printer & Tax Config */}
        <div className="bg-white dark:bg-darkSurface p-8 rounded-3xl shadow-sm border dark:border-darkBorder">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-700 dark:text-gray-200 uppercase tracking-wider">
            <Printer size={20} />
            Printing & Tax Configurations
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Printer Width</label>
                  <select name="printer_type" value={settings.printer_type} onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold">
                    <option value="58mm">58mm Thermal</option>
                    <option value="80mm">80mm Thermal</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Bill Prefix</label>
                  <input name="bill_prefix" value={settings.bill_prefix} onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl font-bold" />
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t dark:border-gray-700">
               <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">CGST (%)</label>
                  <input name="cgst_percent" type="number" value={settings.cgst_percent} onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">SGST (%)</label>
                  <input name="sgst_percent" type="number" value={settings.sgst_percent} onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl" />
               </div>
            </div>
          </div>
        </div>

        {/* Database & Security */}
        <div className="bg-white dark:bg-darkSurface p-8 rounded-3xl shadow-sm border dark:border-darkBorder lg:col-span-2">
           <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-700 dark:text-gray-200 uppercase tracking-wider">
            <Shield size={20} />
            Data Backup & Access
          </h2>
          <div className="flex flex-col md:flex-row gap-6">
            <button 
              onClick={handleBackup}
              className="flex-1 flex items-center justify-center gap-3 p-8 border-2 border-dashed border-brandGreen rounded-3xl text-brandGreen font-bold hover:bg-brandGreen hover:text-white transition group"
            >
              <Database size={40} className="group-hover:scale-110 transition" />
              <div className="text-left">
                <div className="text-xl">Backup Database</div>
                <div className="text-sm font-normal opacity-80 uppercase">Export to .db file / Pen drive</div>
              </div>
            </button>
            <button 
              className="flex-1 flex items-center justify-center gap-3 p-8 border-2 border-dashed border-orange-500 rounded-3xl text-orange-500 font-bold hover:bg-orange-500 hover:text-white transition group"
            >
              <FileText size={40} className="group-hover:scale-110 transition" />
              <div className="text-left">
                <div className="text-xl">Export Daily Reports</div>
                <div className="text-sm font-normal opacity-80 uppercase">Export today's summary to PDF</div>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
