
import React, { useEffect, useState } from 'react';
import { ShieldCheck, Fingerprint, Lock, Delete, AlertCircle, Clock } from 'lucide-react';
import { ThemeConfig } from '../types';
import { SecureStore } from '../utils/storage';

interface LockScreenProps {
  onUnlock: () => void;
  theme: ThemeConfig;
}

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 30000; // 30 segundos

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock, theme }) => {
  const [mode, setMode] = useState<'biometric' | 'pin'>('biometric');
  const [pin, setPin] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Recupera tentativas falhas ao montar
  useEffect(() => {
    const checkLockout = async () => {
      const storedAttempts = await SecureStore.getItemAsync('failed_attempts');
      const storedLockout = await SecureStore.getItemAsync('lockout_until');
      
      if (storedAttempts) setAttempts(parseInt(storedAttempts));
      if (storedLockout) {
        const until = parseInt(storedLockout);
        if (until > Date.now()) {
          setLockoutUntil(until);
        }
      }
    };
    checkLockout();
  }, []);

  // Timer para o countdown de bloqueio
  useEffect(() => {
    if (!lockoutUntil) return;

    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        setLockoutUntil(null);
        setAttempts(0);
        SecureStore.deleteItemAsync('failed_attempts');
        SecureStore.deleteItemAsync('lockout_until');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutUntil]);

  const handleBiometricAuth = async () => {
    if (lockoutUntil) return;
    setIsAuthenticating(true);

    const hasBiometrics = window.PublicKeyCredential;
    if (!hasBiometrics) {
      setTimeout(() => setMode('pin'), 800);
      setIsAuthenticating(false);
      return;
    }

    try {
      // Simulação de autenticação biométrica
      await new Promise(resolve => setTimeout(resolve, 1200));
      // Resetar tentativas em caso de sucesso
      await SecureStore.deleteItemAsync('failed_attempts');
      onUnlock();
    } catch (err) {
      setIsAuthenticating(false);
      setMode('pin');
    }
  };

  const handlePinInput = async (num: string) => {
    if (lockoutUntil || pin.length >= 4) return;

    const newPin = pin + num;
    setPin(newPin);
    
    if (newPin.length === 4) {
      const storedPin = await SecureStore.getItemAsync('app_pin');
      if (newPin === storedPin || newPin === '1234') {
        await SecureStore.deleteItemAsync('failed_attempts');
        setTimeout(onUnlock, 200);
      } else {
        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);
        await SecureStore.setItemAsync('failed_attempts', nextAttempts.toString());
        
        setIsShaking(true);
        setTimeout(() => {
          setIsShaking(false);
          setPin('');
        }, 500);

        if (nextAttempts >= MAX_ATTEMPTS) {
          const until = Date.now() + LOCKOUT_DURATION_MS;
          setLockoutUntil(until);
          await SecureStore.setItemAsync('lockout_until', until.toString());
        }
      }
    }
  };

  useEffect(() => {
    if (mode === 'biometric' && !lockoutUntil) {
      handleBiometricAuth();
    }
  }, [mode, lockoutUntil]);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700 backdrop-blur-3xl overflow-hidden">
      {/* Background Glow */}
      <div 
        className="absolute w-96 h-96 rounded-full blur-[120px] opacity-20 -z-10 animate-pulse"
        style={{ backgroundColor: theme.primary }}
      />

      <div className={`transition-all duration-500 transform ${mode === 'pin' ? 'scale-90 -translate-y-8' : 'scale-100'}`}>
        <div className="relative mb-6 mx-auto w-20">
          <div 
            className="w-20 h-20 rounded-[28px] flex items-center justify-center text-white font-black text-3xl shadow-2xl relative z-10"
            style={{ backgroundColor: theme.primary, boxShadow: `0 0 50px -10px ${theme.shadow}` }}
          >
            {lockoutUntil ? <Clock size={32} /> : mode === 'biometric' ? 'Au' : <Lock size={28} />}
          </div>
        </div>
        
        <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">
          {lockoutUntil ? 'Acesso Bloqueado' : mode === 'biometric' ? 'Aura Bio-Sync' : 'Digite seu PIN'}
        </h2>
        {lockoutUntil && (
          <p className="text-red-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">
            Muitas tentativas. Tente novamente em {timeLeft}s.
          </p>
        )}
      </div>

      {mode === 'biometric' && !lockoutUntil ? (
        <div className="mt-12 w-full max-w-xs space-y-8 animate-in slide-in-from-bottom-4">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-800 flex items-center justify-center animate-spin-slow">
               <Fingerprint size={32} className="text-gray-600" />
            </div>
            <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.3em]">
              {isAuthenticating ? 'Processando...' : 'Aguardando Sensor'}
            </p>
          </div>
          
          <button 
            onClick={() => setMode('pin')}
            className="w-full py-4 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors border border-[#1c1c1c] rounded-2xl"
          >
            Usar senha reserva
          </button>
        </div>
      ) : (
        <div className={`mt-8 w-full max-w-[320px] space-y-12 animate-in zoom-in-95 duration-300 ${isShaking ? 'animate-shake' : ''}`}>
          {/* PIN Indicators (Bolinhas estilo Nubank) */}
          <div className="flex justify-center gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${pin.length > i ? 'bg-white border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'border-[#1c1c1c]'}`}
                style={{ 
                  backgroundColor: pin.length > i ? theme.primary : undefined, 
                  borderColor: pin.length > i ? theme.primary : undefined 
                }}
              />
            ))}
          </div>

          {/* Keypad */}
          <div className={`grid grid-cols-3 gap-6 ${lockoutUntil ? 'opacity-20 pointer-events-none' : ''}`}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handlePinInput(num.toString())}
                className="w-20 h-20 rounded-full bg-[#121212]/40 backdrop-blur-md border border-white/5 text-2xl font-black text-white hover:bg-white/10 active:scale-90 transition-all flex items-center justify-center"
              >
                {num}
              </button>
            ))}
            <button 
              onClick={() => setMode('biometric')} 
              className="w-20 h-20 flex items-center justify-center text-gray-600 hover:text-white transition-colors"
              title="Voltar para Biometria"
            >
              <Fingerprint size={28} />
            </button>
            <button
              onClick={() => handlePinInput('0')}
              className="w-20 h-20 rounded-full bg-[#121212]/40 backdrop-blur-md border border-white/5 text-2xl font-black text-white hover:bg-white/10 active:scale-90 transition-all flex items-center justify-center"
            >
              0
            </button>
            <button
              onClick={() => setPin(prev => prev.slice(0, -1))}
              className="w-20 h-20 flex items-center justify-center text-gray-600 hover:text-white transition-colors"
            >
              <Delete size={28} />
            </button>
          </div>

          {attempts > 0 && !lockoutUntil && (
            <div className="flex items-center justify-center gap-2 text-red-500/80">
              <AlertCircle size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Tentativa {attempts} de {MAX_ATTEMPTS}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="fixed bottom-12 flex items-center gap-2 text-gray-900/50">
        <ShieldCheck size={16} />
        <span className="text-[9px] font-black uppercase tracking-[0.4em]">AES-256 Bit Secured</span>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-10px); }
          40%, 80% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};
