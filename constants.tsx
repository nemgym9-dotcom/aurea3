
import { ThemeConfig } from './types';

export const THEMES: Record<string, ThemeConfig> = {
  bordeaux: {
    primary: '#63203d',
    shadow: 'rgba(99, 32, 61, 0.4)',
    hover: '#4d192f'
  },
  emerald: {
    primary: '#064e3b',
    shadow: 'rgba(6, 78, 59, 0.4)',
    hover: '#065f46'
  }
};

export const CATEGORIES = [
  { name: 'Alimentação', icon: '🍔' },
  { name: 'Transporte', icon: '🚗' },
  { name: 'Streaming', icon: '📺' },
  { name: 'Saúde', icon: '🏥' },
  { name: 'Educação', icon: '📚' },
  { name: 'Lazer', icon: '🎨' },
  { name: 'Contas', icon: '💸' }
];
