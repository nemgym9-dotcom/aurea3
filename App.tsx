
import React, { useState, useEffect } from 'react';
import { Palette, Eye, EyeOff } from 'lucide-react';
import { Route, ThemeConfig, Expense, Investment } from './types';
import { THEMES } from './constants';
import { DesktopSidebar, MobileBottomNav } from './components/Navigation';
import { WelcomeScreen } from './components/WelcomeScreen';
import { HomeScreen } from './components/HomeScreen';
import { AddExpenseScreen } from './components/AddExpenseScreen';
import { InvestmentScreen } from './components/InvestmentScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { LockScreen } from './components/LockScreen';
import { SecureStore } from './utils/storage';

export default function App() {
  const [themeKey, setThemeKey] = useState<string>('bordeaux');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [salary, setSalary] = useState(0);
  const [currentRoute, setCurrentRoute] = useState<Route>('Home');
  const [isValuesVisible, setIsValuesVisible] = useState(true);
  
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', category: 'Alimentação', amount: 42, date: new Date().toISOString() },
    { id: '2', category: 'Transporte', amount: 85, date: new Date(Date.now() - 86400000).toISOString() },
  ]);

  const [investments, setInvestments] = useState<Investment[]>([
    { 
      id: 'inv1', 
      name: 'HGLG11', 
      type: 'FII', 
      quantity: 10, 
      purchasePrice: 155.50, 
      currentPrice: 162.30, 
      purchaseDate: '2024-01-10' 
    },
    { 
      id: 'inv2', 
      name: 'PETR4', 
      type: 'Ação', 
      quantity: 100, 
      purchasePrice: 32.10, 
      currentPrice: 38.45, 
      purchaseDate: '2023-11-15' 
    }
  ]);

  const theme = THEMES[themeKey];

  // Carrega configurações persistidas ao iniciar
  useEffect(() => {
    async function loadStoredData() {
      try {
        const storedSalary = await SecureStore.getItemAsync('user_salary');
        const storedTheme = await SecureStore.getItemAsync('user_theme');
        const storedConfig = await SecureStore.getItemAsync('is_configured');
        const autoTheme = await SecureStore.getItemAsync('auto_theme');

        if (storedSalary) setSalary(parseFloat(storedSalary));
        if (storedConfig === 'true') setIsConfigured(true);

        if (autoTheme === 'true') {
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setThemeKey(isDark ? 'bordeaux' : 'emerald'); // Bordeaux como dark default, Emerald como light default
        } else if (storedTheme) {
          setThemeKey(storedTheme);
        }
      } catch (e) {
        console.error('Falha ao carregar dados:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadStoredData();
  }, []);

  // Monitora mudanças no tema do sistema se "Auto Theme" estiver ativo
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = async () => {
      const autoTheme = await SecureStore.getItemAsync('auto_theme');
      if (autoTheme === 'true') {
        setThemeKey(mediaQuery.matches ? 'bordeaux' : 'emerald');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleFinishSetup = async (val: number, pin: string) => {
    setSalary(val);
    setIsConfigured(true);
    setIsLocked(false);
    await SecureStore.setItemAsync('user_salary', val.toString());
    await SecureStore.setItemAsync('app_pin', pin);
    await SecureStore.setItemAsync('is_configured', 'true');
  };

  const toggleTheme = async () => {
    const newTheme = themeKey === 'bordeaux' ? 'emerald' : 'bordeaux';
    setThemeKey(newTheme);
    await SecureStore.setItemAsync('user_theme', newTheme);
    await SecureStore.setItemAsync('auto_theme', 'false'); // Desativa auto se mudar manualmente
  };

  const addExpense = (newExp: Expense) => setExpenses(prev => [newExp, ...prev]);
  const addInvestment = (newInv: Investment) => setInvestments(prev => [newInv, ...prev]);
  const removeInvestment = (id: string) => setInvestments(prev => prev.filter(i => i.id !== id));

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isConfigured) {
        setIsLocked(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isConfigured]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin" style={{ borderTopColor: theme.primary }} />
      </div>
    );
  }

  if (!isConfigured) {
    return <WelcomeScreen onFinish={handleFinishSetup} theme={theme} />;
  }

  if (isLocked) {
    return <LockScreen onUnlock={() => setIsLocked(false)} theme={theme} />;
  }

  const renderContent = () => {
    switch(currentRoute) {
      case 'Home': 
        return <HomeScreen 
          onNavigate={setCurrentRoute} 
          expenses={expenses} 
          isVisible={isValuesVisible} 
          salary={salary} 
          theme={theme} 
        />;
      case 'AddExpense': 
        return <AddExpenseScreen 
          onAdd={addExpense} 
          onNavigate={setCurrentRoute} 
          theme={theme} 
        />;
      case 'Investments': 
        return <InvestmentScreen 
          investments={investments} 
          onAdd={addInvestment} 
          onRemove={removeInvestment} 
          isVisible={isValuesVisible} 
          theme={theme} 
        />;
      case 'History': 
        return <HistoryScreen 
          expenses={expenses} 
          isVisible={isValuesVisible} 
          theme={theme} 
        />;
      case 'Settings':
        return <SettingsScreen 
          theme={theme} 
          toggleTheme={toggleTheme} 
        />;
      default: 
        return <HomeScreen 
          onNavigate={setCurrentRoute} 
          expenses={expenses} 
          isVisible={isValuesVisible} 
          salary={salary} 
          theme={theme} 
        />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 pb-32 md:pb-0 md:pl-72 relative transition-colors duration-500 overflow-x-hidden">
      <DesktopSidebar 
        currentRoute={currentRoute} 
        onNavigate={setCurrentRoute} 
        theme={theme} 
      />

      <main className="max-w-5xl mx-auto p-6 md:p-14">
        <header className="mb-12 flex justify-between items-end">
          <div className="animate-in slide-in-from-left-4 duration-500">
            <p className="font-black text-xs uppercase tracking-[0.3em] mb-2 transition-colors duration-500" style={{ color: theme.primary }}>Aura Finance</p>
            <h2 className="text-4xl font-black text-white tracking-tighter italic">
              {currentRoute === 'Home' ? 'Dash' : 
               currentRoute === 'AddExpense' ? 'Gastos Mensais' : 
               currentRoute === 'Investments' ? 'Assets' : 
               currentRoute === 'History' ? 'Extrato' : 
               currentRoute === 'Settings' ? 'Setup' : currentRoute}
            </h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={toggleTheme}
              className="w-12 h-12 md:w-14 md:h-14 bg-[#121212] rounded-2xl flex items-center justify-center text-gray-500 border border-[#1c1c1c] active:rotate-180 transition-all hover:border-gray-600"
              title="Mudar Tema"
            >
               <Palette size={20} style={{ color: theme.primary }} />
            </button>
            <button 
              onClick={() => setIsValuesVisible(!isValuesVisible)}
              className="w-12 h-12 md:w-14 md:h-14 bg-[#121212] rounded-2xl flex items-center justify-center text-gray-500 border border-[#1c1c1c] hover:border-gray-600 transition-colors"
              title="Esconder/Mostrar Valores"
            >
               {isValuesVisible ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
        </header>

        {renderContent()}
      </main>

      <MobileBottomNav 
        currentRoute={currentRoute} 
        onNavigate={setCurrentRoute} 
        theme={theme} 
      />
    </div>
  );
}
