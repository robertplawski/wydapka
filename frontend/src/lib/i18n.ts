export type Language = 'en' | 'pl' | 'pt';

export interface Translations {
  // Onboarding
  appTitle: string;
  appSubtitle: string;
  setBudget: string;
  weeklyBudget: string;
  enterWeeklyBudget: string;
  currency: string;
  continue: string;
  back: string;
  spendingCategories: string;
  allocateBudget: string;
  percentage: string;
  fixedAmount: string;
  addCategory: string;
  allocated: string;
  remaining: string;
  howMuchSave: string;
  savingsTarget: string;
  perWeek: string;
  budgetSummary: string;
  totalBudget: string;
  categories: string;
  savings: string;
  unallocated: string;
  startTracking: string;

  // Dashboard
  todayBudget: string;
  spentToday: string;
  todaySpending: string;
  exceededBudget: string;
  remainingForToday: string;
  spendingByCategory: string;
  totalSpent: string;
  budgetRemaining: string;
  recentSpendings: string;
  noSpendingsYet: string;
  settings: string;
  resetApp: string;
  startOver: string;
  resetWarning: string;

  // Spending modal
  addSpending: string;
  editSpending: string;
  amount: string;
  category: string;
  name: string;
  whatDidYouSpendOn: string;
  updateSpending: string;

