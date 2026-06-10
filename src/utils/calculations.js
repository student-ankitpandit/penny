import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';

export const getTotalIncome = (t) => t.filter((x) => x.type === 'income').reduce((s, x) => s + x.amount, 0);
export const getTotalExpense = (t) => t.filter((x) => x.type === 'expense').reduce((s, x) => s + x.amount, 0);
export const getBalance = (t) => getTotalIncome(t) - getTotalExpense(t);

export const filterByPeriod = (transactions, period) => {
  const now = new Date();
  let start, end;
  if (period === 'week') { start = startOfWeek(now, { weekStartsOn: 1 }); end = endOfWeek(now, { weekStartsOn: 1 }); }
  else if (period === 'month') { start = startOfMonth(now); end = endOfMonth(now); }
  else return transactions;
  return transactions.filter((t) => { const d = typeof t.date === 'string' ? parseISO(t.date) : new Date(t.date); return isWithinInterval(d, { start, end }); });
};

export const getMonthlyData = (transactions) => {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const monthTxns = transactions.filter((t) => { const date = typeof t.date === 'string' ? parseISO(t.date) : new Date(t.date); return isWithinInterval(date, { start: startOfMonth(d), end: endOfMonth(d) }); });
    return { label: d.toLocaleString('default', { month: 'short' }), income: getTotalIncome(monthTxns), expense: getTotalExpense(monthTxns) };
  });
};

export const getCategoryBreakdown = (transactions) => {
  const map = {};
  transactions.filter((t) => t.type === 'expense').forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount; });
  const total = Object.values(map).reduce((s, v) => s + v, 0);
  return Object.entries(map).map(([category, amount]) => ({ category, amount, percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : '0' })).sort((a, b) => b.amount - a.amount);
};

export const getMonthlySpendingByCategory = (transactions) => {
  const now = new Date(); const start = startOfMonth(now); const end = endOfMonth(now);
  const map = {};
  transactions.filter((t) => { const d = typeof t.date === 'string' ? parseISO(t.date) : new Date(t.date); return t.type === 'expense' && isWithinInterval(d, { start, end }); }).forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount; });
  return map;
};

export const formatAmount = (amount, currency = '₹') => `${currency}${Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
