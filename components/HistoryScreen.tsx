
import React, { useState, useMemo } from 'react';
import { History as HistoryIcon } from 'lucide-react';
import { Expense, ThemeConfig } from '../types';
import { CATEGORIES } from '../constants';

interface HistoryScreenProps {
  expenses: Expense[];
  isVisible: boolean;
  theme: ThemeConfig;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ expenses, isVisible, theme }) => {
  const [categoryFilter, setCategoryFilter] = useState('Todos');

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      return categoryFilter === 'Todos' || exp.category === categoryFilter;
    });
  }, [expenses, categoryFilter]);

  const getIcon = (category: string) => {
    return CATEGORIES.find(c => c.name === category)?.icon || '💰';
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[140px]">
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Filtro de Categoria</label>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-[#121212] border border-[#1c1c1c] text-white px-4 py-3 rounded-xl appearance-none outline-none text-sm font-bold focus:border-white transition-colors"
          >
            <option value="Todos">Todas</option>
            {CATEGORIES.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((exp) => (
            <div key={exp.id} className="bg-[#121212] p-5 rounded-3xl border border-[#1c1c1c] flex items-center justify-between shadow-sm hover:border-gray-700 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                  {getIcon(exp.category)}
                </div>
                <div>
                  <h4 className="text-white font-bold text-base">{exp.category}</h4>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                    {new Date(exp.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-black text-lg">
                  {isVisible ? `R$ ${exp.amount.toLocaleString('pt-BR')}` : '••••'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-[#121212] rounded-[32px] border border-[#1c1c1c]">
            <HistoryIcon size={48} className="text-gray-800 mx-auto mb-4" />
            <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Nenhum registro encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};