  // Mobile prompt
  openOnMobile: string;
  dontShowAgain: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'WYDAPKA',
    appSubtitle: 'Manage your personal budget',
    setBudget: 'Set your budget',
    weeklyBudget: 'Weekly Budget',
    enterWeeklyBudget: 'Enter your weekly budget',
    currency: 'Currency',
    continue: 'Continue',
    back: 'Back',
    spendingCategories: 'Spending categories',
    allocateBudget: 'Allocate your budget',
    percentage: 'Percentage',
    fixedAmount: 'Fixed amount',
    addCategory: '+ Add category',
    allocated: 'Allocated',
    remaining: 'Remaining',
    howMuchSave: 'How much do you want to save?',
    savingsTarget: 'Savings target',
    perWeek: 'per week',
    budgetSummary: 'Budget Summary',
    totalBudget: 'Total budget',
    categories: 'Categories',
    savings: 'Savings',
    unallocated: 'Unallocated',
    startTracking: 'Start Tracking',
    todayBudget: "Today's budget",
    spentToday: 'Spent today',
    todaySpending: "Today's Spending",
    exceededBudget: "You've exceeded your daily budget!",
    remainingForToday: 'remaining for today',
    spendingByCategory: 'Spending by Category',
    totalSpent: 'Total spent',
    budgetRemaining: 'Budget remaining',
    recentSpendings: 'Recent Spendings',
    noSpendingsYet: "No spendings yet. Tap + to add one!",
    settings: 'Settings',
    resetApp: 'Reset App (Start Over)',
    startOver: 'Start Over',
    resetWarning: 'This will clear all your data and start the onboarding process again.',
    addSpending: 'Add Spending',
    editSpending: 'Edit Spending',
    amount: 'Amount',
    category: 'Category',
    name: 'Name',
    whatDidYouSpendOn: 'What did you spend on?',
    updateSpending: 'Update Spending',
    openOnMobile: 'Open on Mobile',
    dontShowAgain: "Don't show again",
  },
  pl: {
    appTitle: 'WYDAPKA',
    appSubtitle: 'Zarządzaj swoim budżetem',
    setBudget: 'Ustaw budżet',
    weeklyBudget: 'Budżet tygodniowy',
    enterWeeklyBudget: 'Wpisz swój budżet tygodniowy',
    currency: 'Waluta',
    continue: 'Kontynuuj',
    back: 'Wstecz',
    spendingCategories: 'Kategorie wydatków',
    allocateBudget: 'Przydziel budżet',
    percentage: 'Procent',
    fixedAmount: 'Kwota stała',
    addCategory: '+ Dodaj kategorię',
    allocated: 'Przydzielone',
    remaining: 'Pozostałe',
    howMuchSave: 'Ile chcesz zaoszczędzić?',
    savingsTarget: 'Cel oszczędnościowy',
    perWeek: 'tygodniowo',
    budgetSummary: 'Podsumowanie budżetu',
    totalBudget: 'Całkowity budżet',
    categories: 'Kategorie',
    savings: 'Oszczędności',
    unallocated: 'Nieprzydzielone',
    startTracking: 'Zacznij śledzić',
    todayBudget: 'Dzienny budżet',
    spentToday: 'Wydane dziś',
    todaySpending: 'Dzisiejsze wydatki',
    exceededBudget: 'Przekroczyłeś dzienny budżet!',
    remainingForToday: 'pozostałe na dziś',
    spendingByCategory: 'Wydatki według kategorii',
    totalSpent: 'Wydane łącznie',
    budgetRemaining: 'Pozostały budżet',
    recentSpendings: 'Ostatnie wydatki',
    noSpendingsYet: 'Brak wydatków. Kliknij + aby dodać!',
    settings: 'Ustawienia',
    resetApp: 'Zresetuj aplikację',
    startOver: 'Zacznij od nowa',
    resetWarning: 'To usunie wszystkie dane i rozpocznie proces konfiguracji od nowa.',
    addSpending: 'Dodaj wydatek',
    editSpending: 'Edytuj wydatek',
    amount: 'Kwota',
    category: 'Kategoria',
    name: 'Nazwa',
    whatDidYouSpendOn: 'Na co wydałeś?',
    updateSpending: 'Aktualizuj wydatek',
    openOnMobile: 'Otwórz na telefonie',
    dontShowAgain: 'Nie pokazuj ponownie',
  },
  pt: {
    appTitle: 'WYDAPKA',
    appSubtitle: 'Gerencie seu orçamento pessoal',
    setBudget: 'Defina seu orçamento',
    weeklyBudget: 'Orçamento Semanal',
    enterWeeklyBudget: 'Digite seu orçamento semanal',
    currency: 'Moeda',
    continue: 'Continuar',
    back: 'Voltar',
    spendingCategories: 'Categorias de gastos',
    allocateBudget: 'Allocate seu orçamento',
    percentage: 'Porcentagem',
    fixedAmount: 'Valor fixo',
    addCategory: '+ Adicionar categoria',
    allocated: 'Alocado',
    remaining: 'Restante',
    howMuchSave: 'Quanto você quer economizar?',
    savingsTarget: 'Meta de economia',
    perWeek: 'por semana',
    budgetSummary: 'Resumo do Orçamento',
    totalBudget: 'Orçamento total',
    categories: 'Categorias',
    savings: 'Economia',
    unallocated: 'Não alocado',
    startTracking: 'Começar a rastrear',
    todayBudget: 'Orçamento de hoje',
    spentToday: 'Gasto hoje',
    todaySpending: 'Gastos de hoje',
    exceededBudget: 'Você excedeu seu orçamento diário!',
    remainingForToday: 'restante para hoje',
    spendingByCategory: 'Gastos por Categoria',
    totalSpent: 'Total gasto',
    budgetRemaining: 'Orçamento restante',
    recentSpendings: 'Gastos Recentes',
    noSpendingsYet: 'Sem gastos ainda. Toque + para adicionar!',
    settings: 'Configurações',
    resetApp: 'Redefinir aplicativo',
    startOver: 'Recomeçar',
    resetWarning: 'Isso limpará todos os dados e inicie o processo de configuração novamente.',
    addSpending: 'Adicionar Gasto',
    editSpending: 'Editar Gasto',
    amount: 'Valor',
    category: 'Categoria',
    name: 'Nome',
    whatDidYouSpendOn: 'No que você gastou?',
    updateSpending: 'Atualizar Gasto',
    openOnMobile: 'Abrir no celular',
    dontShowAgain: 'Não mostrar novamente',
  },
};

export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'pl', label: 'Polski' },
  { value: 'pt', label: 'Português' },
] as const;