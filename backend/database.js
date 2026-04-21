import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'dhaba.db');
const db = new Database(dbPath, { verbose: console.log });

db.pragma('journal_mode = WAL');

const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL, -- Owner, Cashier, Waiter
      pin TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS menu_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_en TEXT,
      name_ta TEXT,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      code TEXT, -- Menu Item Number/Code
      name_en TEXT NOT NULL,
      name_ta TEXT NOT NULL,
      price REAL NOT NULL,
      gst_applicable BOOLEAN DEFAULT 1,
      available BOOLEAN DEFAULT 1,
      is_special BOOLEAN DEFAULT 0,
      image_path TEXT,
      FOREIGN KEY (category_id) REFERENCES menu_categories(id)
    );

    CREATE TABLE IF NOT EXISTS tables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_number TEXT NOT NULL UNIQUE,
      status TEXT DEFAULT 'free', -- free, occupied, waiting_payment
      current_order_id INTEGER,
      merged_to INTEGER,
      occupied_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_number TEXT UNIQUE,
      type TEXT, -- table, parcel
      total REAL,
      discount_amount REAL DEFAULT 0,
      discount_percent REAL DEFAULT 0,
      gst_amount REAL DEFAULT 0,
      final_amount REAL,
      payment_method TEXT, -- cash, upi, split
      status TEXT DEFAULT 'open', -- open, held, paid, cancelled
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      cash_paid REAL DEFAULT 0,
      upi_paid REAL DEFAULT 0,
      customer_name TEXT,
      customer_phone TEXT,
      delivery_partner TEXT, -- swiggy, zomato, direct
      packing_charge REAL DEFAULT 0,
      table_id INTEGER
    );

    CREATE TABLE IF NOT EXISTS bill_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_id INTEGER,
      item_id INTEGER,
      qty INTEGER NOT NULL,
      price REAL NOT NULL,
      total REAL NOT NULL,
      notes TEXT,
      FOREIGN KEY (bill_id) REFERENCES bills(id),
      FOREIGN KEY (item_id) REFERENCES menu_items(id)
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
    CREATE INDEX IF NOT EXISTS idx_bill_items_bill ON bill_items(bill_id);
    CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(status);
    CREATE INDEX IF NOT EXISTS idx_bills_date ON bills(created_at);
  `);

  // Default Settings
  const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  insertSetting.run('business_name', 'VRS Garden Dhaba');
  insertSetting.run('address', 'Tamil Nadu, India');
  insertSetting.run('gstin', '33AABCU9603R1ZX');
  insertSetting.run('phone', '9876543210');
  insertSetting.run('printer_type', '80mm');
  insertSetting.run('cgst_percent', '2.5');
  insertSetting.run('sgst_percent', '2.5');
  insertSetting.run('bill_prefix', 'VRS-');

  // Default Users
  const checkUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (checkUsers.count === 0) {
    const insertUser = db.prepare('INSERT INTO users (name, role, pin) VALUES (?, ?, ?)');
    insertUser.run('Owner', 'Owner', '1234');
  }

  // Sample Categories
  const checkCats = db.prepare('SELECT COUNT(*) as count FROM menu_categories').get();
  if (checkCats.count === 0) {
    const insertCat = db.prepare('INSERT INTO menu_categories (name_en, name_ta) VALUES (?, ?)');
    insertCat.run('Rice items', 'சோறு வகைகள்');
    insertCat.run('Tiffin', 'டிபன் வகைகள்');
    insertCat.run('Beverages', 'குடிநீர்');
    insertCat.run('Specials', 'சிறப்பு உணவுகள்');
    insertCat.run('Sides', 'பக்க உணவுகள்');
  }

  // Sample Menu
  const checkItems = db.prepare('SELECT COUNT(*) as count FROM menu_items').get();
  if (checkItems.count === 0) {
    const insertItem = db.prepare('INSERT INTO menu_items (category_id, name_en, name_ta, price, is_special) VALUES (?, ?, ?, ?, ?)');
    
    // Rice
    insertItem.run(1, 'Meals', 'சாப்பாடு', 80, 0);
    insertItem.run(1, 'Curd rice', 'தயிர் சாதம்', 60, 0);
    insertItem.run(1, 'Lemon rice', 'எலுமிச்சை சாதம்', 50, 0);
    insertItem.run(1, 'Sambar rice', 'சாம்பார் சாதம்', 50, 0);

    // Tiffin
    insertItem.run(2, 'Idli (2 pcs)', 'இட்லி (2)', 30, 0);
    insertItem.run(2, 'Dosa', 'தோசை', 40, 0);
    insertItem.run(2, 'Parotta', 'பரோட்டா', 20, 0);
    insertItem.run(2, 'Pongal', 'பொங்கல்', 40, 0);
    insertItem.run(2, 'Upma', 'உப்புமா', 35, 0);

    // Beverages
    insertItem.run(3, 'Tea', 'தேநீர்', 15, 0);
    insertItem.run(3, 'Coffee', 'காபி', 20, 0);
    insertItem.run(3, 'Lassi', 'லஸ்ஸி', 40, 0);
    insertItem.run(3, 'Buttermilk', 'மோர்', 20, 0);

    // Specials
    insertItem.run(4, 'Fish curry meals', 'மீன் குழம்பு சாப்பாடு', 120, 1);
    insertItem.run(4, 'Chicken biryani', 'சிக்கன் பிரியாணி', 150, 1);
    insertItem.run(4, 'Mutton biryani', 'மட்டன் பிரியாணி', 180, 1);

    // Sides
    insertItem.run(5, 'Raita', 'தயிர் பச்சடி', 25, 0);
    insertItem.run(5, 'Opapad', 'அப்பளம்', 10, 0);
  }

  // Default Tables
  const checkTables = db.prepare('SELECT COUNT(*) as count FROM tables').get();
  if (checkTables.count === 0) {
    const insertTable = db.prepare('INSERT INTO tables (table_number) VALUES (?)');
    for (let i = 1; i <= 15; i++) {
      insertTable.run(`T-${i}`);
    }
  }
};

initDb();

export default db;
