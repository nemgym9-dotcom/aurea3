
/**
 * Utilitário que simula a interface do expo-secure-store para o ambiente web.
 * Em uma aplicação real no navegador, usamos localStorage (ou IndexedDB).
 * Para fins de demonstração, adicionamos uma camada de codificação simples.
 */

const SECURE_PREFIX = 'aura_secure_';

export const SecureStore = {
  setItemAsync: async (key: string, value: string): Promise<void> => {
    try {
      // Simula criptografia básica com base64 para o storage do navegador
      const encodedValue = btoa(value);
      localStorage.setItem(`${SECURE_PREFIX}${key}`, encodedValue);
    } catch (e) {
      console.error('Erro ao salvar no SecureStore:', e);
    }
  },

  getItemAsync: async (key: string): Promise<string | null> => {
    try {
      const value = localStorage.getItem(`${SECURE_PREFIX}${key}`);
      if (!value) return null;
      return atob(value);
    } catch (e) {
      console.error('Erro ao ler do SecureStore:', e);
      return null;
    }
  },

  deleteItemAsync: async (key: string): Promise<void> => {
    localStorage.removeItem(`${SECURE_PREFIX}${key}`);
  }
};

// Exportando como default também para facilitar imports flexíveis como solicitados
export default SecureStore;
