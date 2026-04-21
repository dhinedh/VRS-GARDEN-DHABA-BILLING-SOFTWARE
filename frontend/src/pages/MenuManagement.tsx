import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon } from 'lucide-react';

export default function MenuManagement() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, catsRes] = await Promise.all([
        fetch('http://localhost:5000/api/menu'),
        fetch('http://localhost:5000/api/categories')
      ]);
      const itemsData = await itemsRes.json();
      const catsData = await catsRes.json();
      setItems(itemsData);
      setCategories(catsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const itemData = {
      code: formData.get('code'),
      name_en: formData.get('name_en'),
      name_ta: formData.get('name_ta'),
      category_id: parseInt(formData.get('category_id') as string),
      price: parseFloat(formData.get('price') as string),
      is_special: formData.get('is_special') === 'on',
      available: formData.get('available') === 'on'
    };

    try {
      const url = editingItem 
        ? `http://localhost:5000/api/menu/${editingItem.id}` 
        : 'http://localhost:5000/api/menu';
      
      const response = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });

      if (response.ok) {
        setShowForm(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error saving menu item:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this item? / இந்த பொருளை நீக்க வேண்டுமா?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/menu/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchData();
        }
      } catch (error) {
        console.error("Error deleting menu item:", error);
      }
    }
  };

  return (
    <div className="p-6 h-full flex flex-col overflow-auto bg-gray-50 dark:bg-darkBg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-tight">{t('Menu Management')}</h1>
        <button 
          onClick={() => { setEditingItem(null); setShowForm(true); }}
          className="bg-brandGreen text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-brandLightGreen transition shadow-lg shadow-brandGreen/20 active:scale-95"
        >
          <Plus size={20} />
          {t('Add New')}
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white dark:bg-darkSurface w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 border dark:border-gray-800">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black uppercase">{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
              <button onClick={() => setShowForm(false)} className="p-3 bg-gray-100 rounded-2xl dark:bg-gray-800 hover:bg-gray-200 transition"><X /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Item Number (Code)</label>
                <input name="code" type="text" required className="w-full p-4 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-2xl focus:ring-2 ring-brandGreen/20 outline-none transition font-bold" placeholder="e.g. 101" defaultValue={editingItem?.code} />
              </div>
              <div className="col-span-2 md:col-span-1">
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Item Name (English)</label>
                <input name="name_en" type="text" required className="w-full p-4 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-2xl focus:ring-2 ring-brandGreen/20 outline-none transition" placeholder="e.g. Chicken Biryani" defaultValue={editingItem?.name_en} />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">பெயர் (தமிழ்)</label>
                <input name="name_ta" type="text" required className="w-full p-4 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-2xl font-tamil focus:ring-2 ring-brandGreen/20 outline-none transition" placeholder="எ.கா. சிக்கன் பிரியாணி" defaultValue={editingItem?.name_ta} />
              </div>
              
              <div className="col-span-1">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
                <select name="category_id" required className="w-full p-4 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-2xl focus:ring-2 ring-brandGreen/20 outline-none transition" defaultValue={editingItem?.category_id}>
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name_en} / {cat.name_ta}</option>
                  ))}
                </select>
              </div>
              
              <div className="col-span-1">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Price (₹)</label>
                <input name="price" type="number" step="0.01" required className="w-full p-4 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-2xl focus:ring-2 ring-brandGreen/20 outline-none transition font-mono text-lg" placeholder="0.00" defaultValue={editingItem?.price} />
              </div>

              <div className="flex items-center gap-8 col-span-2 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border dark:border-gray-800">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input name="is_special" type="checkbox" className="w-6 h-6 rounded-lg accent-brandGreen" defaultChecked={editingItem?.is_special} />
                  <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-brandGreen transition">Today's Special</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input name="available" type="checkbox" className="w-6 h-6 rounded-lg accent-brandGreen" defaultChecked={editingItem?.available !== false} />
                  <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-brandGreen transition">Available Today</span>
                </label>
              </div>

              <div className="col-span-2 pt-4 flex gap-4">
                <button type="submit" className="flex-1 py-5 bg-brandGreen text-white rounded-2xl font-black uppercase tracking-widest hover:bg-brandLightGreen transition shadow-xl shadow-brandGreen/20 active:scale-[0.98]">
                   {editingItem ? t('Update Item') : t('Create Item')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border dark:border-darkBorder overflow-hidden">
        {/* Mobile List View */}
        <div className="md:hidden divide-y dark:divide-gray-700">
          {items.map(item => (
            <div key={item.id} className="p-4 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-lg font-tamil">{item.name_ta}</div>
                  <div className="text-gray-500 text-xs">{item.name_en}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-brandGreen">₹{item.price}</div>
                  {item.available ? (
                    <span className="text-[10px] text-green-600 font-bold uppercase">Available</span>
                  ) : (
                    <span className="text-[10px] text-red-600 font-bold uppercase">Sold Out</span>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-2 pt-2 border-t dark:border-gray-800">
                  <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-blue-50 text-blue-600 rounded flex items-center gap-1 text-sm"><Edit2 size={14} /> Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-red-50 text-red-600 rounded flex items-center gap-1 text-sm"><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <table className="hidden md:table w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 uppercase text-sm">
            <tr>
              <th className="px-6 py-4 w-20">#</th>
              <th className="px-6 py-4">Item Details</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <td className="px-6 py-4 font-black text-gray-400">
                  {item.code}
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-lg font-tamil">{item.name_ta}</div>
                  <div className="text-gray-500 text-sm">{item.name_en}</div>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {categories.find(c => c.id === item.category_id)?.name_en || 'Other'}
                </td>
                <td className="px-6 py-4 font-bold text-brandGreen">₹{item.price}</td>
                <td className="px-6 py-4">
                  {item.available ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold uppercase">Available</span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold uppercase">Sold Out</span>
                  )}
                  {item.is_special && (
                    <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-bold uppercase">Special</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
