import express from 'express';
import cors from 'cors';
import { supabase } from './supabase.js';

const app = express();
app.use(cors());
app.use(express.json());

// Auth
app.post('/api/login', async (req, res) => {
  const { pin } = req.body;
  const { data: user, error } = await supabase
    .from('users')
    .select('id, name, role')
    .eq('pin', pin)
    .single();

  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: 'Invalid PIN' });
  }
});

// Menu Categories
app.get('/api/categories', async (req, res) => {
  const { data, error } = await supabase
    .from('menu_categories')
    .select('*')
    .order('sort_order', { ascending: true });
  res.json(data || []);
});

// Menu Items
app.get('/api/menu', async (req, res) => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('id', { ascending: true });
  res.json(data || []);
});

app.post('/api/menu', async (req, res) => {
  const { category_id, code, name_en, name_ta, price, is_special, available } = req.body;
  const { data, error } = await supabase
    .from('menu_items')
    .insert([{ category_id, code, name_en, name_ta, price, is_special, available }])
    .select()
    .single();

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true, id: data.id });
});

app.put('/api/menu/:id', async (req, res) => {
  const { id } = req.params;
  const { category_id, code, name_en, name_ta, price, is_special, available } = req.body;
  const { error } = await supabase
    .from('menu_items')
    .update({ category_id, code, name_en, name_ta, price, is_special, available })
    .eq('id', id);

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true });
});

app.delete('/api/menu/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true });
});

// Bills (Create)
app.post('/api/bills', async (req, res) => {
  const { type, table_id, items, discount_amount, discount_percent, gst_amount, total, final_amount, delivery_partner, packing_charge } = req.body;
  
  // Get next bill number (simplified for Supabase, ideally use a function or trigger)
  const { count } = await supabase.from('bills').select('*', { count: 'exact', head: true });
  const bill_number = `VRS-${String((count || 0) + 1).padStart(3, '0')}`;

  const { data: bill, error: billError } = await supabase
    .from('bills')
    .insert([{
      bill_number, type, total, discount_amount, gst_amount, final_amount, status: 'open', delivery_partner, packing_charge
    }])
    .select()
    .single();

  if (billError) return res.status(500).json({ success: false, error: billError.message });

  const billItems = items.map(item => ({
    bill_id: bill.id,
    item_id: item.id,
    qty: item.qty,
    price: item.price,
    total: item.qty * item.price
  }));

  const { error: itemsError } = await supabase.from('bill_items').insert(billItems);
  
  if (itemsError) return res.status(500).json({ success: false, error: itemsError.message });

  res.json({ success: true, billId: bill.id, bill_number });
});

// Checkout / Pay Bill
app.post('/api/bills/:id/pay', async (req, res) => {
  const { id } = req.params;
  const { payment_method, cash_paid, upi_paid } = req.body;

  const { error } = await supabase
    .from('bills')
    .update({ status: 'paid', payment_method, cash_paid, upi_paid })
    .eq('id', id);

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true });
});

// Reports
app.get('/api/reports', async (req, res) => {
  const { range } = req.query;
  // Note: Range filtering logic would be more complex in SQL, 
  // simplified here to return all paid bills for now
  const { data: bills, error } = await supabase
    .from('bills')
    .select('*, bill_items(*, menu_items(name_en, name_ta))')
    .eq('status', 'paid');

  if (error) return res.status(500).json({ success: false, error: error.message });

  // Process data for frontend summary
  const summary = {
    total_orders: bills.length,
    total_sales: bills.reduce((acc, b) => acc + b.final_amount, 0),
    cash_total: bills.reduce((acc, b) => acc + b.cash_paid, 0),
    upi_total: bills.reduce((acc, b) => acc + b.upi_paid, 0),
    total_tax: bills.reduce((acc, b) => acc + b.gst_amount, 0),
  };

  res.json({ summary, topItems: [], hourlySales: [] });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Supabase-connected Backend running on port ${PORT}`);
});
