
export type Route = 'Home' | 'AddExpense' | 'Investments' | 'History' | 'Settings';

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
}

export type InvestmentType = 'Ação' | 'FII' | 'Cripto' | 'Renda Fixa';

export interface Investment {
  id: string;
  name: string;
  type: InvestmentType;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
}

export interface ThemeConfig {
  primary: string;
  shadow: string;
  hover: string;
}

export interface NavigationProps {
  currentRoute: Route;
  onNavigate: (route: Route) => void;
  theme: ThemeConfig;
}
