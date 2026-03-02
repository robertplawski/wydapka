export type Currency = 'EUR' | 'PLN' | 'USD' | 'GBP' | 'CZK';
export type Language = 'en' | 'pl' | 'pt';

export interface Category {
  id: string;
  name: string;
  budgetType: 'percentage' | 'fixed';
  budgetValue: number;
  spent: number;
  color: string;
}

export interface Spending {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  date: string;
  createdAt: number;
}

export interface Budget {
  total: number;
  currency: Currency;
  categories: Category[];
  savings: {
    budgetType: 'percentage' | 'fixed';
    budgetValue: number;
  };
}

export interface AppState {
  isOnboarded: boolean;
  budget: Budget | null;
  spendings: Spending[];
  language: Language;
}

export const DEFAULT_CATEGORIES = [
  { name: 'Food', color: '#ef4444' },
  { name: 'Travel', color: '#3b82f6' },
  { name: 'Entertainment', color: '#8b5cf6' },
  { name: 'Shopping', color: '#ec4899' },
  { name: 'Bills', color: '#f59e0b' },
  { name: 'Other', color: '#6b7280' },
];

export const CURRENCIES: { value: Currency; label: string; symbol: string }[] = [
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'PLN', label: 'Polish Zloty', symbol: 'zł' },
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'GBP', label: 'British Pound', symbol: '£' },
  { value: 'CZK', label: 'Czech Koruna', symbol: 'Kč' },
];