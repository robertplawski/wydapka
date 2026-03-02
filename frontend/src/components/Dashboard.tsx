import { useState } from 'react';
import { CURRENCIES } from '../lib/types';
import type { Budget, Spending } from '../lib/types';
import type { Translations } from '../lib/i18n';
import { cn, getToday, getDateFromDayOfWeek } from '../lib/utils';
import { Plus, X, TrendingUp, TrendingDown, Moon, Sun, Pencil, Trash2, Settings } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Mon' },
  { value: 1, label: 'Tue' },
  { value: 2, label: 'Wed' },
  { value: 3, label: 'Thu' },
  { value: 4, label: 'Fri' },
  { value: 5, label: 'Sat' },
  { value: 6, label: 'Sun' },
];

interface DashboardProps {
  budget: Budget;
  spendings: Spending[];
  onAddSpending: (spending: Omit<Spending, 'id' | 'createdAt'>) => void;
  onDeleteSpending: (id: string) => void;
  onUpdateSpending: (id: string, updates: Partial<Omit<Spending, 'id' | 'createdAt'>>) => void;
  onReset: () => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  t: Translations;
}

export function Dashboard({
  budget,
  spendings,
  onAddSpending,
  onDeleteSpending,
  onUpdateSpending,
  onReset,
  darkMode,
  setDarkMode,
  t,
}: DashboardProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingSpending, setEditingSpending] = useState<Spending | null>(null);
  const today = getToday();

  const todaySpendings = spendings.filter(s => s.date === today);
  const todayTotal = todaySpendings.reduce((sum, s) => sum + s.amount, 0);

  const getCategorySpent = (categoryId: string) => {
    return spendings
      .filter(s => s.categoryId === categoryId)
      .reduce((sum, s) => sum + s.amount, 0);
  };

  const categoryData = budget.categories.map(cat => ({
    name: cat.name,
    value: getCategorySpent(cat.id),
    budget: typeof cat.budgetValue === 'number' ? cat.budgetValue : 0,
    color: cat.color,
  }));

  const totalSpent = categoryData.reduce((sum, cat) => sum + cat.value, 0);

  const currencySymbol = CURRENCIES.find(c => c.value === budget.currency)?.symbol || '€';
  const dailyBudget = budget.total / 7;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-bold dark:text-white">WYDAPKA</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {darkMode ? <Sun className="w-5 h-5 dark:text-white" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Settings className="w-5 h-5 dark:text-white" />
              </button>
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.todayBudget}</p>
              <p className="text-2xl font-bold dark:text-white">{currencySymbol}{dailyBudget.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.spentToday}</p>
              <p className={cn("text-2xl font-bold", todayTotal > dailyBudget ? "text-red-600" : "text-green-600")}>
                {currencySymbol}{todayTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Today's spending chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <h2 className="font-semibold mb-4 dark:text-white">{t.todaySpending}</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Budget', value: dailyBudget },
                { name: 'Spent', value: todayTotal },
              ]}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#888" />
                <YAxis tick={{ fontSize: 12 }} stroke="#888" />
                <Tooltip formatter={(value) => `${currencySymbol}${(value as number).toFixed(2)}`} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {todayTotal > dailyBudget && (
            <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>{t.exceededBudget}</span>
            </div>
          )}
          {todayTotal <= dailyBudget && todayTotal > 0 && (
            <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-400 text-sm">
              <TrendingDown className="w-4 h-4" />
              <span>{currencySymbol}{(dailyBudget - todayTotal).toFixed(2)} {t.remainingForToday}</span>
            </div>
          )}
        </div>

        {/* Category breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <h2 className="font-semibold mb-4 dark:text-white">{t.spendingByCategory}</h2>
          {totalSpent > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData.filter(c => c.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                  >
                    {categoryData.filter(c => c.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${currencySymbol}${(value as number).toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400">
              No spending data yet
            </div>
          )}

          <div className="space-y-2 mt-4">
            {categoryData.map(cat => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm dark:text-gray-200">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium dark:text-white">{currencySymbol}{cat.value.toFixed(2)}</span>
                  <span className="text-xs text-gray-400">/ {currencySymbol}{cat.budget.toFixed(0)}</span>
                </div>
              </div>
            ))}
          </div>

          {totalSpent > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t.totalSpent}</span>
                <span className="font-semibold dark:text-white">{currencySymbol}{totalSpent.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-gray-600 dark:text-gray-400">{t.budgetRemaining}</span>
                <span className={cn("font-semibold", budget.total - totalSpent < 0 ? "text-red-600" : "text-green-600")}>
                  {currencySymbol}{(budget.total - totalSpent).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Recent spendings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <h2 className="font-semibold mb-4 dark:text-white">{t.recentSpendings}</h2>
          {spendings.length > 0 ? (
            <div className="space-y-3">
              {[...spendings]
                .sort((a, b) => b.createdAt - a.createdAt)
                .slice(0, 10)
                .map(spending => {
                  const category = budget.categories.find(c => c.id === spending.categoryId);
                  return (
                    <div key={spending.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="w-2 h-8 rounded-full"
                          style={{ backgroundColor: category?.color || '#6b7280' }}
                        />
                        <div className="flex-1">
                          <p className="font-medium dark:text-white">{spending.name || category?.name || 'Spending'}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(spending.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold dark:text-white">-{currencySymbol}{spending.amount.toFixed(2)}</span>
                        <button
                          onClick={() => setEditingSpending(spending)}
                          className="p-1 text-gray-400 hover:text-blue-500"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteSpending(spending.id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              {t.noSpendingsYet}
            </div>
          )}
        </div>
      </div>

      {/* Floating add button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add spending modal */}
      {showAddModal && (
        <AddSpendingModal
          categories={budget.categories}
          currency={currencySymbol}
          onClose={() => setShowAddModal(false)}
          onAdd={onAddSpending}
          t={t}
        />
      )}

      {/* Edit spending modal */}
      {editingSpending && (
        <AddSpendingModal
          categories={budget.categories}
          currency={currencySymbol}
          editingSpending={editingSpending}
          onClose={() => setEditingSpending(null)}
          onAdd={(spending) => {
            onUpdateSpending(editingSpending.id, spending);
            setEditingSpending(null);
          }}
          t={t}
        />
      )}

      {/* Settings modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-xl w-full sm:max-w-md p-6 animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold dark:text-white">{t.settings}</h2>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowSettings(false);
                  onReset();
                }}
                className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
              >
                {t.resetApp}
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {t.resetWarning}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface AddSpendingModalProps {
  categories: Budget['categories'];
  currency: string;
  editingSpending?: Spending | null;
  onClose: () => void;
  onAdd: (spending: Omit<Spending, 'id' | 'createdAt'>) => void;
  t: Translations;
}

function AddSpendingModal({ categories, currency, editingSpending, onClose, onAdd, t }: AddSpendingModalProps) {
  const [name, setName] = useState(editingSpending?.name || '');
  const [amount, setAmount] = useState(editingSpending?.amount.toString() || '');
  const [categoryId, setCategoryId] = useState(editingSpending?.categoryId || categories[0]?.id || '');
  const [selectedDay, setSelectedDay] = useState(() => {
    if (editingSpending?.date) {
      const date = new Date(editingSpending.date);
      return date.getDay() === 0 ? 6 : date.getDay() - 1;
    }
    const today = new Date();
    return today.getDay() === 0 ? 6 : today.getDay() - 1;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    onAdd({
      name,
      amount: parseFloat(amount),
      categoryId,
      date: getDateFromDayOfWeek(selectedDay),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-xl w-full sm:max-w-md p-6 animate-in slide-in-from-bottom duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold dark:text-white">
            {editingSpending ? t.editSpending : t.addSpending}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.dayOfWeek}</label>
            <div className="grid grid-cols-7 gap-1">
              {DAYS_OF_WEEK.map(day => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => setSelectedDay(day.value)}
                  className={cn(
                    "px-2 py-2 rounded-lg border-2 transition-all text-xs font-medium",
                    selectedDay === day.value
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 dark:text-gray-300"
                  )}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.amount}</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={currency + "0.00"}
              autoFocus
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.category}</label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={cn(
                    "px-3 py-2 rounded-lg border-2 transition-all text-sm",
                    categoryId === cat.id
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="dark:text-white">{cat.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.name} (optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.whatDidYouSpendOn}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
          >
            {editingSpending ? t.updateSpending : t.addSpending}
          </button>
        </form>
      </div>
    </div>
  );
}
