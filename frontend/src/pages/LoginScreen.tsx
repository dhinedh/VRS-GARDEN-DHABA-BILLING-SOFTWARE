import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock, Delete } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: any) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const { t } = useTranslation();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleNumpad = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleLogin = async () => {
    if (pin.length !== 4) return;
    
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      const data = await res.json();
      
      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.message || t('Invalid PIN'));
        setPin('');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  // Auto submit on 4 digits
  React.useEffect(() => {
    if (pin.length === 4) {
      handleLogin();
    }
  }, [pin]);

  return (
    <div className="min-h-screen bg-brandGreen/5 flex items-center justify-center p-2 md:p-4">
      <div className="bg-white dark:bg-darkSurface w-full max-w-sm rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-brandGreen p-6 md:p-8 text-center text-white">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-4">
            <Lock size={28} />
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-tamil leading-tight">{t('VRS Garden Dhaba')}</h1>
          <p className="mt-1 md:mt-2 text-sm opacity-80 uppercase tracking-widest">{t('Pin Login')}</p>
        </div>
        
        <div className="p-6 md:p-8">
          {/* PIN Display */}
          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-3xl font-bold transition-all ${
                  pin[i] ? 'border-brandGreen bg-brandGreen text-white' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {pin[i] ? '•' : ''}
              </div>
            ))}
          </div>
          
          {error && (
            <p className="text-red-500 text-center font-medium mb-4">{error}</p>
          )}

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumpad(num.toString())}
                className="h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 text-2xl font-bold hover:bg-brandLightGreen hover:text-white transition active:scale-95"
              >
                {num}
              </button>
            ))}
             <button
                onClick={() => setPin('')}
                className="h-16 rounded-2xl bg-red-50 text-red-500 dark:bg-red-900/20 text-xl font-bold hover:bg-red-100 transition active:scale-95"
              >
                C
              </button>
              <button
                onClick={() => handleNumpad('0')}
                className="h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 text-2xl font-bold hover:bg-brandLightGreen hover:text-white transition active:scale-95"
              >
                0
              </button>
              <button
                onClick={handleDelete}
                className="h-16 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800 text-2xl font-bold hover:bg-gray-200 transition active:scale-95"
              >
                <Delete size={28} />
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
