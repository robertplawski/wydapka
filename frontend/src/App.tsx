import { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Budget, Spending, AppState, Language } from './lib/types';
import { translations, LANGUAGES } from './lib/i18n';

const STORAGE_KEY = 'wydapka-state';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wydapka-dark-mode');
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [state, setState] = useLocalStorage<AppState>(STORAGE_KEY, {
    isOnboarded: false,
    budget: null,
    spendings: [],
    language: 'en',
  });

  const language = state.language || 'en';
  const t = translations[language as Language] || translations.en;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('wydapka-dark-mode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleOnboardingComplete = (budget: Budget, spendings: Spending[]) => {
    setState({
      isOnboarded: true,
      budget,
      spendings,
      language: state.language || 'en',
    });
  };

  const handleAddSpending = (spending: Omit<Spending, 'id' | 'createdAt'>) => {
    const newSpending: Spending = {
      ...spending,
      id: `spending-${Date.now()}`,
      createdAt: Date.now(),
    };
    setState(prev => ({
      ...prev,
      spendings: [...prev.spendings, newSpending],
    }));
  };

  const handleDeleteSpending = (id: string) => {
    setState(prev => ({
      ...prev,
      spendings: prev.spendings.filter(s => s.id !== id),
    }));
  };

  const handleUpdateSpending = (id: string, updates: Partial<Omit<Spending, 'id' | 'createdAt'>>) => {
    setState(prev => ({
      ...prev,
      spendings: prev.spendings.map(s =>
        s.id === id ? { ...s, ...updates } : s
      ),
    }));
  };

  const handleReset = () => {
    setState({
      isOnboarded: false,
      budget: null,
      spendings: [],
      language: state.language,
    });
  };

  const handleLanguageChange = (lang: Language) => {
    setState(prev => ({ ...prev, language: lang }));
  };

  if (!state.isOnboarded || !state.budget) {
    return (
      <Onboarding
        onComplete={handleOnboardingComplete}
        t={t}
        languages={LANGUAGES}
        onLanguageChange={handleLanguageChange}
        initialLanguage={state.language}
      />
    );
  }

  return (
    <Dashboard
      budget={state.budget}
      spendings={state.spendings}
      onAddSpending={handleAddSpending}
      onDeleteSpending={handleDeleteSpending}
      onUpdateSpending={handleUpdateSpending}
      onReset={handleReset}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      t={t}
    />
  );
}

export default App;