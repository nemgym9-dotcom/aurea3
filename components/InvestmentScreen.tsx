
import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Trash2, ArrowRight, 
  ChevronLeft, Edit3, Calendar, Hash, DollarSign, Layers
} from 'lucide-react';
import { ThemeConfig, Investment, InvestmentType } from '../types';

interface InvestmentScreenProps {
  investments: Investment[];
  onAdd: (inv: Investment) => void;
  onRemove: (id: string) => void;
  isVisible: boolean;
  theme: ThemeConfig;
}

const TABS: InvestmentType[] = ['Ação', 'FII', 'Cripto', 'Renda Fixa'];

const getEmoji = (type: InvestmentType) => {
  switch (type) {
    case 'Ação': return '📊';
    case 'FII': return '🏢';
    case 'Cripto': return '₿';
    case 'Renda Fixa': return '🏦';
    default: return '💰';
  }
};

export const InvestmentScreen: React.FC<InvestmentScreenProps> = ({ investments, onAdd, onRemove, isVisible, theme }) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<InvestmentType>('Ação');
  
  // Form states
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);

  const selectedAsset = useMemo(() => 
    investments.find(inv => inv.id === selectedAssetId), 
    [investments, selectedAssetId]
  );

  const handleSave = () => {
    if (!name || !quantity || !purchasePrice) return;
    const q = parseFloat(quantity);
    const p = parseFloat(purchasePrice);
    
    onAdd({ 
      id: Math.random().toString(36).substring(2, 9),
      name: name.toUpperCase(),
      type: activeType,
      quantity: q,
      purchasePrice: p,
      currentPrice: p * (1 + (Math.random() * 0.15 - 0.05)), // Simulated current price
      purchaseDate: purchaseDate
    });

    setName('');
    setQuantity('');
    setPurchasePrice('');
  };

  // 📄 4. Tela: Detalhes do Ativo
  if (selectedAsset) {
    const totalInvested = selectedAsset.quantity * selectedAsset.purchasePrice;
    const currentValue = selectedAsset.quantity * selectedAsset.currentPrice;
    const profitLoss = currentValue - totalInvested;
    const profitPercent = (profitLoss / totalInvested) * 100;

    const evolutionData = [
      { date: 'Jan', val: selectedAsset.purchasePrice },
      { date: 'Fev', val: selectedAsset.purchasePrice * 1.05 },
      { date: 'Mar', val: selectedAsset.purchasePrice * 1.02 },
      { date: 'Abr', val: selectedAsset.currentPrice },
    ];

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8 pb-20">
        <div className="flex justify-between items-center bg-[#121212] p-6 rounded-[32px] border border-[#1c1c1c] shadow-xl">
          <button onClick={() => setSelectedAssetId(null)} className="p-3 bg-black rounded-2xl text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{selectedAsset.type}</p>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">
              {getEmoji(selectedAsset.type)} {selectedAsset.name}
            </h3>
          </div>
          <div className="flex gap-2">
            <button className="p-3 bg-black rounded-2xl text-gray-600 hover:text-blue-500 transition-colors">
              <Edit3 size={20} />
            </button>
            <button 
              onClick={() => { onRemove(selectedAsset.id); setSelectedAssetId(null); }}
              className="p-3 bg-black rounded-2xl text-gray-600 hover:text-red-500 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-[#121212] p-6 rounded-[24px] border border-[#1c1c1c]">
            <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Quantidade</p>
            <p className="text-xl font-black text-white">{selectedAsset.quantity}</p>
          </div>
          <div className="bg-[#121212] p-6 rounded-[24px] border border-[#1c1c1c]">
            <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Preço Médio</p>
            <p className="text-xl font-black text-white">R$ {selectedAsset.purchasePrice.toLocaleString('pt-BR')}</p>
          </div>
          <div className="bg-[#121212] p-6 rounded-[24px] border border-[#1c1c1c]">
            <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Valor Atual</p>
            <p className="text-xl font-black text-white">R$ {selectedAsset.currentPrice.toLocaleString('pt-BR')}</p>
          </div>
          <div className="bg-[#121212] p-6 rounded-[24px] border border-[#1c1c1c]">
            <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Total Investido</p>
            <p className="text-xl font-black text-white">R$ {totalInvested.toLocaleString('pt-BR')}</p>
          </div>
          <div className="bg-[#121212] p-6 rounded-[24px] border border-[#1c1c1c] md:col-span-2">
            <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Lucro/Prejuízo</p>
            <p className={`text-xl font-black ${profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              R$ {profitLoss.toLocaleString('pt-BR')} ({profitPercent.toFixed(2)}%)
            </p>
          </div>
        </div>

        <div className="bg-[#121212] p-8 rounded-[40px] border border-[#1c1c1c]">
          <h3 className="text-gray-400 font-black text-xs mb-8 uppercase tracking-[0.2em]">Evolução do ativo</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#4a4a4a', fontSize: 12}} />
                <YAxis hide />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1c1c1c', border: 'none', borderRadius: '16px', color: '#fff' }}
                  itemStyle={{ color: theme.primary }}
                />
                <Line 
                  type="monotone" 
                  dataKey="val" 
                  stroke={theme.primary} 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: theme.primary, strokeWidth: 2, stroke: '#000' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-10 pb-20">
      {/* 🔝 Topo */}
      <div className="flex justify-between items-center bg-[#0a0a0a] p-6 rounded-[32px] border border-[#1c1c1c] shadow-xl">
        <h3 className="text-2xl font-black text-white tracking-tighter italic uppercase">
          Adicionar investimento
        </h3>
        <button 
           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
           className="px-6 py-2 bg-[#121212] border border-[#1c1c1c] rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all"
        >
          🔝 Topo
        </button>
      </div>

      {/* 🧾 Formulário */}
      <div className="space-y-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`flex-1 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeType === t ? 'border-transparent text-white' : 'border-[#1c1c1c] text-gray-500'}`}
              style={{ backgroundColor: activeType === t ? theme.primary : '#121212' }}
            >
              {getEmoji(t)} {t}
            </button>
          ))}
        </div>

        <div className="bg-[#121212] p-10 rounded-[40px] border border-[#1c1c1c] shadow-2xl space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <Hash size={12} /> Ativo (ex: PETR4, BTC)
              </label>
              <input 
                type="text"
                placeholder="TICKER"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-[#1c1c1c] text-white p-6 rounded-[20px] outline-none font-black text-2xl uppercase tracking-tighter transition-all focus:border-white"
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <Layers size={12} /> Quantidade
              </label>
              <input 
                type="number"
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-black border border-[#1c1c1c] text-white p-6 rounded-[20px] outline-none font-black text-2xl transition-all focus:border-white"
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <DollarSign size={12} /> Preço de compra
              </label>
              <input 
                type="number"
                placeholder="0,00"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className="w-full bg-black border border-[#1c1c1c] text-white p-6 rounded-[20px] outline-none font-black text-2xl transition-all focus:border-white"
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <Calendar size={12} /> Data da compra
              </label>
              <input 
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full bg-black border border-[#1c1c1c] text-white p-6 rounded-[20px] outline-none font-black text-lg transition-all focus:border-white"
              />
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-6 rounded-[24px] text-white font-black text-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-2xl flex items-center justify-center gap-3"
            style={{ backgroundColor: theme.primary, boxShadow: `0 20px 40px -10px ${theme.shadow}` }}
          >
            ✅ Salvar investimento <ArrowRight size={24} />
          </button>
        </div>
      </div>

      {/* Meus Ativos (Lista) */}
      <div className="space-y-6">
        <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] ml-2">Meus Ativos Registrados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {investments.map((item) => {
            const val = item.quantity * item.currentPrice;
            const cost = item.quantity * item.purchasePrice;
            const profit = val - cost;
            const profitPct = (profit / cost) * 100;

            return (
              <div 
                key={item.id} 
                onClick={() => setSelectedAssetId(item.id)}
                className="bg-[#121212] p-6 rounded-[28px] border border-[#1c1c1c] flex items-center justify-between group hover:border-gray-600 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                    {getEmoji(item.type)}
                  </div>
                  <div>
                    <h4 className="text-white font-black text-lg italic uppercase tracking-tighter">{item.name}</h4>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{item.quantity} Cotas • {item.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-black text-xl">
                    {isVisible ? `R$ ${val.toLocaleString('pt-BR')}` : '••••'}
                  </p>
                  <div className={`flex items-center justify-end gap-1 text-[10px] font-black ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                     {profit >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                     {profitPct.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
