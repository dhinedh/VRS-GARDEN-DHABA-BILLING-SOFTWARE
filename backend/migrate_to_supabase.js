import Database from 'better-sqlite3';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const db = new Database('dhaba.db');

// Use SERVICE ROLE KEY to bypass RLS during migration
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);

const migrate = async () => {
  console.log('Starting migration to Supabase...');

  try {
    // 1. Migrate Categories
    const categories = db.prepare('SELECT * FROM menu_categories').all();
    console.log(`Migrating ${categories.length} categories...`);
    // Remove id to let Supabase handle it or keep it if needed
    const { data: catData, error: catError } = await supabase.from('menu_categories').upsert(categories);
    if (catError) throw catError;

    // 2. Migrate Items
    const items = db.prepare('SELECT * FROM menu_items').all();
    console.log(`Migrating ${items.length} items...`);
    const processedItems = items.map(item => ({
      category_id: item.category_id,
      code: item.code,
      name_en: item.name_en,
      name_ta: item.name_ta,
      price: item.price,
      available: !!item.available,
      is_special: !!item.is_special
    }));
    const { error: itemError } = await supabase.from('menu_items').upsert(processedItems);
    if (itemError) throw itemError;

    // 3. Migrate Users
    const users = db.prepare('SELECT * FROM users').all();
    console.log(`Migrating ${users.length} users...`);
    const { error: userError } = await supabase.from('users').upsert(users);
    if (userError) throw userError;

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error.message);
  }
};

migrate();
