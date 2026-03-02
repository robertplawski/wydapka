import { useState, useEffect } from 'react';
import { CURRENCIES } from '../lib/types';
import type { Currency, Category, Budget, Spending, Language } from '../lib/types';
import type { Translations, LANGUAGES } from '../lib/i18n';
import { cn } from '../lib/utils';

interface OnboardingProps {
  onComplete: (budget: Budget, spendings: Spending[]) => void;
  t: Translations;
  languages: typeof LANGUAGES;
  onLanguageChange: (lang: Language) => void;
  initialLanguage: Language;
}

type Step = 'language' | 'budget' | 'categories' | 'savings';

const DEFAULT_CATEGORIES = [
  { name: 'Food', color: '#ef4444' },
  { name: 'Travel', color: '#3b82f6' },
  { name: 'Entertainment', color: '#8b5cf6' },
  { name: 'Shopping', color: '#ec4899' },
  { name: 'Bills', color: '#f59e0b' },
  { name: 'Other', color: '#6b7280' },
];

export function Onboarding({ onComplete, t, languages, onLanguageChange, initialLanguage }: OnboardingProps) {
  const [step, setStep] = useState<Step>('language');
  const [language, setLanguage] = useState<Language>(initialLanguage || 'en');
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [categories, setCategories] = useState<Category[]>(
    DEFAULT_CATEGORIES.map((cat, i) => ({
      id: `cat-${i}`,
      name: cat.name,
      budgetType: 'percentage' as const,
      budgetValue: 0,
      spent: 0,
      color: cat.color,
    }))
  );
  const [savingsType, setSavingsType] = useState<'percentage' | 'fixed'>('percentage');
  const [savingsValue, setSavingsValue] = useState('');

  useEffect(() => {
    onLanguageChange(language);
  }, [language]);

  const totalBudget = parseFloat(budget) || 0;

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setStep('budget');
  };

  const handleBudgetNext = () => {
    if (totalBudget > 0) {
      setStep('categories');
    }
  };

  const handleCategoryChange = (index: number, field: keyof Category, value: string | number) => {
    const newCategories = [...categories];
    if (field === 'budgetType') {
      newCategories[index] = { ...newCategories[index], budgetType: value as 'percentage' | 'fixed' };
    } else if (field === 'budgetValue') {
      newCategories[index] = { ...newCategories[index], budgetValue: parseFloat(value as string) || 0 };
    } else if (field === 'name') {
      newCategories[index] = { ...newCategories[index], name: value as string };
    }
    setCategories(newCategories);
  };

  const removeCategory = (index: number) => {
    if (categories.length > 1) {
      setCategories(categories.filter((_, i) => i !== index));
    }
  };

  const addCategory = () => {
    const colors = ['#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#6b7280', '#10b981', '#f97316'];
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: 'New Category',
      budgetType: 'percentage',
      budgetValue: 0,
      spent: 0,
      color: colors[categories.length % colors.length],
    };
    setCategories([...categories, newCategory]);
  };

  const getTotalAllocated = () => {
    return categories.reduce((sum, cat) => {
      if (cat.budgetType === 'percentage') {
        return sum + (totalBudget * cat.budgetValue / 100);
      }
      return sum + cat.budgetValue;
    }, 0);
  };

  const handleCategoriesNext = () => {
    setStep('savings');
  };

  const handleComplete = () => {
    const savingsAmount = savingsType === 'percentage'
      ? totalBudget * (parseFloat(savingsValue) || 0) / 100
      : parseFloat(savingsValue) || 0;

    const finalBudget: Budget = {
      total: totalBudget,
      currency,
      categories: categories.map(cat => ({
        ...cat,
        budgetValue: cat.budgetType === 'percentage'
          ? totalBudget * cat.budgetValue / 100
          : cat.budgetValue,
      })),
      savings: {
        budgetType: savingsType,
        budgetValue: savingsAmount,
      },
    };

    onComplete(finalBudget, []);
  };

  const allocated = getTotalAllocated();
  const remaining = totalBudget - allocated - (savingsType === 'percentage'
    ? totalBudget * (parseFloat(savingsValue) || 0) / 100
    : parseFloat(savingsValue) || 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Language step */}
          {step === 'language' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t.appTitle}</h1>
                <p className="text-gray-600 dark:text-gray-400">{t.appSubtitle}</p>
              </div>
              <h2 className="text-xl font-semibold mb-6 dark:text-white">Select Language</h2>
              <div className="space-y-3">
                {languages.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => handleLanguageSelect(lang.value as Language)}
                    className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-500 dark:text-white transition-colors"
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Budget step */}
          {step === 'budget' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 dark:text-white">{t.setBudget}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.weeklyBudget}
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder={t.enterWeeklyBudget}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.currency}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {CURRENCIES.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setCurrency(c.value)}
                        className={cn(
                          "px-4 py-3 rounded-lg border-2 transition-all",
                          currency === c.value
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                        )}
                      >
                        <span className="text-xl">{c.symbol}</span>
                        <span className="block text-xs">{c.value}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleBudgetNext}
                  disabled={!budget || parseFloat(budget) <= 0}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                >
                  {t.continue}
                </button>
              </div>
            </div>
          )}

          {/* Categories step */}
          {step === 'categories' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">{t.spendingCategories}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {t.allocateBudget}: {CURRENCIES.find(c => c.value === currency)?.symbol}{totalBudget.toFixed(2)}
              </p>

              <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4">
                {categories.map((category, index) => (
                  <div key={category.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
                        className="flex-1 font-medium dark:text-white border-b border-transparent focus:border-blue-500 outline-none"
                      />
                      {categories.length > 1 && (
                        <button
                          onClick={() => removeCategory(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={category.budgetType}
                        onChange={(e) => handleCategoryChange(index, 'budgetType', e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm"
                      >
                        <option value="percentage">{t.percentage}</option>
                        <option value="fixed">{t.fixedAmount}</option>
                      </select>
                      <input
                        type="number"
                        value={category.budgetValue || ''}
                        onChange={(e) => handleCategoryChange(index, 'budgetValue', e.target.value)}
                        placeholder={category.budgetType === 'percentage' ? '0' : '0.00'}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm"
                      />
                      <span className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                        {category.budgetType === 'percentage' ? '%' : CURRENCIES.find(c => c.value === currency)?.symbol}
                      </span>
                    </div>
                    {category.budgetType === 'percentage' && category.budgetValue > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        = {CURRENCIES.find(c => c.value === currency)?.symbol}{(totalBudget * category.budgetValue / 100).toFixed(2)}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addCategory}
                className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-gray-400 mb-4"
              >
                {t.addCategory}
              </button>

              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                <div className="flex justify-between text-sm">
                  <span className="dark:text-gray-300">{t.allocated}:</span>
                  <span className="font-medium dark:text-white">
                    {CURRENCIES.find(c => c.value === currency)?.symbol}{allocated.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="dark:text-gray-300">{t.remaining}:</span>
                  <span className={cn(
                    "font-medium",
                    remaining < 0 ? "text-red-600" : "text-green-600"
                  )}>
                    {CURRENCIES.find(c => c.value === currency)?.symbol}{remaining.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('budget')}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                >
                  {t.back}
                </button>
                <button
                  onClick={handleCategoriesNext}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  {t.continue}
                </button>
              </div>
            </div>
          )}

          {/* Savings step */}
          {step === 'savings' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 dark:text-white">{t.howMuchSave}</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.savingsTarget}
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={savingsType}
                      onChange={(e) => setSavingsType(e.target.value as 'percentage' | 'fixed')}
                      className="px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                    >
                      <option value="percentage">{t.percentage}</option>
                      <option value="fixed">{t.fixedAmount}</option>
                    </select>
                    <input
                      type="number"
                      value={savingsValue}
                      onChange={(e) => setSavingsValue(e.target.value)}
                      placeholder="0"
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <span className="flex items-center text-gray-500 dark:text-gray-400">
                      {savingsType === 'percentage' ? '%' : CURRENCIES.find(c => c.value === currency)?.symbol}
                    </span>
                  </div>
                </div>

                {savingsValue !== '' && parseFloat(savingsValue) >= 0 && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <p className="text-blue-800 dark:text-blue-300">
                      {t.savings}: {' '}
                      <span className="font-semibold">
                        {CURRENCIES.find(c => c.value === currency)?.symbol}
                        {savingsType === 'percentage'
                          ? (totalBudget * parseFloat(savingsValue) / 100).toFixed(2)
                          : parseFloat(savingsValue).toFixed(2)}
                      </span>
                      {' '}({savingsValue}{savingsType === 'percentage' ? '%' : ''}) {t.perWeek}
                    </p>
                  </div>
                )}

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium mb-2 dark:text-white">{t.budgetSummary}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t.totalBudget}:</span>
                      <span className="dark:text-white">{CURRENCIES.find(c => c.value === currency)?.symbol}{totalBudget.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t.categories}:</span>
                      <span className="dark:text-white">- {CURRENCIES.find(c => c.value === currency)?.symbol}{allocated.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t.savings}:</span>
                      <span className="dark:text-white">- {CURRENCIES.find(c => c.value === currency)?.symbol}
                        {savingsType === 'percentage'
                          ? (totalBudget * parseFloat(savingsValue || '0') / 100).toFixed(2)
                          : (parseFloat(savingsValue) || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2 mt-2">
                      <span className="dark:text-white">{t.unallocated}:</span>
                      <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {CURRENCIES.find(c => c.value === currency)?.symbol}{Math.max(0, remaining).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('categories')}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                >
                  {t.back}
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  {t.startTracking}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
