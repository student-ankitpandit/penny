import { COLORS } from '../constants/theme';

export const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: 'fast-food', color: COLORS.food, type: 'expense' },
  { id: 'transport', label: 'Transport', icon: 'car', color: COLORS.transport, type: 'expense' },
  { id: 'shopping', label: 'Shopping', icon: 'bag-handle', color: COLORS.shopping, type: 'expense' },
  { id: 'entertainment', label: 'Entertainment', icon: 'film', color: COLORS.entertainment, type: 'expense' },
  { id: 'bills', label: 'Bills & Utilities', icon: 'flash', color: COLORS.bills, type: 'expense' },
  { id: 'health', label: 'Health', icon: 'heart', color: COLORS.health, type: 'expense' },
  { id: 'education', label: 'Education', icon: 'school', color: COLORS.education, type: 'expense' },
  { id: 'travel', label: 'Travel', icon: 'airplane', color: COLORS.travel, type: 'expense' },
  { id: 'subscriptions', label: 'Subscriptions', icon: 'card', color: COLORS.accent, type: 'expense' },
  { id: 'other_expense', label: 'Other', icon: 'ellipsis-horizontal', color: COLORS.other, type: 'expense' },
];

export const INCOME_CATEGORIES = [
  { id: 'salary', label: 'Salary', icon: 'briefcase', color: COLORS.salary, type: 'income' },
  { id: 'investment', label: 'Investment', icon: 'trending-up', color: COLORS.investment, type: 'income' },
  { id: 'freelance', label: 'Freelance', icon: 'laptop', color: COLORS.accentLight, type: 'income' },
  { id: 'gift', label: 'Gift', icon: 'gift', color: COLORS.entertainment, type: 'income' },
  { id: 'other_income', label: 'Other', icon: 'wallet', color: COLORS.other, type: 'income' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
export const getCategoryById = (id) => ALL_CATEGORIES.find((c) => c.id === id);
export const getCategoryColor = (id) => { const c = getCategoryById(id); return c ? c.color : COLORS.other; };
export const getCategoryIcon = (id) => { const c = getCategoryById(id); return c ? c.icon : 'help-circle'; };
export const getCategoryLabel = (id) => { const c = getCategoryById(id); return c ? c.label : 'Unknown'; };
