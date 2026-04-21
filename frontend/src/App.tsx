import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Receipt, Table as TableIcon, Settings as SettingsIcon, LogOut, Package, Utensils, Sun, Moon } from 'lucide-react';

// Components
import LoginScreen from './pages/LoginScreen.tsx';
import BillingScreen from './pages/BillingScreen.tsx';
import TablesScreen from './pages/TablesScreen.tsx';
import ReportsScreen from './pages/ReportsScreen.tsx';
import ParcelScreen from './pages/ParcelScreen.tsx';
import SettingsScreen from './pages/SettingsScreen.tsx';
import MenuManagement from './pages/MenuManagement.tsx';
import Reporting from './pages/Reporting.tsx';

function NavItem({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to}
      className={`flex items-center gap-3 p-3 rounded-xl transition ${isActive ? 'bg-brandGreen text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-brandGreen/10 hover:text-brandGreen'}`}
    >
      {icon}
      <span className="hidden md:block font-medium">{label}</span>
    </Link>
  );
}

function MobileNavItem({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to}
      className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition relative ${isActive ? 'text-brandGreen' : 'text-gray-400'}`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase">{label}</span>
      {isActive && <div className="w-8 h-1 bg-brandGreen rounded-full absolute bottom-1"></div>}
    </Link>
  );
}

function App() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<{ name: string, role: string } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ta' : 'en');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 dark:bg-darkBg text-gray-900 dark:text-gray-100 font-sans overflow-hidden">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 bg-white dark:bg-darkSurface border-r dark:border-darkBorder flex-col justify-between transition-all duration-300">
          <div>
            <div className="p-4 flex items-center justify-center md:justify-start">
              <div className="w-10 h-10 bg-brandGreen rounded-full flex items-center justify-center text-white font-bold text-xl">V</div>
              <span className="hidden md:block ml-3 font-bold text-lg text-brandGreen dark:text-brandLightGreen">VRS Dhaba</span>
            </div>
            <nav className="mt-6 flex flex-col gap-2 px-2">
              <NavItem to="/" icon={<Receipt />} label={t('Billing')} />
              <NavItem to="/parcel" icon={<Package />} label={t('Parcel')} />
              <NavItem to="/menu" icon={<Utensils />} label={t('Menu Management')} />
              <NavItem to="/reports" icon={<LayoutDashboard />} label={t('Reports')} />
              <NavItem to="/settings" icon={<SettingsIcon />} label={t('Settings')} />
            </nav>
          </div>
          
          <div className="p-4 border-t dark:border-darkBorder flex flex-col gap-4">
              <button 
                onClick={toggleLanguage}
                className="w-full py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {i18n.language === 'en' ? 'தமிழ்' : 'English'}
              </button>
              <button 
                onClick={() => setUser(null)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <LogOut size={20} />
                <span>{t('Logout')}</span>
              </button>
          </div>
        </aside>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-darkSurface border-t dark:border-darkBorder z-50 flex justify-around items-center h-16 px-2">
          <MobileNavItem to="/" icon={<Receipt size={24} />} label={t('POS')} />
          <MobileNavItem to="/menu" icon={<Utensils size={24} />} label={t('Menu')} />
          <MobileNavItem to="/parcel" icon={<Package size={24} />} label={t('Parcel')} />
          <MobileNavItem to="/reports" icon={<LayoutDashboard size={24} />} label={t('Stats')} />
          <MobileNavItem to="/settings" icon={<SettingsIcon size={24} />} label={t('Settings')} />
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden pb-16 md:pb-0">
          <header className="h-14 bg-white dark:bg-darkSurface border-b dark:border-darkBorder flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-2 md:hidden">
               <div className="w-8 h-8 bg-brandGreen rounded-full flex items-center justify-center text-white font-bold text-sm">V</div>
               <span className="font-bold text-brandGreen dark:text-brandLightGreen">VRS Dhaba</span>
            </div>
            <div className="flex items-center gap-4 ml-auto">
               <button 
                 onClick={toggleTheme}
                 className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
               >
                 {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
               </button>
               <button 
                 onClick={toggleLanguage}
                 className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 font-bold text-xs uppercase"
               >
                 {i18n.language === 'en' ? 'TA' : 'EN'}
               </button>
               <div className="bg-brandSaffron/10 px-3 py-1 rounded-full text-brandSaffron font-medium text-sm hidden sm:block">
                 {user.name}
               </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<BillingScreen />} />
              <Route path="/tables" element={<TablesScreen />} />
              <Route path="/parcel" element={<ParcelScreen />} />
              <Route path="/menu" element={<MenuManagement />} />
              <Route path="/reports" element={<Reporting />} />
              <Route path="/settings" element={<SettingsScreen />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
