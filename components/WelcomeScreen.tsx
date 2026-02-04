
import React, { useState } from 'react';
import { ArrowRight, Lock, ChevronLeft } from 'lucide-react';
import { ThemeConfig } from '../types';

interface WelcomeScreenProps {
  onFinish: (salary: number, pin: string) => void;
  theme: ThemeConfig;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFinish, theme }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [tempSalary, setTempSalary] = useState('');
  const [pin, setPin] = useState('');

  const handleContinue = () => {
    if (step === 1) {
      const val = parseFloat(tempSalary);
      if (!tempSalary || isNaN(val) || val <= 0) return;
      setStep(2);
    } else {
      if (pin.length !== 4) return;
      onFinish(parseFloat(tempSalary), pin);
    }
  };

  const handlePinClick = (num: string) => {
    if (pin.length < 4) setPin(prev => prev + num);
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="w-full max-w-md space-y-12 text-center">
        <div className="space-y-4">
          <div 
            className="w-20 h-20 rounded-[28px] flex items-center justify-center text-white font-black text-4xl shadow-2xl mx-auto mb-8 animate-bounce"
            style={{ backgroundColor: theme.primary, boxShadow: `0 20px 40px -10px ${theme.shadow}` }}
          >
            {step === 1 ? 'Au' : <Lock size={32} />}
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            {step === 1 ? 'Organize seu dinheiro' : 'Crie seu PIN de acesso'}
          </h1>
          <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">
            {step === 1 ? 'Configure seu perfil em 1 minuto' : '4 dígitos para proteger seus dados'}
          </p>
        </div>

        {step === 1 ? (
          <div className="space-y-6 text-left">
            <div>
              <label className="block text-gray-500 mb-4 text-xs font-black uppercase tracking-[0.25em] ml-2">
                💰 Salário mensal (R$)
              </label>
              <div className="bg-[#121212] border-2 border-[#1c1c1c] p-6 rounded-[24px] transition-all shadow-xl">
                <input 
                  type="number" 
                  value={tempSalary} 
                  onChange={(e) => setTempSalary(e.target.value)}
                  className="w-full bg-transparent text-4xl font-black text-white outline-none"
                  style={{ caretColor: theme.primary }}
                  placeholder="0,00"
                  autoFocus
                />
              </div>
            </div>

            <button 
              onClick={handleContinue}
              className="w-full py-6 rounded-[24px] text-white font-black text-xl flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-2xl"
              style={{ backgroundColor: theme.primary, boxShadow: `0 20px 40px -10px ${theme.shadow}` }}
            >
              PRÓXIMO PASSO <ArrowRight size={24} />
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-center gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${pin.length > i ? 'bg-white border-white scale-125' : 'border-[#1c1c1c]'}`}
                  style={{ backgroundColor: pin.length > i ? theme.primary : undefined, borderColor: pin.length > i ? theme.primary : undefined }}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-[280px] mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handlePinClick(num.toString())}
                  className="w-16 h-16 rounded-full bg-[#121212] border border-[#1c1c1c] text-2xl font-black text-white hover:bg-[#1c1c1c] active:scale-90 transition-all"
                >
                  {num}
                </button>
              ))}
              <div />
              <button
                onClick={() => handlePinClick('0')}
                className="w-16 h-16 rounded-full bg-[#121212] border border-[#1c1c1c] text-2xl font-black text-white hover:bg-[#1c1c1c] active:scale-90 transition-all"
              >
                0
              </button>
              <button
                onClick={() => setPin(prev => prev.slice(0, -1))}
                className="w-16 h-16 rounded-full flex items-center justify-center text-gray-600 hover:text-white transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 py-5 rounded-[24px] bg-[#121212] border border-[#1c1c1c] text-gray-500 font-black text-xs uppercase tracking-widest"
              >
                VOLTAR
              </button>
              <button 
                onClick={handleContinue}
                disabled={pin.length !== 4}
                className="flex-[2] py-5 rounded-[24px] text-white font-black text-sm uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-2xl disabled:opacity-30"
                style={{ backgroundColor: theme.primary, boxShadow: `0 20px 40px -10px ${theme.shadow}` }}
              >
                CONFIRMAR PIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
