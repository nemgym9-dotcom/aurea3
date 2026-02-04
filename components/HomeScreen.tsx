
import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, Tooltip, Legend
} from 'recharts';
import { PlusCircle, TrendingUp as InvestmentIcon } from 'lucide-react';
import { ThemeConfig, Route, Expense } from '../types';

interface HomeScreenProps {
  onNavigate: (route: Route) => void;
  expenses: Expense[];
  isVisible: boolean;
  salary: number;
  theme: ThemeConfig;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, expenses, isVisible, salary, theme }) => {
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const balance = salary - totalSpent;
  
  const COLORS = [theme.primary, '#2ECC71', '#F1C40F', '#E74C3C', '#3498DB', '#9B59B6'];

  const categorySummary = expenses.reduce((acc: any, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const pieData = Object.keys(categorySummary).map(key => ({ name: key, value: categorySummary[key] }));

  const barData = [
    { name: 'Seg', valor: 120 },
    { name: 'Ter', valor: 450 },
    { name: 'Qua', valor: 300 },
    { name: 'Qui', valor: totalSpent > 500 ? totalSpent / 2 : 150 },
    { name: 'Sex', valor: 550 },
    { name: 'Sáb', valor: 200 },
    { name: 'Dom', valor: 100 },
  ];

  const formatValue = (val: number) => isVisible ? `R$ ${val.toLocaleString('pt-BR')}` : '••••';

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#121212] p-8 rounded-[32px] border border-[#1c1c1c] shadow-sm">
          <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] mb-3">Salário</p>
          <h2 className="text-3xl font-black text-white tracking-tight">
            {formatValue(salary)}
          </h2>
        </div>
        <div className="p-8 rounded-[32px] text-white shadow-2xl" style={{ backgroundColor: theme.primary, boxShadow: `0 20px 40px -10px ${theme.shadow}` }}>
          <p className="text-white/70 text-xs font-black uppercase tracking-[0.2em] mb-3">Saldo Atual</p>
          <h2 className="text-3xl font-black tracking-tight">
            {formatValue(balance)}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#121212] p-8 rounded-[32px] border border-[#1c1c1c] shadow-sm">
          <h3 className="text-gray-400 font-black text-xs mb-8 uppercase tracking-[0.2em]">Distribuição</h3>
          <div className="h-64">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1c1c1c', border: 'none', borderRadius: '16px', color: '#fff' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-600 text-xs font-bold uppercase tracking-widest">
                Nenhum dado para exibir
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#121212] p-8 rounded-[32px] border border-[#1c1c1c] shadow-sm">
          <h3 className="text-gray-400 font-black text-xs mb-8 uppercase tracking-[0.2em]">Gastos Semanais</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#4a4a4a'}} />
                <Tooltip cursor={{fill: '#1c1c1c'}} contentStyle={{ backgroundColor: '#1c1c1c', border: 'none', borderRadius: '16px', color: '#fff' }} />
                <Bar dataKey="valor" fill={theme.primary} radius={[8, 8, 8, 8]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-6 pb-12">
        <button 
          onClick={() => onNavigate('AddExpense')}
          className="w-full py-5 text-white rounded-[24px] font-black text-lg shadow-xl transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-3"
          style={{ backgroundColor: theme.primary, boxShadow: `0 15px 30px -5px ${theme.shadow}` }}
        >
          <PlusCircle size={22} /> ADICIONAR GASTO
        </button>

        <button 
          onClick={() => onNavigate('Investments')}
          className="w-full py-5 bg-[#121212] border border-[#1c1c1c] text-gray-300 rounded-[24px] font-bold hover:bg-[#1c1c1c] transition-all flex items-center justify-center gap-3"
        >
          <InvestmentIcon size={22} style={{ color: theme.primary }} /> INVESTIMENTOS
        </button>
      </div>
    </div>
  );
};
