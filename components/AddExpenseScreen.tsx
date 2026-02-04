
import React, { useState } from 'react';
import { Lightbulb, CheckCircle2 } from 'lucide-react';
import { ThemeConfig, Expense, Route } from '../types';
import { CATEGORIES } from '../constants';

interface AddExpenseScreenProps {
  onAdd: (expense: Expense) => void;
  onNavigate: (route: Route) => void;
  theme: ThemeConfig;
}

export const AddExpenseScreen: React.FC<AddExpenseScreenProps> = ({ onAdd, onNavigate, theme }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].name);

  const handleSave = () => {
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) return;
    onAdd({ 
      id: Math.random().toString(36).substring(2, 9),
      amount: val, 
      category, 
      date: new Date().toISOString() 
    });
    onNavigate('History');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-20">
      <div className="bg-[#121212] p-10 rounded-[40px] shadow-sm border border-[#1c1c1c]">
        <div className="space-y-10">
          <div>
            <label className="block text-gray-500 mb-4 text-xs font-black uppercase tracking-[0.25em]">Valor do gasto</label>
            <div className="flex items-center border-b-2 border-[#1c1c1c] focus-within:border-white transition-colors pb-2">
              <span className="text-3xl font-black mr-2" style={{ color: theme.primary }}>R$</span>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent text-5xl font-black text-white outline-none"
                style={{ caretColor: theme.primary }}
                placeholder="0,00"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-500 mb-4 text-xs font-black uppercase tracking-[0.25em]">Categoria</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-4 border-b-2 border-[#1c1c1c] bg-[#121212] text-xl font-bold text-white outline-none transition-colors focus:border-white"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.name} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-5 rounded-[24px] text-white font-black text-lg text-center mt-6 hover:brightness-110 active:scale-[0.98] transition-all shadow-2xl"
            style={{ backgroundColor: theme.primary, boxShadow: `0 15px 30px -5px ${theme.shadow}` }}
          >
            CONFIRMAR GASTO
          </button>
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-[#1c1c1c] rounded-[40px] p-8 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500">
            <Lightbulb size={28} />
          </div>
          <div>
            <h3 className="text-white font-black text-lg">Como dividir o salário 💰</h3>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Regra simples e realista</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#121212] p-5 rounded-3xl border border-green-500/20">
            <h4 className="text-green-500 font-black text-xl mb-1">50%</h4>
            <p className="text-white font-bold text-sm mb-3">Essenciais</p>
            <ul className="text-gray-500 text-[10px] space-y-1 font-medium uppercase tracking-wider">
              <li>• Aluguel</li>
              <li>• Comida</li>
              <li>• Contas / Transporte</li>
            </ul>
          </div>
          <div className="bg-[#121212] p-5 rounded-3xl border border-blue-500/20">
            <h4 className="text-blue-500 font-black text-xl mb-1">30%</h4>
            <p className="text-white font-bold text-sm mb-3">Estilo de Vida</p>
            <ul className="text-gray-500 text-[10px] space-y-1 font-medium uppercase tracking-wider">
              <li>• Lazer</li>
              <li>• Streaming</li>
              <li>• Compras</li>
            </ul>
          </div>
          <div className="bg-[#121212] p-5 rounded-3xl border border-white/10">
            <h4 className="font-black text-xl mb-1" style={{ color: theme.primary }}>20%</h4>
            <p className="text-white font-bold text-sm mb-3">Investimento</p>
            <ul className="text-gray-500 text-[10px] space-y-1 font-medium uppercase tracking-wider">
              <li>• Reserva</li>
              <li>• FIIs / Ações</li>
            </ul>
          </div>
        </div>

        <div className="bg-red-900/10 p-5 rounded-2xl border border-red-500/10 flex items-start gap-3">
          <CheckCircle2 size={18} className="mt-0.5" style={{ color: theme.primary }} />
          <p className="text-gray-400 text-xs leading-relaxed italic">
            👉 <span className="text-white font-bold">Dica Aura:</span> Se o salário for apertado, tente 60/20/20. O importante é o hábito.
          </p>
        </div>
      </div>
    </div>
  );
};
