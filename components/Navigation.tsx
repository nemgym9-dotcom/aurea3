
import React from 'react';
import { LayoutDashboard, Folder, Plus, Settings } from 'lucide-react';
import { Route, NavigationProps } from '../types';

const NAV_ITEMS = [
  { name: 'Home' as Route, icon: LayoutDashboard, label: 'Dashboard' },
  { name: 'Investments' as Route, icon: Folder, label: 'Investimentos' },
  { name: 'AddExpense' as Route, icon: Plus, label: 'Gastos', primary: true },
  { name: 'Settings' as Route, icon: Settings, label: 'Configurações' },
];

export const DesktopSidebar: React.FC<NavigationProps> = ({ currentRoute, onNavigate, theme }) => (
  <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-72 bg-[#050505] border-r border-[#1c1c1c] p-10 z-50">
    <div className="flex items-center gap-4 mb-16 px-2">
      <div 
        className="w-12 h-12 rounded-[18px] flex items-center justify-center text-white font-black text-2xl shadow-2xl transition-all duration-500" 
        style={{ backgroundColor: theme.primary, boxShadow: `0 10px 20px -5px ${theme.shadow}` }}
      >
        Au
      </div>
      <h1 className="text-2xl font-black text-white tracking-tighter uppercase">Aura Finance</h1>
    </div>
    <nav className="space-y-6">
      {NAV_ITEMS.map((item) => (
        <button 
          key={item.name} 
          onClick={() => onNavigate(item.name)}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-black group ${currentRoute === item.name ? 'bg-[#121212] border border-[#1c1c1c]' : 'text-gray-600 hover:text-gray-400'}`}
          style={{ color: currentRoute === item.name ? theme.primary : undefined }}
        >
          <item.icon size={24} strokeWidth={currentRoute === item.name ? 3 : 2} />
          <span className="text-xs uppercase tracking-[0.2em]">{item.label}</span>
        </button>
      ))}
    </nav>
  </aside>
);

export const MobileBottomNav: React.FC<NavigationProps> = ({ currentRoute, onNavigate, theme }) => (
  <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-[#1c1c1c] h-20 rounded-[32px] flex items-center justify-around px-4 z-50 shadow-2xl shadow-black/50">
    {NAV_ITEMS.map((item) => (
      <button 
        key={item.name} 
        onClick={() => onNavigate(item.name)}
        className={`flex flex-col items-center gap-1 transition-all ${item.primary ? 'w-14 h-14 rounded-[20px] shadow-2xl text-white -translate-y-8 border-4 border-black' : currentRoute === item.name ? '' : 'text-gray-700'}`}
        style={{ 
          backgroundColor: item.primary ? theme.primary : undefined,
          boxShadow: item.primary ? `0 10px 30px -5px ${theme.shadow}` : undefined,
          color: !item.primary && currentRoute === item.name ? theme.primary : undefined
        }}
      >
        <item.icon size={item.primary ? 28 : 22} strokeWidth={currentRoute === item.name || item.primary ? 3 : 2} />
        {!item.primary && <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>}
      </button>
    ))}
  </nav>
);
