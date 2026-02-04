
import React, { useState, useEffect } from 'react';
import { Palette, Shield, Bell, User, ChevronRight, LogOut, Trash2, Key, Check, X } from 'lucide-react';
import { ThemeConfig } from '../types';
import { SecureStore } from '../utils/storage';

interface SettingsScreenProps {
  theme: ThemeConfig;
  toggleTheme: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ theme, toggleTheme }) => {
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [pinStep, setPinStep] = useState<'old' | 'new' | 'confirm'>('old');
  const [tempOldPin, setTempOldPin] = useState('');
  const [tempNewPin, setTempNewPin] = useState('');
  const [tempConfirmPin, setTempConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isAutoTheme, setIsAutoTheme] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const auto = await SecureStore.getItemAsync('auto_theme');
      setIsAutoTheme(auto === 'true');
    };
    loadSettings();
  }, []);

  const handleResetData = async () => {
    if (confirm('Tem certeza que deseja apagar todos os dados e resetar a conta? Esta ação não pode ser desfeita.')) {
      const keys = ['user_salary', 'user_theme', 'is_configured', 'app_pin', 'failed_attempts', 'lockout_until', 'auto_theme'];
      for (const key of keys) {
        await SecureStore.deleteItemAsync(key);
      }
      window.location.reload();
    }
  };

  const handlePinChange = async () => {
    if (pinStep === 'old') {
      const stored = await SecureStore.getItemAsync('app_pin');
      if (tempOldPin === stored || tempOldPin === '1234') {
        setPinStep('new');
        setPinError('');
      } else {
        setPinError('PIN atual incorreto');
      }
    } else if (pinStep === 'new') {
      if (tempNewPin.length === 4) {
        setPinStep('confirm');
        setPinError('');
      } else {
        setPinError('PIN deve ter 4 dígitos');
      }
    } else {
      if (tempNewPin === tempConfirmPin) {
        await SecureStore.setItemAsync('app_pin', tempNewPin);
        setIsChangingPin(false);
        setPinStep('old');
        setTempOldPin('');
        setTempNewPin('');
        setTempConfirmPin('');
        alert('PIN alterado com sucesso!');
      } else {
        setPinError('PINs não coincidem');
      }
    }
  };

  const toggleAutoTheme = async () => {
    const newValue = !isAutoTheme;
    setIsAutoTheme(newValue);
    await SecureStore.setItemAsync('auto_theme', newValue.toString());
  };

  const sections = [
    { icon: Palette, label: 'Aparência', action: toggleTheme, value: 'Trocar Tema' },
    { icon: Key, label: 'Segurança', action: () => setIsChangingPin(true), value: 'Alterar PIN' },
    { icon: User, label: 'Perfil', action: () => {}, value: 'Editar' },
    { icon: Bell, label: 'Notificações', action: () => {}, value: 'Ativas' },
  ];

  if (isChangingPin) {
    return (
      <div className="animate-in slide-in-from-right-4 duration-500 space-y-8 pb-20">
        <div className="bg-[#121212] p-10 rounded-[40px] border border-[#1c1c1c] shadow-2xl space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Alterar PIN</h3>
            <button onClick={() => setIsChangingPin(false)} className="text-gray-500 hover:text-white"><X size={24}/></button>
          </div>

          <div className="space-y-6">
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">
              {pinStep === 'old' ? 'Digite o PIN atual' : 
               pinStep === 'new' ? 'Digite o novo PIN de 4 dígitos' : 
               'Confirme o novo PIN'}
            </p>

            <input 
              type="password"
              maxLength={4}
              value={pinStep === 'old' ? tempOldPin : pinStep === 'new' ? tempNewPin : tempConfirmPin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                if (pinStep === 'old') setTempOldPin(val);
                else if (pinStep === 'new') setTempNewPin(val);
                else setTempConfirmPin(val);
              }}
              className="w-full bg-black border-2 border-[#1c1c1c] text-white p-6 rounded-[24px] outline-none font-black text-4xl text-center tracking-[1em]"
              style={{ caretColor: theme.primary }}
              autoFocus
            />

            {pinError && <p className="text-red-500 text-[10px] font-black uppercase text-center">{pinError}</p>}

            <button 
              onClick={handlePinChange}
              className="w-full py-6 rounded-[24px] text-white font-black text-sm uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-2xl"
              style={{ backgroundColor: theme.primary }}
            >
              {pinStep === 'confirm' ? 'Confirmar Novo PIN' : 'Continuar'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8 pb-20">
      <div className="bg-[#121212] rounded-[40px] border border-[#1c1c1c] overflow-hidden shadow-2xl">
        {sections.map((section, idx) => (
          <button 
            key={section.label}
            onClick={section.action}
            className={`w-full flex items-center justify-between p-8 hover:bg-white/5 transition-colors border-b border-[#1c1c1c] last:border-0`}
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-gray-400">
                <section.icon size={24} style={{ color: section.label === 'Aparência' || section.label === 'Segurança' ? theme.primary : undefined }} />
              </div>
              <span className="text-xl font-black text-white italic uppercase tracking-tighter">{section.label}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{section.value}</span>
              <ChevronRight size={20} className="text-gray-700" />
            </div>
          </button>
        ))}

        <div className="p-8 border-t border-[#1c1c1c] flex items-center justify-between">
           <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-gray-400">
                <Shield size={24} className="text-blue-500" />
              </div>
              <div>
                <span className="text-xl font-black text-white italic uppercase tracking-tighter block">Tema Automático</span>
                <span className="text-[10px] font-bold text-gray-600 uppercase">Segue o sistema</span>
              </div>
           </div>
           <button 
             onClick={toggleAutoTheme}
             className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${isAutoTheme ? 'bg-green-500' : 'bg-gray-800'}`}
           >
              <div className={`w-6 h-6 bg-white rounded-full transition-all ${isAutoTheme ? 'translate-x-6' : 'translate-x-0'}`} />
           </button>
        </div>
      </div>

      <div className="p-10 bg-[#0a0a0a] border border-[#1c1c1c] rounded-[40px] space-y-8 shadow-xl">
        <div className="text-center">
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] mb-6 text-center">Gestão de Dados</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
               className="w-full py-5 bg-[#121212] text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1c1c1c] transition-colors border border-[#1c1c1c] flex items-center justify-center gap-2"
               onClick={() => window.location.reload()}
            >
              <LogOut size={16} /> Logout da Sessão
            </button>
            <button 
               className="w-full py-5 bg-red-900/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
               onClick={handleResetData}
            >
              <Trash2 size={16} /> Apagar Tudo
            </button>
          </div>
        </div>
        
        <p className="text-[9px] font-black text-gray-800 uppercase tracking-[0.6em] text-center">Aura Finance Premium v1.0.8</p>
      </div>
    </div>
  );
};
